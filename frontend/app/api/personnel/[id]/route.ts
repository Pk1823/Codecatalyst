import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, canAccessPersonnel, AuthError, handleAuthError } from "@/lib/auth/rbac";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const personnelId = id.toUpperCase();

    // Enforce data boundary
    if (!canAccessPersonnel(session, personnelId)) {
      throw new AuthError(
        "Forbidden: You are not authorized to view this personnel's private record.",
        403
      );
    }

    const isCommander = session.role === "COMMANDER";

    const record = await prisma.personnel.findUnique({
      where: { id: personnelId },
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
        // Commanders do NOT receive granular voluntary survey responses
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

    if (!record) {
      return NextResponse.json({ error: "Personnel record not found." }, { status: 404 });
    }

    return NextResponse.json({ personnel: record });
  } catch (error) {
    return handleAuthError(error);
  }
}
