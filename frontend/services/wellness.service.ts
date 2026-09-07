import { WellnessAssessmentInput, WellnessAssessmentResult, WellnessTrendPoint } from "@/types/wellness";
import { MOCK_WELLNESS_TRENDS } from "@/lib/mock-data/wellness";

export class WellnessService {
  static async getTrends(timeframe: "7D" | "30D" | "90D" | "6M" = "7D"): Promise<WellnessTrendPoint[]> {
    return MOCK_WELLNESS_TRENDS[timeframe] || MOCK_WELLNESS_TRENDS["7D"];
  }

  static async submitAssessment(input: WellnessAssessmentInput, personnelId: string = "P-1024"): Promise<WellnessAssessmentResult> {
    // Scoring logic based on ratings:
    const ratingWeights: Record<string, number> = {
      "Very Low": 10,
      "Low": 30,
      "Moderate": 55,
      "Good": 80,
      "Very Good": 95,
    };

    const energyScore = ratingWeights[input.energy] || 50;
    const sleepScore = ratingWeights[input.sleepQuality] || 50;
    const recoveryScore = ratingWeights[input.recovery] || 50;
    const balanceScore = ratingWeights[input.workLifeBalance] || 50;
    const wellbeingScore = ratingWeights[input.overallWellbeing] || 50;

    const avgScore = Math.round((energyScore + sleepScore + recoveryScore + balanceScore + wellbeingScore) / 5);

    let status: WellnessAssessmentResult["indicatorStatus"] = "Low Concern";
    let stress: WellnessAssessmentResult["stressLevel"] = "Low";
    let fatigue: WellnessAssessmentResult["fatigueLevel"] = "Low";
    let workload: WellnessAssessmentResult["workloadStatus"] = "Optimal";
    let recovery: WellnessAssessmentResult["recoveryStatus"] = "Adequate";
    let recommendation = "Your indicators show healthy baseline balance. Maintain regular hydration and scheduled rest.";

    if (avgScore < 45) {
      status = "Elevated Attention";
      stress = "Elevated";
      fatigue = "High";
      workload = "High";
      recovery = "Reduced";
      recommendation = "Consider taking adequate recovery time and accessing available welfare support if needed. Workload rotation may be beneficial.";
    } else if (avgScore < 65) {
      status = "Moderate Attention";
      stress = "Moderate";
      fatigue = "Moderate";
      workload = "Elevated";
      recovery = "Moderate";
      recommendation = "Consider discussing duty pacing with your team coordinator and prioritizing restorative sleep windows.";
    }

    const result: WellnessAssessmentResult = {
      id: `WASS-${Date.now().toString().slice(-6)}`,
      personnelId,
      date: new Date().toISOString().split("T")[0],
      indicatorStatus: status,
      score: avgScore,
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
