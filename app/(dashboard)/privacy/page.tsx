"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Scale,
  Database,
  History,
  CheckCircle2,
  FileText,
  AlertOctagon,
} from "lucide-react";

export default function PrivacyCenterPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Privacy Score Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Privacy & Governance Center
            </h2>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-300 dark:border-emerald-800">
              Privacy Controls Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Zero-stigmatization security safeguards, cryptographic pseudonymization, and role segregation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 text-white dark:bg-blue-950/60 dark:text-blue-200 border border-slate-700 dark:border-blue-900 px-4 py-2 rounded-xl">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Security Posture</span>
            <span className="text-xs font-black">Level 4: Maximum Ethical Guard</span>
          </div>
        </div>
      </div>

      {/* Role Segregation Visibility Matrix */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Role Segregation & Data Visibility Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guaranteed architectural separation preventing operational commanders from accessing confidential psychological disclosures.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            DPDP 2023 Protocol
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Data Category</th>
                <th className="py-3 px-3 text-center">Personnel (Individual)</th>
                <th className="py-3 px-3 text-center">Welfare Officer (Medical)</th>
                <th className="py-3 px-3 text-center">Commander (Tactical)</th>
                <th className="py-3 px-3 text-center">System Admin (IT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                  Personal Identity & Service Records
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Own Record
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Authorized Assigned
                </td>
                <td className="py-3 px-3 text-center text-slate-400">
                  — Masked (Unit Level)
                </td>
                <td className="py-3 px-3 text-center text-slate-400">
                  — Anonymized Logs
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                  Voluntary Self-Assessment Answers
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Full History
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Clinical Review Only
                </td>
                <td className="py-3 px-3 text-center text-rose-600 dark:text-rose-400 font-black">
                  ✕ Strictly Prohibited
                </td>
                <td className="py-3 px-3 text-center text-rose-600 dark:text-rose-400 font-black">
                  ✕ Encrypted Inaccessible
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                  Psychological & Counseling Notes
                </td>
                <td className="py-3 px-3 text-center text-slate-400">
                  — Confidential
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Privileged Vault
                </td>
                <td className="py-3 px-3 text-center text-rose-600 dark:text-rose-400 font-black">
                  ✕ Strictly Prohibited
                </td>
                <td className="py-3 px-3 text-center text-rose-600 dark:text-rose-400 font-black">
                  ✕ Encrypted Inaccessible
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                  Aggregated Unit Workload & Stress Indices
                </td>
                <td className="py-3 px-3 text-center text-slate-400">
                  —
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Sector Overview
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Aggregated Only
                </td>
                <td className="py-3 px-3 text-center text-slate-400">
                  — Telemetry Health
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Governance Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
            <Lock className="h-4 w-4" />
            <span>Differential Privacy & Salting</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            All AI training and time-series projections utilize differential mathematical noise injection. No single individual’s identity can be reverse-engineered from force-level stress analytics.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
            <Database className="h-4 w-4" />
            <span>Automated 90-Day Purge Cycles</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Raw voluntary assessment responses are automatically pruned after 90 days, retaining only rolling statistical aggregates to prevent permanent stigmatizing data accumulation.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
            <Scale className="h-4 w-4" />
            <span>Non-Punitive Legal Covenant</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            MissionWell AI software licenses explicitly forbid the use of welfare indicator outputs in annual performance appraisals (APAR), promotion boards, disciplinary trials, or court-martial proceedings.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <History className="h-4 w-4" />
            <span>Cryptographic Access Audits</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Every query into individual profiles generates an immutable, tamper-evident audit record verified by the National Informatics IT Security Cell.
          </p>
        </div>
      </div>
    </div>
  );
}
