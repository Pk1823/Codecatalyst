import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { WellnessService } from "../services/wellness.service";

export class WellnessController {
  /**
   * POST /api/wellness/assessments
   * Submit voluntary self-report check-in and trigger explainable risk evaluation
   */
  static async submitAssessment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress;
      const result = await WellnessService.submitAssessment(req.user!, req.body, ipAddress);
      res.status(201).json({ success: true, ...result });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to submit assessment" });
    }
  }

  /**
   * GET /api/wellness/assessments
   * Fetch assessment history for authenticated personnel or welfare officers
   */
  static async getAssessments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const assessments = await WellnessService.getAssessments(req.user!);
      res.json({ assessments });
    } catch {
      res.status(500).json({ error: "Failed to fetch assessments" });
    }
  }

  /**
   * GET /api/wellness/history
   * Longitudinal wellness trend analysis over 7D / 30D / 90D
   */
  static async getHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const timeframe = (req.query.timeframe as string) || "7D";
      const trends = await WellnessService.getHistory(req.user!, timeframe);
      res.json({ trends });
    } catch {
      res.status(500).json({ error: "Failed to fetch wellness history" });
    }
  }
}
