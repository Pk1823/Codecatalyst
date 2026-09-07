"use client";

import React, { useState } from "react";
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
  FileHeart,
  Users,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  AlertTriangle,
  Award,
} from "lucide-react";
import { useAuth } from "@/components/providers";
import { FORCES_METADATA } from "@/lib/force-metadata";
import { StatCard } from "@/components/common/stat-card";
import { WellnessTrendChart } from "@/components/charts/wellness-trend-chart";

export default function PersonnelDashboard() {
  const { user, force, lang } = useAuth();
  const meta = FORCES_METADATA[force] || FORCES_METADATA.CRPF;
  const isHi = lang === "hi";

  const [buddyStatus, setBuddyStatus] = useState<"optimal" | "alert" | "reported">("optimal");
  const [sainikRequestSent, setSainikRequestSent] = useState(false);

  const handleBuddyReport = () => {
    setBuddyStatus("reported");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {isHi ? "जय हिन्द" : "Good morning"},{" "}
              {user.name || meta.samplePersonnelName}
            </h2>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-300 dark:border-emerald-800">
              {meta.sampleServiceId}
            </span>
            <span className="rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2.5 py-0.5 border border-blue-300 dark:border-blue-800 font-mono">
              {force}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isHi ? "व्यक्तिगत कल्याण अवलोकन" : "Personal Wellbeing & Readiness Overview"} •{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{meta.sampleUnit}</span> (
            {meta.sampleLocation})
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Link
            href="/personnel/wellness"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 text-xs font-bold shadow-md shadow-blue-900/20 transition-all hover:scale-105 active:scale-95"
          >
            <FileHeart className="h-4 w-4" />
            <span>{isHi ? "स्व-कल्याण जांच शुरू करें" : "Start Wellness Check"}</span>
          </Link>
          <Link
            href="/personnel/support"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 px-4 py-2 text-xs font-bold shadow-2xs transition-colors"
          >
            <HandHelping className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span>{isHi ? "गोपनीय सहायता अनुरोध" : "Confidential Support"}</span>
          </Link>
        </div>
      </div>

      {/* Military Buddy-Pair System Quick Action Banner */}
      <div className="rounded-2xl border border-teal-200 dark:border-teal-900/70 bg-gradient-to-r from-teal-50/80 via-blue-50/50 to-slate-50 dark:from-teal-950/40 dark:via-blue-950/20 dark:to-slate-900/50 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-sm shrink-0 mt-0.5">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {isHi ? "बडी-पेयर कल्याण निगरानी (Buddy Watch)" : "Buddy-Pair Mutual Welfare Watch"}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-mono">
                  PAIR #B-1088
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {isHi ? "आपका अधिकृत साथी (Buddy):" : "Your assigned buddy:"}{" "}
                <strong className="text-slate-900 dark:text-slate-100">Ct. Arvind Minz</strong> (Forward Patrol, Post Dantewada).{" "}
                {isHi
                  ? "यदि आपका साथी थका हुआ या तनाव में दिखे, तो बिना किसी संकोच के सूचित करें।"
                  : "Watch out for each other. Report if your partner shows severe fatigue, family distress, or sleeplessness."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {buddyStatus === "reported" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{isHi ? "कल्याण अधिकारी को सूचित कर दिया गया" : "Notified Welfare Officer"}</span>
              </span>
            ) : (
              <>
                <button
                  onClick={() => setBuddyStatus("optimal")}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750"
                >
                  ✓ {isHi ? "मेरा साथी ठीक है" : "My Buddy is Good"}
                </button>
                <button
                  onClick={handleBuddyReport}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  ! {isHi ? "साथी को सहायता चाहिए" : "Buddy Needs Rest / Care"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4 Status KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isHi ? "समग्र कल्याण स्थिति" : "Wellness Status"}
          value={isHi ? "उत्कृष्ट" : "Good"}
          subtitle={isHi ? "14 दिनों का स्थिर आधारभूत स्तर" : "Stable baseline over 14 days"}
          change="● Optimal"
          trend="down"
          icon={HeartPulse}
          variant="success"
        />
        <StatCard
          title={isHi ? "तनाव सूचकांक" : "Stress Indicator"}
          value={isHi ? "मध्यम" : "Moderate"}
          subtitle={isHi ? "रात्रि ड्यूटी के दौरान वृद्धि" : "Elevated during night rotations"}
          change="▲ +4% this week"
          trend="up"
          icon={Activity}
          variant="warning"
        />
        <StatCard
          title={isHi ? "थकान सूचकांक" : "Fatigue Indicator"}
          value={isHi ? "नियंत्रित" : "Low"}
          subtitle={isHi ? "प्रबंधनीय सीमाओं के भीतर" : "Within manageable boundaries"}
          change="▼ -2% improvement"
          trend="down"
          icon={BatteryCharging}
          variant="info"
        />
        <StatCard
          title={isHi ? "कार्यभार स्थिति" : "Duty Workload"}
          value={isHi ? "अधिक" : "Elevated"}
          subtitle={isHi ? "68 ड्यूटी घंटे निर्धारित" : "68 duty hours scheduled"}
          change="▲ Needs Review"
          trend="up"
          icon={Briefcase}
          variant="urgent"
        />
      </div>

      {/* Main Grid: Trend Line Chart & Workload Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recharts Wellness Trend (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <WellnessTrendChart />

          {/* Sainik Sammelan & Darbar Request Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {isHi ? "सैनिक सम्मेलन / गोपनीय दरबार अनुरोध" : "Confidential Sainik Sammelan Request"}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isHi
                    ? "कमांडिंग ऑफिसर या सूबेदार मेजर के समक्ष सीधे एवं गोपनीय रूप से अपनी बात रखें।"
                    : "Direct 1-on-1 audience with the Commanding Officer without administrative filtering."}
                </p>
              </div>
            </div>

            {sainikRequestSent ? (
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800">
                ✓ {isHi ? "दरबार अनुरोध दर्ज हुआ" : "Audience Slot Requested"}
              </span>
            ) : (
              <button
                onClick={() => setSainikRequestSent(true)}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {isHi ? "दरबार समय मांगें" : "Request Audience"}
              </button>
            )}
          </div>
        </div>

        {/* Right: Personnel Workload Card & Supporting Metrics (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {isHi ? "कर्तव्य एवं अवकाश संतुलन" : "Duty & Recovery Balance"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {meta.sampleUnit} • {meta.primaryTheatre}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-orange-600 dark:text-orange-400 font-mono">
                  72%
                </span>
                <span className="block text-[10px] font-bold text-orange-700 dark:text-orange-300 uppercase">
                  {isHi ? "अधिक कार्यभार" : "Elevated"}
                </span>
              </div>
            </div>

            {/* Supporting Metrics with Progress Bars */}
            <div className="mt-5 space-y-4">
              {/* Duty Hours */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{isHi ? "साप्ताहिक ड्यूटी घंटे" : "Weekly Duty Hours"}</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    68 hrs / 54 hrs target
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full w-[85%]" />
                </div>
              </div>

              {/* Recovery Time */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5 text-slate-400" />
                    <span>{isHi ? "दैनिक विश्राम व निद्रा" : "Daily Rest / Sleep"}</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    5.5 hrs / 7.5 hrs optimal
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[65%]" />
                </div>
              </div>

              {/* Deployment Duration */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{isHi ? "कठिन क्षेत्र में निरंतर दिन" : "Continuous Field Deployment"}</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    142 Days (Forward Outpost)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[78%]" />
                </div>
              </div>

              {/* Leave Utilization */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    <span>{isHi ? "अवकाश कोटा उपयोग" : "Leave Quota Taken"}</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    12 / 60 {isHi ? "दिन लिए (48 शेष)" : "Days (48 Left)"}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[20%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{isHi ? "अधिकृत डॉक्टर:" : "Assigned Welfare MO:"} {meta.sampleOfficerName}</span>
            </span>
            <Link
              href="/personnel/privacy"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              {isHi ? "गोपनीयता नियंत्रण →" : "Manage Privacy →"}
            </Link>
          </div>
        </div>
      </div>

      {/* Welfare Advisory Banner */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shrink-0">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-950 dark:text-blue-200">
              {meta.helplineName} (24x7 Toll-Free: {meta.helpline})
            </h4>
            <p className="text-xs text-blue-800/80 dark:text-blue-300/80 mt-0.5">
              {isHi
                ? "आपका 142 दिनों का निरंतर फॉरवर्ड पोस्ट कार्यकाल पूरा हो चुका है। आप रोटेशनल अवकाश व विश्राम के पात्र हैं।"
                : "You have completed 142 continuous forward outpost days. You are eligible for rotational decompression leave."}
            </p>
          </div>
        </div>
        <Link
          href="/personnel/support"
          className="shrink-0 text-xs font-bold text-blue-700 dark:text-blue-300 hover:underline flex items-center gap-1"
        >
          <span>{isHi ? "अवकाश समीक्षा का अनुरोध करें" : "Request Decompression Review"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
