"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderHeart,
  Search,
  Filter,
  Plus,
  ChevronRight,
  User,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { WelfareService } from "@/services/welfare.service";
import { WelfareCase, WelfareCaseStatus } from "@/types/welfare";
import { RiskBadge } from "@/components/common/risk-badge";
import { StatusBadge } from "@/components/common/status-badge";
import { useToast } from "@/components/providers";

export default function WelfareCasesPage() {
  const { toast } = useToast();
  const [cases, setCases] = useState<WelfareCase[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [unitFilter, setUnitFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // New Case Modal State
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newPersonnelId, setNewPersonnelId] = useState("P-1025");
  const [newSupportType, setNewSupportType] = useState("Workload Adjustment");
  const [newPriority, setNewPriority] = useState("High");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    async function loadCases() {
      const data = await WelfareService.getCases();
      setCases(data);
    }
    loadCases();
  }, []);

  const handleCreateCaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

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
        title: "Case Created",
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Welfare Cases
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tracking confidential human officer reviews, support interventions, and rehabilitation progress.
          </p>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 text-xs font-semibold shadow-md shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create Welfare Case</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Case ID (CASE-2025-042), Personnel ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
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
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
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
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
          >
            <option value="ALL">All Units</option>
            <option value="Alpha">Alpha Company</option>
            <option value="Bravo">Bravo Company</option>
            <option value="Charlie">Charlie Company</option>
            <option value="Delta">Delta Company</option>
            <option value="Echo">Echo Company</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {paginatedCases.length} of {filtered.length} Cases
        </span>
      </div>

      {/* Advanced Data Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Personnel</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Welfare Risk</th>
                <th className="py-3 px-4">Primary Concern</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
              {paginatedCases.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    <Link href={`/welfare/cases/${c.id}`} className="hover:underline">
                      {c.id}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                      {c.personnelId}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {c.anonymizedCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium">{c.unit}</td>
                  <td className="py-3.5 px-4">
                    <RiskBadge level={c.riskLevel} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 max-w-[220px] truncate" title={c.primaryConcern}>
                    {c.primaryConcern}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {c.assignedOfficer}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/welfare/cases/${c.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
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
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Create Welfare Case */}
      {newModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setNewModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FolderHeart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Create New Welfare Case
                </h3>
              </div>
              <button
                onClick={() => setNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCaseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Personnel ID
                </label>
                <input
                  type="text"
                  required
                  value={newPersonnelId}
                  onChange={(e) => setNewPersonnelId(e.target.value)}
                  placeholder="e.g. P-1025"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Support Category
                </label>
                <select
                  value={newSupportType}
                  onChange={(e) => setNewSupportType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                >
                  <option value="Workload Adjustment">Workload Adjustment</option>
                  <option value="Recovery Support">Recovery Support</option>
                  <option value="Counseling">Counseling</option>
                  <option value="Family Support">Family Support</option>
                  <option value="Medical Referral">Medical Referral</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Urgency Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Low", "Medium", "High"].map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setNewPriority(pr)}
                      className={`p-2 rounded-lg border text-center font-bold ${
                        newPriority === pr
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-600"
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical / Case Background Remarks
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Observations regarding operational duty hours, sleep rhythm, or self-reported stress..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold"
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
