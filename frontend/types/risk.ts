export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "URGENT REVIEW";

export interface ContributingFactor {
  factor: string;
  percentage: number;
  description: string;
  category: "Operational" | "Recovery" | "Schedule" | "Voluntary" | "Deployment";
}

export interface PersonnelRiskAnalysis {
  personnelId: string;
  anonymizedCode: string;
  rank: string;
  unit: string;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  trend: "Improving" | "Stable" | "Worsening";
  lastAssessmentDate: string;
  modelConfidence: number; // percentage e.g. 94%
  contributingFactors: ContributingFactor[];
  recommendedActions: string[];
  disclaimer: string;
  hasActiveWelfareCase: boolean;
  activeCaseId?: string;
}

export interface RiskDistributionItem {
  level: RiskLevel;
  count: number;
  percentage: number;
  color: string;
}
