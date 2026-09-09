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
  const pageSize = 8;

  // New Case Modal State
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newPersonnelId, setNewPersonnelId] = useState("P-1025");
  const [newSupportType, setNewSupportType] = useState("Workload Adjustment");
  const [newPriority, setNewPriority] = useState("High");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    async function loadData() {
      const data = await WelfareService.getCases();
      setCases(data);
      try {
        const pRoster = await PersonnelService.getAllPersonnel();
        setPersonnelList(pRoster);
        if (pRoster.length > 0 && !newPersonnelId) {
          setNewPersonnelId(pRoster[0].id);
        }
      } catch {}
    }
    loadData();
  }, []);

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
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Active Welfare Cases
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setNewModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
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
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
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
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
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
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
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
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
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
                      className="text-[11px] font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500 cursor-pointer shadow-2xs"
                    >
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Intervention">Intervention</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/welfare/cases/${c.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
                    >
                      <span>Open Detail</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
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
                <FolderHeart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
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
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-mono"
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
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-mono"
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
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
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
                          ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 shadow-2xs"
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
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs transition-colors"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
