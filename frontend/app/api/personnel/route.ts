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
