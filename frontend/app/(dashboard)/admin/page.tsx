"use client";

import React from "react";
import {
  ShieldAlert,
  Users,
  Server,
  Activity,
  History,
  Lock,
} from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { MOCK_USERS } from "@/lib/mock-data/users";
import { MOCK_AUDIT_LOGS } from "@/lib/mock-data/audit";

export default function AdminDashboardPage() {
  const usersList = Object.values(MOCK_USERS);
  const recentEvents = MOCK_AUDIT_LOGS.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Administration
        </h1>
      </div>

      {/* 5 Admin Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          title="Active Users"
          value="4 Personas"
          subtitle="Evaluation Tier"
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Role Profiles"
          value="4 Tiers"
          subtitle="Zero-Trust Enforced"
          icon={Lock}
          variant="info"
        />
        <StatCard
          title="Monitored Units"
          value="5 Coys"
          subtitle="Alpha through Echo"
          icon={Activity}
          variant="default"
        />
        <StatCard
          title="System Health"
          value="99.98%"
          subtitle="All Clusters Green"
          change="● Optimal"
          trend="down"
          icon={Server}
          variant="success"
        />
        <StatCard
          title="Audit Events"
          value="1,420"
          subtitle="24h Logged Queries"
          icon={History}
          variant="warning"
        />
      </div>

      {/* Grid: Users & Permissions + Security Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Users & Role Table (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Authorized Service Accounts
              </h3>
              <p className="text-xs text-slate-400">
                Configured role-based access tokens
              </p>
            </div>
            <span className="text-xs font-mono text-blue-400">RBAC Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/40 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-mono">
                <tr>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Assigned Role</th>
                  <th className="py-2.5 px-3">Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-medium text-white">
                      {u.name}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-400">{u.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Security & Audit Events (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Recent Security Events
              </h3>
              <p className="text-xs text-slate-400">
                Authentication & access inspection log
              </p>
            </div>
            <ShieldAlert className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {recentEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-lg border border-slate-800 bg-slate-950/40 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">
                    {evt.action}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      evt.status === "Authorized"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  By {evt.user} ({evt.role}) • {evt.resource}
                </p>
                <span className="text-[10px] text-slate-500 font-mono block pt-0.5">
                  {evt.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
