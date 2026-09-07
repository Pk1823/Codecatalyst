export type WellnessRating = "Very Low" | "Low" | "Moderate" | "Good" | "Very Good";

export interface WellnessAssessmentInput {
  energy: WellnessRating;
  sleepQuality: WellnessRating;
  workload: WellnessRating;
  recovery: WellnessRating;
  emotionalFatigue: WellnessRating;
  workLifeBalance: WellnessRating;
  overallWellbeing: WellnessRating;
  additionalNotes?: string;
}

export interface WellnessAssessmentResult {
  id: string;
  personnelId: string;
  date: string;
  indicatorStatus: "Low Concern" | "Moderate Attention" | "Elevated Attention" | "Immediate Support";
  score: number; // 0-100
  stressLevel: "Low" | "Moderate" | "Elevated" | "High";
  fatigueLevel: "Low" | "Moderate" | "Elevated" | "High";
  workloadStatus: "Optimal" | "Elevated" | "High";
  recoveryStatus: "Adequate" | "Moderate" | "Reduced";
  recommendation: string;
  voluntaryConsentTimestamp: string;
}

export interface WellnessTrendPoint {
  date: string;
  wellness: number;
  stress: number;
  fatigue: number;
  workload: number;
}
