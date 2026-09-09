import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { signSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth/jwt";
import { AuditService } from "@/services/audit.service";
import { UserRole } from "@/types/auth";
import { getBackendUrl } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      role = "PERSONNEL",
      force = "CRPF",
      serviceId,
      rank,
      department,
      unitName,
      baseLocation = "HQ Sector Depot",
      bloodGroup = "O+",
      gender = "MALE",
      avatarUrl,
    } = body;

    // 1. Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Full Name is required." }, { status: 400 });
    }
    if (!email || !email.trim() || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const assignedForce = force || "CRPF";
    const assignedRole = (role || "PERSONNEL") as UserRole;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in instead." },
        { status: 400 }
      );
    }

    // Generate or format Service ID
    let finalServiceId = serviceId ? serviceId.trim().toUpperCase() : "";
    if (!finalServiceId) {
      const year = new Date().getFullYear();
      const randNum = Math.floor(10000 + Math.random() * 90000);
      finalServiceId = `${assignedForce}-GD-${year}-${randNum}`;
    }

    // Check if service ID already exists
    const existingServiceId = await prisma.user.findUnique({
      where: { serviceId: finalServiceId },
    });

    if (existingServiceId) {
      return NextResponse.json(
        { error: `Service ID ${finalServiceId} is already assigned. Please use a unique Service ID.` },
        { status: 400 }
      );
    }

    // Determine default rank based on role if omitted
    const finalRank =
      rank && rank.trim()
        ? rank.trim()
        : assignedRole === "COMMANDER"
        ? "Commandant"
        : assignedRole === "WELFARE_OFFICER"
        ? "Chief Medical Officer"
        : assignedRole === "ADMIN"
        ? "Systems Administrator"
        : "Constable (GD)";

    // Determine department
    const finalDepartment =
      department && department.trim()
        ? department.trim()
        : assignedRole === "WELFARE_OFFICER"
        ? "Medical & Psychological Health Directorate"
        : assignedRole === "COMMANDER"
        ? "Tactical Operations Command"
        : assignedRole === "ADMIN"
        ? "MHA Information Technology Directorate"
        : "Infantry Battalions Support";

    // Resolve or find Unit
    let assignedUnit = null;
    if (unitName && unitName.trim()) {
      assignedUnit = await prisma.unit.findFirst({
        where: { name: { contains: unitName.trim() } },
      });
    }

    if (!assignedUnit) {
      // Find unit matching force or fallback to default
      assignedUnit = await prisma.unit.findFirst({
        where: { force: assignedForce },
      });
    }

    if (!assignedUnit) {
      assignedUnit = await prisma.unit.findFirst();
    }

    const assignedUnitId = assignedUnit?.id || "unit-114-alpha";

    // Generate avatar if not provided
    const finalAvatarUrl =
      avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedName)}&background=0D8ABC&color=fff&size=128`;

    // Hash password
    const passwordHash = await hashPassword(password);

    // Forward to backend port 5000 if running
    const backendUrl = getBackendUrl();
    try {
      await fetch(`${backendUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password,
          role: assignedRole,
          force: assignedForce,
          serviceId: finalServiceId,
          rank: finalRank,
          department: finalDepartment,
          baseLocation,
          bloodGroup,
          gender,
          avatarUrl: finalAvatarUrl,
        }),
      }).catch(() => {});
    } catch {}

    // 2. Create User in Prisma
    const newUser = await prisma.user.create({
      data: {
        email: trimmedEmail,
        name: trimmedName,
        passwordHash,
        serviceId: finalServiceId,
        role: assignedRole,
        force: assignedForce,
        rank: finalRank,
        department: finalDepartment,
        unitId: assignedUnitId,
        avatarUrl: finalAvatarUrl,
        isActive: true,
      },
    });

    // 3. Create real linked Personnel record with ONLY user-entered real data (no dummy deployments/assessments)
    const pId = `P-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPersonnel = await prisma.personnel.create({
      data: {
        id: pId,
        userId: newUser.id,
        serviceNumber: finalServiceId,
        name: trimmedName,
        rank: finalRank,
        force: assignedForce,
        gender: gender.toUpperCase(),
        bloodGroup: bloodGroup.toUpperCase(),
        dateOfJoining: new Date(),
        unitId: assignedUnitId,
        baseLocation: baseLocation.trim(),
        activeDeployDays: 0,
        currentDutyStatus: "Active Duty",
      },
      include: {
        unit: true,
      },
    });

    // 4. Sign session token
    const sessionPayload = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      serviceId: newUser.serviceId,
      role: newUser.role as UserRole,
      force: newUser.force,
      personnelId: newPersonnel.id,
      rank: newUser.rank || undefined,
      unitId: newUser.unitId || undefined,
      avatarUrl: newUser.avatarUrl || undefined,
    };

    const token = await signSessionToken(sessionPayload);

    // 5. Zero-Trust Audit Log
    await AuditService.log({
      actorId: newUser.id,
      actorName: newUser.name,
      actorRole: newUser.role,
      action: "USER_SIGNUP",
      resource: "User",
      resourceId: newUser.id,
      metadata: {
        method: "Real_Credentials_Signup",
        email: newUser.email,
        serviceId: newUser.serviceId,
        force: newUser.force,
        role: newUser.role,
        personnelId: newPersonnel.id,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: `Account created successfully for ${newUser.name}. All entered details are active.`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        serviceId: newUser.serviceId,
        role: newUser.role,
        rank: newUser.rank,
        force: newUser.force,
        department: newUser.department,
        avatarUrl: newUser.avatarUrl,
        personnelId: newPersonnel.id,
        unit: assignedUnit?.name || "114 Bn - Alpha Coy",
      },
      token,
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (error: any) {
    console.error("[SIGNUP_ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred during account registration." },
      { status: 500 }
    );
  }
}
