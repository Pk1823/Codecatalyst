import { Router } from "express";
import { RiskController } from "../controllers/risk.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/predict", authenticate, RiskController.predict);
router.get("/history", authenticate, RiskController.getHistory);

export default router;
