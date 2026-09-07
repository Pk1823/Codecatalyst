import { WelfareAlertItem, AuditLogEntry } from "@/types/notifications";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data/notifications";
import { MOCK_AUDIT_LOGS } from "@/lib/mock-data/audit";

let notificationsState: WelfareAlertItem[] = [...MOCK_NOTIFICATIONS];
let auditState: AuditLogEntry[] = [...MOCK_AUDIT_LOGS];

export class NotificationService {
  static async getNotifications(): Promise<WelfareAlertItem[]> {
    return [...notificationsState];
  }

  static async markAsRead(id: string): Promise<void> {
    notificationsState = notificationsState.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  }

  static async markAllAsRead(): Promise<void> {
    notificationsState = notificationsState.map((n) => ({ ...n, isRead: true }));
  }

  static async getAuditLogs(): Promise<AuditLogEntry[]> {
    return [...auditState];
  }

  static async logEvent(event: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    const newLog: AuditLogEntry = {
      ...event,
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString(),
    };
    auditState = [newLog, ...auditState];
  }
}
