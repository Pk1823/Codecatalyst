import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, handleAuthError } from "@/lib/auth/rbac";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const personnelId = searchParams.get("personnelId");

    let whereClause = {};

    if (session.role === "PERSONNEL") {
      whereClause = { personnelId: session.personnelId || "P-1024" };
    } else if (personnelId) {
      whereClause = { personnelId: personnelId.toUpperCase() };
    }

    const recommendations = await prisma.recommendation.findMany({
      where: whereClause,
      include: {
        personnel: { select: { id: true, name: true, rank: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    return handleAuthError(error);
  }
}
