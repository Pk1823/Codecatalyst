export type NotificationCategory = "All" | "Welfare" | "System" | "Assessment" | "Intervention";
export type NotificationPriority = "Low" | "Medium" | "High" | "Urgent";

export interface WelfareAlertItem {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  priority: NotificationPriority;
  isRead: boolean;
  personnelId?: string;
  caseId?: string;
  contributingIndicators?: string[];
  recommendedAction?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  status: "Authorized" | "Flagged" | "Blocked";
  ipAddress: string;
  details?: string;
}
