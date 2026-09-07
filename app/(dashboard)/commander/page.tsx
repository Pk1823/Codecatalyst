"use client";

import React from "react";
import {
  Activity,
  Shield,
  Users,
  Briefcase,
  Calendar,
  FolderHeart,
  TrendingUp,
  AlertCircle,
  Lock,
  Sparkles,
  Award,
} from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { UnitComparisonChart } from "@/components/charts/unit-comparison-chart";
import { DeploymentLeaveTrendChart } from "@/components/charts/deployment-leave-trend-chart";
import { RiskDonutChart } from "@/components/charts/risk-donut-chart";
import { MOCK_EXECUTIVE_INSIGHTS } from "@/lib/mock-data/analytics";

export default function CommanderDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Force Wellness Overview
            </h2>
            <span className="rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2.5 py-0.5 border border-purple-300 dark:border-purple-800">
              Sector Commander Briefing
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Aggregated organizational intelligence for tactical readiness & force resilience.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 border border-slate-200 dark:border-slate-700">
          <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            Privacy Enforced: Individual PII Strictly Masked
          </span>
        </div>
      </div>

      {/* 5 Macro KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          title="Total Personnel"
          value="1,248"
          subtitle="All Companies Active"
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Force Welfare Index"
          value="81.4"
          subtitle="Safe Operational Zone"
          change="▲ +2.4%"
          trend="down"
          icon={Activity}
          variant="success"
        />
        <StatCard
          title="Workload Pressure"
          value="68.2%"
          subtitle="Above Peacetime Roster"
          change="▲ Elevated"
          trend="up"
          icon={Briefcase}
          variant="warning"
        />
        <StatCard
          title="Deployment Strain"
          value="142d"
          subtitle="Average Forward Post"
          change="▲ +18% Q/Q"
          trend="up"
          icon={Calendar}
          variant="urgent"
        />
        <StatCard
          title="Open Welfare Cases"
          value="24"
          subtitle="Under Active Care"
          icon={FolderHeart}
          variant="info"
        />
      </div>

      {/* AI Simulated Executive Insights Panel */}
      <div className="rounded-xl border border-teal-200 dark:border-teal-900/60 bg-gradient-to-r from-teal-50/70 via-blue-50/50 to-slate-50 dark:from-teal-950/30 dark:via-blue-950/20 dark:to-slate-900/40 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              AI Force Insights & Tactical Advisories
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 font-mono">
            Simulated insights based on synthetic demo data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {MOCK_EXECUTIVE_INSIGHTS.map((insight) => (
            <div
              key={insight.id}
              className="p-3 rounded-lg border border-white/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xs space-y-1"
            >
              <span className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400">
                ● {insight.category} Advisory
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {insight.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts: Unit Comparison & Deployment Leave Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <UnitComparisonChart />
        </div>
        <div className="lg:col-span-5">
          <RiskDonutChart />
        </div>
      </div>

      <div>
        <DeploymentLeaveTrendChart />
      </div>
    </div>
  );
}
