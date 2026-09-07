"use client";

import React from "react";
import Link from "next/link";
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
} from "lucide-react";
import { DemoBanner } from "@/components/layout/demo-banner";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      <DemoBanner />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-300 transition-colors">
                MissionWell <span className="text-teal-400">AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                Welfare Intelligence • CRPF / MHA
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#why" className="hover:text-white transition-colors">
              Why MissionWell
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#capabilities" className="hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy First
            </a>
            <Link
              href="/presentation"
              className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold"
            >
              <Award className="h-3.5 w-3.5" />
              Pitch Deck
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 text-xs sm:text-sm font-semibold shadow-lg shadow-blue-900/40 transition-all hover:scale-105 active:scale-95"
            >
              <span>Access Secure Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-blue-700/20 via-indigo-600/15 to-teal-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-950/40 text-teal-300 text-xs font-semibold tracking-wide shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              <span>Smart India Hackathon • Problem Statement 26186</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Predictive Wellness Monitoring for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
                Safer, Stronger Forces
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
              An AI-powered, privacy-first platform that helps identify early indicators of stress,
              fatigue, burnout, and workload pressure so welfare teams can provide timely, confidential support.
            </p>

            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 inline-block text-xs sm:text-sm font-medium text-slate-300">
              <span className="text-teal-400 font-bold">Core Doctrine:</span> "Personnel wellbeing is mission readiness."
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-900/50 hover:shadow-blue-800/80 transition-all hover:scale-105 active:scale-95"
              >
                <span>Access Secure Portal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all"
              >
                <span>Explore How It Works</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Hero Visual: Dashboard Preview Mockup (UI Generated, No Stock Images) */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-700/80 bg-slate-950/90 p-4 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  missionwell.crpf.gov.in/welfare • Sector HQ Welfare Intelligence
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-slate-300">Live Simulated Telemetry</span>
              </div>
            </div>

            {/* Mockup Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stat 1 */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Force Welfare Index</span>
                  <span className="text-emerald-400 font-bold">+2.4% vs baseline</span>
                </div>
                <div className="text-3xl font-extrabold text-white mt-2">81.4 / 100</div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>1,248 Uniformed Personnel Monitored</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Proactive Interventions</span>
                  <span className="text-teal-400 font-bold">18 Active</span>
                </div>
                <div className="text-3xl font-extrabold text-white mt-2">24 Cases</div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <HeartPulse className="h-3.5 w-3.5 text-teal-400" />
                  <span>Early rotation & decompression offered</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Model Confidence</span>
                  <span className="text-blue-400 font-bold">Explainable AI</span>
                </div>
                <div className="text-3xl font-extrabold text-white mt-2">94.2%</div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <Lock className="h-3.5 w-3.5 text-blue-400" />
                  <span>Differential Privacy Safeguards</span>
                </div>
              </div>
            </div>

            {/* Mockup Bottom Live Alert & Timeline bar */}
            <div className="mt-4 rounded-xl border border-orange-500/30 bg-orange-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-orange-500/20 border border-orange-500/30 text-orange-300 font-bold text-xs">
                  ● HIGH ATTENTION
                </span>
                <span className="text-xs text-slate-200">
                  <strong>Personnel P-1024</strong>: 142 days continuous forward post deployment + sleep deficit detected.
                </span>
              </div>
              <span className="text-xs text-teal-300 font-semibold underline underline-offset-4 cursor-pointer">
                Human Officer Review Assigned →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1 — Why MissionWell? */}
      <section id="why" className="py-20 bg-slate-950/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">
              Transforming Force Welfare
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why MissionWell AI?
            </h3>
            <p className="mt-4 text-slate-300 text-base leading-relaxed">
              Traditional welfare management across uniformed forces is often reactive—waiting for visible breakdown or formal grievance. MissionWell transforms welfare into an evidence-based, proactive continuum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: "Early Identification",
                desc: "Analyzes non-intrusive operational duty hours, leave patterns, and voluntary self-reported indicators to spot strain early.",
                icon: Activity,
              },
              {
                step: "02",
                title: "Human Review",
                desc: "No automated disciplinary actions. Qualified welfare officers confidentially evaluate all flags with full AI explainability.",
                icon: Eye,
              },
              {
                step: "03",
                title: "Proactive Support",
                desc: "Promptly coordinates workload balancing, duty rotation, rest stand-downs, and confidential psychological counseling.",
                icon: HeartPulse,
              },
              {
                step: "04",
                title: "Continuous Follow-up",
                desc: "Tracks recovery progression through time-series feedback loops without stigmatization or service prejudice.",
                icon: CheckCircle2,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between hover:border-slate-700 transition-all hover:-translate-y-1 shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-2xl font-black text-slate-700 dark:text-slate-600">
                        {item.step}
                      </span>
                      <div className="p-2 rounded-lg bg-blue-900/40 text-blue-400 border border-blue-800/50">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2 — How It Works Horizontal Workflow */}
      <section id="how-it-works" className="py-20 border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">
              System Architecture
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The Proactive Welfare Pipeline
            </h3>
            <p className="mt-4 text-slate-300 text-base leading-relaxed">
              A transparent 6-stage pipeline from authorized operational telemetry to decisive, dignified human welfare care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { title: "Personnel Data", desc: "HRMS schedules, leave records & duty rosters", icon: Users },
              { title: "Privacy Layer", desc: "Pseudonymization, consent & differential guards", icon: Lock },
              { title: "Predictive Analytics", desc: "Multi-factor stress & burnout machine learning", icon: Brain },
              { title: "Wellness Indicators", desc: "Explainable factor contribution percentages", icon: LineChart },
              { title: "Human Review", desc: "Certified Welfare Officer confidential assessment", icon: Eye },
              { title: "Welfare Intervention", desc: "Rotation, leave clearance & counseling care", icon: HeartPulse },
            ].map((node, i) => {
              const NodeIcon = node.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-center flex flex-col items-center justify-between hover:border-teal-500/50 transition-colors"
                >
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-teal-400 mb-3 shadow-xs">
                    <NodeIcon className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-white">{node.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{node.desc}</p>
                  <div className="mt-3 text-[10px] font-mono text-teal-400 font-semibold">
                    Stage 0{i + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3 — Core Capabilities */}
      <section id="capabilities" className="py-20 bg-slate-950/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">
              Platform Features
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Force Welfare & Readiness
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Predictive Wellness Analytics",
                desc: "Continuously tracks cumulative fatigue trends across deployment cycles, night shifts, and terrain difficulty.",
                icon: LineChart,
              },
              {
                title: "Workload Intelligence",
                desc: "Identifies units experiencing disproportionate operational pressure and assists commanders with balanced rosters.",
                icon: BarChart3,
              },
              {
                title: "Burnout Risk Indicators",
                desc: "Evaluates multi-factor signals including fragmented sleep intervals and leave entitlement delays.",
                icon: Zap,
              },
              {
                title: "Welfare Alert Center",
                desc: "Triages critical cases directly to qualified battalion medical and welfare officers with zero administrative delay.",
                icon: Activity,
              },
              {
                title: "Intervention Management",
                desc: "Comprehensive tracking of duty reassignments, rest stand-downs, and peer counseling support programs.",
                icon: HeartPulse,
              },
              {
                title: "Privacy by Design",
                desc: "Strict separation of powers. Commanders view only aggregated force stats; personal wellness responses remain strictly confidential.",
                icon: Shield,
              },
            ].map((cap, idx) => {
              const CapIcon = cap.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:bg-slate-900 hover:border-slate-700 transition-all shadow-md"
                >
                  <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-900/50 text-blue-400 w-fit mb-4">
                    <CapIcon className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{cap.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4 — Privacy First */}
      <section id="privacy" className="py-20 border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-950/40 text-teal-300 text-xs font-semibold">
                <Lock className="h-3.5 w-3.5 text-teal-400" />
                <span>Ethical AI & Dignity Protection</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Privacy is Not an Add-on. It is Our Core Architecture.
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                MissionWell is specifically designed to eliminate fears of stigmatization, career jeopardy, or surveillance. Our role-based visibility matrix guarantees that personal disclosures are never accessible for performance appraisal or punitive action.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { title: "Consent-Based Wellness Data", desc: "All psychological self-assessments are strictly voluntary with revocable consent." },
                  { title: "Role-Based Visibility Matrix", desc: "Commanders see unit aggregates; only assigned welfare doctors view clinical case notes." },
                  { title: "Data Minimization & Pseudonymization", desc: "Raw identifiers are stripped and salted; zero monitoring of social media or private communication." },
                  { title: "Immutable Audit Trails", desc: "Every record inspection is cryptographically logged and verifiable in the audit center." },
                ].map((pItem, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{pItem.title}</h4>
                      <p className="text-xs text-slate-400">{pItem.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Matrix Visual Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Data Visibility Matrix
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  Zero-Trust Enforced
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-2">Data Category</th>
                      <th className="py-2.5 px-2 text-center">Personnel</th>
                      <th className="py-2.5 px-2 text-center">Welfare Officer</th>
                      <th className="py-2.5 px-2 text-center">Commander</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-3 px-2 font-medium text-white">Personal HR Info</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✓ Own</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✓ Authorized</td>
                      <td className="py-3 px-2 text-center text-slate-600">— Masked</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium text-white">Voluntary Wellness Responses</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✓ Full</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✓ Care Only</td>
                      <td className="py-3 px-2 text-center text-rose-500/70 font-semibold">✕ Strictly Blocked</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium text-white">Unit Aggregate Readiness</td>
                      <td className="py-3 px-2 text-center text-slate-500">—</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✓ Aggregated</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✓ Aggregated Only</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium text-white">Counseling & Therapy Notes</td>
                      <td className="py-3 px-2 text-center text-slate-500">—</td>
                      <td className="py-3 px-2 text-center text-emerald-400">✓ Doctor-Patient</td>
                      <td className="py-3 px-2 text-center text-rose-500/70 font-semibold">✕ Strictly Blocked</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 rounded-lg bg-slate-900/80 p-3 text-[11px] text-slate-400 flex items-center gap-2 border border-slate-800">
                <Scale className="h-4 w-4 text-teal-400 shrink-0" />
                <span>Compliant with Indian Digital Personal Data Protection (DPDP) Act 2023.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Impact */}
      <section className="py-20 bg-slate-950/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">
              Measurable Outcomes
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tangible Impact on Force Readiness
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: "Early Support", stat: "-42%", label: "Reduction in acute operational stress breakdowns" },
              { title: "Better Recovery", stat: "+3.2h", label: "Average weekly rest recovery stabilization" },
              { title: "Balanced Workload", stat: "91%", label: "Equitable shift rotation across deployment squads" },
              { title: "Resilience", stat: "+28%", label: "Improvement in long-term force retention" },
              { title: "Mission Readiness", stat: "100%", label: "Assured operational capability in forward posts" },
            ].map((card, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 text-center flex flex-col justify-between"
              >
                <span className="text-xs font-semibold text-slate-400">{card.title}</span>
                <span className="text-3xl font-extrabold text-teal-400 my-2">{card.stat}</span>
                <span className="text-[11px] text-slate-400 leading-tight">{card.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — CTA */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="p-3 rounded-full bg-blue-900/30 border border-blue-800/40 text-blue-400 w-fit mx-auto">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Build a Healthier, More Resilient Force.
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Experience the next generation of predictive welfare intelligence designed specifically for India's uniformed personnel.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-900/50 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Enter MissionWell Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/presentation"
              className="inline-flex items-center gap-2 rounded-xl border border-teal-500/40 bg-teal-950/30 hover:bg-teal-900/40 px-6 py-3.5 text-sm font-semibold text-teal-300 transition-all"
            >
              <Award className="h-4 w-4" />
              <span>Launch Hackathon Judge Deck</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-slate-400">MissionWell AI</span>
            <span>• Ministry of Home Affairs / CRPF Welfare Initiative</span>
          </div>
          <div className="text-center sm:text-right">
            <span>Smart India Hackathon Problem Statement 26186 • Synthetic Prototype</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
