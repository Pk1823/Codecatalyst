"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  HandHelping,
} from "lucide-react";
import { WELLNESS_STEPS } from "@/lib/mock-data/wellness";
import { WellnessRating, WellnessAssessmentInput, WellnessAssessmentResult } from "@/types/wellness";
import { WellnessService } from "@/services/wellness.service";
import { useToast } from "@/components/providers";

const assessmentSchema = z.object({
  consecutiveFieldDays: z.string().min(1, "Required"),
  dutyHours5d: z.string().min(1, "Required"),
  nightShifts5d: z.string().min(1, "Required"),
  sleepHrs5dAvg: z.string().min(1, "Required"),
  selfReportedEnergy: z.string().min(1, "Required"),
  selfReportedStress: z.string().min(1, "Required"),
  additionalNotes: z.string().optional(),
});

export default function WellnessAssessmentPage() {
  const { toast } = useToast();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submittedResult, setSubmittedResult] = useState<WellnessAssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    watch,
    setValue,
    handleSubmit,
  } = useForm<WellnessAssessmentInput>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      consecutiveFieldDays: "11-30",
      dutyHours5d: "30-45 hours",
      nightShifts5d: "0",
      sleepHrs5dAvg: "6-7 hours",
      selfReportedEnergy: "3",
      selfReportedStress: "3-4",
      additionalNotes: "",
    },
  });

  const formValues = watch();
  const currentStep = WELLNESS_STEPS[currentStepIndex];

  const handleSelectOption = (value: string) => {
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
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-8 text-center space-y-6 shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
              Assessment Completed Confidentially
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Wellness Assessment Complete
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Reference: {submittedResult.id} • {submittedResult.date}
            </p>
          </div>

          {/* Indicator Result Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Overall Status
                </span>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {submittedResult.indicatorStatus}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-white">
                  {submittedResult.score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </span>
              </div>
            </div>

            {/* Supporting Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Stress Indicator</span>
                <span className="font-semibold text-slate-900 dark:text-white">{submittedResult.stressLevel}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Fatigue Level</span>
                <span className="font-semibold text-slate-900 dark:text-white">{submittedResult.fatigueLevel}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Workload</span>
                <span className="font-semibold text-slate-900 dark:text-white">{submittedResult.workloadStatus}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Recovery</span>
                <span className="font-semibold text-slate-900 dark:text-white">{submittedResult.recoveryStatus}</span>
              </div>
            </div>

            {/* Supportive Recommendation */}
            <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white block">
                Welfare Recommendation:
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{submittedResult.recommendation}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/personnel"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs font-semibold shadow-xs transition-colors"
            >
              <span>View My Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/personnel/support"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 text-xs font-semibold shadow-xs transition-colors"
            >
              <HandHelping className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Request Support</span>
            </Link>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Participation is voluntary. Your responses are protected under the MissionWell Dignity Safeguard Protocol and are not used for disciplinary evaluations or Annual Confidential Reports (ACR/APAR).
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
      {/* Main Assessment Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-8 shadow-md">
        {/* Progress Bar & Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span>
              Step {currentStep.stepNumber} of {WELLNESS_STEPS.length}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
              {Math.round((currentStep.stepNumber / WELLNESS_STEPS.length) * 100)}% Completed
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(currentStep.stepNumber / WELLNESS_STEPS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
              Dimension 0{currentStep.stepNumber} • {currentStep.title}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {currentStep.question}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentStep.description}
            </p>
          </div>

          {/* Options Radio List */}
          <div className="space-y-2">
            {currentStep.options.map((opt) => {
              const isSelected = currentValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectOption(opt.value)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all duration-150 ease-out flex items-start justify-between gap-3 cursor-pointer active:scale-[0.99] ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-850"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {opt.label}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{opt.hint}</p>
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional notes on final step */}
          {currentStepIndex === WELLNESS_STEPS.length - 1 && (
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Confidential notes for Welfare Officer (optional)
              </label>
              <textarea
                rows={2}
                placeholder="Any special remarks regarding recent fatigue, family concerns, or rest..."
                value={formValues.additionalNotes || ""}
                onChange={(e) => setValue("additionalNotes", e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            {currentStepIndex < WELLNESS_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors disabled:opacity-40"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Submit Voluntary Assessment"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Disciplinary Protection Guarantee */}
      <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>
          Responses are protected under DPDP Act 2023 and are strictly excluded from Annual Confidential Reports (ACR).
        </span>
      </div>
    </div>
  );
}
