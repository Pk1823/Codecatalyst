"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Check,
  BellOff,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { NotificationCategory, WelfareAlertItem } from "@/types/notifications";
import { RiskBadge } from "@/components/common/risk-badge";
import { useAuth, useToast } from "@/components/providers";

export default function AlertCenterPage() {
  const { toast } = useToast();
  const { lang } = useAuth();
  const isHi = lang === "hi";

  // Start with empty alerts - NO fake mock alerts by default
  const [notifications, setNotifications] = useState<WelfareAlertItem[]>([]);
  const [category, setCategory] = useState<NotificationCategory>("All");
  const [isLoading, setIsLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      let customAlerts: WelfareAlertItem[] = [];
      const customStr = localStorage.getItem("missionwell_custom_alerts");
      if (customStr) {
        try {
          customAlerts = JSON.parse(customStr);
        } catch {}
      }

      // Fetch real system early warnings from database
      try {
        const res = await fetch("/api/alerts");
        if (res.ok) {
          const data = await res.json();
          if (data.alerts && Array.isArray(data.alerts)) {
            const apiAlerts: WelfareAlertItem[] = data.alerts.map((a: any) => {
              const rank = a.personnel?.rank || "Personnel";
              const name = a.personnel?.name || a.personnelId;
              const force = a.personnel?.force || "Army";
              const isHigh = a.severity === "CRITICAL" || a.severity === "HIGH";

              return {
                id: a.id,
                category: "Welfare" as NotificationCategory,
                title: isHigh
                  ? `🚨 HIGH RISK: ${rank} ${name} (${force} - ${a.personnelId})`
                  : `Early Warning: ${a.severity}`,
                description:
                  a.reason ||
                  `${rank} ${name} flagged with compounding operational fatigue and stress indicators.`,
                timestamp: a.createdAt
                  ? new Date(a.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "Recent",
                priority: a.severity === "CRITICAL" ? "Urgent" : a.severity === "HIGH" ? "Urgent" : "High",
                isRead: a.status === "RESOLVED",
                personnelId: a.personnelId,
                contributingIndicators: a.triggerCondition ? [a.triggerCondition] : undefined,
              };
            });

            // Merge avoiding duplicates
            const combined = [...customAlerts];
            for (const apiA of apiAlerts) {
              if (!combined.some((c) => c.id === apiA.id)) {
                combined.push(apiA);
              }
            }
            setNotifications(combined);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        // Fallback to custom alerts only
      }

      setNotifications(customAlerts);
    } catch (e) {
      console.error("Failed to parse alerts", e);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();

    // 4-second live polling for immediate real-time incoming high-risk soldier assessments
    const interval = setInterval(() => {
      loadAlerts();
    }, 4000);

    const handleAlertsChanged = () => {
      loadAlerts();
    };

    window.addEventListener("missionwell_alerts_changed", handleAlertsChanged);
    return () => {
      clearInterval(interval);
      window.removeEventListener("missionwell_alerts_changed", handleAlertsChanged);
    };
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);

    try {
      localStorage.setItem("missionwell_custom_alerts", JSON.stringify(updated));
      window.dispatchEvent(new Event("missionwell_alerts_changed"));
    } catch {}

    // Update database status if it's a DB alert
    try {
      await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "RESOLVED" }),
      });
    } catch {}

    toast({
      title: isHi ? "पढ़ा हुआ चिह्नित किया" : "Marked as read",
      type: "info",
    });
  };

  const handleMarkAllAsRead = async () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);

    try {
      localStorage.setItem("missionwell_custom_alerts", JSON.stringify(updated));
      window.dispatchEvent(new Event("missionwell_alerts_changed"));
    } catch {}

    // Mark all in database
    for (const n of notifications) {
      try {
        await fetch("/api/alerts", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: n.id, status: "RESOLVED" }),
        });
      } catch {}
    }

    toast({
      title: isHi ? "सभी अलर्ट पढ़े हुए चिह्नित किए गए" : "All alerts marked as read",
      type: "success",
    });
  };

  const handleClearAllAlerts = () => {
    setNotifications([]);
    try {
      localStorage.removeItem("missionwell_custom_alerts");
      window.dispatchEvent(new Event("missionwell_alerts_changed"));
    } catch {}

    toast({
      title: isHi ? "सभी अलर्ट साफ़ कर दिए गए" : "All alerts cleared",
      description: isHi
        ? "सभी पुराने और टेस्ट अलर्ट हटा दिए गए हैं।"
        : "All stored alerts have been cleared from this device.",
      type: "info",
    });
  };

  const filtered = notifications.filter((n) => {
    if (category === "All") return true;
    return n.category === category;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isHi ? "अलर्ट एवं सूचनाएं" : "Alerts & Notifications"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHi
              ? "केवल वास्तविक वेलनेस असेसमेंट और अर्ली वार्निंग डेटा यहाँ प्रदर्शित होते हैं।"
              : "Live welfare assessment feeds and validated early warning detections."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {notifications.length > 0 && (
            <>
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs transition-colors"
                title={isHi ? "सभी को पढ़ा हुआ मार्क करें" : "Mark All as Read"}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>{isHi ? "सभी पढ़ें" : "Mark All as Read"}</span>
              </button>

              <button
                onClick={handleClearAllAlerts}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-medium text-rose-700 dark:text-rose-300 shadow-xs transition-colors"
                title={isHi ? "सभी अलर्ट साफ़ करें" : "Clear all alerts"}
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                <span>{isHi ? "साफ़ करें" : "Clear All"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 text-xs">
        {(["All", "Welfare", "System", "Assessment", "Intervention"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              category === cat
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 shadow-inner">
              <BellOff className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {isHi ? "कोई सक्रिय अलर्ट नहीं" : "No Active Alerts"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
              {isHi
                ? "यहाँ कोई फ़ेक डेटा नहीं दिखाया जा रहा है। कार्मिकों द्वारा वेलनेस असेसमेंट सबमिट करने पर ही वास्तविक अलर्ट यहाँ दिखाई देंगे।"
                : "No unverified data. Alerts will appear here only when personnel submit wellness assessments or early risk indicators are triggered."}
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isUrgent = item.priority === "Urgent" || item.title.includes("HIGH RISK");
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  item.isRead
                    ? "border-slate-200/80 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40 opacity-75"
                    : isUrgent
                    ? "border-rose-300 dark:border-rose-900/80 bg-rose-50/50 dark:bg-rose-950/20 shadow-sm ring-1 ring-rose-500/30"
                    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/80 shadow-xs ring-1 ring-blue-500/20"
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge
                      level={isUrgent ? "URGENT REVIEW" : item.priority === "High" ? "HIGH" : "MODERATE"}
                      size="sm"
                    />
                    <span className={`text-xs font-bold ${isUrgent ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>
                      {item.title}
                    </span>
                    <span className="text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 font-mono border border-slate-200/60 dark:border-slate-700/60">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">• {item.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{item.description}</p>

                  {item.contributingIndicators && item.contributingIndicators.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.contributingIndicators.map((ci, i) => (
                        <span
                          key={i}
                          className="text-[10px] rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-slate-700 dark:text-slate-300 font-mono border border-slate-200/60 dark:border-slate-700/60"
                        >
                          {ci}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href="/welfare/cases"
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold hover:bg-amber-500/25 transition-colors shadow-xs"
                  >
                    <span>{isHi ? "मामले" : "Cases"}</span>
                  </Link>
                  {item.personnelId && (
                    <Link
                      href={`/analytics/personnel/${item.personnelId}`}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <span>{isHi ? "समीक्षा" : "Review"}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                      title={isHi ? "पढ़ा हुआ मार्क करें" : "Mark as read"}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

