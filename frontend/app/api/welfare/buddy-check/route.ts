import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, handleAuthError } from "@/lib/auth/rbac";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { status } = body;
    const soldierId = session.personnelId || "P-1024";

    const personnel = await prisma.personnel.findUnique({
      where: { id: soldierId },
    });

    if (status === "NEEDS_REST" || status === "URGENT_SUPPORT") {
      const existingCase = await prisma.welfareCase.findFirst({
        where: { personnelId: soldierId, status: { not: "CLOSED" } },
      });

      if (existingCase) {
        await prisma.caseNote.create({
          data: {
            caseId: existingCase.id,
            authorId: session.userId,
            authorName: session.name || "Buddy-Pair Watch",
            text: `Buddy Check logged: Partner indicated '${status}'. Recommended duty relief.`,
            isConfidential: true,
          },
        });
        await prisma.welfareCase.update({
          where: { id: existingCase.id },
          data: { updatedAt: new Date(), notesCount: { increment: 1 } },
        });
      }

      const welfareOfficers = await prisma.user.findMany({ where: { role: "WELFARE_OFFICER" } });
      for (const officer of welfareOfficers) {
        await prisma.notification.create({
          data: {
            userId: officer.id,
            title: `Buddy Watch Alert: ${personnel?.name || soldierId}`,
            message: `Buddy check reported status '${status}'. Recommend rest window rotation.`,
            type: "alert",
            category: "Welfare",
            link: "/welfare/cases",
          },
        });
      }
    }

    return NextResponse.json({ success: true, status });
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
