import { prisma } from "../lib/db";

export class ReportService {
  static async getOperationalReport(unitId?: string) {
    const units = await prisma.unit.findMany({
      where: unitId ? { id: unitId } : undefined,
      include: {
        _count: {
          select: {
            personnel: true,
            earlyWarnings: true,
          },
        },
      },
    });

    const totalPredictions = await prisma.riskPrediction.count();
    const lowCount = await prisma.riskPrediction.count({ where: { riskLevel: "LOW" } });
    const moderateCount = await prisma.riskPrediction.count({ where: { riskLevel: "MODERATE" } });
    const highCount = await prisma.riskPrediction.count({ where: { riskLevel: "HIGH" } });

    const earlyWarningsTotal = await prisma.earlyWarning.count();
    const earlyWarningsNew = await prisma.earlyWarning.count({ where: { status: "NEW" } });
    const earlyWarningsAction = await prisma.earlyWarning.count({ where: { status: "ACTION_REQUIRED" } });
    const earlyWarningsResolved = await prisma.earlyWarning.count({ where: { status: "RESOLVED" } });

    const casesTotal = await prisma.welfareCase.count();
    const casesActive = await prisma.welfareCase.count({
      where: { status: { in: ["NEW", "REVIEWING", "SUPPORT_PLANNED", "FOLLOW_UP"] } },
    });
    const casesClosed = await prisma.welfareCase.count({ where: { status: "CLOSED" } });

    const supportActionsCount = await prisma.supportAction.count();

    const workloadAgg = await prisma.workloadRecord.aggregate({
      _avg: {
        dutyHours5d: true,
        nightShifts5d: true,
        sleepHoursAvg: true,
        leaveDaysUnavailed: true,
      },
    });

    const assessments = await prisma.wellnessAssessment.findMany({
      select: { createdAt: true, score: true },
      orderBy: { createdAt: "asc" },
      take: 200,
    });

    const monthlyTrendsMap: Record<string, { totalScore: number; count: number }> = {};
    for (const a of assessments) {
      const monthStr = new Date(a.createdAt).toISOString().slice(0, 7);
      if (!monthlyTrendsMap[monthStr]) {
        monthlyTrendsMap[monthStr] = { totalScore: 0, count: 0 };
      }
      monthlyTrendsMap[monthStr].totalScore += a.score;
      monthlyTrendsMap[monthStr].count += 1;
    }

    const monthlyTrends = Object.entries(monthlyTrendsMap).map(([month, data]) => ({
      month,
      avgWellnessScore: Number((data.totalScore / data.count).toFixed(1)),
      assessmentCount: data.count,
    }));

    return {
      metadata: {
        dataset: "Synthetic Demo Data",
        department: "CRPF, Police II Division - Ministry of Home Affairs",
        generatedAt: new Date().toISOString(),
      },
      data: {
        overview: {
          totalUnits: units.length,
          totalPredictions,
          casesTotal,
          casesActive,
          casesClosed,
          resolutionRatePercent: casesTotal > 0 ? Number(((casesClosed / casesTotal) * 100).toFixed(1)) : 0,
          earlyWarningsTotal,
          earlyWarningsActive: earlyWarningsNew + earlyWarningsAction,
          supportActionsDelivered: supportActionsCount,
        },
        riskDistribution: {
          low: lowCount,
          moderate: moderateCount,
          high: highCount,
          total: totalPredictions,
        },
        earlyWarningBreakdown: {
          new: earlyWarningsNew,
          actionRequired: earlyWarningsAction,
          resolved: earlyWarningsResolved,
          total: earlyWarningsTotal,
        },
        workloadAverages: {
          avgWeeklyHours: Number((workloadAgg._avg?.dutyHours5d || 0).toFixed(1)),
          avgNightShifts: Number((workloadAgg._avg?.nightShifts5d || 0).toFixed(1)),
          avgSleepHours: Number((workloadAgg._avg?.sleepHoursAvg || 0).toFixed(1)),
          avgUnavailedLeaves: Number((workloadAgg._avg?.leaveDaysUnavailed || 0).toFixed(1)),
        },
        unitBreakdown: units.map((u) => ({
          id: u.id,
          name: u.name,
          location: u.location,
          theatre: u.theatre,
          stressLevel: u.stressLevel,
          personnelCount: u._count.personnel,
          earlyWarningsCount: u._count.earlyWarnings,
        })),
        monthlyTrends,
      },
    };
  }
}
