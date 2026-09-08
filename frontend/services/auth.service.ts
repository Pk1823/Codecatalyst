import { User, UserRole } from "@/types/auth";
import { MOCK_USERS } from "@/lib/mock-data/users";

const STORAGE_KEY = "missionwell_auth_user";

export class AuthService {
  static getCurrentUser(): User {
    if (typeof window === "undefined") {
      return MOCK_USERS.welfare; // default server-side fallback
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return MOCK_USERS.welfare;
  }

  static getCurrentRole(): UserRole {
    return this.getCurrentUser().role;
  }

  static login(role: UserRole): User {
    let selectedUser = MOCK_USERS.welfare;
    if (role === "PERSONNEL") selectedUser = MOCK_USERS.personnel;
    else if (role === "WELFARE_OFFICER") selectedUser = MOCK_USERS.welfare;
    else if (role === "COMMANDER") selectedUser = MOCK_USERS.commander;
    else if (role === "ADMIN") selectedUser = MOCK_USERS.admin;

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedUser));
      window.dispatchEvent(new Event("missionwell_auth_changed"));
    }
    return selectedUser;
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("missionwell_auth_changed"));
    }
  }

  static getRedirectPathForRole(role: UserRole): string {
    switch (role) {
      case "PERSONNEL":
        return "/personnel";
      case "WELFARE_OFFICER":
        return "/welfare";
      case "COMMANDER":
        return "/commander";
      case "ADMIN":
        return "/admin";
      default:
        return "/welfare";
    }
  }

  /**
   * Strict Role-Based Access Control (RBAC) Matrix
   * Prevents unauthorized access across Welfare Officers, Commanders, Soldiers, and Admins.
   */
  static isRouteAllowed(role: UserRole, pathname: string): { allowed: boolean; reason?: string } {
    // Universal routes accessible to everyone
    if (
      pathname === "/" ||
      pathname === "/login" ||
      pathname === "/settings"
    ) {
      return { allowed: true };
    }

    if (role === "PERSONNEL") {
      if (pathname.startsWith("/personnel")) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: "Access Restricted: Personnel can only access their personal self-care portal, voluntary assessments, and support requests.",
      };
    }

    if (role === "COMMANDER") {
      if (
        pathname === "/commander" ||
        pathname.startsWith("/reports") ||
        pathname.startsWith("/privacy") ||
        pathname.startsWith("/audit")
      ) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: "Access Restricted under DPDP Act 2023: Individual clinical risk attributions and psychological cases are strictly protected from tactical commanders to prevent APAR career appraisal prejudice.",
      };
    }

    if (role === "WELFARE_OFFICER") {
      if (
        pathname.startsWith("/welfare") ||
        pathname.startsWith("/analytics") ||
        pathname.startsWith("/alerts") ||
        pathname.startsWith("/interventions") ||
        pathname.startsWith("/recommendations") ||
        pathname.startsWith("/reports") ||
        pathname.startsWith("/privacy") ||
        pathname.startsWith("/audit")
      ) {
        return { allowed: true };
      }
      if (pathname.startsWith("/commander")) {
        return {
          allowed: false,
          reason: "Access Restricted: Commander tactical operations portal is designated for unit leadership.",
        };
      }
      return { allowed: true };
    }

    if (role === "ADMIN") {
      if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/audit") ||
        pathname.startsWith("/privacy") ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/reports")
      ) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: "Access Restricted: Direct medical/welfare casework requires authorized Welfare Officer credentials.",
      };
    }

    return { allowed: true };
  }
}
