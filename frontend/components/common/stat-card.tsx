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
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    info: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50",
    urgent: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50",
  }[variant];

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <div className={cn("p-2 rounded-lg shrink-0", iconVariants)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </span>
          {change && (
            <span
              className={cn(
                "text-xs font-medium",
                trend === "up"
                  ? "text-rose-600 dark:text-rose-400"
                  : trend === "down"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500"
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
