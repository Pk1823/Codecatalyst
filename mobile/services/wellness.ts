import { ApiClient, AI_ENGINE_URL } from "./api";
import {
  WellnessAssessmentInput,
  WellnessAssessmentResult,
  BuddyCheckStatus,
  DarbarRequest,
} from "../types";
import { OfflineSyncService } from "./offlineSync";

export const WELLNESS_SURVEY_QUESTIONS = [
  {
    id: "consecutiveFieldDays",
    title: "Deployment Duration",
    question: "How many consecutive days have you been on field deployment?",
    hindiQuestion: "लगातार फील्ड तैनाती / एरिया डोमिनेशन के कुल कितने दिन हो चुके हैं?",
    description: "Total uninterrupted days at your current forward post or active mission.",
    options: [
      { label: "0-10 Days (Recent Deployment)", value: "0-10", hint: "Recently deployed or at base station", points: 0 },
      { label: "11-30 Days (Standard Phase)", value: "11-30", hint: "Standard deployment phase", points: 1 },
      { label: "31-60 Days (Extended Patrol)", value: "31-60", hint: "Extended deployment", points: 2 },
      { label: "61-90 Days (Long-Term)", value: "61-90", hint: "Long-term sustained deployment", points: 3 },
      { label: "90+ Days (Severe Prolonged)", value: "90+", hint: "Severely extended continuous deployment", points: 5 },
    ],
  },
  {
    id: "dutyHours5d",
    title: "Workload (Last 5 Days)",
    question: "Approximately how many total duty hours have you performed in the last 5 days?",
    hindiQuestion: "पिछले 5 दिनों में कुल कितने घंटे की ड्यूटी (संतरी, गश्त, नाका) की है?",
    description: "Includes active sentry, patrol, operational, and standby hours.",
    options: [
      { label: "< 30 Hours (Light / Stand-down)", value: "< 30 hours", hint: "Light workload / Stand-down", points: 0 },
      { label: "30-45 Hours (Standard Load)", value: "30-45 hours", hint: "Standard operational load", points: 1 },
      { label: "46-60 Hours (Elevated Tempo)", value: "46-60 hours", hint: "Elevated workload", points: 2 },
      { label: "61-75 Hours (Heavy Tempo)", value: "61-75 hours", hint: "Heavy operational tempo", points: 4 },
      { label: "> 75 Hours (Severe Fatigue)", value: "> 75 hours", hint: "Extreme fatigue-inducing workload", points: 6 },
    ],
  },
  {
    id: "nightShifts5d",
    title: "Night Shifts (Last 5 Days)",
    question: "How many night shifts (or disrupted sleep watches) did you have in the last 5 days?",
    hindiQuestion: "पिछले 5 दिनों में रात्रि ड्यूटी (एम्बुश / नाका / संतरी) की संख्या?",
    description: "Any duty that significantly interrupted normal nocturnal sleep patterns.",
    options: [
      { label: "0 Shifts (Normal Diurnal)", value: "0", hint: "Normal diurnal cycle maintained", points: 0 },
      { label: "1 Night Shift", value: "1", hint: "Minor circadian disruption", points: 1 },
      { label: "2 Night Shifts", value: "2", hint: "Moderate disruption", points: 2 },
      { label: "3 Night Shifts", value: "3", hint: "Significant sleep cycle alteration", points: 4 },
      { label: "4+ Continuous Night Shifts", value: "4+", hint: "Severe circadian rhythm inversion", points: 6 },
    ],
  },
  {
    id: "sleepHrs5dAvg",
    title: "Average Restorative Sleep",
    question: "What is your average sleep hours per night over the last 5 days?",
    hindiQuestion: "पिछले 5 दिनों में 24 घंटों में औसत निर्बाध नींद?",
    description: "Estimate continuous, restorative sleep hours.",
    options: [
      { label: "> 7 Hours (Optimal Rest)", value: "> 7 hours", hint: "Optimal restorative rest", points: 0 },
      { label: "6-7 Hours (Adequate)", value: "6-7 hours", hint: "Adequate rest", points: 1 },
      { label: "5-6 Hours (Mild Deficit)", value: "5-6 hours", hint: "Mild sleep deficit", points: 2 },
      { label: "4-5 Hours (High Debt)", value: "4-5 hours", hint: "Significant sleep deprivation", points: 4 },
      { label: "< 4 Hours (Acute Exhaustion)", value: "< 4 hours", hint: "Severe acute sleep deprivation", points: 6 },
    ],
  },
  {
    id: "selfReportedEnergy",
    title: "Physical & Mental Energy",
    question: "How would you rate your current physical and mental energy level? (1-5)",
    hindiQuestion: "वर्तमान शारीरिक एवं मानसिक ऊर्जा का स्तर?",
    description: "Self-assessment of your vitality and focus in daily operational tasks.",
    options: [
      { label: "5 - Very Good (Highly Energetic & Sharp)", value: "5", hint: "Optimal readiness and focus", points: 0 },
      { label: "4 - Good (Alert & Active)", value: "4", hint: "Mission ready", points: 1 },
      { label: "3 - Moderate (Average Energy)", value: "3", hint: "Manageable daily tasks", points: 2 },
      { label: "2 - Low (Fatigued, Requires Effort)", value: "2", hint: "Struggling to maintain stamina", points: 4 },
      { label: "1 - Very Low (Exhausted)", value: "1", hint: "Exhausted, struggling to focus", points: 6 },
    ],
  },
  {
    id: "selfReportedStress",
    title: "Cognitive Load & Stress",
    question: "How would you rate your current overall stress and tension? (1-10)",
    hindiQuestion: "वर्तमान समग्र तनाव एवं चिंता का स्तर?",
    description: "Includes both forward operational pressure and family separation stressors.",
    options: [
      { label: "1-2: Low (Relaxed, Minimal Tension)", value: "1-2", hint: "Normal and mission ready", points: 0 },
      { label: "3-4: Mild (Manageable Operational Stress)", value: "3-4", hint: "Controlled pressure", points: 1 },
      { label: "5-6: Moderate (Noticeable Strain, Coping)", value: "5-6", hint: "Noticeable tension", points: 3 },
      { label: "7-8: High (Elevated Anxiety, Overwhelmed)", value: "7-8", hint: "Elevated anxiety", points: 5 },
      { label: "9-10: Severe (Acute Distress, Breakdown Risk)", value: "9-10", hint: "Critical strain", points: 7 },
    ],
  },
];

