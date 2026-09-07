"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HandHelping,
  HeartPulse,
  Briefcase,
  Moon,
  Users,
  CalendarClock,
  Plus,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
} from "lucide-react";
import { MOCK_WELFARE_CASES } from "@/lib/mock-data/cases";
import { InterventionRecord } from "@/types/welfare";
import { useToast } from "@/components/providers";

export default function InterventionsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Completed" | "Pending">("All");
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionRecord | null>(null);

  // Extract all interventions across cases
  const allInterventions: InterventionRecord[] = MOCK_WELFARE_CASES.flatMap((c) => c.interventions);

  const filtered = allInterventions.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return item.status === "Active";
    if (activeTab === "Completed") return item.status === "Completed";
    if (activeTab === "Pending") return item.status === "Pending";
    return true;
  });

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "Counseling":
        return HeartPulse;
      case "Workload Adjustment":
        return Briefcase;
      case "Recovery Support":
        return Moon;
      case "Family Support":
      case "Welfare Assistance":
        return Users;
      default:
        return HandHelping;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Welfare Interventions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tracking proactive operational duty rotations, sleep decompression, and psychological support.
          </p>
        </div>

        <Link
          href="/welfare/cases"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold shadow-xs"
        >
          <span>Assign to Case</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 5 High-Level Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { title: "Counseling", count: 6, icon: HeartPulse, color: "text-rose-600 dark:text-rose-400" },
          { title: "Workload Adjustment", count: 8, icon: Briefcase, color: "text-blue-600 dark:text-blue-400" },
          { title: "Recovery Support", count: 5, icon: Moon, color: "text-amber-600 dark:text-amber-400" },
          { title: "Welfare Assistance", count: 3, icon: Users, color: "text-teal-600 dark:text-teal-400" },
          { title: "Follow-up Checks", count: 12, icon: CalendarClock, color: "text-purple-600 dark:text-purple-400" },
        ].map((cat, i) => {
          const CIcon = cat.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-3"
            >
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                <CIcon className={`h-5 w-5 ${cat.color}`} />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
                  {cat.title}
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {cat.count} Active
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        {(["All", "Active", "Completed", "Pending"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {tab} Interventions
          </button>
        ))}
      </div>

      {/* Interventions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const Icon = getCategoryIcon(item.type);
          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
              onClick={() => setSelectedIntervention(item)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    {item.type}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === "Completed"
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    ● {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {item.personnelId}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{item.scheduledDate}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedIntervention && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedIntervention(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400">
                  {selectedIntervention.type}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {selectedIntervention.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIntervention(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <p>
                <strong>Description:</strong> {selectedIntervention.description}
              </p>
              <p>
                <strong>Personnel ID:</strong>{" "}
                <span className="font-mono text-blue-600">{selectedIntervention.personnelId}</span>
              </p>
              <p>
                <strong>Case ID:</strong>{" "}
                <span className="font-mono text-purple-600">{selectedIntervention.caseId}</span>
              </p>
              <p>
                <strong>Supervising Officer:</strong> {selectedIntervention.officerName}
              </p>
              {selectedIntervention.notes && (
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                  <strong>Notes:</strong> {selectedIntervention.notes}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Link
                href={`/welfare/cases/${selectedIntervention.caseId}`}
                className="px-4 py-2 rounded-lg bg-blue-700 text-white text-xs font-bold"
              >
                Open Associated Case →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
