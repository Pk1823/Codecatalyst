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
   * POST /api/alerts
   * Create new alert / early warning
   */
  static async createAlert(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const body = req.body;
      const personnelId = (body.personnelId || req.user?.personnelId || "P-1024").toUpperCase();
      const personnel = await prisma.personnel.findUnique({
        where: { id: personnelId },
        include: { unit: true },
      });

      const severity = body.severity || "HIGH";
      const reason =
        body.reason ||
        `Army personnel flagged at ${severity} BREAKDOWN RISK (${body.riskScore || 75}/100). Severe operational fatigue & acute stress.`;
      const triggerCondition = body.triggerCondition || "MANUAL_OR_TELEMETRY_ALERT";

      const earlyWarning = await prisma.earlyWarning.create({
        data: {
          personnelId: personnel?.id || personnelId,
          unitId: personnel?.unitId,
          severity,
          reason,
          triggerCondition,
          status: "NEW",
        },
        include: {
          personnel: {
            select: { id: true, name: true, rank: true, force: true, baseLocation: true },
          },
        },
      });

      let welfareOfficers = await prisma.user.findMany({
        where: { role: { in: ["WELFARE_OFFICER", "COMMANDER", "ADMIN"] } },
      });
      if (welfareOfficers.length === 0) {
        welfareOfficers = await prisma.user.findMany({ take: 3 });
      }

      for (const officer of welfareOfficers) {
        await prisma.notification.create({
          data: {
            userId: officer.id,
            title: `🚨 CRITICAL WELFARE ALERT: ${personnel?.rank || "Soldier"} ${personnel?.name || personnelId} (${personnel?.force || "Army"} - ${personnelId})`,
            message: reason,
            type: "alert",
            category: "Welfare",
            link: "/alerts",
          },
        });
      }

      res.status(201).json({ success: true, alert: earlyWarning });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create alert" });
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
