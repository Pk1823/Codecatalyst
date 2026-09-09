"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  Database,
  Scale,
  History,
  Award,
  CheckCircle2,
} from "lucide-react";

export default function PrivacyCenterPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Security Posture Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Privacy & Governance
            </h1>
            <span className="rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-mono px-2.5 py-0.5 border border-emerald-500/20 font-semibold">
              DPDP 2023 Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm px-4 py-2 rounded-xl">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-left">
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-semibold">
              Security Posture
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Level 4: Maximum Ethical Guard
            </span>
          </div>
        </div>
      </div>

      {/* Official Statutory Authorization Certificate Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold block">
                Statutory Authorization & Compliance Seal
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Government of India • Ministry of Home Affairs Protocol
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>AUTHENTICATED & ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block">Statutory Standard</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">DPDP Act 2023 Section 8(4)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block">Cryptographic Shield</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 block">SHA-256 Pseudonymization</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block">Authorization Token</span>
            <span className="font-bold text-slate-700 dark:text-slate-300 block">MHA-DPDP-2023-AUTH-99824</span>
          </div>
        </div>
      </div>

      {/* Role Segregation Visibility Matrix */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Role Segregation & Data Visibility Matrix
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
            DPDP 2023 Protocol
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-mono">
              <tr>
                <th className="py-3 px-3">Data Category</th>
                <th className="py-3 px-3 text-center">Personnel (Individual)</th>
                <th className="py-3 px-3 text-center">Welfare Officer (Medical)</th>
                <th className="py-3 px-3 text-center">Commander (Tactical)</th>
                <th className="py-3 px-3 text-center">System Admin (IT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                  Personal Identity & Service Records
                </td>
                <td className="py-3.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-mono">
                  ✓ Own Record
                </td>
                <td className="py-3.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-mono">
                  ✓ Authorized Assigned
                </td>
                <td className="py-3.5 px-3 text-center text-slate-400 dark:text-slate-500 font-mono">
                  — Masked (Unit Level)
                </td>
                <td className="py-3.5 px-3 text-center text-slate-400 dark:text-slate-500 font-mono">
                  — Anonymized Logs
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                  Voluntary Self-Assessment Answers
                </td>
                <td className="py-3.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-mono">
                  ✓ Full History
                </td>
                <td className="py-3.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-mono">
                  ✓ Clinical Review Only
                </td>
                <td className="py-3.5 px-3 text-center text-rose-600 dark:text-rose-400 font-mono">
                  ✕ Strictly Prohibited
                </td>
                <td className="py-3.5 px-3 text-center text-rose-600 dark:text-rose-400 font-mono">
                  ✕ Encrypted Inaccessible
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                  Psychological & Counseling Notes
                </td>
                <td className="py-3.5 px-3 text-center text-slate-400 dark:text-slate-500 font-mono">
                  — Confidential
                </td>
                <td className="py-3.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-mono">
                  ✓ Privileged Vault
                </td>
                <td className="py-3.5 px-3 text-center text-rose-600 dark:text-rose-400 font-mono">
                  ✕ Strictly Prohibited
                </td>
                <td className="py-3.5 px-3 text-center text-rose-600 dark:text-rose-400 font-mono">
                  ✕ Encrypted Inaccessible
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                  Aggregated Unit Workload & Stress Indices
                </td>
                <td className="py-3.5 px-3 text-center text-slate-400 dark:text-slate-500 font-mono">
                  —
                </td>
                <td className="py-3.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-mono">
                  ✓ Sector Overview
                </td>
                <td className="py-3.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-mono">
                  ✓ Aggregated Only
                </td>
                <td className="py-3.5 px-3 text-center text-slate-400 dark:text-slate-500 font-mono">
                  — Telemetry Health
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Governance Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Differential Privacy & Salting</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <Database className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Automated 90-Day Purge</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <Scale className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Non-Punitive Covenant</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <History className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Cryptographic Audits</span>
        </div>
      </div>
    </div>
  );
}
