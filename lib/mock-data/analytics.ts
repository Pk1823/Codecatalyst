import { UnitWorkloadMetric, ForceOverviewStats, ExecutiveInsight } from "@/types/analytics";

export const MOCK_FORCE_STATS: ForceOverviewStats = {
  totalPersonnel: 1248,
  welfareIndexScore: 81.4,
  elevatedRiskCount: 150, // 112 High + 38 Urgent
  activeCasesCount: 24,
  pendingReviewsCount: 9,
  interventionsActiveCount: 18,
  followupsPendingCount: 12,
  modelConfidenceAvg: 93.8,
};

export const MOCK_UNIT_WORKLOAD: UnitWorkloadMetric[] = [
  {
    unit: "Alpha Company",
    totalPersonnel: 260,
    normalCount: 172,
    elevatedCount: 62,
    highCount: 26,
    averageStressScore: 68.4,
    averageDeploymentDays: 174,
    leaveUtilizationPct: 24.5,
    status: "High Pressure",
  },
  {
    unit: "Bravo Company",
    totalPersonnel: 254,
    normalCount: 168,
    elevatedCount: 64,
    highCount: 22,
    averageStressScore: 64.2,
    averageDeploymentDays: 148,
    leaveUtilizationPct: 28.0,
    status: "Elevated Pressure",
  },
  {
    unit: "Charlie Company",
    totalPersonnel: 240,
    normalCount: 202,
    elevatedCount: 30,
    highCount: 8,
    averageStressScore: 42.1,
    averageDeploymentDays: 78,
    leaveUtilizationPct: 56.4,
    status: "Normal",
  },
  {
    unit: "Delta Company",
    totalPersonnel: 246,
    normalCount: 180,
    elevatedCount: 48,
    highCount: 18,
    averageStressScore: 58.6,
    averageDeploymentDays: 115,
    leaveUtilizationPct: 36.2,
    status: "Elevated Pressure",
  },
  {
    unit: "Echo Company",
    totalPersonnel: 248,
    normalCount: 152,
    elevatedCount: 68,
    highCount: 28,
    averageStressScore: 69.8,
    averageDeploymentDays: 162,
    leaveUtilizationPct: 22.8,
    status: "High Pressure",
  },
];

export const MOCK_EXECUTIVE_INSIGHTS: ExecutiveInsight[] = [
  {
    id: "ins-1",
    title: "Elevated Workload Pressure in 3 Units",
    description: "Units Alpha, Bravo, and Echo currently show sustained elevated workload indicators above the 65% operational baseline.",
    category: "Workload",
    impact: "High",
    unit: "Alpha, Bravo, Echo",
    simulatedTag: "Simulated insights based on synthetic demo data",
  },
  {
    id: "ins-2",
    title: "Deployment Duration Increased by 18% This Quarter",
    description: "Average deployment duration in forward operational posts rose to 143 days compared to 121 days in Q3.",
    category: "Deployment",
    impact: "Medium",
    simulatedTag: "Simulated insights based on synthetic demo data",
  },
  {
    id: "ins-3",
    title: "Leave Utilization 32% Below Historical Baseline",
    description: "Personnel accumulated leave clearance is delayed due to consecutive operational commitments. Rotational leave drives recommended.",
    category: "Leave",
    impact: "High",
    simulatedTag: "Simulated insights based on synthetic demo data",
  },
  {
    id: "ins-4",
    title: "12% of Force Shows Elevated Welfare Indicators",
    description: "Predictive indicators identified 150 personnel who would benefit from early welfare officer review or duty rotation before acute fatigue sets in.",
    category: "Welfare",
    impact: "High",
    simulatedTag: "Simulated insights based on synthetic demo data",
  },
];

export const MOCK_HISTORICAL_STRESS_TREND = [
  { month: "Sep", avgStress: 42, deploymentStrain: 38, leaveDeficit: 35 },
  { month: "Oct", avgStress: 46, deploymentStrain: 42, leaveDeficit: 40 },
  { month: "Nov", avgStress: 52, deploymentStrain: 49, leaveDeficit: 48 },
  { month: "Dec", avgStress: 61, deploymentStrain: 58, leaveDeficit: 55 },
  { month: "Jan", avgStress: 66, deploymentStrain: 64, leaveDeficit: 62 },
  { month: "Feb", avgStress: 63, deploymentStrain: 61, leaveDeficit: 59 },
  { month: "Mar", avgStress: 59, deploymentStrain: 56, leaveDeficit: 54 },
];
