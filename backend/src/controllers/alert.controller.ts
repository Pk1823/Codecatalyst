import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { WelfareService } from "../services/welfare.service";
import { prisma } from "../lib/db";

export class AlertController {
  /**
   * GET /api/alerts
   * Early warnings & risk threshold crossings
   */
  static async getAlerts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const severity = req.query.severity as string | undefined;
      const status = req.query.status as string | undefined;
      const alerts = await WelfareService.getAlerts(severity, status);
      res.json({ alerts });
    } catch {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  }

  /**
   * PATCH /api/alerts/:id
   * Update alert status (e.g. ACKNOWLEDGED, RESOLVED)
   */
  static async updateAlert(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      if (!status) {
        res.status(400).json({ error: "Missing required field: status." });
        return;
      }
      const ipAddress = req.ip || req.socket.remoteAddress;
      const updated = await WelfareService.updateAlert(
        req.params.id,
        req.user!,
        status,
        ipAddress
      );
      res.json({ success: true, alert: updated });
    } catch {
      res.status(500).json({ error: "Failed to update alert" });
    }
  }

  /**
   * GET /api/notifications
   * User in-app notifications
   */
  static async getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const notifications = await prisma.notification.findMany({
        where: req.user!.role === "ADMIN" ? undefined : { userId: req.user!.userId },
        orderBy: { createdAt: "desc" },
        take: 30,
      });
      res.json({ notifications });
    } catch {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  }

  /**
   * PATCH /api/notifications/:id/read
   * Mark individual notification as read
   */
  static async markNotificationRead(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    } catch {
      res.status(500).json({ error: "Failed to mark notification read" });
    }
  }
}
