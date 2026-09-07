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
    // Default to Welfare Officer for rich first-impression demo experience
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
}
