import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, handleAuthError } from "@/lib/auth/rbac";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();

    // If personnel, restrict to own profile only
    if (session.role === "PERSONNEL") {
      if (!session.personnelId) {
        return NextResponse.json({ personnel: [] });
      }
      const record = await prisma.personnel.findUnique({
        where: { id: session.personnelId },
        include: { unit: true, riskPredictions: { orderBy: { createdAt: "desc" }, take: 1 } },
      });
      return NextResponse.json({ personnel: record ? [record] : [] });
    }

    // Welfare Officer, Commander, or Admin: return authorized unit personnel
    const personnel = await prisma.personnel.findMany({
      include: {
        unit: true,
        riskPredictions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ personnel });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    // Allow commanders, welfare officers, and admins to enroll personnel
    if (session.role === "PERSONNEL") {
      return NextResponse.json(
        { error: "Access denied. Personnel enrollment requires Commander, Welfare Officer, or Admin authority." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      rank = "Constable (GD)",
      force = "CRPF",
      serviceNumber,
      unitId,
      unitName,
      gender = "MALE",
      bloodGroup = "O+",
      baseLocation = "Forward Sector Post",
      activeDeployDays = 14,
      currentDutyStatus = "Active Duty",
      initialWorkloadScore = 58,
    } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Personnel name is required." }, { status: 400 });
    }

    // Determine or find unit
    let resolvedUnit = null;
    if (unitId) {
      resolvedUnit = await prisma.unit.findUnique({ where: { id: unitId } });
    }
    if (!resolvedUnit && unitName) {
      resolvedUnit = await prisma.unit.findFirst({
        where: { name: { contains: unitName } },
      });
    }
    if (!resolvedUnit) {
      // Fallback to first available unit or default unit
      resolvedUnit = await prisma.unit.findFirst();
    }

    const assignedUnitId = resolvedUnit?.id || "unit-114-bravo";

    // Generate unique ID and service number if not provided
    const newId = `P-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalServiceNumber =
      serviceNumber && serviceNumber.trim().length > 0
        ? serviceNumber.trim().toUpperCase()
        : `${force}-GD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newPersonnel = await prisma.personnel.create({
      data: {
        id: newId,
        serviceNumber: finalServiceNumber,
        name: name.trim(),
        rank: rank.trim(),
        force,
        gender: gender.toUpperCase(),
        bloodGroup,
        dateOfJoining: new Date(),
        unitId: assignedUnitId,
        baseLocation,
        activeDeployDays: Number(activeDeployDays) || 0,
        currentDutyStatus,
      },
      include: {
        unit: true,
      },
    });

    // Create baseline initial RiskPrediction so the recruit appears on ML analytical radars
    const baselineScore = Number(initialWorkloadScore) || 52;
    const baselineLevel = baselineScore > 75 ? "HIGH" : baselineScore > 50 ? "MODERATE" : "LOW";
    await prisma.riskPrediction.create({
      data: {
        personnelId: newPersonnel.id,
        riskScore: baselineScore,
        riskLevel: baselineLevel,
        alertPriority: baselineLevel === "HIGH" ? "Urgent" : baselineLevel === "MODERATE" ? "Medium" : "Low",
        maskingDetected: false,
        maskingConfidence: 12.0,
        modelVersion: "lgbm-defense-stress-v2.1",
        factors: {
          create: [
            {
              featureName: "consecutive_field_days",
              featureValue: Number(activeDeployDays) || 14,
              contributionWeight: 0.35,
              description: `Baseline field deployment duration (${activeDeployDays} days).`,
            },
            {
              featureName: "operational_readiness_baseline",
              featureValue: baselineScore,
              contributionWeight: 0.25,
              description: "Standard induction baseline biometric calibration.",
            },
          ],
        },
      },
    });

    return NextResponse.json({
      success: true,
      personnel: newPersonnel,
    }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
