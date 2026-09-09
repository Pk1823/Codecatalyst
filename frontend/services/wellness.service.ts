import { WellnessAssessmentInput, WellnessAssessmentResult, WellnessTrendPoint } from "@/types/wellness";
import { MOCK_WELLNESS_TRENDS } from "@/lib/mock-data/wellness";
import { AIEngineClient, TelemetryPayload } from "@/lib/ai-client";

export class WellnessService {
  static async getTrends(timeframe: "7D" | "30D" | "90D" | "6M" = "7D"): Promise<WellnessTrendPoint[]> {
    return MOCK_WELLNESS_TRENDS[timeframe] || MOCK_WELLNESS_TRENDS["7D"];
  }

  static async submitAssessment(input: WellnessAssessmentInput, personnelId: string = "P-1024"): Promise<WellnessAssessmentResult> {
    // Map consecutive field days
    let consecDays = 20;
    if (input.consecutiveFieldDays === "0-10") consecDays = 5;
    else if (input.consecutiveFieldDays === "11-30") consecDays = 20;
    else if (input.consecutiveFieldDays === "31-60") consecDays = 45;
    else if (input.consecutiveFieldDays === "61-90") consecDays = 75;
    else if (input.consecutiveFieldDays === "90+") consecDays = 110;

    // Map duty hours
    let dutyHours = 40;
    if (input.dutyHours5d === "< 30 hours") dutyHours = 25;
    else if (input.dutyHours5d === "30-45 hours") dutyHours = 38;
    else if (input.dutyHours5d === "46-60 hours") dutyHours = 53;
    else if (input.dutyHours5d === "61-75 hours") dutyHours = 68;
    else if (input.dutyHours5d === "> 75 hours") dutyHours = 82;

    // Map night shifts
    let nightShifts = 0;
    if (input.nightShifts5d === "1") nightShifts = 1;
    else if (input.nightShifts5d === "2") nightShifts = 2;
    else if (input.nightShifts5d === "3") nightShifts = 3;
    else if (input.nightShifts5d === "4+") nightShifts = 4;

    // Map sleep hours
    let sleepHrs = 6.5;
    if (input.sleepHrs5dAvg === "> 7 hours") sleepHrs = 7.5;
    else if (input.sleepHrs5dAvg === "6-7 hours") sleepHrs = 6.5;
    else if (input.sleepHrs5dAvg === "5-6 hours") sleepHrs = 5.5;
    else if (input.sleepHrs5dAvg === "4-5 hours") sleepHrs = 4.5;
    else if (input.sleepHrs5dAvg === "< 4 hours") sleepHrs = 3.5;

    // Map energy and stress
    const energyVal = parseInt(input.selfReportedEnergy) || 3;
    let stressVal = 3; // default
    if (input.selfReportedStress === "1-2") stressVal = 2;
    else if (input.selfReportedStress === "3-4") stressVal = 4;
    else if (input.selfReportedStress === "5-6") stressVal = 6;
    else if (input.selfReportedStress === "7-8") stressVal = 8;
    else if (input.selfReportedStress === "9-10") stressVal = 10;

    // Convert input to AI Telemetry Payload
    const telemetry: TelemetryPayload = {
      subject_id: personnelId,
      consecutive_field_days: consecDays,
      duty_hours_5d: dutyHours,
      night_shifts_5d: nightShifts,
      leave_denial_ratio: dutyHours > 60 ? 0.40 : 0.05,
      sleep_hrs_5d_avg: sleepHrs,
      self_reported_energy: energyVal,
      self_reported_stress: stressVal,
      survey_latency_sec: 38.5,
      delta_rhr: (7.5 - sleepHrs) * 2.0,
      masking_index: 0.05,
    };

    let status: WellnessAssessmentResult["indicatorStatus"] = "Low Concern";
    let stress: WellnessAssessmentResult["stressLevel"] = "Low";
    let fatigue: WellnessAssessmentResult["fatigueLevel"] = "Low";
    let workload: WellnessAssessmentResult["workloadStatus"] = "Optimal";
    let recovery: WellnessAssessmentResult["recoveryStatus"] = "Adequate";
    let recommendation = "Your indicators show healthy baseline balance. Maintain regular hydration and scheduled rest.";
    let score = Math.round((energyVal + (sleepHrs/2) + (10 - stressVal)) * 5.5);

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
        } else if (evalRes.risk_band === "MODERATE" || evalRes.risk_band === "POTENTIAL_MASKING") {
          status = "Moderate Attention";
          stress = "Moderate";
          fatigue = "Moderate";
          workload = "Elevated";
          recovery = "Moderate";
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

    // Save alert to local storage so welfare officer dashboard can see it
    try {
      if (typeof window !== "undefined") {
        const customStr = localStorage.getItem("missionwell_custom_alerts");
        const customAlerts = customStr ? JSON.parse(customStr) : [];
        const newAlert = {
          id: `alert-new-${Date.now()}`,
          category: "Welfare",
          title: `New AI Assessment: ${status}`,
          description: `Personnel ${personnelId} submitted an assessment resulting in ${stress} stress and ${fatigue} fatigue levels.`,
          timestamp: "Just now",
          priority: stress === "Elevated" ? "Urgent" : (stress === "Moderate" ? "High" : "Medium"),
          isRead: false,
          personnelId,
          contributingIndicators: [
            `Duty Hours: ${input.dutyHours5d}`,
            `Sleep Avg: ${input.sleepHrs5dAvg}`,
            `Field Days: ${input.consecutiveFieldDays}`
          ],
          recommendedAction: recommendation
        };
        localStorage.setItem("missionwell_custom_alerts", JSON.stringify([newAlert, ...customAlerts]));

        // Create a Welfare Case too
        const customCasesStr = localStorage.getItem("missionwell_custom_cases");
        const customCases = customCasesStr ? JSON.parse(customCasesStr) : [];
        const newCase = {
          id: `CASE-2025-${Math.floor(100 + Math.random() * 900)}`,
          personnelId: personnelId,
          anonymizedCode: `SEC-P-${Math.floor(100 + Math.random() * 900)}`,
          riskLevel: stress === "Elevated" ? "HIGH" : stress === "Moderate" ? "MODERATE" : "LOW",
          primaryConcern: `AI Assessment: ${status}`,
          unit: "Bravo Company",
          assignedOfficer: "Dr. Aarti Sharma",
          assignedOfficerId: "user-welfare-01",
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
          status: "New",
          notesCount: 1,
          interventionsCount: 0,
          timeline: [
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              title: "AI Risk Prediction Submitted",
              description: `Personnel ID ${personnelId} submitted self-assessment. AI predicts ${stress} stress and ${fatigue} fatigue.`,
              actor: "AI Engine",
              actorRole: "System",
              type: "alert",
            },
          ],
          interventions: [],
          caseNotes: [
            {
              id: `note-${Date.now()}`,
              author: "AI Prediction System",
              date: new Date().toISOString().split("T")[0],
              text: `AI prediction details: Stress Level ${stress}, Fatigue Level ${fatigue}. Recommended Action: ${recommendation}`,
              isConfidential: true,
            },
          ],
        };
        localStorage.setItem("missionwell_custom_cases", JSON.stringify([newCase, ...customCases]));
      }

      // Save for personnel dashboard
      localStorage.setItem("missionwell_last_assessment", JSON.stringify({
        status, stress, fatigue, workload, score, date: new Date().toISOString()
      }));

      // Background persist to database API
      try {
        fetch("/api/wellness/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personnelId,
            energy: energyVal >= 4 ? "Good" : energyVal === 3 ? "Moderate" : "Low",
            sleepQuality: sleepHrs >= 7 ? "Good" : sleepHrs >= 5.5 ? "Moderate" : "Low",
            workload: dutyHours > 60 ? "Elevated" : dutyHours > 45 ? "Moderate" : "Low",
            recovery: sleepHrs >= 6.5 ? "Good" : "Moderate",
            emotionalFatigue: stressVal >= 7 ? "High" : stressVal >= 4 ? "Moderate" : "Low",
            workLifeBalance: dutyHours > 60 ? "Low" : "Moderate",
            overallWellbeing: status === "Low Concern" ? "Good" : "Moderate",
            additionalNotes: input.additionalNotes || "",
          }),
        }).catch(() => {});
      } catch {}
    } catch (e) {
      console.error("Failed to save custom alert or case", e);
    }

    return result;
  }
}
