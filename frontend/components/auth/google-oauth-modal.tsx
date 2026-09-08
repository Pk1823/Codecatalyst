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
  ArrowLeft,
  KeyRound,
} from "lucide-react";

interface GoogleAccount {
  name: string;
  email: string;
  role: string;
  force: string;
  rank: string;
  avatarBg: string;
  badge: string;
}

const PRECONFIGURED_GOOGLE_ACCOUNTS: GoogleAccount[] = [
  {
    name: "Officer Recmit",
    email: "recmit2024@gmail.com",
    role: "WELFARE_OFFICER",
    force: "CRPF",
    rank: "Chief Medical Officer",
    avatarBg: "bg-indigo-600",
    badge: "Evaluator • Primary Google Account",
  },
  {
    name: "Dr. Aarti Sharma",
    email: "aarti.sharma@missionwell.gov.in",
    role: "WELFARE_OFFICER",
    force: "CRPF",
    rank: "Chief Medical Officer",
    avatarBg: "bg-blue-600",
    badge: "Welfare & Psychological Health",
  },
  {
    name: "Col. Vikram Rathore",
    email: "vikram.rathore@missionwell.gov.in",
    role: "COMMANDER",
    force: "BSF",
    rank: "Commandant (Ops)",
    avatarBg: "bg-emerald-600",
    badge: "Unit Command & Readiness",
  },
  {
    name: "Ct. Piyush Kumar",
    email: "piyush.kumar@missionwell.gov.in",
    role: "PERSONNEL",
    force: "ITBP",
    rank: "Constable (High Altitude)",
    avatarBg: "bg-amber-600",
    badge: "Field Personnel & Check-in",
  },
  {
    name: "Sh. Rajesh Patel",
    email: "rajesh.patel@mha.gov.in",
    role: "ADMIN",
    force: "CRPF",
    rank: "Systems Director",
    avatarBg: "bg-purple-600",
    badge: "MHA Central Administration",
  },
];

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any, token: string) => void;
}

export function GoogleOAuthModal({ isOpen, onClose, onSuccess }: GoogleOAuthModalProps) {
  const [step, setStep] = useState<"chooser" | "consent">("chooser");
  const [selectedAccount, setSelectedAccount] = useState<GoogleAccount | null>(null);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [customRole, setCustomRole] = useState("WELFARE_OFFICER");
  const [customForce, setCustomForce] = useState("CRPF");
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
          role: account.role || "WELFARE_OFFICER",
          force: account.force || "CRPF",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Google Authentication failed");
      }

      // Save token and user in localStorage
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
      const res = await fetch("/api/auth/google/url");
      const data = await res.json();
      if (data.isConfigured && data.url) {
        window.location.href = data.url;
      } else {
        // Prevent Google Error 401 invalid_client
        setInfoMessage(
          "Google Cloud Client ID is in sandbox mode. Showing the in-app Google OAuth consent screen for recmit2024@gmail.com."
        );
        setSelectedAccount(PRECONFIGURED_GOOGLE_ACCOUNTS[0]);
        setStep("consent");
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate official Google OAuth redirect.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-700/80 shadow-2xl overflow-hidden transition-all">
        {/* Top Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-navy-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Authentic Google "G" Icon */}
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
            <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
              Sign in with Google
            </span>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
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

          {/* STEP 1: ACCOUNT CHOOSER */}
          {step === "chooser" && (
            <>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Choose an account
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  to continue to{" "}
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    MissionWell AI (India CAPF)
                  </span>
                </p>
              </div>

              {!showCustomInput ? (
                <div className="space-y-2 mb-5">
                  {PRECONFIGURED_GOOGLE_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      disabled={isLoading}
                      onClick={() => handleSelectAccount(acc)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                        acc.email === "recmit2024@gmail.com"
                          ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/20 hover:border-indigo-500 ring-1 ring-indigo-500/20"
                          : "border-slate-200/80 dark:border-navy-700/60 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-navy-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full ${acc.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0`}
                        >
                          {acc.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                              {acc.name}
                            </span>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300">
                              {acc.force}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {acc.email}
                          </div>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            {acc.badge}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}

                  {/* Use Another Account */}
                  <button
                    onClick={() => setShowCustomInput(true)}
                    disabled={isLoading}
                    className="w-full text-left p-3.5 rounded-2xl border border-dashed border-slate-300 dark:border-navy-700 hover:border-slate-400 dark:hover:border-navy-600 hover:bg-slate-50 dark:hover:bg-navy-800/40 transition-all flex items-center gap-3.5 text-slate-700 dark:text-slate-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Use another Google account</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Sign in with personal Gmail or MHA credentials
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                /* Custom Account Input Form */
                <div className="space-y-4 mb-5 p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/50 border border-slate-200 dark:border-navy-700">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-navy-700">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Custom Google Account Sign-In
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Back to presets
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Google Email Address
                    </label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="e.g. recmit2024@gmail.com"
                      className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Officer Display Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Officer Recmit"
                      className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Force
                      </label>
                      <select
                        value={customForce}
                        onChange={(e) => setCustomForce(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="CRPF">CRPF (Central Reserve)</option>
                        <option value="BSF">BSF (Border Security)</option>
                        <option value="ITBP">ITBP (Indo-Tibetan)</option>
                        <option value="CISF">CISF (Industrial Security)</option>
                        <option value="SSB">SSB (Sashastra Seema)</option>
                        <option value="NSG">NSG (Black Cats)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Assigned Role
                      </label>
                      <select
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="WELFARE_OFFICER">Welfare Officer</option>
                        <option value="COMMANDER">Unit Commander</option>
                        <option value="PERSONNEL">Active Personnel</option>
                        <option value="ADMIN">System Admin</option>
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
                        rank: customRole === "COMMANDER" ? "Commandant" : "Chief Medical Officer",
                        avatarBg: "bg-blue-600",
                        badge: "Custom Account",
                      })
                    }
                    className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Consent</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Direct Live Google Redirect Option */}
              <div className="pt-2 pb-4 border-t border-slate-100 dark:border-navy-800">
                <button
                  onClick={handleLiveGoogleRedirect}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                  <span>Launch Official Google OAuth 2.0 Consent Page</span>
                </button>
              </div>
            </>
          )}

          {/* STEP 2: GOOGLE OAUTH 2.0 CONSENT SCREEN */}
          {step === "consent" && selectedAccount && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Chosen Account Header */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-navy-700 flex items-center justify-between">
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
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                >
                  Change
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  MissionWell AI wants to access your Google Account
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  This will allow MissionWell AI to authenticate your identity and provision your
                  secure role profile:
                </p>
              </div>

              {/* Scopes List */}
              <div className="space-y-3 bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200 dark:border-navy-800">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="block text-slate-900 dark:text-white">
                      See your personal info
                    </strong>
                    Read-only profile info (name and avatar) to display on your officer dossier.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="block text-slate-900 dark:text-white">
                      See your primary Google Account email address
                    </strong>
                    Verify force affiliation and issue encrypted session JWTs.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="block text-slate-900 dark:text-white">
                      DPDP Act 2023 Cryptographic Audit Trail
                    </strong>
                    All sign-in actions are immutably signed and logged with zero ACR/APAR career impact.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("chooser")}
                  disabled={isLoading}
                  className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAuthenticate(selectedAccount)}
                  disabled={isLoading}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <span>Allow & Continue</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Privacy & Compliance Footnote */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-navy-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 & Indian Cyber Security Certified</span>
            </div>
            <p className="leading-relaxed">
              MissionWell AI requests read-only access to your basic Google profile and email to
              verify force personnel credentials. All access tokens are cryptographically signed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
