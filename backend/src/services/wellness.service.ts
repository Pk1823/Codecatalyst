import { prisma } from "../lib/db";
import { MLClient } from "../lib/ml-client";
import { AuditService } from "./audit.service";
import { SessionPayload } from "../lib/jwt";

const RATING_SCORES: Record<string, number> = {
  "Very Low": 10,
  Low: 30,
  Moderate: 55,
  Good: 80,
  "Very Good": 95,
};

export class WellnessService {
  static async submitAssessment(session: SessionPayload, body: any, ipAddress?: string) {
    const targetPersonnelId = (
      body.personnelId ||
      session.personnelId ||
      "P-1024"
    ).toUpperCase();

    const personnel = await prisma.personnel.findUnique({
      where: { id: targetPersonnelId },
      include: {
        unit: true,
        deployments: { where: { isCurrent: true }, take: 1 },
        workloadRecords: { orderBy: { periodStart: "desc" }, take: 1 },
        leaveRecords: { take: 5 },
      },
    });

    if (!personnel) {
      throw new Error("Personnel record not found.");
    }

    const raw = body.responses || body;

    // Handle questionnaire options if present
    let consecDays = 20;
    if (raw.consecutiveFieldDays === "0-10") consecDays = 5;
    else if (raw.consecutiveFieldDays === "11-30") consecDays = 20;
    else if (raw.consecutiveFieldDays === "31-60") consecDays = 45;
    else if (raw.consecutiveFieldDays === "61-90") consecDays = 75;
    else if (raw.consecutiveFieldDays === "90+") consecDays = 110;
    else if (typeof raw.consecutiveFieldDays === "number") consecDays = raw.consecutiveFieldDays;
    else if (personnel.deployments[0]) consecDays = personnel.deployments[0].consecutiveDays;
    else consecDays = personnel.activeDeployDays || 35;

    let dutyHours = 40;
    if (raw.dutyHours5d === "< 30 hours") dutyHours = 25;
    else if (raw.dutyHours5d === "30-45 hours") dutyHours = 38;
    else if (raw.dutyHours5d === "46-60 hours") dutyHours = 53;
    else if (raw.dutyHours5d === "61-75 hours") dutyHours = 68;
    else if (raw.dutyHours5d === "> 75 hours") dutyHours = 82;
    else if (typeof raw.dutyHours5d === "number") dutyHours = raw.dutyHours5d;
    else if (personnel.workloadRecords[0]) dutyHours = personnel.workloadRecords[0].dutyHours5d;

    let nightShifts = 0;
    if (raw.nightShifts5d === "1") nightShifts = 1;
    else if (raw.nightShifts5d === "2") nightShifts = 2;
    else if (raw.nightShifts5d === "3") nightShifts = 3;
    else if (raw.nightShifts5d === "4+" || raw.nightShifts5d === "4") nightShifts = 4;
    else if (typeof raw.nightShifts5d === "number") nightShifts = raw.nightShifts5d;
    else if (personnel.workloadRecords[0]) nightShifts = personnel.workloadRecords[0].nightShifts5d;

    let sleepHrs = 6.5;
    if (raw.sleepHrs5dAvg === "> 7 hours") sleepHrs = 7.5;
    else if (raw.sleepHrs5dAvg === "6-7 hours") sleepHrs = 6.5;
    else if (raw.sleepHrs5dAvg === "5-6 hours") sleepHrs = 5.5;
    else if (raw.sleepHrs5dAvg === "4-5 hours") sleepHrs = 4.5;
    else if (raw.sleepHrs5dAvg === "< 4 hours") sleepHrs = 3.5;
    else if (typeof raw.sleepHrs5dAvg === "number") sleepHrs = raw.sleepHrs5dAvg;
    else if (personnel.workloadRecords[0]) sleepHrs = personnel.workloadRecords[0].sleepHoursAvg;

    const energyVal = parseInt(raw.selfReportedEnergy) || (raw.energy === "Very Good" ? 5 : raw.energy === "Good" ? 4 : raw.energy === "Low" ? 2 : raw.energy === "Very Low" ? 1 : 3);
    let stressVal = 3;
    if (raw.selfReportedStress === "1-2") stressVal = 2;
    else if (raw.selfReportedStress === "3-4") stressVal = 4;
    else if (raw.selfReportedStress === "5-6") stressVal = 6;
    else if (raw.selfReportedStress === "7-8") stressVal = 8;
    else if (raw.selfReportedStress === "9-10") stressVal = 10;
    else if (typeof raw.selfReportedStress === "number") stressVal = raw.selfReportedStress;

    const latencySec = typeof body.surveyLatencySeconds === "number" ? body.surveyLatencySeconds : (typeof body.survey_latency_sec === "number" ? body.survey_latency_sec : 38.5);
    const isMaskingTendency = latencySec < 15 && stressVal <= 4 && (dutyHours >= 60 || consecDays >= 60);
    const maskingIndex = isMaskingTendency ? 0.45 : (typeof body.masking_index === "number" ? body.masking_index : 0.05);

    const energy = raw.energy || (energyVal >= 4 ? "Good" : energyVal === 3 ? "Moderate" : "Low");
    const sleepQuality = raw.sleepQuality || (sleepHrs >= 7 ? "Good" : sleepHrs >= 5.5 ? "Moderate" : "Low");
    const workload = raw.workload || (dutyHours > 60 ? "Elevated" : dutyHours > 45 ? "Moderate" : "Low");
    const recovery = raw.recovery || (sleepHrs >= 6.5 ? "Good" : "Moderate");
    const emotionalFatigue = raw.emotionalFatigue || (stressVal >= 7 ? "High" : stressVal >= 4 ? "Moderate" : "Low");
    const workLifeBalance = raw.workLifeBalance || (dutyHours > 60 ? "Low" : "Moderate");
    const overallWellbeing = raw.overallWellbeing || (stressVal <= 3 && energyVal >= 4 ? "Good" : "Moderate");
    const additionalNotes = body.additionalNotes || raw.additionalNotes || "";

    const sEnergy = RATING_SCORES[energy] || 55;
    const sSleep = RATING_SCORES[sleepQuality] || 55;
    const sWorkload = RATING_SCORES[workload] || 55;
    const sRecovery = RATING_SCORES[recovery] || 55;
    const sEmotional = RATING_SCORES[emotionalFatigue] || 55;
    const sBalance = RATING_SCORES[workLifeBalance] || 55;
    const sOverall = RATING_SCORES[overallWellbeing] || 55;

    const avgScore = Math.round(
      (sEnergy + sSleep + sWorkload + sRecovery + sEmotional + sBalance + sOverall) / 7
    );

    let indicatorStatus = "Low Concern";
    let stressLevel = "Low";
    let fatigueLevel = "Low";
    let workloadStatus = "Optimal";
    let recoveryStatus = "Adequate";
    let recommendationText =
      "Your indicators show a healthy operational baseline. Maintain restorative hydration and regular sleep windows.";

    if (avgScore < 45 || stressVal >= 7 || sleepHrs <= 4.0) {
      indicatorStatus = "Elevated Attention";
      stressLevel = "Elevated";
      fatigueLevel = "High";
      workloadStatus = "High";
      recoveryStatus = "Reduced";
      recommendationText =
        "Consider prioritizing restorative rest windows and consulting the unit welfare coordinator. Workload rebalancing is advised.";
    } else if (avgScore < 65 || stressVal >= 5 || sleepHrs <= 5.5) {
      indicatorStatus = "Moderate Attention";
      stressLevel = "Moderate";
      fatigueLevel = "Moderate";
      workloadStatus = "Elevated";
      recoveryStatus = "Moderate";
      recommendationText =
        "Discuss duty pacing with your squad buddy and ensure adequate circadian recovery between watch shifts.";
    }

    // 1. Save Assessment
    const assessment = await prisma.wellnessAssessment.create({
      data: {
        personnelId: personnel.id,
        score: avgScore,
        indicatorStatus,
        stressLevel,
        fatigueLevel,
        workloadStatus,
        recoveryStatus,
        recommendation: recommendationText,
        voluntaryConsent: true,
        additionalNotes,
        responses: {
          create: [
            { category: "energy", questionKey: "energy", rating: energy, numericValue: sEnergy },
            { category: "sleepQuality", questionKey: "sleepQuality", rating: sleepQuality, numericValue: sSleep },
            { category: "workload", questionKey: "workload", rating: workload, numericValue: sWorkload },
            { category: "recovery", questionKey: "recovery", rating: recovery, numericValue: sRecovery },
            { category: "emotionalFatigue", questionKey: "emotionalFatigue", rating: emotionalFatigue, numericValue: sEmotional },
            { category: "workLifeBalance", questionKey: "workLifeBalance", rating: workLifeBalance, numericValue: sBalance },
            { category: "overallWellbeing", questionKey: "overallWellbeing", rating: overallWellbeing, numericValue: sOverall },
          ],
        },
      },
    });

    // 2. Synthesize ML Telemetry from actual survey parameters
    const totalDeniedLeaves = personnel.leaveRecords.filter((l) => l.status === "DENIED").length;
    const leaveDenialRatio =
      personnel.leaveRecords.length > 0 ? totalDeniedLeaves / personnel.leaveRecords.length : (dutyHours > 60 ? 0.35 : 0.1);

    const telemetry = {
      consecutive_field_days: consecDays,
      duty_hours_5d: dutyHours,
      night_shifts_5d: nightShifts,
      leave_denial_ratio: leaveDenialRatio,
      sleep_hrs_5d_avg: sleepHrs,
      self_reported_energy: energyVal,
      self_reported_stress: stressVal,
      survey_latency_sec: latencySec,
      delta_rhr: (7.5 - sleepHrs) * 2.0,
      masking_index: maskingIndex,
    };

    // 3. Evaluate ML Prediction
    const prediction = await MLClient.evaluate(personnel.id, telemetry);

    // 4. Save Prediction
    const savedPrediction = await prisma.riskPrediction.create({
      data: {
        personnelId: personnel.id,
        assessmentId: assessment.id,
        riskScore: prediction.riskScore,
        riskLevel: prediction.riskLevel,
        alertPriority: prediction.alertPriority,
        maskingDetected: prediction.maskingDetected,
        maskingConfidence: prediction.maskingConfidence,
        modelVersion: prediction.modelVersion,
        factors: {
          create: prediction.factors.map((f) => ({
            featureName: f.feature,
            featureValue: f.value,
            contributionWeight: f.importance,
            description: f.description,
          })),
        },
      },
    });

    // 5. Save Recommendations
    for (const rec of prediction.recommendations) {
      await prisma.recommendation.create({
        data: {
          personnelId: personnel.id,
          predictionId: savedPrediction.id,
          category: rec.category,
          title: rec.title,
          description: rec.description,
          priority: rec.priority,
        },
      });
    }

    // 6. Early Warning Trigger
    if (prediction.earlyWarningTriggered) {
      await prisma.earlyWarning.create({
        data: {
          personnelId: personnel.id,
          unitId: personnel.unitId,
          severity: prediction.earlyWarningTriggered.severity,
          reason: prediction.earlyWarningTriggered.reason,
          triggerCondition: prediction.earlyWarningTriggered.triggerCondition,
          status: "NEW",
        },
      });

      const welfareOfficers = await prisma.user.findMany({
        where: { role: "WELFARE_OFFICER" },
      });

      for (const officer of welfareOfficers) {
        await prisma.notification.create({
          data: {
            userId: officer.id,
            title: `Early Warning (${prediction.earlyWarningTriggered.severity}): ${personnel.name}`,
            message: prediction.earlyWarningTriggered.reason,
            type: "alert",
            category: "Welfare",
            link: "/alerts",
          },
        });
      }
    }

    // 7. Auto-open or update Welfare Case for Welfare Officer visibility
    const priority =
      prediction.riskScore >= 75
        ? "Critical"
        : prediction.riskScore >= 50
        ? "High"
        : prediction.riskScore >= 25
        ? "Moderate"
        : "Low";

    const topFactorsStr = prediction.factors
      .slice(0, 2)
      .map((f) => f.description)
      .join("; ");

    const existingCase = await prisma.welfareCase.findFirst({
      where: {
        personnelId: personnel.id,
        status: { in: ["NEW", "REVIEWING", "SUPPORT_PLANNED", "FOLLOW_UP", "Active Review", "Under Counseling", "Rest Rotation"] },
      },
    });

    const welfareOfficer = await prisma.user.findFirst({ where: { role: "WELFARE_OFFICER" } });

    if (existingCase) {
      await prisma.welfareCase.update({
        where: { id: existingCase.id },
        data: {
          riskScore: prediction.riskScore,
          priority: prediction.riskScore >= existingCase.riskScore ? priority : existingCase.priority,
          reason: `Latest assessment (${prediction.riskLevel} - ${prediction.riskScore}/100). ${topFactorsStr}`,
          notesCount: { increment: 1 },
          updatedAt: new Date(),
        },
      });

      await prisma.caseNote.create({
        data: {
          caseId: existingCase.id,
          authorId: session.userId,
          authorName: session.name || "Automated Clinical Triage",
          text: `Voluntary assessment logged: ${prediction.riskScore}/100 (${prediction.riskLevel}). Contributing factors: ${topFactorsStr || "Normal baseline"}.`,
          isConfidential: true,
        },
      });
    } else {
      const caseId = `CASE-${Date.now().toString().slice(-6)}`;
      await prisma.welfareCase.create({
        data: {
          id: caseId,
          personnelId: personnel.id,
          officerId: welfareOfficer?.id,
          title: `${personnel.name} — Wellness Assessment (${prediction.riskLevel})`,
          reason: `Assessment evaluated at risk score ${prediction.riskScore}/100 (${prediction.riskLevel}). ${topFactorsStr}`,
          priority,
          riskScore: prediction.riskScore,
          status: "NEW",
          notesCount: 1,
        },
      });

      await prisma.caseNote.create({
        data: {
          caseId,
          authorId: session.userId,
          authorName: session.name || "Automated Clinical Triage",
          text: `Case opened from voluntary wellness assessment: Risk Score ${prediction.riskScore}/100 (${prediction.riskLevel}). Factors: ${topFactorsStr || "Baseline assessment"}.`,
          isConfidential: true,
        },
      });
    }

    if (welfareOfficer) {
      await prisma.notification.create({
        data: {
          userId: welfareOfficer.id,
          title: `Assessment Completed: ${personnel.name} (${prediction.riskLevel})`,
          message: `Personnel ${personnel.name} (${personnel.rank}) completed wellness assessment. Risk score: ${prediction.riskScore}/100.`,
          type: prediction.riskLevel === "HIGH" ? "alert" : "info",
          category: "Welfare",
          link: "/welfare/cases",
        },
      }).catch(() => {});
    }

    // 8. Audit Log
    await AuditService.log({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "SUBMIT_ASSESSMENT",
      resource: "WellnessAssessment",
      resourceId: assessment.id,
      metadata: {
        personnelId: personnel.id,
        score: avgScore,
        riskScore: prediction.riskScore,
        riskLevel: prediction.riskLevel,
      },
      ipAddress,
    });

    const riskCategory =
      prediction.riskLevel === "HIGH"
        ? "Critical Breakdown Risk"
        : prediction.riskLevel === "MODERATE"
        ? "Elevated Stress"
        : "Optimal";

    const shapDrivers = prediction.factors.map((f) => ({
      feature: f.feature.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      impact: (Math.abs(f.importance) >= 0.5 ? "high" : Math.abs(f.importance) >= 0.25 ? "moderate" : "low") as "high" | "moderate" | "low",
      description: f.description,
      value: typeof f.value === "number" ? Math.round(f.value * 10) / 10 : f.value,
    }));

    const recommendations = prediction.recommendations.map((r) => r.description);

    const mobileResult = {
      id: assessment.id,
      date: assessment.createdAt.toISOString().split("T")[0],
      riskScore: prediction.riskScore,
      riskCategory,
      predictedDaysToBreakdown: prediction.riskScore > 65 ? 4 : prediction.riskScore > 45 ? 12 : undefined,
      shapDrivers,
      recommendations,
      isMaskingDetected: prediction.maskingDetected,
    };

    return {
      assessment: {
        id: assessment.id,
        personnelId: assessment.personnelId,
        date: assessment.createdAt.toISOString().split("T")[0],
        indicatorStatus: assessment.indicatorStatus,
        score: assessment.score,
        stressLevel: assessment.stressLevel,
        fatigueLevel: assessment.fatigueLevel,
        workloadStatus: assessment.workloadStatus,
        recoveryStatus: assessment.recoveryStatus,
        recommendation: assessment.recommendation,
        voluntaryConsentTimestamp: assessment.voluntaryConsentTimestamp.toISOString(),
      },
      prediction: {
        riskScore: prediction.riskScore,
        riskLevel: prediction.riskLevel,
        alertPriority: prediction.alertPriority,
        factors: prediction.factors,
        recommendations: prediction.recommendations,
      },
      mobileResult,
      // Flat properties for direct mobile consumption
      riskScore: prediction.riskScore,
      riskCategory,
      predictedDaysToBreakdown: mobileResult.predictedDaysToBreakdown,
      shapDrivers,
      recommendations,
      isMaskingDetected: prediction.maskingDetected,
    };
  }

