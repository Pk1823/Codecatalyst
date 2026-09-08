import { Router } from "express";
import { WellnessController } from "../controllers/wellness.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/assessments", authenticate, WellnessController.submitAssessment);
router.get("/assessments", authenticate, WellnessController.getAssessments);
router.get("/history", authenticate, WellnessController.getHistory);

export default router;
