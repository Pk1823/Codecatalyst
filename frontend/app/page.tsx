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
  Radar,
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
  const [activeSimulationVisual, setActiveSimulationVisual] = useState<"radar" | "neural" | "command">("radar");

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

  const forcesList: { id: ForceType; label: string; location: string }[] = [
    { id: "CRPF", label: "CRPF", location: "Bastar / J&K Grid" },
    { id: "ARMY", label: "Indian Army", location: "Siachen / LoC High Altitude" },
    { id: "BSF", label: "BSF", location: "Thar Desert / Rann of Kutch" },
    { id: "ITBP", label: "ITBP", location: "Ladakh Himalayan LAC" },
    { id: "CISF", label: "CISF", location: "Aviation & Critical Hubs" },
    { id: "STATE_POLICE", label: "State Police", location: "High Density Urban Grid" },
  ];

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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
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

          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#simulator" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60">
              <Brain className="h-3.5 w-3.5 text-emerald-500" />
              <span>{isHi ? "एआई सिम्युलेटर" : "Live AI Simulator"}</span>
            </a>
            <a href="#animated-simulation" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60">
              <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span>{isHi ? "एनिमेटेड रडार" : "Animated Radar"}</span>
            </a>
            <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60">
              {isHi ? "कार्यप्रणाली" : "How It Works"}
            </a>
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60">
              {isHi ? "मुख्य क्षमताएं" : "Key Capabilities"}
            </a>
            <a href="#privacy" className="hover:text-emerald-600 dark:hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60">
              {isHi ? "गोपनीयता नीति" : "Zero-Trust Privacy"}
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Executive Pitch Deck Link Button */}
            <Link
              href="/presentation"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-500/30 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
              title="View Executive Pitch Deck & System Brief"
            >
              <Presentation className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline font-mono text-[11px]">Judge Pitch Deck</span>
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
              title={resolvedTheme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle theme appearance"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-blue-600" />
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
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isHi ? "पोर्टल प्रवेश" : "Sign In"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200 dark:border-slate-800/80 overflow-hidden bg-slate-900/5 dark:bg-[#090D16]">
        {/* Breathtaking Defense Operational Command & Himalayan Sunrise Backdrop */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="/hero-bg.jpg"
            alt="Himalayan Defense Command & Biometric Telemetry Operational Backdrop"
            className="w-full h-full object-cover object-center sm:object-[center_35%] opacity-40 dark:opacity-75 transition-opacity duration-700 select-none scale-100"
          />
          {/* Subtle Ambient Vignette & Smooth Bottom Color Blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-slate-50/40 to-slate-50 dark:from-[#090D16]/80 dark:via-[#090D16]/50 dark:to-[#090D16]" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-slate-50/60 dark:to-[#090D16]/80" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-emerald-500/15 dark:bg-emerald-600/20 blur-[140px] pointer-events-none z-0 animate-pulse-ring" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[260px] bg-teal-500/10 dark:bg-cyan-600/15 blur-[130px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Top Pill / Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isHi ? "सशस्त्र बल मानसिक स्वास्थ्य एवं कल्याण प्रणाली" : "Operational Resilience & Personnel Welfare Intelligence"}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 text-xs font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
          </div>

          {/* Value Prop Headline */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] drop-shadow-xs dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
              {isHi ? (
                <>
                  ड्यूटी तनाव और थकान की{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
                    समय रहते पहचान
                  </span>
                </>
              ) : (
                <>
                  Predictive Stress & Fatigue Intelligence for{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
                    Safer, Resilient Armed Forces
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
              {isHi
                ? "भारतीय सेना, CRPF, BSF, ITBP, CISF और राज्य पुलिस के जवानों में कठिन ड्यूटी, अनिद्रा और तैनाती तनाव को बिना किसी मेडिकल कलंक या सेवा रिकॉर्ड (ACR) पर असर डाले समय रहते पहचान कर आराम व सहायता पहुंचाता है।"
                : "MissionWell AI empowers commanders and welfare officers to identify cumulative operational fatigue, sleep deprivation, and high-stress deployments early with Anti-Masking AI—guaranteeing zero ACR/APAR career prejudice."}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>{isHi ? "मिशनवेल पोर्टल खोलें" : "Launch MissionWell Portal"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/presentation"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/15 backdrop-blur-md px-5 py-3 text-sm font-semibold text-teal-700 dark:text-teal-300 transition-all hover:scale-[1.02]"
              >
                <Presentation className="h-4 w-4" />
                <span>{isHi ? "हैकथॉन प्रेजेंटेशन डेक" : "Executive Pitch Deck"}</span>
              </Link>
              <a
                href="#animated-simulation"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 backdrop-blur-md px-5 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300 transition-all hover:scale-[1.02] shadow-xs"
              >
                <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                <span>{isHi ? "सिम्युलेटेड एनिमेटेड रडार" : "Simulated Animated Radar"}</span>
              </a>
              <a
                href="#simulator"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 px-5 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 transition-all shadow-xs"
              >
                <Sliders className="h-4 w-4 text-emerald-500" />
                <span>{isHi ? "लाइव एआई सिम्युलेटर चलाएं" : "Try Live AI Simulator"}</span>
              </a>
            </div>
          </div>

          {/* Force Selector Ribbon */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0F172A]/90 p-4 shadow-lg backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  Adaptive Force Doctrine Switcher:
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Calibrated for 6 Uniformed Services
                </span>
              </div>
              <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/20">
                Active Theatre: <strong className="font-semibold">{meta.primaryTheatre}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3">
              {forcesList.map((f) => {
                const isActive = selectedForce === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setForce(f.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 shadow-xs"
                        : "border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs font-mono">{f.label}</span>
                      {isActive && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 block">
                      {f.location}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4 Key Proof Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 text-center">
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A]/80 shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono block">
                94.2%
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mt-1">
                Anti-Masking Detection
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Cross-validated with duty logs
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A]/80 shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-cyan-400 font-mono block">
                &lt; 1.8s
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mt-1">
                Inference & SHAP Latency
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                LightGBM Decision Tree
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A]/80 shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono block">
                100%
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mt-1">
                DPDP Act 2023 Isolation
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Medical-command separation
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A]/80 shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono block">
                ZERO
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mt-1">
                ACR/APAR Career Penalty
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Non-punitive welfare doctrine
              </span>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-semibold">
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
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Quick Scenarios:</span>
              <button
                onClick={() => handleScenarioPreset("bastar")}
                className="px-3 py-1 text-xs font-mono rounded-lg border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20 transition-colors"
              >
                🔴 Bastar Naxal Grid (High Masking)
              </button>
              <button
                onClick={() => handleScenarioPreset("siachen")}
                className="px-3 py-1 text-xs font-mono rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/20 transition-colors"
              >
                ❄️ Siachen Extreme Cold (-35°C)
              </button>
              <button
                onClick={() => handleScenarioPreset("routine")}
                className="px-3 py-1 text-xs font-mono rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                🟢 Routine Peacetime Unit
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
                  <span className={`font-mono font-bold px-2.5 py-0.5 rounded border ${
                    sleepHours < 4.5
                      ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900"
                      : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 border-emerald-200 dark:border-slate-700"
                  }`}>
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
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400">
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

            {/* Right Column: Live AI Evaluation & Radar Triage (5 Cols) */}
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
                  <span className={`text-4xl sm:text-5xl font-extrabold font-mono transition-colors ${
                    simResults.score >= 70
                      ? "text-rose-600 dark:text-rose-400"
                      : simResults.score >= 45
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {simResults.score}
                  </span>
                  <span className="text-sm font-mono text-slate-500">/ 100</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase">
                  {simResults.riskBand === "HIGH" && (
                    <span className="text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 px-2.5 py-0.5 rounded-full">
                      CRITICAL RISK • Stand-down Required
                    </span>
                  )}
                  {simResults.riskBand === "MODERATE" && (
                    <span className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 px-2.5 py-0.5 rounded-full">
                      ELEVATED STRAIN • Rotational Watch
                    </span>
                  )}
                  {simResults.riskBand === "LOW" && (
                    <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 px-2.5 py-0.5 rounded-full">
                      STABLE READINESS • Routine Duty
                    </span>
                  )}
                </div>
              </div>

              {/* Anti-Masking Trigger Banner */}
              {simResults.isMaskingTriggered ? (
                <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 animate-pulse" />
                    <span>ANTI-MASKING DISCREPANCY DETECTED ({simResults.maskingConfidence}%)</span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed">
                    Jawan reported normal condition, but telemetry reveals <strong>{consecutiveDays} consecutive watch days</strong> and <strong>{sleepHours}h average sleep</strong>. Fatigue pattern masked by military toughness ethos.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
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
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${simResults.sleepDeficitImpact}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Active Combat Sector Load</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">+{simResults.sectorImpact}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${simResults.sectorImpact}%` }} />
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

          {/* Interactive Simulated Animated Image Showcase */}
          <div id="animated-simulation" className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                    {isHi ? "सिम्युलेटेड एनिमेटेड टेलीमेट्री व रडार दृश्य" : "Simulated Animated Telemetry & Radar Feeds"}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    60 FPS VECTOR ENGINE
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isHi
                    ? "लाइव 360° रडार स्वीप, न्यूरल एंटी-मास्किंग संज्ञानात्मक स्कैन और हाई-एल्टीट्यूड कमांड पोस्ट के बीच स्विच करें।"
                    : "Experience live animated 360° tactical radar sweep, cortical neuro-fatigue scan, and strategic command telemetry."}
                </p>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveSimulationVisual("radar")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    activeSimulationVisual === "radar"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  📡 Tactical Radar (Live)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSimulationVisual("neural")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    activeSimulationVisual === "neural"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  🧠 Neural Scan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSimulationVisual("command")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    activeSimulationVisual === "command"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  🛰️ Command Post
                </button>
              </div>
            </div>

            {/* Display Visual Container */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#020b0a] shadow-2xl group transition-all duration-300">
              {activeSimulationVisual === "radar" && (
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[500px] flex items-center justify-center p-2 sm:p-4">
                  <img
                    src="/simulated-radar.svg"
                    alt="Simulated Animated Tactical Radar HUD"
                    className="w-full h-full object-contain select-none"
                  />
                  <div className="absolute bottom-3 left-4 right-4 hidden sm:flex items-center justify-between text-[11px] font-mono text-emerald-400/90 bg-slate-950/80 px-3 py-1.5 rounded-lg backdrop-blur border border-emerald-500/20">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      LIVE SWEEP 360° • TARGETS: 4 UNITS
                    </span>
                    <span className="text-slate-400">
                      ECG BIOMETRIC STRAIN: 98 BPM • ANTI-MASKING: +0.76
                    </span>
                  </div>
                </div>
              )}

              {activeSimulationVisual === "neural" && (
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[500px] flex items-center justify-center p-2 sm:p-4">
                  <img
                    src="/simulated-neural-scan.svg"
                    alt="Simulated Animated Neural Scan"
                    className="w-full h-full object-contain select-none"
                  />
                  <div className="absolute bottom-3 left-4 right-4 hidden sm:flex items-center justify-between text-[11px] font-mono text-emerald-400/90 bg-slate-950/80 px-3 py-1.5 rounded-lg backdrop-blur border border-emerald-500/20">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                      SYNAPSE SIGNAL LATENCY • LIGHTGBM SHAP MAPPING
                    </span>
                    <span className="text-rose-400 font-bold">
                      ANOMALY: ETHOS SUPPRESSION DETECTED
                    </span>
                  </div>
                </div>
              )}

              {activeSimulationVisual === "command" && (
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[500px] flex items-center justify-center">
                  <img
                    src="/hero-bg.jpg"
                    alt="Simulated Command Operational Center"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-emerald-400 bg-slate-900/90 px-4 py-2.5 rounded-xl backdrop-blur border border-emerald-500/30">
                    <span className="font-bold">HIMALAYAN STRATEGIC THEATRE SECTOR 04</span>
                    <span className="text-slate-300">LIVE DEFENSE COMMAND HEADQUARTERS</span>
                  </div>
                </div>
              )}
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
              className="p-5 rounded-2xl border border-emerald-500/30 bg-white dark:bg-[#0F172A] hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 group-hover:scale-105 transition-transform">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-2 py-0.5 rounded">
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
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Enter Welfare Console</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Tactical Commander */}
            <div
              onClick={() => handleQuickLaunchRole("COMMANDER")}
              className="p-5 rounded-2xl border border-amber-500/30 bg-white dark:bg-[#0F172A] hover:border-amber-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900 group-hover:scale-105 transition-transform">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-slate-800 px-2 py-0.5 rounded">
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
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>Enter Command Brief</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Jawan / Soldier */}
            <div
              onClick={() => handleQuickLaunchRole("PERSONNEL")}
              className="p-5 rounded-2xl border border-blue-500/30 bg-white dark:bg-[#0F172A] hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-900 group-hover:scale-105 transition-transform">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-cyan-400 bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded">
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
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-cyan-400">
                <span>Enter Soldier Hub</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: System Admin */}
            <div
              onClick={() => handleQuickLaunchRole("ADMIN")}
              className="p-5 rounded-2xl border border-purple-500/30 bg-white dark:bg-[#0F172A] hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-slate-800 px-2 py-0.5 rounded">
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
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
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
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-cyan-400 bg-blue-50 dark:bg-slate-800 px-2.5 py-1 rounded border border-blue-200 dark:border-slate-700">
                    STEP 02
                  </span>
                  <Brain className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
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
                  <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-slate-800 px-2.5 py-1 rounded border border-amber-200 dark:border-slate-700">
                    STEP 03
                  </span>
                  <Zap className="h-5 w-5 text-amber-500 dark:text-amber-400" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1: Anti-Masking */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 flex gap-4 shadow-xs">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 shrink-0 h-fit">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {isHi ? "एंटी-मास्किंग तनाव पहचान" : "Anti-Masking AI Architecture"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isHi
                    ? "जवान अक्सर शारीरिक या मानसिक तनाव छिपाते हैं। हमारा मॉडल ऑब्जेक्टिव ड्यूटी घंटों और आराम के अंतराल से छिपी थकान को पहचानता है।"
                    : "Uniformed personnel rarely admit vulnerability. Cross-validation between duty logs, sleep telemetry, and survey responses uncovers hidden strain."}
                </p>
              </div>
            </div>

            {/* Pillar 2: Buddy-Pair */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 flex gap-4 shadow-xs">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-900 shrink-0 h-fit">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {isHi ? "बडी-पेयर पारस्परिक सुरक्षा" : "Operational Buddy-Pair Doctrine"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isHi
                    ? "सशस्त्र बलों की सदियों पुरानी 'जोड़ीदार' प्रथा को डिजिटल शक्ति प्रदान करता है, ताकि साथी जवान समय पर सहायता मांग सके।"
                    : "Leverages the armed forces centuries-old 'buddy pair' tradition, allowing peers to discreetly trigger rest without shame or formal reports."}
                </p>
              </div>
            </div>

            {/* Pillar 3: DPDP Zero Prejudice */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 flex gap-4 shadow-xs">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900 shrink-0 h-fit">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {isHi ? "शून्य एसीआर पूर्वग्रह गारंटी" : "Zero ACR/APAR Career Prejudice Guarantee"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isHi
                    ? "डीपीडीपी अधिनियम 2023 के तहत सभी कल्याण मूल्यांकन सेवा रिकॉर्ड से पूर्णतः अलग हैं। सहायता लेने पर कोई करियर हानि नहीं होती।"
                    : "Self-assessments and clinical counseling are cryptographically isolated under DPDP Act 2023. Welfare inputs can never impact promotional eligibility or appraisal files."}
                </p>
              </div>
            </div>

            {/* Pillar 4: Force Adaptation */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 flex gap-4 shadow-xs">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900 shrink-0 h-fit">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {isHi ? "6 वर्दीधारी सेवाओं हेतु अनुकूलित" : "6 Uniformed Services Adaptation"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isHi
                    ? "CRPF (बस्तर), सेना (सियाचिन), BSF (रेगिस्तान), ITBP (-30°C), CISF और राज्य पुलिस के अनुसार शब्द व मानक स्वतः बदलते हैं।"
                    : "Dynamically adapts unit hierarchies, terminology, and operational thresholds for CRPF, Army, BSF, ITBP, CISF, and State Police."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Section 3: Separation of Powers Privacy Matrix */}
      <section id="privacy" className="py-20 bg-white dark:bg-[#090D16] border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {isHi ? "डेटा सुरक्षा" : "Zero-Trust Confidentiality"}
            </h2>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isHi ? "कठोर डेटा विभाजन मैट्रिक्स" : "Separation of Powers Access Matrix"}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isHi
                ? "किस भूमिका को क्या डेटा दिखता है, इसका स्पष्ट व पारदर्शी नियम।"
                : "Strict role-based cryptographic isolation guarantees personnel trust and clinical privacy."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <th className="py-3 px-4 font-sans font-medium">{isHi ? "डेटा श्रेणी" : "Data Class"}</th>
                    <th className="py-3 px-4 text-center">{isHi ? "जवान" : "Jawan"}</th>
                    <th className="py-3 px-4 text-center">{isHi ? "कल्याण अधिकारी / डॉक्टर" : "Welfare Officer"}</th>
                    <th className="py-3 px-4 text-center">{isHi ? "कमांडर" : "Commander"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-900 dark:text-white">
                      {isHi ? "स्वैच्छिक चेक-इन व बडी रिपोर्ट" : "Self-Report & Buddy Feedback"}
                    </td>
                    <td className="py-3.5 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">✓ Full Access</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">✓ Care Triage</td>
                    <td className="py-3.5 px-4 text-center text-rose-600 dark:text-rose-400 font-bold">✕ BLOCKED</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-900 dark:text-white">
                      {isHi ? "चिकित्सा परामर्श नोट्स" : "Counseling Clinical Notes"}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">✓ Doctor-Only</td>
                    <td className="py-3.5 px-4 text-center text-rose-600 dark:text-rose-400 font-bold">✕ BLOCKED</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-900 dark:text-white">
                      {isHi ? "कंपनी तनाव व तत्परता सूचकांक" : "Unit Stress & Readiness Index"}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">✓ Aggregated</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">✓ Masked Summary</td>
                  </tr>
                </tbody>
              </table>
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
            <Link
              href="/presentation"
              className="inline-flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/15 px-5 py-3 text-sm font-semibold text-teal-700 dark:text-teal-300 transition-all hover:scale-[1.02]"
            >
              <Presentation className="h-4 w-4" />
              <span>{isHi ? "हैकथॉन प्रेजेंटेशन" : "Executive Pitch Deck"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Official Government & Defense Executive Footer (Dual-Mode: White Toggle & Dark Defense) */}
      <footer className="relative bg-slate-100/90 dark:bg-[#050814] text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800/80 overflow-hidden transition-colors duration-200">
        {/* Sovereign Tricolor Accent Strip */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white/80 to-emerald-500 shadow-[0_0_16px_rgba(245,158,11,0.5)]" />

        {/* Tactical Atmospheric Background Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5 dark:opacity-10 pointer-events-none mix-blend-multiply dark:mix-blend-luminosity"
          style={{ backgroundImage: "url('/tactical-command-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-tactical-grid opacity-10 dark:opacity-15 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-teal-500/10 dark:from-teal-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          {/* Top Bar: Brand & Operational Status */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-slate-200/90 dark:border-slate-800/80">
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-teal-600 to-emerald-500 p-0.5 shadow-md shadow-teal-900/20">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-slate-950/80 backdrop-blur-sm">
                  <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight">
                    MissionWell <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 font-mono">AI</span>
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-300">
                    {isHi ? "सशस्त्र बल क्षमता" : "DEFENSE READY"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium tracking-wide">
                  {isHi 
                    ? "सशस्त्र बल एवं केंद्रीय पुलिस बल कल्याण खुफिया प्रणाली • सतर्कता एवं संवेदना" 
                    : "Defense & Central Armed Police Forces Welfare Intelligence • Vigilance Through Compassion"}
                </p>
              </div>
            </div>

            {/* Live Security & Telemetry Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900/90 border border-emerald-500/30 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 shadow-xs backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{isHi ? "प्रणाली स्थिति: एयर-गैप सक्रिय" : "SYSTEM: AIR-GAP OPERATIONAL"}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/60 text-[11px] font-mono text-slate-700 dark:text-slate-300 shadow-xs backdrop-blur-md">
                <Lock className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                <span>k-ANONYMITY k≥15</span>
              </div>
            </div>
          </div>

          {/* 4-Column Executive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
            {/* Column 1: Sovereign Mandate & Legal APAR Covenant */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <Scale className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                {isHi ? "संप्रभु जनादेश" : "Sovereign Mandate"}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isHi
                  ? "भारतीय सशस्त्र बलों और सीएपीएफ (सीआरपीएफ, बीएसएफ, आईटीबीपी, सीआईएसएफ, एसएसबी, असम राइफल्स) के लिए स्वदेशी एवं गोपनीय कल्याण प्रणाली।"
                  : "Indigenous, culturally-attuned, privacy-first welfare intelligence capability engineered for Indian Armed Forces and Central Armed Police Forces."}
              </p>
              <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-slate-900/70 border border-amber-200/90 dark:border-slate-800 text-[11px] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-semibold font-mono">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{isHi ? "गैर-दंडात्मक एसीआर संरक्षण" : "Non-Punitive APAR Covenant"}</span>
                </div>
                <p className="text-amber-900/90 dark:text-slate-400 leading-relaxed text-[11px]">
                  {isHi
                    ? "कल्याण इनपुट का उपयोग कभी भी सेवा रिकॉर्ड, पदोन्नति या एपीएआर में नहीं किया जा सकता है।"
                    : "Welfare telemetry is legally firewalled and can never be utilized for ACR/APAR grading, disciplinary action, or promotion eligibility."}
                </p>
              </div>
            </div>

            {/* Column 2: Stakeholder Command Portals */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {isHi ? "कमांड पोर्टल्स" : "Command Portals"}
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link 
                    href="/commander" 
                    className="group flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-slate-900/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800/60 hover:border-blue-500/40 dark:hover:border-blue-500/30 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 group-hover:scale-125 transition-transform" />
                      {isHi ? "यूनिट कमांडर कंसोल" : "Unit Commander Console"}
                    </span>
                    <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">
                      {isHi ? "तनाव सूचकांक" : "Fatigue Metrics"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/welfare" 
                    className="group flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-slate-900/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800/60 hover:border-teal-500/40 dark:hover:border-teal-500/30 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 dark:bg-teal-400 group-hover:scale-125 transition-transform" />
                      {isHi ? "कल्याण अधिकारी कंसोल" : "Welfare Officer Console"}
                    </span>
                    <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-500/20">
                      {isHi ? "ट्राइएज कतार" : "Triage Queue"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/personnel" 
                    className="group flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-slate-900/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800/60 hover:border-emerald-500/40 dark:hover:border-emerald-500/30 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 group-hover:scale-125 transition-transform" />
                      {isHi ? "जवान गोपनीय स्व-देखभाल" : "Personnel Self-Care"}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                      {isHi ? "शून्य ट्रेस" : "Zero-Trace"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/presentation" 
                    className="group flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-slate-900/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800/60 hover:border-amber-500/40 dark:hover:border-amber-500/30 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400 group-hover:scale-125 transition-transform" />
                      {isHi ? "कार्यकारी प्रस्तुति" : "Executive Pitch Deck"}
                    </span>
                    <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/20">
                      {isHi ? "डोजियर" : "Dossier"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/privacy" 
                    className="group flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-slate-900/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800/60 hover:border-purple-500/40 dark:hover:border-purple-500/30 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 dark:bg-purple-400 group-hover:scale-125 transition-transform" />
                      {isHi ? "डीपीडीपी गोपनीयता वास्तुकला" : "DPDP Privacy Architecture"}
                    </span>
                    <span className="text-[10px] font-mono text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-500/20">
                      Zero-Trust
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Statutory & Technical Governance */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                {isHi ? "वैधानिक अनुपालन" : "Statutory Governance"}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-200 block">DPDP Act 2023 Section 8(4)</strong>
                    <span>{isHi ? "सख्त उद्देश्य-सीमित डेटा प्रोसेसिंग और सुरक्षा सीमाएं।" : "Strict purpose-limited data processing with cryptographic security boundaries."}</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-200 block">{isHi ? "गेम-थ्योरेटिक SHAP AI" : "SHAP Factor Transparency"}</strong>
                    <span>{isHi ? "ब्लैक-बॉक्स स्कोरिंग के बिना पारदर्शी मॉडल व्याख्यात्मकता।" : "Game-theoretic explainable AI attribution replaces black-box scoring for full auditability."}</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-200 block">{isHi ? "एयर-गैप सैन्य इंट्रानेट" : "Air-Gap Defense Topology"}</strong>
                    <span>{isHi ? "इंटरनेट के बिना पूर्ण परिचालन क्षमता और शून्य डेटा रिसाव।" : "Operable on sovereign defense intranets without external telemetric dependencies."}</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 4: 24x7 National Support Helplines */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                {isHi ? "24x7 आपातकालीन हेल्पलाइन" : "24x7 Force Helplines"}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isHi
                  ? "निःशुल्क, 24 घंटे मनोवैज्ञानिक सहायता। पूर्णतः गोपनीय और सैन्य पदानुक्रम से सुरक्षित।"
                  : "Toll-free, round-the-clock psychological and crisis assistance. Completely confidential and detached from command hierarchy."}
              </p>

              <div className="space-y-2">
                {/* Tele-MANAS */}
                <a 
                  href="tel:14416"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-gradient-to-r dark:from-emerald-950/40 dark:to-slate-900/80 border border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-500 transition-all group shadow-xs hover:shadow-md"
                >
                  <div>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 uppercase font-bold block">Tele-MANAS (MoHFW)</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono group-hover:text-emerald-600 dark:group-hover:text-emerald-300">14416</span>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-800 dark:text-emerald-400 bg-emerald-100/90 dark:bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                    24x7 Toll-Free
                  </span>
                </a>

                {/* KIRAN Helpline */}
                <a 
                  href="tel:18005990019"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-gradient-to-r dark:from-blue-950/40 dark:to-slate-900/80 border border-blue-200 dark:border-blue-500/30 hover:border-blue-500 transition-all group shadow-xs hover:shadow-md"
                >
                  <div>
                    <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 uppercase font-bold block">KIRAN Helpline</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono group-hover:text-blue-600 dark:group-hover:text-blue-300">1800-599-0019</span>
                  </div>
                  <span className="text-[10px] font-medium text-blue-800 dark:text-blue-400 bg-blue-100/90 dark:bg-blue-500/10 px-2 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">
                    Govt of India
                  </span>
                </a>

                {/* CRPF Madadgaar */}
                <a 
                  href="tel:14417"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-gradient-to-r dark:from-amber-950/40 dark:to-slate-900/80 border border-amber-200 dark:border-amber-500/30 hover:border-amber-500 transition-all group shadow-xs hover:shadow-md"
                >
                  <div>
                    <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 uppercase font-bold block">CRPF Madadgaar</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono group-hover:text-amber-600 dark:group-hover:text-amber-300">14417</span>
                  </div>
                  <span className="text-[10px] font-medium text-amber-800 dark:text-amber-400 bg-amber-100/90 dark:bg-amber-500/10 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-500/20">
                    CAPF Support
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Dossier & Classification Bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-teal-500 dark:bg-teal-400" />
              <span className="text-slate-900 dark:text-slate-300 font-semibold">
                {isHi ? "सशस्त्र बल एवं सीएपीएफ कल्याण पहल" : "OFFICIAL WELFARE CAPABILITY"}
              </span>
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span>MINISTRY OF HOME AFFAIRS & INDIAN ARMED FORCES</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-600 dark:text-slate-400">BUILD v1.4.2-STAC-CERTIFIED</span>
              <span className="text-slate-400 dark:text-slate-600">|</span>
              <span className="text-slate-600 dark:text-slate-400">© 2026 MissionWell AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
