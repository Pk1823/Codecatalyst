import { prisma } from "@/lib/db";

export interface CreateAuditLogParams {
  actorId?: string;
  actorName: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown> | string;
}

export class AuditService {
  /**
   * Appends an immutable audit log record to the database.
   */
  static async log(params: CreateAuditLogParams): Promise<void> {
    try {
      const metaString =
        typeof params.metadata === "object"
          ? JSON.stringify(params.metadata)
          : params.metadata;

      await prisma.auditLog.create({
        data: {
          actorId: params.actorId,
          actorName: params.actorName,
          actorRole: params.actorRole,
          action: params.action,
          resource: params.resource,
          resourceId: params.resourceId,
          metadata: metaString,
        },
      });
    } catch (err) {
      console.error("[AuditService.log] Failed to write audit record:", err);
    }
  }

  /**
   * Retrieves audit logs with optional filtering.
   */
  static async getLogs(limit: number = 50, action?: string) {
    return prisma.auditLog.findMany({
      where: action ? { action } : undefined,
      orderBy: { timestamp: "desc" },
      take: limit,
    });
  }
}
