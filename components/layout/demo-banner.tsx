"use client";

import React from "react";
import { ShieldCheck, Info } from "lucide-react";

export function DemoBanner() {
  return (
    <aside
      aria-label="Synthetic Demo Environment Notice"
      className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 px-3 py-1.5 text-xs font-medium flex items-center justify-between z-40 transition-colors"
    >
      <div className="flex items-center gap-2 max-w-6xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-800 dark:text-amber-300">
            <Info className="h-3 w-3" />
            SYNTHETIC DEMO DATA
          </span>
          <span className="hidden sm:inline text-slate-600 dark:text-slate-300">
            Prototype for SIH Problem Statement 26186 (CRPF/MHA). All names, records, and identifiers are simulated.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:inline">Privacy Controls Active • Zero PII Leakage Guard</span>
        </div>
      </div>
    </aside>
  );
}
