import { Router, Response } from "express";
import { authenticate, authorizeRoles, AuthenticatedRequest } from "../middleware/auth.middleware";
import { WelfareService } from "../services/welfare.service";
import { prisma } from "../lib/db";
import { AuditService } from "../services/audit.service";

const router = Router();

// Strict RBAC: Personnel is forbidden from accessing welfare cases
router.get("/cases", authenticate, authorizeRoles(["WELFARE_OFFICER", "ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const cases = await WelfareService.getCases(status);
    res.json({ cases });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch welfare cases" });
  }
});

router.post("/cases", authenticate, authorizeRoles(["WELFARE_OFFICER", "ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
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
  } catch (error) {
    res.status(500).json({ error: "Failed to create welfare case" });
  }
});

router.get("/cases/:id", authenticate, authorizeRoles(["WELFARE_OFFICER", "ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const welfareCase = await WelfareService.getCaseById(req.params.id);
    if (!welfareCase) {
      res.status(404).json({ error: "Welfare case not found." });
      return;
    }
    res.json({ case: welfareCase });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch case detail" });
  }
});

router.patch("/cases/:id", authenticate, authorizeRoles(["WELFARE_OFFICER", "ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const updated = await WelfareService.updateCase(req.params.id, req.user!, req.body, ipAddress);
    res.json({ success: true, case: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update case" });
  }
});

router.post("/support-actions", authenticate, authorizeRoles(["WELFARE_OFFICER", "ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
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
});

router.get("/recommendations", authenticate, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const recommendations = await WelfareService.getRecommendations();
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

export default router;
