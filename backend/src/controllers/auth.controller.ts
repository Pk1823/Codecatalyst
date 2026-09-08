import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { SESSION_COOKIE_NAME } from "../lib/jwt";
import { AuditService } from "../services/audit.service";

export class AuthController {
  /**
   * POST /api/auth/login
   * Authenticate user by Service ID or Email and Password
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { role, email, serviceId, password } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress;

      const { token, user } = await AuthService.login(
        role,
        serviceId || email,
        password,
        ipAddress
      );

      res.cookie(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ success: true, user, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Login failed" });
    }
  }

  /**
   * POST /api/auth/google
   * Authenticate or auto-provision account via Google/Gmail or custom external email
   */
  static async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, role, force } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress;

      const { token, user } = await AuthService.loginWithGoogleOrEmail({
        email,
        name,
        role,
        force,
        ipAddress,
      });

      res.cookie(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ success: true, user, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Google authentication failed" });
    }
  }

  /**
   * POST /api/auth/logout
   * Invalidate session cookie and record audit event
   */
  static async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (req.user) {
        await AuditService.log({
          actorId: req.user.userId,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: "USER_LOGOUT",
          resource: "User",
          resourceId: req.user.userId,
          ipAddress: req.ip || req.socket.remoteAddress,
        });
      }

      res.clearCookie(SESSION_COOKIE_NAME);
      res.json({ success: true, message: "Logged out successfully" });
    } catch {
      res.status(500).json({ error: "Logout failed" });
    }
  }

  /**
   * GET /api/auth/session
   * Return verified session claims
   */
  static getSession(req: AuthenticatedRequest, res: Response): void {
    res.json({ authenticated: true, user: req.user });
  }
}
