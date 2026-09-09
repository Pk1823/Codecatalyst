import { WellnessTrendPoint, WellnessRating } from "@/types/wellness";

export interface AssessmentStepConfig {
  id: keyof import("@/types/wellness").WellnessAssessmentInput;
  stepNumber: number;
  title: string;
  question: string;
  description: string;
  options: { label: WellnessRating | string; value: WellnessRating | string; hint: string }[];
}

export const WELLNESS_STEPS: AssessmentStepConfig[] = [
  {
    id: "consecutiveFieldDays",
    stepNumber: 1,
    title: "Deployment Duration",
    question: "How many consecutive days have you been on field deployment?",
    description: "Total uninterrupted days at your current forward post or active mission.",
    options: [
      { label: "0-10", value: "0-10", hint: "Recently deployed or at peace station" },
      { label: "11-30", value: "11-30", hint: "Standard deployment phase" },
      { label: "31-60", value: "31-60", hint: "Extended deployment" },
      { label: "61-90", value: "61-90", hint: "Long-term sustained deployment" },
      { label: "90+", value: "90+", hint: "Severely extended continuous deployment" },
    ],
  },
  {
    id: "dutyHours5d",
    stepNumber: 2,
    title: "Workload (Last 5 Days)",
    question: "Approximately how many total duty hours have you performed in the last 5 days?",
    description: "Includes active sentry, patrol, operational, and standby hours.",
    options: [
      { label: "< 30 hours", value: "< 30 hours", hint: "Light workload / Stand-down" },
      { label: "30-45 hours", value: "30-45 hours", hint: "Standard operational load" },
      { label: "46-60 hours", value: "46-60 hours", hint: "Elevated workload" },
      { label: "61-75 hours", value: "61-75 hours", hint: "Heavy operational tempo" },
      { label: "> 75 hours", value: "> 75 hours", hint: "Extreme fatigue-inducing workload" },
    ],
  },
  {
    id: "nightShifts5d",
    stepNumber: 3,
    title: "Night Shifts (Last 5 Days)",
    question: "How many night shifts (or disrupted sleep watches) did you have in the last 5 days?",
    description: "Any duty that significantly interrupted normal nocturnal sleep patterns.",
    options: [
      { label: "0", value: "0", hint: "Normal diurnal cycle maintained" },
      { label: "1", value: "1", hint: "Minor circadian disruption" },
      { label: "2", value: "2", hint: "Moderate disruption" },
      { label: "3", value: "3", hint: "Significant sleep cycle alteration" },
      { label: "4+", value: "4+", hint: "Severe circadian rhythm inversion" },
    ],
  },
  {
    id: "sleepHrs5dAvg",
    stepNumber: 4,
    title: "Average Sleep",
    question: "What is your average sleep hours per night over the last 5 days?",
    description: "Estimate continuous, restorative sleep hours.",
    options: [
      { label: "> 7 hours", value: "> 7 hours", hint: "Optimal restorative rest" },
      { label: "6-7 hours", value: "6-7 hours", hint: "Adequate rest" },
      { label: "5-6 hours", value: "5-6 hours", hint: "Mild sleep deficit" },
      { label: "4-5 hours", value: "4-5 hours", hint: "Significant sleep deprivation" },
      { label: "< 4 hours", value: "< 4 hours", hint: "Severe acute sleep deprivation" },
    ],
  },
  {
    id: "selfReportedEnergy",
    stepNumber: 5,
    title: "Current Energy Level",
    question: "How would you rate your current physical and mental energy level? (1-5)",
    description: "Self-assessment of your vitality and focus.",
    options: [
      { label: "1 - Very Low", value: "1", hint: "Exhausted, struggling to focus" },
      { label: "2 - Low", value: "2", hint: "Fatigued, requires significant effort" },
      { label: "3 - Moderate", value: "3", hint: "Average energy for daily tasks" },
      { label: "4 - Good", value: "4", hint: "Alert and active" },
      { label: "5 - Very Good", value: "5", hint: "Highly energetic and sharp" },
    ],
  },
  {
    id: "selfReportedStress",
    stepNumber: 6,
    title: "Current Stress Level",
    question: "How would you rate your current overall stress and tension? (1-10)",
    description: "Includes both operational pressure and personal stressors.",
    options: [
      { label: "1-2 (Low)", value: "1-2", hint: "Relaxed, minimal tension" },
      { label: "3-4 (Mild)", value: "3-4", hint: "Manageable operational stress" },
      { label: "5-6 (Moderate)", value: "5-6", hint: "Noticeable tension, but coping well" },
      { label: "7-8 (High)", value: "7-8", hint: "Elevated anxiety, feeling overwhelmed" },
      { label: "9-10 (Severe)", value: "9-10", hint: "Extreme distress, struggling to cope" },
    ],
  },
];

export const MOCK_WELLNESS_TRENDS: Record<"7D" | "30D" | "90D" | "6M", WellnessTrendPoint[]> = {
  "7D": [
    { date: "Day 1", wellness: 76, stress: 38, fatigue: 32, workload: 62 },
    { date: "Day 2", wellness: 74, stress: 42, fatigue: 40, workload: 68 },
    { date: "Day 3", wellness: 70, stress: 49, fatigue: 48, workload: 75 },
    { date: "Day 4", wellness: 68, stress: 55, fatigue: 52, workload: 80 },
    { date: "Day 5", wellness: 62, stress: 62, fatigue: 59, workload: 85 },
    { date: "Day 6", wellness: 65, stress: 58, fatigue: 56, workload: 78 },
    { date: "Day 7", wellness: 67, stress: 52, fatigue: 50, workload: 72 },
  ],
  "30D": [
    { date: "Wk 1", wellness: 82, stress: 30, fatigue: 28, workload: 55 },
    { date: "Wk 2", wellness: 78, stress: 39, fatigue: 36, workload: 64 },
    { date: "Wk 3", wellness: 69, stress: 54, fatigue: 51, workload: 79 },
    { date: "Wk 4", wellness: 65, stress: 61, fatigue: 58, workload: 82 },
  ],
  "90D": [
    { date: "Month 1", wellness: 84, stress: 28, fatigue: 24, workload: 50 },
    { date: "Month 2", wellness: 74, stress: 45, fatigue: 42, workload: 68 },
    { date: "Month 3", wellness: 66, stress: 58, fatigue: 55, workload: 79 },
  ],
  "6M": [
    { date: "Oct", wellness: 86, stress: 25, fatigue: 22, workload: 48 },
    { date: "Nov", wellness: 81, stress: 32, fatigue: 30, workload: 54 },
    { date: "Dec", wellness: 75, stress: 44, fatigue: 40, workload: 66 },
    { date: "Jan", wellness: 70, stress: 51, fatigue: 49, workload: 74 },
    { date: "Feb", wellness: 64, stress: 62, fatigue: 59, workload: 83 },
    { date: "Mar", wellness: 67, stress: 54, fatigue: 51, workload: 72 },
  ],
};
