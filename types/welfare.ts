import { RiskLevel } from "./risk";

export type WelfareCaseStatus = "New" | "Under Review" | "Intervention" | "Follow-up" | "Resolved";

export type InterventionType = 
  | "Counseling"
  | "Workload Adjustment"
  | "Recovery Support"
  | "Welfare Assistance"
  | "Medical Referral"
  | "Family Support"
  | "Follow-up";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  actorRole: string;
  type: "alert" | "assignment" | "review" | "intervention" | "followup" | "status_change";
}

export interface InterventionRecord {
  id: string;
  caseId: string;
  personnelId: string;
  type: InterventionType;
  title: string;
  description: string;
  status: "Pending" | "Active" | "Completed" | "Cancelled";
  scheduledDate: string;
  completedDate?: string;
  officerName: string;
  notes?: string;
}

export interface WelfareCase {
  id: string; // e.g. CASE-2025-042
  personnelId: string;
  anonymizedCode: string;
  riskLevel: RiskLevel;
  primaryConcern: string;
  unit: string;
  assignedOfficer: string;
  assignedOfficerId: string;
  createdAt: string;
  updatedAt: string;
  status: WelfareCaseStatus;
  notesCount: number;
  interventionsCount: number;
  timeline: TimelineEvent[];
  interventions: InterventionRecord[];
  caseNotes: Array<{
    id: string;
    author: string;
    date: string;
    text: string;
    isConfidential: boolean;
  }>;
}

export interface AIRecommendation {
  id: string;
  title: string;
  category: "Workload Balancing" | "Recovery Scheduling" | "Duty Rotation" | "Unit Welfare";
  reason: string;
  targetUnit?: string;
  targetPersonnelId?: string;
  recommendedAction: string;
  impactLevel: "Low" | "Moderate" | "High";
  status: "Pending" | "Under Review" | "Assigned" | "Completed";
  createdAt: string;
}
