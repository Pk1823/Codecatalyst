"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  History,
  Lock,
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
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
          Personal Privacy & Consent Controls
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Full transparency regarding what telemetry data is utilized for welfare monitoring and what is strictly prohibited.
        </p>
      </div>

      {/* Collects vs NOT Collects Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What MissionWell Collects */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>What MissionWell Collects</span>
          </div>
          <p className="text-xs text-slate-300">
            Only authorized operational and self-reported parameters necessary for fatigue and workload forecasting:
          </p>

          <div className="space-y-2 text-xs">
            {[
              { title: "Authorized HR indicators", desc: "Rank, posting history, battalion assignment, and service duration" },
              { title: "Duty patterns & rosters", desc: "Roster hours, continuous night watch duration, and rotation cadence" },
              { title: "Leave patterns", desc: "Accumulated annual leave balance, sanction history, and elapsed days since last leave" },
              { title: "Voluntary wellness data", desc: "Self-assessed energy, sleep quality, and recovery responses provided with your consent" },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#0F172A] border border-slate-800">
                <span className="font-semibold text-slate-200 block">{item.title}</span>
                <span className="text-[11px] text-slate-400">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What MissionWell does NOT Collect */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>What MissionWell Does NOT Collect</span>
          </div>
          <p className="text-xs text-slate-300">
            MissionWell strictly excludes personal surveillance, communication scraping, and private device tracking:
          </p>

          <div className="space-y-2 text-xs">
            {[
              { title: "Private messages & emails", desc: "Zero access to SMS, WhatsApp, personal email, or private messaging apps" },
              { title: "Social media activity", desc: "No scraping or observation of external personal social media profiles" },
              { title: "Microphone & camera audio/video", desc: "No background audio recording, listening, or camera surveillance" },
              { title: "Contacts & personal address book", desc: "Personal device contact lists remain strictly untouched" },
              { title: "Unauthorized real-time GPS tracking", desc: "No off-duty geo-tracking or personal movement profiling" },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#0F172A] border border-slate-800">
                <span className="font-semibold text-slate-200 block">{item.title}</span>
                <span className="text-[11px] text-slate-400">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consent Toggles Card */}
      <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              Active Consent Preferences
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Grant or revoke consent for optional data streams at any time.
            </p>
          </div>
          <span className="rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-mono font-semibold px-2.5 py-1 border border-emerald-500/20">
            DPDP 2023 Compliant
          </span>
        </div>

        <div className="space-y-3">
          {/* Toggle 1: Wellness Data */}
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-[#090D16]">
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Voluntary Self-Assessment Wellness Data
              </p>
              <p className="text-[11px] text-slate-400">
                Allows welfare officers to consider your 7-step self-reported scores for duty pacing.
              </p>
            </div>
            <button
              onClick={() => handleToggle(setWellnessDataConsent, wellnessDataConsent, "Self-Assessment Data")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                wellnessDataConsent ? "bg-emerald-500" : "bg-slate-700"
              }`}
              aria-label="Toggle wellness data consent"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-[#090D16] transition-transform ${
                  wellnessDataConsent ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Optional Wellness Data */}
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-[#090D16]">
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Optional Biometric & Wearable Rest Data (When Authorized)
              </p>
              <p className="text-[11px] text-slate-400">
                Permits authorized battalion smart-band sleep interval feeds where available.
              </p>
            </div>
            <button
              onClick={() => handleToggle(setOptionalDataConsent, optionalDataConsent, "Optional Biometric Data")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                optionalDataConsent ? "bg-emerald-500" : "bg-slate-700"
              }`}
              aria-label="Toggle biometric data consent"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-[#090D16] transition-transform ${
                  optionalDataConsent ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Toggle 3: Analytics Participation */}
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-[#090D16]">
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Anonymized Aggregated Analytics Participation
              </p>
              <p className="text-[11px] text-slate-400">
                Includes your sanitized fatigue trends in anonymized unit-level health comparisons.
              </p>
            </div>
            <button
              onClick={() => handleToggle(setAnalyticsConsent, analyticsConsent, "Analytics Participation")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                analyticsConsent ? "bg-emerald-500" : "bg-slate-700"
              }`}
              aria-label="Toggle analytics consent"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-[#090D16] transition-transform ${
                  analyticsConsent ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Consent History Log */}
      <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-slate-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">
              Consent Audit History
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Cryptographically Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2">Timestamp</th>
                <th className="py-2">Consent Item</th>
                <th className="py-2">State</th>
                <th className="py-2">Authorized Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 font-mono text-[11px] text-slate-400">2025-03-08 10:30</td>
                <td>Voluntary Assessment Responses</td>
                <td>
                  <span className="text-emerald-400 font-semibold font-mono text-[11px]">Granted</span>
                </td>
                <td className="text-slate-400">Personal Portal (Self-Service)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono text-[11px] text-slate-400">2025-02-15 08:45</td>
                <td>Anonymized Aggregate Analytics</td>
                <td>
                  <span className="text-emerald-400 font-semibold font-mono text-[11px]">Granted</span>
                </td>
                <td className="text-slate-400">Initial Portal Onboarding</td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono text-[11px] text-slate-400">2025-01-10 14:12</td>
                <td>Automated Purge of Expired Assessments (&gt;90d)</td>
                <td>
                  <span className="text-slate-400 font-semibold font-mono text-[11px]">System Purge</span>
                </td>
                <td className="text-slate-400">Automated Compliance Guard</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
