"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HeartPulse,
  Activity,
  BatteryCharging,
  Briefcase,
  Clock,
  Moon,
  Calendar,
  ShieldCheck,
  ArrowRight,
  HandHelping,
  Sparkles,
  CheckCircle2,
  X,
  PhoneCall,
  Smartphone,
} from "lucide-react";
import { useAuth, useToast } from "@/components/providers";
import { FORCES_METADATA } from "@/lib/force-metadata";
import { WellnessTrendChart } from "@/components/charts/wellness-trend-chart";
import { WelfareService } from "@/services/welfare.service";
import { WellnessService } from "@/services/wellness.service";

export default function PersonnelDashboard() {
  const { user, force, lang } = useAuth();
  const { toast } = useToast();
  const meta = FORCES_METADATA[force] || FORCES_METADATA.CRPF;
  const isHi = lang === "hi";

  const [sainikRequestSent, setSainikRequestSent] = useState(false);

  const [liveStats, setLiveStats] = useState({
    status: isHi ? "संतुलित" : "Optimal",
    stress: isHi ? "सामान्य" : "Low",
    fatigue: isHi ? "नियंत्रित" : "Low",
    workload: isHi ? "संतुलित" : "Moderate",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("missionwell_last_assessment");
      if (stored) {
        const parsed = JSON.parse(stored);
        setLiveStats({
          status: parsed.status || (isHi ? "संतुलित" : "Optimal"),
          stress: parsed.stress || (isHi ? "सामान्य" : "Low"),
          fatigue: parsed.fatigue || (isHi ? "नियंत्रित" : "Low"),
          workload: parsed.workload || (isHi ? "संतुलित" : "Moderate"),
        });
      }
    } catch (e) {}
  }, [isHi]);

  const handleSainikAudienceRequest = async () => {
    setSainikRequestSent(true);
    try {
      await WelfareService.createSupportRequestCase({
        personnelId: meta.sampleServiceId || "P-1024",
        supportType: "Sainik Sammelan Audience",
        priority: "High",
        description: "Direct confidential 1-on-1 audience requested with Commanding Officer.",
        preferredContact: "Direct In-Person",
      });
    } catch {}

    toast({
      title: isHi ? "अनुरोध दर्ज हुआ" : "Audience Requested",
      description: isHi
        ? "कमांडिंग ऑफिसर के गोपनीय समय-सारणी में स्लॉट दर्ज कर दिया गया है।"
        : "Confidential audience slot queued for Commanding Officer review.",
      type: "success",
    });
  };

  const isAttention = liveStats.status.toLowerCase().includes("attention") || liveStats.status.toLowerCase().includes("elevated");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* 1. Clean & Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {isHi ? "जय हिन्द" : "Welcome"},{" "}
              <span className="text-blue-600 dark:text-blue-400">{user.name || meta.samplePersonnelName}</span>
            </h1>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
              {user.serviceId || meta.sampleServiceId}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHi ? "दैनिक कल्याण एवं परिचालन तत्परता सारांश" : "Operational readiness & personal wellness overview"}
          </p>
        </div>

        {/* Minimal Action Controls */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/personnel/wellness"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>{isHi ? "मोबाइल ऐप पर मूल्यांकन" : "Mobile App Assessment"}</span>
          </Link>
          <Link
            href="/personnel/support"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Confidential Support"
          >
            <HandHelping className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{isHi ? "सहायता" : "Support"}</span>
          </Link>
        </div>
      </div>

      {/* Mobile Assessment Mandatory Protocol Notice */}
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-800 dark:text-blue-300">
        <Smartphone className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
        <div className="flex-1 text-[11px] leading-relaxed">
          <span className="font-bold">
            {isHi ? "वैधानिक मूल्यांकन दिशानिर्देश:" : "Assessment Mobile Protocol:"}{" "}
          </span>
          {isHi
            ? "डीपीडीपी अधिनियम 2023 व गैर-दंडात्मक सुरक्षा के तहत सैनिक कल्याण मूल्यांकन केवल मिशनवेल मोबाइल ऐप पर ही सबमिट किया जा सकता है।"
            : "Under DPDP Act 2023 & Non-Punitive Defense Directives, personnel assessments are submitted exclusively via the MissionWell Mobile App."}
        </div>
        <Link
          href="/personnel/wellness"
          className="underline font-semibold text-blue-600 dark:text-blue-400 shrink-0 text-[11px]"
        >
          {isHi ? "क्यूआर कोड खोलें" : "View QR Code"}
        </Link>
      </div>

      {/* 2. Simplified Stat Indicators (4 Minimal Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Status */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0C1220] transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-medium tracking-wide uppercase">{isHi ? "स्थिति" : "Wellness"}</span>
            <HeartPulse className={`h-4 w-4 ${isAttention ? "text-amber-500" : "text-emerald-500"}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              {liveStats.status}
            </span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
              isAttention
                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
            }`}>
              {isAttention ? "Review" : "Optimal"}
            </span>
          </div>
        </div>

        {/* Stress */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0C1220] transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-medium tracking-wide uppercase">{isHi ? "तनाव" : "Stress"}</span>
            <Activity className="h-4 w-4 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              {liveStats.stress}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {liveStats.stress === "Elevated" ? "Alert" : "Stable"}
            </span>
          </div>
        </div>

        {/* Fatigue */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0C1220] transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-medium tracking-wide uppercase">{isHi ? "थकान" : "Fatigue"}</span>
            <BatteryCharging className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              {liveStats.fatigue}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {liveStats.fatigue === "High" ? "Needs Rest" : "Managed"}
            </span>
          </div>
        </div>

        {/* Workload */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0C1220] transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-medium tracking-wide uppercase">{isHi ? "कार्यभार" : "Workload"}</span>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              {liveStats.workload}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {liveStats.workload === "High" ? "Elevated" : "Normal"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Core Insights: Trend Chart & Duty Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Wellness Trend Chart (7 cols) */}
        <div className="lg:col-span-7">
          <WellnessTrendChart />
        </div>

        {/* Right: Duty & Recovery Balance (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0C1220] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isHi ? "कर्तव्य एवं अवकाश संतुलन" : "Duty & Recovery"}
              </h3>
              <span className="text-xs font-mono font-medium text-amber-600 dark:text-amber-400">
                72% {isHi ? "सक्रिय" : "Load"}
              </span>
            </div>

            {/* Minimal Metric Bars */}
            <div className="mt-4 space-y-3.5">
              {/* Duty Hours */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{isHi ? "साप्ताहिक ड्यूटी" : "Weekly Duty"}</span>
                  </span>
                  <span className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">
                    68h <span className="text-slate-400 font-normal">/ 54h</span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[85%]" />
                </div>
              </div>

              {/* Recovery */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5 text-slate-400" />
                    <span>{isHi ? "दैनिक नींद" : "Daily Sleep"}</span>
                  </span>
                  <span className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">
                    5.5h <span className="text-slate-400 font-normal">/ 7.5h</span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[73%]" />
                </div>
              </div>

              {/* Continuous Field Deployment */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{isHi ? "निरंतर पोस्टिंग" : "Deployment"}</span>
                  </span>
                  <span className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">
                    142 Days <span className="text-slate-400 font-normal">(Forward)</span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full w-[78%]" />
                </div>
              </div>

              {/* Leave Utilization */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    <span>{isHi ? "अवकाश शेष" : "Leave Quota"}</span>
                  </span>
                  <span className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">
                    12 / 60 <span className="text-slate-400 font-normal">taken</span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[20%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              <span>MO: {meta.sampleOfficerName}</span>
            </span>
            <Link
              href="/personnel/privacy"
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
            >
              {isHi ? "गोपनीयता" : "Privacy"} →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Streamlined Confidential Support Bar (Simple & Uncluttered) */}
      <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0C1220] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <PhoneCall className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-900 dark:text-slate-200">
              {isHi ? "गोपनीय दरबार / 24x7 सहायता" : "Confidential Darbar & Helpline"}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {meta.helplineName}: <span className="font-mono text-blue-600 dark:text-blue-400">{meta.helpline}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {sainikRequestSent ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ {isHi ? "अनुरोध दर्ज हुआ" : "Audience Queued"}
            </span>
          ) : (
            <button
              onClick={handleSainikAudienceRequest}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              {isHi ? "दरबार समय मांगें" : "Request Darbar Audience"}
            </button>
          )}
          <Link
            href="/personnel/support"
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 inline-flex items-center gap-1 font-medium"
          >
            <span>{isHi ? "सहायता पोर्टल" : "Support"}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
