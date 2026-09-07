"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  HeartPulse,
  LineChart,
  Lock,
  ArrowRight,
  Activity,
  CheckCircle2,
  Users,
  Eye,
  Sparkles,
  FileCheck,
  Scale,
  Brain,
  ChevronRight,
  Zap,
  BarChart3,
  Award,
  PhoneCall,
  Flame,
  Calendar,
  Layers,
  Compass,
  FileHeart,
  Sliders,
  AlertTriangle,
} from "lucide-react";
import { DemoBanner } from "@/components/layout/demo-banner";
import { useAuth, ForceType } from "@/components/providers";
import { FORCES_METADATA } from "@/lib/force-metadata";
import { UserRole } from "@/types/auth";

export default function LandingPage() {
  const router = useRouter();
  const { force, setForce, switchRole, lang, toggleLang } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState<ForceType>(force || "CRPF");
  const isHi = lang === "hi";

  const branchMeta = FORCES_METADATA[selectedBranch] || FORCES_METADATA.CRPF;

  const handleQuickRoleAccess = (targetRole: UserRole, targetForce?: ForceType) => {
    if (targetForce) setForce(targetForce);
    switchRole(targetRole);
    if (targetRole === "PERSONNEL") router.push("/personnel");
    else if (targetRole === "WELFARE_OFFICER") router.push("/welfare");
    else if (targetRole === "COMMANDER") router.push("/commander");
    else if (targetRole === "ADMIN") router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      <DemoBanner />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-blue-700 to-teal-500 shadow-md border border-amber-400/30">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  MissionWell <span className="text-teal-400 font-mono">AI</span>
                </span>
                <span className="rounded-xs bg-amber-500/20 px-1 py-0.2 text-[9px] font-mono font-bold text-amber-300 border border-amber-500/30">
                  {selectedBranch}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                {isHi ? "सशस्त्र बल एवं पुलिस कल्याण प्रणाली" : "Forces Welfare Intelligence"}
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#forces" className="hover:text-amber-300 transition-colors">
              {isHi ? "बल शाखाएं" : "Force Branches"}
            </a>
            <a href="#quick-access" className="hover:text-amber-300 transition-colors">
              {isHi ? "अधिकारी प्रवेश" : "Authorities Access"}
            </a>
            <a href="#buddy-system" className="hover:text-amber-300 transition-colors">
              {isHi ? "बडी-पेयर प्रणाली" : "Buddy Doctrine"}
            </a>
            <a href="#capabilities" className="hover:text-amber-300 transition-colors">
              {isHi ? "क्षमताएं" : "Capabilities"}
            </a>
            <a href="#privacy" className="hover:text-amber-300 transition-colors">
              {isHi ? "डीपीडीपी 2023" : "DPDP Privacy"}
            </a>
            <Link
              href="/presentation"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold bg-amber-950/40 border border-amber-800/60 px-2.5 py-1 rounded-lg"
            >
              <Award className="h-3.5 w-3.5" />
              <span>{isHi ? "पिच डेक" : "Pitch Deck"}</span>
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleLang}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-bold text-teal-300 hover:bg-slate-800 transition-colors"
              title="Toggle English / हिन्दी"
            >
              {isHi ? "English" : "हिन्दी"}
            </button>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-teal-600 hover:from-blue-600 hover:to-teal-500 text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-lg shadow-blue-900/40 transition-all hover:scale-105 active:scale-95"
            >
              <span>{isHi ? "सुरक्षित प्रवेश" : "Official Sign-In"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-amber-600/10 via-blue-700/15 to-teal-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 text-amber-300 text-xs font-bold tracking-wide shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Smart India Hackathon • Problem Statement 26186 • MHA / Police II Division</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              {isHi ? (
                <>
                  सशस्त्र बलों एवं पुलिस हेतु{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-teal-300 to-emerald-400">
                    पूर्वानुमानित कल्याण निगरानी
                  </span>
                </>
              ) : (
                <>
                  Predictive Wellness Intelligence for{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-teal-300 to-emerald-400">
                    Safer, Stronger Forces
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              {isHi
                ? "कठिन इलाके, निरंतर कर्तव्य घंटे, पारिवारिक दूरी और तनाव के प्रारंभिक संकेतों को भांपकर मानवीय कल्याण सहायता पहुंचाएं। भारतीय सेना, सीएपीएफ (CRPF, BSF, ITBP, CISF) एवं राज्य पुलिस के लिए पूर्णतः अनुकूलित।"
                : "AI-assisted proactive welfare monitoring for Indian Army, CAPFs (CRPF, BSF, ITBP, CISF), and State Police. Detects duty fatigue, sleep deprivation, and deployment stress early without stigmatization or service prejudice."}
            </p>

            {/* Military Motto Badge */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 shadow-md">
              <span className="text-amber-400 font-bold font-mono">
                {branchMeta.nameHi}:
              </span>
              <span>"{branchMeta.mottoHi}" ({branchMeta.motto})</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-900/50 hover:scale-105 active:scale-95 transition-all"
              >
                <span>{isHi ? "पोर्टल में प्रवेश करें" : "Access Official Portal"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#quick-access"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-teal-500/40 bg-teal-950/30 hover:bg-teal-900/40 px-6 py-3.5 text-sm font-bold text-teal-300 transition-all"
              >
                <span>{isHi ? "1-क्लिक अधिकारी डेमो टेस्ट" : "1-Click Authority Testing"}</span>
                <ChevronRight className="h-4 w-4 text-teal-400" />
              </a>
              <Link
                href="/presentation"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/40 px-5 py-3.5 text-sm font-bold text-amber-300 transition-all"
              >
                <Award className="h-4 w-4" />
                <span>{isHi ? "हैकथॉन प्रस्तुति" : "Judge Pitch Deck"}</span>
              </Link>
            </div>
          </div>

          {/* Telemetry Live Mockup Box */}
          <div className="mt-12 max-w-5xl mx-auto rounded-2xl border border-slate-700/80 bg-slate-900/90 p-4 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-2">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-300">
                  {branchMeta.sampleBattalion} • {branchMeta.sampleLocation}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isHi ? "लाइव बटालियन वेलफेयर टेलीमेट्री" : "Live Battalion Welfare Telemetry"}</span>
              </div>
            </div>

            {/* Mockup Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{isHi ? "बटालियन कल्याण सूचकांक" : "Unit Welfare Index"}</span>
                  <span className="text-emerald-400 font-bold">81.4 / 100</span>
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  {branchMeta.sampleUnit}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>1,248 {isHi ? "सैनिक/जवान सक्रिय निगरानी में" : "Personnel Monitored"}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{isHi ? "सक्रिय सहायता हस्तक्षेप" : "Active Welfare Care"}</span>
                  <span className="text-teal-400 font-bold">18 Cases</span>
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  {isHi ? "प्रारंभिक रोटेशन व आराम" : "Proactive Decompression"}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <HeartPulse className="h-3.5 w-3.5 text-teal-400" />
                  <span>{isHi ? "शून्य-कलंक नीति लागू" : "Zero-Stigma Policy Active"}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{isHi ? "24x7 सहायता संपर्क" : "Emergency Helpline"}</span>
                  <span className="text-amber-400 font-bold">Toll-Free</span>
                </div>
                <div className="text-2xl font-black text-amber-300 mt-2 font-mono">
                  14416 / 1800-599-0019
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <PhoneCall className="h-3.5 w-3.5 text-amber-400" />
                  <span>Tele-MANAS & National Force Helpline</span>
                </div>
              </div>
            </div>

            {/* Mockup Operational Notice */}
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-black text-[10px]">
                  ● PROACTIVE WELFARE ALERT
                </span>
                <span className="text-xs text-slate-200">
                  <strong>{branchMeta.samplePersonnelName} ({branchMeta.sampleServiceId})</strong>: 142 days forward duty • rotational leave advised before operational fatigue builds.
                </span>
              </div>
              <button
                onClick={() => handleQuickRoleAccess("WELFARE_OFFICER", selectedBranch)}
                className="shrink-0 text-xs text-teal-300 font-bold hover:underline"
              >
                {isHi ? "अधिकारी समीक्षा खोलें →" : "Open Officer Review →"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Interactive Force Switcher (CRPF, Army, BSF, ITBP, CISF, State Police) */}
      <section id="forces" className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              {isHi ? "सशस्त्र बल एवं राज्य पुलिस विंग" : "Customized for Uniformed Services"}
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isHi ? "प्रत्येक बल की परिचालन चुनौतियों के अनुसार" : "Engineered for Specific Operational Theatres"}
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              {isHi
                ? "नीचे किसी भी बल का चयन करके उस शाखा के संदर्भ, इकाइयों और पदनामों का तुरंत अनुभव करें।"
                : "Select any force branch below to immediately adapt the dashboard context, ranks, and operational benchmarks."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(
              [
                { id: "CRPF", name: "CRPF", full: "Reserve Police", theatre: "Bastar / J&K LWE", icon: Flame },
                { id: "ARMY", name: "Indian Army", full: "Armed Forces", theatre: "Siachen / LoC", icon: Shield },
                { id: "BSF", name: "BSF", full: "Border Security", theatre: "Thar Desert / BOP", icon: Compass },
                { id: "ITBP", name: "ITBP", full: "Tibetan Border", theatre: "Himveer -30°C", icon: Activity },
                { id: "CISF", name: "CISF", full: "Industrial / Aero", theatre: "Critical Infra", icon: Lock },
                { id: "STATE_POLICE", name: "State Police", full: "Police Services", theatre: "Law & Order / PCR", icon: Users },
              ] as const
            ).map((f) => {
              const isSelected = selectedBranch === f.id;
              const FIcon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedBranch(f.id);
                    setForce(f.id);
                  }}
                  className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "border-amber-500 bg-amber-950/40 ring-1 ring-amber-500/50 shadow-lg scale-102"
                      : "border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-white">{f.name}</span>
                    <FIcon className={`h-4 w-4 ${isSelected ? "text-amber-400" : "text-slate-500"}`} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-300">{f.full}</span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{f.theatre}</span>
                  </div>
                  {isSelected && (
                    <span className="mt-2 text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                      ✓ {isHi ? "सक्रिय संदर्भ" : "Active Context"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: One-Click Authority Quick Access Cards for Evaluators & Officers */}
      <section id="quick-access" className="py-20 bg-slate-900/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-bold mb-3">
              <Award className="h-3.5 w-3.5" />
              <span>{isHi ? "अधिकारियों एवं परीक्षकों हेतु" : "Authorities & Hackathon Judges"}</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isHi ? "1-क्लिक आधिकारिक भूमिका परीक्षण" : "1-Click Direct Role Testing"}
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              {isHi
                ? "बिना किसी पासवर्ड के वास्तविक भूमिकाओं में तुरंत प्रवेश करें और पूरे सिस्टम का मूल्यांकन करें।"
                : "Evaluate each distinct defense role immediately with preloaded operational data."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Personnel */}
            <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-b from-emerald-950/30 to-slate-900/90 p-5 flex flex-col justify-between hover:border-emerald-500/60 transition-all shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-900/40 text-emerald-400 border border-emerald-700/40">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                    {isHi ? "जवान पोर्टल" : "PERSONNEL"}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  {isHi ? "जवान / आरक्षक पोर्टल" : "Personnel Welfare"}
                </h4>
                <p className="text-[11px] text-slate-400 font-semibold mb-3">
                  {branchMeta.samplePersonnelName} • {branchMeta.ranks.personnel}
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 mb-4">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{isHi ? "बडी-पेयर कल्याण जांच" : "Buddy-Pair Wellness Watch"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{isHi ? "7-चरण स्वैच्छिक जांच" : "7-Step Voluntary Check-in"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{isHi ? "सैनिक सम्मेलन अनुरोध" : "Confidential Support Request"}</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleQuickRoleAccess("PERSONNEL", selectedBranch)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>{isHi ? "जवान के रूप में प्रवेश करें" : "Enter as Personnel"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Card 2: Welfare Officer */}
            <div className="rounded-2xl border border-blue-900/40 bg-gradient-to-b from-blue-950/30 to-slate-900/90 p-5 flex flex-col justify-between hover:border-blue-500/60 transition-all shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-900/40 text-blue-400 border border-blue-700/40">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                    {isHi ? "कल्याण अधिकारी" : "WELFARE"}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  {isHi ? "कल्याण एवं चिकित्सा कमान" : "Welfare Officer Hub"}
                </h4>
                <p className="text-[11px] text-slate-400 font-semibold mb-3">
                  {branchMeta.sampleOfficerName} • {branchMeta.ranks.welfare}
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 mb-4">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>{isHi ? "सक्रिय मामले एवं समयरेखा" : "Active Welfare Cases & Triage"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>{isHi ? "स्पष्टीकरणीय एआई जोखिम" : "Explainable AI Risk Factors"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>{isHi ? "रोटेशन व विश्राम सुझाव" : "Rotational Rest Dispatch"}</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleQuickRoleAccess("WELFARE_OFFICER", selectedBranch)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>{isHi ? "कल्याण अधिकारी के रूप में देखें" : "Enter as Welfare Officer"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Card 3: Commander */}
            <div className="rounded-2xl border border-purple-900/40 bg-gradient-to-b from-purple-950/30 to-slate-900/90 p-5 flex flex-col justify-between hover:border-purple-500/60 transition-all shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-purple-900/40 text-purple-400 border border-purple-700/40">
                    <Shield className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                    {isHi ? "कमांडर कमान" : "COMMANDER"}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  {isHi ? "बटालियन / सेक्टर कमान" : "Commander Force Overview"}
                </h4>
                <p className="text-[11px] text-slate-400 font-semibold mb-3">
                  {branchMeta.sampleCommanderName} • {branchMeta.ranks.commander}
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 mb-4">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    <span>{isHi ? "कंपनी-वार रोल-कॉल दबाव" : "Company-Wise Roll-Call Load"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    <span>{isHi ? "अवकाश व तैनाती संतुलन" : "Leave & Decompression Heatmap"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    <span>{isHi ? "शून्य-पीआईआई समग्र डेटा" : "Strict Masked Anonymity"}</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleQuickRoleAccess("COMMANDER", selectedBranch)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>{isHi ? "कमांडर के रूप में देखें" : "Enter as Commander"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Card 4: System Admin & Audit */}
            <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-b from-amber-950/30 to-slate-900/90 p-5 flex flex-col justify-between hover:border-amber-500/60 transition-all shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-amber-900/40 text-amber-400 border border-amber-700/40">
                    <Sliders className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                    {isHi ? "प्रणाली ऑडिट" : "ADMIN & AUDIT"}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  {isHi ? "प्रणाली एवं ऑडिट शासन" : "Admin & Audit Center"}
                </h4>
                <p className="text-[11px] text-slate-400 font-semibold mb-3">
                  Sunil Patel • Senior Systems Officer (NIC/MHA)
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 mb-4">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>{isHi ? "डीपीडीपी अधिनियम 2023 ऑडिट" : "DPDP Act 2023 Compliance"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>{isHi ? "अपरिवर्तनीय एक्सेस लॉग" : "Immutable Zero-Trust Logs"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>{isHi ? "सुरक्षा शासन नियंत्रण" : "Model Integrity & Governance"}</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleQuickRoleAccess("ADMIN", selectedBranch)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>{isHi ? "प्रशासक के रूप में देखें" : "Enter as Admin"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Buddy-Pair System (Authentic Army/CAPF Doctrine) */}
      <section id="buddy-system" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-950/40 text-teal-300 text-xs font-bold">
                <Users className="h-3.5 w-3.5" />
                <span>{isHi ? "पारस्परिक सुरक्षा सिद्धांत" : "Authentic Military & CAPF Doctrine"}</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isHi ? "बडी-पेयर कल्याण प्रणाली (Buddy-Pair System)" : "The Sacred Buddy-Pair Welfare System"}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {isHi
                  ? "भारतीय सेना और अर्धसैनिक बलों में 'जोड़ीदार (Buddy)' की प्रथा दशकों से अटूट है। जब कोई जवान अनिद्रा, घरेलू परेशानी या तनाव में होता है, तो उसका बडी सबसे पहले पहचानता है। MissionWell में 1-टैप गोपनीय बडी-चेक की सुविधा दी गई है।"
                  : "In the Indian Armed Forces and CAPFs, every jawan is assigned a trusted 'Buddy'. If a soldier experiences sleep deficit or family grief, their buddy notices first. MissionWell digitizes this sacred trust with a dignified, non-stigmatizing 1-tap peer welfare check."}
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    title: isHi ? "गोपनीय साथी जांच" : "Confidential Peer Check",
                    desc: isHi ? "जवान बिना किसी हिचक के अपने साथी हेतु सहायता की सिफारिश कर सकते हैं।" : "Jawans can flag when their buddy needs rest or family contact without punitive record.",
                  },
                  {
                    title: isHi ? "सैनिक सम्मेलन में सीधी पहुंच" : "Direct Sainik Sammelan Slot",
                    desc: isHi ? "कमांडिंग ऑफिसर के दरबार में सीधे गोपनीय बातचीत का अवसर।" : "Immediate confidential audience with the Commanding Officer or Subedar Major.",
                  },
                  {
                    title: isHi ? "टेली-मानस एवं चिकित्सा कक्ष सहायता" : "Tele-MANAS & MI Room Connect",
                    desc: isHi ? "24x7 राष्ट्रीय हेल्पलाइन 14416 एवं रेजिमेंटल मेडिकल डॉक्टर से सीधा संपर्क।" : "Instant non-stigmatizing connect with qualified doctors and national mental health lines.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buddy-Pair Visual Simulation Card */}
            <div className="lg:col-span-6 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {isHi ? "जोड़ीदार निगरानी स्थिति (Buddy Pair Status)" : "Simulated Buddy Watch"}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  {isHi ? "सुरक्षित एवं सक्रिय" : "PAIR VERIFIED"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{isHi ? "आप (जवान)" : "You"}</span>
                  <p className="text-sm font-bold text-white mt-1">{branchMeta.samplePersonnelName}</p>
                  <p className="text-[11px] text-slate-400">{branchMeta.ranks.personnel}</p>
                  <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700/40">
                    {isHi ? "कर्तव्य स्थिति: सामान्य" : "Status: Optimal"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{isHi ? "आपका बडी (जोड़ीदार)" : "Assigned Buddy"}</span>
                  <p className="text-sm font-bold text-white mt-1">Ct. Arvind Minz</p>
                  <p className="text-[11px] text-slate-400">P-1088 • Bravo Coy</p>
                  <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-700/40">
                    {isHi ? "नींद कमी • ध्यान अपेक्षित" : "Sleep Deficit • Alert"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 text-xs text-blue-200 flex items-center justify-between">
                <span>{isHi ? "क्या आपके जोड़ीदार को विश्राम की आवश्यकता है?" : "Does your buddy need decompression?"}</span>
                <Link
                  href="/personnel/support"
                  className="px-3 py-1 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-[11px] font-bold"
                >
                  {isHi ? "सहायता मांगें" : "Request Care"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: DPDP Act 2023 & Zero-Trust Governance */}
      <section id="privacy" className="py-20 bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-950/40 text-teal-300 text-xs font-bold">
                <Scale className="h-3.5 w-3.5" />
                <span>{isHi ? "भारतीय डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023" : "DPDP Act 2023 Compliant"}</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isHi ? "सैनिक का सम्मान एवं पूर्ण गोपनीयता" : "Personnel Dignity & Absolute Confidentiality"}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {isHi
                  ? "MissionWell इस सिद्धांत पर आधारित है कि कल्याण डेटा का उपयोग कभी भी जवान के करियर, पदोन्नति या वार्षिक गोपनीय रिपोर्ट (ACR/APAR) पर प्रतिकूल प्रभाव डालने हेतु नहीं किया जाएगा। कमांडरों को केवल अज्ञात समग्र आँकड़े दिखाई देते हैं।"
                  : "MissionWell operates under a strict non-punitive doctrine. Wellness disclosures are cryptographically isolated and never impact Annual Performance Appraisals (ACR/APAR). Commanders see only masked unit aggregates."}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs font-bold text-teal-400 block mb-1">✓ {isHi ? "कमांडर दृश्य" : "Commander View"}</span>
                  <span className="text-[11px] text-slate-400">{isHi ? "केवल समग्र कंपनी आंकड़े; कोई व्यक्तिगत नाम नहीं।" : "Masked aggregate unit readiness only."}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs font-bold text-teal-400 block mb-1">✓ {isHi ? "चिकित्सा गोपनीयता" : "Clinical Privacy"}</span>
                  <span className="text-[11px] text-slate-400">{isHi ? "परामर्श नोट्स केवल डॉक्टर-मरीज तक सीमित।" : "Counseling notes isolated to authorized doctors."}</span>
                </div>
              </div>
            </div>

            {/* Privacy Matrix Summary Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {isHi ? "डेटा दृश्यता विभाजन" : "Separation of Powers Matrix"}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  ZERO-TRUST
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 px-2">{isHi ? "डेटा प्रकार" : "Data Class"}</th>
                      <th className="py-2 px-2 text-center">{isHi ? "जवान" : "Jawan"}</th>
                      <th className="py-2 px-2 text-center">{isHi ? "कल्याण अधिकारी" : "Welfare"}</th>
                      <th className="py-2 px-2 text-center">{isHi ? "कमांडर" : "Commander"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2.5 px-2 font-medium text-white">{isHi ? "स्वैच्छिक प्रतिक्रिया" : "Self-Report Survey"}</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Care Only</td>
                      <td className="py-2.5 px-2 text-center text-rose-400 font-bold">✕ BLOCKED</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 font-medium text-white">{isHi ? "चिकित्सा परामर्श नोट्स" : "Counseling Notes"}</td>
                      <td className="py-2.5 px-2 text-center text-slate-500">—</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Doctor-Only</td>
                      <td className="py-2.5 px-2 text-center text-rose-400 font-bold">✕ BLOCKED</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 font-medium text-white">{isHi ? "बटालियन तैयारी सूचकांक" : "Unit Stress Index"}</td>
                      <td className="py-2.5 px-2 text-center text-slate-500">—</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Aggregated</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Aggregated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer Section */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-slate-900 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {isHi ? "एक सशक्त, स्वस्थ एवं सुरक्षित बल का निर्माण" : "Building a Resilient, Stronger & Healthier Force"}
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            {isHi
              ? "स्मार्ट इंडिया हैकथॉन समस्या 26186 के अंतर्गत गृह मंत्रालय एवं भारतीय सुरक्षा बलों के कल्याण को समर्पित।"
              : "Smart India Hackathon Problem Statement 26186. Dedicated to the wellbeing and operational readiness of India's defenders."}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-xl shadow-blue-900/50 hover:scale-105 active:scale-95 transition-all"
            >
              <span>{isHi ? "मिशनवेल पोर्टल में प्रवेश करें" : "Enter MissionWell Portal"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/presentation"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/40 px-6 py-3 text-sm font-bold text-amber-300 transition-all"
            >
              <Award className="h-4 w-4" />
              <span>{isHi ? "हैकथॉन पिच डेक देखें" : "View Judge Pitch Deck"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Official Government Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="h-4 w-4 text-amber-500" />
            <span className="font-bold text-white">MissionWell AI</span>
            <span>• {isHi ? "भारत सरकार • गृह मंत्रालय (पुलिस II प्रभाग)" : "Government of India • Ministry of Home Affairs"}</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right">
            <span>24x7 Force Tele-MANAS: <strong>14416</strong> • KIRAN: <strong>1800-599-0019</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
