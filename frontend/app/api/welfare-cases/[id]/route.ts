import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, handleAuthError } from "@/lib/auth/rbac";
import { AuditService } from "@/services/audit.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["WELFARE_OFFICER", "ADMIN"]);
    const { id } = await params;

    const welfareCase = await prisma.welfareCase.findFirst({
      where: {
        OR: [
          { id: id },
          { id: id.toUpperCase() },
          { personnelId: id.toUpperCase() },
        ],
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

    if (!welfareCase) {
      return NextResponse.json({ error: "Welfare case not found." }, { status: 404 });
    }

    return NextResponse.json({ case: welfareCase });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(["WELFARE_OFFICER", "ADMIN"]);
    const { id } = await params;
    const body = await req.json();
    const { status, noteText, followUpDate, officerId } = body;

    const existingCase = await prisma.welfareCase.findUnique({
      where: { id },
    });

    if (!existingCase) {
      return NextResponse.json({ error: "Welfare case not found." }, { status: 404 });
    }

    // Build update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (officerId) updateData.officerId = officerId;
    if (followUpDate) updateData.followUpDate = new Date(followUpDate);
    if (status === "CLOSED") updateData.resolvedAt = new Date();

    // If note is included, add CaseNote
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
    });

    return NextResponse.json({ success: true, case: updated });
  } catch (error) {
    return handleAuthError(error);
  }
}
