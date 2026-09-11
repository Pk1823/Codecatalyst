import { Router } from "express";
import authRoutes from "./auth.routes";
import personnelRoutes from "./personnel.routes";
import wellnessRoutes from "./wellness.routes";
import riskRoutes from "./risk.routes";
import welfareRoutes from "./welfare.routes";
import alertRoutes from "./alert.routes";
import reportRoutes from "./report.routes";
import auditRoutes from "./audit.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/personnel", personnelRoutes);
router.use("/wellness", wellnessRoutes);
router.use("/risk", riskRoutes);
router.use("/welfare", welfareRoutes);
router.use("/welfare-cases", welfareRoutes);
router.use(alertRoutes);
router.use(reportRoutes);
router.use(auditRoutes);

export default router;
