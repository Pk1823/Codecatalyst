"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  FileText,
} from "lucide-react";
import { WelfareService } from "@/services/welfare.service";
import { AIRecommendation } from "@/types/welfare";
import { useToast } from "@/components/providers";

export default function RecommendationsPage() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Welfare Recommendations
          </h2>
          <span className="rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono px-2 py-0.5 border border-emerald-500/20">
            Decision Support
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Algorithmic proposals for duty rota adjustments, leave clearance drives, and battalion recovery cycles.
        </p>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  {rec.category}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    rec.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : rec.status === "Assigned"
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {rec.status}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white">
                {rec.title}
              </h3>

              <div className="rounded-lg bg-slate-950/60 p-3 text-xs text-slate-300 space-y-1.5 border border-slate-800">
                <p>
                  <strong className="text-slate-200">Observed Trigger:</strong> {rec.reason}
                </p>
                <p className="text-emerald-400">
                  <strong className="text-emerald-300">Recommended Action:</strong> {rec.recommendedAction}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-slate-400 font-mono">
                Target: <strong className="text-slate-200">{rec.targetUnit || "All Battalions"}</strong>
              </span>

              {/* Action Buttons: Review, Assign, Mark Complete */}
              <div className="flex items-center gap-1.5">
                {rec.status !== "Completed" ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(rec.id, "Assigned")}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium hover:bg-slate-800 text-slate-200 transition-colors"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(rec.id, "Completed")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      Mark Complete
                    </button>
                  </>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Action Executed</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
