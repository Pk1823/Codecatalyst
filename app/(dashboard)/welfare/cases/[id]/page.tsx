"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderHeart,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  HeartPulse,
  Activity,
  FileText,
  Lock,
} from "lucide-react";
import { WelfareService } from "@/services/welfare.service";
import { WelfareCase, WelfareCaseStatus, InterventionType } from "@/types/welfare";
import { RiskBadge } from "@/components/common/risk-badge";
import { StatusBadge } from "@/components/common/status-badge";
import { useToast } from "@/components/providers";

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [welfareCase, setWelfareCase] = useState<WelfareCase | null>(null);
  const [loading, setLoading] = useState(true);

  // Note form state
  const [newNote, setNewNote] = useState("");
  // Intervention modal state
  const [interventionModalOpen, setInterventionModalOpen] = useState(false);
  const [intType, setIntType] = useState<InterventionType>("Workload Adjustment");
  const [intTitle, setIntTitle] = useState("");
  const [intDesc, setIntDesc] = useState("");

  useEffect(() => {
    async function loadCase() {
      setLoading(true);
      const data = await WelfareService.getCaseById(resolvedParams.id);
      setWelfareCase(data);
      setLoading(false);
    }
    loadCase();
  }, [resolvedParams.id]);

  if (loading || !welfareCase) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  const handleStatusChange = async (newStatus: WelfareCaseStatus) => {
    const updated = await WelfareService.updateCaseStatus(welfareCase.id, newStatus);
    if (updated) {
      setWelfareCase(updated);
      toast({
        title: "Status Updated",
        description: `Case marked as ${newStatus}.`,
        type: "success",
      });
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const updated = await WelfareService.addCaseNote(welfareCase.id, newNote);
    if (updated) {
      setWelfareCase(updated);
      setNewNote("");
      toast({
        title: "Confidential Note Added",
        description: "Logged to case clinical file.",
        type: "success",
      });
    }
  };

  const handleAddIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intTitle.trim() || !intDesc.trim()) return;

    const updated = await WelfareService.addIntervention(welfareCase.id, {
      personnelId: welfareCase.personnelId,
      type: intType,
      title: intTitle,
      description: intDesc,
      status: "Active",
      scheduledDate: new Date().toISOString().split("T")[0],
      officerName: "Dr. Aarti Sharma",
    });

    if (updated) {
      setWelfareCase(updated);
      setInterventionModalOpen(false);
      setIntTitle("");
      setIntDesc("");
      toast({
        title: "Intervention Assigned",
        description: `Logged new intervention: ${intTitle}`,
        type: "success",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Link
          href="/welfare/cases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Welfare Cases</span>
        </Link>
      </div>

      {/* Case Header Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-sm font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-900">
              {welfareCase.id}
            </span>
            <RiskBadge level={welfareCase.riskLevel} size="md" />
            <StatusBadge status={welfareCase.status} />
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {welfareCase.primaryConcern}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>
              <strong>Personnel:</strong>{" "}
              <Link
                href={`/analytics/personnel/${welfareCase.personnelId}`}
                className="text-blue-600 dark:text-blue-400 hover:underline font-mono font-bold"
              >
                {welfareCase.personnelId} ({welfareCase.anonymizedCode})
              </Link>
            </span>
            <span>•</span>
            <span><strong>Unit:</strong> {welfareCase.unit}</span>
            <span>•</span>
            <span><strong>Assigned Officer:</strong> {welfareCase.assignedOfficer}</span>
            <span>•</span>
            <span><strong>Created:</strong> {welfareCase.createdAt}</span>
          </div>
        </div>

        {/* Status Updater Control */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 text-xs space-y-2 shrink-0">
          <span className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[10px]">
            Update Case Progression
          </span>
          <select
            value={welfareCase.status}
            onChange={(e) => handleStatusChange(e.target.value as WelfareCaseStatus)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-hidden"
          >
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Intervention">Intervention</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Resolved">Resolved</option>
          </select>
          <p className="text-[10px] text-slate-400">
            Last Updated: {welfareCase.updatedAt}
          </p>
        </div>
      </div>

      {/* Main Grid: Vertical Timeline (7 cols) + Interventions & Notes (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Vertical Timeline (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Case Activity Timeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chronological sequence from alert generation to resolution
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {welfareCase.timeline.length} Milestones
            </span>
          </div>

          {/* Vertical Timeline Component */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {welfareCase.timeline.map((event) => (
              <div key={event.id} className="relative group">
                {/* Node circle */}
                <div className="absolute -left-6 top-1 h-5 w-5 rounded-full border-2 border-white dark:border-slate-900 bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>

                <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {event.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {event.description}
                  </p>
                  <div className="pt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <User className="h-3 w-3" />
                    <span>{event.actor} ({event.actorRole})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interventions & Case Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Interventions Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Welfare Interventions
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Workload rotation & recovery measures
                </p>
              </div>
              <button
                onClick={() => setInterventionModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>

            {welfareCase.interventions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No active interventions assigned yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {welfareCase.interventions.map((int) => (
                  <div
                    key={int.id}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {int.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                        {int.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">{int.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Category: {int.type}</span>
                      <span>{int.scheduledDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confidential Case Notes Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-teal-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Officer Notes (Confidential)
                </h3>
              </div>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                Doctor-Patient Privileged
              </span>
            </div>

            {/* Existing Notes list */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {welfareCase.caseNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1"
                >
                  <p className="text-xs text-slate-700 dark:text-slate-300">{note.text}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{note.author}</span>
                    <span>{note.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Note Form */}
            <form onSubmit={handleAddNote} className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
              <textarea
                rows={2}
                placeholder="Log confidential observation or check-in note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold disabled:opacity-40 transition-colors"
              >
                <Send className="h-3 w-3" />
                <span>Append Note</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal: Add Intervention */}
      {interventionModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setInterventionModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Log New Welfare Intervention
              </h3>
              <button
                onClick={() => setInterventionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddIntervention} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Intervention Category
                </label>
                <select
                  value={intType}
                  onChange={(e) => setIntType(e.target.value as InterventionType)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                >
                  <option value="Counseling">Counseling</option>
                  <option value="Workload Adjustment">Workload Adjustment</option>
                  <option value="Recovery Support">Recovery Support</option>
                  <option value="Welfare Assistance">Welfare Assistance</option>
                  <option value="Medical Referral">Medical Referral</option>
                  <option value="Family Support">Family Support</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotational Daylight Duty Swap"
                  value={intTitle}
                  onChange={(e) => setIntTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Execution Instructions
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details of rotational roster, stand-down, or psychological session..."
                  value={intDesc}
                  onChange={(e) => setIntDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInterventionModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold"
                >
                  Save Intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
