"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Activity,
  AlertTriangle,
  Brain,
  ShieldCheck,
  Search,
  ChevronRight,
  Filter,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { RiskBadge } from "@/components/common/risk-badge";
import { RiskDonutChart } from "@/components/charts/risk-donut-chart";
import { StressTrendChart } from "@/components/charts/stress-trend-chart";
import { MOCK_PERSONNEL } from "@/lib/mock-data/personnel";
import { MOCK_RISK_ANALYSES } from "@/lib/mock-data/risk";

export default function AnalyticsOverviewPage() {
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("ALL");

  const personnelList = MOCK_PERSONNEL.map((p) => {
    const risk = MOCK_RISK_ANALYSES[p.id] || {
      riskScore: p.workloadScore,
      riskLevel: p.workloadScore > 80 ? "URGENT REVIEW" : p.workloadScore > 65 ? "HIGH" : p.workloadScore > 50 ? "MODERATE" : "LOW",
      modelConfidence: 94.0,
      trend: "Stable",
    };
    return { ...p, risk };
  });

  const filtered = personnelList.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.anonymizedCode.toLowerCase().includes(search.toLowerCase());
    const matchesUnit = selectedUnit === "ALL" || p.unit.toLowerCase().includes(selectedUnit.toLowerCase());
    return matchesSearch && matchesUnit;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Predictive Wellness & Risk Analytics
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Machine-learning powered indicators identifying cumulative stress, fatigue, and duty pressure.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Risk Indicator"
          value="48 / 100"
          subtitle="Stable sector baseline"
          change="▼ -2.1%"
          trend="down"
          icon={Activity}
          variant="default"
        />
        <StatCard
          title="High Attention"
          value="150"
          subtitle="12% of total monitored force"
          change="▲ +4"
          trend="up"
          icon={AlertTriangle}
          variant="urgent"
        />
        <StatCard
          title="Sector Trend"
          value="Improving"
          subtitle="Rotational leave active"
          change="Stable"
          trend="down"
          icon={LineChart}
          variant="success"
        />
        <StatCard
          title="Model Confidence"
          value="93.8%"
          subtitle="Explainable factor weighting"
          change="High Fidelity"
          trend="neutral"
          icon={Brain}
          variant="info"
        />
      </div>

      {/* Visuals Grid: Risk Donut + Stress Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <RiskDonutChart />
        </div>
        <div className="lg:col-span-7">
          <StressTrendChart />
        </div>
      </div>

      {/* Risk Analysis Table by Personnel */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Personnel Risk Profiles & Explainability
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any profile to inspect contributing factors and recommended welfare actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, name, code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
              />
            </div>

            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Personnel ID</th>
                <th className="py-2.5 px-3">Name / Rank</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Deployment (Days)</th>
                <th className="py-2.5 px-3">Weekly Duty</th>
                <th className="py-2.5 px-3">AI Welfare Risk</th>
                <th className="py-2.5 px-3">Model Confidence</th>
                <th className="py-2.5 px-3 text-right">Explainable AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {p.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-slate-400">{p.rank}</span>
                  </td>
                  <td className="py-3 px-3">{p.unit}</td>
                  <td className="py-3 px-3">{p.deploymentDurationDays}d</td>
                  <td className="py-3 px-3">{p.dutyHoursPerWeek} hrs/wk</td>
                  <td className="py-3 px-3">
                    <RiskBadge level={p.risk.riskLevel} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {p.risk.modelConfidence}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/analytics/personnel/${p.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>Inspect Factors</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 p-3.5 text-center text-xs text-slate-500 dark:text-slate-400">
        <ShieldCheck className="h-4 w-4 inline-block mr-1 text-blue-500" />
        <span>
          This is a predictive welfare indicator designed for proactive support planning. It does not represent a medical diagnosis or disciplinary evaluation.
        </span>
      </div>
    </div>
  );
}
