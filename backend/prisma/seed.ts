import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("[*] Seeding MISSIONWELL AI synthetic demo database...");

  // Clear existing records to ensure clean reproducible demo state
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.caseNote.deleteMany();
  await prisma.supportAction.deleteMany();
  await prisma.welfareCase.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.earlyWarning.deleteMany();
  await prisma.riskFactor.deleteMany();
  await prisma.riskPrediction.deleteMany();
  await prisma.wellnessResponse.deleteMany();
  await prisma.wellnessAssessment.deleteMany();
  await prisma.workloadRecord.deleteMany();
  await prisma.trainingRecord.deleteMany();
  await prisma.leaveRecord.deleteMany();
  await prisma.dutySchedule.deleteMany();
  await prisma.deployment.deleteMany();
  await prisma.consent.deleteMany();
  await prisma.personnel.deleteMany();
  await prisma.user.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.modelVersion.deleteMany();

  const passwordHash = await bcrypt.hash("demo123", 10);

  // 1. Operational Units (Synthetic Demo Data)
  const unitAlpha = await prisma.unit.create({
    data: {
      id: "unit-114-alpha",
      name: "114 Bn - Alpha Coy",
      force: "CRPF",
      location: "Srinagar Sector Grid",
      theatre: "Northern Command / Counter-Insurgency Grid",
      commandingOfficer: "Col. Vikram Singh",
      stressLevel: "Moderate (54%)",
    },
  });

  const unitBravo = await prisma.unit.create({
    data: {
      id: "unit-114-bravo",
      name: "114 Bn - Bravo Coy",
      force: "CRPF",
      location: "Forward Line-of-Control Outpost",
      theatre: "Forward High-Altitude Sector",
      commandingOfficer: "Maj. S.K. Rathore",
      stressLevel: "Elevated (78%)",
    },
  });

  const unitCharlie = await prisma.unit.create({
    data: {
      id: "unit-114-charlie",
      name: "114 Bn - Charlie Coy",
      force: "CRPF",
      location: "Rear Logistics Base",
      theatre: "Support Depot Grid",
      commandingOfficer: "Capt. Arvind Nair",
      stressLevel: "Optimal (42%)",
    },
  });

  const unitDelta = await prisma.unit.create({
    data: {
      id: "unit-114-delta",
      name: "114 Bn - Delta Coy",
      force: "CRPF",
      location: "Outpost 4 / Nala Crossing",
      theatre: "Active Counter-Infiltration Picket",
      commandingOfficer: "Maj. R.P. Joshi",
      stressLevel: "Severe (84%)",
    },
  });

  const unitHQ = await prisma.unit.create({
    data: {
      id: "unit-114-hq",
      name: "114 Bn - HQ & Support Coy",
      force: "CRPF",
      location: "Main Battalion Headquarters",
      theatre: "Central Command & Communications",
      commandingOfficer: "Col. Vikram Singh",
      stressLevel: "Optimal (38%)",
    },
  });

  // 2. Demo Users for all 4 Roles
  const userPersonnel = await prisma.user.create({
    data: {
      email: "rawat.piyush@crpf.gov.in",
      serviceId: "CRPF-GD-2021-04128",
      passwordHash,
      name: "Ct. Piyush Rawat",
      role: "PERSONNEL",
      rank: "Constable (GD)",
      force: "CRPF",
      department: "Infantry / Alpha Coy",
      unitId: unitAlpha.id,
    },
  });

  const userWelfare = await prisma.user.create({
    data: {
      email: "dr.sharma.aarti@crpf.gov.in",
      serviceId: "MED-DIR-0881",
      passwordHash,
      name: "Dr. Aarti Sharma",
      role: "WELFARE_OFFICER",
      rank: "Chief Medical Officer (SG)",
      force: "CRPF",
      department: "Medical & Psychological Health Directorate",
      unitId: unitHQ.id,
    },
  });

  const userCommander = await prisma.user.create({
    data: {
      email: "col.singh.vikram@crpf.gov.in",
      serviceId: "CMD-SECTOR-01",
      passwordHash,
      name: "Col. Vikram Singh",
      role: "COMMANDER",
      rank: "Commandant (114 Bn)",
      force: "CRPF",
      department: "Tactical Command",
      unitId: unitHQ.id,
    },
  });

  const userAdmin = await prisma.user.create({
    data: {
      email: "patel.rk@nic.in",
      serviceId: "NIC-SYS-9940",
      passwordHash,
      name: "Sh. R.K. Patel",
      role: "ADMIN",
      rank: "Senior Systems Director (NIC)",
      force: "CRPF",
      department: "National Informatics Centre / MHA IT Cell",
      unitId: unitHQ.id,
    },
  });

  // 3. Personnel Records
  const p1024 = await prisma.personnel.create({
    data: {
      id: "P-1024",
      userId: userPersonnel.id,
      serviceNumber: "CRPF-GD-2021-04128",
      name: "Ct. Piyush Rawat",
      rank: "Constable (GD)",
      force: "CRPF",
      gender: "MALE",
      bloodGroup: "B+",
      dateOfJoining: new Date("2021-04-15"),
      unitId: unitAlpha.id,
      baseLocation: "Srinagar Sector Grid",
      activeDeployDays: 65,
      currentDutyStatus: "Active Duty",
    },
  });

  const p1025 = await prisma.personnel.create({
    data: {
      id: "P-1025",
      serviceNumber: "CRPF-GD-2018-09821",
      name: "Hav. Rajesh Kumar",
      rank: "Havildar",
      force: "CRPF",
      gender: "MALE",
      bloodGroup: "O+",
      dateOfJoining: new Date("2018-02-10"),
      unitId: unitBravo.id,
      baseLocation: "Forward Line-of-Control Outpost",
      activeDeployDays: 142,
      currentDutyStatus: "Active Duty",
    },
  });

  const p1026 = await prisma.personnel.create({
    data: {
      id: "P-1026",
      serviceNumber: "CRPF-GD-2020-03342",
      name: "Ct. Amit Sharma",
      rank: "Constable (GD)",
      force: "CRPF",
      gender: "MALE",
      bloodGroup: "A+",
      dateOfJoining: new Date("2020-08-20"),
      unitId: unitDelta.id,
      baseLocation: "Outpost 4 / Nala Crossing",
      activeDeployDays: 110,
      currentDutyStatus: "Medical Review",
    },
  });

  const p1027 = await prisma.personnel.create({
    data: {
      id: "P-1027",
      serviceNumber: "CRPF-GD-2019-07412",
      name: "Nk. Suresh Patel",
      rank: "Naik",
      force: "CRPF",
      gender: "MALE",
      bloodGroup: "AB+",
      dateOfJoining: new Date("2019-11-05"),
      unitId: unitCharlie.id,
      baseLocation: "Rear Logistics Base",
      activeDeployDays: 25,
      currentDutyStatus: "On Leave",
    },
  });

  // 4. Deployments, Shifts & Workload Records
  await prisma.deployment.createMany({
    data: [
      {
        personnelId: p1024.id,
        location: "Baramulla Highway Patrol Grid",
        terrain: "Counter-Insurgency",
        startDate: new Date("2026-06-01"),
        isCurrent: true,
        consecutiveDays: 65,
        stressWeight: 1.2,
      },
      {
        personnelId: p1025.id,
        location: "Kupwara Forward Ridge Picket",
        terrain: "High Altitude Outpost",
        startDate: new Date("2026-04-10"),
        isCurrent: true,
        consecutiveDays: 142,
        stressWeight: 1.8,
      },
      {
        personnelId: p1026.id,
        location: "Delta Nala Crossing Point",
        terrain: "Counter-Infiltration",
        startDate: new Date("2026-05-15"),
        isCurrent: true,
        consecutiveDays: 110,
        stressWeight: 1.6,
      },
    ],
  });

  await prisma.workloadRecord.createMany({
    data: [
      {
        personnelId: p1024.id,
        periodStart: new Date("2026-09-01"),
        periodEnd: new Date("2026-09-07"),
        dutyHours5d: 64.0,
        nightShifts5d: 3,
        sleepHoursAvg: 5.2,
        leaveDaysUnavailed: 32,
        deltaRestingHR: 4.5,
        surveyLatencySec: 42.0,
      },
      {
        personnelId: p1025.id,
        periodStart: new Date("2026-09-01"),
        periodEnd: new Date("2026-09-07"),
        dutyHours5d: 76.5,
        nightShifts5d: 4,
        sleepHoursAvg: 3.8,
        leaveDaysUnavailed: 45,
        deltaRestingHR: 7.2,
        surveyLatencySec: 12.0, // fast survey indicative of stress masking
      },
    ],
  });

  await prisma.leaveRecord.createMany({
    data: [
      {
        personnelId: p1024.id,
        leaveType: "Earned Leave",
        daysRequested: 15,
        startDate: new Date("2026-07-10"),
        endDate: new Date("2026-07-25"),
        status: "DENIED",
        denialReason: "Operational exigency / counter-insurgency high alert",
      },
      {
        personnelId: p1025.id,
        leaveType: "Casual Leave",
        daysRequested: 10,
        startDate: new Date("2026-06-15"),
        endDate: new Date("2026-06-25"),
        status: "DENIED",
        denialReason: "Picket strength shortage during cross-border alert",
      },
    ],
  });

  // 5. Voluntary Wellness Assessment & Responses for P-1024
  const assessment1 = await prisma.wellnessAssessment.create({
    data: {
      personnelId: p1024.id,
      score: 58.0,
      indicatorStatus: "Moderate Attention",
      stressLevel: "Moderate",
      fatigueLevel: "Moderate",
      workloadStatus: "Elevated",
      recoveryStatus: "Moderate",
      recommendation: "Consider discussing duty pacing with your company coordinator and prioritizing restorative sleep windows.",
      voluntaryConsent: true,
      additionalNotes: "Feeling tired after back-to-back night patrols. Looking forward to family leave.",
      responses: {
        create: [
          { category: "energy", questionKey: "energy", rating: "Moderate", numericValue: 55 },
          { category: "sleepQuality", questionKey: "sleepQuality", rating: "Low", numericValue: 30 },
          { category: "workload", questionKey: "workload", rating: "Good", numericValue: 80 },
          { category: "recovery", questionKey: "recovery", rating: "Moderate", numericValue: 55 },
          { category: "emotionalFatigue", questionKey: "emotionalFatigue", rating: "Moderate", numericValue: 55 },
          { category: "workLifeBalance", questionKey: "workLifeBalance", rating: "Low", numericValue: 30 },
          { category: "overallWellbeing", questionKey: "overallWellbeing", rating: "Moderate", numericValue: 55 },
        ],
      },
    },
  });

  // 6. ML Risk Predictions & SHAP Factor Attribution
  const pred1 = await prisma.riskPrediction.create({
    data: {
      personnelId: p1024.id,
      assessmentId: assessment1.id,
      riskScore: 58.0,
      riskLevel: "MODERATE",
      alertPriority: "ROUTINE",
      maskingDetected: false,
      modelVersion: "v1.2.0-sentinel-rf",
      factors: {
        create: [
          { featureName: "duty_hours_5d", featureValue: 64.0, contributionWeight: 26.0, description: "Elevated 5-day cumulative duty load (64.0h accrued)" },
          { featureName: "consecutive_field_days", featureValue: 65.0, contributionWeight: 24.0, description: "Active operational deployment without base rotation (65 days)" },
          { featureName: "sleep_hrs_5d_avg", featureValue: 5.2, contributionWeight: 20.0, description: "Reduced restorative sleep duration (<5.5h daily average)" },
          { featureName: "leave_denial_ratio", featureValue: 0.35, contributionWeight: 16.0, description: "Recent family furlough request deferred" },
          { featureName: "self_reported_stress", featureValue: 6.0, contributionWeight: 14.0, description: "Subjective self-reported stress elevation" },
        ],
      },
    },
  });

  const pred2 = await prisma.riskPrediction.create({
    data: {
      personnelId: p1025.id,
      riskScore: 78.0,
      riskLevel: "HIGH",
      alertPriority: "URGENT",
      maskingDetected: true,
      maskingConfidence: 0.85,
      modelVersion: "v1.2.0-sentinel-rf",
      factors: {
        create: [
          { featureName: "consecutive_field_days", featureValue: 142.0, contributionWeight: 27.0, description: "Extended forward high-altitude deployment (142 continuous days)" },
          { featureName: "duty_hours_5d", featureValue: 76.5, contributionWeight: 23.0, description: "Severe duty overload with 4 consecutive night sentry shifts" },
          { featureName: "sleep_hrs_5d_avg", featureValue: 3.8, contributionWeight: 19.0, description: "Critical circadian sleep deficit (<4.0h daily sleep)" },
          { featureName: "leave_denial_ratio", featureValue: 0.50, contributionWeight: 16.0, description: "45 accumulated leave days unavailed; leave deferred twice" },
          { featureName: "masking_index", featureValue: 0.48, contributionWeight: 15.0, description: "High behavioral masking index (reports zero stress despite heavy strain)" },
        ],
      },
    },
  });

  // 7. Early Warnings (Rule-Based Triggers)
  const ew1 = await prisma.earlyWarning.create({
    data: {
      personnelId: p1025.id,
      unitId: unitBravo.id,
      severity: "CRITICAL",
      reason: "Prolonged forward deployment (142 days) coupled with consecutive night shifts and severe sleep deficit.",
      triggerCondition: "MULTI_FACTOR_CRITICAL_ACCUMULATION",
      status: "NEW",
    },
  });

  const ew2 = await prisma.earlyWarning.create({
    data: {
      personnelId: p1024.id,
      unitId: unitAlpha.id,
      severity: "MODERATE",
      reason: "Recent duty hours spike paired with delayed leave clearance.",
      triggerCondition: "HIGH_HOURS_LOW_SLEEP",
      status: "REVIEWING",
    },
  });

  const ew3 = await prisma.earlyWarning.create({
    data: {
      personnelId: p1026.id,
      unitId: unitDelta.id,
      severity: "HIGH",
      reason: "Exceeded 100 days in forward sector without mandatory 72h rest recovery cycle.",
      triggerCondition: "EXTENDED_DEPLOYMENT_LEAVE_STARVED",
      status: "ACTION_REQUIRED",
    },
  });

  // 8. Welfare Cases (Managed by Welfare Officer Dr. Aarti Sharma)
  const case1 = await prisma.welfareCase.create({
    data: {
      id: "CASE-2026-0881",
      personnelId: p1025.id,
      officerId: userWelfare.id,
      title: "Havildar Rajesh Kumar — Forward Outpost Fatigue Review",
      reason: "Automated early warning triggered by 142 continuous field days and circadian sleep deficit.",
      priority: "Critical",
      status: "REVIEWING",
      riskScore: 78.0,
      notesCount: 2,
      interventionsCount: 1,
      followUpDate: new Date("2026-09-12"),
      caseNotes: {
        create: [
          {
            authorId: userWelfare.id,
            authorName: "Dr. Aarti Sharma",
            text: "Telemetry indicates severe sleep disruption (avg 3.8h) and behavioral masking. Recommend immediate 48h rest rotation before next night watch.",
            isConfidential: true,
          },
          {
            authorId: userWelfare.id,
            authorName: "Dr. Aarti Sharma",
            text: "Spoke informally with company subedar. Havildar Kumar has had family leave deferred twice. Processing expedited 15-day family furlough.",
            isConfidential: true,
          },
        ],
      },
      supportActions: {
        create: [
          {
            actionType: "Rest Stand-Down",
            title: "48-Hour Nocturnal Rest Stand-Down",
            description: "Excused from overnight sentry duty; scheduled for circadian restorative sleep windows.",
            officerName: "Dr. Aarti Sharma",
            status: "In_Progress",
            scheduledDate: new Date("2026-09-09"),
          },
        ],
      },
    },
  });

  const case2 = await prisma.welfareCase.create({
    data: {
      id: "CASE-2026-0882",
      personnelId: p1024.id,
      officerId: userWelfare.id,
      title: "Ct. Piyush Rawat — Workload Pacing & Furlough Support",
      reason: "Self-assessment indicated moderate emotional fatigue and delayed leave request.",
      priority: "Moderate",
      status: "SUPPORT_PLANNED",
      riskScore: 58.0,
      notesCount: 1,
      interventionsCount: 1,
      followUpDate: new Date("2026-09-18"),
      caseNotes: {
        create: [
          {
            authorId: userWelfare.id,
            authorName: "Dr. Aarti Sharma",
            text: "Personnel completed voluntary 7-step assessment. Workload pacing review initiated with Alpha Coy platoon commander.",
            isConfidential: true,
          },
        ],
      },
      supportActions: {
        create: [
          {
            actionType: "Duty Pacing",
            title: "Duty Pacing & Peer Check-In",
            description: "Paired with senior buddy soldier for convoy escorts; rebalancing daytime watch allocations.",
            officerName: "Dr. Aarti Sharma",
            status: "Planned",
            scheduledDate: new Date("2026-09-15"),
          },
        ],
      },
    },
  });

  // 9. Recommendations
  await prisma.recommendation.createMany({
    data: [
      {
        personnelId: p1025.id,
        predictionId: pred2.id,
        category: "Rest & Recovery",
        title: "Mandatory Circadian Rest Stabilization",
        description: "Enforce a 36-hour nocturnal recovery buffer before next rotational night sentry watch.",
        priority: "High",
        status: "Active",
      },
      {
        personnelId: p1025.id,
        predictionId: pred2.id,
        category: "Leave Clearance",
        title: "Expedited Family Furlough Processing",
        description: "Review accrued 45-day earned leave balance for priority home visit authorization.",
        priority: "High",
        status: "Active",
      },
      {
        personnelId: p1024.id,
        predictionId: pred1.id,
        category: "Duty Adjustment",
        title: "Balanced Watch Rotation",
        description: "Rebalance sentry duty roster to avoid back-to-back night watches.",
        priority: "Moderate",
        status: "Active",
      },
      {
        personnelId: p1024.id,
        predictionId: pred1.id,
        category: "Peer Support",
        title: "Informal Peer-Buddy Check-In",
        description: "Encourage informal squad-level buddy check-in during non-duty hours.",
        priority: "Low",
        status: "Acknowledged",
      },
    ],
  });

  // 10. In-App Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: userWelfare.id,
        title: "Critical Risk Triage: Havildar Rajesh Kumar",
        message: "Severe sleep deficit and prolonged deployment detected. Case CASE-2026-0881 opened.",
        type: "alert",
        category: "Welfare",
        read: false,
        link: "/welfare/cases",
      },
      {
        userId: userWelfare.id,
        title: "New Assessment Submitted: Ct. Piyush Rawat",
        message: "Voluntary self-assessment completed with moderate fatigue index.",
        type: "info",
        category: "Welfare",
        read: false,
        link: "/welfare/cases",
      },
      {
        userId: userPersonnel.id,
        title: "Wellness Assessment Logged",
        message: "Your confidential wellness self-check has been securely recorded for welfare planning.",
        type: "info",
        category: "Personal",
        read: true,
        link: "/personnel",
      },
      {
        userId: userCommander.id,
        title: "Sector Workload Summary Updated",
        message: "Bravo Coy shows elevated squad strain index. Tactical duty adjustments recommended.",
        type: "warning",
        category: "Command",
        read: false,
        link: "/commander",
      },
    ],
  });

  // 11. Initial Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: userAdmin.id,
        actorName: "Sh. R.K. Patel",
        actorRole: "ADMIN",
        action: "SYSTEM_INITIALIZE",
        resource: "System",
        metadata: JSON.stringify({ event: "Initial database seed completed with synthetic demo data" }),
      },
      {
        actorId: userWelfare.id,
        actorName: "Dr. Aarti Sharma",
        actorRole: "WELFARE_OFFICER",
        action: "CREATE_CASE",
        resource: "WelfareCase",
        resourceId: case1.id,
        metadata: JSON.stringify({ personnelId: p1025.id, priority: "Critical", riskScore: 78.0 }),
      },
      {
        actorId: userPersonnel.id,
        actorName: "Ct. Piyush Rawat",
        actorRole: "PERSONNEL",
        action: "SUBMIT_ASSESSMENT",
        resource: "WellnessAssessment",
        resourceId: assessment1.id,
        metadata: JSON.stringify({ score: 58.0, voluntaryConsent: true }),
      },
    ],
  });

  // 12. Model Version
  await prisma.modelVersion.create({
    data: {
      version: "v1.2.0-sentinel-rf",
      modelType: "LightGBM / Tree SHAP Explainer with Anti-Masking Guardrails",
      trainingDataset: "Synthetic Demo Data (N=5,000 Armed Forces / CAPF Profiles)",
      status: "PRODUCTION",
      description: "Trained on synthetic operational telemetry including continuous field days, shift irregularity, and sleep deficit.",
    },
  });

  console.log("[+] Database successfully seeded with synthetic demo records for all 4 roles!");
}

main()
  .catch((e) => {
    console.error("[!] Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
