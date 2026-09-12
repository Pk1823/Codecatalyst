"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Plus,
  Send,
  Lock,
  X,
  Stethoscope,
  BellRing,
  Calendar,
  MapPin,
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

  // Doctor Assignment modal state
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [doctorName, setDoctorName] = useState("Dr. Aarti Sharma (CMO)");
  const [visitLevel, setVisitLevel] = useState("Level 2 - Priority (Within 24 Hours)");
  const [visitDate, setVisitDate] = useState("Tomorrow, 10:00 hrs");
  const [visitLocation, setVisitLocation] = useState("Base Medical Inspection Room");
  const [clinicalNotes, setClinicalNotes] = useState("Review self-assessment sleep debt, cognitive fatigue, and conduct vitals check.");
  const [isAssigningDoctor, setIsAssigningDoctor] = useState(false);

  useEffect(() => {
    async function loadCase() {
      setLoading(true);
      const data = await WelfareService.getCaseById(resolvedParams.id);
      setWelfareCase(data);
      if (data) {
        if (data.riskLevel === "LOW") {
          setVisitLevel("Level 3 - Routine Welfare (Within 48-72 Hours)");
        } else if (data.riskLevel === "HIGH") {
          setVisitLevel("Level 1 - Emergency (Immediate / Within 2-4 Hours)");
        } else {
          setVisitLevel("Level 2 - Priority (Within 24 Hours)");
        }
      }
      setLoading(false);
    }
    loadCase();
  }, [resolvedParams.id]);

  if (loading || !welfareCase) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-36 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
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
        title: "Intervention Recorded",
        description: "Support action assigned to case.",
        type: "success",
      });
    }
  };

  const handleAssignDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim()) return;

    setIsAssigningDoctor(true);
    try {
      const updated = await WelfareService.assignDoctorVisit(welfareCase.id, {
        doctorName,
        visitLocation,
        visitLevel,
        scheduledDate: visitDate,
        clinicalPurpose: clinicalNotes,
      });

      await fetch("/api/support-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: welfareCase.id,
          personnelId: welfareCase.personnelId,
          actionType: "Medical Referral",
          doctorName,
          visitLocation,
          visitLevel,
          scheduledDate: visitDate,
          description: clinicalNotes,
        }),
      }).catch(() => {});

      if (updated) {
        setWelfareCase(updated);
        setDoctorModalOpen(false);
        toast({
          title: "🩺 Medical Officer Assigned!",
          description: `Notification dispatched to personnel mobile app: "[${visitLevel.split(" - ")[0]}] Dr. ${doctorName.replace(/^Dr\.?\s*/i, "")} will visit you".`,
          type: "success",
        });
      }
    } catch {
      toast({
        title: "Assignment Error",
        description: "Failed to record doctor assignment.",
        type: "error",
      });
    } finally {
      setIsAssigningDoctor(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href="/welfare/cases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Welfare Cases</span>
        </Link>
      </div>

      {/* Case Header Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-900">
              {welfareCase.id}
            </span>
            <RiskBadge level={welfareCase.riskLevel} size="md" />
            <StatusBadge status={welfareCase.status} />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {welfareCase.primaryConcern}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>
              <strong className="text-slate-700 dark:text-slate-300">Personnel:</strong>{" "}
              <Link
                href={`/analytics/personnel/${welfareCase.personnelId}`}
                className="text-blue-600 dark:text-blue-400 hover:underline font-mono font-bold"
              >
                {welfareCase.personnelId} ({welfareCase.anonymizedCode})
              </Link>
            </span>
            <span>•</span>
            <span><strong className="text-slate-700 dark:text-slate-300">Unit:</strong> {welfareCase.unit}</span>
            <span>•</span>
            <span><strong className="text-slate-700 dark:text-slate-300">Assigned Officer:</strong> {welfareCase.assignedOfficer}</span>
            <span>•</span>
            <span className="font-mono"><strong className="text-slate-700 dark:text-slate-300">Created:</strong> {welfareCase.createdAt}</span>
          </div>
        </div>

        {/* Action Buttons: Assign Doctor & Progression */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => setDoctorModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/30"
          >
            <Stethoscope className="h-4 w-4" />
            <span>Assign Doctor Visit</span>
            <BellRing className="h-3.5 w-3.5 opacity-90 animate-pulse text-amber-200" />
          </button>

          {/* Status Updater Control */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 text-xs space-y-1 shrink-0 min-w-[140px]">
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
              Status Progression
            </span>
            <select
              value={welfareCase.status}
              onChange={(e) => handleStatusChange(e.target.value as WelfareCaseStatus)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-blue-500"
            >
              <option value="New">New</option>
              <option value="Under Review">Under Review</option>
              <option value="Intervention">Intervention</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Resolved">Resolved</option>
            </select>
            <p className="text-[9px] text-slate-400 font-mono">
              Updated: {welfareCase.updatedAt}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Vertical Timeline (7 cols) + Interventions & Notes (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Vertical Timeline (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
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
          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {welfareCase.timeline.map((event) => (
              <div key={event.id} className="relative group">
                {/* Node circle */}
                <div className="absolute -left-6 top-1 h-5 w-5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {event.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="pt-1 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
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
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Welfare Interventions
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Workload rotation & recovery measures
                </p>
              </div>
              <button
                onClick={() => setInterventionModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
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
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        {int.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-mono font-bold">
                        {int.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">{int.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                      <span>Category: {int.type}</span>
                      <span>{int.scheduledDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confidential Case Notes Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Officer Notes (Confidential)
                </h3>
              </div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-semibold">
                Privileged
              </span>
            </div>

            {/* Existing Notes list */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {welfareCase.caseNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1"
                >
                  <p className="text-xs text-slate-700 dark:text-slate-300">{note.text}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
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
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-30 transition-colors shadow-xs"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setInterventionModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Log New Welfare Intervention
              </h3>
              <button
                onClick={() => setInterventionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddIntervention} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Intervention Category
                </label>
                <select
                  value={intType}
                  onChange={(e) => setIntType(e.target.value as InterventionType)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
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
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotational Daylight Duty Swap"
                  value={intTitle}
                  onChange={(e) => setIntTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description & Execution Instructions
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details of rotational roster, stand-down, or psychological session..."
                  value={intDesc}
                  onChange={(e) => setIntDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInterventionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs transition-colors"
                >
                  Save Intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Doctor / Schedule Medical Visit */}
      {doctorModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
          onClick={() => setDoctorModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F172A] border border-emerald-500/30 dark:border-emerald-500/20 p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Assign Medical Officer / Doctor Visit
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Schedules a clinical visit & triggers a mobile app notification to the soldier
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDoctorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
              <BellRing className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong>Automatic Mobile App Notification:</strong> When assigned, <strong>{welfareCase.personnelId}</strong> will immediately receive a notification on their mobile phone stating <em>&quot;Dr. {doctorName} will visit you on {visitDate}&quot;</em>.
              </div>
            </div>

            <form onSubmit={handleAssignDoctor} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Select / Specify Medical Officer (Doctor)
                </label>
                <select
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-semibold"
                >
                  <option value="Dr. Aarti Sharma (Chief Medical Officer)">Dr. Aarti Sharma (Chief Medical Officer)</option>
                  <option value="Dr. V.K. Rao (Senior Medical Officer)">Dr. V.K. Rao (Senior Medical Officer)</option>
                  <option value="Dr. S. Mukherjee (Battalion Physician)">Dr. S. Mukherjee (Battalion Physician)</option>
                  <option value="Dr. Preeti Verma (Clinical Psychologist)">Dr. Preeti Verma (Clinical Psychologist)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Visiting Priority & Triage Level
                </label>
                <select
                  value={visitLevel}
                  onChange={(e) => setVisitLevel(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 text-xs font-semibold focus:outline-hidden ${
                    visitLevel.includes("Level 1")
                      ? "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
                      : visitLevel.includes("Level 2")
                      ? "border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                      : "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                  }`}
                >
                  <option value="Level 1 - Emergency (Immediate / Within 2-4 Hours)">🔴 Level 1 - Emergency / Immediate (Within 2-4 Hours)</option>
                  <option value="Level 2 - Priority (Within 24 Hours)">🟡 Level 2 - Priority / Urgent (Within 24 Hours)</option>
                  <option value="Level 3 - Routine Welfare (Within 48-72 Hours)">🟢 Level 3 - Routine Welfare Consultation (Within 48-72 Hours)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {visitLevel.includes("Level 1")
                    ? "⚠️ Critical intervention: Immediate bedside/outpost visit requested due to acute indicators."
                    : visitLevel.includes("Level 2")
                    ? "⚡ Priority check: Scheduled within standard 24h operational cycle for elevated stress."
                    : "ℹ️ Routine wellness: Scheduled during regular camp medical rounds."}
                </span>
                {welfareCase.riskLevel === "LOW" && (
                  <div className="mt-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-800 dark:text-blue-200 leading-snug">
                    ℹ️ <strong>Optimal Readiness (85% Fit):</strong> This personnel has stable vitals & optimal readiness. <strong>Level 3 (Routine Check)</strong> is pre-selected. Emergency Level 1/2 is not required.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Visit Timing
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tomorrow, 10:00 hrs"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 pl-8 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                    />
                    <Calendar className="h-3.5 w-3.5 absolute left-2.5 top-3 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Visit Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Base Inspection Room"
                      value={visitLocation}
                      onChange={(e) => setVisitLocation(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 pl-8 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                    />
                    <MapPin className="h-3.5 w-3.5 absolute left-2.5 top-3 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Follow-Up Purpose & Assessment Review Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Notes for the doctor visit following assessment review..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDoctorModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigningDoctor}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-900/20 transition-all disabled:opacity-50"
                >
                  <Stethoscope className="h-3.5 w-3.5" />
                  <span>{isAssigningDoctor ? "Assigning & Notifying..." : "Confirm & Dispatch Notification"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
