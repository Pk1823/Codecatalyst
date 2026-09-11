import { ApiClient } from "./api";
import { UnitReadinessMetric, DarbarRequest } from "../types";

export const MOCK_UNIT_METRICS: UnitReadinessMetric[] = [
  {
    unitId: "114-coy-a",
    unitName: "Alpha Company (Sukma CI Grid)",
    totalPersonnel: 135,
    optimalPercentage: 68,
    moderatePercentage: 22,
    highRiskPercentage: 10,
    overallReadinessScore: 84,
    pendingDarbarCount: 3,
  },
  {
    unitId: "114-coy-b",
    unitName: "Bravo Company (Dornapal)",
    totalPersonnel: 140,
    optimalPercentage: 74,
    moderatePercentage: 18,
    highRiskPercentage: 8,
    overallReadinessScore: 88,
    pendingDarbarCount: 1,
  },
  {
    unitId: "114-coy-c",
    unitName: "Charlie Company (Konta Sector)",
    totalPersonnel: 130,
    optimalPercentage: 55,
    moderatePercentage: 30,
    highRiskPercentage: 15,
    overallReadinessScore: 72,
    pendingDarbarCount: 5,
  },
];

export const MOCK_PENDING_DARBARS: DarbarRequest[] = [
  {
    id: "DBR-9041",
    date: "2026-09-10",
    reasonCategory: "Family Emergency",
    targetOfficer: "Commanding Officer (CO)",
    status: "PENDING",
    confidentialNotes: "Requesting compassionate leave regularisation due to father's emergency hospitalisation.",
  },
  {
    id: "DBR-9039",
    date: "2026-09-09",
    reasonCategory: "Medical / Fatigue",
    targetOfficer: "Subedar Major (SM)",
    status: "PENDING",
    confidentialNotes: "High altitude knee strain following prolonged patrol rotation.",
  },
];

export class CommanderService {
  public static async getUnitReadiness(): Promise<UnitReadinessMetric[]> {
    try {
      const data = await ApiClient.get<{ metrics: UnitReadinessMetric[] }>("/risk/unit-heatmap");
      return data.metrics || MOCK_UNIT_METRICS;
    } catch {
      return MOCK_UNIT_METRICS;
    }
  }

  public static async getPendingDarbars(): Promise<DarbarRequest[]> {
    return MOCK_PENDING_DARBARS;
  }

  public static async resolveDarbar(id: string, action: "SCHEDULED" | "RESOLVED", slot?: string): Promise<boolean> {
    const item = MOCK_PENDING_DARBARS.find((d) => d.id === id);
    if (item) {
      item.status = action;
      if (slot) item.scheduledSlot = slot;
    }
    return true;
  }
}
