import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { AuditService } from "../services/audit.service";

export class AuditController {
  /**
   * GET /api/audit-logs
   * Immutable DPDP Act 2023 audit trails for System Administrators
   */
  static async getAuditLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const limit = parseInt((req.query.limit as string) || "50", 10);
      const action = req.query.action as string | undefined;
      const resource = req.query.resource as string | undefined;

      const logs = await AuditService.getLogs(limit, action, resource);
      res.json({
        metadata: { total: logs.length, dataset: "Verified Audit Log" },
        data: logs,
      });
    } catch {
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  }
}
