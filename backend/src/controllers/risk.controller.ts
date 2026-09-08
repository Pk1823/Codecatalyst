import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { RiskService } from "../services/risk.service";

export class RiskController {
  /**
   * POST /api/risk/predict
   * Run real-time stress inference via Python LightGBM ML service
   */
  static async predict(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { personnelId, telemetry } = req.body;
      const targetId = personnelId || req.user!.personnelId || "P-1024";

      const prediction = await RiskService.generatePrediction(targetId, telemetry);
      res.json({ prediction });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to generate prediction" });
    }
  }

  /**
   * GET /api/risk/history
   * Aggregated risk distribution and latest personnel analyses
   */
  static async getHistory(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const history = await RiskService.getRiskHistory();
      res.json(history);
    } catch {
      res.status(500).json({ error: "Failed to fetch risk history" });
    }
  }
}
