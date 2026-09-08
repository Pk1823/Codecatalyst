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
  Plus,
  CheckCircle2,
} from "lucide-react";
import { MOCK_WELFARE_CASES } from "@/lib/mock-data/cases";
import { InterventionRecord, InterventionType } from "@/types/welfare";
import { useToast } from "@/components/providers";

export default function InterventionsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Completed" | "Pending">("All");
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionRecord | null>(null);

  // State to hold interventions so newly added ones persist in the current session
  const [interventionsList, setInterventionsList] = useState<InterventionRecord[]>(() =>
    MOCK_WELFARE_CASES.flatMap((c) => c.interventions)
  );

  // New Intervention Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newType, setNewType] = useState<InterventionType>("Workload Adjustment");
  const [newTitle, setNewTitle] = useState("");
  const [newPersonnelId, setNewPersonnelId] = useState("P-1024");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);

  const handleCreateIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        type: "warning",
      });
      return;
    }

    const created: InterventionRecord = {
      id: `int-${Date.now().toString().slice(-4)}`,
      caseId: "CASE-2024-001",
      personnelId: newPersonnelId.trim(),
      type: newType,
      title: newTitle.trim(),
      description: newDesc.trim(),
      status: "Active",
      scheduledDate: newDate,
      officerName: "Dr. Aarti Sharma",
    };

    setInterventionsList((prev) => [created, ...prev]);
    setIsNewModalOpen(false);
    setNewTitle("");
    setNewDesc("");

    toast({
      title: "Intervention Logged",
      description: `New ${newType} intervention scheduled for ${newPersonnelId}.`,
      type: "success",
    });
  };

  const filtered = interventionsList.filter((item) => {
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
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welfare Interventions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking proactive operational duty rotations, sleep decompression, and psychological support.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log New Intervention</span>
          </button>
          <Link
            href="/welfare/cases"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Assign to Case</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 5 High-Level Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { title: "Counseling", count: interventionsList.filter((i) => i.type === "Counseling").length, icon: HeartPulse, color: "text-rose-500 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/40" },
          { title: "Workload Adjustment", count: interventionsList.filter((i) => i.type === "Workload Adjustment").length, icon: Briefcase, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { title: "Recovery Support", count: interventionsList.filter((i) => i.type === "Recovery Support").length, icon: Moon, color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { title: "Welfare Assistance", count: interventionsList.filter((i) => i.type === "Welfare Assistance" || i.type === "Family Support").length, icon: Users, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/40" },
          { title: "Follow-up Checks", count: interventionsList.filter((i) => i.status === "Pending").length || 4, icon: CalendarClock, color: "text-sky-500 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-950/40" },
        ].map((cat, i) => {
          const CIcon = cat.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] flex items-center gap-3 shadow-xs"
            >
              <div className={`p-2.5 rounded-lg ${cat.bg}`}>
                <CIcon className={`h-4 w-4 ${cat.color}`} />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block truncate font-medium">
                  {cat.title}
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {cat.count} <span className="text-xs text-slate-400 font-normal">Active</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        {(["All", "Active", "Completed", "Pending"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === tab
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60"
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
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setSelectedIntervention(item)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                    {item.type}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.status === "Completed"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                  {item.personnelId}
                </span>
                <span className="flex items-center gap-1 font-mono text-slate-400 text-[10px]">
                  <Clock className="h-3 w-3" />
                  <span>{item.scheduledDate}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log New Intervention Modal */}
      {isNewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsNewModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Schedule Welfare Intervention
                </h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIntervention} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Intervention Category
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as InterventionType)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="Workload Adjustment">Workload Adjustment (Duty Stand-down)</option>
                  <option value="Counseling">Psychological Counseling & Decompression</option>
                  <option value="Recovery Support">Recovery Support & Sleep Regularization</option>
                  <option value="Welfare Assistance">Welfare Assistance & Family Leave</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Personnel Identifier
                </label>
                <input
                  type="text"
                  value={newPersonnelId}
                  onChange={(e) => setNewPersonnelId(e.target.value)}
                  placeholder="e.g. P-1024 or Service ID"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Intervention Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 48-Hour Decompression Stand-Down"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Operational Description / Clinical Instructions
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detail the non-punitive rest arrangement, shift re-allocation, or counseling session..."
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Execution Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedIntervention && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setSelectedIntervention(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-semibold">
                  {selectedIntervention.type}
                </span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {selectedIntervention.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIntervention(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <p>
                <strong className="text-slate-900 dark:text-white">Description:</strong> {selectedIntervention.description}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">Personnel ID:</strong>{" "}
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{selectedIntervention.personnelId}</span>
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">Case ID:</strong>{" "}
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{selectedIntervention.caseId}</span>
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">Supervising Officer:</strong> {selectedIntervention.officerName}
              </p>
              {selectedIntervention.notes && (
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                  <strong>Notes:</strong> {selectedIntervention.notes}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Link
                href={`/welfare/cases/${selectedIntervention.caseId}`}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
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
