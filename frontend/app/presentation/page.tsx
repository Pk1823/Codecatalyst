"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  HeartPulse,
  Brain,
  Lock,
  LineChart,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Award,
  Zap,
  Users,
  Activity,
  Home,
  Play,
} from "lucide-react";

export default function PresentationPage() {
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      id: "intro",
      tag: "SMART INDIA HACKATHON 2024/2025 • PS 26186",
      title: "MISSIONWELL AI",
      subtitle: "Predictive Wellness Monitoring for Safer, Stronger Forces",
      quote: "Personnel wellbeing is mission readiness.",
      body: "Developed for Central Armed Police Forces (CRPF, BSF, ITBP) & Ministry of Home Affairs to transform personnel welfare from reactive crisis response into proactive, dignified, predictive care.",
      badges: ["Ministry of Home Affairs", "CRPF Police II Division", "HealthTech / MedTech", "Theme: Force Resilience"],
    },
    {
      id: "problem",
      tag: "THE CHALLENGE",
      title: "Why Traditional Welfare Systems Fail",
      subtitle: "High-Intensity Operational Realities",
      points: [
        {
          title: "Reactive & Delayed Observation",
          desc: "Stress identification traditionally relies on manual observation or formal breakdowns, delaying timely assistance until acute crises emerge.",
        },
        {
          title: "Prolonged Forward Deployments",
          desc: "Personnel undergo 140+ continuous days in high-intensity outposts with disrupted sleep, family separation, and erratic shift patterns.",
        },
        {
          title: "Fear of Career Stigmatization",
          desc: "Personnel hesitate to report mental exhaustion due to fears of negative appraisal marks (APAR) or losing operational postings.",
        },
        {
          title: "Siloed Duty Rostering",
          desc: "Commanders lack aggregated workload telemetry to detect cumulative squad fatigue before operational effectiveness degrades.",
        },
      ],
    },
    {
      id: "solution",
      tag: "OUR INNOVATION",
      title: "The MissionWell AI Ecosystem",
      subtitle: "Predictive, Proactive, and Privacy-Centric",
      points: [
        {
          title: "Multivariate Signal Synthesis",
          desc: "Analyzes non-intrusive operational HRMS records, leave underutilization, duty rosters, and voluntary self-reporting without intrusive surveillance.",
        },
        {
          title: "Explainable Risk Quantification",
          desc: "No black-box opacity. Deconstructs welfare risk into clear factor contributions (Deployment 27%, Duty hours 23%, Sleep deficit 19%, Leave deficit 16%).",
        },
        {
          title: "Automated Welfare Alerts",
          desc: "Triages elevated indicators directly to qualified battalion doctors and welfare officers for stigma-free support.",
        },
        {
          title: "Proactive Interventions",
          desc: "Enables duty rotations, mandatory sleep stand-downs, and expedited family leave before acute burnout strikes.",
        },
      ],
    },
    {
      id: "privacy",
      tag: "ZERO-TRUST PRIVACY",
      title: "Ethical AI & The Dignity Safeguard",
      subtitle: "Architectural Role Segregation",
      points: [
        {
          title: "Strict Role Separation",
          desc: "Commanders view only aggregated unit-level readiness indices. Personal voluntary responses are strictly inaccessible to tactical leadership.",
        },
        {
          title: "Non-Punitive Legal Covenant",
          desc: "System metrics are legally restricted from use in performance appraisals (APAR), promotion boards, or disciplinary proceedings.",
        },
        {
          title: "Data Minimization & Salting",
          desc: "Zero tracking of personal phone calls, WhatsApp messages, social media, or GPS location. Complete DPDP Act 2023 compliance.",
        },
        {
          title: "Cryptographic Auditability",
          desc: "Every officer query is recorded in an immutable ledger, ensuring zero unauthorized snooping.",
        },
      ],
    },
    {
      id: "impact",
      tag: "MEASURABLE IMPACT",
      title: "Transforming Operational Readiness",
      subtitle: "Proven Benefits for Uniformed Services",
      stats: [
        { value: "-42%", label: "Reduction in stress-related operational breakdowns" },
        { value: "+3.2h", label: "Average rest recovery stabilization per personnel" },
        { value: "91%", label: "Equitable shift rotation index achieved" },
        { value: "+28%", label: "Long-term force retention and morale improvement" },
      ],
      body: "MissionWell AI establishes an indigenous, culturally-attuned welfare intelligence capability tailored for Indian forces operating under the most rigorous conditions.",
    },
    {
      id: "demo",
      tag: "LIVE DEMONSTRATION",
      title: "5-Minute Interactive Hackathon Flow",
      subtitle: "Experience the Full Prototype",
      steps: [
        "1. Landing Page → Public MissionWell doctrine & architecture overview",
        "2. Login Portal → 1-click demo persona switcher (Personnel, Welfare Officer, Commander, Admin)",
        "3. Personnel Portal → My Wellbeing trend chart & duty hours tracking",
        "4. Voluntary Assessment → 7-step self-reporting with instant supportive guidance",
        "5. Welfare Intelligence Dashboard → Force risk distribution & active alert triage",
        "6. Explainable AI Detail → Factor attribution breakdown for Personnel P-1024",
        "7. Case & Interventions → Chronological milestone timeline & rotation assignment",
        "8. Commander View → Anonymized unit comparisons & AI tactical insights",
        "9. Privacy Center → Role visibility matrix & DPDP audit guarantees",
      ],
    },
  ];

  const currentSlide = slides[slideIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-12 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 shadow-md">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base text-white">MissionWell <span className="text-teal-400">AI</span></span>
            <span className="text-[10px] text-slate-400 block font-mono">SIH 2024/2025 • PS 26186</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">
            Slide {slideIndex + 1} of {slides.length}
          </span>
          <Link
            href="/welfare"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Launch Live App</span>
          </Link>
        </div>
      </div>

      {/* Main Slide Content Area */}
      <div className="my-auto max-w-5xl mx-auto w-full py-8 space-y-8 animate-in fade-in duration-300">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider mb-3">
            {currentSlide.tag}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            {currentSlide.title}
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mt-2">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Slide 0 / Intro */}
        {currentSlide.badges && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-950/30 text-lg font-bold text-teal-300">
              "{currentSlide.quote}"
            </div>
            <p className="text-base text-slate-300 max-w-3xl leading-relaxed">
              {currentSlide.body}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {currentSlide.badges.map((b, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700">
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Slide Points */}
        {currentSlide.points && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {currentSlide.points.map((p, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2 shadow-md"
              >
                <div className="flex items-center gap-2 text-teal-400 font-bold text-base">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>{p.title}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Slide Stats */}
        {currentSlide.stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {currentSlide.stats.map((s, i) => (
                <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 text-center">
                  <span className="text-4xl sm:text-5xl font-black text-teal-400 block mb-2">{s.value}</span>
                  <span className="text-xs text-slate-300 font-medium leading-tight">{s.label}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400 text-center max-w-2xl mx-auto">{currentSlide.body}</p>
          </div>
        )}

        {/* Demo Steps */}
        {currentSlide.steps && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentSlide.steps.map((st, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 text-xs text-slate-200">
                {st}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Slide Controller Navigation */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <button
          onClick={() => setSlideIndex((prev) => Math.max(prev - 1, 0))}
          disabled={slideIndex === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous Slide</span>
        </button>

        {/* Slide Indicator Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`h-2 rounded-full transition-all ${
                slideIndex === i ? "w-8 bg-teal-400" : "w-2 bg-slate-700"
              }`}
              aria-label={`Jump to slide ${i + 1}`}
            />
          ))}
        </div>

        {slideIndex < slides.length - 1 ? (
          <button
            onClick={() => setSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
          >
            <span>Next Slide</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
          >
            <span>Start Live Demo</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
