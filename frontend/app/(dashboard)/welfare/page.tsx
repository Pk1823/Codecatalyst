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
  ArrowRight,
  UserCheck,
  X,
  FileText,
} from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { RiskBadge } from "@/components/common/risk-badge";
import { RiskDonutChart } from "@/components/charts/risk-donut-chart";
import { StressTrendChart } from "@/components/charts/stress-trend-chart";
import { UnitWorkloadBarChart } from "@/components/charts/unit-workload-bar-chart";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data/notifications";
import { useToast, useAuth } from "@/components/providers";
import { FORCES_METADATA } from "@/lib/force-metadata";

export default function WelfareOfficerDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { force, lang } = useAuth();
  const meta = FORCES_METADATA[force] || FORCES_METADATA.CRPF;
  const isHi = lang === "hi";

  const [alerts, setAlerts] = useState(MOCK_NOTIFICATIONS.filter((n) => n.category === "Welfare"));

  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast({
      title: "Alert Dismissed",
      description: "Alert archived from active welfare queue.",
      type: "info",
    });
  };

  const handleAssignOfficer = () => {
    toast({
      title: "Officer Assigned",
      description: `${meta.sampleOfficerName} assigned as primary welfare officer.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Operational Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isHi ? "कल्याण एवं चिकित्सा कमान केंद्र" : "Welfare & Psychological Support Hub"}
            </h2>
            <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium px-2 py-0.5 border border-emerald-500/20">
              {meta.sampleOfficerName}
            </span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono px-2 py-0.5 border border-slate-200 dark:border-slate-700">
              {force} • {meta.sampleBattalion}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHi
              ? "पूर्वानुमानित तनाव पहचान, प्रारंभिक मामला प्रबंधन एवं रोटेशनल विश्राम समन्वय"
              : "Predictive stress detection, early welfare case tracking, and rotational rest coordination"} •{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">{meta.primaryTheatre}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/welfare/cases"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            <FolderHeart className="h-3.5 w-3.5" />
            <span>{isHi ? "सभी मामले देखें" : "Manage All Cases"}</span>
          </Link>
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>{isHi ? "सिफ़ारिशें" : "Recommendations"}</span>
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
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Active Welfare Alerts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-priority predictive indicators requiring human officer review
            </p>
          </div>
          <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            {alerts.length} Pending Actions
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No active alerts pending review. All high indicators have been addressed.
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 hover:bg-slate-100/80 dark:bg-slate-950/40 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge level={alert.priority === "Urgent" ? "URGENT REVIEW" : "HIGH"} size="sm" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {alert.title}
                    </span>
                    <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                      ID: {alert.personnelId}
                    </span>
                    <span className="text-[11px] text-slate-500">• {alert.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">{alert.description}</p>

                  {/* Contributing Indicators */}
                  {alert.contributingIndicators && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                        Contributing Factors:
                      </span>
                      {alert.contributingIndicators.map((ci, i) => (
                        <span
                          key={i}
                          className="rounded bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-700 dark:text-slate-300 font-mono"
                        >
                          {ci}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-xs"
                  >
                    <span>Review Detail</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleAssignOfficer()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors shadow-xs"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Assign</span>
                  </button>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
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
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 p-3 text-center text-xs text-slate-600 dark:text-slate-400">
        <ShieldCheck className="h-4 w-4 inline-block mr-1.5 text-emerald-600 dark:text-emerald-400" />
        <span>
          MissionWell AI provides predictive welfare indicators for authorized support personnel. It does not provide medical diagnoses or automated disciplinary decisions.
        </span>
      </div>
    </div>
  );
}
