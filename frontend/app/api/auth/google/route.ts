import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { signSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth/jwt";
import { AuditService } from "@/services/audit.service";
import { UserRole } from "@/types/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, role, force } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid Gmail or email address is required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const assignedForce = force || "CRPF";
    const assignedRole = (role || "WELFARE_OFFICER") as UserRole;

    // 1. Primary: Forward to backend port 5000 if reachable
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    try {
      const backendRes = await fetch(`${backendUrl}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          name,
          role: assignedRole,
          force: assignedForce,
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
    } catch (err) {
      console.warn("[AUTH_GOOGLE]: Backend service on port 5000 unreachable, using local database fallback:", err);
    }

    // 2. Fallback: Authenticate or Auto-Register via local Prisma SQLite database
    let user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
      include: { personnel: true },
    });

    if (!user) {
      const defaultPasswordHash = await hashPassword("demo123");
      const serviceIdNumber = Math.floor(10000 + Math.random() * 90000);
      const generatedServiceId = `${assignedForce}-EXT-${serviceIdNumber}`;
      const displayName =
        name ||
        trimmedEmail
          .split("@")[0]
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase());

      user = await prisma.user.create({
        data: {
          email: trimmedEmail,
          name: displayName,
          serviceId: generatedServiceId,
          passwordHash: defaultPasswordHash,
          role: assignedRole,
          force: assignedForce,
          rank:
            assignedRole === "COMMANDER"
              ? "Commandant"
              : assignedRole === "WELFARE_OFFICER"
              ? "Chief Medical Officer"
              : assignedRole === "ADMIN"
              ? "Systems Administrator"
              : "Constable (GD)",
          department:
            assignedRole === "WELFARE_OFFICER"
              ? "Psychological Health Directorate"
              : assignedRole === "COMMANDER"
              ? "Tactical Operations"
              : assignedRole === "ADMIN"
              ? "MHA Cyber & IT"
              : "Infantry Support",
        },
        include: { personnel: true },
      });

      if (assignedRole === "PERSONNEL") {
        const pId = `P-${Math.floor(2000 + Math.random() * 7000)}`;
        await prisma.personnel
          .create({
            data: {
              id: pId,
              userId: user.id,
              serviceNumber: user.serviceId,
              name: user.name,
              rank: user.rank || "Constable (GD)",
              force: user.force,
              gender: "MALE",
              bloodGroup: "B+",
              dateOfJoining: new Date("2021-03-15"),
              unitId: "unit-114-alpha",
              baseLocation: "Srinagar Base Camp",
              activeDeployDays: 14,
              currentDutyStatus: "Active Duty",
            },
          })
          .catch((e) => console.warn("Personnel create notice:", e));
      }
    }

    // Sign session JWT
    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      serviceId: user.serviceId,
      role: user.role as UserRole,
      force: user.force,
      personnelId: user.personnel?.id,
      rank: user.rank || undefined,
      unitId: user.unitId || undefined,
    };

    const token = await signSessionToken(sessionPayload);

    // Audit log
    await AuditService.log({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: "LOGIN_GOOGLE",
      resource: "User",
      resourceId: user.id,
      metadata: { method: "Google_SSO", email: user.email, serviceId: user.serviceId },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        serviceId: user.serviceId,
        role: user.role,
        rank: user.rank,
        force: user.force,
        personnelId: user.personnel?.id,
      },
      token,
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error("[GOOGLE_LOGIN_ERROR]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during Google authentication." },
      { status: 500 }
    );
  }
}
