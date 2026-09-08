import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, handleAuthError } from "@/lib/auth/rbac";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();

    // Query all latest predictions
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

    // Compute distribution counts
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
      { name: "Low Concern", count: lowCount, percentage: Math.round((lowCount / total) * 100), color: "#10b981" },
      { name: "Moderate Attention", count: modCount, percentage: Math.round((modCount / total) * 100), color: "#f59e0b" },
      { name: "Elevated Risk", count: highCount, percentage: Math.round((highCount / total) * 100), color: "#ef4444" },
    ];

    return NextResponse.json({
      distribution,
      totalPersonnelEvaluated: total,
      analyses: latestPerPersonnel,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
