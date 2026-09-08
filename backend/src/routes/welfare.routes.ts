import { Router } from "express";
import { WelfareController } from "../controllers/welfare.controller";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

// Strict RBAC: Personnel is forbidden from accessing welfare casework
router.get(
  "/cases",
  authenticate,
  authorizeRoles(["WELFARE_OFFICER", "ADMIN"]),
  WelfareController.getCases
);

router.post(
  "/cases",
  authenticate,
  authorizeRoles(["WELFARE_OFFICER", "ADMIN"]),
  WelfareController.createCase
);

router.get(
  "/cases/:id",
  authenticate,
  authorizeRoles(["WELFARE_OFFICER", "ADMIN"]),
  WelfareController.getCaseById
);

router.patch(
  "/cases/:id",
  authenticate,
  authorizeRoles(["WELFARE_OFFICER", "ADMIN"]),
  WelfareController.updateCase
);

router.post(
  "/support-actions",
  authenticate,
  authorizeRoles(["WELFARE_OFFICER", "ADMIN"]),
  WelfareController.addSupportAction
);

router.get("/recommendations", authenticate, WelfareController.getRecommendations);

export default router;
