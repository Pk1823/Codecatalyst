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

  /**
   * Authenticate against backend/database using Service ID or Email + Password
   */
  static async loginWithCredentials(
    identifier: string,
    password: string,
    role?: UserRole,
    force?: string
  ): Promise<User> {
    const isEmail = identifier.includes("@");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        serviceId: !isEmail ? identifier.trim() : undefined,
        email: isEmail ? identifier.trim() : undefined,
        password: password.trim(),
        isQuickDemo: false,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success || !data.user) {
      throw new Error(data.error || "Authentication failed: Please verify your credentials.");
    }

    const user: User = data.user;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event("missionwell_auth_changed"));
    }
    return user;
  }

  /**
   * Authenticate or Auto-Register using Gmail / Google or other custom account
   */
  static async loginWithGoogle(
    email: string,
    name?: string,
    role?: UserRole,
    force?: string
  ): Promise<User> {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        name: name?.trim(),
        role: role || "WELFARE_OFFICER",
        force: force || "CRPF",
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success || !data.user) {
      throw new Error(data.error || "Google sign-in failed. Please try again.");
    }

    const user: User = data.user;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem("user", JSON.stringify(user));
      if (data.token) localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("missionwell_auth_changed"));
    }
    return user;
  }

  /**
   * Authenticate using Google OAuth 2.0 ID Token or One-Tap Credential
   */
  static async loginWithGoogleOAuthToken(
    idTokenOrCredential: string,
    role?: UserRole,
    force?: string
  ): Promise<User> {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken: idTokenOrCredential,
        credential: idTokenOrCredential,
        role: role || "WELFARE_OFFICER",
        force: force || "CRPF",
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success || !data.user) {
      throw new Error(data.error || "Google ID Token authentication failed.");
    }

    const user: User = data.user;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem("user", JSON.stringify(user));
      if (data.token) localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("missionwell_auth_changed"));
    }
    return user;
  }

  /**
   * Fetch official Google OAuth 2.0 Consent URL
   */
  static async getGoogleOAuthUrl(
    role?: UserRole,
    force?: string,
    customClientId?: string
  ): Promise<{ url: string; isConfigured: boolean; clientId?: string }> {
    const params = new URLSearchParams({
      role: role || "WELFARE_OFFICER",
      force: force || "CRPF",
    });
    if (customClientId) {
      params.set("clientId", customClientId);
    }
    const res = await fetch(`/api/auth/google/url?${params.toString()}`);
    const data = await res.json();
    if (!res.ok || !data.url) {
      throw new Error(data.error || "Failed to retrieve Google OAuth authorization URL");
    }
    return {
      url: data.url,
      isConfigured: !!data.isConfigured,
      clientId: data.clientId,
    };
  }

  /**
   * Fetch runtime Google OAuth Client ID configuration
   */
  static async getGoogleConfig(): Promise<{ clientId: string; isConfigured: boolean }> {
    try {
      const res = await fetch("/api/auth/google/config");
      if (res.ok) {
        const data = await res.json();
        return { clientId: data.clientId || "", isConfigured: !!data.isConfigured };
      }
    } catch {}
    return { clientId: "", isConfigured: false };
  }

  /**
   * Save official Google Client ID to runtime and .env.local
   */
  static async saveGoogleClientId(clientId: string): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/google/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * 1-Click Evaluation Persona sign-in connected to database & session cookie
   */
  static async loginWithPersona(role: UserRole, force?: string): Promise<User> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          isQuickDemo: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const user: User = data.user;
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            window.dispatchEvent(new Event("missionwell_auth_changed"));
          }
          return user;
        }
      }
    } catch (e) {
      console.warn("Persona database login notice, using fallback:", e);
    }

    return this.login(role);
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("missionwell_auth_changed"));
      fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
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
      pathname === "/settings" ||
      pathname.startsWith("/auth")
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
