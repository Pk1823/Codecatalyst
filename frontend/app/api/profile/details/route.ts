import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, handleAuthError, AuthError } from "@/lib/auth/rbac";
import { AuditService } from "@/services/audit.service";
import fs from "fs";
import path from "path";

const CUSTOM_DETAILS_FILE = path.join(process.cwd(), "prisma", "custom_details.json");

function getCustomDetailsStore(): Record<string, any[]> {
  try {
    if (fs.existsSync(CUSTOM_DETAILS_FILE)) {
      const raw = fs.readFileSync(CUSTOM_DETAILS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Failed reading custom_details.json:", err);
  }
  return {};
}

function saveCustomDetailsStore(store: Record<string, any[]>) {
  try {
    const dir = path.dirname(CUSTOM_DETAILS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CUSTOM_DETAILS_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed saving custom_details.json:", err);
  }
}

/**
 * Helper to ensure the caller has clearance to modify personnel datasets
 */
function assertAuthorizedOfficer(role: string, actionName: string) {
  if (role !== "ADMIN" && role !== "WELFARE_OFFICER") {
    throw new AuthError(
      `Access Denied: Only authorized Welfare Officers or System Administrators have clearance to ${actionName} personnel datasets. Current role: ${role}.`,
      403
    );
  }
}

/**
 * POST /api/profile/details - Create / Add a new detail to the person's dataset
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    assertAuthorizedOfficer(session.role, "create or add details to");

    const body = await req.json();
    const { personnelId, type, data } = body;

    if (!personnelId) {
      return NextResponse.json({ error: "personnelId is required." }, { status: 400 });
    }

    // Verify target personnel exists
    const personnel = await prisma.personnel.findUnique({
      where: { id: personnelId },
    });

    if (!personnel) {
      return NextResponse.json({ error: `Personnel record ${personnelId} not found.` }, { status: 404 });
    }

    let createdItem: any = null;

    if (type === "deployment") {
      createdItem = await prisma.deployment.create({
        data: {
          personnelId,
          location: data.location || "Forward Sector Outpost",
          terrain: data.terrain || "Counter-Insurgency Grid",
          startDate: data.startDate ? new Date(data.startDate) : new Date(),
          endDate: data.endDate ? new Date(data.endDate) : null,
          isCurrent: data.isCurrent !== undefined ? Boolean(data.isCurrent) : true,
          consecutiveDays: data.consecutiveDays ? Number(data.consecutiveDays) : 0,
          stressWeight: data.stressWeight ? Number(data.stressWeight) : 1.0,
        },
      });
    } else if (type === "dutySchedule") {
      createdItem = await prisma.dutySchedule.create({
        data: {
          personnelId,
          date: data.date ? new Date(data.date) : new Date(),
          shiftType: data.shiftType || "Patrol Duty",
          hours: data.hours ? Number(data.hours) : 8.0,
          nightShift: Boolean(data.nightShift),
        },
      });
    } else if (type === "wellnessAssessment") {
      const score = Number(data.score ?? 75);
      createdItem = await prisma.wellnessAssessment.create({
        data: {
          personnelId,
          score,
          indicatorStatus: score > 70 ? "Optimal" : score > 50 ? "Moderate Attention" : "Elevated Attention",
          stressLevel: data.stressLevel || "Moderate",
          fatigueLevel: data.fatigueLevel || "Low",
          workloadStatus: data.workloadStatus || "Optimal",
          recoveryStatus: data.recoveryStatus || "Adequate",
          recommendation: data.recommendation || "Maintain active monitoring and duty pacing.",
          voluntaryConsent: true,
          additionalNotes: data.additionalNotes || "Added by authorized Welfare Officer.",
        },
      });
    } else if (type === "coreUpdate") {
      createdItem = await prisma.personnel.update({
        where: { id: personnelId },
        data: {
          bloodGroup: data.bloodGroup || undefined,
          baseLocation: data.baseLocation || undefined,
          currentDutyStatus: data.currentDutyStatus || undefined,
          activeDeployDays: data.activeDeployDays !== undefined ? Number(data.activeDeployDays) : undefined,
          rank: data.rank || undefined,
          gender: data.gender || undefined,
        },
      });
    } else if (type === "customDetail") {
      const store = getCustomDetailsStore();
      const currentList = store[personnelId] || [];

      const newCustomItem = {
        id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        category: data.category || "Operational Note",
        label: data.label || "Dataset Attribute",
        value: data.value || "",
        notes: data.notes || "",
        createdAt: new Date().toISOString(),
        authorName: session.name,
        authorRole: session.role,
      };

      store[personnelId] = [newCustomItem, ...currentList];
      saveCustomDetailsStore(store);
      createdItem = newCustomItem;
    } else {
      return NextResponse.json(
        { error: `Unknown detail type: '${type}'. Supported types: deployment, dutySchedule, wellnessAssessment, customDetail, coreUpdate.` },
        { status: 400 }
      );
    }

    // Zero-Trust Audit Log
    await AuditService.log({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "ADD_PERSONNEL_DATASET_DETAIL",
      resource: "Personnel",
      resourceId: personnelId,
      metadata: {
        type,
        addedDetailId: createdItem?.id,
        summary: data.label || data.location || data.shiftType || type,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Detail successfully added to ${personnel.name}'s dataset.`,
      item: createdItem,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

/**
 * PUT /api/profile/details - Edit / Update an existing detail in the person's dataset
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth();
    assertAuthorizedOfficer(session.role, "edit details in");

    const body = await req.json();
    const { personnelId, type, id, data } = body;

    if (!personnelId || !type) {
      return NextResponse.json({ error: "personnelId and type are required." }, { status: 400 });
    }

    let updatedItem: any = null;

    if (type === "deployment" && id) {
      updatedItem = await prisma.deployment.update({
        where: { id },
        data: {
          location: data.location,
          terrain: data.terrain,
          isCurrent: data.isCurrent !== undefined ? Boolean(data.isCurrent) : undefined,
          consecutiveDays: data.consecutiveDays !== undefined ? Number(data.consecutiveDays) : undefined,
          stressWeight: data.stressWeight !== undefined ? Number(data.stressWeight) : undefined,
        },
      });
    } else if (type === "customDetail" && id) {
      const store = getCustomDetailsStore();
      const list = store[personnelId] || [];
      const index = list.findIndex((x) => x.id === id);
      if (index !== -1) {
        list[index] = {
          ...list[index],
          ...data,
          updatedAt: new Date().toISOString(),
          lastModifiedBy: session.name,
        };
        store[personnelId] = list;
        saveCustomDetailsStore(store);
        updatedItem = list[index];
      }
    } else if (type === "coreUpdate") {
      updatedItem = await prisma.personnel.update({
        where: { id: personnelId },
        data: {
          bloodGroup: data.bloodGroup,
          baseLocation: data.baseLocation,
          currentDutyStatus: data.currentDutyStatus,
          activeDeployDays: data.activeDeployDays !== undefined ? Number(data.activeDeployDays) : undefined,
          rank: data.rank,
        },
      });
    }

    await AuditService.log({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "UPDATE_PERSONNEL_DATASET_DETAIL",
      resource: "Personnel",
      resourceId: personnelId,
      metadata: { type, id },
    });

    return NextResponse.json({
      success: true,
      message: "Dataset detail successfully updated.",
      item: updatedItem,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

/**
 * DELETE /api/profile/details - Remove / Delete a detail from the person's dataset
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth();
    assertAuthorizedOfficer(session.role, "remove details from");

    const { searchParams } = new URL(req.url);
    const personnelId = searchParams.get("personnelId");
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!personnelId || !type || !id) {
      return NextResponse.json(
        { error: "personnelId, type, and id query parameters are required for deletion." },
        { status: 400 }
      );
    }

    let deletedSummary = `${type} #${id}`;

    if (type === "deployment") {
      await prisma.deployment.delete({ where: { id } });
    } else if (type === "dutySchedule") {
      await prisma.dutySchedule.delete({ where: { id } });
    } else if (type === "wellnessAssessment") {
      await prisma.wellnessAssessment.delete({ where: { id } });
    } else if (type === "customDetail") {
      const store = getCustomDetailsStore();
      const currentList = store[personnelId] || [];
      const itemToDelete = currentList.find((x) => x.id === id);
      if (itemToDelete) {
        deletedSummary = `${itemToDelete.category}: ${itemToDelete.label}`;
      }
      store[personnelId] = currentList.filter((x) => x.id !== id);
      saveCustomDetailsStore(store);
    } else {
      return NextResponse.json({ error: `Unsupported detail type for deletion: ${type}` }, { status: 400 });
    }

    // Audit Log Entry
    await AuditService.log({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "REMOVE_PERSONNEL_DATASET_DETAIL",
      resource: "Personnel",
      resourceId: personnelId,
      metadata: {
        type,
        deletedId: id,
        summary: deletedSummary,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Detail '${deletedSummary}' successfully removed from dataset.`,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
