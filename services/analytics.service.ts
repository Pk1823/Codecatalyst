import { ForceOverviewStats, UnitWorkloadMetric, ExecutiveInsight } from "@/types/analytics";
import { MOCK_FORCE_STATS, MOCK_UNIT_WORKLOAD, MOCK_EXECUTIVE_INSIGHTS, MOCK_HISTORICAL_STRESS_TREND } from "@/lib/mock-data/analytics";

export class AnalyticsService {
  static async getForceStats(): Promise<ForceOverviewStats> {
    return { ...MOCK_FORCE_STATS };
  }

  static async getUnitWorkload(): Promise<UnitWorkloadMetric[]> {
    return [...MOCK_UNIT_WORKLOAD];
  }

  static async getExecutiveInsights(): Promise<ExecutiveInsight[]> {
    return [...MOCK_EXECUTIVE_INSIGHTS];
  }

  static async getHistoricalStressTrend() {
    return [...MOCK_HISTORICAL_STRESS_TREND];
  }
}
