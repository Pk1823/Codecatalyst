import { prisma } from "../lib/db";

export interface LogEventParams {
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export class AuditService {
  static async log(params: LogEventParams): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          actorId: params.actorId,
          actorName: params.actorName,
          actorRole: params.actorRole,
          action: params.action,
          resource: params.resource,
          resourceId: params.resourceId,
          metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        },
      });
    } catch (err) {
      console.error("[AUDIT_LOG_FAILURE]:", err);
    }
  }

  static async getLogs(limit: number = 50, action?: string, resource?: string) {
    const where: any = {};
    if (action) where.action = action;
    if (resource) where.resource = resource;

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: Math.min(limit, 200),
    });

    return logs.map((log) => ({
      ...log,
      details: log.metadata ? JSON.parse(log.metadata) : null,
    }));
  }
}
