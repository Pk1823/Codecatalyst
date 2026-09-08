import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

// Personnel is strictly forbidden from accessing aggregated reports
router.get(
  "/reports",
  authenticate,
  authorizeRoles(["WELFARE_OFFICER", "COMMANDER", "ADMIN"]),
  ReportController.getReport
);

export default router;
