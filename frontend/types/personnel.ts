export interface KaggleHREmployee {
  Employee_Name: string;
  EmpID: number;
  MarriedID: number;
  MaritalStatusID: number;
  GenderID: number;
  EmpStatusID: number;
  DeptID: number;
  PerfScoreID: number;
  FromDiversityJobFairID: number;
  Salary: number;
  Termd: number;
  PositionID: number;
  Position: string;
  State: string;
  Zip: number | null;
  DOB: string;
  Sex: string;
  MaritalDesc: string;
  CitizenDesc: string;
  HispanicLatino: string;
  RaceDesc: string;
  DateofHire: string;
  DateofTermination: string | null;
  TermReason: string;
  EmploymentStatus: string;
  Department: string;
  ManagerName: string;
  ManagerID: number | null;
  RecruitmentSource: string;
  PerformanceScore: string;
  EngagementSurvey: number;
  EmpSatisfaction: number;
  SpecialProjectsCount: number;
  LastPerformanceReview_Date: string | null;
  DaysLateLast30: number;
  Absences: number;
}

export interface PersonnelRecord extends Partial<KaggleHREmployee> {
  id: string; // e.g. P-10026
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
  rawKaggleData?: KaggleHREmployee;
}
