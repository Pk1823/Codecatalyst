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
        <h2 className="text-xl font-bold tracking-tight text-white">
          Platform Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize notification triggers, appearance themes, and profile credentials.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        {[
          { id: "profile", label: "My Profile", icon: User },
          { id: "appearance", label: "Appearance", icon: Sun },
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
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <TIcon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        {activeTab === "profile" && (
          <form onSubmit={handleSave} className="space-y-4 max-w-lg text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white focus:outline-hidden focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Designation / Rank
              </label>
              <input
                type="text"
                disabled
                value={user.rank || user.role}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Active Department / Coy
              </label>
              <input
                type="text"
                disabled
                value={user.department || user.unit || "Sector Directorate"}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-slate-400 font-mono"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-4 max-w-lg text-xs">
            <h3 className="font-semibold text-white">Display Theme Mode</h3>
            <p className="text-slate-400">
              Select your interface preference. Deep slate dark mode is optimized for operational command readability.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-xl border text-center font-medium flex flex-col items-center gap-2 transition-all ${
                  theme === "dark"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Moon className="h-5 w-5 text-emerald-400" />
                <span>Dark Slate (Default)</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-4 rounded-xl border text-center font-medium flex flex-col items-center gap-2 transition-all ${
                  theme === "light"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Sun className="h-5 w-5 text-amber-400" />
                <span>Light Mode</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4 max-w-lg text-xs">
            <h3 className="font-semibold text-white">Alert Dispatch Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/40">
                <div>
                  <span className="font-medium text-white block">
                    Critical Welfare Risk Push Alerts
                  </span>
                  <span className="text-slate-400 text-[11px]">Instant dispatch for Urgent Review cases (&gt;80 score)</span>
                </div>
                <input
                  type="checkbox"
                  checked={highRiskPush}
                  onChange={(e) => setHighRiskPush(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/40">
                <div>
                  <span className="font-medium text-white block">
                    Daily Operational Summary Email
                  </span>
                  <span className="text-slate-400 text-[11px]">Morning digest delivered to service inbox</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/40">
                <div>
                  <span className="font-medium text-white block">
                    Sector Weekly Welfare Digest
                  </span>
                  <span className="text-slate-400 text-[11px]">Weekly analytical report compilation</span>
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
            <h3 className="font-semibold text-white">Privacy & DPDP Directives</h3>
            <p className="text-slate-400 leading-relaxed">
              Your session operates under the MissionWell Dignity Protocol. Automated salting ensures zero correlation between operational queries and individual personnel identity.
            </p>
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-4 w-4 inline mr-1.5" />
              <span>Differential Privacy Guarantees Active</span>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-3 max-w-lg text-xs">
            <h3 className="font-semibold text-white">Security Credentials</h3>
            <p className="text-slate-400">
              Current authentication session is managed via synthetic multi-role simulation tokens.
            </p>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400">
              Session Token: SEC-SIM-2025-08-CRPF-ACTIVE
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
