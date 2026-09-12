"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderHeart,
  Search,
  Plus,
  ChevronRight,
  ShieldCheck,
  X,
  Download,
  CheckCircle2,
  Filter,
  RefreshCw,
  Stethoscope,
  BellRing,
  Calendar,
  MapPin,
} from "lucide-react";
import { WelfareService } from "@/services/welfare.service";
import { PersonnelService } from "@/services/personnel.service";
import { WelfareCase, WelfareCaseStatus } from "@/types/welfare";
import { PersonnelRecord } from "@/types/personnel";
import { RiskBadge } from "@/components/common/risk-badge";
import { StatusBadge } from "@/components/common/status-badge";
import { useToast } from "@/components/providers";

export default function WelfareCasesPage() {
  const { toast } = useToast();
  const [cases, setCases] = useState<WelfareCase[]>([]);
  const [personnelList, setPersonnelList] = useState<PersonnelRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [unitFilter, setUnitFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pageSize = 8;

  // New Case Modal State
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newPersonnelId, setNewPersonnelId] = useState("P-1025");
  const [newSupportType, setNewSupportType] = useState("Workload Adjustment");
  const [newPriority, setNewPriority] = useState("High");
  const [newDesc, setNewDesc] = useState("");

  // Doctor Assignment modal state for list items
  const [selectedCaseForDoctor, setSelectedCaseForDoctor] = useState<WelfareCase | null>(null);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [doctorName, setDoctorName] = useState("Dr. Aarti Sharma (Chief Medical Officer)");
  const [visitLevel, setVisitLevel] = useState("Level 2 - Priority (Within 24 Hours)");
  const [visitTiming, setVisitTiming] = useState("Tomorrow, 10:00 hrs");
  const [visitLocation, setVisitLocation] = useState("Base Medical Inspection Room");
  const [clinicalNotes, setClinicalNotes] = useState("Review self-assessment sleep debt, cognitive fatigue, and conduct vitals check.");
  const [isAssigningDoctor, setIsAssigningDoctor] = useState(false);

  const handleOpenDoctorModal = (c: WelfareCase) => {
    setSelectedCaseForDoctor(c);
    if (c.riskLevel === "HIGH") {
      setVisitLevel("Level 1 - Emergency (Immediate / Within 2-4 Hours)");
      setVisitTiming("Today, within 2-4 hrs");
    } else if (c.riskLevel === "LOW") {
      setVisitLevel("Level 3 - Routine Welfare (Within 48-72 Hours)");
      setVisitTiming("In 2-3 Days, 10:00 hrs");
    } else {
      setVisitLevel("Level 2 - Priority (Within 24 Hours)");
      setVisitTiming("Tomorrow, 10:00 hrs");
    }
    setClinicalNotes(`Review case: ${c.primaryConcern}. Conduct confidential health evaluation.`);
    setDoctorModalOpen(true);
  };

  const handleConfirmDoctorAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseForDoctor || !doctorName.trim()) return;

    setIsAssigningDoctor(true);
    try {
      const pId = selectedCaseForDoctor.personnelId;
      await WelfareService.assignDoctorVisit(selectedCaseForDoctor.id, {
        doctorName,
        visitLocation,
        visitLevel,
        scheduledDate: visitTiming,
        clinicalPurpose: clinicalNotes,
      });

      await fetch("/api/support-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCaseForDoctor.id,
          personnelId: pId,
          actionType: "Medical Referral",
          doctorName,
          visitLocation,
          visitLevel,
          scheduledDate: visitTiming,
          description: clinicalNotes,
        }),
      });

      setDoctorModalOpen(false);
      toast({
        title: "🩺 Medical Officer Assigned!",
        description: `Notification dispatched to ${pId} on Mobile App: "[${visitLevel.split(" - ")[0]}] Dr. ${doctorName.replace(/^Dr\.?\s*/i, "")} will visit you".`,
        type: "success",
      });
      loadData(false);
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

  const loadData = React.useCallback(async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      const data = await WelfareService.getCases();
      setCases(data);
      if (showToast) {
        toast({ title: "Cases Synchronized", description: "Loaded latest defense assessments.", type: "success" });
      }
    } catch {} finally {
      if (showToast) setIsRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
    PersonnelService.getAllPersonnel().then((pRoster) => {
      setPersonnelList(pRoster);
      if (pRoster.length > 0 && !newPersonnelId) {
        setNewPersonnelId(pRoster[0].id);
      }
    }).catch(() => {});

    const interval = setInterval(() => loadData(false), 4000);
    return () => clearInterval(interval);
  }, [loadData, newPersonnelId]);

  const handleCreateCaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) {
      toast({ title: "Please enter case remarks", type: "warning" });
      return;
    }

    try {
      const created = await WelfareService.createSupportRequestCase({
        personnelId: newPersonnelId,
        supportType: newSupportType,
        priority: newPriority,
        description: newDesc,
        preferredContact: "Welfare Officer Desk",
      });

      setCases((prev) => [created, ...prev]);
      setNewModalOpen(false);
      setNewDesc("");
      toast({
        title: "Case Created Successfully",
        description: `Welfare case ${created.id} initiated for ${newPersonnelId}.`,
        type: "success",
      });
    } catch {
      toast({
        title: "Error creating case",
        type: "error",
      });
    }
  };

  const handleQuickStatusChange = async (caseId: string, newStatus: WelfareCaseStatus) => {
    try {
      const updated = await WelfareService.updateCaseStatus(caseId, newStatus);
      if (updated) {
        setCases((prev) => prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c)));
        toast({
          title: "Status Updated",
          description: `Case ${caseId} marked as ${newStatus}.`,
          type: "success",
        });
      }
    } catch {
      toast({ title: "Failed to update case status", type: "error" });
    }
  };

  const handleExportCSV = () => {
    const headers = ["CaseID", "PersonnelID", "AnonymizedCode", "RiskLevel", "PrimaryConcern", "Unit", "AssignedOfficer", "Status", "CreatedAt"];
    const rows = filtered.map((c) => [
      c.id,
      c.personnelId,
      c.anonymizedCode,
      c.riskLevel,
      `"${c.primaryConcern.replace(/"/g, '""')}"`,
      `"${c.unit}"`,
      `"${c.assignedOfficer}"`,
      c.status,
      c.createdAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `missionwell_welfare_cases_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Cases Exported",
      description: `Downloaded ${filtered.length} case records as CSV.`,
      type: "info",
    });
  };

  const filtered = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.personnelId.toLowerCase().includes(search.toLowerCase()) ||
      c.primaryConcern.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesRisk = riskFilter === "ALL" || c.riskLevel.toLowerCase() === riskFilter.toLowerCase();
    const matchesUnit = unitFilter === "ALL" || c.unit.toLowerCase().includes(unitFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesRisk && matchesUnit;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedCases = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Active Welfare Cases
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors"
            title="Fetch latest assessments"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-emerald-500" : "text-slate-500"}`} />
            <span>{isRefreshing ? "Syncing..." : "Sync Live"}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setNewModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Welfare Case</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Case ID, Personnel ID, concern..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Intervention">Intervention</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-blue-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low</option>
            <option value="MODERATE">Moderate</option>
            <option value="HIGH">High</option>
            <option value="URGENT REVIEW">Urgent Review</option>
          </select>

          {/* Unit Filter */}
          <select
            value={unitFilter}
            onChange={(e) => {
              setUnitFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-blue-500"
          >
            <option value="ALL">All Units</option>
            <option value="Alpha">Alpha Company</option>
            <option value="Bravo">Bravo Company</option>
            <option value="Charlie">Charlie Company</option>
            <option value="Delta">Delta Company</option>
            <option value="Echo">Echo Company</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Showing {paginatedCases.length} of {filtered.length} Cases
        </span>
      </div>

      {/* Advanced Data Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-mono">
              <tr>
                <th className="py-3.5 px-4 font-sans font-medium">Case ID</th>
                <th className="py-3.5 px-4 font-sans font-medium">Personnel</th>
                <th className="py-3.5 px-4 font-sans font-medium">Unit</th>
                <th className="py-3.5 px-4 font-sans font-medium">Welfare Risk</th>
                <th className="py-3.5 px-4 font-sans font-medium">Primary Concern</th>
                <th className="py-3.5 px-4 font-sans font-medium">Assigned Officer</th>
                <th className="py-3.5 px-4 font-sans font-medium">Status</th>
                <th className="py-3.5 px-4 text-right font-sans font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {paginatedCases.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    <Link href={`/welfare/cases/${c.id}`} className="hover:underline">
                      {c.id}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {c.personnelId}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {c.anonymizedCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{c.unit}</td>
                  <td className="py-3.5 px-4">
                    <RiskBadge level={c.riskLevel} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 max-w-[220px] truncate text-slate-800 dark:text-slate-200" title={c.primaryConcern}>
                    {c.primaryConcern}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {c.assignedOfficer}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={c.status}
                      onChange={(e) => handleQuickStatusChange(c.id, e.target.value as WelfareCaseStatus)}
                      className="text-[11px] font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-blue-500 cursor-pointer shadow-2xs"
                    >
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Intervention">Intervention</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenDoctorModal(c)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-[11px] font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/30"
                        title="Assign Doctor to this case"
                      >
                        <Stethoscope className="h-3.5 w-3.5" />
                        <span>Assign Dr</span>
                      </button>
                      <Link
                        href={`/welfare/cases/${c.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                      >
                        <span>Review</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-mono">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Create Welfare Case */}
      {newModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setNewModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FolderHeart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Create New Welfare Case
                </h3>
              </div>
              <button
                onClick={() => setNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCaseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Personnel
                </label>
                {personnelList.length > 0 ? (
                  <select
                    value={newPersonnelId}
                    onChange={(e) => setNewPersonnelId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 font-mono"
                  >
                    {personnelList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} — {p.name} ({p.rank}, {p.unit})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={newPersonnelId}
                    onChange={(e) => setNewPersonnelId(e.target.value)}
                    placeholder="e.g. P-1025"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                )}
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Support Category
                </label>
                <select
                  value={newSupportType}
                  onChange={(e) => setNewSupportType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Workload Adjustment">Workload Adjustment</option>
                  <option value="Recovery Support">Recovery Support</option>
                  <option value="Counseling">Counseling</option>
                  <option value="Family Support">Family Support</option>
                  <option value="Medical Referral">Medical Referral</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Urgency Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Low", "Medium", "High"].map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setNewPriority(pr)}
                      className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                        newPriority === pr
                          ? "border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 shadow-2xs"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Clinical / Case Background Remarks
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Observations regarding operational duty hours, sleep rhythm, or self-reported stress..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs transition-colors"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Doctor Visit */}
      {doctorModalOpen && selectedCaseForDoctor && (
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
                    Assign Doctor Visit
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Case: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{selectedCaseForDoctor.id}</strong> • Personnel: <strong className="font-mono">{selectedCaseForDoctor.personnelId}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDoctorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
              <BellRing className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong>Real-Time Mobile App Alert:</strong> When confirmed, <strong>{selectedCaseForDoctor.personnelId}</strong> will receive an immediate in-app notification: <em>&quot;Dr. {doctorName.replace(/^Dr\.?\s*/i, "")} will visit you&quot;</em>.
              </div>
            </div>

            <form onSubmit={handleConfirmDoctorAssign} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Designated Medical Officer / Doctor
                </label>
                <select
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-semibold"
                >
                  <option value="Dr. Aarti Sharma (Chief Medical Officer)">Dr. Aarti Sharma (Chief Medical Officer)</option>
                  <option value="Dr. Rajesh Kumar (Senior Psychiatrist)">Dr. Rajesh Kumar (Senior Psychiatrist)</option>
                  <option value="Dr. Ananya Iyer (Clinical Psychologist)">Dr. Ananya Iyer (Clinical Psychologist)</option>
                  <option value="Dr. Vikram Singh (Medical Officer)">Dr. Vikram Singh (Medical Officer)</option>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Timing
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tomorrow, 10:00 hrs"
                      value={visitTiming}
                      onChange={(e) => setVisitTiming(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 pl-8 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                    />
                    <Calendar className="h-3.5 w-3.5 absolute left-2.5 top-3 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Location
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
                  Clinical Purpose & Follow-Up Notes
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Notes for doctor visit..."
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
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold shadow-md shadow-emerald-900/20 transition-all disabled:opacity-50"
                >
                  <Stethoscope className="h-3.5 w-3.5" />
                  <span>{isAssigningDoctor ? "Dispatching..." : "Assign & Dispatch Notification"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
