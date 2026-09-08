import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, handleAuthError } from "@/lib/auth/rbac";
import { AuditService } from "@/services/audit.service";

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(["WELFARE_OFFICER", "ADMIN"]);
    const body = await req.json();
    const { caseId, actionType, title, description, scheduledDate } = body;

    if (!caseId || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields: caseId, title, description." },
        { status: 400 }
      );
    }

    const welfareCase = await prisma.welfareCase.findUnique({
      where: { id: caseId },
    });

    if (!welfareCase) {
      return NextResponse.json({ error: "Welfare case not found." }, { status: 404 });
    }

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
        status: welfareCase.status === "NEW" ? "SUPPORT_PLANNED" : welfareCase.status,
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
    });

    return NextResponse.json({ success: true, action }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
