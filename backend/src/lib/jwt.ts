import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "missionwell-defense-jwt-secret-key-super-secure-32chars"
);

export const SESSION_COOKIE_NAME = "missionwell_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  serviceId: string;
  role: "PERSONNEL" | "WELFARE_OFFICER" | "COMMANDER" | "ADMIN";
  force: string;
  personnelId?: string;
  rank?: string;
  unitId?: string;
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
