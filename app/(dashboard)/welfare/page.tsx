"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  AlertTriangle,
  FolderHeart,
  FileCheck,
  HandHelping,
  CalendarClock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  X,
  Sparkles,
} from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { RiskBadge } from "@/components/common/risk-badge";
import { RiskDonutChart } from "@/components/charts/risk-donut-chart";
import { StressTrendChart } from "@/components/charts/stress-trend-chart";
import { UnitWorkloadBarChart } from "@/components/charts/unit-workload-bar-chart";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data/notifications";
import { useToast } from "@/components/providers";

export default function WelfareOfficerDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState(MOCK_NOTIFICATIONS.filter((n) => n.category === "Welfare"));

  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast({
      title: "Alert Dismissed",
      description: "Alert archived from active welfare queue.",
      type: "info",
    });
  };

  const handleAssignOfficer = (id: string) => {
    toast({
      title: "Officer Assigned",
      description: "Dr. Aarti Sharma assigned as primary welfare officer.",
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Operational Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Welfare Intelligence
            </h2>
            <span className="rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2.5 py-0.5 border border-blue-300 dark:border-blue-800">
              Sector HQ Command
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Predictive stress detection, early welfare case tracking, and rotational care coordination.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/welfare/cases"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 text-xs font-semibold shadow-md shadow-blue-900/20 transition-all hover:scale-105 active:scale-95"
          >
            <FolderHeart className="h-4 w-4" />
            <span>Manage All Cases</span>
          </Link>
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 px-4 py-2 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>AI Recommendations</span>
          </Link>
        </div>
      </div>

      {/* 6 KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Total Personnel"
          value="1,248"
          subtitle="Monitored in Sector"
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Attention Req."
          value="150"
          subtitle="12% of total force"
          change="▲ +8"
          trend="up"
          icon={AlertTriangle}
          variant="urgent"
        />
        <StatCard
          title="Active Cases"
          value="24"
          subtitle="Under active care"
          icon={FolderHeart}
          variant="warning"
        />
        <StatCard
          title="Pending Reviews"
          value="9"
          subtitle="Awaiting evaluation"
          change="▼ -3"
          trend="down"
          icon={FileCheck}
          variant="info"
        />
        <StatCard
          title="Interventions"
          value="18"
          subtitle="Active rotations/rest"
          icon={HandHelping}
          variant="success"
        />
        <StatCard
          title="Follow-ups"
          value="12"
          subtitle="Scheduled this week"
          icon={CalendarClock}
          variant="default"
        />
      </div>

      {/* Main Visuals Grid: Donut Chart + Stress Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <RiskDonutChart />
        </div>
        <div className="lg:col-span-7">
          <StressTrendChart />
        </div>
      </div>

      {/* Unit Workload Analytics */}
      <div>
        <UnitWorkloadBarChart />
      </div>

      {/* Welfare Alerts Feed Panel */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Active Welfare Alerts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-priority predictive indicators requiring human officer review
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
            {alerts.length} Pending Actions
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No active alerts pending review. All high indicators have been addressed.
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge level={alert.priority === "Urgent" ? "URGENT REVIEW" : "HIGH"} size="sm" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {alert.title}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                      ID: {alert.personnelId}
                    </span>
                    <span className="text-[11px] text-slate-400">• {alert.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">{alert.description}</p>

                  {/* Contributing Indicators */}
                  {alert.contributingIndicators && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        Contributing Factors:
                      </span>
                      {alert.contributingIndicators.map((ci, i) => (
                        <span
                          key={i}
                          className="rounded bg-slate-200/80 dark:bg-slate-700/60 px-2 py-0.5 text-[10px] text-slate-700 dark:text-slate-300"
                        >
                          {ci}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                    Recommended: {alert.recommendedAction || "Human welfare officer review"}
                  </p>
                </div>

                {/* Action Buttons: Review, Assign, Dismiss */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => {
                      if (alert.personnelId) {
                        router.push(`/analytics/personnel/${alert.personnelId}`);
                      } else if (alert.caseId) {
                        router.push(`/welfare/cases/${alert.caseId}`);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <span>Review Risk Detail</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleAssignOfficer(alert.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Assign</span>
                  </button>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Dismiss alert"
                    aria-label="Dismiss alert"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ethical Governance Advisory */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 p-3.5 text-center text-xs text-slate-500 dark:text-slate-400">
        <ShieldCheck className="h-4 w-4 inline-block mr-1.5 text-blue-500" />
        <span>
          MissionWell AI provides predictive welfare indicators for authorized support personnel. It does not provide medical diagnoses or automated disciplinary decisions.
        </span>
      </div>
    </div>
  );
}
