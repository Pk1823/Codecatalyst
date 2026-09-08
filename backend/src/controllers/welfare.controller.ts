import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { WelfareService } from "../services/welfare.service";
import { AuditService } from "../services/audit.service";
import { prisma } from "../lib/db";

export class WelfareController {
  /**
   * GET /api/welfare/cases
   * Fetch active welfare casework for authorized medical officers
   */
  static async getCases(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const status = req.query.status as string | undefined;
      const cases = await WelfareService.getCases(status);
      res.json({ cases });
    } catch {
      res.status(500).json({ error: "Failed to fetch welfare cases" });
    }
  }

  /**
   * POST /api/welfare/cases
   * Initiate non-punitive welfare case for at-risk personnel
   */
  static async createCase(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { personnelId, title, reason, priority = "Moderate", riskScore = 50.0 } = req.body;
      if (!personnelId || !title || !reason) {
        res.status(400).json({ error: "Missing required fields: personnelId, title, reason." });
        return;
      }

      const newCase = await prisma.welfareCase.create({
        data: {
          id: `CASE-${Date.now().toString().slice(-6)}`,
          personnelId: personnelId.toUpperCase(),
          officerId: req.user!.userId,
          title,
          reason,
          priority,
          status: "NEW",
          riskScore: Number(riskScore),
        },
        include: {
          personnel: { select: { id: true, name: true, rank: true } },
        },
      });

      await AuditService.log({
        actorId: req.user!.userId,
        actorName: req.user!.name,
        actorRole: req.user!.role,
        action: "CREATE_CASE",
        resource: "WelfareCase",
        resourceId: newCase.id,
        metadata: { personnelId, priority, riskScore },
        ipAddress: req.ip || req.socket.remoteAddress,
      });

      res.status(201).json({ success: true, case: newCase });
    } catch {
      res.status(500).json({ error: "Failed to create welfare case" });
    }
  }

  /**
   * GET /api/welfare/cases/:id
   * Fetch specific case dossier
   */
  static async getCaseById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const welfareCase = await WelfareService.getCaseById(req.params.id);
      if (!welfareCase) {
        res.status(404).json({ error: "Welfare case not found." });
        return;
      }
      res.json({ case: welfareCase });
    } catch {
      res.status(500).json({ error: "Failed to fetch case detail" });
    }
  }

  /**
   * PATCH /api/welfare/cases/:id
   * Update case status or notes
   */
  static async updateCase(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress;
      const updated = await WelfareService.updateCase(
        req.params.id,
        req.user!,
        req.body,
        ipAddress
      );
      res.json({ success: true, case: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update case" });
    }
  }

  /**
   * POST /api/welfare/support-actions
   * Log support interventions (counseling, duty modification, leave recommendation)
   */
  static async addSupportAction(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { caseId, title, description } = req.body;
      if (!caseId || !title || !description) {
        res.status(400).json({ error: "Missing required fields: caseId, title, description." });
        return;
      }

      const ipAddress = req.ip || req.socket.remoteAddress;
      const action = await WelfareService.addSupportAction(req.user!, req.body, ipAddress);
      res.status(201).json({ success: true, action });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to create support action" });
    }
  }

  /**
   * GET /api/welfare/recommendations
   * Fetch proactive clinical and operational recommendations
   */
  static async getRecommendations(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const recommendations = await WelfareService.getRecommendations();
      res.json({ recommendations });
    } catch {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  }
}
