"use client";

import React from "react";
import Link from "next/link";
import {
  HeartPulse,
  Activity,
  BatteryCharging,
  Briefcase,
  Clock,
  Moon,
  Calendar,
  ShieldCheck,
  ArrowRight,
  HandHelping,
  FileHeart,
} from "lucide-react";
import { useAuth } from "@/components/providers";
import { StatCard } from "@/components/common/stat-card";
import { RiskBadge } from "@/components/common/risk-badge";
import { WellnessTrendChart } from "@/components/charts/wellness-trend-chart";

export default function PersonnelDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Good morning, {user.name || "Personnel"}
            </h2>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-300 dark:border-emerald-800">
              Service ID: P-1024
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your personal wellbeing overview • Bravo Company, 74th Battalion
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/personnel/wellness"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 text-xs font-semibold shadow-md shadow-blue-900/20 transition-all hover:scale-105 active:scale-95"
          >
            <FileHeart className="h-4 w-4" />
            <span>Start Wellness Check-in</span>
          </Link>
          <Link
            href="/personnel/support"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 px-4 py-2 text-xs font-semibold shadow-2xs transition-colors"
          >
            <HandHelping className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span>Request Support</span>
          </Link>
        </div>
      </div>

      {/* 4 Status KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Wellness Status"
          value="Good"
          subtitle="Stable baseline over 14 days"
          change="● Optimal"
          trend="down"
          icon={HeartPulse}
          variant="success"
        />
        <StatCard
          title="Stress Indicator"
          value="Moderate"
          subtitle="Elevated during night rotations"
          change="▲ +4% this week"
          trend="up"
          icon={Activity}
          variant="warning"
        />
        <StatCard
          title="Fatigue Indicator"
          value="Low"
          subtitle="Within manageable boundaries"
          change="▼ -2% improvement"
          trend="down"
          icon={BatteryCharging}
          variant="info"
        />
        <StatCard
          title="Workload Status"
          value="Elevated"
          subtitle="68 duty hours scheduled"
          change="▲ Needs Review"
          trend="up"
          icon={Briefcase}
          variant="urgent"
        />
      </div>

      {/* Main Grid: Trend Line Chart & Workload Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recharts Wellness Trend (7 cols) */}
        <div className="lg:col-span-7">
          <WellnessTrendChart />
        </div>

        {/* Right: Personnel Workload Card & Supporting Metrics (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Current Workload
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Duty distribution & recovery balance
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                  72%
                </span>
                <span className="block text-[10px] font-semibold text-orange-700 dark:text-orange-300 uppercase">
                  Elevated
                </span>
              </div>
            </div>

            {/* Supporting Metrics with Progress Bars */}
            <div className="mt-5 space-y-4">
              {/* Duty Hours */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Weekly Duty Hours</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    68 hrs / 54 hrs target
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full w-[85%]" />
                </div>
              </div>

              {/* Recovery Time */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5 text-slate-400" />
                    <span>Daily Rest / Sleep</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    5.5 hrs / 7.5 hrs optimal
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[65%]" />
                </div>
              </div>

              {/* Deployment Duration */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Deployment Duration</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    142 Days (Forward Post)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[78%]" />
                </div>
              </div>

              {/* Leave Utilization */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    <span>Leave Days Taken</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    12 of 60 Days (20%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[20%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Assigned Officer: Dr. Aarti Sharma</span>
            </span>
            <Link
              href="/personnel/privacy"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage Privacy →
            </Link>
          </div>
        </div>
      </div>

      {/* Welfare Advisory Banner */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shrink-0">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-950 dark:text-blue-200">
              Proactive Welfare Notice
            </h4>
            <p className="text-xs text-blue-800/80 dark:text-blue-300/80 mt-0.5">
              Your duty hours have been elevated over the last 14 days. You are eligible for rotational recovery support.
            </p>
          </div>
        </div>
        <Link
          href="/personnel/support"
          className="shrink-0 text-xs font-bold text-blue-700 dark:text-blue-300 hover:underline flex items-center gap-1"
        >
          <span>Request Workload Review</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
