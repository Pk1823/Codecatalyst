import { Router, Response } from "express";
import { authenticate, authorizeRoles, AuthenticatedRequest } from "../middleware/auth.middleware";
import { WelfareService } from "../services/welfare.service";
import { prisma } from "../lib/db";

const router = Router();

router.get("/alerts", authenticate, authorizeRoles(["WELFARE_OFFICER", "COMMANDER", "ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const severity = req.query.severity as string | undefined;
    const status = req.query.status as string | undefined;
    const alerts = await WelfareService.getAlerts(severity, status);
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

router.patch("/alerts/:id", authenticate, authorizeRoles(["WELFARE_OFFICER", "ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: "Missing required field: status." });
      return;
    }
    const ipAddress = req.ip || req.socket.remoteAddress;
    const updated = await WelfareService.updateAlert(req.params.id, req.user!, status, ipAddress);
    res.json({ success: true, alert: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update alert" });
  }
});

router.get("/notifications", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: req.user!.role === "ADMIN" ? undefined : { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.patch("/notifications/:id/read", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });

    if (!notification) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    if (notification.userId !== req.user!.userId && req.user!.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden", code: "FORBIDDEN" });
      return;
    }

    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });

    res.json({ success: true, notification: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notification read" });
  }
});

export default router;
