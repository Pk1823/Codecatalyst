export type UserRole = "PERSONNEL" | "WELFARE_OFFICER" | "COMMANDER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  serviceId: string;
  name: string;
  role: UserRole;
  rank?: string;
  force: string;
  department?: string;
  unitId?: string;
  personnelId?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface WellnessAssessmentInput {
  consecutiveFieldDays: string;
  dutyHours5d: string;
  nightShifts5d: string;
  sleepHrs5dAvg: string;
  selfReportedEnergy: string;
  selfReportedStress: string;
  additionalNotes?: string;
}

export interface SHAPDriver {
  feature: string;
  impact: "high" | "moderate" | "low";
  description: string;
  value: string | number;
}

export interface WellnessAssessmentResult {
  id: string;
  date: string;
  riskScore: number; // 0-100
  riskCategory: "Optimal" | "Moderate Fatigue" | "Elevated Stress" | "Critical Breakdown Risk";
  predictedDaysToBreakdown?: number;
  shapDrivers: SHAPDriver[];
  recommendations: string[];
  isMaskingDetected?: boolean;
}

export interface BuddyCheckStatus {
  id: string;
  buddyName: string;
  buddyRank: string;
  buddyServiceId: string;
  lastCheckTime: string;
  status: "OK" | "NEEDS_REST" | "URGENT_SUPPORT";
}

export interface DarbarRequest {
  id: string;
  date: string;
  reasonCategory: "Family Emergency" | "Leave Regularization" | "Medical / Fatigue" | "Posting / Transfer" | "Administrative";
  targetOfficer: "Commanding Officer (CO)" | "Subedar Major (SM)";
  status: "PENDING" | "SCHEDULED" | "RESOLVED";
  scheduledSlot?: string;
  confidentialNotes?: string;
}

export interface WelfareCase {
  id: string;
  personnelId: string;
  serviceNumber: string;
  rank: string;
  name: string;
  unitName: string;
  riskScore: number;
  status: "Active Review" | "Under Counseling" | "Rest Rotation" | "Medical Stand-Down" | "Resolved" | string;
  openedDate: string;
  clinicalNotes: string;
  assignedOfficer: string;
  priority: "HIGH" | "MEDIUM" | "LOW" | string;
  anonymizedCode?: string;
  notesCount?: number;
  interventionsCount?: number;
  caseNotes?: Array<{
    id: string;
    authorName?: string;
    author?: string;
    createdAt?: string;
    date?: string;
    text: string;
    isConfidential?: boolean;
  }>;
  supportActions?: Array<{
    id: string;
    caseId?: string;
    actionType?: string;
    type?: string;
    title: string;
    description: string;
    status?: string;
    scheduledDate?: string;
    completedDate?: string;
    officerName?: string;
  }>;
  riskFactors?: Array<{
    featureName: string;
    featureValue?: number;
    contributionWeight?: number;
    description?: string;
  }>;
  recommendations?: Array<{
    id?: string;
    title: string;
    description?: string;
    category?: string;
    priority?: string;
  }>;
  timeline?: Array<{
    id: string;
    timestamp: string;
    title: string;
    description: string;
    actor: string;
    actorRole?: string;
    type?: string;
  }>;
}

export interface UnitReadinessMetric {
  unitId: string;
  unitName: string;
  totalPersonnel: number;
  optimalPercentage: number;
  moderatePercentage: number;
  highRiskPercentage: number;
  overallReadinessScore: number; // 0-100
  pendingDarbarCount: number;
}

export interface PersonnelRecord {
  id: string;
  serviceNumber: string;
  name: string;
  rank: string;
  unit: string;
  force: string;
  location: string;
  bloodGroup: string;
  consecutiveFieldDays: number;
  workloadHoursWeekly: number;
  riskScore: number;
  riskLevel: "Low" | "Moderate" | "High" | "Critical";
  antiMaskingFlag: boolean;
  lastAssessmentDate: string;
}

export interface InterventionRecord {
  id: string;
  personnelId: string;
  personnelName: string;
  personnelRank: string;
  type: "Workload Adjustment" | "Mandatory R&R Leave" | "Clinical Counseling" | "Sleep Hygiene Protocol" | "Weapon Stand-Down";
  title: string;
  description: string;
  initiatedDate: string;
  scheduledDate: string;
  status: "Active" | "Completed" | "Pending" | "Scheduled";
  priority: "High" | "Medium" | "Urgent" | "Standard";
  officerInCharge: string;
}

export interface AIRecommendation {
  id: string;
  category: "Operational" | "Clinical" | "Tactical" | "Policy";
  title: string;
  reason: string;
  recommendedAction: string;
  expectedRiskReductionPct: number;
  confidenceScore: number;
  status: "New" | "Approved" | "Assigned" | "Dismissed";
  targetUnit?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: "Success" | "Flagged" | "Blocked";
  sha256Hash: string;
}

