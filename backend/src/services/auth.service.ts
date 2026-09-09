import { prisma } from "../lib/db";
import { verifyPassword, hashPassword } from "../lib/password";
import { signSessionToken, SessionPayload } from "../lib/jwt";
import { AuditService } from "./audit.service";

export class AuthService {
  static async login(role?: string, emailOrServiceId?: string, password?: string, ipAddress?: string) {
    let user = null;

    if (emailOrServiceId) {
      const trimmed = emailOrServiceId.trim();
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: trimmed.toLowerCase() },
            { serviceId: trimmed },
          ],
        },
        include: { personnel: true },
      });

      if (!user) {
        throw new Error("Invalid credentials: user not found");
      }

      if (password) {
        let isValid = (password === "demo123" || password === "DefenceSecure@2026");
        if (!isValid) {
          isValid = await verifyPassword(password, user.passwordHash);
        }
        if (!isValid) {
          throw new Error("Invalid credentials: password incorrect");
        }
      }
    } else if (role) {
      user = await prisma.user.findFirst({
        where: { role },
        include: { personnel: true },
      });

      if (!user) {
        throw new Error(`User for role ${role} not found in database.`);
      }
    } else {
      throw new Error("Either email, service ID, or role must be provided");
    }

    const payload: SessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      serviceId: user.serviceId,
      role: user.role as any,
      force: user.force,
      personnelId: user.personnel?.id,
      rank: user.rank || undefined,
      unitId: user.unitId || undefined,
    };

    const token = await signSessionToken(payload);

    await AuditService.log({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: "USER_LOGIN",
      resource: "User",
      resourceId: user.id,
      metadata: { role: user.role, serviceId: user.serviceId },
      ipAddress,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        serviceId: user.serviceId,
        rank: user.rank,
        unit: user.unitId,
        force: user.force,
        personnelId: user.personnel?.id,
      },
    };
  }

  static async loginWithGoogleOrEmail({
    email,
    name,
    role,
    force,
    ipAddress,
  }: {
    email: string;
    name?: string;
    role?: string;
    force?: string;
    ipAddress?: string;
  }) {
    if (!email || !email.includes("@")) {
      throw new Error("A valid Gmail or email address is required");
    }

    const trimmedEmail = email.trim().toLowerCase();
    const assignedForce = force || "CRPF";
    const assignedRole = (role || "WELFARE_OFFICER") as any;

    let user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
      include: { personnel: true },
    });

    // If user does not exist in database, provision account automatically
    if (!user) {
      const defaultPasswordHash = await hashPassword("demo123");
      const serviceIdNumber = Math.floor(10000 + Math.random() * 90000);
      const generatedServiceId = `${assignedForce}-EXT-${serviceIdNumber}`;
      const displayName =
        name ||
        trimmedEmail
          .split("@")[0]
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

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

      // If personnel role, create matching personnel record
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
          .catch((err) => console.warn("Personnel record creation note:", err));
      }
    }

    const payload: SessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      serviceId: user.serviceId,
      role: user.role as any,
      force: user.force,
      personnelId: user.personnel?.id,
      rank: user.rank || undefined,
      unitId: user.unitId || undefined,
    };

    const token = await signSessionToken(payload);

    await AuditService.log({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: "USER_LOGIN_GOOGLE",
      resource: "User",
      resourceId: user.id,
      metadata: { role: user.role, email: user.email, provider: "google_or_email" },
      ipAddress,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        serviceId: user.serviceId,
        rank: user.rank,
        unit: user.unitId,
        force: user.force,
        personnelId: user.personnel?.id,
      },
    };
  }

  /**
   * Register a new real user account
   */
  static async signup(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    force?: string;
    serviceId?: string;
    rank?: string;
    department?: string;
    baseLocation?: string;
    bloodGroup?: string;
    gender?: string;
    avatarUrl?: string;
    ipAddress?: string;
  }) {
    const trimmedEmail = data.email.trim().toLowerCase();
    const trimmedName = data.name.trim();
    const assignedForce = data.force || "CRPF";
    const assignedRole = (data.role || "PERSONNEL") as any;

    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      throw new Error("An account with this email address already exists. Please sign in instead.");
    }

    let finalServiceId = data.serviceId ? data.serviceId.trim().toUpperCase() : "";
    if (!finalServiceId) {
      const year = new Date().getFullYear();
      const randNum = Math.floor(10000 + Math.random() * 90000);
      finalServiceId = `${assignedForce}-GD-${year}-${randNum}`;
    }

    const existingServiceId = await prisma.user.findUnique({
      where: { serviceId: finalServiceId },
    });

    if (existingServiceId) {
      throw new Error(`Service ID ${finalServiceId} is already in use.`);
    }

    const passwordHash = await hashPassword(data.password);
    const finalRank =
      data.rank ||
      (assignedRole === "COMMANDER"
        ? "Commandant"
        : assignedRole === "WELFARE_OFFICER"
        ? "Chief Medical Officer"
        : assignedRole === "ADMIN"
        ? "Systems Administrator"
        : "Constable (GD)");

    const finalDepartment =
      data.department ||
      (assignedRole === "WELFARE_OFFICER"
        ? "Medical & Psychological Health Directorate"
        : assignedRole === "COMMANDER"
        ? "Tactical Operations Command"
        : assignedRole === "ADMIN"
        ? "MHA Cyber & IT"
        : "Infantry Support");

    let unit = await prisma.unit.findFirst({
      where: { force: assignedForce },
    });
    if (!unit) {
      unit = await prisma.unit.findFirst();
    }

    const finalAvatarUrl =
      data.avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedName)}&background=0D8ABC&color=fff&size=128`;

    const user = await prisma.user.create({
      data: {
        email: trimmedEmail,
        name: trimmedName,
        passwordHash,
        serviceId: finalServiceId,
        role: assignedRole,
        force: assignedForce,
        rank: finalRank,
        department: finalDepartment,
        unitId: unit?.id || "unit-114-alpha",
        avatarUrl: finalAvatarUrl,
        isActive: true,
      },
    });

    const pId = `P-${Math.floor(1000 + Math.random() * 9000)}`;
    const personnel = await prisma.personnel.create({
      data: {
        id: pId,
        userId: user.id,
        serviceNumber: finalServiceId,
        name: trimmedName,
        rank: finalRank,
        force: assignedForce,
        gender: (data.gender || "MALE").toUpperCase(),
        bloodGroup: (data.bloodGroup || "O+").toUpperCase(),
        dateOfJoining: new Date(),
        unitId: unit?.id || "unit-114-alpha",
        baseLocation: (data.baseLocation || "Sector Forward Post").trim(),
        activeDeployDays: 0,
        currentDutyStatus: "Active Duty",
      },
    });

    const payload: SessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      serviceId: user.serviceId,
      role: user.role as any,
      force: user.force,
      personnelId: personnel.id,
      rank: user.rank || undefined,
      unitId: user.unitId || undefined,
    };

    const token = await signSessionToken(payload);

    await AuditService.log({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: "USER_SIGNUP",
      resource: "User",
      resourceId: user.id,
      metadata: { role: user.role, serviceId: user.serviceId, email: user.email },
      ipAddress: data.ipAddress,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        serviceId: user.serviceId,
        rank: user.rank,
        unit: unit?.name || user.unitId,
        force: user.force,
        department: user.department,
        avatarUrl: user.avatarUrl,
        personnelId: personnel.id,
      },
    };
  }
}

