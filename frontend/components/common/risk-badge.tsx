import React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, AlertOctagon } from "lucide-react";
import { RiskLevel } from "@/types/risk";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

export function RiskBadge({ level, size = "md", className, showIcon = true }: RiskBadgeProps) {
  const norm = level?.toUpperCase() || "LOW";

  const config = {
    LOW: {
      label: "LOW",
      icon: CheckCircle2,
      style: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
      dot: "bg-emerald-500",
    },
    MODERATE: {
      label: "MODERATE",
      icon: AlertCircle,
      style: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
      dot: "bg-amber-500",
    },
    HIGH: {
      label: "HIGH",
      icon: AlertTriangle,
      style: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60",
      dot: "bg-orange-500",
    },
    "URGENT REVIEW": {
      label: "URGENT REVIEW",
      icon: AlertOctagon,
      style: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
      dot: "bg-rose-500",
    },
  }[norm] || {
    label: norm,
    icon: AlertCircle,
    style: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
    dot: "bg-slate-400",
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1 font-mono font-medium",
    md: "px-2.5 py-1 text-xs gap-1.5 font-mono font-semibold",
    lg: "px-3.5 py-1.5 text-xs gap-2 font-mono font-bold",
  }[size];

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border tracking-wider",
        config.style,
        sizeClasses,
        className
      )}
    >
      {showIcon && <Icon className={cn(iconSizes, "shrink-0")} aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
}
