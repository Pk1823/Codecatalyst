"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  AlertTriangle,
  FolderHeart,
  HandHelping,
  ArrowRight,
  UserCheck,
  X,
  FileText,
} from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { RiskBadge } from "@/components/common/risk-badge";
import { RiskDonutChart } from "@/components/charts/risk-donut-chart";
import { StressTrendChart } from "@/components/charts/stress-trend-chart";
import { WelfareAlertItem } from "@/types/notifications";
import { useToast, useAuth } from "@/components/providers";
import { FORCES_METADATA } from "@/lib/force-metadata";

export default function WelfareOfficerDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { force, lang } = useAuth();
  const meta = FORCES_METADATA[force] || FORCES_METADATA.CRPF;
  const isHi = lang === "hi";

  const [alerts, setAlerts] = useState<WelfareAlertItem[]>([]);

  const loadAlerts = () => {
    try {
      const customStr = localStorage.getItem("missionwell_custom_alerts");
      if (customStr) {
        const customAlerts = JSON.parse(customStr);
        setAlerts(customAlerts.filter((a: any) => a.category === "Welfare" || !a.category));
      } else {
        setAlerts([]);
      }
    } catch (e) {
      console.error("Failed to parse custom alerts", e);
      setAlerts([]);
    }
  };

  React.useEffect(() => {
    loadAlerts();

    const handleAlertsChanged = () => {
      loadAlerts();
    };

    window.addEventListener("missionwell_alerts_changed", handleAlertsChanged);
    return () => {
      window.removeEventListener("missionwell_alerts_changed", handleAlertsChanged);
    };
  }, []);

  const handleDismissAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    try {
      const customStr = localStorage.getItem("missionwell_custom_alerts");
      if (customStr) {
        const customAlerts = JSON.parse(customStr);
        const nextCustom = customAlerts.filter((a: any) => a.id !== id);
        localStorage.setItem("missionwell_custom_alerts", JSON.stringify(nextCustom));
        window.dispatchEvent(new Event("missionwell_alerts_changed"));
      }
    } catch {}
    toast({
      title: isHi ? "अलर्ट हटाया गया" : "Alert Dismissed",
      description: isHi ? "अलर्ट सक्रिय कतार से हटा दिया गया।" : "Alert archived from active welfare queue.",
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isHi ? "कल्याण कमान केंद्र" : "Welfare Command Center"}
            </h1>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono px-2 py-0.5 border border-slate-200 dark:border-slate-700">
              {meta.sampleOfficerName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/welfare/cases"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
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

      {/* 4 Clean Minimal KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Personnel"
          value="1,248"
          subtitle="Active in Sector"
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Needs Review"
          value="150"
          subtitle="Elevated stress indicators"
          change="▲ +8"
          trend="up"
          icon={AlertTriangle}
          variant="urgent"
        />
        <StatCard
          title="Active Cases"
          value="24"
          subtitle="Assigned to welfare team"
          icon={FolderHeart}
          variant="warning"
        />
        <StatCard
          title="Rest Rotations"
          value="18"
          subtitle="Current operational relief"
          icon={HandHelping}
          variant="success"
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

      {/* Active Welfare Alerts - Clean & Compact Feed */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Priority Welfare Alerts
            </h2>
          </div>
          <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {alerts.length} Pending
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No active alerts pending review. All indicators are stable.
          </div>
        ) : (
          <div className="space-y-2.5">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 hover:bg-slate-100/80 dark:bg-[#090D16] dark:hover:bg-slate-900/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge level={alert.priority === "Urgent" ? "URGENT REVIEW" : "HIGH"} size="sm" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {alert.title}
                    </span>
                    <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                      {alert.personnelId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{alert.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
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
                    <span>Review</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleAssignOfficer()}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Assign</span>
                  </button>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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
    </div>
  );
}
