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
  Layers,
} from "lucide-react";
import { useAuth, useTheme, useToast } from "@/components/providers";
import { GoogleAccountDatasetModal } from "@/components/profile/google-account-dataset-modal";

export default function SettingsPage() {
  const { user, role, force, lang } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"profile" | "googleDataset" | "appearance" | "notifications" | "privacy" | "security">("profile");
  const [datasetModalOpen, setDatasetModalOpen] = useState(false);

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
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Platform Settings
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        {[
          { id: "profile", label: "My Profile", icon: User },
          { id: "googleDataset", label: "Google Account & Dataset", icon: Layers },
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

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Profile Changes</span>
              </button>

              <button
                type="button"
                onClick={() => setDatasetModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-300 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold shadow-xs hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>View Google Dataset & CRUD</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === "googleDataset" && (
          <div className="space-y-5 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-blue-500/60 shrink-0">
                  <img
                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{user.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      Google Verified
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{user.email}</p>
                  <p className="text-slate-400 text-[10px] font-mono mt-0.5">Service ID: {user.serviceId} • Role: {role}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDatasetModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Open Interactive Dataset Manager</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Operational Deployments</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Stationings, terrain classification, and consecutive deployment day trackers.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Wellness & Telemetry</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Voluntary assessments, stress scores, sleep telemetry, and AI pacing recommendations.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Authorized CRUD Actions</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Only authorized Welfare Officers and Admins can add or remove clinical and deployment details.
                </p>
              </div>
            </div>
          </div>
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

      {/* Google Account & Comprehensive Person Dataset Modal */}
      <GoogleAccountDatasetModal
        isOpen={datasetModalOpen}
        onClose={() => setDatasetModalOpen(false)}
      />
    </div>
  );
}
