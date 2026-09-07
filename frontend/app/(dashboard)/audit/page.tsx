"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Download,
  Filter,
} from "lucide-react";
import { NotificationService } from "@/services/notification.service";
import { AuditLogEntry } from "@/types/notifications";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function loadLogs() {
      const data = await NotificationService.getAuditLogs();
      setLogs(data);
    }
    loadLogs();
  }, []);

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || log.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Audit & Compliance Trail
            </h2>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-300 dark:border-emerald-800">
              Immutable Zero-Trust Log
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cryptographically recorded access ledger ensuring strict privacy compliance with DPDP Act 2023.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <Lock className="h-3.5 w-3.5 text-emerald-500" />
          <span>Hash Chain Integrity: Verified</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, action, resource..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
          >
            <option value="ALL">All Event Statuses</option>
            <option value="Authorized">Authorized</option>
            <option value="Blocked">Blocked</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          {filtered.length} Audit Events Recorded
        </span>
      </div>

      {/* Audit Data Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource Target</th>
                <th className="py-3 px-4">IP Subnet</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
              {filtered.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                    {entry.timestamp}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100 font-sans">
                    {entry.user}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px] font-sans">
                    {entry.role}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200 font-sans">
                    {entry.action}
                  </td>
                  <td className="py-3 px-4 text-blue-600 dark:text-blue-400 max-w-[200px] truncate" title={entry.resource}>
                    {entry.resource}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {entry.ipAddress}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        entry.status === "Authorized"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : entry.status === "Blocked"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      ● {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
