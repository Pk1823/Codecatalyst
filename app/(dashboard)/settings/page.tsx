"use client";

import React, { useState } from "react";
import {
  User,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  Lock,
  Save,
  CheckCircle2,
} from "lucide-react";
import { useAuth, useTheme, useToast } from "@/components/providers";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "appearance" | "privacy" | "security">("profile");

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
      description: "Preferences updated in local demo session.",
      type: "success",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Platform Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize notification triggers, appearance themes, and profile credentials.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: "profile", label: "My Profile", icon: User },
          { id: "appearance", label: "Appearance & Theme", icon: Sun },
          { id: "notifications", label: "Notification Channels", icon: Bell },
          { id: "privacy", label: "Privacy & Visibility", icon: ShieldCheck },
          { id: "security", label: "Security & Passcode", icon: Lock },
        ].map((tab) => {
          const TIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <TIcon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        {activeTab === "profile" && (
          <form onSubmit={handleSave} className="space-y-4 max-w-lg text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Designation / Rank
              </label>
              <input
                type="text"
                disabled
                value={user.rank || user.role}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 p-2.5 text-slate-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Active Department / Coy
              </label>
              <input
                type="text"
                disabled
                value={user.department || user.unit || "Sector Directorate"}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 p-2.5 text-slate-500"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-600 transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-4 max-w-lg text-xs">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Display Theme Mode</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Select your interface preference. Dark mode is optimized for nighttime operations and low-illumination field command.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-4 rounded-xl border text-center font-bold flex flex-col items-center gap-2 transition-all ${
                  theme === "light"
                    ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <Sun className="h-6 w-6 text-amber-500" />
                <span>Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-xl border text-center font-bold flex flex-col items-center gap-2 transition-all ${
                  theme === "dark"
                    ? "border-blue-600 bg-blue-950/60 text-blue-300 ring-1 ring-blue-600"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <Moon className="h-6 w-6 text-blue-400" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4 max-w-lg text-xs">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Alert Dispatch Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    Critical Welfare Risk Push Alerts
                  </span>
                  <span className="text-slate-500 text-[11px]">Instant dispatch for Urgent Review cases (&gt;80 score)</span>
                </div>
                <input
                  type="checkbox"
                  checked={highRiskPush}
                  onChange={(e) => setHighRiskPush(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    Daily Operational Summary Email
                  </span>
                  <span className="text-slate-500 text-[11px]">Morning digest delivered to service inbox</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    Sector Weekly Welfare Digest
                  </span>
                  <span className="text-slate-500 text-[11px]">Weekly analytical report compilation</span>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="space-y-3 max-w-lg text-xs">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Privacy & DPDP Directives</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Your session operates under the MissionWell Dignity Protocol. Automated salting ensures zero correlation between operational queries and individual personnel identity.
            </p>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 inline mr-1.5" />
              <span>Differential Privacy Guarantees Active</span>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-3 max-w-lg text-xs">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Security Credentials</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Current authentication session is managed via synthetic multi-role simulation tokens.
            </p>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-300">
              Session Token: SEC-SIM-2025-08-CRPF-ACTIVE
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
