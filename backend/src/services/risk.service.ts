import { prisma } from "../lib/db";
import { MLClient } from "../lib/ml-client";

export class RiskService {
  static async generatePrediction(targetId: string, telemetry: any) {
    return MLClient.evaluate(
      targetId,
      telemetry || {
        consecutive_field_days: 35,
        duty_hours_5d: 55,
        night_shifts_5d: 2,
        leave_denial_ratio: 0.2,
        sleep_hrs_5d_avg: 5.8,
        self_reported_energy: 3,
        self_reported_stress: 5,
      }
    );
  }

  static async getRiskHistory() {
    const predictions = await prisma.riskPrediction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        personnel: {
          select: {
            id: true,
            name: true,
            rank: true,
            baseLocation: true,
            activeDeployDays: true,
            unit: { select: { name: true } },
          },
        },
        factors: true,
        recommendations: true,
      },
    });

    let highCount = 0;
    let modCount = 0;
    let lowCount = 0;

    const seenPersonnel = new Set<string>();
    const latestPerPersonnel: typeof predictions = [];

    for (const p of predictions) {
      if (!seenPersonnel.has(p.personnelId)) {
        seenPersonnel.add(p.personnelId);
        latestPerPersonnel.push(p);

        if (p.riskLevel === "HIGH") highCount++;
        else if (p.riskLevel === "MODERATE") modCount++;
        else lowCount++;
      }
    }

    const total = latestPerPersonnel.length || 1;

    const distribution = [
      {
        name: "Low Concern",
        count: lowCount,
        percentage: Math.round((lowCount / total) * 100),
        color: "#10b981",
      },
      {
        name: "Moderate Attention",
        count: modCount,
        percentage: Math.round((modCount / total) * 100),
        color: "#f59e0b",
      },
      {
        name: "Elevated Risk",
        count: highCount,
        percentage: Math.round((highCount / total) * 100),
        color: "#ef4444",
      },
    ];

    return {
      distribution,
      totalPersonnelEvaluated: total,
      analyses: latestPerPersonnel,
    };
  }
}
