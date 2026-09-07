"use client";

import React from "react";
import { ShieldCheck, Info, Lock } from "lucide-react";
import { useAuth } from "@/components/providers";
import { FORCES_METADATA } from "@/lib/force-metadata";

export function DemoBanner() {
  const { force, lang } = useAuth();
  const meta = FORCES_METADATA[force] || FORCES_METADATA.CRPF;
  const isHi = lang === "hi";

  return (
    <div className="w-full">
      {/* Subtle National Tricolor Top Ribbon */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* Official Government Header Bar */}
      <aside
        aria-label="Official Government Welfare Prototype Notice"
        className="bg-slate-900 border-b border-slate-800 text-slate-300 px-3 py-1 text-[11px] font-medium flex items-center justify-between z-40 transition-colors"
      >
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-100 flex items-center gap-1.5">
              <span className="text-[#FF9933]">भारत सरकार</span>
              <span className="text-slate-500">|</span>
              <span>Government of India</span>
            </span>
            <span className="hidden md:inline text-slate-400">
              • {isHi ? meta.parentMinistryHi : meta.parentMinistry}
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold text-amber-300 tracking-wider">
              {force} {isHi ? "कल्याण प्रणाली" : "WELFARE WING"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span className="hidden sm:inline text-emerald-400 flex items-center gap-1">
              <Lock className="h-2.5 w-2.5" />
              RESTRICTED // FOR OFFICIAL USE ONLY
            </span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300 font-sans">
              SIH PS 26186
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
