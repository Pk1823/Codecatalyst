import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { ReportService } from "../services/report.service";

export class ReportController {
  /**
   * GET /api/reports
   * Generate aggregated non-punitive operational welfare readiness report
   */
  static async getReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const unitId = req.query.unitId as string | undefined;
      const report = await ReportService.getOperationalReport(unitId);
      res.json(report);
    } catch {
      res.status(500).json({ error: "Failed to generate report" });
    }
  }
}
