import { Router, Response } from "express";
import { authenticate, authorizeRoles, AuthenticatedRequest } from "../middleware/auth.middleware";
import { ReportService } from "../services/report.service";

const router = Router();

// Personnel is strictly forbidden from accessing aggregated reports
router.get("/reports", authenticate, authorizeRoles(["WELFARE_OFFICER", "COMMANDER", "ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const unitId = req.query.unitId as string | undefined;
    const report = await ReportService.getOperationalReport(unitId);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate report" });
  }
});

export default router;
