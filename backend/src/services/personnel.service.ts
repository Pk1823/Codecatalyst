import { prisma } from "../lib/db";
import { SessionPayload } from "../lib/jwt";
import { canAccessPersonnel } from "../middleware/auth.middleware";

export class PersonnelService {
  static async getPersonnelList(session: SessionPayload) {
    if (session.role === "PERSONNEL") {
      if (!session.personnelId) {
        return [];
      }
      const record = await prisma.personnel.findUnique({
        where: { id: session.personnelId },
        include: {
          unit: true,
          riskPredictions: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      });
      return record ? [record] : [];
    }

    return prisma.personnel.findMany({
      include: {
        unit: true,
        riskPredictions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { name: "asc" },
    });
  }

  static async getPersonnelDetail(session: SessionPayload, personnelId: string) {
    const upperId = personnelId.toUpperCase();
    if (!canAccessPersonnel(session, upperId)) {
      throw new Error("FORBIDDEN");
    }

    const isCommander = session.role === "COMMANDER";

    const record = await prisma.personnel.findUnique({
      where: { id: upperId },
      include: {
        unit: true,
        deployments: { orderBy: { startDate: "desc" }, take: 5 },
        dutySchedules: { orderBy: { date: "desc" }, take: 7 },
        leaveRecords: { orderBy: { startDate: "desc" }, take: 5 },
        workloadRecords: { orderBy: { periodStart: "desc" }, take: 3 },
        riskPredictions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { factors: true, recommendations: true },
        },
        wellnessAssessments: isCommander
          ? false
          : {
              orderBy: { createdAt: "desc" },
              take: 5,
              include: { responses: true },
            },
        welfareCases: {
          orderBy: { createdAt: "desc" },
          take: 3,
          include: { caseNotes: !isCommander, supportActions: true },
        },
      },
    });

    return record;
  }
}
