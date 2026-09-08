import { PersonnelRiskAnalysis, RiskDistributionItem } from "@/types/risk";
import { MOCK_RISK_DISTRIBUTION, MOCK_RISK_ANALYSES } from "@/lib/mock-data/risk";
import { AIEngineClient, TelemetryPayload } from "@/lib/ai-client";

export class RiskService {
  static async getRiskDistribution(): Promise<RiskDistributionItem[]> {
    return [...MOCK_RISK_DISTRIBUTION];
  }

  static async getRiskAnalysisById(personnelId: string): Promise<PersonnelRiskAnalysis | null> {
    const key = personnelId.toUpperCase();
    const base = MOCK_RISK_ANALYSES[key] || MOCK_RISK_ANALYSES["P-1024"];

    // Attempt live evaluation from AI Engine if available
    try {
      const telemetry: TelemetryPayload = {
        subject_id: base.personnelId,
        consecutive_field_days: base.riskScore > 60 ? 58 : 22,
        duty_hours_5d: base.riskScore > 60 ? 68.5 : 42.0,
        night_shifts_5d: base.riskScore > 60 ? 4 : 1,
        leave_denial_ratio: base.riskScore > 60 ? 0.45 : 0.05,
        sleep_hrs_5d_avg: base.riskScore > 60 ? 3.8 : 7.2,
        self_reported_energy: base.riskScore > 60 ? 1 : 4,
        self_reported_stress: base.riskScore > 60 ? 8 : 3,
        survey_latency_sec: 42.0,
        delta_rhr: base.riskScore > 60 ? 6.8 : 1.2,
        masking_index: 0.12,
      };

      const aiResponse = await AIEngineClient.predict(telemetry);
      if (aiResponse?.evaluation) {
        const topDrivers = aiResponse.evaluation.top_drivers;
        return {
          ...base,
          modelConfidence: Math.round(
            (aiResponse.evaluation.confidence_scores.high + aiResponse.evaluation.confidence_scores.moderate) * 100
          ) || base.modelConfidence,
          contributingFactors: topDrivers.length > 0
            ? topDrivers.map((d) => ({
                factor: d.feature.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                percentage: Math.abs(Math.round(d.importance * 30)) || 25,
                description: d.description,
                category: "Operational",
              }))
            : base.contributingFactors,
          recommendedActions: aiResponse.evaluation.clinical_guidance.map((g) => g.recommendation),
        };
      }
    } catch {
      // fallback
    }

    return base;
  }

  static async getAllRiskAnalyses(): Promise<PersonnelRiskAnalysis[]> {
    return Object.values(MOCK_RISK_ANALYSES);
  }
}
