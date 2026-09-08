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
    default: "bg-slate-800 text-slate-300 border border-slate-700/60",
    info: "bg-slate-800 text-sky-400 border border-sky-500/20",
    success: "bg-slate-800 text-emerald-400 border border-emerald-500/20",
    warning: "bg-slate-800 text-amber-400 border border-amber-500/20",
    urgent: "bg-slate-800 text-rose-400 border border-rose-500/20",
  }[variant];

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-800 bg-[#0F172A]/90 p-4 sm:p-5 shadow-xs hover:border-slate-700/80 transition-all duration-200 flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-400">
          {title}
        </p>
        <div className={cn("p-1.5 rounded-lg shrink-0", iconVariants)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#F8FAFC]">
            {value}
          </span>
          {change && (
            <span
              className={cn(
                "text-xs font-mono font-medium",
                trend === "up"
                  ? "text-rose-400"
                  : trend === "down"
                  ? "text-emerald-400"
                  : "text-slate-400"
              )}
            >
              {change}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
