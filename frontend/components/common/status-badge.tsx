import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const norm = status?.toLowerCase() || "";

  let style = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  let dot = "bg-slate-400";

  if (norm.includes("new")) {
    style = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
    dot = "bg-blue-500 animate-pulse";
  } else if (norm.includes("review")) {
    style = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
    dot = "bg-amber-500";
  } else if (norm.includes("intervention") || norm.includes("active")) {
    style = "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800";
    dot = "bg-purple-500";
  } else if (norm.includes("follow-up") || norm.includes("pending")) {
    style = "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800";
    dot = "bg-cyan-500";
  } else if (norm.includes("resolved") || norm.includes("completed")) {
    style = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
    dot = "bg-emerald-500";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-2xs",
        style,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dot)} />
      <span>{status}</span>
    </span>
  );
}
