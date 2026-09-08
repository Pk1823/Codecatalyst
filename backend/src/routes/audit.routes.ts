import { Router } from "express";
import { AuditController } from "../controllers/audit.controller";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

// Only ADMIN can access system audit logs
router.get(
  "/audit-logs",
  authenticate,
  authorizeRoles(["ADMIN"]),
  AuditController.getAuditLogs
);

export default router;
