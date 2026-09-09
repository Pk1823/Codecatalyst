"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  History,
} from "lucide-react";
import { useToast } from "@/components/providers";

export default function PersonnelPrivacyPage() {
  const { toast } = useToast();

  const [wellnessDataConsent, setWellnessDataConsent] = useState(true);
  const [optionalDataConsent, setOptionalDataConsent] = useState(true);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean, label: string) => {
    setter(!current);
    toast({
      title: `Consent ${!current ? "Granted" : "Revoked"}`,
      description: `Updated privacy preference for ${label}.`,
      type: "info",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Personal Privacy & Consent Controls
        </h1>
      </div>

      {/* Crisp 2-Point Scope Notice */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300">
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Included:</strong> Duty rosters & voluntary vitals only
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <XCircle className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
          <span>
            <strong className="text-slate-700 dark:text-slate-300 font-semibold">Excluded:</strong> No messages, calls, or private GPS
          </span>
        </div>
      </div>

      {/* Active Consent Preferences */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Consent Preferences
          </h2>
          <span className="rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-semibold px-2 py-0.5 border border-emerald-500/20">
            DPDP 2023 Compliant
          </span>
        </div>

        <div className="space-y-2">
          {/* Toggle 1: Wellness Data */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#090D16]">
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Voluntary Wellness Self-Assessment
              </p>
            </div>
            <button
              onClick={() => handleToggle(setWellnessDataConsent, wellnessDataConsent, "Self-Assessment")}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 ease-in-out shrink-0 ml-4 cursor-pointer active:scale-95 ${
                wellnessDataConsent ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
              }`}
              aria-label="Toggle wellness data consent"
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  wellnessDataConsent ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Optional Biometric */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#090D16]">
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Smart-Band Rest Telemetry (Optional)
              </p>
            </div>
            <button
              onClick={() => handleToggle(setOptionalDataConsent, optionalDataConsent, "Smart-Band Data")}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 ease-in-out shrink-0 ml-4 cursor-pointer active:scale-95 ${
                optionalDataConsent ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
              }`}
              aria-label="Toggle biometric data consent"
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  optionalDataConsent ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Toggle 3: Analytics */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#090D16]">
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Anonymized Unit Readiness Analytics
              </p>
            </div>
            <button
              onClick={() => handleToggle(setAnalyticsConsent, analyticsConsent, "Anonymized Analytics")}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 ease-in-out shrink-0 ml-4 cursor-pointer active:scale-95 ${
                analyticsConsent ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
              }`}
              aria-label="Toggle analytics consent"
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  analyticsConsent ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Compact Consent History Log */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <History className="h-3.5 w-3.5 text-slate-400" />
            <h2 className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300">
              Audit History
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Cryptographically Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                <th className="py-1.5">Timestamp</th>
                <th className="py-1.5">Item</th>
                <th className="py-1.5">State</th>
                <th className="py-1.5">Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 text-[11px]">
              <tr>
                <td className="py-2 font-mono text-[10px] text-slate-500">2025-03-08 10:30</td>
                <td>Self-Assessment Telemetry</td>
                <td>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium font-mono text-[10px]">Granted</span>
                </td>
                <td className="text-slate-500">Self-Service</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-[10px] text-slate-500">2025-02-15 08:45</td>
                <td>Anonymized Readiness Trends</td>
                <td>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium font-mono text-[10px]">Granted</span>
                </td>
                <td className="text-slate-500">Onboarding</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
