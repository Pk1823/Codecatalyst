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
} from "lucide-react";
import { RiskBadge } from "@/components/common/risk-badge";
import { RiskService } from "@/services/risk.service";
import { PersonnelService } from "@/services/personnel.service";
import { WelfareService } from "@/services/welfare.service";
import { PersonnelRiskAnalysis } from "@/types/risk";
import { PersonnelRecord } from "@/types/personnel";
import { useToast } from "@/components/providers";

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
      setLoading(false);
    }
    loadData();
  }, [resolvedParams.id]);

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
      {/* Back button & Breadcrumb */}
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
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              Personnel ID: {riskData.personnelId}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Pseudonym: {riskData.anonymizedCode}
            </span>
            <RiskBadge level={riskData.riskLevel} size="md" />
          </div>

          <h2 className="text-xl font-bold text-white">
            {personnel?.name || "Uniformed Personnel"}
          </h2>

          <p className="text-xs text-slate-400">
            {riskData.rank} • {riskData.unit} • Deployed in {personnel?.deploymentLocation || "Forward Operational Area"}
          </p>
        </div>

        {/* AI Welfare Risk Indicator Score Display */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-center min-w-[180px] shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Welfare Indicator
          </span>
          <div className="mt-1 flex items-baseline justify-center gap-1">
            <span className="text-3xl font-mono font-bold text-amber-400">
              {riskData.riskScore}
            </span>
            <span className="text-xs font-mono text-slate-500">/ 100</span>
          </div>
          <div className="mt-1 text-[11px] font-mono font-medium text-amber-400">
            {riskData.riskLevel}
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">
            Model Confidence: {riskData.modelConfidence}%
          </span>
        </div>
      </div>

      {/* Explainable AI: Why this indicator is elevated */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Factor Attribution Breakdown
              </h3>
              <p className="text-xs text-slate-400">
                Transparent factor attribution percentage breakdown derived from HRMS and roster telemetry.
              </p>
            </div>
          </div>
          <span className="rounded bg-slate-800 px-2.5 py-1 text-[11px] font-mono text-slate-300">
            Shapley Factor Attribution
          </span>
        </div>

        {/* Contributing Factors Horizontal Bars */}
        <div className="space-y-4">
          {riskData.contributingFactors.map((f, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-white flex items-center gap-2">
                  <span>{f.factor}</span>
                  <span className="rounded bg-slate-800 text-[10px] text-slate-400 px-1.5 py-0.5 font-mono">
                    {f.category}
                  </span>
                </span>
                <span className="font-mono text-emerald-400">
                  {f.percentage}% Impact
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${f.percentage * 2.8}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 pl-0.5">
                {f.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mandatory Medical / Non-Punitive Disclaimer */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-400 flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{riskData.disclaimer}</span>
        </div>
      </div>

      {/* Human Review Panel & Action Workflows */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Recommended Human Review Actions
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
          {riskData.recommendedActions.map((action, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/40 text-xs text-slate-300"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{action}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="pt-2 flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleAssignOfficer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
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
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-950 space-y-2 animate-in fade-in">
            <label className="block text-xs font-medium text-slate-300">
              Confidential Welfare Note
            </label>
            <textarea
              rows={3}
              placeholder="Enter observations regarding rest rhythm, leave sanction, or interview notes..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500"
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
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
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
