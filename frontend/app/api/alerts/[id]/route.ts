import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, handleAuthError } from "@/lib/auth/rbac";
import { AuditService } from "@/services/audit.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(["WELFARE_OFFICER", "COMMANDER", "ADMIN"]);
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = ["NEW", "REVIEWING", "ACTION_REQUIRED", "RESOLVED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: [${validStatuses.join(", ")}]` },
        { status: 400 }
      );
    }

    const updated = await prisma.earlyWarning.update({
      where: { id },
      data: { status },
      include: { personnel: { select: { id: true, name: true } } },
    });

    await AuditService.log({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "UPDATE_ALERT_STATUS",
      resource: "EarlyWarning",
      resourceId: id,
      metadata: { newStatus: status, personnelId: updated.personnelId },
    });

    return NextResponse.json({ success: true, alert: updated });
  } catch (error) {
    return handleAuthError(error);
  }
}
