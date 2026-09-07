"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MOCK_UNIT_WORKLOAD } from "@/lib/mock-data/analytics";

export function UnitComparisonChart() {
  const data = MOCK_UNIT_WORKLOAD.map((u) => ({
    unit: u.unit.replace(" Company", ""),
    "Stress Index": Math.round(u.averageStressScore),
    "Leave Util. %": Math.round(u.leaveUtilizationPct),
    "Avg Deploy (Days/2)": Math.round(u.averageDeploymentDays / 2),
  }));

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Unit Welfare & Pressure Comparison
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparative analysis across Sector operational companies
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
          Aggregated Anonymized
        </span>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis
              dataKey="unit"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#475569", opacity: 0.2 }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#475569", opacity: 0.2 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                borderRadius: "0.5rem",
                color: "#f8fafc",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              iconType="circle"
            />
            <Bar dataKey="Stress Index" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Leave Util. %" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Avg Deploy (Days/2)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
