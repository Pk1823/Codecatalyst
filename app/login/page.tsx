"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  HeartPulse,
  Activity,
  Sliders,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useAuth, useToast } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { MOCK_USERS } from "@/lib/mock-data/users";
import { DemoBanner } from "@/components/layout/demo-banner";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("aarti.sharma@welfare.gov.in");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedRole, setSelectedRole] = useState<UserRole>("WELFARE_OFFICER");

  const handleDemoSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "PERSONNEL") setEmail(MOCK_USERS.personnel.email);
    else if (role === "WELFARE_OFFICER") setEmail(MOCK_USERS.welfare.email);
    else if (role === "COMMANDER") setEmail(MOCK_USERS.commander.email);
    else if (role === "ADMIN") setEmail(MOCK_USERS.admin.email);
    setPassword("DemoSecureToken@2025");
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(selectedRole);
    toast({
      title: "Authenticated Successfully",
      description: `Signed in as ${MOCK_USERS[selectedRole === "PERSONNEL" ? "personnel" : selectedRole === "WELFARE_OFFICER" ? "welfare" : selectedRole === "COMMANDER" ? "commander" : "admin"].name}`,
      type: "success",
    });

    if (selectedRole === "PERSONNEL") router.push("/personnel");
    else if (selectedRole === "WELFARE_OFFICER") router.push("/welfare");
    else if (selectedRole === "COMMANDER") router.push("/commander");
    else if (selectedRole === "ADMIN") router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <DemoBanner />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
          {/* Left Column: MissionWell AI Brand & Doctrine (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 shadow-md">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg text-white">MissionWell</span>{" "}
                  <span className="text-teal-400 font-bold">AI</span>
                  <span className="block text-[10px] text-slate-400 font-medium">
                    Welfare Intelligence Portal
                  </span>
                </div>
              </Link>

              <div className="mt-8 space-y-4">
                <span className="inline-block rounded-full bg-teal-500/20 px-2.5 py-1 text-[11px] font-semibold text-teal-300 border border-teal-500/30">
                  SIH Problem Statement 26186
                </span>
                <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
                  Predictive Wellness Monitoring for Safer, Stronger Forces
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Detect early. Support proactively. Protect privacy. Designed for Central Armed Police Forces (CRPF, BSF, ITBP) & Uniformed Services.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-3.5">
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-bold mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Personnel Dignity Safeguard</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    "Personnel wellbeing is mission readiness." Welfare indicators are strictly for supportive care and never used for disciplinary evaluations.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Security Level: RESTRICTED</span>
              <span>v2.4 (Synthetic Prototype)</span>
            </div>
          </div>

          {/* Right Column: Secure Form & Demo Switcher (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-slate-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Access Portal</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sign in with your service credentials or select a simulated persona below.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-blue-900/40 text-blue-400 border border-blue-800/40">
                  <Lock className="h-5 w-5" />
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Official Service Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Security Passcode / Token
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white py-2.5 text-xs font-bold shadow-lg shadow-blue-900/50 transition-all hover:scale-[1.01]"
                >
                  <span>Sign In as {selectedRole.replace("_", " ")}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Demo Persona Switcher Cards */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Simulated Demo Personas
                  </span>
                  <span className="text-[11px] text-teal-400 font-medium">1-Click Auto Fill</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      role: "PERSONNEL" as UserRole,
                      title: "Personnel Demo",
                      name: "Ct. Piyush Kumar",
                      desc: "Self-reporting & confidential care",
                      icon: HeartPulse,
                      color: "text-emerald-400 border-emerald-900/40 bg-emerald-950/20",
                    },
                    {
                      role: "WELFARE_OFFICER" as UserRole,
                      title: "Welfare Officer Demo",
                      name: "Dr. Aarti Sharma",
                      desc: "Case reviews & risk analytics",
                      icon: UserCheck,
                      color: "text-blue-400 border-blue-900/40 bg-blue-950/20",
                    },
                    {
                      role: "COMMANDER" as UserRole,
                      title: "Commander Demo",
                      name: "Col. Rajeshwar Singh",
                      desc: "Aggregated force analytics",
                      icon: Activity,
                      color: "text-purple-400 border-purple-900/40 bg-purple-950/20",
                    },
                    {
                      role: "ADMIN" as UserRole,
                      title: "Admin Demo",
                      name: "Sunil Patel",
                      desc: "System audits & governance",
                      icon: Sliders,
                      color: "text-amber-400 border-amber-900/40 bg-amber-950/20",
                    },
                  ].map((demo) => {
                    const DIcon = demo.icon;
                    const isSelected = selectedRole === demo.role;
                    return (
                      <button
                        key={demo.role}
                        type="button"
                        onClick={() => handleDemoSelect(demo.role)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? "border-blue-500 bg-blue-950/40 ring-1 ring-blue-500"
                            : "border-slate-800 bg-slate-800/40 hover:bg-slate-800/80"
                        }`}
                      >
                        <div className={`p-2 rounded-lg border shrink-0 ${demo.color}`}>
                          <DIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{demo.title}</p>
                          <p className="text-[11px] text-slate-400 truncate">{demo.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate">{demo.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-slate-500" />
                <span>Synthetic Demo Environment • No Real Credentials Required</span>
              </span>
              <Link href="/" className="hover:text-white underline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
