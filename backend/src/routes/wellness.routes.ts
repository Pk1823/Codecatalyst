import { Router, Response } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/auth.middleware";
import { WellnessService } from "../services/wellness.service";

const router = Router();

router.post("/assessments", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const result = await WellnessService.submitAssessment(req.user!, req.body, ipAddress);
    res.status(201).json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to submit assessment" });
  }
});

router.get("/assessments", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const assessments = await WellnessService.getAssessments(req.user!);
    res.json({ assessments });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assessments" });
  }
});

router.get("/history", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const timeframe = (req.query.timeframe as string) || "7D";
    const trends = await WellnessService.getHistory(req.user!, timeframe);
    res.json({ trends });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wellness history" });
  }
});

export default router;
