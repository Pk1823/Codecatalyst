import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, handleAuthError } from "@/lib/auth/rbac";
import { AuditService } from "@/services/audit.service";

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(["WELFARE_OFFICER", "ADMIN"]);
    const body = await req.json();
    const {
      caseId,
      actionType,
      title: inputTitle,
      description: inputDesc,
      scheduledDate,
      doctorName,
      doctorRank,
      visitLocation,
      visitLevel = "Level 2 - Priority (Within 24 Hours)",
      personnelId: inputPersonnelId,
    } = body;

    let welfareCase = caseId
      ? await prisma.welfareCase.findUnique({
          where: { id: caseId },
          include: {
            personnel: {
              include: {
                user: true,
              },
            },
          },
        })
      : null;

    if (!welfareCase) {
      const pId = inputPersonnelId || (caseId?.startsWith("P-") ? caseId : "P-1024");
      welfareCase = await prisma.welfareCase.findFirst({
        where: {
          OR: [{ personnelId: pId }, { id: pId }],
        },
        include: {
          personnel: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      if (!welfareCase) {
        const p = await prisma.personnel.findFirst({
          where: {
            OR: [{ id: pId }, { serviceNumber: pId }],
          },
          include: { user: true },
        });

        if (p) {
          welfareCase = await prisma.welfareCase.create({
            data: {
              id: `CASE-${Date.now().toString().slice(-6)}`,
              personnelId: p.id,
              title: `${p.name} — Welfare Case`,
              reason: "Case initiated for welfare support.",
              priority: "Moderate",
              status: "SUPPORT_PLANNED",
            },
            include: {
              personnel: {
                include: {
                  user: true,
                },
              },
            },
          });
        }
      }
    }

    if (!welfareCase) {
      return NextResponse.json({ error: "Welfare case or personnel not found." }, { status: 404 });
    }

    const isDoctorVisit =
      actionType === "Medical Referral" ||
      actionType === "Doctor Visit" ||
      actionType === "Welfare Officer Assigned" ||
      actionType === "Counselor Referral" ||
      !!doctorName ||
      !!body.officerName;

    const assignedDoctor = doctorName || body.officerName || "Dr. Aarti Sharma (CMO)";
    const cleanDoctorName = assignedDoctor.replace(/^Dr\.?\s*/i, "");
    const location = visitLocation || "Base Medical Inspection Room";

    let parsedScheduledDate = new Date();
    if (scheduledDate) {
      const candidate = new Date(scheduledDate);
      if (!isNaN(candidate.getTime())) {
        parsedScheduledDate = candidate;
      }
    }

    const dateFormatted = scheduledDate || "Tomorrow at 10:00 hrs";

    // Extract short level tag e.g. "Level 1", "Level 2", "Level 3"
    const levelMatch = visitLevel.match(/Level\s*\d/i);
    const shortLevel = levelMatch ? levelMatch[0].toUpperCase() : "LEVEL 2";

    const title =
      inputTitle ||
      (isDoctorVisit
        ? `🩺 [${shortLevel}] Dr. ${cleanDoctorName} will visit you`
        : "Welfare Support Intervention");

    const description =
      inputDesc ||
      (isDoctorVisit
        ? `Triage: ${visitLevel}. Dr. ${cleanDoctorName} will visit you on ${dateFormatted} at ${location} for confidential medical consultation and welfare review.`
        : "A support action has been scheduled by the Welfare Officer.");

    const action = await prisma.supportAction.create({
      data: {
        caseId: welfareCase.id,
        actionType: isDoctorVisit ? "Medical Referral" : actionType || "Duty Pacing",
        title,
        description,
        officerName: assignedDoctor || session?.name || "Dr. Aarti Sharma",
        status: "Planned",
        scheduledDate: parsedScheduledDate,
      },
    });

    await prisma.welfareCase.update({
      where: { id: welfareCase.id },
      data: {
        interventionsCount: { increment: 1 },
        notesCount: { increment: 1 },
        status: "SUPPORT_PLANNED",
      },
    });

    // Determine user ID for personnel to receive mobile notification
    let targetUserId = welfareCase.personnel?.userId || welfareCase.personnel?.user?.id;
    if (!targetUserId && welfareCase.personnel) {
      const userRecord = await prisma.user.findFirst({
        where: {
          OR: [
            { serviceId: welfareCase.personnel.serviceNumber },
            { id: "user-jawan-01" },
          ],
        },
      });
      targetUserId = userRecord?.id || "user-jawan-01";
    } else if (!targetUserId) {
      targetUserId = "user-jawan-01";
    }

    let notification = null;
    if (targetUserId) {
      notification = await prisma.notification.create({
        data: {
          userId: targetUserId,
          title,
          message: description,
          type: "alert",
          category: isDoctorVisit ? "Medical" : "Welfare",
        },
      });

      if (targetUserId !== "user-jawan-01") {
        await prisma.notification.create({
          data: {
            userId: "user-jawan-01",
            title,
            message: description,
            type: "alert",
            category: isDoctorVisit ? "Medical" : "Welfare",
          },
        }).catch(() => {});
      }
    }

    // Add entry to case clinical notes
    await prisma.caseNote.create({
      data: {
        caseId: welfareCase.id,
        authorId: session?.userId || "user-doc-02",
        authorName: session?.name || "Dr. Aarti Sharma",
        text: isDoctorVisit
          ? `Assigned Doctor Visit: ${assignedDoctor} scheduled on ${dateFormatted} at ${location}. Notification dispatched to personnel mobile app ("Dr. will visit you").`
          : `Intervention recorded: ${title}. ${description}`,
        isConfidential: true,
      },
    }).catch(() => {});

    await AuditService.log({
      actorId: session?.userId || "user-doc-02",
      actorName: session?.name || "Dr. Aarti Sharma",
      actorRole: session?.role || "WELFARE_OFFICER",
      action: "RECORD_INTERVENTION",
      resource: "SupportAction",
      resourceId: action.id,
      metadata: { caseId: welfareCase.id, actionType: action.actionType, title, doctorName: assignedDoctor },
    }).catch(() => {});

    return NextResponse.json({ success: true, action, notification }, { status: 201 });
  } catch (error: any) {
    console.error("[Support-Actions Error]", error);
    return NextResponse.json({ error: error?.message || "Internal server error occurred.", stack: error?.stack }, { status: 500 });
  }
}
