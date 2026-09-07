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
import { AlertCircle } from "lucide-react";

export function UnitWorkloadBarChart() {
  const data = MOCK_UNIT_WORKLOAD.map((u) => ({
    unit: u.unit.replace(" Company", ""),
    fullName: u.unit,
    Normal: u.normalCount,
    Elevated: u.elevatedCount,
    High: u.highCount,
  }));

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Workload Analytics by Unit
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Operational duty pressure across battalions
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>3 units currently show elevated workload pressure</span>
        </div>
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
            <Bar dataKey="Normal" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Elevated" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
            <Bar dataKey="High" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
