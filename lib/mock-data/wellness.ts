import { WellnessTrendPoint, WellnessRating } from "@/types/wellness";

export interface AssessmentStepConfig {
  id: keyof import("@/types/wellness").WellnessAssessmentInput;
  stepNumber: number;
  title: string;
  question: string;
  description: string;
  options: { label: WellnessRating; value: WellnessRating; hint: string }[];
}

export const WELLNESS_STEPS: AssessmentStepConfig[] = [
  {
    id: "energy",
    stepNumber: 1,
    title: "Energy & Vitality",
    question: "How would you rate your current physical and mental energy level?",
    description: "Reflect on how energized you feel throughout your scheduled duties and rest intervals.",
    options: [
      { label: "Very Low", value: "Very Low", hint: "Exhausted upon waking, struggling to complete routines" },
      { label: "Low", value: "Low", hint: "Drained quickly, requires excessive effort" },
      { label: "Moderate", value: "Moderate", hint: "Adequate to meet daily duties with normal fatigue" },
      { label: "Good", value: "Good", hint: "Energized, able to maintain consistent focus" },
      { label: "Very Good", value: "Very Good", hint: "High vitality and stamina across full shifts" },
    ],
  },
  {
    id: "sleepQuality",
    stepNumber: 2,
    title: "Sleep & Rest Quality",
    question: "How restorative has your sleep been over the past 7 days?",
    description: "Consider uninterrupted hours, ease of falling asleep, and physical refreshment.",
    options: [
      { label: "Very Low", value: "Very Low", hint: "Frequent awakenings, severe insomnia or restless cycles" },
      { label: "Low", value: "Low", hint: "Broken sleep, waking unrefreshed repeatedly" },
      { label: "Moderate", value: "Moderate", hint: "Average rest with minor sleep disturbances" },
      { label: "Good", value: "Good", hint: "Consistent 6-7 hours of sound sleep" },
      { label: "Very Good", value: "Very Good", hint: "Deep, undisturbed restorative sleep every night" },
    ],
  },
  {
    id: "workload",
    stepNumber: 3,
    title: "Duty & Workload Pressure",
    question: "How manageable has your recent duty schedule and operational pace felt?",
    description: "Evaluates shift lengths, stand-to requirements, and continuous patrol hours.",
    options: [
      { label: "Very Low", value: "Very Low", hint: "Severe overload, continuous shifts without relief" },
      { label: "Low", value: "Low", hint: "High pressure, regular extended shifts beyond standard hours" },
      { label: "Moderate", value: "Moderate", hint: "Busy but manageable operational workload" },
      { label: "Good", value: "Good", hint: "Balanced shifts with predictable handover intervals" },
      { label: "Very Good", value: "Very Good", hint: "Smooth, well-distributed duties and light workload" },
    ],
  },
  {
    id: "recovery",
    stepNumber: 4,
    title: "Recovery & Downtime",
    question: "Are you able to adequately disconnect, relax, and recover between shifts?",
    description: "Assesses personal decompression, recreation, and physical relaxation opportunities.",
    options: [
      { label: "Very Low", value: "Very Low", hint: "Practically no downtime between duty call-outs" },
      { label: "Low", value: "Low", hint: "Downtime frequently interrupted or insufficient" },
      { label: "Moderate", value: "Moderate", hint: "Basic rest achievable, limited personal recreation" },
      { label: "Good", value: "Good", hint: "Sufficient predictable rest periods between rotations" },
      { label: "Very Good", value: "Very Good", hint: "Ample recovery time and recreation facilities" },
    ],
  },
  {
    id: "emotionalFatigue",
    stepNumber: 5,
    title: "Emotional & Mental Strain",
    question: "How would you describe your level of mental clarity and emotional ease?",
    description: "Looks at feelings of tension, irritability, emotional drain, or hyper-vigilance.",
    options: [
      { label: "Very Low", value: "Very Low", hint: "High continuous tension, emotional numbness or irritability" },
      { label: "Low", value: "Low", hint: "Frequent mental strain and difficulty concentrating" },
      { label: "Moderate", value: "Moderate", hint: "Occasional stress manageable through comradeship" },
      { label: "Good", value: "Good", hint: "Calm, steady mindset with good emotional balance" },
      { label: "Very Good", value: "Very Good", hint: "Completely calm, resilient, and clear-headed" },
    ],
  },
  {
    id: "workLifeBalance",
    stepNumber: 6,
    title: "Family & Social Connection",
    question: "How satisfied are you with your connection to family and personal support networks?",
    description: "Evaluates ability to communicate home, family comfort, and peace of mind.",
    options: [
      { label: "Very Low", value: "Very Low", hint: "Severe family worries, unable to establish contact" },
      { label: "Low", value: "Low", hint: "Stressful family situations with restricted communication" },
      { label: "Moderate", value: "Moderate", hint: "Regular contact, typical distant concerns" },
      { label: "Good", value: "Good", hint: "Reassuring contact and stable family situation" },
      { label: "Very Good", value: "Very Good", hint: "Excellent family support and peaceful home environment" },
    ],
  },
  {
    id: "overallWellbeing",
    stepNumber: 7,
    title: "Overall Wellbeing Sense",
    question: "Overall, how prepared, motivated, and well do you feel today?",
    description: "General subjective assessment of health, morale, and force camaraderie.",
    options: [
      { label: "Very Low", value: "Very Low", hint: "Struggling significantly, urgent support beneficial" },
      { label: "Low", value: "Low", hint: "Sub-par wellbeing, feeling worn down" },
      { label: "Moderate", value: "Moderate", hint: "Satisfactory wellbeing, carrying on normally" },
      { label: "Good", value: "Good", hint: "Positive morale and strong readiness" },
      { label: "Very Good", value: "Very Good", hint: "Peak motivation, high morale, and complete fitness" },
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
