"use client";

import React, { useState, useId, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  HeartPulse,
  Lock,
  ArrowRight,
  Activity,
  CheckCircle2,
  Users,
  Scale,
  ChevronRight,
  Award,
  PhoneCall,
  Brain,
  Layers,
  FileCheck,
  ShieldCheck,
  Zap,
  TrendingUp,
  TrendingDown,
  UserCheck,
  Sun,
  Moon,
  Sparkles,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Presentation,
  Compass,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useAuth, useTheme, ForceType } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { FORCES_METADATA } from "@/lib/force-metadata";
import { AuthService } from "@/services/auth.service";

export default function LandingPage() {
  const router = useRouter();
  const { force, setForce, switchRole, lang, toggleLang } = useAuth();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const isHi = lang === "hi";

  // Force selection
  const selectedForce = force || "CRPF";
  const meta = FORCES_METADATA[selectedForce] || FORCES_METADATA.CRPF;

  // -------------------------------------------------------------
  // Interactive Anti-Masking AI Simulator State
  // -------------------------------------------------------------
  const [consecutiveDays, setConsecutiveDays] = useState<number>(128);
  const [sleepHours, setSleepHours] = useState<number>(3.8);
  const [selfReportVal, setSelfReportVal] = useState<number>(2); // 1 = Normal/Fit (Masked), 2 = Normal, 3 = Stressed
  const [sectorTension, setSectorTension] = useState<"routine" | "elevated" | "active">("active");

  // Dynamic simulation calculations
  const simResults = useMemo(() => {
    // Base stress calculated from objective duty hours & sleep deficit
    let daysStrain = Math.min(consecutiveDays * 0.45, 55);
    let sleepDeficit = Math.max((6.5 - sleepHours) * 8.5, 0);
    let sectorFactor = sectorTension === "active" ? 18 : sectorTension === "elevated" ? 10 : 3;

    let rawScore = Math.round(daysStrain + sleepDeficit + sectorFactor);
    let compositeScore = Math.min(Math.max(rawScore, 18), 98);

    // Anti-masking calculation:
    // When objective strain is high (>60) but self-report is low (1 or 2, claiming 'all good')
    const isMaskingTriggered = compositeScore >= 60 && selfReportVal <= 2;
    const maskingConfidence = isMaskingTriggered ? Math.min(72 + (compositeScore - 60) * 0.8, 96) : 0;

    let riskBand: "LOW" | "MODERATE" | "HIGH" = "LOW";
    if (compositeScore >= 70) riskBand = "HIGH";
    else if (compositeScore >= 45) riskBand = "MODERATE";

    return {
      score: compositeScore,
      riskBand,
      isMaskingTriggered,
      maskingConfidence: Math.round(maskingConfidence),
      daysStrainImpact: Math.round((daysStrain / compositeScore) * 100) || 35,
      sleepDeficitImpact: Math.round((sleepDeficit / compositeScore) * 100) || 30,
      sectorImpact: Math.round((sectorFactor / compositeScore) * 100) || 20,
    };
  }, [consecutiveDays, sleepHours, selfReportVal, sectorTension]);

  const handleScenarioPreset = (preset: "bastar" | "siachen" | "routine") => {
    if (preset === "bastar") {
      setForce("CRPF");
      setConsecutiveDays(145);
      setSleepHours(3.4);
      setSelfReportVal(1); // 'All fit' - strong masking
      setSectorTension("active");
    } else if (preset === "siachen") {
      setForce("ARMY");
      setConsecutiveDays(110);
      setSleepHours(4.2);
      setSelfReportVal(2);
      setSectorTension("active");
    } else {
      setForce("CISF");
      setConsecutiveDays(24);
      setSleepHours(6.8);
      setSelfReportVal(2);
      setSectorTension("routine");
    }
  };

  const handleQuickLaunchRole = (role: UserRole) => {
    switchRole(role);
    const dest = AuthService.getRedirectPathForRole(role);
    router.push(dest);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:text-emerald-300 flex flex-col font-sans transition-colors duration-200">
      {/* 1. National Tricolor Strip */}
      <div className="h-1.5 w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* 2. Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#090D16]/85 backdrop-blur-xl shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  MissionWell <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">AI</span>
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[9px] uppercase font-mono font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                Ministry of Home Affairs • CAPF Directorate
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#simulator" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60">
              {isHi ? "एआई सिम्युलेटर" : "Live AI Simulator"}
            </a>
            <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60">
              {isHi ? "कार्यप्रणाली" : "How It Works"}
            </a>
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60">
              {isHi ? "मुख्य क्षमताएं" : "Key Capabilities"}
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
              title={resolvedTheme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle theme appearance"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-3.5 w-3.5 text-slate-300" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-slate-700" />
              )}
            </button>

            {/* Bilingual Switcher */}
            <button
              onClick={toggleLang}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
              title="Toggle English / हिन्दी"
            >
              {isHi ? "EN" : "हिन्दी"}
            </button>

            <Link
              href="/login"
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <HeartPulse className="h-3.5 w-3.5" />
              <span>{isHi ? "जवान पोर्टल" : "Personnel"}</span>
            </Link>

            <Link
              href="/login/admin"
              className="inline-flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isHi ? "कमांड पोर्टल" : "Command"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Hero Section - Enlarged Scale & Spacious Tactical Presence */}
      <section className="relative py-20 sm:py-28 lg:py-36 min-h-[75vh] flex items-center justify-center border-b border-slate-200 dark:border-slate-800/80 overflow-hidden bg-slate-900/5 dark:bg-[#090D16]">
        {/* Breathtaking Defense Operational Command & Himalayan Sunrise Backdrop */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="/hero-bg.jpg"
            alt="Himalayan Defense Command & Biometric Telemetry Operational Backdrop"
            className="w-full h-full object-cover object-center sm:object-[center_35%] opacity-40 dark:opacity-75 transition-opacity duration-700 select-none scale-100"
          />
          {/* Subtle Ambient Vignette & Smooth Bottom Color Blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/85 via-slate-50/40 to-slate-50 dark:from-[#090D16]/85 dark:via-[#090D16]/50 dark:to-[#090D16]" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-slate-50/60 dark:to-[#090D16]/80" />
        </div>

        {/* Ambient Emerald Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 dark:bg-emerald-600/15 blur-[150px] pointer-events-none z-0 animate-pulse-ring" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-10 my-auto">

          {/* Value Prop Headline */}
          <div className="text-center max-w-5xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] drop-shadow-xs dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
              {isHi ? (
                <>
                  ड्यूटी तनाव और थकान की{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    समय रहते पहचान
                  </span>
                </>
              ) : (
                <>
                  Predictive Stress & Fatigue Intelligence for{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Safer, Resilient Armed Forces
                  </span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
              {isHi
                ? "भारतीय सेना, CRPF, BSF, ITBP, CISF और राज्य पुलिस के जवानों में कठिन ड्यूटी, अनिद्रा और तैनाती तनाव को बिना किसी मेडिकल कलंक या सेवा रिकॉर्ड (ACR) पर असर डाले समय रहते पहचान कर आराम व सहायता पहुंचाता है।"
                : "MissionWell AI empowers commanders and welfare officers to identify cumulative operational fatigue, sleep deprivation, and high-stress deployments early with Anti-Masking AI—guaranteeing zero ACR/APAR career prejudice."}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <HeartPulse className="h-5 w-5" />
                <span>{isHi ? "सैनिक / जवान पोर्टल" : "Personnel Portal"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login/admin"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-slate-100 shadow-lg shadow-slate-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Shield className="h-5 w-5 text-emerald-400" />
                <span>{isHi ? "कमांड एवं वेलफेयर पोर्टल" : "Command & Officer Portal"}</span>
              </Link>
              <a
                href="#simulator"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 px-5 py-3.5 text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 transition-all shadow-xs"
              >
                <Sliders className="h-4 w-4 text-emerald-500" />
                <span>{isHi ? "लाइव एआई सिम्युलेटर चलाएं" : "Try Live AI Simulator"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Live Anti-Masking AI Stress Simulator */}
      <section id="simulator" className="relative py-20 bg-slate-50/60 dark:bg-[#090D16] border-b border-slate-200 dark:border-slate-800/80 overflow-hidden">
        {/* Digital Defense Mesh Topography Backdrop */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="/tactical-aurora-bg.jpg"
            alt="Digital Defense Topography Backdrop"
            className="w-full h-full object-cover object-center opacity-[0.08] dark:opacity-[0.22] transition-opacity duration-700 select-none scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50/80 to-slate-50 dark:from-[#090D16] dark:via-[#090D16]/80 dark:to-[#090D16]" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wide">
              <Brain className="h-3.5 w-3.5" />
              <span>INTERACTIVE MACHINE LEARNING ENGINE DEMO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isHi ? "लाइव एंटी-मास्किंग एआई परीक्षण कंसोल" : "Live Anti-Masking AI Triage Simulator"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isHi
                ? "स्लाइडर्स को हिलाकर देखें कि कैसे हमारा एआई मॉडल सैन्य कठोरता के कारण तनाव छिपाने (मास्किंग) वाले जवानों के वास्तविक खतरे को समय रहते पहचानता है।"
                : "Interact with the sliders below to test how our explainable LightGBM AI detects fatigue patterns—especially when personnel downplay distress due to military toughness ethos."}
            </p>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Quick Scenarios:</span>
              <button
                onClick={() => handleScenarioPreset("bastar")}
                className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Bastar Sector (High Masking)
              </button>
              <button
                onClick={() => handleScenarioPreset("siachen")}
                className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Siachen (-35°C Altitude)
              </button>
              <button
                onClick={() => handleScenarioPreset("routine")}
                className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Routine Peacetime Unit
              </button>
            </div>
          </div>

          {/* Interactive Console Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Sliders & Telemetry Inputs (7 Cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0F172A] p-6 shadow-md space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono">
                    Operational Telemetry Parameters
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Target Force: <strong className="text-emerald-600 dark:text-emerald-400">{selectedForce}</strong>
                </span>
              </div>

              {/* Slider 1: Consecutive Outpost Days */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    1. Consecutive Forward Deployment Days:
                  </span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-slate-700">
                    {consecutiveDays} Days continuous
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="180"
                  step="1"
                  value={consecutiveDays}
                  onChange={(e) => setConsecutiveDays(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <span>10d (Base standard)</span>
                  <span>90d (Fatigue threshold)</span>
                  <span>180d (Critical fatigue)</span>
                </div>
              </div>

              {/* Slider 2: Sleep Average */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    2. Rolling 5-Day Average Sleep:
                  </span>
                  <span className="font-mono font-bold px-2.5 py-0.5 rounded border text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    {sleepHours} Hours / night
                  </span>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="8.0"
                  step="0.1"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <span>2.5 hrs (Severe deprivation)</span>
                  <span>5.0 hrs (Marginal)</span>
                  <span>8.0 hrs (Restful)</span>
                </div>
              </div>

              {/* Slider 3: Jawan Masked Self-Report */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    3. Jawan Self-Reported Response (Ethos Masking):
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {selfReportVal === 1
                      ? "Level 1: 'All Normal / Fit' (Masked)"
                      : selfReportVal === 2
                      ? "Level 2: 'Moderate Duty Load'"
                      : "Level 3: 'Heavy Strain Admitted'"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setSelfReportVal(1)}
                    className={`py-2 px-3 rounded-lg border text-center transition-all ${
                      selfReportVal === 1
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    1. &quot;All Normal&quot; (Masked)
                  </button>
                  <button
                    onClick={() => setSelfReportVal(2)}
                    className={`py-2 px-3 rounded-lg border text-center transition-all ${
                      selfReportVal === 2
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    2. &quot;Manageable&quot;
                  </button>
                  <button
                    onClick={() => setSelfReportVal(3)}
                    className={`py-2 px-3 rounded-lg border text-center transition-all ${
                      selfReportVal === 3
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    3. &quot;Severe Fatigue&quot;
                  </button>
                </div>
              </div>

              {/* Slider 4: Sector Tension Level */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                  4. Operational Theatre Tension Level:
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(["routine", "elevated", "active"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSectorTension(lvl)}
                      className={`py-2 px-3 rounded-lg border capitalize text-center transition-all ${
                        sectorTension === lvl
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {lvl === "routine" ? "Routine Standby" : lvl === "elevated" ? "Heightened Alert" : "Active Ops / Combat"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live AI Evaluation & Risk Triage (5 Cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-xl space-y-5 relative overflow-hidden">
              {/* Top Status */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Model Inference Output
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-slate-700">
                  SHAP Explainer Live
                </span>
              </div>

              {/* Stress Score Gauge */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 p-4 text-center space-y-2">
                <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Composite Stress Risk Score
                </span>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className={`text-4xl sm:text-5xl font-extrabold font-mono transition-colors text-slate-800 dark:text-slate-200`}>
                    {simResults.score}
                  </span>
                  <span className="text-sm font-mono text-slate-500">/ 100</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase">
                  {simResults.riskBand === "HIGH" && (
                    <span className="text-slate-900 dark:text-slate-100 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2.5 py-0.5 rounded-full">
                      CRITICAL RISK • Stand-down Required
                    </span>
                  )}
                  {simResults.riskBand === "MODERATE" && (
                    <span className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2.5 py-0.5 rounded-full">
                      ELEVATED STRAIN • Rotational Watch
                    </span>
                  )}
                  {simResults.riskBand === "LOW" && (
                    <span className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-full">
                      STABLE READINESS • Routine Duty
                    </span>
                  )}
                </div>
              </div>

              {/* Anti-Masking Trigger Banner */}
              {simResults.isMaskingTriggered ? (
                <div className="p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-slate-700 dark:text-slate-300 animate-pulse" />
                    <span>ANTI-MASKING DISCREPANCY DETECTED ({simResults.maskingConfidence}%)</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    Jawan reported normal condition, but telemetry reveals <strong>{consecutiveDays} consecutive watch days</strong> and <strong>{sleepHours}h average sleep</strong>. Fatigue pattern masked by military toughness ethos.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <span>Telemetry & Self-Report Consistent</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    No anti-masking divergence identified. Self-assessment correlates with operational hours.
                  </p>
                </div>
              )}

              {/* SHAP Feature Contribution Bars */}
              <div className="space-y-2 text-xs">
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 block">
                  Top SHAP Explainability Attribution Drivers:
                </span>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Continuous Deployment Days</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">+{simResults.daysStrainImpact}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${simResults.daysStrainImpact}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Sleep Deficit / Shift Irregularity</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">+{simResults.sleepDeficitImpact}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500/80 h-full rounded-full" style={{ width: `${simResults.sleepDeficitImpact}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Active Combat Sector Load</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">+{simResults.sectorImpact}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-slate-500 dark:bg-slate-600 h-full rounded-full" style={{ width: `${simResults.sectorImpact}%` }} />
                  </div>
                </div>
              </div>

              {/* Automated Non-Punitive Welfare Recommendation */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  Automated Non-Punitive Triage Recommendation:
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {simResults.score >= 70
                    ? "Mandatory 48-Hour Outpost Stand-Down & Peer Buddy Decompression. Zero ACR/APAR Career Penalty."
                    : simResults.score >= 45
                    ? "Schedule Rotational Rest Interval & Voluntary Peer Check-in within 5 days."
                    : "Maintain routine wellness cadence and scheduled rest rotations."}
                </p>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* 5. Judge's 1-Click Persona Quick Launcher */}
      <section className="py-14 bg-slate-50/70 dark:bg-[#090D16] border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              OPERATIONAL EVALUATION DIRECT SHORTCUTS
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Instant 1-Click Persona Portals
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Experience the complete defense hierarchy. Click any persona to automatically authenticate and open their designated terminal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Welfare Officer */}
            <div
              onClick={() => handleQuickLaunchRole("WELFARE_OFFICER")}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-emerald-200 dark:border-slate-700">
                    PRIMARY CARE
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Welfare Officer Hub
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Manage individual risk dossiers, clinical interventions, and proactive duty pacing rotas.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                <span>Enter Welfare Console</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Tactical Commander */}
            <div
              onClick={() => handleQuickLaunchRole("COMMANDER")}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    TACTICAL AGGREGATE
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Tactical Commander
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Battalion-level stress heatmaps, operational readiness metrics, and PII-masked unit telemetry.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                <span>Enter Command Brief</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Jawan / Soldier */}
            <div
              onClick={() => handleQuickLaunchRole("PERSONNEL")}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    VOLUNTARY & BUDDY
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Jawan / Soldier Portal
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  7-step confidential self-assessment, buddy watch, and direct support intake with zero stigma.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                <span>Enter Soldier Hub</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: System Admin */}
            <div
              onClick={() => handleQuickLaunchRole("ADMIN")}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    DPDP AUDIT LEDGER
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  System Admin
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Cryptographic access ledger, DPDP Act 2023 compliance auditing, and system health status.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                <span>Enter Admin Console</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 1: How It Works in 3 Simple Steps */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-[#090D16] border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {isHi ? "कार्यप्रणाली" : "Operational Continuum"}
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isHi ? "3 सरल चरणों में समय पर मानवीय सहायता" : "From Early Warning to Proactive Welfare"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isHi
                ? "प्रणाली जवानों के आत्म-सम्मान और पूर्ण गोपनीयता की रक्षा करते हुए समयबद्ध सहायता सुनिश्चित करती है।"
                : "A dignified continuum that transforms reactive breakdown into proactive, non-stigmatizing welfare."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0F172A] p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-2.5 py-1 rounded border border-emerald-200 dark:border-slate-700">
                    STEP 01
                  </span>
                  <HeartPulse className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isHi ? "स्वैच्छिक व बडी चेक-इन" : "Voluntary & Buddy Check-in"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isHi
                    ? "जवान 7-चरण त्वरित स्व-मूल्यांकन करते हैं या उनका बडी साथी (जोड़ीदार) बिना किसी डर के विश्राम की अनुशंसा कर सकता है।"
                    : "Jawans submit quick voluntary self-checks, or their assigned buddy flags when peer rest, family leave, or decompression is needed."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                ✓ Confidential & non-punitive
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0F172A] p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-2.5 py-1 rounded border border-emerald-200 dark:border-slate-700">
                    STEP 02
                  </span>
                  <Brain className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isHi ? "एंटी-मास्किंग एआई विश्लेषण" : "Anti-Masking AI Triage"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isHi
                    ? "एआई मॉडल लंबे कठिन दिनों (जैसे 120+ दिन फॉरवर्ड ड्यूटी) और अनिद्रा के संकेतों का पारदर्शी विश्लेषण करता है।"
                    : "The explainable LightGBM AI detects fatigue patterns even when jawans attempt to downplay distress due to military toughness ethos."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                ✓ Transparent SHAP explainability
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0F172A] p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-2.5 py-1 rounded border border-emerald-200 dark:border-slate-700">
                    STEP 03
                  </span>
                  <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isHi ? "सक्रिय विश्राम व रोटेशन" : "Proactive Rest & Rotation"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isHi
                    ? "कल्याण अधिकारी व कमांडर तनाव बढ़ने से पूर्व ही जवान को रोटेशनल लीव या डीकंप्रेशन विश्राम प्रदान करते हैं।"
                    : "Welfare Officers dispatch rotational leave, counseling, or outpost decompression before burnout becomes acute."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                ✓ Non-punitive duty rotation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section 2: Key Capabilities (4 Core Pillars) */}
      <section id="features" className="py-20 bg-slate-50/50 dark:bg-[#090D16] border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {isHi ? "मुख्य क्षमताएं" : "Core Architectural Pillars"}
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isHi ? "सैन्य एवं पुलिस संस्कृति के अनुकूल" : "Engineered for Armed Forces & Police Culture"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isHi
                ? "कठिन भौगोलिक क्षेत्रों और निरंतर अभियानों में तैनात जवानों की वास्तविक जरूरतों के आधार पर विकसित।"
                : "Built around the operational realities of high-altitude frontiers, counter-insurgency grids, and high-density shifts."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1: Anti-Masking */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 flex items-center gap-3.5 shadow-xs hover:border-emerald-500/60 transition-all">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 shrink-0">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {isHi ? "एंटी-मास्किंग तनाव पहचान" : "Anti-Masking AI Architecture"}
              </h4>
            </div>

            {/* Pillar 2: Buddy-Pair */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 flex items-center gap-3.5 shadow-xs hover:border-emerald-500/60 transition-all">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {isHi ? "बडी-पेयर पारस्परिक सुरक्षा" : "Operational Buddy-Pair Doctrine"}
              </h4>
            </div>

            {/* Pillar 3: DPDP Zero Prejudice */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 flex items-center gap-3.5 shadow-xs hover:border-emerald-500/60 transition-all">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {isHi ? "शून्य एसीआर पूर्वग्रह गारंटी" : "Zero ACR/APAR Career Prejudice Guarantee"}
              </h4>
            </div>

            {/* Pillar 4: Force Adaptation */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 flex items-center gap-3.5 shadow-xs hover:border-emerald-500/60 transition-all">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 shrink-0">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {isHi ? "6 वर्दीधारी सेवाओं हेतु अनुकूलित" : "6 Uniformed Services Adaptation"}
              </h4>
            </div>
          </div>
        </div>
      </section>


      {/* 9. Final Call to Action */}
      <section className="relative py-20 bg-slate-50/70 dark:bg-[#090D16] text-center border-b border-slate-200 dark:border-slate-800/80 overflow-hidden">
        {/* Backdrop Glow & Panoramic Silhouette */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="/hero-bg.jpg"
            alt="Mission Readiness Operational Backdrop"
            className="w-full h-full object-cover object-bottom opacity-20 dark:opacity-35 transition-opacity duration-700 select-none scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50/95 via-slate-50/80 to-slate-50/95 dark:from-[#090D16]/95 dark:via-[#090D16]/85 dark:to-[#090D16]/95" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white mx-auto shadow-lg shadow-emerald-600/25">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isHi ? "सशक्त, स्वस्थ एवं तत्पर सुरक्षा बल" : "Personnel Wellbeing is Mission Readiness"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            {isHi
              ? "सशस्त्र बलों एवं पुलिस कर्मियों के निरंतर मानवीय कल्याण एवं सामरिक तत्परता को समर्पित।"
              : "Dedicated to the proactive health, resilience, and operational readiness of India's defenders."}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isHi ? "पोर्टल में प्रवेश करें" : "Access MissionWell Portal"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>
        </div>
      </section>

      {/* Simple & User-Friendly Footer */}
      <footer className="relative bg-white dark:bg-[#070B14] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Main Footer Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Brand & Purpose */}
            <div className="space-y-1.5 max-w-md">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                  MissionWell <span className="text-emerald-600 dark:text-emerald-400 font-mono">AI</span>
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                  {isHi ? "गोपनीय एवं सुरक्षित" : "Confidential & Non-Punitive"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isHi
                  ? "सशस्त्र बलों एवं पुलिस कर्मियों के निरंतर मानसिक स्वास्थ्य, मानवीय कल्याण एवं तत्परता को समर्पित मंच।"
                  : "Dedicated to the proactive health, mental resilience, and operational readiness of defense personnel."}
              </p>
            </div>

            {/* Quick Navigation Links */}
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium">
              <Link href="/login" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {isHi ? "पोर्टल लॉगिन" : "Portal Login"}
              </Link>
              <Link href="/commander" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {isHi ? "कमांडर कंसोल" : "Commander"}
              </Link>
              <Link href="/welfare" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {isHi ? "कल्याण अधिकारी" : "Welfare Officer"}
              </Link>
              <Link href="/personnel" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {isHi ? "जवान स्व-देखभाल" : "Personnel"}
              </Link>
              <Link href="/presentation" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {isHi ? "प्रस्तुति" : "Presentation"}
              </Link>
              <Link href="/privacy" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {isHi ? "गोपनीयता नीति" : "Privacy & DPDP"}
              </Link>
            </nav>
          </div>

          {/* 24x7 Helplines Strip */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
              <PhoneCall className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{isHi ? "24x7 निःशुल्क एवं गोपनीय हेल्पलाइन:" : "24x7 Confidential Helplines:"}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <a href="tel:14416" className="text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors">
                Tele-MANAS: <span className="text-emerald-600 dark:text-emerald-400">14416</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <a href="tel:18005990019" className="text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors">
                KIRAN: <span className="text-emerald-600 dark:text-emerald-400">1800-599-0019</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <a href="tel:14417" className="text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors">
                Madadgaar: <span className="text-emerald-600 dark:text-emerald-400">14417</span>
              </a>
            </div>
          </div>

          {/* Bottom Copyright & Guarantee */}
          <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isHi ? "शून्य एसीआर/एपीएआर पूर्वाग्रह गारंटी • पूर्णतः सुरक्षित डेटा" : "Zero APAR / ACR Career Linkage Guarantee • 100% Confidential"}</span>
            </div>
            <div>
              <span>© {new Date().getFullYear()} MissionWell AI. {isHi ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
