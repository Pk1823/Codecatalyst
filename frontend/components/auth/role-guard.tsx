"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, ArrowRight, UserCheck } from "lucide-react";
import { useAuth } from "@/components/providers";
import { AuthService } from "@/services/auth.service";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, switchRole } = useAuth();

  const access = AuthService.isRouteAllowed(role, pathname);

  if (!access.allowed) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6 animate-in fade-in duration-200">
        <div className="rounded-xl border border-rose-500/20 bg-[#0F172A] p-8 text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Lock className="h-7 w-7" />
          </div>

          <div>
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-rose-400">
              Access Boundary Enforced • DPDP Act 2023
            </span>
            <h2 className="text-xl font-bold text-[#F8FAFC] mt-1">
              Role Permission Required
            </h2>
            <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto leading-relaxed">
              {access.reason}
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 text-left text-xs space-y-2 text-slate-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Current Persona:</span>
              <span className="font-mono font-bold text-slate-200 uppercase">{role}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Requested Path:</span>
              <span className="font-mono text-slate-300">{pathname}</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              MissionWell adheres to zero-trust privilege segregation. Commanders view aggregated readiness only, while clinical welfare files remain exclusively accessible to authorized Welfare Officers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={AuthService.getRedirectPathForRole(role)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-[#090D16] px-5 py-2.5 text-xs font-semibold transition-all"
            >
              <span>Go to My Authorized Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => switchRole("WELFARE_OFFICER")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <UserCheck className="h-4 w-4 text-blue-400" />
              <span>Switch to Welfare Officer</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
