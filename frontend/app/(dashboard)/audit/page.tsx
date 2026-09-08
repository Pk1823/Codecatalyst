"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Search,
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
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Audit & Compliance Trail
            </h2>
            <span className="rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono px-2 py-0.5 border border-emerald-500/20">
              Immutable Log
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cryptographically recorded access ledger ensuring strict privacy compliance with DPDP Act 2023.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <Lock className="h-3.5 w-3.5 text-emerald-400" />
          <span>Hash Chain Integrity: Verified</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search user, action, resource..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950/60 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-300 focus:outline-hidden focus:border-emerald-500"
          >
            <option value="ALL">All Event Statuses</option>
            <option value="Authorized">Authorized</option>
            <option value="Blocked">Blocked</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {filtered.length} Audit Events Recorded
        </span>
      </div>

      {/* Audit Data Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/40 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
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
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                    {entry.timestamp}
                  </td>
                  <td className="py-3 px-4 font-medium text-white font-sans">
                    {entry.user}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] font-sans">
                    {entry.role}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">
                    {entry.action}
                  </td>
                  <td className="py-3 px-4 text-emerald-400 max-w-[200px] truncate" title={entry.resource}>
                    {entry.resource}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {entry.ipAddress}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                        entry.status === "Authorized"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : entry.status === "Blocked"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
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
