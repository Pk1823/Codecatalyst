import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  variant?: "default" | "warning" | "urgent" | "success" | "info";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  trend,
  icon: Icon,
  variant = "default",
  className,
}: StatCardProps) {
  const iconVariants = {
    default: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60",
    info: "bg-sky-50 text-sky-600 border border-sky-200 dark:bg-slate-800 dark:text-sky-400 dark:border-sky-500/20",
    success: "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-slate-800 dark:text-blue-400 dark:border-blue-500/20",
    warning: "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-slate-800 dark:text-amber-400 dark:border-amber-500/20",
    urgent: "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-slate-800 dark:text-rose-400 dark:border-rose-500/20",
  }[variant];

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A]/90 p-4 sm:p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-200 ease-out flex flex-col justify-between cursor-default",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <div className={cn("p-1.5 rounded-lg shrink-0", iconVariants)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-[#F8FAFC]">
            {value}
          </span>
          {change && (
            <span
              className={cn(
                "text-xs font-mono font-medium",
                trend === "up"
                  ? "text-rose-600 dark:text-rose-400"
                  : trend === "down"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400"
              )}
            >
              {change}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
