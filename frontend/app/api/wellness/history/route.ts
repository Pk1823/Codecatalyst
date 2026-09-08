import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, handleAuthError } from "@/lib/auth/rbac";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe") || "7D";

    // Query recent assessments
    const assessments = await prisma.wellnessAssessment.findMany({
      where: session.role === "PERSONNEL" && session.personnelId
        ? { personnelId: session.personnelId }
        : undefined,
      orderBy: { createdAt: "asc" },
      take: timeframe === "30D" ? 30 : timeframe === "90D" ? 90 : 7,
      select: {
        createdAt: true,
        score: true,
        stressLevel: true,
        fatigueLevel: true,
        recoveryStatus: true,
      },
    });

    if (assessments.length === 0) {
      return NextResponse.json({ trends: [], message: "No data available." });
    }

    const trends = assessments.map((a) => ({
      date: a.createdAt.toISOString().split("T")[0],
      score: Math.round(a.score),
      stress: a.stressLevel === "Elevated" ? 75 : a.stressLevel === "Moderate" ? 50 : 25,
      fatigue: a.fatigueLevel === "High" ? 80 : a.fatigueLevel === "Moderate" ? 55 : 30,
      recovery: a.recoveryStatus === "Reduced" ? 35 : a.recoveryStatus === "Moderate" ? 60 : 85,
    }));

    return NextResponse.json({ trends });
  } catch (error) {
    return handleAuthError(error);
  }
}
