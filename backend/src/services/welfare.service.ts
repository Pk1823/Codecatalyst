import { prisma } from "../lib/db";
import { AuditService } from "./audit.service";
import { SessionPayload } from "../lib/jwt";

export class WelfareService {
  static async getCases(status?: string) {
    return prisma.welfareCase.findMany({
      where: status ? { status } : undefined,
      include: {
        personnel: {
          select: {
            id: true,
            name: true,
            rank: true,
            force: true,
            baseLocation: true,
            unit: { select: { name: true } },
          },
        },
        assignedOfficer: { select: { id: true, name: true, rank: true } },
        caseNotes: { orderBy: { createdAt: "desc" }, take: 5 },
        supportActions: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getCaseById(id: string) {
    return prisma.welfareCase.findFirst({
      where: {
        OR: [{ id: id }, { id: id.toUpperCase() }, { personnelId: id.toUpperCase() }],
      },
      include: {
        personnel: {
          include: {
            unit: true,
            deployments: { where: { isCurrent: true }, take: 1 },
            workloadRecords: { orderBy: { periodStart: "desc" }, take: 1 },
            riskPredictions: {
              orderBy: { createdAt: "desc" },
              take: 1,
              include: { factors: true },
            },
          },
        },
        assignedOfficer: { select: { id: true, name: true, rank: true } },
        caseNotes: { orderBy: { createdAt: "desc" } },
        supportActions: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  static async updateCase(id: string, session: SessionPayload, body: any, ipAddress?: string) {
    const { status, noteText, followUpDate, officerId } = body;
    const updateData: any = {};
    if (status) updateData.status = status;
    if (officerId) updateData.officerId = officerId;
    if (followUpDate) updateData.followUpDate = new Date(followUpDate);
    if (status === "CLOSED") updateData.resolvedAt = new Date();

    if (noteText && noteText.trim().length > 0) {
      await prisma.caseNote.create({
        data: {
          caseId: id,
          authorId: session.userId,
          authorName: session.name,
          text: noteText.trim(),
          isConfidential: true,
        },
      });
      updateData.notesCount = { increment: 1 };
    }

    const updated = await prisma.welfareCase.update({
      where: { id },
      data: updateData,
      include: {
        personnel: { select: { id: true, name: true } },
        caseNotes: { orderBy: { createdAt: "desc" } },
        supportActions: { orderBy: { createdAt: "desc" } },
      },
    });

    await AuditService.log({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "UPDATE_CASE",
      resource: "WelfareCase",
      resourceId: id,
      metadata: { status, addedNote: !!noteText },
      ipAddress,
    });

    return updated;
  }

  static async addSupportAction(session: SessionPayload, body: any, ipAddress?: string) {
    const { caseId, actionType, title, description, scheduledDate } = body;

    const action = await prisma.supportAction.create({
      data: {
        caseId,
        actionType: actionType || "Duty Pacing",
        title,
        description,
        officerName: session.name,
        status: "Planned",
        scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
      },
    });

    await prisma.welfareCase.update({
      where: { id: caseId },
      data: {
        interventionsCount: { increment: 1 },
        status: "SUPPORT_PLANNED",
      },
    });

    await AuditService.log({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "RECORD_INTERVENTION",
      resource: "SupportAction",
      resourceId: action.id,
      metadata: { caseId, actionType, title },
      ipAddress,
    });

    return action;
  }

  static async getAlerts(severity?: string, status?: string) {
    const where: any = {};
    if (severity) where.severity = severity;
    if (status) where.status = status;

    return prisma.earlyWarning.findMany({
      where,
      include: {
        personnel: {
          select: {
            id: true,
            name: true,
            rank: true,
            unit: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateAlert(id: string, session: SessionPayload, status: string, ipAddress?: string) {
    const updated = await prisma.earlyWarning.update({
      where: { id },
      data: {
        status,
      },
      include: { personnel: { select: { name: true } } },
    });

    await AuditService.log({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "UPDATE_ALERT_STATUS",
      resource: "EarlyWarning",
      resourceId: id,
      metadata: { newStatus: status },
      ipAddress,
    });

    return updated;
  }

  static async getRecommendations() {
    return prisma.recommendation.findMany({
      include: {
        personnel: { select: { id: true, name: true, rank: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
