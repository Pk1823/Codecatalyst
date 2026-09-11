import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, handleAuthError } from "@/lib/auth/rbac";
import { AuditService } from "@/services/audit.service";

export async function GET(req: NextRequest) {
  try {
    // PERSONNEL is strictly prohibited from accessing welfare cases of other personnel
    const session = await requireRole(["WELFARE_OFFICER", "ADMIN"]);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const cases = await prisma.welfareCase.findMany({
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
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ cases });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(["WELFARE_OFFICER", "ADMIN"]);
    const body = await req.json();
    const { personnelId, title, reason, priority = "Moderate", riskScore = 50.0 } = body;

    if (!personnelId || !title || !reason) {
      return NextResponse.json(
        { error: "Missing required fields: personnelId, title, reason." },
        { status: 400 }
      );
    }

    const newCase = await prisma.welfareCase.create({
      data: {
        id: `CASE-${Date.now().toString().slice(-6)}`,
        personnelId: personnelId.toUpperCase(),
        officerId: session.userId,
        title,
        reason,
        priority,
        status: "NEW",
        riskScore: Number(riskScore),
      },
      include: {
        personnel: { select: { id: true, name: true, rank: true } },
      },
    });

    await AuditService.log({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "CREATE_CASE",
      resource: "WelfareCase",
      resourceId: newCase.id,
      metadata: { personnelId, priority, riskScore },
    });

    return NextResponse.json({ success: true, case: newCase }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
