import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, handleAuthError } from "@/lib/auth/rbac";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const alerts = await prisma.earlyWarning.findMany({
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
        unit: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const personnelId = (body.personnelId || session.personnelId || "P-1024").toUpperCase();
    const personnel = await prisma.personnel.findUnique({
      where: { id: personnelId },
      include: { unit: true },
    });

    const severity = body.severity || "HIGH";
    const reason =
      body.reason ||
      `Army personnel flagged at ${severity} BREAKDOWN RISK (${body.riskScore || 75}/100). Severe operational fatigue & acute stress.`;
    const triggerCondition = body.triggerCondition || "MANUAL_OR_TELEMETRY_ALERT";

    const earlyWarning = await prisma.earlyWarning.create({
      data: {
        personnelId: personnel?.id || personnelId,
        unitId: personnel?.unitId,
        severity,
        reason,
        triggerCondition,
        status: "NEW",
      },
      include: {
        personnel: {
          select: { id: true, name: true, rank: true, force: true, baseLocation: true },
        },
      },
    });

    // Notify Welfare Officers
    let welfareOfficers = await prisma.user.findMany({
      where: { role: { in: ["WELFARE_OFFICER", "COMMANDER", "ADMIN"] } },
    });
    if (welfareOfficers.length === 0) {
      welfareOfficers = await prisma.user.findMany({ take: 3 });
    }

    for (const officer of welfareOfficers) {
      await prisma.notification.create({
        data: {
          userId: officer.id,
          title: `🚨 CRITICAL WELFARE ALERT: ${personnel?.rank || "Soldier"} ${personnel?.name || personnelId} (${personnel?.force || "Army"} - ${personnelId})`,
          message: reason,
          type: "alert",
          category: "Welfare",
          link: "/alerts",
        },
      });
    }

    return NextResponse.json({ success: true, alert: earlyWarning });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Alert ID is required" }, { status: 400 });
    }

    const updated = await prisma.earlyWarning.update({
      where: { id },
      data: {
        status: status || "RESOLVED",
      },
    });

    return NextResponse.json({ success: true, alert: updated });
  } catch (error) {
    return handleAuthError(error);
  }
}
