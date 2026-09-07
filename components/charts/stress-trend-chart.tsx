"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const STRESS_DATA_MAP = {
  "7D": [
    { period: "Mon", stress: 58, baseline: 45 },
    { period: "Tue", stress: 62, baseline: 45 },
    { period: "Wed", stress: 65, baseline: 45 },
    { period: "Thu", stress: 69, baseline: 45 },
    { period: "Fri", stress: 64, baseline: 45 },
    { period: "Sat", stress: 60, baseline: 45 },
    { period: "Sun", stress: 57, baseline: 45 },
  ],
  "30D": [
    { period: "Wk 1", stress: 54, baseline: 45 },
    { period: "Wk 2", stress: 61, baseline: 45 },
    { period: "Wk 3", stress: 68, baseline: 45 },
    { period: "Wk 4", stress: 63, baseline: 45 },
  ],
  "90D": [
    { period: "Dec", stress: 52, baseline: 45 },
    { period: "Jan", stress: 66, baseline: 45 },
    { period: "Feb", stress: 61, baseline: 45 },
  ],
  "6M": [
    { period: "Oct", stress: 46, baseline: 45 },
    { period: "Nov", stress: 52, baseline: 45 },
    { period: "Dec", stress: 61, baseline: 45 },
    { period: "Jan", stress: 66, baseline: 45 },
    { period: "Feb", stress: 63, baseline: 45 },
    { period: "Mar", stress: 59, baseline: 45 },
  ],
  "1Y": [
    { period: "Q1", stress: 44, baseline: 45 },
    { period: "Q2", stress: 48, baseline: 45 },
    { period: "Q3", stress: 54, baseline: 45 },
    { period: "Q4", stress: 63, baseline: 45 },
  ],
};

export function StressTrendChart() {
  const [filter, setFilter] = useState<"7D" | "30D" | "90D" | "6M" | "1Y">("30D");
  const data = STRESS_DATA_MAP[filter];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Stress Indicator Trend
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sector-wide operational pressure & baseline variance
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
          {(["7D", "30D", "90D", "6M", "1Y"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                filter === f
                  ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis
              dataKey="period"
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
            <Area
              type="monotone"
              dataKey="stress"
              name="Current Stress Index"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#stressGrad)"
            />
            <Area
              type="monotone"
              dataKey="baseline"
              name="Peacetime Normal Baseline"
              stroke="#10b981"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
