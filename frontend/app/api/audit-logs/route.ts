import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, handleAuthError } from "@/lib/auth/rbac";

export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(["ADMIN"]);

    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const action = searchParams.get("action") || undefined;
    const resource = searchParams.get("resource") || undefined;

    const where: any = {};
    if (action) where.action = action;
    if (resource) where.resource = resource;

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: Math.min(limit, 200),
    });

    const parsedLogs = logs.map((log) => ({
      ...log,
      details: log.metadata ? JSON.parse(log.metadata) : null,
    }));

    return NextResponse.json({
      metadata: {
        total: parsedLogs.length,
        dataset: "Synthetic Demo Data",
      },
      data: parsedLogs,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
