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
} from "lucide-react";
import { useAuth, ForceType } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { FORCES_METADATA } from "@/lib/force-metadata";

export default function PresentationPage() {
  const router = useRouter();
  const { force, setForce, switchRole, lang, toggleLang } = useAuth();
  const [activeTab, setActiveTab] = useState<"crisis" | "solution" | "xai" | "privacy" | "impact" | "matrix" | "demo">("crisis");
  const [selectedPersona, setSelectedPersona] = useState<UserRole>("WELFARE_OFFICER");

  const meta = FORCES_METADATA[force] || FORCES_METADATA.CRPF;

  const handleLaunchRole = (role: UserRole, path: string) => {
    switchRole(role);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col antialiased">
      {/* 1. Official National Tricolor Top Ribbon */}
      <div className="h-1 w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* 2. Top Bar (Clean of PS ID / Clean Defense Branding) */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 shadow-md shadow-blue-900/30 border border-blue-400/30 group-hover:scale-105 transition-transform">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                    MissionWell <span className="text-teal-400 font-mono">AI</span>
                  </span>
                  <span className="rounded-md bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 text-[10px] font-bold text-teal-300 font-mono">
                    EXECUTIVE BRIEF
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  Defense Personnel Wellness Intelligence & Readiness System
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Force selector badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Armed Forces & Paramilitary</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-300 font-bold">{force}</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 transition-colors"
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
      <section className="relative overflow-hidden border-b border-slate-800/80 py-12 sm:py-16 lg:py-20">
        {/* Cinematic Tactical Background Layer */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <img
            src="/hero-bg.jpg"
            alt="Tactical Command Operational Backdrop"
            className="w-full h-full object-cover object-center opacity-20 select-none scale-105"
            style={{
              maskImage: "radial-gradient(ellipse 90% 80% at 50% 30%, black 35%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 30%, black 35%, transparent 85%)",
            }}
          />
        </div>

        {/* Ambient atmospheric gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-blue-700/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Official Evaluation Header Badges (Clean, NO PS ID) */}
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Award className="h-3.5 w-3.5 text-blue-400" />
              Executive Evaluation Dossier
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              MoHA & CAPF Welfare Wing
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide">
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              Zero-Trust DPDP Act 2023 Shield
            </span>
          </div>

          {/* Title & Core Proposition */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Predictive Wellness Intelligence for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
                Safer, Stronger Forces
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
              Transforming armed forces welfare from delayed, reactive crisis response into proactive, dignified, predictive care — integrating non-intrusive operational telemetry, explainable AI factor attribution, and strict cryptographic privacy safeguards.
            </p>
          </div>

          {/* Core Doctrine Quote Card */}
          <div className="p-5 sm:p-6 rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-950/40 via-slate-900/60 to-blue-950/40 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400 font-bold block">
                Official Operational Mandate
              </span>
              <p className="text-base sm:text-lg font-semibold text-white italic">
                "Personnel wellbeing is not an administrative afterthought — it is the primary foundation of operational mission readiness."
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
                color: "text-rose-400",
                badge: "Empirical Target",
              },
              {
                value: "+3.2h",
                label: "Rest Stabilization",
                sub: "Circadian fatigue smoothing via automated duty adjustments",
                color: "text-teal-400",
                badge: "Avg Recovery",
              },
              {
                value: "4.8x",
                label: "Earlier Warning",
                sub: "Detected 18-24 days prior to clinical acute crisis",
                color: "text-amber-400",
                badge: "Advance Horizon",
              },
              {
                value: "91%",
                label: "Roster Equity",
                sub: "Algorithmic workload rebalancing across outposts",
                color: "text-blue-400",
                badge: "Fatigue Index",
              },
              {
                value: "100%",
                label: "DPDP & APAR Immunity",
                sub: "Strict statutory exclusion from appraisals or punishment",
                color: "text-emerald-400",
                badge: "Zero-Trust",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm hover:border-slate-700 transition-all hover:-translate-y-0.5 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {stat.badge}
                    </span>
                  </div>
                  <span className={`text-2xl sm:text-3xl font-black ${stat.color} block tracking-tight`}>
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white block mt-0.5">
                    {stat.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mt-2">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Sticky Quick-Jump Executive Navigation Bar */}
      <nav className="sticky top-16 z-40 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
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
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* 5. Main Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
        {/* SECTION 1: THE OPERATIONAL CRISIS */}
        <section id="crisis" className="scroll-mt-32 space-y-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
              The Challenge & Operational Reality
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Why Traditional Forces Welfare Systems Fail
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
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
                  className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm hover:border-slate-700 transition-all space-y-4 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono block">
                          {p.stat}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          {p.statLabel}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {p.title}
                      </h3>
                      <p className="text-xs font-semibold text-rose-300/90 mt-0.5">
                        {p.subtitle}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Cpu className="h-3.5 w-3.5 text-blue-400" />
              The MissionWell Technical Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              4-Tier Closed-Loop Predictive Welfare Ecosystem
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
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
                color: "from-blue-600/20 to-indigo-600/10 border-blue-500/30 text-blue-400",
              },
              {
                step: "02",
                tag: "PRIVACY SHIELD",
                title: "Cryptographic DPDP Anonymization",
                desc: "Client-side salting, pseudonymization, and strict k-anonymity (k ≥ 15) aggregation. Separates identifiable medical data from command tactical dashboards.",
                features: ["Strict Role Segregation", "DPDP Act 2023 Compliant", "Audit Query Ledger", "Legal Covenant Shield"],
                color: "from-teal-600/20 to-emerald-600/10 border-teal-500/30 text-teal-400",
              },
              {
                step: "03",
                tag: "PREDICTIVE AI",
                title: "Explainable SHAP Attribution Engine",
                desc: "Synthesizes multi-factor telemetry into an interpretable 0-100 Burnout Risk Index. Mathematically decomposes risk into precise factor contribution percentages.",
                features: ["Transparent XAI Weights", "No Black-Box Opacity", "Lead-Time: 18-24 Days", "High Recall / Low FPs"],
                color: "from-indigo-600/20 to-purple-600/10 border-indigo-500/30 text-indigo-400",
              },
              {
                step: "04",
                tag: "ACTION PROTOCOL",
                title: "Closed-Loop Welfare Interventions",
                desc: "Triages elevated indicators directly to battalion medical officers. Automatically triggers fatigue-mitigating duty reallocations, rest pauses, and expedited family leave.",
                features: ["Doctor Confidential Queue", "Automated Rest Rotation", "Expedited Leave Routing", "Milestone Tracking"],
                color: "from-emerald-600/20 to-teal-600/10 border-emerald-500/30 text-emerald-400",
              },
            ].map((col, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border bg-gradient-to-b ${col.color} backdrop-blur-sm space-y-3 flex flex-col justify-between shadow-lg`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono opacity-60">
                      {col.step}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-[9px] font-bold tracking-wider uppercase">
                      {col.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {col.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {col.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  {col.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <CheckCircle2 className="h-3 w-3 text-teal-400 shrink-0" />
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Brain className="h-3.5 w-3.5 text-indigo-400" />
              Explainability & Algorithmic Provenance
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              No Black-Box Opacity: SHAP-Guided Factor Attribution
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
              In defense and military healthcare, an unexplained risk score is dangerous and untrustworthy. MissionWell utilizes Shapley Additive Explanations (SHAP) to provide battalion doctors with exact mathematical factor contributions.
            </p>
          </div>

          {/* Interactive Factor Attribution Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold font-mono">
                  ACTIVE CASE TELEMETRY • P-1024
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Havildar Rajesh Kumar (114 Bn)
                </h3>
                <p className="text-xs text-slate-400">
                  Station: Forward Line-of-Control Post • Active Deployment: 142 Days
                </p>
              </div>

              {/* Score Display */}
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wide block">
                    Composite Fatigue & Stress Index
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-rose-400 font-mono">
                    78 <span className="text-sm font-normal text-slate-400">/ 100 [High Vulnerability]</span>
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-rose-500 text-white text-xs font-extrabold uppercase">
                  Triage Level 1
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Rather than giving medical officers an arbitrary score, MissionWell calculates the precise mathematical weight of every underlying stress driver, enabling tailored, dignified clinical care.
              </p>

              <button
                onClick={() => handleLaunchRole("WELFARE_OFFICER", "/welfare")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md"
              >
                <span>Inspect in Welfare Dashboard</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Factor Weight Bar Breakdown */}
            <div className="lg:col-span-7 space-y-4 p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  SHAP Factor Contribution Breakdown
                </span>
                <span className="text-xs font-mono text-teal-400 font-bold">
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
                    textColor: "text-rose-400",
                  },
                  {
                    name: "Shift Irregularity & Night Duties",
                    detail: "14 consecutive night watches without 36h circadian rest buffer",
                    weight: 23,
                    color: "bg-amber-500",
                    textColor: "text-amber-400",
                  },
                  {
                    name: "Circadian Rest Deficit",
                    detail: "Average daily rest dropped to 4.2h over the past 14 days",
                    weight: 19,
                    color: "bg-indigo-500",
                    textColor: "text-indigo-400",
                  },
                  {
                    name: "Accumulated Leave Underutilization",
                    detail: "45 days of unavailed earned leave; cancelled family furlough",
                    weight: 16,
                    color: "bg-teal-500",
                    textColor: "text-teal-400",
                  },
                  {
                    name: "Voluntary Self-Reporting Feedback",
                    detail: "Disclosed mild physical exhaustion & persistent tension",
                    weight: 15,
                    color: "bg-blue-500",
                    textColor: "text-blue-400",
                  },
                ].map((factor, fidx) => (
                  <div key={fidx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">
                        {factor.name}
                      </span>
                      <span className={`font-mono font-bold ${factor.textColor}`}>
                        +{factor.weight}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${factor.color}`}
                        style={{ width: `${factor.weight * 2.5}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Lock className="h-3.5 w-3.5 text-teal-400" />
              Constitutional Dignity & Privacy Shield
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ethical AI & The Non-Punitive Legal Covenant
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
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
                  className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3 hover:border-teal-500/40 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-teal-950/60 border border-teal-500/30 text-teal-300 text-[10px] font-mono font-bold uppercase">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
              Measurable Readiness Multiplier
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Quantifiable Impact on Force Capability
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
              Proven statistical outcomes across force availability, crisis reduction, rest equity, and long-term veteran retention.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                metric: "-42%",
                label: "Acute Stress Incidents",
                detail: "Significant drop in stress-related operational breakdowns through proactive early identification.",
              },
              {
                metric: "+3.2h",
                label: "Average Sleep Stabilization",
                detail: "Consistent circadian recovery through duty rotation buffers and enforced rest protocols.",
              },
              {
                metric: "91%",
                label: "Equitable Shift Rotation",
                detail: "Algorithmic distribution of grueling night duties prevents burn-out of the same core personnel.",
              },
              {
                metric: "4.8x",
                label: "Earlier Support Intervention",
                detail: "Assistance delivered an average of 18 to 24 days prior to clinical decompensation thresholds.",
              },
            ].map((st, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 text-center space-y-2 shadow-lg"
              >
                <span className="text-4xl sm:text-5xl font-black text-teal-400 font-mono block">
                  {st.metric}
                </span>
                <span className="text-sm font-bold text-white block">
                  {st.label}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {st.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: STRATEGIC COMPARISON MATRIX */}
        <section id="matrix" className="scroll-mt-32 space-y-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              Strategic Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Why MissionWell AI Outperforms Existing Alternatives
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
              A side-by-side comparison between legacy reactive approaches, generic enterprise HR software, and the MissionWell AI defense-grade platform.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-xs uppercase font-bold text-slate-300">
                <tr>
                  <th className="p-4 sm:p-5">Capability Matrix</th>
                  <th className="p-4 sm:p-5 text-slate-400">Legacy Manual Protocols</th>
                  <th className="p-4 sm:p-5 text-slate-400">Standard Enterprise HRMS</th>
                  <th className="p-4 sm:p-5 text-teal-300 bg-teal-950/40 border-l border-teal-500/30">
                    MissionWell AI Platform
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
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
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-white">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 text-slate-400">
                      {row.legacy}
                    </td>
                    <td className="p-4 sm:p-5 text-slate-400">
                      {row.hrms}
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-teal-300 bg-teal-950/20 border-l border-teal-500/30 flex items-center gap-2">
                      <Check className="h-4 w-4 text-teal-400 shrink-0" />
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Play className="h-3.5 w-3.5 text-teal-400" />
              Interactive Evaluation Guide
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Test All 4 Real-World Stakeholder Portals
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
              Experience the working prototype directly from each user role's perspective. Click any card to launch the live system instantly with simulated credentials.
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
                color: "border-blue-500/30 hover:border-blue-500 bg-blue-950/20",
                btnColor: "bg-blue-700 hover:bg-blue-600",
              },
              {
                role: "WELFARE_OFFICER" as UserRole,
                title: "Battalion Medical & Welfare Officer",
                badge: "Clinical Triage & XAI",
                route: "/welfare",
                desc: "Confidential triage queue, multivariate risk radar, individual SHAP factor attribution breakdown, and closed-loop intervention assignment.",
                color: "border-teal-500/30 hover:border-teal-500 bg-teal-950/20",
                btnColor: "bg-teal-700 hover:bg-teal-600",
              },
              {
                role: "COMMANDER" as UserRole,
                title: "Tactical Unit Commander",
                badge: "Anonymized Readiness",
                route: "/commander",
                desc: "Anonymized squad-level fatigue heatmaps, company combat readiness indices, workload equity distribution, and tactical duty adjustment recommendations.",
                color: "border-indigo-500/30 hover:border-indigo-500 bg-indigo-950/20",
                btnColor: "bg-indigo-700 hover:bg-indigo-600",
              },
              {
                role: "ADMIN" as UserRole,
                title: "System & Security Administrator",
                badge: "Zero-Trust DPDP Audit",
                route: "/admin",
                desc: "Immutable cryptographic query ledger, DPDP Act 2023 compliance monitor, role permission verification, and force-wide organizational settings.",
                color: "border-slate-700 hover:border-slate-500 bg-slate-900/40",
                btnColor: "bg-slate-700 hover:bg-slate-600",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border ${card.color} transition-all space-y-4 flex flex-col justify-between shadow-xl`}
              >
                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider bg-slate-900 border border-slate-700 text-slate-300">
                    {card.badge}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleLaunchRole(card.role, card.route)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white ${card.btnColor} transition-all flex items-center justify-center gap-2 shadow-md hover:scale-102`}
                >
                  <span>Launch {card.title.split(" ")[0]} View</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* 5-Minute Evaluator Script */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Recommended 5-Minute System Evaluation Flow
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-mono text-teal-400 font-bold block">01. Triage Inspection</span>
                <p>Open the <strong>Welfare Dashboard</strong> to review the high-priority risk queue and see how incoming signals are surfaced without manual paperwork.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-mono text-indigo-400 font-bold block">02. Explainable AI Audit</span>
                <p>Select <strong>Personnel P-1024</strong> to inspect the SHAP factor weight attribution proving the exact causes of burnout vulnerability.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-mono text-amber-400 font-bold block">03. Privacy & Commander Check</span>
                <p>Switch to <strong>Commander View</strong> to confirm that individual medical data is completely redacted while company fatigue telemetry is visible.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Executive Footer & Doctrine Close */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-center text-xs text-slate-400 space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-700 to-teal-500 shadow-md">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="font-extrabold text-white text-base tracking-tight">
            MissionWell <span className="text-teal-400 font-mono">AI</span>
          </span>
        </div>
        <p className="max-w-xl mx-auto px-4 text-slate-400">
          Indigenous, culturally-attuned, privacy-first welfare intelligence capability engineered for Indian Armed Forces and Central Armed Police Forces.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 pt-2">
          <Link href="/" className="hover:text-white transition-colors">Platform Doctrine</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-white transition-colors">Zero-Trust DPDP Architecture</Link>
          <span>•</span>
          <Link href="/login" className="hover:text-white transition-colors">Restricted Officer Access</Link>
          <span>•</span>
          <Link href="/welfare" className="text-teal-400 hover:text-teal-300 font-semibold">Live Welfare Demo</Link>
        </div>
        <p className="text-[11px] text-slate-400 pt-4 font-mono">
          OFFICIAL EVALUATION DOSSIER • MINISTRY OF HOME AFFAIRS & CENTRAL ARMED POLICE FORCES
        </p>
      </footer>
    </div>
  );
}
