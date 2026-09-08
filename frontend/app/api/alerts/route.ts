import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, handleAuthError } from "@/lib/auth/rbac";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const alerts = await prisma.earlyWarning.findMany({
      where: status ? { status } : undefined,
      include: {
        personnel: {
          select: {
            id: true,
            name: true,
            rank: true,
            force: true,
            baseLocation: true,
            unit: { select: { name: true } },
          },
        },
        unit: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    return handleAuthError(error);
  }
}
