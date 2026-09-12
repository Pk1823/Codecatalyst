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
  Smartphone,
  QrCode,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth, useTheme, ForceType } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { FORCES_METADATA } from "@/lib/force-metadata";
import { AuthService } from "@/services/auth.service";
import { WebsiteQRCode } from "@/components/common/website-qr-code";
import { BrandIcon } from "@/components/common/brand-logo";

export default function LandingPage() {
  const router = useRouter();
  const { force, setForce, switchRole, lang, toggleLang } = useAuth();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const isHi = lang === "hi";
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

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
    <div className="relative min-h-screen bg-slate-50/40 dark:bg-[#090D16]/40 text-slate-900 dark:text-slate-100 selection:bg-blue-500/20 selection:text-blue-700 dark:selection:text-blue-300 flex flex-col font-sans transition-colors duration-200">
      {/* Sticky Fixed Tactical Backdrop Image across whole Home Page with Blur Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <img
          src="/hero-bg.jpg"
          alt="Himalayan Defense Command & Biometric Telemetry Operational Backdrop"
          className="w-full h-full object-cover object-center blur-[3px] scale-105 opacity-35 dark:opacity-75 transition-opacity duration-700 select-none"
        />
        {/* Soft, translucent overlay tailored for both Light (White) & Dark themes */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-slate-50/55 to-slate-50/85 dark:from-[#090D16]/80 dark:via-[#090D16]/55 dark:to-[#090D16]/85 backdrop-blur-xs" />
      </div>

      {/* 1. National Tricolor Strip */}
      <div className="relative z-10 h-1.5 w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* 2. Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#090D16]/90 backdrop-blur-xl shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3.5 group">
            <BrandIcon size="md" animate={true} />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white">
                  MissionWell{" "}
                  <span className="text-blue-600 dark:text-blue-400 font-mono text-sm sm:text-base font-bold">
                    AI
                  </span>
                </span>
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <span className="text-[10px] sm:text-[11px] uppercase font-mono font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                Ministry of Home Affairs • CAPF Directorate
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#simulator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60">
              {isHi ? "एआई सिम्युलेटर" : "Live AI Simulator"}
            </a>
            <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60">
              {isHi ? "कार्यप्रणाली" : "How It Works"}
            </a>
            <a href="#features" className="hover:text-blue-600 dark:hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60">
              {isHi ? "मुख्य क्षमताएं" : "Key Capabilities"}
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* User-Friendly Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
              title={resolvedTheme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle theme appearance"
            >
              {resolvedTheme === "dark" ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
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

            {/* Soldier Mobile App Trigger */}
            <button
              onClick={() => setIsMobileModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold shadow-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Smartphone className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isHi ? "सैनिक मोबाइल ऐप" : "Soldier App"}</span>
            </button>

            {/* Officer & Command Login */}
            <Link
              href="/login/admin"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>{isHi ? "कमांड व अधिकारी पोर्टल" : "Command Portal"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Hero Section - Perfectly Balanced & User Friendly Full Viewport */}
      <section className="relative min-h-[85vh] lg:min-h-[calc(100vh-68px)] flex flex-col items-center justify-center border-b border-slate-200 dark:border-slate-800/80 overflow-hidden py-14 lg:py-20 z-10">

        {/* Ambient Emerald Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-600/15 blur-[150px] pointer-events-none z-0 animate-pulse-ring" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 my-auto text-center">

          {/* Value Prop Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] drop-shadow-xs dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
              {isHi ? (
                <>
                  ड्यूटी तनाव और थकान की{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    समय रहते पहचान
                  </span>
                </>
              ) : (
                <>
                  Predictive Stress & Fatigue Intelligence for{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    Safer, Resilient Armed Forces
                  </span>
                </>
              )}
            </h1>

            {/* Crisp 1-Line Value Sub-headline */}
            <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {isHi
                ? "सशस्त्र बलों एवं पुलिस कर्मियों हेतु एआई-आधारित मानसिक स्वास्थ्य व सामरिक तत्परता प्रणाली।"
                : "AI-powered proactive stress detection & non-punitive welfare intelligence for defense personnel."}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
            <Link
              href="/login/admin"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 sm:px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Shield className="h-4.5 w-4.5 text-blue-200" />
              <span>{isHi ? "कमांड व अधिकारी पोर्टल" : "Command & Officer Portal"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setIsMobileModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 sm:px-7 py-3.5 text-sm font-semibold text-slate-100 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Smartphone className="h-4.5 w-4.5 text-emerald-400" />
              <span>{isHi ? "सैनिक मूल्यांकन (मोबाइल ऐप)" : "Soldier Assessment (Mobile App)"}</span>
            </button>
            <a
              href="#simulator"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 px-5 py-3.5 text-sm font-medium text-slate-800 dark:text-slate-200 transition-all shadow-xs"
            >
              <Sliders className="h-4 w-4 text-blue-500" />
              <span>{isHi ? "एआई सिम्युलेटर" : "Try AI Simulator"}</span>
            </a>
          </div>

          {/* User-Friendly Floating Trust Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
              <Lock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              100% DPDP Act Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Zero ACR Career Prejudice
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Anti-Masking LightGBM Engine
            </span>
          </div>
        </div>
      </section>

      {/* 4. Abstract Interactive Anti-Masking AI Simulator */}
      <section id="simulator" className="relative py-14 bg-slate-50/20 dark:bg-[#090D16]/30 backdrop-blur-xs border-b border-slate-200/60 dark:border-slate-800/60 overflow-hidden z-10">
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isHi ? "लाइव एंटी-मास्किंग एआई परीक्षण" : "Anti-Masking AI Engine"}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {isHi ? "वास्तविक ड्यूटी डेटा और रिपोर्ट के अंतर का लाइव विश्लेषण" : "Detects covert fatigue when operational strain is masked under service ethos."}
            </p>

            {/* Scenarios Preset Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={() => handleScenarioPreset("bastar")}
                className="px-3 py-1 text-xs font-mono rounded-lg border border-blue-500/40 bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 transition-colors shadow-xs"
              >
                Bastar (High Masking)
              </button>
              <button
                onClick={() => handleScenarioPreset("siachen")}
                className="px-3 py-1 text-xs font-mono rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:border-blue-500/40 transition-colors shadow-xs"
              >
                Siachen (Altitude Stress)
              </button>
              <button
                onClick={() => handleScenarioPreset("routine")}
                className="px-3 py-1 text-xs font-mono rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:border-blue-500/40 transition-colors shadow-xs"
              >
                Peacetime (Normal)
              </button>
            </div>
          </div>

          {/* Abstract Interactive Console Card */}
          <div className="rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-xl p-6 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: 2 Sliders + 1 Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-mono uppercase font-bold text-slate-700 dark:text-slate-300">
                  Telemetry Inputs
                </span>
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Live Sensor Feed
                </span>
              </div>

              {/* Slider 1: Consecutive Days */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Continuous Forward Deployment:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {consecutiveDays} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="180"
                  step="1"
                  value={consecutiveDays}
                  onChange={(e) => setConsecutiveDays(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Slider 2: Sleep Average */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Night Sleep Average:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {sleepHours} hrs
                  </span>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="8.0"
                  step="0.1"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Ethos Masking Pill Toggle */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs text-slate-600 dark:text-slate-400 block">Jawan Self-Report (Ethos):</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setSelfReportVal(1)}
                    className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                      selfReportVal <= 2
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-bold"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Reported &quot;Fit / All Good&quot;
                  </button>
                  <button
                    onClick={() => setSelfReportVal(3)}
                    className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                      selfReportVal === 3
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-bold"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Reported &quot;Fatigued&quot;
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Abstract AI Gauge & Divergence Output */}
            <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#090D16] p-5 text-center space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  AI Composite Risk Output
                </span>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                    {simResults.score}
                  </span>
                  <span className="text-xs font-mono text-slate-500">/ 100</span>
                </div>
                <span className="inline-block text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full mt-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {simResults.riskBand === "HIGH" ? "CRITICAL RISK" : simResults.riskBand === "MODERATE" ? "ELEVATED STRAIN" : "STABLE"}
                </span>
              </div>

              {/* Abstract Anti-masking Alert */}
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-left text-xs">
                {simResults.isMaskingTriggered ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>Divergence Detected ({simResults.maskingConfidence}%)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Jawan reported normal condition, but telemetry exposes severe cumulative duty deficit.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Telemetry correlates with self-assessment</span>
                  </div>
                )}
              </div>

              {/* 2 Abstract SHAP Micro-Bars */}
              <div className="space-y-1.5 text-left text-xs font-mono pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Continuous Outpost Load</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">+{simResults.daysStrainImpact}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${simResults.daysStrainImpact}%` }} />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Sleep Deficit Impact</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">+{simResults.sleepDeficitImpact}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div className="bg-blue-500/70 h-full rounded-full transition-all duration-300" style={{ width: `${simResults.sleepDeficitImpact}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Judge's 1-Click Persona Quick Launcher */}
      <section className="py-14 bg-slate-50/20 dark:bg-[#090D16]/30 backdrop-blur-xs border-b border-slate-200/60 dark:border-slate-800/60 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              OPERATIONAL EVALUATION DIRECT SHORTCUTS
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Instant 1-Click Persona Portals
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Welfare Officer */}
            <div
              onClick={() => handleQuickLaunchRole("WELFARE_OFFICER")}
              className="p-5 rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-xl hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 group-hover:scale-105 transition-transform">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-200 dark:border-slate-700">
                    PRIMARY CARE
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Welfare Officer Hub
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Manage individual risk dossiers, clinical interventions, and proactive duty pacing rotas.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <span>Enter Welfare Console</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Tactical Commander */}
            <div
              onClick={() => handleQuickLaunchRole("COMMANDER")}
              className="p-5 rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-xl hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 group-hover:scale-105 transition-transform">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    TACTICAL AGGREGATE
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Tactical Commander
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Battalion-level stress heatmaps, operational readiness metrics, and PII-masked unit telemetry.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <span>Enter Command Brief</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Jawan / Soldier */}
            <div
              onClick={() => handleQuickLaunchRole("PERSONNEL")}
              className="p-5 rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-xl hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 group-hover:scale-105 transition-transform">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    VOLUNTARY & BUDDY
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Jawan / Soldier Portal
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  7-step confidential self-assessment, buddy watch, and direct support intake with zero stigma.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <span>Enter Soldier Hub</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: System Admin */}
            <div
              onClick={() => handleQuickLaunchRole("ADMIN")}
              className="p-5 rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-xl hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    DPDP AUDIT LEDGER
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  System Admin
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Cryptographic access ledger, DPDP Act 2023 compliance auditing, and system health status.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <span>Enter Admin Console</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 1: How It Works in 3 Simple Steps */}
      <section id="how-it-works" className="py-20 bg-slate-50/20 dark:bg-[#090D16]/30 backdrop-blur-xs border-b border-slate-200/60 dark:border-slate-800/60 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {isHi ? "कार्यप्रणाली" : "Operational Continuum"}
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isHi ? "3 सरल चरणों में समय पर मानवीय सहायता" : "From Early Warning to Proactive Welfare"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-xl p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:border-blue-500/50 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 px-2.5 py-1 rounded border border-blue-200 dark:border-slate-700">
                    STEP 01
                  </span>
                  <HeartPulse className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isHi ? "स्वैच्छिक व बडी चेक-इन" : "Voluntary & Buddy Check-in"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {isHi
                    ? "जवान 7-चरण त्वरित स्व-मूल्यांकन करते हैं या उनका बडी साथी (जोड़ीदार) बिना किसी डर के विश्राम की अनुशंसा कर सकता है।"
                    : "Jawans submit quick voluntary self-checks, or their assigned buddy flags when peer rest, family leave, or decompression is needed."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-mono font-semibold">
                ✓ Confidential & non-punitive
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-xl p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:border-blue-500/50 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 px-2.5 py-1 rounded border border-blue-200 dark:border-slate-700">
                    STEP 02
                  </span>
                  <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isHi ? "एंटी-मास्किंग एआई विश्लेषण" : "Anti-Masking AI Triage"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {isHi
                    ? "एआई मॉडल लंबे कठिन दिनों (जैसे 120+ दिन फॉरवर्ड ड्यूटी) और अनिद्रा के संकेतों का पारदर्शी विश्लेषण करता है।"
                    : "The explainable LightGBM AI detects fatigue patterns even when jawans attempt to downplay distress due to military toughness ethos."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-mono font-semibold">
                ✓ Transparent SHAP explainability
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-xl p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:border-blue-500/50 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 px-2.5 py-1 rounded border border-blue-200 dark:border-slate-700">
                    STEP 03
                  </span>
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isHi ? "सक्रिय विश्राम व रोटेशन" : "Proactive Rest & Rotation"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {isHi
                    ? "कल्याण अधिकारी व कमांडर तनाव बढ़ने से पूर्व ही जवान को रोटेशनल लीव या डीकंप्रेशन विश्राम प्रदान करते हैं।"
                    : "Welfare Officers dispatch rotational leave, counseling, or outpost decompression before burnout becomes acute."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-mono font-semibold">
                ✓ Non-punitive duty rotation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section 2: Key Capabilities (4 Core Pillars) */}
      <section id="features" className="py-20 bg-slate-50/20 dark:bg-[#090D16]/30 backdrop-blur-xs border-b border-slate-200/60 dark:border-slate-800/60 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {isHi ? "मुख्य क्षमताएं" : "Core Architectural Pillars"}
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isHi ? "सैन्य एवं पुलिस संस्कृति के अनुकूल" : "Engineered for Armed Forces & Police Culture"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1: Anti-Masking */}
            <div className="rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-xl p-5 flex items-center gap-3.5 shadow-md hover:border-blue-500/60 hover:shadow-xl transition-all">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 shrink-0">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {isHi ? "एंटी-मास्किंग तनाव पहचान" : "Anti-Masking AI Architecture"}
              </h4>
            </div>

            {/* Pillar 2: Buddy-Pair */}
            <div className="rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-xl p-5 flex items-center gap-3.5 shadow-md hover:border-blue-500/60 hover:shadow-xl transition-all">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {isHi ? "बडी-पेयर पारस्परिक सुरक्षा" : "Operational Buddy-Pair Doctrine"}
              </h4>
            </div>

            {/* Pillar 3: DPDP Zero Prejudice */}
            <div className="rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-xl p-5 flex items-center gap-3.5 shadow-md hover:border-blue-500/60 hover:shadow-xl transition-all">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {isHi ? "शून्य एसीआर पूर्वग्रह गारंटी" : "Zero ACR/APAR Career Prejudice Guarantee"}
              </h4>
            </div>

            {/* Pillar 4: Force Adaptation */}
            <div className="rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-xl p-5 flex items-center gap-3.5 shadow-md hover:border-blue-500/60 hover:shadow-xl transition-all">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 shrink-0">
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
      <section className="relative py-20 bg-slate-50/20 dark:bg-[#090D16]/30 backdrop-blur-xs text-center border-b border-slate-200/60 dark:border-slate-800/60 overflow-hidden z-10">
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white mx-auto shadow-lg shadow-blue-600/25">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isHi ? "सशक्त, स्वस्थ एवं तत्पर सुरक्षा बल" : "Personnel Wellbeing is Mission Readiness"}
          </h2>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                <BrandIcon size="sm" />
                <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                  MissionWell <span className="text-blue-600 dark:text-blue-400 font-mono">AI</span>
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
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
              <Link href="/login" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {isHi ? "पोर्टल लॉगिन" : "Portal Login"}
              </Link>
              <Link href="/commander" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {isHi ? "कमांडर कंसोल" : "Commander"}
              </Link>
              <Link href="/welfare" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {isHi ? "कल्याण अधिकारी" : "Welfare Officer"}
              </Link>
              <Link href="/personnel" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {isHi ? "जवान स्व-देखभाल" : "Personnel"}
              </Link>
              <Link href="/presentation" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {isHi ? "प्रस्तुति" : "Presentation"}
              </Link>
              <Link href="/privacy" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {isHi ? "गोपनीयता नीति" : "Privacy & DPDP"}
              </Link>
            </nav>
          </div>

          {/* Website QR Code Mobile Portal Access Card */}
          <div className="pt-2">
            <WebsiteQRCode variant="footer" />
          </div>

          {/* 24x7 Helplines Strip */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
              <PhoneCall className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{isHi ? "24x7 निःशुल्क एवं गोपनीय हेल्पलाइन:" : "24x7 Confidential Helplines:"}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <a href="tel:14416" className="text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
                Tele-MANAS: <span className="text-blue-600 dark:text-blue-400">14416</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <a href="tel:18005990019" className="text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
                KIRAN: <span className="text-blue-600 dark:text-blue-400">1800-599-0019</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <a href="tel:14417" className="text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
                Madadgaar: <span className="text-blue-600 dark:text-blue-400">14417</span>
              </a>
            </div>
          </div>

          {/* Bottom Copyright & Guarantee */}
          <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isHi ? "शून्य एसीआर/एपीएआर पूर्वाग्रह गारंटी • पूर्णतः सुरक्षित डेटा" : "Zero APAR / ACR Career Linkage Guarantee • 100% Confidential"}</span>
            </div>
            <div>
              <span>© {new Date().getFullYear()} MissionWell AI. {isHi ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Dedicated Soldier Mobile App Assessment Modal */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-[#0B132B] p-6 sm:p-7 shadow-2xl text-slate-100 space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setIsMobileModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isHi ? "सैनिक मूल्यांकन केवल मोबाइल ऐप पर" : "Soldier Assessment (Mobile App Only)"}
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  DPDP Act 2023 • Non-Punitive ACR Isolation
                </span>
              </div>
            </div>

            {/* Privacy Notice Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-amber-400 text-xs">
                <Shield className="h-3.5 w-3.5" />
                <span>{isHi ? "गोपनीयता नीति दिशानिर्देश:" : "Statutory Privacy Mandate:"}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isHi
                  ? "गृह मंत्रालय एवं रक्षा प्रोटोकॉल के तहत सैनिकों का दैनिक तनाव मूल्यांकन केवल उनके व्यक्तिगत मोबाइल ऐप पर ही हो सकता है, ताकि कार्यस्थल पर सहकर्मियों या कमांड द्वारा कोई निगरानी न हो सके।"
                  : "Under Ministry of Home Affairs & DPDP directives, personnel self-assessments are strictly isolated to soldiers' personal mobile devices to guarantee biometric confidentiality and prevent command-level stigma."}
              </p>
            </div>

            {/* QR Code Canvas */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="p-3 rounded-xl bg-white shadow-md">
                <QRCodeSVG
                  value="http://192.168.1.30:8081"
                  size={140}
                  level="H"
                  fgColor="#0F172A"
                  bgColor="#FFFFFF"
                />
              </div>
              <div className="text-center space-y-0.5">
                <p className="text-xs font-semibold text-slate-200">
                  {isHi ? "फोन कैमरे अथवा Expo Go से स्कैन करें" : "Scan with Phone Camera or Expo Go"}
                </p>
                <p className="text-[10px] font-mono text-slate-400">
                  exp://192.168.1.30:8081
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <a
                href="http://localhost:8081/personnel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>{isHi ? "मोबाइल वेब ऐप प्रीव्यू खोलें (Port 8081)" : "Open Mobile Web App Preview (Port 8081)"}</span>
              </a>
              <button
                onClick={() => setIsMobileModalOpen(false)}
                className="w-full py-2 px-4 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
              >
                {isHi ? "बंद करें" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
