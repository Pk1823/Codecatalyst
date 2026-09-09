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
  Award,
  Sparkles,
  Smile,
  X,
} from "lucide-react";
import { useAuth, useToast } from "@/components/providers";
import { FORCES_METADATA } from "@/lib/force-metadata";
import { StatCard } from "@/components/common/stat-card";
import { WellnessTrendChart } from "@/components/charts/wellness-trend-chart";
import { WelfareService } from "@/services/welfare.service";
import { WellnessService } from "@/services/wellness.service";

export default function PersonnelDashboard() {
  const { user, force, lang } = useAuth();
  const { toast } = useToast();
  const meta = FORCES_METADATA[force] || FORCES_METADATA.CRPF;
  const isHi = lang === "hi";

  const [buddyStatus, setBuddyStatus] = useState<"optimal" | "alert" | "reported">("optimal");
  const [sainikRequestSent, setSainikRequestSent] = useState(false);
  const [isQuickCheckinOpen, setIsQuickCheckinOpen] = useState(false);
  const [quickEnergy, setQuickEnergy] = useState(4);
  const [quickSleep, setQuickSleep] = useState("6-7 hours");
  const [quickStress, setQuickStress] = useState("3-4");

  const [liveStats, setLiveStats] = useState({
    status: isHi ? "उत्कृष्ट" : "Good",
    stress: isHi ? "मध्यम" : "Moderate",
    fatigue: isHi ? "नियंत्रित" : "Low",
    workload: isHi ? "अधिक" : "Elevated",
  });

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("missionwell_last_assessment");
      if (stored) {
        const parsed = JSON.parse(stored);
        setLiveStats({
          status: parsed.status || (isHi ? "उत्कृष्ट" : "Good"),
          stress: parsed.stress || (isHi ? "मध्यम" : "Moderate"),
          fatigue: parsed.fatigue || (isHi ? "नियंत्रित" : "Low"),
          workload: parsed.workload || (isHi ? "अधिक" : "Elevated"),
        });
      }
    } catch (e) {}
  }, [isHi]);

  const handleBuddyReport = async () => {
    setBuddyStatus("reported");
    try {
      await WelfareService.createSupportRequestCase({
        personnelId: "P-1088",
        supportType: "Buddy Welfare Alert",
        priority: "High",
        description: "Buddy Mutual Check-in: Ct. Arvind Minz observed exhibiting continuous operational fatigue and distress.",
        preferredContact: "Welfare Coordinator",
      });
    } catch {}

    toast({
      title: isHi ? "बडी रिपोर्ट दर्ज की गई" : "Buddy Welfare Alert Dispatched",
      description: isHi
        ? "कल्याण अधिकारी को आपके साथी के विश्राम हेतु गोपनीय सूचना भेज दी गई है।"
        : "Confidential rest recommendation sent to Welfare Officer for Ct. Arvind Minz.",
      type: "success",
    });
  };

  const handleBuddyGood = () => {
    setBuddyStatus("optimal");
    toast({
      title: isHi ? "बडी स्थिति पुष्ट" : "Buddy Status Confirmed",
      description: isHi ? "साथी की स्थिति सामान्य दर्ज की गई।" : "Buddy status recorded as optimal.",
      type: "info",
    });
  };

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
      title: isHi ? "दरबार अनुरोध दर्ज हुआ" : "Audience Slot Requested",
      description: isHi
        ? "कमांडिंग ऑफिसर के गोपनीय समय-सारणी में स्लॉट दर्ज कर दिया गया है।"
        : "Confidential audience slot queued directly for Battalion Commander review.",
      type: "success",
    });
  };

  const handleQuickCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await WellnessService.submitAssessment(
        {
          consecutiveFieldDays: "11-30",
          dutyHours5d: "30-45 hours",
          nightShifts5d: "1",
          sleepHrs5dAvg: quickSleep,
          selfReportedEnergy: String(quickEnergy),
          selfReportedStress: quickStress,
          additionalNotes: "Quick 1-Click Daily Vitals Check-in.",
        },
        meta.sampleServiceId || "P-1024"
      );

      const newStatus = quickEnergy >= 4 ? (isHi ? "उत्कृष्ट" : "Good") : (isHi ? "ध्यान अपेक्षित" : "Attention Needed");
      const newStress = quickStress === "1-2" ? (isHi ? "कम" : "Low") : quickStress === "3-4" ? (isHi ? "मध्यम" : "Moderate") : (isHi ? "उच्च" : "Elevated");
      setLiveStats({
        status: newStatus,
        stress: newStress,
        fatigue: quickEnergy >= 4 ? (isHi ? "नियंत्रित" : "Low") : (isHi ? "मध्यम" : "Moderate"),
        workload: isHi ? "सामान्य" : "Balanced",
      });

      setIsQuickCheckinOpen(false);
      toast({
        title: isHi ? "दैनिक स्थिति दर्ज हुई" : "Daily Vitals Logged",
        description: isHi ? "आपकी आज की स्थिति गोपनीय रूप से दर्ज कर ली गई है।" : "Today's wellbeing metrics recorded confidentially.",
        type: "success",
      });
    } catch {
      toast({ title: "Error recording vitals", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC]">
              {isHi ? "जय हिन्द" : "Welcome"},{" "}
              {user.name || meta.samplePersonnelName}
            </h2>
            <span className="rounded bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-medium px-2 py-0.5 border border-emerald-200 dark:border-slate-700">
              {meta.sampleServiceId}
            </span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-medium px-2 py-0.5 border border-slate-200 dark:border-slate-700">
              {force}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHi ? "व्यक्तिगत कल्याण अवलोकन" : "Personal Wellbeing & Readiness Overview"} •{" "}
            <span className="text-slate-700 dark:text-slate-300">{meta.sampleUnit}</span> (
            {meta.sampleLocation})
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <button
            onClick={() => setIsQuickCheckinOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
          >
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isHi ? "त्वरित दैनिक चेक-इन" : "Quick Daily Vitals"}</span>
          </button>
          <Link
            href="/personnel/wellness"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileHeart className="h-4 w-4" />
            <span>{isHi ? "स्व-कल्याण जांच शुरू करें" : "Full Assessment"}</span>
          </Link>
          <Link
            href="/personnel/support"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2 text-xs font-medium shadow-xs transition-colors"
          >
            <HandHelping className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isHi ? "गोपनीय सहायता अनुरोध" : "Confidential Support"}</span>
          </Link>
        </div>
      </div>

      {/* Military Buddy-Pair System Quick Action Banner */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A]/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-slate-700 shrink-0 mt-0.5">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
                  {isHi ? "बडी-पेयर कल्याण निगरानी" : "Buddy-Pair Mutual Welfare System"}
                </h3>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                  PAIR #B-1088
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isHi ? "आपका अधिकृत साथी (Buddy):" : "Your assigned buddy:"}{" "}
                <strong className="text-slate-800 dark:text-slate-200">Ct. Arvind Minz</strong> (Forward Patrol, Post Dantewada).{" "}
                {isHi
                  ? "यदि आपका साथी थका हुआ या तनाव में दिखे, तो बिना किसी संकोच के सूचित करें।"
                  : "Look out for each other. Report if your partner shows severe fatigue, family distress, or sleeplessness."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {buddyStatus === "reported" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-medium border border-emerald-200 dark:border-emerald-800/60">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isHi ? "कल्याण अधिकारी को सूचित कर दिया गया" : "Notified Welfare Officer"}</span>
              </span>
            ) : (
              <>
                <button
                  onClick={handleBuddyGood}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  ✓ {isHi ? "मेरा साथी ठीक है" : "My Buddy is Good"}
                </button>
                <button
                  onClick={handleBuddyReport}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold shadow-xs transition-colors"
                >
                  ! {isHi ? "साथी को सहायता चाहिए" : "Buddy Needs Rest"}
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
          value={liveStats.status}
          subtitle={isHi ? "नवीनतम AI मूल्यांकन" : "Based on latest AI assessment"}
          change={liveStats.status.includes("Attention") ? "● Needs Review" : "● Optimal"}
          trend={liveStats.status.includes("Attention") ? "up" : "down"}
          icon={HeartPulse}
          variant={liveStats.status.includes("Attention") ? "urgent" : "success"}
        />
        <StatCard
          title={isHi ? "तनाव सूचकांक" : "Stress Indicator"}
          value={liveStats.stress}
          subtitle={isHi ? "स्व-मूल्यांकन आधारित" : "From subjective & objective metrics"}
          change={liveStats.stress === "Elevated" ? "▲ High Alert" : "▼ Stable"}
          trend={liveStats.stress === "Elevated" ? "up" : "down"}
          icon={Activity}
          variant={liveStats.stress === "Elevated" ? "urgent" : liveStats.stress === "Moderate" ? "warning" : "info"}
        />
        <StatCard
          title={isHi ? "थकान सूचकांक" : "Fatigue Indicator"}
          value={liveStats.fatigue}
          subtitle={isHi ? "प्रबंधनीय सीमाओं के भीतर" : "Within manageable boundaries"}
          change={liveStats.fatigue === "High" ? "▲ Exhaustion Risk" : "▼ Managed"}
          trend={liveStats.fatigue === "High" ? "up" : "down"}
          icon={BatteryCharging}
          variant={liveStats.fatigue === "High" ? "urgent" : liveStats.fatigue === "Moderate" ? "warning" : "info"}
        />
        <StatCard
          title={isHi ? "कार्यभार स्थिति" : "Duty Workload"}
          value={liveStats.workload}
          subtitle={isHi ? "ड्यूटी घंटे निर्धारित" : "Recent shift cycles"}
          change={liveStats.workload === "High" ? "▲ Elevated" : "▼ Normal"}
          trend={liveStats.workload === "High" ? "up" : "down"}
          icon={Briefcase}
          variant={liveStats.workload === "High" ? "urgent" : liveStats.workload === "Elevated" ? "warning" : "info"}
        />
      </div>

      {/* Main Grid: Trend Line Chart & Workload Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recharts Wellness Trend (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <WellnessTrendChart />

          {/* Sainik Sammelan & Darbar Request Card */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A]/90 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-slate-700">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
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
              <span className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-slate-700">
                ✓ {isHi ? "दरबार अनुरोध दर्ज हुआ" : "Audience Slot Requested"}
              </span>
            ) : (
              <button
                onClick={handleSainikAudienceRequest}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium shadow-xs transition-colors"
              >
                {isHi ? "दरबार समय मांगें" : "Request Audience"}
              </button>
            )}
          </div>
        </div>

        {/* Right: Personnel Workload Card & Supporting Metrics (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A]/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
                  {isHi ? "कर्तव्य एवं अवकाश संतुलन" : "Duty & Recovery Balance"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {meta.sampleUnit} • {meta.primaryTheatre}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                  72%
                </span>
                <span className="block text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase">
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
                    <Clock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{isHi ? "साप्ताहिक ड्यूटी घंटे" : "Weekly Duty Hours"}</span>
                  </span>
                  <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">
                    68 hrs / 54 hrs target
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[85%]" />
                </div>
              </div>

              {/* Recovery Time */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{isHi ? "दैनिक विश्राम व निद्रा" : "Daily Rest / Sleep"}</span>
                  </span>
                  <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">
                    5.5 hrs / 7.5 hrs optimal
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[73%]" />
                </div>
              </div>

              {/* Deployment Duration */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{isHi ? "कठिन क्षेत्र में निरंतर दिन" : "Continuous Field Deployment"}</span>
                  </span>
                  <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">
                    142 Days (Forward Outpost)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full w-[78%]" />
                </div>
              </div>

              {/* Leave Utilization */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{isHi ? "अवकाश कोटा उपयोग" : "Leave Quota Taken"}</span>
                  </span>
                  <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">
                    12 / 60 {isHi ? "दिन लिए (48 शेष)" : "Days (48 Left)"}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full w-[20%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isHi ? "अधिकृत डॉक्टर:" : "Assigned Welfare MO:"} {meta.sampleOfficerName}</span>
            </span>
            <Link
              href="/personnel/privacy"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
            >
              {isHi ? "गोपनीयता नियंत्रण →" : "Privacy Settings →"}
            </Link>
          </div>
        </div>
      </div>

      {/* Welfare Advisory Banner */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A]/90 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-slate-700 shrink-0">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {meta.helplineName} (24x7 Toll-Free: <span className="font-mono text-emerald-600 dark:text-emerald-400">{meta.helpline}</span>)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isHi
                ? "आपका 142 दिनों का निरंतर फॉरवर्ड पोस्ट कार्यकाल पूरा हो चुका है। आप रोटेशनल अवकाश व विश्राम के पात्र हैं।"
                : "You have completed 142 continuous forward outpost days. You are eligible for rotational decompression leave."}
            </p>
          </div>
        </div>
        <Link
          href="/personnel/support"
          className="shrink-0 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1"
        >
          <span>{isHi ? "अवकाश समीक्षा का अनुरोध करें" : "Request Decompression Review"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Quick 1-Click Daily Vitals Check-in Modal */}
      {isQuickCheckinOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsQuickCheckinOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isHi ? "दैनिक त्वरित कल्याण स्थिति" : "Quick Daily Vitals Check-in"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isHi ? "10 सेकंड में अपनी आज की तत्परता दर्ज करें" : "Record your energy and sleep in 10 seconds"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickCheckinOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleQuickCheckinSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {isHi ? "आज आपकी ऊर्जा (Energy Level)" : "Today's Energy Level"} ({quickEnergy}/5)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setQuickEnergy(lvl)}
                      className={`p-2 rounded-xl border text-center font-bold text-xs transition-all ${
                        quickEnergy === lvl
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 shadow-2xs"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {lvl}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? "पिछली रात की नींद (Sleep Hours)" : "Last Night's Sleep Hours"}
                </label>
                <select
                  value={quickSleep}
                  onChange={(e) => setQuickSleep(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                >
                  <option value="> 7 hours">&gt; 7 hours (Optimal)</option>
                  <option value="6-7 hours">6-7 hours (Good)</option>
                  <option value="5-6 hours">5-6 hours (Moderate)</option>
                  <option value="4-5 hours">4-5 hours (Disturbed)</option>
                  <option value="< 4 hours">&lt; 4 hours (Severe Insomnia)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? "कर्तव्य तनाव स्तर (Duty Stress)" : "Perceived Duty Stress"}
                </label>
                <select
                  value={quickStress}
                  onChange={(e) => setQuickStress(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                >
                  <option value="1-2">1-2 (Calm / Peacetime)</option>
                  <option value="3-4">3-4 (Normal Operational Duty)</option>
                  <option value="5-6">5-6 (Elevated Watch Rhythm)</option>
                  <option value="7-8">7-8 (High Tension / Fatigued)</option>
                  <option value="9-10">9-10 (Extreme Stress Pressure)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsQuickCheckinOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isHi ? "स्थिति सहेजें" : "Save Vitals"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
