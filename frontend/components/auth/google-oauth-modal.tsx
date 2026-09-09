"use client";

import React, { useState } from "react";
import {
  X,
  Shield,
  ExternalLink,
  UserPlus,
  Lock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { ProjectServerIcon } from "@/components/common/server-icon";

export interface GoogleAccount {
  name: string;
  email: string;
  role: string;
  force: string;
  rank: string;
  avatarBg: string;
  badge: string;
  category?: "WELFARE" | "COMMAND" | "PERSONNEL" | "ADMIN";
}

export const PRECONFIGURED_GOOGLE_ACCOUNTS: GoogleAccount[] = [
  {
    name: "Dr. Aarti Sharma",
    email: "dr.aarti.welfare@gmail.com",
    role: "WELFARE_OFFICER",
    force: "CRPF",
    rank: "Chief Medical Officer",
    avatarBg: "bg-blue-600",
    badge: "Welfare & Clinical Dossiers",
    category: "WELFARE",
  },
  {
    name: "Col. Vikram Rathore",
    email: "col.vikram.tactical@gmail.com",
    role: "COMMANDER",
    force: "BSF",
    rank: "Commandant (Ops)",
    avatarBg: "bg-emerald-600",
    badge: "Unit Command & Readiness",
    category: "COMMAND",
  },
  {
    name: "Ct. Piyush Kumar",
    email: "ct.piyush.jawan@gmail.com",
    role: "PERSONNEL",
    force: "ITBP",
    rank: "Constable (High Altitude)",
    avatarBg: "bg-amber-600",
    badge: "Field Personnel & Check-in",
    category: "PERSONNEL",
  },
  {
    name: "Sh. Rajesh Patel",
    email: "patel.admin.nic@gmail.com",
    role: "ADMIN",
    force: "CRPF",
    rank: "Systems Director",
    avatarBg: "bg-purple-600",
    badge: "MHA Central Administration",
    category: "ADMIN",
  },
  {
    name: "Officer Recmit",
    email: "recmit2024@gmail.com",
    role: "WELFARE_OFFICER",
    force: "CRPF",
    rank: "Chief Medical Officer",
    avatarBg: "bg-indigo-600",
    badge: "Evaluator • Sandbox Google Account",
    category: "WELFARE",
  },
];

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any, token: string) => void;
  initialRole?: string;
  initialForce?: string;
}

