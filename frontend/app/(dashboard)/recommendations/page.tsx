"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  FileText,
  Sparkles,
  ChevronRight,
  X,
  Check,
  Download,
} from "lucide-react";
import { WelfareService } from "@/services/welfare.service";
import { AIRecommendation } from "@/types/welfare";
import { useToast } from "@/components/providers";

export default function RecommendationsPage() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [assignModalRec, setAssignModalRec] = useState<AIRecommendation | null>(null);
  const [targetUnit, setTargetUnit] = useState("74 Bn Bravo Company");

  useEffect(() => {
    async function loadData() {
      const data = await WelfareService.getRecommendations();
      setRecommendations(data);
    }
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, status: AIRecommendation["status"]) => {
    await WelfareService.updateRecommendationStatus(id, status);
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    toast({
      title: `Recommendation ${status}`,
      description: `Action logged to sector welfare workflow.`,
      type: "success",
    });
  };

  const handleConfirmAssignment = async () => {
    if (!assignModalRec) return;
    await WelfareService.updateRecommendationStatus(assignModalRec.id, "Assigned");
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === assignModalRec.id ? { ...r, status: "Assigned", targetUnit } : r
      )
    );
    setAssignModalRec(null);
    toast({
      title: "Recommendation Assigned",
      description: `Dispatched to ${targetUnit} duty roster.`,
      type: "success",
    });
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Category", "Title", "Reason", "ActionProposal", "Status", "TargetUnit"];
    const rows = recommendations.map((r) => [
      r.id,
      r.category,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.reason.replace(/"/g, '""')}"`,
      `"${(r.recommendedAction || "").replace(/"/g, '""')}"`,
      r.status,
      `"${r.targetUnit || "Battalion Grid"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `missionwell_recommendations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Recommendations Exported",
      description: `Downloaded ${recommendations.length} recommendations as CSV.`,
      type: "info",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI Recommendations
            </h1>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-medium px-2 py-0.5 border border-slate-200 dark:border-slate-700">
              Active Triage
            </span>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          <span>Export Proposals</span>
        </button>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                  {rec.category}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    rec.status === "Completed"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
                      : rec.status === "Assigned"
                      ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-900"
                      : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
                  }`}
                >
                  {rec.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {rec.title}
              </h3>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3.5 text-xs text-slate-700 dark:text-slate-300 space-y-2 border border-slate-200 dark:border-slate-800">
                <p>
                  <strong className="text-slate-900 dark:text-slate-200 font-semibold">Observed Trigger:</strong> {rec.reason}
                </p>
                <p className="text-emerald-700 dark:text-emerald-400">
                  <strong className="text-emerald-800 dark:text-emerald-300 font-semibold">Recommended Action:</strong> {rec.recommendedAction}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Target: <strong className="text-slate-800 dark:text-slate-200">{rec.targetUnit || "All Battalions"}</strong>
              </span>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {rec.status !== "Completed" ? (
                  <>
                    <button
                      onClick={() => setAssignModalRec(rec)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
                    >
                      Assign to Rota
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(rec.id, "Completed")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      Mark Complete
                    </button>
                  </>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Action Executed</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Modal */}
      {assignModalRec && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setAssignModalRec(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Dispatch Recommendation to Roster
              </h3>
              <button
                onClick={() => setAssignModalRec(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                  {assignModalRec.category}
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">{assignModalRec.title}</p>
                <p className="text-slate-500 dark:text-slate-400">{assignModalRec.recommendedAction}</p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Assign To Target Sub-Unit
                </label>
                <select
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="74 Bn Bravo Company">74 Bn Bravo Company (Dantewada FOB)</option>
                  <option value="Alpha Coy (Patrol Grid)">Alpha Coy (Patrol Grid)</option>
                  <option value="Charlie Coy (Base Depot)">Charlie Coy (Base Depot)</option>
                  <option value="Delta Coy (Outpost 4)">Delta Coy (Outpost 4)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalRec(null)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAssignment}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
