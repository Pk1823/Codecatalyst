"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  Database,
  Scale,
  History,
} from "lucide-react";

export default function PrivacyCenterPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Privacy Score Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Privacy & Governance
            </h1>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-emerald-400 text-xs font-mono px-2 py-0.5 border border-slate-200 dark:border-slate-700">
              DPDP 2023 Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero-stigma safeguards, cryptographic pseudonymization, and role segregation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <div className="text-left">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Security Posture</span>
            <span className="text-xs font-semibold text-slate-200">Level 4: Maximum Ethical Guard</span>
          </div>
        </div>
      </div>

      {/* Role Segregation Visibility Matrix */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Role Segregation & Data Visibility Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Guaranteed architectural separation preventing operational commanders from accessing confidential psychological disclosures.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            DPDP 2023 Protocol
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/40 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-mono">
              <tr>
                <th className="py-3 px-3">Data Category</th>
                <th className="py-3 px-3 text-center">Personnel (Individual)</th>
                <th className="py-3 px-3 text-center">Welfare Officer (Medical)</th>
                <th className="py-3 px-3 text-center">Commander (Tactical)</th>
                <th className="py-3 px-3 text-center">System Admin (IT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-3 px-3 font-medium text-white">
                  Personal Identity & Service Records
                </td>
                <td className="py-3 px-3 text-center text-emerald-400 font-mono">
                  ✓ Own Record
                </td>
                <td className="py-3 px-3 text-center text-emerald-400 font-mono">
                  ✓ Authorized Assigned
                </td>
                <td className="py-3 px-3 text-center text-slate-500 font-mono">
                  — Masked (Unit Level)
                </td>
                <td className="py-3 px-3 text-center text-slate-500 font-mono">
                  — Anonymized Logs
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-white">
                  Voluntary Self-Assessment Answers
                </td>
                <td className="py-3 px-3 text-center text-emerald-400 font-mono">
                  ✓ Full History
                </td>
                <td className="py-3 px-3 text-center text-emerald-400 font-mono">
                  ✓ Clinical Review Only
                </td>
                <td className="py-3 px-3 text-center text-rose-400 font-mono">
                  ✕ Strictly Prohibited
                </td>
                <td className="py-3 px-3 text-center text-rose-400 font-mono">
                  ✕ Encrypted Inaccessible
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-white">
                  Psychological & Counseling Notes
                </td>
                <td className="py-3 px-3 text-center text-slate-500 font-mono">
                  — Confidential
                </td>
                <td className="py-3 px-3 text-center text-emerald-400 font-mono">
                  ✓ Privileged Vault
                </td>
                <td className="py-3 px-3 text-center text-rose-400 font-mono">
                  ✕ Strictly Prohibited
                </td>
                <td className="py-3 px-3 text-center text-rose-400 font-mono">
                  ✕ Encrypted Inaccessible
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-white">
                  Aggregated Unit Workload & Stress Indices
                </td>
                <td className="py-3 px-3 text-center text-slate-500 font-mono">
                  —
                </td>
                <td className="py-3 px-3 text-center text-emerald-400 font-mono">
                  ✓ Sector Overview
                </td>
                <td className="py-3 px-3 text-center text-emerald-400 font-mono">
                  ✓ Aggregated Only
                </td>
                <td className="py-3 px-3 text-center text-slate-500 font-mono">
                  — Telemetry Health
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Governance Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Lock className="h-4 w-4" />
            <span>Differential Privacy & Salting</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All AI training and time-series projections utilize differential mathematical noise injection. No single individual’s identity can be reverse-engineered from force-level stress analytics.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
            <Database className="h-4 w-4" />
            <span>Automated 90-Day Purge Cycles</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Raw voluntary assessment responses are automatically pruned after 90 days, retaining only rolling statistical aggregates to prevent permanent stigmatizing data accumulation.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Scale className="h-4 w-4" />
            <span>Non-Punitive Legal Covenant</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            MissionWell AI software licenses explicitly forbid the use of welfare indicator outputs in annual performance appraisals (APAR), promotion boards, disciplinary trials, or court-martial proceedings.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <History className="h-4 w-4" />
            <span>Cryptographic Access Audits</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every query into individual profiles generates an immutable, tamper-evident audit record verified by the National Informatics IT Security Cell.
          </p>
        </div>
      </div>
    </div>
  );
}