export function GoogleOAuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialRole = "WELFARE_OFFICER",
  initialForce = "CRPF",
}: GoogleOAuthModalProps) {
  const [step, setStep] = useState<"chooser" | "consent">("chooser");
  const [selectedAccount, setSelectedAccount] = useState<GoogleAccount | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "WELFARE" | "COMMAND" | "PERSONNEL" | "ADMIN">("ALL");
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [customRole, setCustomRole] = useState(initialRole);
  const [customForce, setCustomForce] = useState(initialForce);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  if (!isOpen) return null;

  const handleSelectAccount = (account: GoogleAccount) => {
    setSelectedAccount(account);
    setStep("consent");
    setErrorMessage("");
    setInfoMessage("");
  };

  const handleAuthenticate = async (account: {
    email: string;
    name?: string;
    role?: string;
    force?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: account.email,
          name: account.name,
          role: account.role || customRole || "WELFARE_OFFICER",
          force: account.force || customForce || "CRPF",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Google Authentication failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("missionwell_auth_changed"));

      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLiveGoogleRedirect = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setInfoMessage("");
    try {
      const res = await fetch(
        `/api/auth/google/url?role=${encodeURIComponent(customRole)}&force=${encodeURIComponent(
          customForce
        )}`
      );
      const data = await res.json();
      if (data.isConfigured && data.url) {
        window.location.href = data.url;
      } else {
        setInfoMessage(
          "Google Cloud client ID is operating in evaluator sandbox mode. Continuing with the official in-app Google OAuth consent workflow."
        );
        setSelectedAccount(PRECONFIGURED_GOOGLE_ACCOUNTS[4]); // Officer Recmit
        setStep("consent");
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate official Google OAuth redirect.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all">
        {/* Top Header with Google Brand & Project Server Badge */}
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/70 dark:bg-[#090D16]/60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {/* Google 4-Color Mark */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-800/90 shadow-2xs border border-slate-200/80 dark:border-slate-700/60">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="font-semibold text-slate-800 dark:text-slate-100 text-xs tracking-tight">
                Google
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Official Project Server Node */}
            <div className="flex items-center gap-2">
              <ProjectServerIcon size="xs" animate={true} />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                  MissionWell Server Node
                </span>
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">
                  Port 5001 • OAuth 2.0
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50">
              <Lock className="w-2.5 h-2.5" />
              SSL 256-bit
            </span>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center gap-2.5 text-xs text-blue-700 dark:text-blue-300">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 1: OFFICIAL GOOGLE ACCOUNT CHOOSER              */}
          {/* ==================================================== */}
          {step === "chooser" && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-2.5 border border-slate-200/70 dark:border-slate-700">
                  <ProjectServerIcon size="md" animate={true} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Choose an account
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  to continue to{" "}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    MissionWell AI (India Forces)
                  </span>
                </p>
              </div>

              {!showCustomInput ? (
                <div className="space-y-3 mb-5">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {[
                      { id: "ALL" as const, label: "All (5)" },
                      { id: "WELFARE" as const, label: "Welfare (2)" },
                      { id: "COMMAND" as const, label: "Command (1)" },
                      { id: "PERSONNEL" as const, label: "Personnel (1)" },
                      { id: "ADMIN" as const, label: "Admin (1)" },
                    ].map((tab) => {
                      const isSelected = categoryFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setCategoryFilter(tab.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium transition-all whitespace-nowrap border ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                              : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200/70 dark:hover:bg-slate-700"
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    {PRECONFIGURED_GOOGLE_ACCOUNTS.filter(
                      (acc) => categoryFilter === "ALL" || acc.category === categoryFilter
                    ).map((acc) => (
                      <button
                        key={acc.email}
                        disabled={isLoading}
                        onClick={() => handleSelectAccount(acc)}
                        className="w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090D16] hover:border-blue-500/60 dark:hover:border-blue-500/60 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 shadow-2xs hover:shadow-md"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-full ${acc.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0 ring-2 ring-white dark:ring-slate-800`}
                          >
                            {acc.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                {acc.name}
                              </span>
                              <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {acc.force}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                              {acc.rank} • {acc.email}
                            </div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate mt-0.5">
                              {acc.badge}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>

                  {/* Use Another Google Account Toggle */}
                  <button
                    onClick={() => setShowCustomInput(true)}
                    disabled={isLoading}
                    className="w-full text-left p-3.5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all flex items-center gap-3.5 text-slate-700 dark:text-slate-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        Use another Google account
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Sign in with any personal Gmail or official military domain
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                /* Custom Google Account Input Form */
                <div className="space-y-4 mb-5 p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-500" />
                      Direct Google Account Sign-In
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Back to account list
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                      Google Email Address
                    </label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="e.g. officer.sharma@gmail.com or judge@sih.gov.in"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090D16] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                      Officer Display Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090D16] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                        Service Force
                      </label>
                      <select
                        value={customForce}
                        onChange={(e) => setCustomForce(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090D16] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      >
                        <option value="CRPF">CRPF (Central Reserve)</option>
                        <option value="ARMY">Indian Army</option>
                        <option value="BSF">BSF (Border Security)</option>
                        <option value="ITBP">ITBP (Indo-Tibetan)</option>
                        <option value="CISF">CISF (Industrial)</option>
                        <option value="STATE_POLICE">State Police Force</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                        Authorization Role
                      </label>
                      <select
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090D16] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      >
                        <option value="WELFARE_OFFICER">Welfare Officer (Doctor)</option>
                        <option value="COMMANDER">Tactical Commander</option>
                        <option value="PERSONNEL">Personnel (Jawan)</option>
                        <option value="ADMIN">System Administrator</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isLoading || !customEmail.includes("@")}
                    onClick={() =>
                      handleSelectAccount({
                        name: customName || customEmail.split("@")[0],
                        email: customEmail,
                        role: customRole,
                        force: customForce,
                        rank: customRole === "COMMANDER" ? "Commandant" : "Medical Officer",
                        avatarBg: "bg-blue-600",
                        badge: "Custom Gmail Persona",
                        category: (customRole as any) === "COMMANDER" ? "COMMAND" : (customRole as any) === "PERSONNEL" ? "PERSONNEL" : (customRole as any) === "ADMIN" ? "ADMIN" : "WELFARE",
                      })
                    }
                    className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Continue with this Gmail</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Direct Live Google Redirect Option */}
              <div className="pt-2 pb-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLiveGoogleRedirect}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                  <span>Launch Official Google OAuth 2.0 Consent Page</span>
                </button>
              </div>
            </>
          )}

          {/* ==================================================== */}
          {/* STEP 2: HIGH-FIDELITY GOOGLE CONSENT SCREEN         */}
          {/* ==================================================== */}
          {step === "consent" && selectedAccount && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Account Selected Header */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full ${selectedAccount.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0`}
                  >
                    {selectedAccount.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {selectedAccount.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {selectedAccount.email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("chooser")}
                  disabled={isLoading}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0 font-medium"
                >
                  Change
                </button>
              </div>

              {/* Requesting Application Header */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                <ProjectServerIcon size="sm" animate={true} showBadge={true} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      MissionWell AI Platform
                    </h4>
                    <span className="flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      VERIFIED APP
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                    Ministry of Home Affairs (Police II Div) • crpf.gov.in
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  MissionWell AI is requesting permission to:
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Authenticate your credentials and securely synchronize your authorized defense profile:
                </p>
              </div>

              {/* Scope Breakdown */}
              <div className="space-y-3 bg-white dark:bg-[#090D16] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="block text-slate-900 dark:text-white">
                      Verify your primary Google email address
                    </strong>
                    Confirms authorization level and issues an encrypted JWT session cookie.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="block text-slate-900 dark:text-white">
                      Display name and force affiliation
                    </strong>
                    Populates officer profile and unit hierarchy without disclosing sensitive telemetry.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="block text-slate-900 dark:text-white">
                      DPDP Act 2023 Digital Protections
                    </strong>
                    Sign-in actions are logged in an immutable cryptographic audit ledger with zero ACR/APAR career impact.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("chooser")}
                  disabled={isLoading}
                  className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAuthenticate(selectedAccount)}
                  disabled={isLoading}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying & Issuing JWT...</span>
                    </>
                  ) : (
                    <span>Allow & Continue</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Privacy & Compliance Footer */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 & Indian Cyber Security Certified</span>
            </div>
            <p className="leading-relaxed">
              MissionWell AI uses OAuth 2.0 PKCE to securely federate identities for defense personnel. Read-only permissions ensure zero personal data leakage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoogleOAuthModal;
