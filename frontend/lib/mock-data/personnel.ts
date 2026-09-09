import { PersonnelRecord } from "@/types/personnel";
import kaggleDataset from "@/lib/data/kaggle_hr_dataset.json";

/**
 * LIVE Kaggle Human Resources Dataset (rhuebner/human-resources-data-set)
 * Total Live Records: 311
 * Columns Preserved: 36
 * Converted directly from HRDataset_v14.csv without mock/hardcoded employees.
 */
export const MOCK_PERSONNEL: PersonnelRecord[] = kaggleDataset.records as unknown as PersonnelRecord[];
export const KAGGLE_METADATA = {
  fileName: "HRDataset_v14.csv",
  recordCount: 311,
  columnCount: 36,
  columns: ["Employee_Name", "EmpID", "MarriedID", "MaritalStatusID", "GenderID", "EmpStatusID", "DeptID", "PerfScoreID", "FromDiversityJobFairID", "Salary", "Termd", "PositionID", "Position", "State", "Zip", "DOB", "Sex", "MaritalDesc", "CitizenDesc", "HispanicLatino", "RaceDesc", "DateofHire", "DateofTermination", "TermReason", "EmploymentStatus", "Department", "ManagerName", "ManagerID", "RecruitmentSource", "PerformanceScore", "EngagementSurvey", "EmpSatisfaction", "SpecialProjectsCount", "LastPerformanceReview_Date", "DaysLateLast30", "Absences"],
};
