export interface UnitWorkloadMetric {
  unit: string;
  totalPersonnel: number;
  normalCount: number;
  elevatedCount: number;
  highCount: number;
  averageStressScore: number;
  averageDeploymentDays: number;
  leaveUtilizationPct: number;
  status: "Normal" | "Elevated Pressure" | "High Pressure";
}

export interface ForceOverviewStats {
  totalPersonnel: number;
  welfareIndexScore: number; // 0-100
  elevatedRiskCount: number;
  activeCasesCount: number;
  pendingReviewsCount: number;
  interventionsActiveCount: number;
  followupsPendingCount: number;
  modelConfidenceAvg: number;
}

export interface ExecutiveInsight {
  id: string;
  title: string;
  description: string;
  category: "Workload" | "Deployment" | "Leave" | "Welfare";
  impact: "High" | "Medium" | "Informational";
  unit?: string;
  simulatedTag: string;
}
