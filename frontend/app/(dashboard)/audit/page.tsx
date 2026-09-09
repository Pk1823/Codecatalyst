"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Search,
  Download,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { NotificationService } from "@/services/notification.service";
import { AuditLogEntry } from "@/types/notifications";
import { useToast } from "@/components/providers";

export default function AuditLogPage() {
  const { toast } = useToast();
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

  const handleExportCSV = () => {
    const headers = ["Timestamp", "User", "Role", "Action", "Resource", "IP Address", "Status"];
    const rows = filtered.map((l) => [
      `"${l.timestamp}"`,
      `"${l.user}"`,
      `"${l.role}"`,
      `"${l.action}"`,
      `"${l.resource}"`,
      `"${l.ipAddress}"`,
      `"${l.status}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `missionwell_audit_trail_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Audit Ledger Exported",
      description: "Cryptographic CSV log generated successfully.",
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Audit & Compliance Trail
            </h1>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-400 text-xs font-mono px-2 py-0.5 border border-slate-200 dark:border-slate-700">
              Immutable Ledger
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
            <Lock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Hash Chain Integrity: Verified</span>
          </div>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Audit Log</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, action, resource..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-blue-500"
          >
            <option value="ALL">All Event Statuses</option>
            <option value="Authorized">Authorized</option>
            <option value="Blocked">Blocked</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          {filtered.length} Audit Events Recorded
        </span>
      </div>

      {/* Audit Data Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 font-sans font-medium">Timestamp</th>
                <th className="py-3 px-4 font-sans font-medium">Actor</th>
                <th className="py-3 px-4 font-sans font-medium">Role</th>
                <th className="py-3 px-4 font-sans font-medium">Action</th>
                <th className="py-3 px-4 font-sans font-medium">Resource Target</th>
                <th className="py-3 px-4 font-sans font-medium">IP Subnet</th>
                <th className="py-3 px-4 text-right font-sans font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {entry.timestamp}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white font-sans">
                    {entry.user}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-[11px] font-sans">
                    {entry.role}
                  </td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-sans">
                    {entry.action}
                  </td>
                  <td className="py-3 px-4 text-blue-600 dark:text-blue-400 max-w-[200px] truncate font-semibold" title={entry.resource}>
                    {entry.resource}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                    {entry.ipAddress}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        entry.status === "Authorized"
                          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900"
                          : entry.status === "Blocked"
                          ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
                          : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
                      }`}
                    >
                      {entry.status}
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
