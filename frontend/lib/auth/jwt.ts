import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { UserRole } from "@/types/auth";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "missionwell-defense-jwt-secret-key-super-secure-32chars"
);

export const SESSION_COOKIE_NAME = "missionwell_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  serviceId: string;
  role: UserRole;
  force: string;
  personnelId?: string;
  rank?: string;
  unitId?: string;
  avatarUrl?: string;
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

export const DEFAULT_DEV_SESSION: SessionPayload = {
  userId: "user-doc-02",
  email: "dr.sharma.aarti@crpf.gov.in",
  name: "Dr. Aarti Sharma",
  serviceId: "MED-DIR-0881",
  role: "WELFARE_OFFICER",
  force: "CRPF",
  rank: "Chief Medical Officer (SG)",
  unitId: "unit-114-hq",
};

export async function getSession(): Promise<SessionPayload | null> {
  try {
    let token: string | undefined;

    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      // Cookies not accessible
    }

    if (!token) {
      try {
        const headerStore = await headers();
        const authHeader = headerStore.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.substring(7).trim();
        }
      } catch {
        // Headers not accessible
      }
    }

    if (token) {
      const verified = await verifySessionToken(token);
      if (verified) return verified;

      // Check persona tokens
      if (token.startsWith("persona-jwt-") || token.startsWith("demo-token-") || token.startsWith("google-jwt-")) {
        if (token.includes("doc") || token.includes("welfare") || token.includes("aarti")) {
          return DEFAULT_DEV_SESSION;
        }
        if (token.includes("co") || token.includes("cmd") || token.includes("commander")) {
          return {
            userId: "user-co-03",
            email: "col.singh.vikram@crpf.gov.in",
            name: "Col. Vikram Singh",
            serviceId: "CMD-SECTOR-01",
            role: "COMMANDER",
            force: "CRPF",
            rank: "Commandant (114 Bn)",
            unitId: "unit-114-hq",
          };
        }
        if (token.includes("adm")) {
          return {
            userId: "user-adm-04",
            email: "patel.rk@nic.in",
            name: "Sh. R.K. Patel",
            serviceId: "NIC-SYS-9940",
            role: "ADMIN",
            force: "CRPF",
            rank: "Senior Systems Director (NIC)",
            unitId: "unit-114-hq",
          };
        }
        return {
          userId: "user-jawan-01",
          email: "piyush.kumar@crpf.gov.in",
          name: "Ct. Piyush Kumar",
          serviceId: "CRPF-GD-2021-04128",
          role: "PERSONNEL",
          force: "CRPF",
          personnelId: "P-1024",
          rank: "Constable (GD)",
          unitId: "unit-114-alpha",
        };
      }
    }

    // In development mode, default to Welfare Officer so dashboard and cases load smoothly
    if (process.env.NODE_ENV !== "production") {
      return DEFAULT_DEV_SESSION;
    }

    return null;
  } catch {
    return process.env.NODE_ENV !== "production" ? DEFAULT_DEV_SESSION : null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};
