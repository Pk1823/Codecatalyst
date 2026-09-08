"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LineChart,
  Activity,
  AlertTriangle,
  Brain,
  ShieldCheck,
  Search,
  ChevronRight,
  Cpu,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { RiskBadge } from "@/components/common/risk-badge";
import { RiskDonutChart } from "@/components/charts/risk-donut-chart";
import { StressTrendChart } from "@/components/charts/stress-trend-chart";
import { MOCK_PERSONNEL } from "@/lib/mock-data/personnel";
import { MOCK_RISK_ANALYSES } from "@/lib/mock-data/risk";
import { AIEngineClient, ModelTelemetryInfo } from "@/lib/ai-client";

export default function AnalyticsOverviewPage() {
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("ALL");
  const [modelInfo, setModelInfo] = useState<ModelTelemetryInfo | null>(null);
  const [isAiOnline, setIsAiOnline] = useState(true);

  useEffect(() => {
    async function loadModelTelemetry() {
      const health = await AIEngineClient.checkHealth();
      setIsAiOnline(health.online);
      const info = await AIEngineClient.getModelInfo();
      setModelInfo(info);
    }
    loadModelTelemetry();
  }, []);

  const personnelList = MOCK_PERSONNEL.map((p) => {
    const risk = MOCK_RISK_ANALYSES[p.id] || {
      riskScore: p.workloadScore,
      riskLevel: p.workloadScore > 80 ? "URGENT REVIEW" : p.workloadScore > 65 ? "HIGH" : p.workloadScore > 50 ? "MODERATE" : "LOW",
      modelConfidence: 78.4,
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
      {/* Header & Live AI Engine Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
            Predictive Wellness & Risk Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Machine-learning powered indicators identifying cumulative stress, fatigue, and duty pressure.
          </p>
        </div>

        {/* Live Model Badge */}
        <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-300 font-semibold">
            {isAiOnline ? "AI Engine Online" : "AI Engine (Local Fallback)"}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">
            {modelInfo ? `${(modelInfo.accuracy * 100).toFixed(1)}% Acc (Target: 70-85%)` : "78.4% Acc"}
          </span>
        </div>
      </div>

      {/* Model Governance Telemetry Banner */}
      <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                  {modelInfo?.model_name || "LightGBM Defense Personnel Stress Classifier"}
                </span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-emerald-400 border border-slate-700">
                  Unbiased Synthetic Defense Telemetry
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Multi-class classification (Low, Moderate, High) with SHAP exact TreeExplainer attributions and anti-masking heuristic guardrails.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="px-2.5 py-1 rounded bg-[#090D16] border border-slate-800 text-slate-300">
              <span className="text-slate-500">Accuracy: </span>
              <strong className="text-emerald-400">{modelInfo ? `${(modelInfo.accuracy * 100).toFixed(1)}%` : "77.9%"}</strong>
            </div>
            <div className="px-2.5 py-1 rounded bg-[#090D16] border border-slate-800 text-slate-300">
              <span className="text-slate-500">Balanced Acc: </span>
              <strong className="text-emerald-400">{modelInfo ? `${(modelInfo.balanced_accuracy * 100).toFixed(1)}%` : "78.4%"}</strong>
            </div>
            <div className="px-2.5 py-1 rounded bg-[#090D16] border border-slate-800 text-slate-300">
              <span className="text-slate-500">Macro F1: </span>
              <strong className="text-emerald-400">{modelInfo ? `${modelInfo.macro_f1.toFixed(3)}` : "0.773"}</strong>
            </div>
            <div className="px-2.5 py-1 rounded bg-[#090D16] border border-slate-800 text-slate-300 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>SHAP Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
          value={modelInfo ? `${(modelInfo.balanced_accuracy * 100).toFixed(1)}%` : "78.4%"}
          subtitle="Calibrated 70% - 85% range"
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
      <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-[#F8FAFC]">
              Personnel Risk Profiles & Explainability
            </h3>
            <p className="text-xs text-slate-400">
              Select any profile to inspect contributing factors and recommended welfare actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search ID, name, code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-slate-800 bg-[#090D16] pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="rounded-lg border border-slate-800 bg-[#090D16] px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
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
            <thead className="bg-[#090D16] border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-mono">
              <tr>
                <th className="py-2.5 px-3">Personnel ID</th>
                <th className="py-2.5 px-3">Name / Rank</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Deployment</th>
                <th className="py-2.5 px-3">Weekly Duty</th>
                <th className="py-2.5 px-3">AI Welfare Risk</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3 text-right">Explainable AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-medium text-emerald-400">
                    {p.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-white block">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-slate-400">{p.rank}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{p.unit}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{p.deploymentDurationDays}d</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{p.dutyHoursPerWeek}h/wk</td>
                  <td className="py-3 px-3">
                    <RiskBadge level={p.risk.riskLevel} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                    {p.risk.modelConfidence}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/analytics/personnel/${p.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                      <span>Inspect</span>
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
      <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-3 text-center text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4 inline-block mr-1 text-emerald-400" />
        <span>
          Predictive welfare intelligence capability designed for proactive fatigue and burnout mitigation under DPDP Act 2023 regulations. Non-punitive and legally barred from APAR appraisal evaluations.
        </span>
      </div>
    </div>
  );
}
