import { WellnessAssessmentInput, WellnessAssessmentResult, WellnessTrendPoint } from "@/types/wellness";
import { MOCK_WELLNESS_TRENDS } from "@/lib/mock-data/wellness";
import { AIEngineClient, TelemetryPayload } from "@/lib/ai-client";

export class WellnessService {
  static async getTrends(timeframe: "7D" | "30D" | "90D" | "6M" = "7D"): Promise<WellnessTrendPoint[]> {
    return MOCK_WELLNESS_TRENDS[timeframe] || MOCK_WELLNESS_TRENDS["7D"];
  }

  static async submitAssessment(input: WellnessAssessmentInput, personnelId: string = "P-1024"): Promise<WellnessAssessmentResult> {
    const ratingWeights: Record<string, number> = {
      "Very Low": 1,
      "Low": 2,
      "Moderate": 3,
      "Good": 4,
      "Very Good": 5,
    };

    const energyVal = ratingWeights[input.energy] || 3;
    const sleepVal = ratingWeights[input.sleepQuality] || 3;
    const workloadVal = ratingWeights[input.workload] || 2;
    const fatigueVal = ratingWeights[input.emotionalFatigue] || 3;
    const wellbeingVal = ratingWeights[input.overallWellbeing] || 3;

    // Convert input to AI Telemetry Payload
    const telemetry: TelemetryPayload = {
      subject_id: personnelId,
      consecutive_field_days: workloadVal >= 4 ? 65 : 28,
      duty_hours_5d: workloadVal * 16.0,
      night_shifts_5d: Math.max(0, 5 - sleepVal),
      leave_denial_ratio: workloadVal >= 4 ? 0.40 : 0.05,
      sleep_hrs_5d_avg: sleepVal * 1.6 + 1.0,
      self_reported_energy: energyVal,
      self_reported_stress: Math.min(10, Math.max(1, (6 - wellbeingVal) * 2)),
      survey_latency_sec: 38.5,
      delta_rhr: (6 - sleepVal) * 1.5,
      masking_index: 0.10,
    };

    let status: WellnessAssessmentResult["indicatorStatus"] = "Low Concern";
    let stress: WellnessAssessmentResult["stressLevel"] = "Low";
    let fatigue: WellnessAssessmentResult["fatigueLevel"] = "Low";
    let workload: WellnessAssessmentResult["workloadStatus"] = "Optimal";
    let recovery: WellnessAssessmentResult["recoveryStatus"] = "Adequate";
    let recommendation = "Your indicators show healthy baseline balance. Maintain regular hydration and scheduled rest.";
    let score = Math.round((energyVal + sleepVal + wellbeingVal) * 6.6);

    try {
      const aiPrediction = await AIEngineClient.predict(telemetry);
      if (aiPrediction?.evaluation) {
        const evalRes = aiPrediction.evaluation;
        if (evalRes.risk_band === "HIGH") {
          status = "Elevated Attention";
          stress = "Elevated";
          fatigue = "High";
          workload = "High";
          recovery = "Reduced";
          score = Math.max(25, 100 - Math.round(evalRes.confidence_scores.high * 65));
        } else if (evalRes.risk_band === "MODERATE" || evalRes.risk_band === "POTENTIAL_MASKING") {
          status = "Moderate Attention";
          stress = "Moderate";
          fatigue = "Moderate";
          workload = "Elevated";
          recovery = "Moderate";
          score = Math.max(45, 100 - Math.round(evalRes.confidence_scores.moderate * 45));
        }

        if (evalRes.clinical_guidance.length > 0) {
          recommendation = evalRes.clinical_guidance.map((g) => g.recommendation).join(" ");
        }
      }
    } catch {
      // Graceful fallback
    }

    const result: WellnessAssessmentResult = {
      id: `WASS-${Date.now().toString().slice(-6)}`,
      personnelId,
      date: new Date().toISOString().split("T")[0],
      indicatorStatus: status,
      score,
      stressLevel: stress,
      fatigueLevel: fatigue,
      workloadStatus: workload,
      recoveryStatus: recovery,
      recommendation,
      voluntaryConsentTimestamp: new Date().toISOString(),
    };

    return result;
  }
}
