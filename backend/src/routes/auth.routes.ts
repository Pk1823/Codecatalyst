import { Router, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { authenticate, AuthenticatedRequest } from "../middleware/auth.middleware";
import { SESSION_COOKIE_NAME } from "../lib/jwt";
import { AuditService } from "../services/audit.service";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { role, email, serviceId, password } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress;

    const { token, user } = await AuthService.login(role, serviceId || email, password, ipAddress);

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
});

router.post("/google", async (req: Request, res: Response) => {
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
});

router.post("/logout", authenticate, async (req: AuthenticatedRequest, res: Response) => {
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
  } catch (err) {
    res.status(500).json({ error: "Logout failed" });
  }
});

router.get("/session", authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.json({ authenticated: true, user: req.user });
});

export default router;
