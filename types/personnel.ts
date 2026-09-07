export interface PersonnelRecord {
  id: string; // e.g. P-1024
  name: string;
  rank: string;
  unit: string;
  deploymentLocation: string;
  deploymentDurationDays: number;
  continuousDutyHours: number;
  lastLeaveDate: string;
  leaveDaysTakenYTD: number;
  leaveEntitlementDays: number;
  workloadScore: number; // 0-100 percentage
  workloadStatus: "Optimal" | "Moderate" | "Elevated" | "Severe";
  recoveryTimeHours: number;
  dutyHoursPerWeek: number;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  anonymizedCode: string;
}