export class WellnessService {
  public static async submitAssessment(
    input: WellnessAssessmentInput,
    personnelId: string,
    surveyLatencySeconds?: number
  ): Promise<WellnessAssessmentResult> {
    // 1. Map input choices to exact numerical telemetry matching the Web Portal
    let consecDays = 20;
    if (input.consecutiveFieldDays === "0-10") consecDays = 5;
    else if (input.consecutiveFieldDays === "11-30") consecDays = 20;
    else if (input.consecutiveFieldDays === "31-60") consecDays = 45;
    else if (input.consecutiveFieldDays === "61-90") consecDays = 75;
    else if (input.consecutiveFieldDays === "90+") consecDays = 110;

    let dutyHours = 40;
    if (input.dutyHours5d === "< 30 hours") dutyHours = 25;
    else if (input.dutyHours5d === "30-45 hours") dutyHours = 38;
    else if (input.dutyHours5d === "46-60 hours") dutyHours = 53;
    else if (input.dutyHours5d === "61-75 hours") dutyHours = 68;
    else if (input.dutyHours5d === "> 75 hours") dutyHours = 82;

    let nightShifts = 0;
    if (input.nightShifts5d === "1") nightShifts = 1;
    else if (input.nightShifts5d === "2") nightShifts = 2;
    else if (input.nightShifts5d === "3") nightShifts = 3;
    else if (input.nightShifts5d === "4+") nightShifts = 4;

    let sleepHrs = 6.5;
    if (input.sleepHrs5dAvg === "> 7 hours") sleepHrs = 7.5;
    else if (input.sleepHrs5dAvg === "6-7 hours") sleepHrs = 6.5;
    else if (input.sleepHrs5dAvg === "5-6 hours") sleepHrs = 5.5;
    else if (input.sleepHrs5dAvg === "4-5 hours") sleepHrs = 4.5;
    else if (input.sleepHrs5dAvg === "< 4 hours") sleepHrs = 3.5;

    const energyVal = parseInt(input.selfReportedEnergy) || 3;
    let stressVal = 3;
    if (input.selfReportedStress === "1-2") stressVal = 2;
    else if (input.selfReportedStress === "3-4") stressVal = 4;
    else if (input.selfReportedStress === "5-6") stressVal = 6;
    else if (input.selfReportedStress === "7-8") stressVal = 8;
    else if (input.selfReportedStress === "9-10") stressVal = 10;

    const latency = surveyLatencySeconds !== undefined ? surveyLatencySeconds : 38.5;
    const isMaskingTendency = latency < 15 && stressVal <= 4 && (dutyHours >= 60 || consecDays >= 60);

    const telemetry = {
      subject_id: personnelId,
      consecutive_field_days: consecDays,
      duty_hours_5d: dutyHours,
      night_shifts_5d: nightShifts,
      leave_denial_ratio: dutyHours > 60 ? 0.40 : 0.05,
      sleep_hrs_5d_avg: sleepHrs,
      self_reported_energy: energyVal,
      self_reported_stress: stressVal,
      survey_latency_sec: latency,
      delta_rhr: (7.5 - sleepHrs) * 2.0,
      masking_index: isMaskingTendency ? 0.45 : 0.05,
    };

    const surveyPayload = {
      personnelId,
      responses: input,
      surveyLatencySeconds: latency,
      consecutiveFieldDays: input.consecutiveFieldDays,
      dutyHours5d: input.dutyHours5d,
      nightShifts5d: input.nightShifts5d,
      sleepHrs5dAvg: input.sleepHrs5dAvg,
      selfReportedEnergy: input.selfReportedEnergy,
      selfReportedStress: input.selfReportedStress,
      additionalNotes: input.additionalNotes,
    };

    const isAirGap = await OfflineSyncService.isAirGapMode();

    // 2. If NOT in Air-Gap mode, attempt online call to Express REST API
    if (!isAirGap) {
      try {
        const res = await ApiClient.post<any>("/wellness/assessments", surveyPayload);

        if (res) {
          const mob = res.mobileResult;
          if (mob) {
            const onlineRes: WellnessAssessmentResult = {
              id: mob.id || res.assessment?.id || `EVA-MBL-${Date.now().toString().slice(-6)}`,
              date: mob.date || new Date().toISOString().split("T")[0],
              riskScore: mob.riskScore,
              riskCategory: mob.riskCategory,
              predictedDaysToBreakdown: mob.predictedDaysToBreakdown,
              shapDrivers: mob.shapDrivers || [],
              recommendations: mob.recommendations || [],
              isMaskingDetected: mob.isMaskingDetected,
              isOffline: false,
              consecutiveFieldDays: input.consecutiveFieldDays,
              dutyHours5d: input.dutyHours5d,
              nightShifts5d: input.nightShifts5d,
              sleepHrs5dAvg: input.sleepHrs5dAvg,
              selfReportedEnergy: input.selfReportedEnergy,
              selfReportedStress: input.selfReportedStress,
            };
            await OfflineSyncService.saveLocalAssessment(onlineRes);
            this.persistAndNotify(onlineRes);
            await this.notifyWelfareOfficerIfHighRisk(onlineRes, personnelId, input);
            return onlineRes;
          }
          if (res.prediction) {
            const p = res.prediction;
            const riskCat = p.riskLevel === "HIGH" ? "Critical Breakdown Risk" : p.riskLevel === "MODERATE" ? "Elevated Stress" : "Optimal";
            const onlineRes: WellnessAssessmentResult = {
              id: res.assessment?.id || `EVA-MBL-${Date.now().toString().slice(-6)}`,
              date: res.assessment?.date || new Date().toISOString().split("T")[0],
              riskScore: p.riskScore,
              riskCategory: riskCat,
              predictedDaysToBreakdown: p.riskScore > 65 ? 4 : p.riskScore > 45 ? 12 : undefined,
              shapDrivers: (p.factors || []).map((f: any) => ({
                feature: f.feature.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
                impact: (Math.abs(f.importance) >= 0.5 ? "high" : Math.abs(f.importance) >= 0.25 ? "moderate" : "low") as "high" | "moderate" | "low",
                description: f.description,
                value: f.value,
              })),
              recommendations: (p.recommendations || []).map((r: any) => r.description || r.title),
              isMaskingDetected: p.maskingDetected,
              isOffline: false,
              consecutiveFieldDays: input.consecutiveFieldDays,
              dutyHours5d: input.dutyHours5d,
              nightShifts5d: input.nightShifts5d,
              sleepHrs5dAvg: input.sleepHrs5dAvg,
              selfReportedEnergy: input.selfReportedEnergy,
              selfReportedStress: input.selfReportedStress,
            };
            await OfflineSyncService.saveLocalAssessment(onlineRes);
            this.persistAndNotify(onlineRes);
            await this.notifyWelfareOfficerIfHighRisk(onlineRes, personnelId, input);
            return onlineRes;
          }
        }
      } catch (err: any) {
        console.warn("[WellnessService] Backend assessment failed, using on-device forward post evaluation:", err);
      }
    }

    // 3. 100% On-Device Decision Intelligence Engine (Runs completely offline in high-altitude/border outposts)
    let rawScore = 15;
    if (consecDays > 90) rawScore += 26;
    else if (consecDays > 60) rawScore += 18;
    else if (consecDays > 30) rawScore += 10;

    if (dutyHours > 70) rawScore += 24;
    else if (dutyHours > 55) rawScore += 16;
    else if (dutyHours > 45) rawScore += 8;

    if (nightShifts >= 4) rawScore += 20;
    else if (nightShifts >= 3) rawScore += 14;

    if (sleepHrs < 4.0) rawScore += 24;
    else if (sleepHrs < 5.0) rawScore += 16;
    else if (sleepHrs < 6.0) rawScore += 8;

    if (energyVal === 1) rawScore += 14;
    else if (energyVal === 2) rawScore += 8;

    if (stressVal >= 9) rawScore += 20;
    else if (stressVal >= 7) rawScore += 14;

    const finalRiskScore = Math.min(96, Math.max(12, rawScore));
    const isMasking = latency < 15 && stressVal <= 4 && (dutyHours >= 60 || consecDays >= 60);

    let finalCategory: WellnessAssessmentResult["riskCategory"] = "Optimal";
    if (finalRiskScore >= 68) finalCategory = "Critical Breakdown Risk";
    else if (finalRiskScore >= 42) finalCategory = "Elevated Stress";
    else if (finalRiskScore >= 28) finalCategory = "Moderate Fatigue";

    const offlineResult: WellnessAssessmentResult = {
      id: `OFFLINE-EVA-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split("T")[0],
      riskScore: finalRiskScore,
      riskCategory: finalCategory,
      predictedDaysToBreakdown: finalRiskScore > 65 ? 4 : finalRiskScore > 45 ? 12 : undefined,
      isMaskingDetected: isMasking,
      isOffline: true,
      shapDrivers: [
        {
          feature: "Sleep Debt (5-Day Rest Deficit)",
          impact: sleepHrs < 5.0 ? "high" : "low",
          description: "Continuous nocturnal sleep deprivation elevating cognitive reaction latency.",
          value: `${sleepHrs} hrs/day`,
        },
        {
          feature: "Deployment Stationing Duration",
          impact: consecDays > 60 ? "high" : "moderate",
          description: "Prolonged uninterrupted field forward post stationing without base turnaround.",
          value: `${consecDays} days`,
        },
        {
          feature: "Circadian Night Shift Load",
          impact: nightShifts >= 3 ? "high" : "low",
          description: "Back-to-back nocturnal ambushes and sentry duties disrupting melatonin cycles.",
          value: `${nightShifts} watches`,
        },
      ],
      recommendations: [
        "Mandatory 8-hour uninterrupted restorative sleep stand-down in base camp.",
        "Buddy-pair peer watch protocol active for the next 72 hours.",
        "Voluntary confidential tele-counseling access with CMO Dr. Aarti Sharma.",
        "Priority consideration for scheduled rest rotation during upcoming convoy movement.",
      ],
      consecutiveFieldDays: input.consecutiveFieldDays,
      dutyHours5d: input.dutyHours5d,
      nightShifts5d: input.nightShifts5d,
      sleepHrs5dAvg: input.sleepHrs5dAvg,
      selfReportedEnergy: input.selfReportedEnergy,
      selfReportedStress: input.selfReportedStress,
    };

    // Save to local device store & queue in outbox for automatic sync when base reconnects
    await OfflineSyncService.saveLocalAssessment(offlineResult);
    await OfflineSyncService.enqueue("ASSESSMENT", surveyPayload);
    this.persistAndNotify(offlineResult);

    // If evaluated at High Risk, dispatch immediate notification to website Welfare Officer
    await this.notifyWelfareOfficerIfHighRisk(offlineResult, personnelId, input);

    return offlineResult;
  }

  private static async notifyWelfareOfficerIfHighRisk(
    res: WellnessAssessmentResult,
    personnelId: string,
    input: WellnessAssessmentInput
  ): Promise<void> {
    const isHighRisk =
      res.riskScore >= 60 ||
      res.riskCategory === "Critical Breakdown Risk" ||
      res.riskCategory === "Elevated Stress";

    if (!isHighRisk) return;

    try {
      // 1. If in browser/hybrid environment, write to localStorage & dispatch real-time event
      if (typeof window !== "undefined" && window.localStorage) {
        const customStr = localStorage.getItem("missionwell_custom_alerts");
        const customAlerts = customStr ? JSON.parse(customStr) : [];
        const now = new Date();
        const timeFormatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const newAlert = {
          id: `alert-mbl-${Date.now()}`,
          category: "Welfare",
          title: `🚨 HIGH RISK: Soldier ${personnelId} Flagged for Triage`,
          description: `Army personnel ${personnelId} evaluated at ${res.riskCategory} (${res.riskScore}/100). Severe operational fatigue, acute sleep deficit.`,
          timestamp: timeFormatted,
          createdAt: now.toISOString(),
          priority: "Urgent",
          isRead: false,
          personnelId,
          contributingIndicators: [
            `Duty Hours: ${input.dutyHours5d}`,
            `Sleep Avg: ${input.sleepHrs5dAvg}`,
            `Field Days: ${input.consecutiveFieldDays}`,
          ],
          recommendedAction: res.recommendations[0] || "Rest rotation advised",
        };

        localStorage.setItem("missionwell_custom_alerts", JSON.stringify([newAlert, ...customAlerts]));
        window.dispatchEvent(new Event("missionwell_alerts_changed"));
      }

      // 2. Post directly to /alerts to notify Welfare Officers on database
      try {
        await ApiClient.post("/alerts", {
          personnelId,
          severity: res.riskScore >= 75 ? "CRITICAL" : "HIGH",
          reason: `Soldier ${personnelId} evaluated at ${res.riskCategory} (${res.riskScore}/100). Immediate welfare triage required.`,
          triggerCondition: "MOBILE_HIGH_RISK_EVALUATION",
          riskScore: res.riskScore,
        });
      } catch {}
    } catch (e) {
      console.warn("[WellnessService] Failed to dispatch welfare officer notification:", e);
    }
  }

  public static async getBuddyStatus(): Promise<BuddyCheckStatus> {
    return {
      id: "buddy-101",
      buddyName: "Ct. Surinder Singh",
      buddyRank: "Constable (GD)",
      buddyServiceId: "CRPF-GD-2021-0982",
      lastCheckTime: "2 hours ago (14:30 hrs)",
      status: "OK",
    };
  }

  public static async submitBuddyCheck(status: "OK" | "NEEDS_REST" | "URGENT_SUPPORT"): Promise<boolean> {
    const isAirGap = await OfflineSyncService.isAirGapMode();
    if (isAirGap) {
      await OfflineSyncService.enqueue("BUDDY_CHECK", { status, timestamp: new Date().toISOString() });
      return true;
    }

    try {
      await ApiClient.post("/welfare/buddy-check", { status });
      return true;
    } catch (err) {
      console.warn("[WellnessService] Online buddy check post failed, queued offline:", err);
      await OfflineSyncService.enqueue("BUDDY_CHECK", { status, timestamp: new Date().toISOString() });
      return true;
    }
  }

  public static async submitDarbarRequest(request: {
    targetOfficer: "Commanding Officer (CO)" | "Subedar Major (SM)";
    reasonCategory: DarbarRequest["reasonCategory"];
    notes?: string;
  }): Promise<DarbarRequest> {
    const fallbackRequest: DarbarRequest = {
      id: `DBR-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split("T")[0],
      targetOfficer: request.targetOfficer,
      reasonCategory: request.reasonCategory,
      status: "PENDING",
      confidentialNotes: request.notes,
    };

    const isAirGap = await OfflineSyncService.isAirGapMode();
    if (isAirGap) {
      await OfflineSyncService.enqueue("DARBAR_REQUEST", request);
      return fallbackRequest;
    }

    try {
      const res = await ApiClient.post<DarbarRequest>("/welfare/darbar", request);
      return res;
    } catch (err) {
      console.warn("[WellnessService] Online Darbar post failed, queued offline:", err);
      await OfflineSyncService.enqueue("DARBAR_REQUEST", request);
      return fallbackRequest;
    }
  }

