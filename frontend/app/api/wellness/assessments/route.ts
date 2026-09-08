import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, handleAuthError } from "@/lib/auth/rbac";
import { MLPredictor } from "@/lib/ml/predictor";
import { AuditService } from "@/services/audit.service";

const RATING_SCORES: Record<string, number> = {
  "Very Low": 10,
  Low: 30,
  Moderate: 55,
  Good: 80,
  "Very Good": 95,
};

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    // Determine target personnel ID
    const targetPersonnelId = (
      body.personnelId ||
      session.personnelId ||
      "P-1024"
    ).toUpperCase();

    // Verify personnel exists
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
      return NextResponse.json({ error: "Personnel profile not found." }, { status: 404 });
    }

    // Extract assessment inputs
    const {
      energy = "Moderate",
      sleepQuality = "Moderate",
      workload = "Low",
      recovery = "Moderate",
      emotionalFatigue = "Moderate",
      workLifeBalance = "Moderate",
      overallWellbeing = "Moderate",
      additionalNotes = "",
    } = body;

    const sEnergy = RATING_SCORES[energy] || 55;
    const sSleep = RATING_SCORES[sleepQuality] || 55;
    const sWorkload = RATING_SCORES[workload] || 55;
    const sRecovery = RATING_SCORES[recovery] || 55;
    const sEmotional = RATING_SCORES[emotionalFatigue] || 55;
    const sBalance = RATING_SCORES[workLifeBalance] || 55;
    const sOverall = RATING_SCORES[overallWellbeing] || 55;

    const avgScore = Math.round((sEnergy + sSleep + sWorkload + sRecovery + sEmotional + sBalance + sOverall) / 7);

    let indicatorStatus = "Low Concern";
    let stressLevel = "Low";
    let fatigueLevel = "Low";
    let workloadStatus = "Optimal";
    let recoveryStatus = "Adequate";
    let recommendationText = "Your indicators show a healthy operational baseline. Maintain restorative hydration and regular sleep windows.";

    if (avgScore < 45) {
      indicatorStatus = "Elevated Attention";
      stressLevel = "Elevated";
      fatigueLevel = "High";
      workloadStatus = "High";
      recoveryStatus = "Reduced";
      recommendationText = "Consider prioritizing restorative rest windows and consulting the unit welfare coordinator. Workload rebalancing is advised.";
    } else if (avgScore < 65) {
      indicatorStatus = "Moderate Attention";
      stressLevel = "Moderate";
      fatigueLevel = "Moderate";
      workloadStatus = "Elevated";
      recoveryStatus = "Moderate";
      recommendationText = "Discuss duty pacing with your squad buddy and ensure adequate circadian recovery between watch shifts.";
    }

    // 1. Create WellnessAssessment and responses
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

    // 2. Synthesize features for ML Engine
    const currentDeploy = personnel.deployments[0];
    const latestWorkload = personnel.workloadRecords[0];
    const totalDeniedLeaves = personnel.leaveRecords.filter((l) => l.status === "DENIED").length;
    const leaveDenialRatio = personnel.leaveRecords.length > 0 ? totalDeniedLeaves / personnel.leaveRecords.length : 0.2;

    const selfStressNum = stressLevel === "Elevated" ? 8 : stressLevel === "Moderate" ? 5 : 2;
    const selfEnergyNum = energy === "Very Low" ? 1 : energy === "Low" ? 2 : energy === "Moderate" ? 3 : energy === "Good" ? 4 : 5;

    const telemetryPayload = {
      consecutive_field_days: currentDeploy ? currentDeploy.consecutiveDays : personnel.activeDeployDays,
      duty_hours_5d: latestWorkload ? latestWorkload.dutyHours5d : 58.0,
      night_shifts_5d: latestWorkload ? latestWorkload.nightShifts5d : 2,
      leave_denial_ratio: leaveDenialRatio,
      sleep_hrs_5d_avg: latestWorkload ? latestWorkload.sleepHoursAvg : 5.4,
      self_reported_energy: selfEnergyNum,
      self_reported_stress: selfStressNum,
      survey_latency_sec: latestWorkload?.surveyLatencySec || 42.0,
      delta_rhr: latestWorkload?.deltaRestingHR || 3.0,
    };

    // 3. Invoke ML Engine for calibrated risk scoring & SHAP factor attribution
    const prediction = await MLPredictor.evaluate(personnel.id, telemetryPayload);

    // 4. Persist RiskPrediction and RiskFactors
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

    // 5. Persist Recommendations
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

    // 6. Handle Early Warning triggers
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

      // Find Welfare Officers to notify
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

    // 7. Auto-open Welfare Case if High Risk
    if (prediction.riskLevel === "HIGH") {
      const existingCase = await prisma.welfareCase.findFirst({
        where: { personnelId: personnel.id, status: { in: ["NEW", "REVIEWING", "SUPPORT_PLANNED"] } },
      });

      if (!existingCase) {
        const welfareOfficer = await prisma.user.findFirst({ where: { role: "WELFARE_OFFICER" } });
        await prisma.welfareCase.create({
          data: {
            id: `CASE-${Date.now().toString().slice(-6)}`,
            personnelId: personnel.id,
            officerId: welfareOfficer?.id,
            title: `${personnel.name} — Automated Triage Review`,
            reason: `High wellness risk indicator (${prediction.riskScore}/100) detected from voluntary assessment.`,
            priority: prediction.riskScore >= 80 ? "Critical" : "High",
            riskScore: prediction.riskScore,
            status: "NEW",
          },
        });
      }
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
    });

    return NextResponse.json({
      success: true,
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
        maskingDetected: prediction.maskingDetected,
        factors: prediction.factors,
        recommendations: prediction.recommendations,
      },
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();

    let whereClause = {};
    if (session.role === "PERSONNEL") {
      whereClause = { personnelId: session.personnelId || "P-1024" };
    }

    const assessments = await prisma.wellnessAssessment.findMany({
      where: whereClause,
      include: {
        personnel: { select: { id: true, name: true, rank: true } },
        prediction: { include: { factors: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ assessments });
  } catch (error) {
    return handleAuthError(error);
  }
}
