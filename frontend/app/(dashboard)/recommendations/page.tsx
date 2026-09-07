"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Moon,
  Users,
  RotateCcw,
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
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            AI Welfare Recommendations
          </h2>
          <span className="rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[10px] font-bold px-2.5 py-0.5 border border-teal-300 dark:border-teal-800">
            Predictive Decision Support
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Algorithmic proposals for duty rota adjustments, leave clearance drives, and battalion recovery cycles.
        </p>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {rec.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rec.status === "Completed"
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      : rec.status === "Assigned"
                      ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                      : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  ● {rec.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {rec.title}
              </h3>

              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 border border-slate-100 dark:border-slate-800">
                <p>
                  <strong>Observed Trigger:</strong> {rec.reason}
                </p>
                <p className="text-teal-700 dark:text-teal-300">
                  <strong>Recommended Action:</strong> {rec.recommendedAction}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-slate-400">
                Target: <strong>{rec.targetUnit || "All Battalions"}</strong>
              </span>

              {/* Action Buttons: Review, Assign, Mark Complete */}
              <div className="flex items-center gap-1.5">
                {rec.status !== "Completed" ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(rec.id, "Assigned")}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(rec.id, "Completed")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xs transition-colors"
                    >
                      Mark Complete
                    </button>
                  </>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
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
