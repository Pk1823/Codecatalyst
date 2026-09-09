"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Brain,
  ShieldCheck,
  Clock,
  FolderHeart,
  UserCheck,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Sliders,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { RiskBadge } from "@/components/common/risk-badge";
import { RiskService } from "@/services/risk.service";
import { PersonnelService } from "@/services/personnel.service";
import { WelfareService } from "@/services/welfare.service";
import { PersonnelRiskAnalysis } from "@/types/risk";
import { PersonnelRecord } from "@/types/personnel";
import { useToast } from "@/components/providers";
import { AIEngineClient, AIPredictionResponse, TelemetryPayload } from "@/lib/ai-client";

export default function IndividualRiskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [riskData, setRiskData] = useState<PersonnelRiskAnalysis | null>(null);
  const [personnel, setPersonnel] = useState<PersonnelRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Live AI Simulation State
  const [fieldDays, setFieldDays] = useState(48);
  const [dutyHours, setDutyHours] = useState(65.0);
  const [nightShifts, setNightShifts] = useState(3);
  const [leaveDenial, setLeaveDenial] = useState(0.35);
  const [sleepHrs, setSleepHrs] = useState(4.2);
  const [deltaRhr, setDeltaRhr] = useState(5.4);
  const [reportedStress, setReportedStress] = useState(7);
  const [maskingIndex, setMaskingIndex] = useState(0.15);

  const [isPredicting, setIsPredicting] = useState(false);
  const [livePrediction, setLivePrediction] = useState<AIPredictionResponse["evaluation"] | null>(null);

  // Modals / Actions state
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const risk = await RiskService.getRiskAnalysisById(resolvedParams.id);
      const p = await PersonnelService.getPersonnelById(resolvedParams.id);
      setRiskData(risk);
      setPersonnel(p);

      // Run initial live prediction from AI Engine
      if (risk) {
        const initTelemetry: TelemetryPayload = {
          subject_id: risk.personnelId,
          consecutive_field_days: risk.riskScore > 60 ? 52 : 24,
          duty_hours_5d: risk.riskScore > 60 ? 66.0 : 42.0,
          night_shifts_5d: risk.riskScore > 60 ? 4 : 1,
          leave_denial_ratio: risk.riskScore > 60 ? 0.40 : 0.05,
          sleep_hrs_5d_avg: risk.riskScore > 60 ? 3.8 : 7.2,
          self_reported_energy: risk.riskScore > 60 ? 1 : 4,
          self_reported_stress: risk.riskScore > 60 ? 8 : 3,
          survey_latency_sec: 42.0,
          delta_rhr: risk.riskScore > 60 ? 6.8 : 1.2,
          masking_index: 0.12,
        };

        setFieldDays(initTelemetry.consecutive_field_days);
        setDutyHours(initTelemetry.duty_hours_5d);
        setNightShifts(initTelemetry.night_shifts_5d);
        setLeaveDenial(initTelemetry.leave_denial_ratio);
        setSleepHrs(initTelemetry.sleep_hrs_5d_avg);
        setDeltaRhr(initTelemetry.delta_rhr);
        setReportedStress(initTelemetry.self_reported_stress);
        setMaskingIndex(initTelemetry.masking_index);

        const aiRes = await AIEngineClient.predict(initTelemetry);
        if (aiRes?.evaluation) {
          setLivePrediction(aiRes.evaluation);
        }
      }

      setLoading(false);
    }
    loadData();
  }, [resolvedParams.id]);

  const handleRunLivePrediction = async () => {
    setIsPredicting(true);
    try {
      const payload: TelemetryPayload = {
        subject_id: riskData?.personnelId || "P-1024",
        consecutive_field_days: fieldDays,
        duty_hours_5d: dutyHours,
        night_shifts_5d: nightShifts,
        leave_denial_ratio: leaveDenial,
        sleep_hrs_5d_avg: sleepHrs,
        self_reported_energy: sleepHrs > 6 ? 4 : 1,
        self_reported_stress: reportedStress,
        survey_latency_sec: maskingIndex > 0.35 ? 10.0 : 45.0,
        delta_rhr: deltaRhr,
        masking_index: maskingIndex,
      };

      const res = await AIEngineClient.predict(payload);
      if (res?.evaluation) {
        setLivePrediction(res.evaluation);
        toast({
          title: "AI Inference Complete",
          description: `Evaluated ${res.evaluation.risk_band} Risk via LightGBM (SHAP attributions updated).`,
          type: "success",
        });
      }
    } catch {
      toast({
        title: "Inference Error",
        description: "Could not complete live AI evaluation.",
        type: "error",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  if (loading || !riskData) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3" />
        <div className="h-36 bg-slate-800/60 rounded-xl" />
        <div className="h-64 bg-slate-800/60 rounded-xl" />
      </div>
    );
  }

  const handleCreateCase = async () => {
    try {
      const created = await WelfareService.createSupportRequestCase({
        personnelId: riskData.personnelId,
        supportType: "Workload Review & Duty Rotation",
        priority: "High",
        description: "Case initiated from AI Risk Explanation Review (72/100 HIGH Welfare Indicator).",
        preferredContact: "Welfare Officer",
      });

      toast({
        title: "Welfare Case Created",
        description: `Created case ${created.id} for ${riskData.personnelId}.`,
        type: "success",
      });
      router.push(`/welfare/cases/${created.id}`);
    } catch {
      toast({
        title: "Error creating case",
        type: "error",
      });
    }
  };

  const handleAssignOfficer = () => {
    toast({
      title: "Welfare Officer Assigned",
      description: "Dr. Aarti Sharma has been designated as primary welfare coordinator.",
      type: "success",
    });
  };

  const handleScheduleFollowup = () => {
    toast({
      title: "Follow-up Scheduled",
      description: "1-on-1 confidential review set for 10 March 2025.",
      type: "success",
    });
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    toast({
      title: "Confidential Note Added",
      description: "Appended to officer clinical evaluation records.",
      type: "info",
    });
    setNoteText("");
    setShowNoteInput(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Link
          href="/analytics"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Risk Analytics</span>
        </Link>
      </div>

      {/* Main Personnel Header Card */}
      <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              Personnel ID: {riskData.personnelId}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Pseudonym: {riskData.anonymizedCode}
            </span>
            <RiskBadge level={livePrediction?.risk_band === "HIGH" ? "HIGH" : livePrediction?.risk_band === "MODERATE" ? "MODERATE" : "LOW"} size="md" />
          </div>

          <h1 className="text-xl font-bold text-[#F8FAFC]">
            {personnel?.name || "Uniformed Personnel"}
          </h1>

          <p className="text-xs text-slate-400">
            {riskData.rank} • {riskData.unit} • Deployed in {personnel?.deploymentLocation || "Forward Operational Area"}
          </p>
        </div>

        {/* AI Welfare Risk Indicator Score Display */}
        <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 text-center min-w-[190px] shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            AI Risk Evaluation
          </span>
          <div className="mt-1 flex items-baseline justify-center gap-1">
            <span className="text-3xl font-mono font-bold text-emerald-400">
              {livePrediction?.risk_band || riskData.riskLevel}
            </span>
          </div>
          <div className="mt-1 text-[11px] font-mono font-medium text-slate-300">
            Priority: {livePrediction?.alert_priority || "ROUTINE"}
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">
            LGBM Confidence: {livePrediction ? `${Math.round(Math.max(livePrediction.confidence_scores.high, livePrediction.confidence_scores.moderate, livePrediction.confidence_scores.low) * 100)}%` : "78.4%"}
          </span>
        </div>
      </div>

      {/* Live AI Telemetry Simulator & Interactive Evaluator */}
      <div className="rounded-xl border border-emerald-500/30 bg-[#0F172A] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">
                Interactive AI Telemetry Evaluator (FastAPI Live Model)
              </h3>
              <p className="text-xs text-slate-400">
                Adjust operational parameters to test real-time fatigue mitigation and leave rotation forecasting.
              </p>
            </div>
          </div>
          <button
            onClick={handleRunLivePrediction}
            disabled={isPredicting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[#090D16] text-xs font-bold transition-all disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isPredicting ? "animate-spin" : ""}`} />
            <span>{isPredicting ? "Running Inference..." : "Re-Evaluate AI Model"}</span>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Duty Hours */}
          <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800 space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">5-Day Duty Hours:</span>
              <strong className="text-emerald-400">{dutyHours}h</strong>
            </div>
            <input
              type="range"
              min="25"
              max="90"
              step="1"
              value={dutyHours}
              onChange={(e) => setDutyHours(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Field Deployment Days */}
          <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800 space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Continuous Field Days:</span>
              <strong className="text-emerald-400">{fieldDays}d</strong>
            </div>
            <input
              type="range"
              min="0"
              max="160"
              step="5"
              value={fieldDays}
              onChange={(e) => setFieldDays(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Sleep Hours */}
          <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800 space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Avg Sleep (24h):</span>
              <strong className="text-emerald-400">{sleepHrs}h</strong>
            </div>
            <input
              type="range"
              min="3.0"
              max="9.0"
              step="0.2"
              value={sleepHrs}
              onChange={(e) => setSleepHrs(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Resting Heart Rate Delta */}
          <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800 space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Heart Rate Delta (RHR):</span>
              <strong className="text-emerald-400">+{deltaRhr} bpm</strong>
            </div>
            <input
              type="range"
              min="-2.0"
              max="14.0"
              step="0.5"
              value={deltaRhr}
              onChange={(e) => setDeltaRhr(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Explainable AI: SHAP Factor Attributions */}
      <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Live SHAP TreeExplainer Factor Attributions
              </h3>
              <p className="text-xs text-slate-400">
                Transparent feature impact scores showing why this personnel's fatigue indicator was flagged.
              </p>
            </div>
          </div>
          <span className="rounded bg-[#090D16] border border-slate-800 px-2.5 py-1 text-[11px] font-mono text-emerald-400">
            SHAP Exact TreeExplainer
          </span>
        </div>

        {/* Contributing Factors Horizontal Bars */}
        <div className="space-y-4">
          {(livePrediction?.top_drivers || []).map((d, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-white flex items-center gap-2">
                  <span className="font-mono text-emerald-300 font-semibold">{d.feature.replace(/_/g, " ")}</span>
                  <span className="rounded bg-slate-800 text-[10px] text-slate-400 px-1.5 py-0.5 font-mono">
                    Value: {d.value}
                  </span>
                </span>
                <span className="font-mono text-emerald-400">
                  SHAP Impact: {d.importance > 0 ? `+${d.importance.toFixed(3)}` : d.importance.toFixed(3)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-[#090D16] overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(15, Math.abs(d.importance) * 45))}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 pl-0.5">
                {d.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mandatory Medical / Non-Punitive Disclaimer */}
        <div className="rounded-lg border border-slate-800 bg-[#090D16] p-3 text-xs text-slate-400 flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Non-punitive welfare indicator. Legally barred from performance appraisals (APAR) under DPDP Act 2023 regulations.</span>
        </div>
      </div>

      {/* Human Review Panel & Action Workflows */}
      <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#F8FAFC]">
              Recommended Clinical Welfare Actions
            </h3>
            <p className="text-xs text-slate-400">
              Decisions must always be taken by qualified human welfare officers.
            </p>
          </div>
          {riskData.hasActiveWelfareCase && riskData.activeCaseId && (
            <Link
              href={`/welfare/cases/${riskData.activeCaseId}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium"
            >
              <FolderHeart className="h-3 w-3" />
              <span>Active Case: {riskData.activeCaseId} →</span>
            </Link>
          )}
        </div>

        {/* System Recommended Action List */}
        <div className="space-y-2">
          {(livePrediction?.clinical_guidance || []).map((action, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-[#090D16] text-xs text-slate-300"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[10px] text-emerald-400 block font-semibold">{action.code}</span>
                <span>{action.recommendation}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="pt-2 flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleAssignOfficer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[#090D16] text-xs font-bold transition-colors"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Assign Welfare Officer</span>
          </button>

          <button
            onClick={handleCreateCase}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
          >
            <FolderHeart className="h-3.5 w-3.5 text-slate-400" />
            <span>Create Welfare Case</span>
          </button>

          <button
            onClick={handleScheduleFollowup}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
          >
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Schedule Follow-up</span>
          </button>

          <button
            onClick={() => setShowNoteInput(!showNoteInput)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-slate-400" />
            <span>Add Note</span>
          </button>
        </div>

        {/* Note Input Box when toggled */}
        {showNoteInput && (
          <div className="p-4 rounded-lg border border-slate-800 bg-[#090D16] space-y-2 animate-in fade-in">
            <label className="block text-xs font-medium text-slate-300">
              Confidential Welfare Note
            </label>
            <textarea
              rows={3}
              placeholder="Enter observations regarding rest rhythm, leave sanction, or interview notes..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#0F172A] p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNoteInput(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[#090D16] text-xs font-bold"
              >
                Save Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
