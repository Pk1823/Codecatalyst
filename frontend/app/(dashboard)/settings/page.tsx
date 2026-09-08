"use client";

import React, { useState } from "react";
import {
  User,
  Bell,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
  Lock,
  Save,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAuth, useTheme, useToast } from "@/components/providers";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "notifications" | "privacy" | "security">("profile");

  // Local state for settings controls
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [highRiskPush, setHighRiskPush] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings Saved",
      description: "Preferences updated in active session.",
      type: "success",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Platform Settings & Appearance
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize display theme, notification dispatch parameters, and profile credentials.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        {[
          { id: "profile", label: "My Profile", icon: User },
          { id: "appearance", label: "Appearance & Theme", icon: Sun },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "privacy", label: "Privacy Directives", icon: ShieldCheck },
          { id: "security", label: "Security & Access", icon: Lock },
        ].map((tab) => {
          const TIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <TIcon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-xs">
        {activeTab === "profile" && (
          <form onSubmit={handleSave} className="space-y-4 max-w-lg text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Official Service Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Designation / Rank
              </label>
              <input
                type="text"
                disabled
                value={user.rank || user.role}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 p-2.5 text-slate-500 dark:text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Active Battalion / Directorate
              </label>
              <input
                type="text"
                disabled
                value={user.department || user.unit || "CRPF Sector HQ Operations"}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 p-2.5 text-slate-500 dark:text-slate-400 font-mono"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-5 max-w-2xl text-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Display Theme Appearance</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Choose an interface aesthetic engineered for military tactical operations or daylight documentation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Dark Slate Option */}
              <div
                onClick={() => setTheme("dark")}
                className={`cursor-pointer rounded-xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                  theme === "dark"
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-900 text-emerald-400 shadow-xs">
                      <Moon className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">Dark Slate</span>
                  </div>
                  {theme === "dark" && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">✓ Active</span>
                  )}
                </div>

                {/* Visual Preview Thumbnail */}
                <div className="rounded-lg bg-[#090D16] p-2.5 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <div className="h-2 w-12 rounded bg-slate-800"></div>
                  </div>
                  <div className="h-5 rounded bg-slate-900 border border-slate-800"></div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Command center dark theme with cyber defense ambient glows.
                </p>
              </div>

              {/* Clean Light Option */}
              <div
                onClick={() => setTheme("light")}
                className={`cursor-pointer rounded-xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                  theme === "light"
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-amber-500 shadow-xs">
                      <Sun className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">Clean Light</span>
                  </div>
                  {theme === "light" && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">✓ Active</span>
                  )}
                </div>

                {/* Visual Preview Thumbnail */}
                <div className="rounded-lg bg-slate-100 p-2.5 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
                    <div className="h-2 w-12 rounded bg-slate-300"></div>
                  </div>
                  <div className="h-5 rounded bg-white border border-slate-200"></div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Paper-crisp, high-contrast view for daylight operations & briefings.
                </p>
              </div>

              {/* System Option */}
              <div
                onClick={() => setTheme("system")}
                className={`cursor-pointer rounded-xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                  theme === "system"
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs">
                      <Monitor className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">System Auto</span>
                  </div>
                  {theme === "system" && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">✓ Active</span>
                  )}
                </div>

                {/* Visual Preview Thumbnail */}
                <div className="rounded-lg bg-gradient-to-r from-slate-100 to-slate-900 p-2.5 border border-slate-300 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="h-2 w-12 rounded bg-slate-400/50"></div>
                  </div>
                  <div className="h-5 rounded bg-white/40 dark:bg-black/40"></div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Matches your computer or mobile system dark/light schedule.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs flex items-center justify-between">
              <span>Active Rendered Scheme: <strong className="font-mono text-emerald-600 dark:text-emerald-400 uppercase">{resolvedTheme} MODE</strong></span>
              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="px-3 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium hover:border-emerald-500 transition-colors"
              >
                Quick Flip
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4 max-w-lg text-xs">
            <h3 className="font-semibold text-slate-900 dark:text-white">Alert Dispatch Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                <div>
                  <span className="font-medium text-slate-900 dark:text-white block">
                    Critical Welfare Risk Push Alerts
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Instant dispatch for Urgent Review cases (&gt;80 score)</span>
                </div>
                <input
                  type="checkbox"
                  checked={highRiskPush}
                  onChange={(e) => setHighRiskPush(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                <div>
                  <span className="font-medium text-slate-900 dark:text-white block">
                    Daily Operational Summary Email
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Morning digest delivered to service inbox</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                <div>
                  <span className="font-medium text-slate-900 dark:text-white block">
                    Sector Weekly Welfare Digest
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Weekly analytical report compilation</span>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="space-y-3 max-w-lg text-xs">
            <h3 className="font-semibold text-slate-900 dark:text-white">Privacy & DPDP Directives</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Your session operates under the MissionWell Dignity Protocol. Automated salting ensures zero correlation between operational queries and individual personnel identity.
            </p>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 inline mr-1.5" />
              <span>Differential Privacy Guarantees Active</span>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-3 max-w-lg text-xs">
            <h3 className="font-semibold text-slate-900 dark:text-white">Security Credentials</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Current authentication session is managed via synthetic multi-role simulation tokens.
            </p>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
              Session Token: SEC-SIM-2025-08-CRPF-ACTIVE
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
