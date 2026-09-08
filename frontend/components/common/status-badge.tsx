import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const norm = status?.toLowerCase() || "";

  let style = "bg-slate-800/80 text-slate-300 border-slate-700";
  let dot = "bg-slate-400";

  if (norm.includes("new")) {
    style = "bg-sky-950/40 text-sky-300 border-sky-800/60";
    dot = "bg-sky-400 animate-pulse";
  } else if (norm.includes("review")) {
    style = "bg-amber-950/40 text-amber-300 border-amber-800/60";
    dot = "bg-amber-400";
  } else if (norm.includes("intervention") || norm.includes("active")) {
    style = "bg-emerald-950/40 text-emerald-300 border-emerald-800/60";
    dot = "bg-emerald-400";
  } else if (norm.includes("follow-up") || norm.includes("pending")) {
    style = "bg-cyan-950/40 text-cyan-300 border-cyan-800/60";
    dot = "bg-cyan-400";
  } else if (norm.includes("resolved") || norm.includes("completed")) {
    style = "bg-slate-800/90 text-slate-300 border-slate-700";
    dot = "bg-emerald-400";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border shadow-2xs",
        style,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dot)} />
      <span>{status}</span>
    </span>
  );
}
