import { Router } from "express";
import { AlertController } from "../controllers/alert.controller";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/alerts",
  authenticate,
  authorizeRoles(["WELFARE_OFFICER", "COMMANDER", "ADMIN"]),
  AlertController.getAlerts
);

router.patch(
  "/alerts/:id",
  authenticate,
  authorizeRoles(["WELFARE_OFFICER", "ADMIN"]),
  AlertController.updateAlert
);

router.get("/notifications", authenticate, AlertController.getNotifications);
router.patch("/notifications/:id/read", authenticate, AlertController.markNotificationRead);

export default router;
