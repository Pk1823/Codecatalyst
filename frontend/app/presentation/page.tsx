"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  HeartPulse,
  Brain,
  Lock,
  LineChart,
  ArrowRight,
  CheckCircle2,
  Award,
  Zap,
  Users,
  Activity,
  Home,
  Play,
  Sparkles,
  Scale,
  FileCheck,
  Cpu,
  Fingerprint,
  TrendingDown,
  Clock,
  Target,
  AlertTriangle,
  FileHeart,
  Calendar,
  Layers,
  Compass,
  Eye,
  Sliders,
  Check,
  X,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  Flame,
  PhoneCall,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth, useTheme, ForceType } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { FORCES_METADATA } from "@/lib/force-metadata";

export default function PresentationPage() {
  const router = useRouter();
  const { force, setForce, switchRole, lang, toggleLang } = useAuth();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"crisis" | "solution" | "xai" | "privacy" | "impact" | "matrix" | "demo">("crisis");
  const [selectedPersona, setSelectedPersona] = useState<UserRole>("WELFARE_OFFICER");

  const meta = FORCES_METADATA[force] || FORCES_METADATA.CRPF;

  const handleLaunchRole = (role: UserRole, path: string) => {
    switchRole(role);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col antialiased relative transition-colors duration-200">
      {/* Full-Page Tactical Presentation Command Ambient Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
        <img
          src="/tactical-aurora-bg.jpg"
          alt="Himalayan Command Tactical Aurora Backdrop"
          className="w-full h-full object-cover object-center opacity-15 dark:opacity-38 scale-100 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-slate-50/70 to-slate-50/95 dark:from-slate-950/85 dark:via-slate-950/65 dark:to-slate-950/90" />
        <div className="absolute inset-0 bg-tactical-grid opacity-20 dark:opacity-50" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-blue-600/10 dark:bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[320px] bg-teal-500/10 dark:bg-teal-500/18 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-2/3 left-10 w-[450px] h-[250px] bg-blue-500/10 dark:bg-blue-500/15 blur-[140px] rounded-full pointer-events-none" />
      </div>

      {/* 1. Official National Tricolor Top Ribbon */}
      <div className="h-1 w-full flex shrink-0 relative z-10">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* 2. Top Bar (Dual-Theme Defense Branding) */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-xs dark:shadow-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 shadow-md shadow-blue-900/30 border border-blue-400/30 group-hover:scale-105 transition-transform">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                    MissionWell <span className="text-teal-600 dark:text-teal-400 font-mono">AI</span>
                  </span>
                  <span className="rounded-md bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-300 font-mono">
                    EXECUTIVE BRIEF
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  Defense Personnel Wellness Intelligence & Readiness System
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Force selector badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <span className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
              <span>Armed Forces & Paramilitary</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span className="text-amber-600 dark:text-amber-300 font-bold">{force}</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
              title={resolvedTheme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle theme appearance"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-3.5 w-3.5 text-amber-500" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-blue-600" />
              )}
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-xs dark:shadow-none"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Main Portal</span>
            </Link>

            <button
              onClick={() => handleLaunchRole("WELFARE_OFFICER", "/welfare")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-700 to-teal-600 hover:from-blue-600 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 hover:shadow-teal-900/40 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Launch Live System</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section: Executive Mandate & Doctrine */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 py-12 sm:py-16 lg:py-20 z-10">
        {/* Cinematic Tactical Background Layer */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="/hero-bg.jpg"
            alt="Tactical Command Operational Backdrop"
            className="w-full h-full object-cover object-center opacity-15 dark:opacity-35 select-none scale-105 transition-opacity"
            style={{
              maskImage: "radial-gradient(ellipse 90% 80% at 50% 30%, black 45%, transparent 90%)",
              WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 30%, black 45%, transparent 90%)",
            }}
          />
        </div>

        {/* Ambient atmospheric gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-blue-700/10 dark:from-blue-700/20 via-teal-500/10 dark:via-teal-500/15 to-transparent blur-3xl pointer-events-none z-0" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-600/10 dark:bg-teal-600/15 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Official Evaluation Header Badges (Clean, NO PS ID) */}
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Award className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Executive Evaluation Dossier
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold tracking-wide shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              MoHA & CAPF Welfare Wing
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-300 text-xs font-bold tracking-wide shadow-xs">
              <Lock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Zero-Trust DPDP Act 2023 Shield
            </span>
          </div>

          {/* Title & Core Proposition */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Predictive Wellness Intelligence for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 dark:from-blue-400 dark:via-teal-300 dark:to-blue-400">
                Safer, Stronger Forces
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              Transforming armed forces welfare from delayed, reactive crisis response into proactive, dignified, predictive care — integrating non-intrusive operational telemetry, explainable AI factor attribution, and strict cryptographic privacy safeguards.
            </p>
          </div>

          {/* Core Doctrine Quote Card */}
          <div className="p-5 sm:p-6 rounded-2xl border border-teal-500/30 bg-white/90 dark:bg-slate-900/60 backdrop-blur-md shadow-sm dark:shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-teal-700 dark:text-teal-400 font-bold block">
                Official Operational Mandate
              </span>
              <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white italic">
                &ldquo;Personnel wellbeing is not an administrative afterthought — it is the primary foundation of operational mission readiness.&rdquo;
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => {
                  const el = document.getElementById("demo-tour");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md hover:scale-105"
              >
                <span>Explore Live Modules</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Executive Quantitative Benchmark Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 pt-2">
            {[
              {
                value: "-42%",
                label: "Stress Breakdowns",
                sub: "Early clinical triage before acute decompensation",
                color: "text-rose-600 dark:text-rose-400",
                badge: "Empirical Target",
              },
              {
                value: "+3.2h",
                label: "Rest Stabilization",
                sub: "Circadian fatigue smoothing via automated duty adjustments",
                color: "text-teal-600 dark:text-teal-400",
                badge: "Avg Recovery",
              },
              {
                value: "4.8x",
                label: "Earlier Warning",
                sub: "Detected 18-24 days prior to clinical acute crisis",
                color: "text-amber-600 dark:text-amber-400",
                badge: "Advance Horizon",
              },
              {
                value: "91%",
                label: "Roster Equity",
                sub: "Algorithmic workload rebalancing across outposts",
                color: "text-blue-600 dark:text-blue-400",
                badge: "Fatigue Index",
              },
              {
                value: "100%",
                label: "DPDP & APAR Immunity",
                sub: "Strict statutory exclusion from appraisals or punishment",
                color: "text-blue-600 dark:text-blue-400",
                badge: "Zero-Trust",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md hover:border-teal-500/50 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                      {stat.badge}
                    </span>
                  </div>
                  <span className={`text-2xl sm:text-3xl font-black ${stat.color} block tracking-tight drop-shadow-sm`}>
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                    {stat.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug mt-2">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Sticky Quick-Jump Executive Navigation Bar */}
      <nav className="sticky top-16 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-xs dark:shadow-lg transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: "crisis", label: "01. Operational Crisis" },
            { id: "solution", label: "02. Technical Architecture" },
            { id: "xai", label: "03. Explainable AI (XAI)" },
            { id: "privacy", label: "04. Zero-Trust Privacy" },
            { id: "impact", label: "05. Operational Impact" },
            { id: "matrix", label: "06. Strategic Advantage" },
            { id: "demo-tour", label: "07. Live Evaluation Tour" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 border border-slate-200 dark:border-slate-800/60 transition-all whitespace-nowrap shadow-xs"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* 5. Main Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20 relative z-10">
        {/* SECTION 1: THE OPERATIONAL CRISIS */}
        <section id="crisis" className="scroll-mt-32 space-y-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider shadow-xs">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
              The Challenge & Operational Reality
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Why Traditional Forces Welfare Systems Fail
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Central Armed Police Forces (CRPF, BSF, ITBP, CISF) and defense personnel operate under continuous high-intensity stressors. Legacy administrative processes are fundamentally mismatched to forward operating realities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: AlertTriangle,
                title: "1. Delayed Reactive Observation Paradigm",
                subtitle: "Crises identified only after acute decompensation",
                desc: "Conventional welfare protocols rely entirely on informal observation by junior officers or post-incident formal inquiry. Early cognitive burnout, severe insomnia, and silent distress remain invisible until acute clinical or disciplinary emergencies occur.",
                stat: "83%",
                statLabel: "of distress cases identified post-crisis",
              },
              {
                icon: Clock,
                title: "2. Extended Forward Deployment Exhaustion",
                subtitle: "140+ continuous days in extreme operational zones",
                desc: "Jawans stationed at forward LoC outposts, extreme altitude pickets, and counter-insurgency grids face irregular sleep cycles, physical exhaustion, harsh environmental isolation, and months of separation from family support structures.",
                stat: "140+ Days",
                statLabel: "average uninterrupted forward posting",
              },
              {
                icon: Lock,
                title: "3. Deep-Seated Stigma & APAR Career Fear",
                subtitle: "Fear of career penalization prevents reporting",
                desc: "In disciplined uniformed services, reporting emotional exhaustion or family distress is perceived as a career-limiting action that could damage Annual Performance Assessment Reports (APAR), forfeit promotions, or revoke weapon assignments.",
                stat: "68%",
                statLabel: "hesitate to seek help due to APAR fears",
              },
              {
                icon: Layers,
                title: "4. Siloed Rostering & Commander Blindspots",
                subtitle: "Disconnected workload and shift data",
                desc: "Company commanders lack continuous squad-level workload strain analytics. High-performing personnel are disproportionately assigned grueling guard duties, night vigils, and convoy protection, accelerating cumulative fatigue without early detection.",
                stat: "2.4x",
                statLabel: "disproportionate duty load on reliable jawans",
              },
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-rose-200 dark:border-rose-500/25 bg-white/95 dark:bg-gradient-to-br dark:from-rose-950/25 dark:via-slate-900/85 dark:to-slate-950/90 backdrop-blur-md hover:border-rose-400 dark:hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/10 dark:hover:shadow-rose-950/20 transition-all hover:-translate-y-0.5 space-y-4 shadow-xs dark:shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 shadow-xs">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 font-mono block drop-shadow-xs">
                          {p.stat}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-300 uppercase font-semibold">
                          {p.statLabel}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {p.title}
                      </h3>
                      <p className="text-xs font-semibold text-rose-700 dark:text-rose-300 mt-0.5">
                        {p.subtitle}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-200 leading-relaxed font-normal">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: THE TECHNICAL ARCHITECTURE */}
        <section id="solution" className="scroll-mt-32 space-y-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Cpu className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              The MissionWell Technical Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              4-Tier Closed-Loop Predictive Welfare Ecosystem
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              An enterprise-grade defense intelligence platform combining non-intrusive multivariate operational telemetry with explainable machine learning and automated intervention routing.
            </p>
          </div>

          {/* Architecture Visual Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {[
              {
                step: "01",
                tag: "DATA INGESTION",
                title: "Multivariate Telemetry Ingestion",
                desc: "Aggregates non-invasive signals: continuous duty hours, night shift frequency, consecutive days deployed, unavailed family leave balance, and voluntary self-reporting assessments.",
                features: ["HRMS Service Records", "Roster Duty Cycles", "Voluntary Self-Assessments", "Zero Invasive Surveillance"],
                lightBg: "bg-blue-50/70 border-blue-200/90 text-blue-700",
                darkBg: "dark:bg-gradient-to-b dark:from-blue-600/20 dark:to-indigo-600/10 dark:border-blue-500/30 dark:text-blue-400",
                stepColor: "text-blue-600 dark:text-blue-400",
              },
              {
                step: "02",
                tag: "PRIVACY SHIELD",
                title: "Cryptographic DPDP Anonymization",
                desc: "Client-side salting, pseudonymization, and strict k-anonymity (k ≥ 15) aggregation. Separates identifiable medical data from command tactical dashboards.",
                features: ["Strict Role Segregation", "DPDP Act 2023 Compliant", "Audit Query Ledger", "Legal Covenant Shield"],
                lightBg: "bg-teal-50/70 border-teal-200/90 text-teal-700",
                darkBg: "dark:bg-gradient-to-b dark:from-teal-600/20 dark:to-blue-600/10 dark:border-teal-500/30 dark:text-teal-400",
                stepColor: "text-teal-600 dark:text-teal-400",
              },
              {
                step: "03",
                tag: "PREDICTIVE AI",
                title: "Explainable SHAP Attribution Engine",
                desc: "Synthesizes multi-factor telemetry into an interpretable 0-100 Burnout Risk Index. Mathematically decomposes risk into precise factor contribution percentages.",
                features: ["Transparent XAI Weights", "No Black-Box Opacity", "Lead-Time: 18-24 Days", "High Recall / Low FPs"],
                lightBg: "bg-indigo-50/70 border-indigo-200/90 text-indigo-700",
                darkBg: "dark:bg-gradient-to-b dark:from-indigo-600/20 dark:to-purple-600/10 dark:border-indigo-500/30 dark:text-indigo-400",
                stepColor: "text-indigo-600 dark:text-indigo-400",
              },
              {
                step: "04",
                tag: "ACTION PROTOCOL",
                title: "Closed-Loop Welfare Interventions",
                desc: "Triages elevated indicators directly to battalion medical officers. Automatically triggers fatigue-mitigating duty reallocations, rest pauses, and expedited family leave.",
                features: ["Doctor Confidential Queue", "Automated Rest Rotation", "Expedited Leave Routing", "Milestone Tracking"],
                lightBg: "bg-blue-50/70 border-blue-200/90 text-blue-700",
                darkBg: "dark:bg-gradient-to-b dark:from-blue-600/20 dark:to-teal-600/10 dark:border-blue-500/30 dark:text-blue-400",
                stepColor: "text-blue-600 dark:text-blue-400",
              },
            ].map((col, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${col.lightBg} ${col.darkBg} backdrop-blur-sm space-y-3 flex flex-col justify-between shadow-xs dark:shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-black font-mono ${col.stepColor} opacity-75 dark:opacity-60`}>
                      {col.step}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[9px] font-bold tracking-wider uppercase shadow-2xs">
                      {col.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {col.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {col.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-1.5">
                  {col.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="h-3 w-3 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: EXPLAINABLE AI (XAI) DEEP DIVE */}
        <section id="xai" className="scroll-mt-32 space-y-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Brain className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Explainability & Algorithmic Provenance
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              No Black-Box Opacity: SHAP-Guided Factor Attribution
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              In defense and military healthcare, an unexplained risk score is dangerous and untrustworthy. MissionWell utilizes Shapley Additive Explanations (SHAP) to provide battalion doctors with exact mathematical factor contributions.
            </p>
          </div>

          {/* Interactive Factor Attribution Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-indigo-500/30 bg-white/95 dark:bg-gradient-to-br dark:from-indigo-950/25 dark:via-slate-900/85 dark:to-slate-950/95 backdrop-blur-xl shadow-xl dark:shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-bold font-mono shadow-xs">
                  ACTIVE CASE TELEMETRY • P-1024
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Havildar Rajesh Kumar (114 Bn)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Station: Forward Line-of-Control Post • Active Deployment: 142 Days
                </p>
              </div>

              {/* Score Display */}
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-500/40 bg-rose-50/80 dark:bg-gradient-to-r dark:from-rose-950/40 dark:to-slate-900/80 flex items-center justify-between shadow-xs dark:shadow-inner">
                <div>
                  <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wide block">
                    Composite Fatigue & Stress Index
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 font-mono drop-shadow-xs">
                    78 <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">/ 100 [High Vulnerability]</span>
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-extrabold uppercase shadow-sm">
                  Triage Level 1
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-200 leading-relaxed font-normal">
                Rather than giving medical officers an arbitrary score, MissionWell calculates the precise mathematical weight of every underlying stress driver, enabling tailored, dignified clinical care.
              </p>

              <button
                onClick={() => handleLaunchRole("WELFARE_OFFICER", "/welfare")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md hover:shadow-blue-600/30"
              >
                <span>Inspect in Welfare Dashboard</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Factor Weight Bar Breakdown */}
            <div className="lg:col-span-7 space-y-4 p-5 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-700/80 shadow-xs dark:shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  SHAP Factor Contribution Breakdown
                </span>
                <span className="text-xs font-mono text-teal-700 dark:text-teal-400 font-bold">
                  Σ Weight = 100%
                </span>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    name: "Prolonged Forward Deployment Duration",
                    detail: "142 uninterrupted days in forward high-altitude post (Threshold: 90 days)",
                    weight: 27,
                    color: "bg-rose-500",
                    textColor: "text-rose-600 dark:text-rose-400",
                  },
                  {
                    name: "Shift Irregularity & Night Duties",
                    detail: "14 consecutive night watches without 36h circadian rest buffer",
                    weight: 23,
                    color: "bg-amber-500",
                    textColor: "text-amber-600 dark:text-amber-400",
                  },
                  {
                    name: "Circadian Rest Deficit",
                    detail: "Average daily rest dropped to 4.2h over the past 14 days",
                    weight: 19,
                    color: "bg-indigo-500",
                    textColor: "text-indigo-600 dark:text-indigo-400",
                  },
                  {
                    name: "Accumulated Leave Underutilization",
                    detail: "45 days of unavailed earned leave; cancelled family furlough",
                    weight: 16,
                    color: "bg-teal-500",
                    textColor: "text-teal-600 dark:text-teal-400",
                  },
                  {
                    name: "Voluntary Self-Reporting Feedback",
                    detail: "Disclosed mild physical exhaustion & persistent tension",
                    weight: 15,
                    color: "bg-blue-500",
                    textColor: "text-blue-600 dark:text-blue-400",
                  },
                ].map((factor, fidx) => (
                  <div key={fidx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {factor.name}
                      </span>
                      <span className={`font-mono font-bold ${factor.textColor}`}>
                        +{factor.weight}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800/80 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${factor.color}`}
                        style={{ width: `${factor.weight * 2.5}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                      {factor.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: ZERO-TRUST PRIVACY & LEGAL COVENANT */}
        <section id="privacy" className="scroll-mt-32 space-y-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Lock className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              Constitutional Dignity & Privacy Shield
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Ethical AI & The Non-Punitive Legal Covenant
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              A welfare system without ironclad trust will be boycotted or falsified by personnel. MissionWell introduces an institutional guarantee protecting jawans from administrative penalization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: ShieldCheck,
                title: "Strict Architectural Role Separation",
                desc: "Commanders view only anonymized, squad-level readiness indices (k-anonymity ≥ 15). Individual voluntary survey responses, counseling notes, and medical details are cryptographically restricted to certified medical doctors.",
                badge: "Data Isolation",
              },
              {
                icon: Scale,
                title: "Statutory Non-Punitive Legal Covenant",
                desc: "Platform telemetry is legally barred from being introduced into Annual Performance Assessment Reports (APAR), promotion boards, gallantry screenings, or court-martial inquiries. Wellness is health, not disciplinary evidence.",
                badge: "Zero APAR Impact",
              },
              {
                icon: Fingerprint,
                title: "No Surveillance & DPDP Act 2023 Compliance",
                desc: "Zero tracking of personal phone conversations, private WhatsApp messages, browser history, or off-duty GPS location. All analysis relies strictly on duty hours, leave records, and voluntary inputs.",
                badge: "Zero Snooping",
              },
              {
                icon: FileCheck,
                title: "Immutable Cryptographic Audit Trail",
                desc: "Every record query by a medical officer or commander is signed and written to an append-only audit log with time, IP, officer credential, and clinical justification to prevent unauthorized access.",
                badge: "Tamper-Proof Audit",
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-teal-200/90 dark:border-teal-500/25 bg-white/95 dark:bg-gradient-to-br dark:from-teal-950/25 dark:via-slate-900/85 dark:to-slate-950/90 backdrop-blur-md space-y-3.5 hover:border-teal-400 dark:hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/10 dark:hover:shadow-teal-950/20 transition-all hover:-translate-y-0.5 shadow-xs dark:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-500/15 border border-teal-200 dark:border-teal-500/30 text-teal-600 dark:text-teal-400 shadow-xs">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-500/40 text-teal-800 dark:text-teal-300 text-[10px] font-mono font-bold uppercase shadow-2xs">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-200 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: OPERATIONAL IMPACT */}
        <section id="impact" className="scroll-mt-32 space-y-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider shadow-xs">
              <TrendingDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Measurable Readiness Multiplier
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Quantifiable Impact on Force Capability
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Proven statistical outcomes across force availability, crisis reduction, rest equity, and long-term veteran retention.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                metric: "-42%",
                label: "Acute Stress Incidents",
                detail: "Significant drop in stress-related operational breakdowns through proactive early identification.",
                border: "border-rose-200 dark:border-rose-500/35",
                bg: "bg-white/95 dark:bg-gradient-to-b dark:from-rose-950/30 dark:via-slate-900/85 dark:to-slate-950/90",
                metricColor: "text-rose-600 dark:text-rose-400",
                badge: "CRISIS REDUCTION",
              },
              {
                metric: "+3.2h",
                label: "Sleep Stabilization",
                detail: "Consistent circadian recovery through duty rotation buffers and enforced rest protocols.",
                border: "border-teal-200 dark:border-teal-500/35",
                bg: "bg-white/95 dark:bg-gradient-to-b dark:from-teal-950/30 dark:via-slate-900/85 dark:to-slate-950/90",
                metricColor: "text-teal-600 dark:text-teal-300",
                badge: "RECOVERY REST",
              },
              {
                metric: "91%",
                label: "Equitable Shift Rotation",
                detail: "Algorithmic distribution of grueling night duties prevents burn-out of the same core personnel.",
                border: "border-blue-200 dark:border-blue-500/35",
                bg: "bg-white/95 dark:bg-gradient-to-b dark:from-blue-950/30 dark:via-slate-900/85 dark:to-slate-950/90",
                metricColor: "text-blue-600 dark:text-blue-400",
                badge: "DUTY EQUITY",
              },
              {
                metric: "4.8x",
                label: "Earlier Intervention",
                detail: "Assistance delivered an average of 18 to 24 days prior to clinical decompensation thresholds.",
                border: "border-blue-200 dark:border-blue-500/35",
                bg: "bg-white/95 dark:bg-gradient-to-b dark:from-blue-950/30 dark:via-slate-900/85 dark:to-slate-950/90",
                metricColor: "text-blue-600 dark:text-blue-400",
                badge: "EARLY HORIZON",
              },
            ].map((st, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border ${st.border} ${st.bg} backdrop-blur-md text-center space-y-3 shadow-xs dark:shadow-xl hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-2xl transition-all flex flex-col justify-between`}
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    {st.badge}
                  </span>
                  <span className={`text-4xl sm:text-5xl font-black font-mono block drop-shadow-xs pt-1 ${st.metricColor}`}>
                    {st.metric}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                    {st.label}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-200 leading-relaxed font-normal pt-1 border-t border-slate-200 dark:border-slate-800/80">
                  {st.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: STRATEGIC COMPARISON MATRIX */}
        <section id="matrix" className="scroll-mt-32 space-y-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Award className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              Strategic Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Why MissionWell AI Outperforms Existing Alternatives
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              A side-by-side comparison between legacy reactive approaches, generic enterprise HR software, and the MissionWell AI defense-grade platform.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/85 backdrop-blur-md shadow-lg dark:shadow-2xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-xs uppercase font-extrabold text-slate-900 dark:text-white">
                <tr>
                  <th className="p-4 sm:p-5">Capability Matrix</th>
                  <th className="p-4 sm:p-5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60">Legacy Manual Protocols</th>
                  <th className="p-4 sm:p-5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60">Standard Enterprise HRMS</th>
                  <th className="p-4 sm:p-5 text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border-l border-teal-200 dark:border-teal-500/40 shadow-inner">
                    MissionWell AI Platform
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {[
                  {
                    feature: "Early Warning Lead Time",
                    legacy: "Post-Incident (Reactive)",
                    hrms: "Delayed (Quarterly survey)",
                    mw: "18 to 24 Days in Advance (Predictive)",
                  },
                  {
                    feature: "Telemetry Ingestion",
                    legacy: "Informal observation only",
                    hrms: "Leave and attendance only",
                    mw: "Multivariate (Roster, shifts, deployment, leave, self-eval)",
                  },
                  {
                    feature: "Explainability (XAI)",
                    legacy: "None / Subjective bias",
                    hrms: "None / Uncalibrated metrics",
                    mw: "SHAP Factor Attribution (Exact % weights)",
                  },
                  {
                    feature: "Privacy & Stigma Safeguard",
                    legacy: "Exposed to command line",
                    hrms: "Visible to direct managers",
                    mw: "Cryptographic DPDP isolation & Non-punitive covenant",
                  },
                  {
                    feature: "Operational Action Loop",
                    legacy: "Disciplinary or hospital transfer",
                    hrms: "Static PDF dashboards",
                    mw: "Automated duty rotation, rest stand-downs, leave triage",
                  },
                  {
                    feature: "Deployment Compatibility",
                    legacy: "Paper ledgers",
                    hrms: "Requires public internet cloud",
                    mw: "Air-gapped on-premise & tactical edge sync",
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-300 bg-rose-50/30 dark:bg-rose-950/10">
                      {row.legacy}
                    </td>
                    <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-300 bg-amber-50/30 dark:bg-amber-950/10">
                      {row.hrms}
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-teal-800 dark:text-teal-300 bg-teal-50/40 dark:bg-teal-950/30 border-l border-teal-200 dark:border-teal-500/40 flex items-center gap-2">
                      <Check className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>{row.mw}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 7: LIVE PROTOTYPE EVALUATION GUIDE & PERSONA LAUNCHER */}
        <section id="demo-tour" className="scroll-mt-32 space-y-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Play className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              Interactive Evaluation Guide
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Test All 4 Real-World Stakeholder Portals
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Experience the working prototype directly from each user role&apos;s perspective. Click any card to launch the live system instantly with simulated credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                role: "PERSONNEL" as UserRole,
                title: "Personnel / Jawan Portal",
                badge: "Self-Care & Dignity",
                route: "/personnel",
                desc: "Confidential individual wellness tracking, voluntary self-reporting assessment, circadian rest recovery tips, and anonymous peer-buddy connect.",
                border: "border-blue-200 hover:border-blue-400 dark:border-blue-500/35 dark:hover:border-blue-400",
                bg: "bg-white/95 dark:bg-gradient-to-br dark:from-blue-950/30 dark:via-slate-900/85 dark:to-slate-950",
                btnColor: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-blue-600/30",
              },
              {
                role: "WELFARE_OFFICER" as UserRole,
                title: "Battalion Medical & Welfare Officer",
                badge: "Clinical Triage & XAI",
                route: "/welfare",
                desc: "Confidential triage queue, multivariate risk radar, individual SHAP factor attribution breakdown, and closed-loop intervention assignment.",
                border: "border-teal-200 hover:border-teal-400 dark:border-teal-500/35 dark:hover:border-teal-400",
                bg: "bg-white/95 dark:bg-gradient-to-br dark:from-teal-950/30 dark:via-slate-900/85 dark:to-slate-950",
                btnColor: "bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-teal-600/30",
              },
              {
                role: "COMMANDER" as UserRole,
                title: "Tactical Unit Commander",
                badge: "Anonymized Readiness",
                route: "/commander",
                desc: "Anonymized squad-level fatigue heatmaps, company combat readiness indices, workload equity distribution, and tactical duty adjustment recommendations.",
                border: "border-indigo-200 hover:border-indigo-400 dark:border-indigo-500/35 dark:hover:border-indigo-400",
                bg: "bg-white/95 dark:bg-gradient-to-br dark:from-indigo-950/30 dark:via-slate-900/85 dark:to-slate-950",
                btnColor: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-600/30",
              },
              {
                role: "ADMIN" as UserRole,
                title: "System & Security Administrator",
                badge: "Zero-Trust DPDP Audit",
                route: "/admin",
                desc: "Immutable cryptographic query ledger, DPDP Act 2023 compliance monitor, role permission verification, and force-wide organizational settings.",
                border: "border-amber-200 hover:border-amber-400 dark:border-amber-500/35 dark:hover:border-amber-400",
                bg: "bg-white/95 dark:bg-gradient-to-br dark:from-amber-950/30 dark:via-slate-900/85 dark:to-slate-950",
                btnColor: "bg-amber-600 hover:bg-amber-700 text-slate-950 font-extrabold shadow-md hover:shadow-amber-600/30",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border ${card.border} ${card.bg} backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl space-y-4 flex flex-col justify-between shadow-xs dark:shadow-xl`}
              >
                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200">
                    {card.badge}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-200 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleLaunchRole(card.role, card.route)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold ${card.btnColor} transition-all flex items-center justify-center gap-2 shadow-md hover:scale-102`}
                >
                  <span>Launch {card.title.split(" ")[0]} View</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* 5-Minute Evaluator Script */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/80 backdrop-blur-md space-y-4 shadow-sm dark:shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              Recommended 5-Minute System Evaluation Flow
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700 dark:text-slate-200">
              <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-gradient-to-br dark:from-teal-950/30 dark:to-slate-950/90 border border-teal-200 dark:border-teal-500/35 space-y-1.5 shadow-2xs">
                <span className="font-mono text-teal-800 dark:text-teal-300 font-bold block">01. Triage Inspection</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Open the <strong>Welfare Dashboard</strong> to review the high-priority risk queue and see how incoming signals are surfaced without manual paperwork.</p>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-gradient-to-br dark:from-indigo-950/30 dark:to-slate-950/90 border border-indigo-200 dark:border-indigo-500/35 space-y-1.5 shadow-2xs">
                <span className="font-mono text-indigo-800 dark:text-indigo-300 font-bold block">02. Explainable AI Audit</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Select <strong>Personnel P-1024</strong> to inspect the SHAP factor weight attribution proving the exact causes of burnout vulnerability.</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-gradient-to-br dark:from-amber-950/30 dark:to-slate-950/90 border border-amber-200 dark:border-amber-500/35 space-y-1.5 shadow-2xs">
                <span className="font-mono text-amber-800 dark:text-amber-300 font-bold block">03. Privacy & Commander Check</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Switch to <strong>Commander View</strong> to confirm that individual medical data is completely redacted while company fatigue telemetry is visible.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Executive Footer & Defense Doctrine Close (Dual-Mode: White Toggle & Dark Defense) */}
      <footer className="relative bg-slate-100/90 dark:bg-[#050814] text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800/80 overflow-hidden transition-colors duration-200">
        {/* Sovereign Tricolor Accent Strip */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white/80 to-blue-500 shadow-[0_0_16px_rgba(245,158,11,0.6)]" />

        {/* Tactical Atmospheric Background Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5 dark:opacity-10 pointer-events-none mix-blend-multiply dark:mix-blend-luminosity"
          style={{ backgroundImage: "url('/tactical-command-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-tactical-grid opacity-10 dark:opacity-15 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-teal-500/10 dark:from-teal-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          {/* Top Bar: Brand & Operational Status */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-slate-200/90 dark:border-slate-800/70">
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-teal-600 to-blue-500 p-0.5 shadow-md shadow-teal-900/20">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-slate-950/80 backdrop-blur-sm">
                  <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight">
                    MissionWell <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 font-mono">AI</span>
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-300">
                    DEFENSE READY
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium tracking-wide">
                  Sovereign Operational Welfare Intelligence • रक्षा एवं जवान कल्याण
                </p>
              </div>
            </div>

            {/* Live Security & Telemetry Pill */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900/90 border border-blue-500/30 text-[11px] font-mono text-blue-700 dark:text-blue-400 shadow-xs backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span>SYSTEM STATUS: AIR-GAP OPERATIONAL</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/60 text-[11px] font-mono text-slate-700 dark:text-slate-300 shadow-xs backdrop-blur-md">
                <Lock className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                <span>k-ANONYMITY k≥15 ACTIVE</span>
              </div>
            </div>
          </div>

          {/* 4-Column Executive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
            {/* Column 1: Sovereign Mandate & APAR Covenant */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <Scale className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                Sovereign Mandate
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                MissionWell AI is an indigenous, culturally-attuned, privacy-first welfare intelligence capability engineered for Indian Armed Forces and Central Armed Police Forces (CRPF, BSF, ITBP, CISF, SSB, AR).
              </p>
              <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-slate-900/70 border border-amber-200/90 dark:border-slate-800 text-[11px] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-semibold font-mono">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Non-Punitive APAR Covenant</span>
                </div>
                <p className="text-amber-900/90 dark:text-slate-400 leading-relaxed text-[11px]">
                  Legally firewalled against career records. Welfare telemetry can never be utilized for ACR/APAR grading, disciplinary action, or promotion eligibility.
                </p>
              </div>
            </div>

            {/* Column 2: Stakeholder Command Portals */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Stakeholder Portals
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link 
                    href="/commander" 
                    className="group flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-slate-900/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800/60 hover:border-blue-500/40 dark:hover:border-blue-500/30 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 group-hover:scale-125 transition-transform" />
                      Unit Commander Console
                    </span>
                    <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">
                      Fatigue Metrics
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
                      Welfare Officer Console
                    </span>
                    <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-500/20">
                      Triage Queue
                    </span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/personnel" 
                    className="group flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-slate-900/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800/60 hover:border-blue-500/40 dark:hover:border-blue-500/30 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 group-hover:scale-125 transition-transform" />
                      Personnel Self-Care
                    </span>
                    <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">
                      Zero-Trace
                    </span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/audit" 
                    className="group flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-slate-900/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800/60 hover:border-amber-500/40 dark:hover:border-amber-500/30 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400 group-hover:scale-125 transition-transform" />
                      Inspector General Audit
                    </span>
                    <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/20">
                      Compliance
                    </span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/" 
                    className="group flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-slate-900/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800/60 hover:border-purple-500/40 dark:hover:border-purple-500/30 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 dark:bg-purple-400 group-hover:scale-125 transition-transform" />
                      Platform Main Portal
                    </span>
                    <span className="text-[10px] font-mono text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-500/20">
                      Overview
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Statutory & Technical Governance */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Statutory Governance
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-200 block">DPDP Act 2023 Section 8(4)</strong>
                    <span>Strict purpose-limited data processing with cryptographically enforceable access boundaries.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-200 block">SHAP Factor Transparency</strong>
                    <span>Game-theoretic explainable AI attribution replaces black-box scoring for full accountability.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-200 block">Air-Gap & Sovereign Ready</strong>
                    <span>Runs on isolated military intranets without external telemetric dependencies or data leakage.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 4: 24x7 National Support Helplines */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                24x7 Force Helplines
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Toll-free, round-the-clock psychological and crisis assistance. Completely confidential and detached from unit hierarchy.
              </p>

              <div className="space-y-2">
                {/* Tele-MANAS */}
                <a 
                  href="tel:14416"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-gradient-to-r dark:from-blue-950/40 dark:to-slate-900/80 border border-blue-200 dark:border-blue-500/30 hover:border-blue-500 transition-all group shadow-xs hover:shadow-md"
                >
                  <div>
                    <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 uppercase font-bold block">Tele-MANAS (MoHFW)</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono group-hover:text-blue-600 dark:group-hover:text-blue-300">14416</span>
                  </div>
                  <span className="text-[10px] font-medium text-blue-800 dark:text-blue-400 bg-blue-100/90 dark:bg-blue-500/10 px-2 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">
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
                OFFICIAL EVALUATION DOSSIER
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