  static async getAssessments(session: SessionPayload) {
    let whereClause = {};
    if (session.role === "PERSONNEL") {
      whereClause = { personnelId: session.personnelId || "P-1024" };
    }

    return prisma.wellnessAssessment.findMany({
      where: whereClause,
      include: {
        personnel: { select: { id: true, name: true, rank: true } },
        prediction: { include: { factors: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  static async getHistory(session: SessionPayload, timeframe: string = "7D") {
    const limit = timeframe === "30D" ? 30 : timeframe === "90D" ? 90 : 7;
    const assessments = await prisma.wellnessAssessment.findMany({
      where: session.role === "PERSONNEL" && session.personnelId ? { personnelId: session.personnelId } : undefined,
      orderBy: { createdAt: "asc" },
      take: limit,
      select: {
        createdAt: true,
        score: true,
        stressLevel: true,
        fatigueLevel: true,
        recoveryStatus: true,
      },
    });

    return assessments.map((a) => ({
      date: a.createdAt.toISOString().split("T")[0],
      score: Math.round(a.score),
      stress: a.stressLevel === "Elevated" ? 75 : a.stressLevel === "Moderate" ? 50 : 25,
      fatigue: a.fatigueLevel === "High" ? 80 : a.fatigueLevel === "Moderate" ? 55 : 30,
      recovery: a.recoveryStatus === "Reduced" ? 35 : a.recoveryStatus === "Moderate" ? 60 : 85,
    }));
  }
}
