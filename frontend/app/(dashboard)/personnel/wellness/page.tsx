"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  HeartPulse,
  Info,
  RotateCcw,
  HandHelping,
} from "lucide-react";
import { WELLNESS_STEPS } from "@/lib/mock-data/wellness";
import { WellnessRating, WellnessAssessmentInput, WellnessAssessmentResult } from "@/types/wellness";
import { WellnessService } from "@/services/wellness.service";
import { useToast } from "@/components/providers";

// Zod Schema for 7 Steps
const assessmentSchema = z.object({
  energy: z.enum(["Very Low", "Low", "Moderate", "Good", "Very Good"] as const),
  sleepQuality: z.enum(["Very Low", "Low", "Moderate", "Good", "Very Good"] as const),
  workload: z.enum(["Very Low", "Low", "Moderate", "Good", "Very Good"] as const),
  recovery: z.enum(["Very Low", "Low", "Moderate", "Good", "Very Good"] as const),
  emotionalFatigue: z.enum(["Very Low", "Low", "Moderate", "Good", "Very Good"] as const),
  workLifeBalance: z.enum(["Very Low", "Low", "Moderate", "Good", "Very Good"] as const),
  overallWellbeing: z.enum(["Very Low", "Low", "Moderate", "Good", "Very Good"] as const),
  additionalNotes: z.string().optional(),
});

export default function WellnessAssessmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submittedResult, setSubmittedResult] = useState<WellnessAssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WellnessAssessmentInput>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      energy: "Moderate",
      sleepQuality: "Moderate",
      workload: "Low", // meaning low manageable pressure
      recovery: "Moderate",
      emotionalFatigue: "Moderate",
      workLifeBalance: "Moderate",
      overallWellbeing: "Moderate",
      additionalNotes: "",
    },
  });

  const formValues = watch();
  const currentStep = WELLNESS_STEPS[currentStepIndex];

  const handleSelectOption = (value: WellnessRating) => {
    setValue(currentStep.id, value);
  };

  const nextStep = () => {
    if (currentStepIndex < WELLNESS_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: WellnessAssessmentInput) => {
    setIsSubmitting(true);
    try {
      const result = await WellnessService.submitAssessment(data, "P-1024");
      setSubmittedResult(result);
      toast({
        title: "Assessment Recorded",
        description: "Your responses have been confidentially logged for welfare planning.",
        type: "success",
      });
    } catch {
      toast({
        title: "Error submitting assessment",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // RESULT SCREEN AFTER SUBMISSION
  // -------------------------------------------------------------
  if (submittedResult) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-lg text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Assessment Completed Confidentially
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
              Wellness Assessment Complete
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Reference Token: {submittedResult.id} • {submittedResult.date}
            </p>
          </div>

          {/* Indicator Result Card */}
          <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 p-5 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-amber-900/60 pb-3">
              <div>
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                  Overall Wellness Status
                </span>
                <p className="text-base font-bold text-amber-800 dark:text-amber-200">
                  {submittedResult.indicatorStatus}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-800 dark:text-amber-200">
                  {submittedResult.score} / 100
                </span>
              </div>
            </div>

            {/* Supporting Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-100 dark:border-amber-900/40">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Stress Indicator</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{submittedResult.stressLevel}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-100 dark:border-amber-900/40">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Fatigue Level</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{submittedResult.fatigueLevel}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-100 dark:border-amber-900/40">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Workload Pressure</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{submittedResult.workloadStatus}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-100 dark:border-amber-900/40">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Recovery Downtime</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{submittedResult.recoveryStatus}</span>
              </div>
            </div>

            {/* Supportive Recommendation */}
            <div className="p-3 rounded-lg bg-white/90 dark:bg-slate-900/90 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                Welfare Recommendation:
              </span>
              <p>{submittedResult.recommendation}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/personnel"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 px-5 py-2.5 text-xs font-bold transition-all"
            >
              <span>View My Wellness</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/personnel/support"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-teal-500/40 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 text-teal-800 dark:text-teal-300 px-5 py-2.5 text-xs font-bold transition-all"
            >
              <HandHelping className="h-4 w-4" />
              <span>Request Support</span>
            </Link>
          </div>

          <p className="text-[11px] text-slate-400">
            Participation is voluntary. Your responses are protected under the MissionWell Dignity Safeguard Protocol and are not used for disciplinary evaluations.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MULTI-STEP ASSESSMENT FORM
  // -------------------------------------------------------------
  const currentValue = formValues[currentStep.id];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Voluntary Participation Notice */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 p-4 flex items-center gap-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
        <div className="text-xs text-blue-900 dark:text-blue-200">
          <span className="font-bold">Participation is completely voluntary.</span> Your inputs help
          welfare officers proactively optimize rest rotations and supportive counseling.
        </div>
      </div>

      {/* Main Assessment Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        {/* Progress Bar & Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>
              Step {currentStep.stepNumber} of {WELLNESS_STEPS.length}
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {Math.round((currentStep.stepNumber / WELLNESS_STEPS.length) * 100)}% Completed
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full transition-all duration-300"
              style={{
                width: `${(currentStep.stepNumber / WELLNESS_STEPS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Dimension 0{currentStep.stepNumber} • {currentStep.title}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {currentStep.question}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentStep.description}
            </p>
          </div>

          {/* Options Radio List */}
          <div className="space-y-2.5">
            {currentStep.options.map((opt) => {
              const isSelected = currentValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectOption(opt.value)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-blue-600 dark:ring-blue-500 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {opt.label}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{opt.hint}</p>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional notes on final step */}
          {currentStepIndex === WELLNESS_STEPS.length - 1 && (
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Optional confidential notes for Welfare Officer (optional)
              </label>
              <textarea
                rows={2}
                placeholder="Any special remarks regarding recent fatigue, family concerns, or rest..."
                value={formValues.additionalNotes || ""}
                onChange={(e) => setValue("additionalNotes", e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            {currentStepIndex < WELLNESS_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-600 text-white shadow-md shadow-blue-900/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isSubmitting ? "Submitting..." : "Submit Voluntary Assessment"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Disciplinary Protection Guarantee */}
      <div className="text-center text-[11px] text-slate-400 max-w-md mx-auto">
        <ShieldCheck className="h-4 w-4 inline-block mr-1 text-teal-500" />
        <span>
          Your responses are used strictly to support welfare planning and are not used for disciplinary decisions.
        </span>
      </div>
    </div>
  );
}
