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

  /**
   * GET /api/risk/unit-heatmap
   * Unit readiness metrics and sector stress heatmaps
   */
  static async getUnitHeatmap(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const metrics = [
        {
          unitId: "114-coy-a",
          unitName: "114 Bn - Alpha Company (Sukma Grid)",
          totalPersonnel: 135,
          optimalPercentage: 68,
          moderatePercentage: 22,
          highRiskPercentage: 10,
          overallReadinessScore: 84,
          pendingDarbarCount: 3,
        },
        {
          unitId: "114-coy-b",
          unitName: "114 Bn - Bravo Company (Dornapal Forward)",
          totalPersonnel: 140,
          optimalPercentage: 74,
          moderatePercentage: 18,
          highRiskPercentage: 8,
          overallReadinessScore: 88,
          pendingDarbarCount: 1,
        },
        {
          unitId: "114-coy-c",
          unitName: "114 Bn - Charlie Company (Konta Picket)",
          totalPersonnel: 130,
          optimalPercentage: 55,
          moderatePercentage: 30,
          highRiskPercentage: 15,
          overallReadinessScore: 72,
          pendingDarbarCount: 5,
        },
      ];
      res.json({ metrics });
    } catch {
      res.status(500).json({ error: "Failed to fetch unit heatmap" });
    }
  }
}
