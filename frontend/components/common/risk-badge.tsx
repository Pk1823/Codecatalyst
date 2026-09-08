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
      style: "bg-emerald-950/40 text-emerald-300 border-emerald-800/60",
      dot: "bg-emerald-400",
    },
    MODERATE: {
      label: "MODERATE",
      icon: AlertCircle,
      style: "bg-amber-950/40 text-amber-300 border-amber-800/60",
      dot: "bg-amber-400",
    },
    HIGH: {
      label: "HIGH",
      icon: AlertTriangle,
      style: "bg-orange-950/40 text-orange-300 border-orange-800/60",
      dot: "bg-orange-400",
    },
    "URGENT REVIEW": {
      label: "URGENT REVIEW",
      icon: AlertOctagon,
      style: "bg-rose-950/40 text-rose-300 border-rose-800/60",
      dot: "bg-rose-400",
    },
  }[norm] || {
    label: norm,
    icon: AlertCircle,
    style: "bg-slate-800/60 text-slate-300 border-slate-700",
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
