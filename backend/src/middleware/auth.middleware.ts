import { Request, Response, NextFunction } from "express";
import { verifySessionToken, SessionPayload, SESSION_COOKIE_NAME } from "../lib/jwt";

export interface AuthenticatedRequest extends Request {
  user?: SessionPayload;
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token = req.cookies?.[SESSION_COOKIE_NAME];

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }

    if (!token) {
      res.status(401).json({
        error: "Authentication required. Please log in.",
        code: "UNAUTHORIZED",
      });
      return;
    }

    const payload = await verifySessionToken(token);
    if (!payload) {
      res.status(401).json({
        error: "Invalid or expired session. Please log in again.",
        code: "SESSION_EXPIRED",
      });
      return;
    }

    req.user = payload;
    next();
  } catch (err) {
    res.status(500).json({ error: "Authentication processing failed" });
  }
}

export function authorizeRoles(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required.", code: "UNAUTHORIZED" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Forbidden: Your role (${req.user.role}) is not authorized for this resource. Required: [${allowedRoles.join(", ")}]`,
        code: "FORBIDDEN",
      });
      return;
    }

    next();
  };
}

export function canAccessPersonnel(session: SessionPayload, targetPersonnelId: string): boolean {
  if (session.role === "ADMIN" || session.role === "WELFARE_OFFICER" || session.role === "COMMANDER") {
    return true;
  }
  if (session.role === "PERSONNEL") {
    return session.personnelId?.toUpperCase() === targetPersonnelId.toUpperCase();
  }
  return false;
}
