"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Shield,
  HeartPulse,
  Activity,
  Sliders,
  Sparkles,
  Languages,
  ChevronUp,
  ChevronDown,
  Layers,
  PhoneCall,
  CheckCircle2,
  Award,
} from "lucide-react";
import { useAuth, ForceType } from "@/components/providers";
import { FORCES_METADATA } from "@/lib/force-metadata";
import { UserRole } from "@/types/auth";

export function AuthorityBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, switchRole, force, setForce, lang, toggleLang } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const currentMeta = FORCES_METADATA[force] || FORCES_METADATA.CRPF;
  const isHi = lang === "hi";

  const handleRoleSelect = (targetRole: UserRole) => {
    switchRole(targetRole);
    if (targetRole === "PERSONNEL") router.push("/personnel");
    else if (targetRole === "WELFARE_OFFICER") router.push("/welfare");
    else if (targetRole === "COMMANDER") router.push("/commander");
    else if (targetRole === "ADMIN") router.push("/admin");
  };

  const handleForceSelect = (targetForce: ForceType) => {
    setForce(targetForce);
  };

  // If already on /presentation, keep it accessible but unobtrusive
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl transition-all duration-300">
      <div className="rounded-2xl border border-slate-700/80 bg-slate-950/95 p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 text-white">
        {/* Main Bar: Compact Mode */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Active Force & Rank Badge */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-blue-700 to-teal-500 shadow-sm border border-amber-400/40">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  {force}
                </span>
                <span className="text-xs font-bold truncate text-slate-100">
                  {user.name}
                </span>
                <span className="hidden md:inline text-[10px] text-slate-400">
                  • {user.rank || role}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate hidden sm:block">
                {isHi ? currentMeta.nameHi : currentMeta.name} — {currentMeta.motto}
              </div>
            </div>
          </div>

          {/* Center: 1-Click Role Quick Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {[
              {
                r: "PERSONNEL" as UserRole,
                label: isHi ? "जवान" : "Jawan",
                icon: HeartPulse,
                color: "text-emerald-400 hover:bg-emerald-950/60",
                activeBg: "bg-emerald-600 text-white shadow-sm",
              },
              {
                r: "WELFARE_OFFICER" as UserRole,
                label: isHi ? "कल्याण अधिकारी" : "Welfare",
                icon: Activity,
                color: "text-blue-400 hover:bg-blue-950/60",
                activeBg: "bg-blue-600 text-white shadow-sm",
              },
              {
                r: "COMMANDER" as UserRole,
                label: isHi ? "कमांडेंट" : "Commander",
                icon: Shield,
                color: "text-purple-400 hover:bg-purple-950/60",
                activeBg: "bg-purple-600 text-white shadow-sm",
              },
              {
                r: "ADMIN" as UserRole,
                label: isHi ? "प्रशासक" : "Admin",
                icon: Sliders,
                color: "text-amber-400 hover:bg-amber-950/60",
                activeBg: "bg-amber-600 text-white shadow-sm",
              },
            ].map((btn) => {
              const BIcon = btn.icon;
              const isSelected = role === btn.r;
              return (
                <button
                  key={btn.r}
                  onClick={() => handleRoleSelect(btn.r)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? btn.activeBg
                      : `bg-slate-900 border border-slate-800 ${btn.color}`
                  }`}
                  title={`Switch to ${btn.label} Persona`}
                >
                  <BIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{btn.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Language Toggle & Expand Drawer */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-xs font-bold text-teal-300 transition-colors"
              title="Toggle English / हिन्दी"
            >
              <Languages className="h-3.5 w-3.5" />
              <span className="font-mono text-[11px]">{isHi ? "EN" : "हिन्दी"}</span>
            </button>

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-850 border border-slate-700 hover:bg-slate-800 text-xs text-slate-300"
              title={expanded ? "Collapse details" : "Expand force branch switcher"}
            >
              <span className="hidden md:inline text-[11px] font-medium">
                {isHi ? "बल शाखा" : "Force Branch"}
              </span>
              {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded Drawer: Full Uniformed Branch Switcher + Operational Context */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-[10px] text-teal-400">
                {isHi ? "सशस्त्र बल एवं पुलिस विंग का चयन करें" : "Select Uniformed Branch Context"}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {isHi ? "डीपीडीपी अधिनियम 2023 अनुपालन" : "DPDP Act 2023 Zero-Trust"}
              </span>
            </div>

            {/* 6 Force Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {(
                [
                  { id: "CRPF", label: "CRPF", full: "Reserve Police", badge: "CoBRA / LWE" },
                  { id: "ARMY", label: "Indian Army", full: "Armed Forces", badge: "High Altitude" },
                  { id: "BSF", label: "BSF", full: "Border Guard", badge: "Border Outpost" },
                  { id: "ITBP", label: "ITBP", full: "Tibetan Border", badge: "Himveer -30°C" },
                  { id: "CISF", label: "CISF", full: "Industrial / Aero", badge: "Vital Assets" },
                  { id: "STATE_POLICE", label: "State Police", full: "Law & Order", badge: "Bandobast / PCR" },
                ] as const
              ).map((f) => {
                const isSelected = force === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleForceSelect(f.id)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? "border-teal-500 bg-teal-950/60 ring-1 ring-teal-500"
                        : "border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{f.label}</span>
                      {isSelected && <CheckCircle2 className="h-3 w-3 text-teal-400" />}
                    </div>
                    <span className="block text-[10px] text-slate-400 leading-tight mt-0.5">{f.full}</span>
                    <span className="inline-block mt-1 text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                      {f.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Helpline Bar & Pitch Deck Link */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 bg-slate-900/80 rounded-xl p-2 border border-slate-800">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-3.5 w-3.5 text-teal-400" />
                <span>
                  <strong>{currentMeta.helplineName}:</strong>{" "}
                  <span className="text-teal-300 font-mono">{currentMeta.helpline}</span> (24x7 Toll-Free)
                </span>
              </div>
              <button
                onClick={() => router.push("/presentation")}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold"
              >
                <Award className="h-3.5 w-3.5" />
                <span>{isHi ? "हैकथॉन प्रस्तुति डेक देखें →" : "View Hackathon Pitch Deck →"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
