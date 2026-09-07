import { PersonnelRiskAnalysis, RiskDistributionItem } from "@/types/risk";
import { MOCK_RISK_DISTRIBUTION, MOCK_RISK_ANALYSES } from "@/lib/mock-data/risk";

export class RiskService {
  static async getRiskDistribution(): Promise<RiskDistributionItem[]> {
    return [...MOCK_RISK_DISTRIBUTION];
  }

  static async getRiskAnalysisById(personnelId: string): Promise<PersonnelRiskAnalysis | null> {
    const key = personnelId.toUpperCase();
    if (MOCK_RISK_ANALYSES[key]) {
      return MOCK_RISK_ANALYSES[key];
    }
    // Return P-1024 as robust fallback if requested ID isn't directly keyed
    return MOCK_RISK_ANALYSES["P-1024"];
  }

  static async getAllRiskAnalyses(): Promise<PersonnelRiskAnalysis[]> {
    return Object.values(MOCK_RISK_ANALYSES);
  }
}
