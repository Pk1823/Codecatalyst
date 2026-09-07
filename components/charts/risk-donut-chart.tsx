"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { MOCK_RISK_DISTRIBUTION } from "@/lib/mock-data/risk";

export function RiskDonutChart() {
  const data = MOCK_RISK_DISTRIBUTION.map((item) => ({
    name: item.level,
    value: item.count,
    color: item.color,
    percentage: item.percentage,
  }));

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Welfare Risk Distribution
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Force-wide multi-factor stress levels
          </p>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
          N = 1,248
        </span>
      </div>

      <div className="relative h-64 w-full flex items-center justify-center pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value, name) => [`${value} Personnel`, `${name}`]}
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                borderRadius: "0.5rem",
                color: "#f8fafc",
                fontSize: "12px",
              }}
            />
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              formatter={(value, entry: any) => (
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {value} ({entry.payload.percentage}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <span className="text-xl font-black text-slate-900 dark:text-slate-100 block leading-tight">
            1,248
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Personnel
          </span>
        </div>
      </div>
    </div>
  );
}
