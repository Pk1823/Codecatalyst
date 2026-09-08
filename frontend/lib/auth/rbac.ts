import { NextResponse } from "next/server";
import { UserRole } from "@/types/auth";
import { getSession, SessionPayload } from "./jwt";

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AuthError";
  }
}

/**
 * Ensures the request is authenticated with an active session.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new AuthError("Authentication required. Please sign in.", 401);
  }
  return session;
}

/**
 * Ensures the authenticated user has one of the allowed roles.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<SessionPayload> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new AuthError(
      `Forbidden: Your role (${session.role}) does not have permission for this resource. Required: [${allowedRoles.join(", ")}]`,
      403
    );
  }
  return session;
}

/**
 * Enforces data privacy boundary:
 * - PERSONNEL can ONLY view their own records.
 * - COMMANDER receives aggregated data; denied direct individual voluntary responses.
 * - WELFARE_OFFICER can view authorized welfare indicators.
 * - ADMIN manages users/units.
 */
export function canAccessPersonnel(session: SessionPayload, targetPersonnelId: string): boolean {
  if (session.role === "ADMIN" || session.role === "WELFARE_OFFICER" || session.role === "COMMANDER") {
    return true;
  }
  if (session.role === "PERSONNEL") {
    return session.personnelId?.toUpperCase() === targetPersonnelId.toUpperCase();
  }
  return false;
}

/**
 * Standard error response helper for route handlers.
 */
export function handleAuthError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: error.message, code: error.statusCode === 401 ? "UNAUTHORIZED" : "FORBIDDEN" },
      { status: error.statusCode }
    );
  }
  console.error("[API_ERROR]:", error);
  return NextResponse.json(
    { error: "Internal server error occurred." },
    { status: 500 }
  );
}
