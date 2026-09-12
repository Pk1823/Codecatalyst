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
      baseLocation,
      gender = "MALE",
      bloodGroup = "B+",
    } = body;

    // 1. Basic Validations
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Full Name is required." }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email address or Service ID is required." }, { status: 400 });
    }
    if (!password || password.trim().length < 4) {
      return NextResponse.json(
        { error: "Password must be at least 4 characters long." },
        { status: 400 }
      );
    }

    const assignedForce = force || "CRPF";
    const assignedRole = (role || "WELFARE_OFFICER") as UserRole;

    if (assignedRole === "PERSONNEL") {
      return NextResponse.json(
        {
          error:
            "Personnel registration is reserved exclusively for the MissionWell Mobile App. Web portal access is strictly for Welfare Officers, Commanders, and System Administrators.",
          isPersonnelRestricted: true,
        },
        { status: 403 }
      );
    }
    let trimmedEmail = email.trim().toLowerCase();
    let finalServiceId = serviceId ? serviceId.trim() : "";

    // If identifier is a service ID (no @), auto-derive email and store service ID
    if (!trimmedEmail.includes("@")) {
      if (!finalServiceId) {
        finalServiceId = email.trim();
      }
      const cleanId = finalServiceId.toLowerCase().replace(/[^a-z0-9]/g, ".");
      trimmedEmail = `${cleanId}@${assignedForce.toLowerCase()}.gov.in`;
    }

    const trimmedName = name.trim();

    // Generate service ID if not provided
    if (!finalServiceId) {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      finalServiceId = `${assignedForce}-${assignedRole.slice(0, 3)}-${year}-${randNum}`;
    }

    // Default Rank according to role
    const finalRank =
      rank?.trim() ||
      (assignedRole === "COMMANDER"
        ? "Commandant"
        : assignedRole === "WELFARE_OFFICER"
        ? "Chief Medical Officer"
        : assignedRole === "ADMIN"
        ? "Systems Administrator"
        : "Constable (GD)");

    const finalDept =
      department?.trim() ||
      (assignedRole === "WELFARE_OFFICER"
        ? "Psychological Health & Welfare Directorate"
        : assignedRole === "COMMANDER"
        ? "Tactical Operations Command"
        : assignedRole === "ADMIN"
        ? "Cyber & IT Directorate"
        : "Battalion Support");

    const finalBaseLocation = baseLocation?.trim() || `${assignedForce} Base Camp, Sector HQ`;

    // 2. Try forward registration to backend port 5000 if running
    const backendUrl = getBackendUrl();
    try {
      const backendRes = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password: password.trim(),
          role: assignedRole,
          force: assignedForce,
          serviceId: finalServiceId,
          rank: finalRank,
          department: finalDept,
          baseLocation: finalBaseLocation,
          gender,
          bloodGroup,
        }),
      });

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        if (backendData.success && backendData.user) {
          const response = NextResponse.json({
            success: true,
            user: backendData.user,
            token: backendData.token,
          });
          if (backendData.token) {
            response.cookies.set(SESSION_COOKIE_NAME, backendData.token, SESSION_COOKIE_OPTIONS);
          }
          return response;
        }
      }
    } catch {
      // Backend not running, proceed with direct local database storage
    }

    // 3. Check for existing User by email or serviceId in SQLite/Prisma
    const existingEmail = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in with Google." },
        { status: 409 }
      );
    }

    const existingServiceId = await prisma.user.findUnique({
      where: { serviceId: finalServiceId },
    });
    if (existingServiceId) {
      // Regulate unique ID
      finalServiceId = `${finalServiceId}-${Math.floor(100 + Math.random() * 900)}`;
    }

    // 4. Hash password
    const passwordHash = await hashPassword(password.trim());

    // 5. Ensure unit exists or find default unit
    let unit = await prisma.unit.findFirst({
      where: { force: assignedForce },
    });

    if (!unit) {
      unit = await prisma.unit.create({
        data: {
          name: unitName || `${assignedForce} 114 Bn - Bravo Coy`,
          force: assignedForce,
          location: finalBaseLocation,
          theatre: "Operational Grid",
          commandingOfficer: "Col. V. Sharma",
          stressLevel: "Optimal",
        },
      });
    }

    // 6. Create User record
    const user = await prisma.user.create({
      data: {
        email: trimmedEmail,
        name: trimmedName,
        serviceId: finalServiceId,
        passwordHash,
        role: assignedRole,
        force: assignedForce,
        rank: finalRank,
        department: finalDept,
        unitId: unit?.id,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedName)}&background=059669&color=fff&size=128`,
      },
    });

    // 7. Create linked Personnel record
    const personnelId = `P-${Math.floor(1000 + Math.random() * 9000)}`;
    let personnel = null;
    try {
      personnel = await prisma.personnel.create({
        data: {
          id: personnelId,
          userId: user.id,
          serviceNumber: user.serviceId,
          name: user.name,
          rank: finalRank,
          force: assignedForce,
          gender: gender || "MALE",
          bloodGroup: bloodGroup || "B+",
          dateOfJoining: new Date(),
          unitId: unit.id,
          baseLocation: finalBaseLocation,
          activeDeployDays: 12,
          currentDutyStatus: "Active Duty",
          deployments: {
            create: [
              {
                location: finalBaseLocation,
                terrain: "High Alert Forward Station",
                startDate: new Date(Date.now() - 20 * 86400000),
                isCurrent: true,
                consecutiveDays: 20,
                stressWeight: 1.1,
              },
            ],
          },
          workloadRecords: {
            create: [
              {
                periodStart: new Date(Date.now() - 7 * 86400000),
                periodEnd: new Date(),
                dutyHours5d: 42.0,
                nightShifts5d: 1,
                sleepHoursAvg: 6.8,
                leaveDaysUnavailed: 30,
                deltaRestingHR: 3.5,
              },
            ],
          },
          wellnessAssessments: {
            create: [
              {
                score: 82.0,
                indicatorStatus: "Low Risk / Resilient",
                stressLevel: "Low",
                fatigueLevel: "Mild",
                workloadStatus: "Optimal",
                recoveryStatus: "Good",
                recommendation: "Operational balance established on profile creation.",
                voluntaryConsent: true,
                additionalNotes: "Profile created via MissionWell Self-Care & Registration Portal.",
              },
            ],
          },
        },
      });
    } catch (personnelErr) {
      console.warn("Notice creating personnel record:", personnelErr);
    }

    // 8. Generate authenticated JWT token and session cookie
    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      serviceId: user.serviceId,
      role: user.role as UserRole,
      rank: user.rank || undefined,
      force: user.force,
      personnelId: personnel?.id || undefined,
    };

    const token = await signSessionToken(sessionPayload);

    // Audit log registration
    try {
      await AuditService.log({
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        action: "USER_SIGNUP",
        resource: "User",
        resourceId: user.id,
        metadata: { force: user.force, role: user.role, serviceId: user.serviceId },
      });
    } catch {}

    const response = NextResponse.json({
      success: true,
      message: "Profile created successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        serviceId: user.serviceId,
        force: user.force,
        rank: user.rank,
        avatarUrl: user.avatarUrl,
        personnelId: personnel?.id,
      },
      token,
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (err: any) {
    console.error("[AUTH_REGISTER_ERROR]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create user profile." },
      { status: 500 }
    );
  }
}
