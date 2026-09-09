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
  FileKey,
  ShieldAlert,
} from "lucide-react";

export default function PrivacyCenterPage() {
  return (
    <div className="relative max-w-5xl mx-auto space-y-6 text-slate-100">
      {/* Tactical Command Backdrop Image */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <img
          src="/tactical-command-bg.jpg"
          alt="Tactical Command Operational Backdrop"
          className="w-full h-full object-cover object-center opacity-15 dark:opacity-30 scale-100 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/95" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header & Security Posture Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Privacy & Governance
              </h1>
              <span className="rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono px-2.5 py-0.5 border border-emerald-500/20 font-semibold">
                DPDP 2023 Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Security Posture</span>
              <span className="text-xs font-bold text-slate-100">Level 4: Maximum Ethical Guard</span>
            </div>
          </div>
        </div>

        {/* Official Statutory Authorization Certificate Card */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-emerald-950/20 backdrop-blur-xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  Statutory Authorization & Compliance Seal
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Government of India • Ministry of Home Affairs Protocol
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>AUTHENTICATED & ACTIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block">Statutory Standard</span>
              <span className="font-bold text-emerald-400 block">DPDP Act 2023 Section 8(4)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block">Cryptographic Shield</span>
              <span className="font-bold text-white block">SHA-256 Pseudonymization</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block">Authorization Token</span>
              <span className="font-bold text-slate-300 block">MHA-DPDP-2023-AUTH-99824</span>
            </div>
          </div>
        </div>

        {/* Role Segregation Visibility Matrix */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Role Segregation & Data Visibility Matrix
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              DPDP 2023 Protocol
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-mono">
                <tr>
                  <th className="py-3 px-3">Data Category</th>
                  <th className="py-3 px-3 text-center">Personnel (Individual)</th>
                  <th className="py-3 px-3 text-center">Welfare Officer (Medical)</th>
                  <th className="py-3 px-3 text-center">Commander (Tactical)</th>
                  <th className="py-3 px-3 text-center">System Admin (IT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="py-3.5 px-3 font-medium text-white">
                    Personal Identity & Service Records
                  </td>
                  <td className="py-3.5 px-3 text-center text-emerald-400 font-mono">
                    ✓ Own Record
                  </td>
                  <td className="py-3.5 px-3 text-center text-emerald-400 font-mono">
                    ✓ Authorized Assigned
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-500 font-mono">
                    — Masked (Unit Level)
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-500 font-mono">
                    — Anonymized Logs
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-medium text-white">
                    Voluntary Self-Assessment Answers
                  </td>
                  <td className="py-3.5 px-3 text-center text-emerald-400 font-mono">
                    ✓ Full History
                  </td>
                  <td className="py-3.5 px-3 text-center text-emerald-400 font-mono">
                    ✓ Clinical Review Only
                  </td>
                  <td className="py-3.5 px-3 text-center text-rose-400 font-mono">
                    ✕ Strictly Prohibited
                  </td>
                  <td className="py-3.5 px-3 text-center text-rose-400 font-mono">
                    ✕ Encrypted Inaccessible
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-medium text-white">
                    Psychological & Counseling Notes
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-500 font-mono">
                    — Confidential
                  </td>
                  <td className="py-3.5 px-3 text-center text-emerald-400 font-mono">
                    ✓ Privileged Vault
                  </td>
                  <td className="py-3.5 px-3 text-center text-rose-400 font-mono">
                    ✕ Strictly Prohibited
                  </td>
                  <td className="py-3.5 px-3 text-center text-rose-400 font-mono">
                    ✕ Encrypted Inaccessible
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-medium text-white">
                    Aggregated Unit Workload & Stress Indices
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-500 font-mono">
                    —
                  </td>
                  <td className="py-3.5 px-3 text-center text-emerald-400 font-mono">
                    ✓ Sector Overview
                  </td>
                  <td className="py-3.5 px-3 text-center text-emerald-400 font-mono">
                    ✓ Aggregated Only
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-500 font-mono">
                    — Telemetry Health
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4 Governance Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl space-y-2">
            <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-sm">
              <Lock className="h-4 w-4" />
              <span>Differential Privacy & Salting</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl space-y-2">
            <div className="flex items-center gap-2.5 text-sky-400 font-semibold text-sm">
              <Database className="h-4 w-4" />
              <span>Automated 90-Day Purge Cycles</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl space-y-2">
            <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm">
              <Scale className="h-4 w-4" />
              <span>Non-Punitive Legal Covenant</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl space-y-2">
            <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-sm">
              <History className="h-4 w-4" />
              <span>Cryptographic Access Audits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
