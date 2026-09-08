import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { GoogleAuthService } from "../services/google-auth.service";
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
   * GET /api/auth/google/url
   * Generate official Google OAuth 2.0 consent URL
   */
  static getGoogleUrl(req: Request, res: Response): void {
    try {
      const { role, force, redirectUri, state } = req.query;
      const data = GoogleAuthService.getAuthorizationUrl({
        role: role as string,
        force: force as string,
        redirectUri: redirectUri as string,
        state: state as string,
      });
      res.json({ success: true, ...data });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to generate Google OAuth URL" });
    }
  }

  /**
   * GET or POST /api/auth/google/callback
   * Exchange Google OAuth code for user profile and issue authenticated session
   */
  static async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      const code = (req.query.code || req.body.code) as string;
      const stateParam = (req.query.state || req.body.state) as string;
      const redirectUri = (req.query.redirect_uri || req.body.redirect_uri) as string;
      const ipAddress = req.ip || req.socket.remoteAddress;

      if (!code) {
        res.status(400).json({ error: "Missing authorization code from Google" });
        return;
      }

      let parsedState: any = {};
      if (stateParam) {
        try {
          const jsonStr = Buffer.from(stateParam, "base64url").toString("utf-8");
          parsedState = JSON.parse(jsonStr);
        } catch {
          // ignore parsing error
        }
      }

      const role = parsedState.role || req.body.role || "WELFARE_OFFICER";
      const force = parsedState.force || req.body.force || "CRPF";

      const profile = await GoogleAuthService.exchangeCodeForProfile(code, redirectUri);
      const { token, user } = await GoogleAuthService.authenticateGoogleProfile(profile, {
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

      // If browser GET redirect, redirect to frontend callback handler
      if (req.method === "GET") {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        res.redirect(`${frontendUrl}/auth/callback?token=${token}&role=${user.role}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
        return;
      }

      res.json({ success: true, user, token });
    } catch (error: any) {
      if (req.method === "GET") {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error.message || "Google OAuth failed")}`);
        return;
      }
      res.status(400).json({ error: error.message || "Google OAuth callback failed" });
    }
  }

  /**
   * POST /api/auth/google
   * Authenticate or auto-provision account via Google OAuth token, Code, or Gmail account
   */
  static async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { idToken, credential, code, email, name, role, force } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress;

      let authResult: { token: string; user: any };

      // 1. If Google ID Token / One-Tap Credential provided
      if (credential || idToken) {
        const rawToken = credential || idToken;
        const profile = await GoogleAuthService.verifyIdToken(rawToken);
        authResult = await GoogleAuthService.authenticateGoogleProfile(profile, {
          role,
          force,
          ipAddress,
        });
      }
      // 2. If Google Authorization Code provided
      else if (code) {
        const profile = await GoogleAuthService.exchangeCodeForProfile(code);
        authResult = await GoogleAuthService.authenticateGoogleProfile(profile, {
          role,
          force,
          ipAddress,
        });
      }
      // 3. Fallback: Authenticate or auto-provision by verified email address
      else if (email) {
        authResult = await AuthService.loginWithGoogleOrEmail({
          email,
          name,
          role,
          force,
          ipAddress,
        });
      } else {
        res.status(400).json({ error: "Either Google ID token, OAuth code, or email must be provided." });
        return;
      }

      res.cookie(SESSION_COOKIE_NAME, authResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ success: true, user: authResult.user, token: authResult.token });
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
