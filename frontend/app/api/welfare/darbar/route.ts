import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, handleAuthError } from "@/lib/auth/rbac";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { targetOfficer, reasonCategory, notes } = body;
    const soldierId = session.personnelId || "P-1024";

    const personnel = await prisma.personnel.findUnique({ where: { id: soldierId } });

    const welfareOfficers = await prisma.user.findMany({ where: { role: "WELFARE_OFFICER" } });
    for (const officer of welfareOfficers) {
      await prisma.notification.create({
        data: {
          userId: officer.id,
          title: `Darbar Audience Request: ${personnel?.name || soldierId}`,
          message: `Requested audience with ${targetOfficer} regarding '${reasonCategory}'. Remarks: ${notes || "No notes provided"}`,
          type: "alert",
          category: "Welfare",
          link: "/welfare/cases",
        },
      });
    }

    const existingCase = await prisma.welfareCase.findFirst({
      where: { personnelId: soldierId, status: { not: "CLOSED" } },
    });
    if (existingCase) {
      await prisma.caseNote.create({
        data: {
          caseId: existingCase.id,
          authorId: session.userId,
          authorName: session.name || "Direct Darbar Request",
          text: `Confidential Darbar Requested with ${targetOfficer} for ${reasonCategory}. Notes: ${notes || "Pending slot confirmation."}`,
          isConfidential: true,
        },
      });
      await prisma.welfareCase.update({
        where: { id: existingCase.id },
        data: { updatedAt: new Date(), notesCount: { increment: 1 } },
      });
    }

    return NextResponse.json(
      {
        id: `DBR-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split("T")[0],
        targetOfficer,
        reasonCategory,
        status: "PENDING",
        confidentialNotes: notes,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