  private static assessmentListeners: Set<(assessment: WellnessAssessmentResult) => void> = new Set();

  public static subscribeAssessment(listener: (assessment: WellnessAssessmentResult) => void): () => void {
    this.assessmentListeners.add(listener);
    return () => {
      this.assessmentListeners.delete(listener);
    };
  }

  private static persistAndNotify(assessment: WellnessAssessmentResult) {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.setItem("missionwell_last_assessment", JSON.stringify(assessment));
        window.dispatchEvent(new CustomEvent("missionwell_assessment_updated", { detail: assessment }));
      } catch {}
    }

    for (const listener of this.assessmentListeners) {
      try {
        listener(assessment);
      } catch (err) {
        console.warn("[WellnessService] Error in assessment listener:", err);
      }
    }
  }

  public static async getLatestAssessment(personnelId?: string): Promise<WellnessAssessmentResult | null> {
    // 1. Check in-memory / local storage first
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const stored = localStorage.getItem("missionwell_last_assessment");
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {}
    }

    // 2. Check offline vault history
    const local = await OfflineSyncService.getLocalAssessments();
    if (local && local.length > 0) {
      return local[0];
    }

    // 3. Try fetching latest from backend if online
    try {
      const isAirGap = await OfflineSyncService.isAirGapMode();
      if (!isAirGap) {
        const id = personnelId || "P-1024";
        const res = await ApiClient.get<any>(`/wellness/history?personnelId=${encodeURIComponent(id)}`);
        if (res && res.assessments && res.assessments.length > 0) {
          const a = res.assessments[0];
          const rawRisk = Math.round(100 - (a.score || 70));
          const result: WellnessAssessmentResult = {
            id: a.id,
            date: a.createdAt ? a.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
            riskScore: rawRisk,
            riskCategory:
              a.indicatorStatus ||
              (rawRisk <= 30 ? "Optimal" : rawRisk <= 69 ? "Moderate Fatigue" : "Critical Breakdown Risk"),
            shapDrivers: [
              { feature: "Duty Hours 5d", value: 52, impact: "high", description: "Cumulative duty shift load" },
              { feature: "Self Reported Stress", value: 6, impact: "moderate", description: "Voluntary stress evaluation signal" },
              { feature: "Sleep Hours Avg", value: 4.5, impact: "moderate", description: "Restorative sleep pattern" },
            ],
            recommendations: [a.recommendation || "Rest rotation and pacing advised."],
            isOffline: false,
          };
          await OfflineSyncService.saveLocalAssessment(result);
          return result;
        }
      }
    } catch (e) {
      console.warn("[WellnessService] Failed to fetch remote history:", e);
    }

    return null;
  }
}
