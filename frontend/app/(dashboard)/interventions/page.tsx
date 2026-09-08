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
  Clock,
  ChevronRight,
  X,
} from "lucide-react";
import { MOCK_WELFARE_CASES } from "@/lib/mock-data/cases";
import { InterventionRecord } from "@/types/welfare";

export default function InterventionsPage() {
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
          <h2 className="text-xl font-bold tracking-tight text-white">
            Welfare Interventions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tracking proactive operational duty rotations, sleep decompression, and psychological support.
          </p>
        </div>

        <Link
          href="/welfare/cases"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <span>Assign to Case</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 5 High-Level Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { title: "Counseling", count: 6, icon: HeartPulse, color: "text-rose-400" },
          { title: "Workload Adjustment", count: 8, icon: Briefcase, color: "text-emerald-400" },
          { title: "Recovery Support", count: 5, icon: Moon, color: "text-amber-400" },
          { title: "Welfare Assistance", count: 3, icon: Users, color: "text-teal-400" },
          { title: "Follow-up Checks", count: 12, icon: CalendarClock, color: "text-sky-400" },
        ].map((cat, i) => {
          const CIcon = cat.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center gap-3"
            >
              <div className="p-2.5 rounded-lg bg-slate-800">
                <CIcon className={`h-4 w-4 ${cat.color}`} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block truncate font-medium">
                  {cat.title}
                </span>
                <span className="text-lg font-bold text-white font-mono">
                  {cat.count} <span className="text-xs text-slate-500 font-normal">Active</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        {(["All", "Active", "Completed", "Pending"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            {tab} Interventions
          </button>
        ))}
      </div>

      {/* Interventions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors cursor-pointer"
              onClick={() => setSelectedIntervention(item)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                    {item.type}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono font-medium text-emerald-400">
                  {item.personnelId}
                </span>
                <span className="flex items-center gap-1 font-mono text-slate-500 text-[10px]">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setSelectedIntervention(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400">
                  {selectedIntervention.type}
                </span>
                <h3 className="text-base font-semibold text-white">
                  {selectedIntervention.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIntervention(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                <strong className="text-slate-200">Description:</strong> {selectedIntervention.description}
              </p>
              <p>
                <strong className="text-slate-200">Personnel ID:</strong>{" "}
                <span className="font-mono text-emerald-400">{selectedIntervention.personnelId}</span>
              </p>
              <p>
                <strong className="text-slate-200">Case ID:</strong>{" "}
                <span className="font-mono text-emerald-400">{selectedIntervention.caseId}</span>
              </p>
              <p>
                <strong className="text-slate-200">Supervising Officer:</strong> {selectedIntervention.officerName}
              </p>
              {selectedIntervention.notes && (
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  <strong>Notes:</strong> {selectedIntervention.notes}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Link
                href={`/welfare/cases/${selectedIntervention.caseId}`}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
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
