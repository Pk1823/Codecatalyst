"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MOCK_WELLNESS_TRENDS } from "@/lib/mock-data/wellness";

export function WellnessTrendChart() {
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "90D" | "6M">("7D");
  const data = MOCK_WELLNESS_TRENDS[timeframe];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            My Wellness Trend
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Voluntary indicators and self-reported wellness trajectory
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
          {(["7D", "30D", "90D", "6M"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                timeframe === tf
                  ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {tf === "7D" ? "7 Days" : tf === "30D" ? "30 Days" : tf === "90D" ? "90 Days" : "6 Months"}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis
              dataKey="date"
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
              wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="wellness"
              name="Overall Wellness"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#10b981" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="stress"
              name="Stress Level"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 3, fill: "#f59e0b" }}
            />
            <Line
              type="monotone"
              dataKey="fatigue"
              name="Fatigue Level"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 3, fill: "#ef4444" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
