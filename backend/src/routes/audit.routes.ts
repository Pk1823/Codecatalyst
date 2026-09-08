import { Router, Response } from "express";
import { authenticate, authorizeRoles, AuthenticatedRequest } from "../middleware/auth.middleware";
import { AuditService } from "../services/audit.service";

const router = Router();

// Only ADMIN can access system audit logs
router.get("/audit-logs", authenticate, authorizeRoles(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const limit = parseInt((req.query.limit as string) || "50", 10);
    const action = req.query.action as string | undefined;
    const resource = req.query.resource as string | undefined;

    const logs = await AuditService.getLogs(limit, action, resource);
    res.json({
      metadata: { total: logs.length, dataset: "Synthetic Demo Data" },
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

export default router;
