"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Check,
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
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Alert & Notification Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time feed of stress alerts, voluntary assessment completions, and system events.
          </p>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs transition-colors self-start sm:self-auto"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 text-xs">
        {(["All", "Welfare", "System", "Assessment", "Intervention"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              category === cat
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60"
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
            className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 ${
              item.isRead
                ? "border-slate-200/80 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40 opacity-75"
                : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/80 shadow-xs ring-1 ring-emerald-500/20"
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <RiskBadge
                  level={item.priority === "Urgent" ? "URGENT REVIEW" : item.priority === "High" ? "HIGH" : "MODERATE"}
                  size="sm"
                />
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </span>
                <span className="text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 font-mono border border-slate-200/60 dark:border-slate-700/60">
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">• {item.timestamp}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">{item.description}</p>

              {item.contributingIndicators && (
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

            <div className="flex items-center gap-2 shrink-0">
              {item.personnelId && (
                <Link
                  href={`/analytics/personnel/${item.personnelId}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 flex items-center gap-1 transition-colors shadow-xs"
                >
                  <span>Review</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
              {!item.isRead && (
                <button
                  onClick={() => handleMarkAsRead(item.id)}
                  className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                  title="Mark as read"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
