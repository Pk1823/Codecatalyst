export type UserRole = "PERSONNEL" | "WELFARE_OFFICER" | "COMMANDER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rank?: string;
  unit?: string;
  personnelId?: string;
  avatarUrl?: string;
  department?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}
