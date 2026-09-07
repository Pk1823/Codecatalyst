"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Sliders,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data/notifications";
import { NotificationCategory, WelfareAlertItem } from "@/types/notifications";
import { RiskBadge } from "@/components/common/risk-badge";
import { useToast } from "@/components/providers";

export default function AlertCenterPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<WelfareAlertItem[]>(MOCK_NOTIFICATIONS);
  const [category, setCategory] = useState<NotificationCategory>("All");

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    toast({
      title: "Marked as read",
      type: "info",
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast({
      title: "All alerts marked as read",
      type: "success",
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Alert & Notification Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time feed of stress alerts, voluntary assessment completions, and system events.
          </p>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors self-start sm:self-auto"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-semibold">
        {(["All", "Welfare", "System", "Assessment", "Intervention"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              category === cat
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
              item.isRead
                ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80"
                : "border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 ring-1 ring-blue-500/20"
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <RiskBadge
                  level={item.priority === "Urgent" ? "URGENT REVIEW" : item.priority === "High" ? "HIGH" : "MODERATE"}
                  size="sm"
                />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </span>
                <span className="text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5">
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-400">• {item.timestamp}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">{item.description}</p>

              {item.contributingIndicators && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.contributingIndicators.map((ci, i) => (
                    <span
                      key={i}
                      className="text-[10px] rounded bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 text-slate-700 dark:text-slate-300"
                    >
                      {ci}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {item.personnelId && (
                <Link
                  href={`/analytics/personnel/${item.personnelId}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-600 flex items-center gap-1"
                >
                  <span>Review</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
              {!item.isRead && (
                <button
                  onClick={() => handleMarkAsRead(item.id)}
                  className="p-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Mark as read"
                >
                  ✓
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
