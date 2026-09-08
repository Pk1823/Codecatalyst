"use client";

import React, { useState } from "react";
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
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/components/providers";
import { FORCES_METADATA } from "@/lib/force-metadata";

export default function LandingPage() {
  const router = useRouter();
  const { force, setForce, switchRole, lang, toggleLang } = useAuth();
  const isHi = lang === "hi";
  const branchMeta = FORCES_METADATA[force] || FORCES_METADATA.CRPF;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-[#F8FAFC]">
                MissionWell <span className="text-emerald-400 font-mono text-xs">AI</span>
              </span>
              <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-slate-300 border border-slate-700">
                DEFENSE
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">
              {isHi ? "कार्यप्रणाली" : "How It Works"}
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              {isHi ? "मुख्य विशेषताएं" : "Key Capabilities"}
            </a>
            <a href="#privacy" className="hover:text-white transition-colors">
              {isHi ? "गोपनीयता नीति" : "Zero-Trust Privacy"}
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleLang}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900 text-xs font-mono font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              title="Toggle English / हिन्दी"
            >
              {isHi ? "English" : "हिन्दी"}
            </button>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isHi ? "पोर्टल प्रवेश" : "Sign In"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Simple, Clear & Punchy */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-800/80 overflow-hidden">
        {/* Ambient Subtle Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-600/10 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Value Prop Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F8FAFC] leading-tight">
            {isHi ? (
              <>
                ड्यूटी तनाव और थकान की{" "}
                <span className="text-emerald-400">समय रहते पहचान</span>
              </>
            ) : (
              <>
                Early stress & fatigue detection for{" "}
                <span className="text-emerald-400">safer, resilient forces</span>
              </>
            )}
          </h1>

          {/* Simple Explanation */}
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {isHi
              ? "MissionWell AI भारतीय सेना, CRPF, BSF, ITBP, CISF और राज्य पुलिस के जवानों में कठिन ड्यूटी, अनिद्रा और तैनाती तनाव को बिना किसी मेडिकल कलंक या सेवा रिकॉर्ड पर असर डाले समय रहते भांपकर आराम व सहायता पहुंचाता है।"
              : "MissionWell AI helps military and police commanders identify cumulative operational fatigue, sleep deprivation, and high-stress deployments early—without medical stigma or career penalties."}
          </p>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>{isHi ? "मिशनवेल पोर्टल खोलें" : "Launch MissionWell Portal"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 px-5 py-3 text-sm font-medium text-slate-200 transition-all"
            >
              <span>{isHi ? "यह कैसे काम करता है?" : "See How It Works"}</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/60 mt-8">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{isHi ? "शून्य सेवा कलंक" : "Zero Career Penalty"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{isHi ? "डीपीडीपी अधिनियम 2023 सुरक्षित" : "DPDP Act 2023 Compliant"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-emerald-400" />
              <span>{isHi ? "बडी-पेयर पारस्परिक रक्षा" : "Buddy-Pair Doctrine"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PhoneCall className="h-4 w-4 text-emerald-400" />
              <span>Tele-MANAS: <strong className="text-slate-200 font-mono">14416</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: How It Works in 3 Simple Steps */}
      <section id="how-it-works" className="py-20 bg-[#090D16] border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              {isHi ? "कार्यप्रणाली" : "How It Works"}
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
              {isHi ? "3 सरल चरणों में समय पर सहायता" : "From Early Signal to Proactive Care"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {isHi
                ? "प्रणाली जवानों के आत्म-सम्मान और गोपनीयता की रक्षा करते हुए कल्याणकारी सहायता सुनिश्चित करती है।"
                : "A dignified continuum that transforms reactive breakdown into proactive, non-stigmatizing welfare."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="rounded-xl border border-slate-800 bg-[#0F172A]/80 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                    STEP 01
                  </span>
                  <HeartPulse className="h-5 w-5 text-slate-400" />
                </div>
                <h4 className="text-base font-bold text-white">
                  {isHi ? "स्वैच्छिक व बडी चेक-इन" : "Voluntary & Buddy Check-in"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isHi
                    ? "जवान 7-चरण त्वरित स्व-मूल्यांकन करते हैं या उनका बडी साथी (जोड़ीदार) बिना किसी डर के विश्राम की अनुशंसा कर सकता है।"
                    : "Jawans submit quick voluntary self-checks, or their assigned buddy flags when peer rest or family contact is needed."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                ✓ Confidential & non-punitive
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-slate-800 bg-[#0F172A]/80 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                    STEP 02
                  </span>
                  <Brain className="h-5 w-5 text-slate-400" />
                </div>
                <h4 className="text-base font-bold text-white">
                  {isHi ? "एंटी-मास्किंग एआई विश्लेषण" : "Anti-Masking AI Triage"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isHi
                    ? "एआई मॉडल लंबे कठिन दिनों (जैसे 140+ दिन फॉरवर्ड ड्यूटी) और अनिद्रा के संकेतों का पारदर्शी विश्लेषण करता है।"
                    : "The explainable LightGBM AI detects fatigue patterns even when jawans attempt to downplay distress due to military toughness."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                ✓ Explainable SHAP guidance
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-slate-800 bg-[#0F172A]/80 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                    STEP 03
                  </span>
                  <Zap className="h-5 w-5 text-slate-400" />
                </div>
                <h4 className="text-base font-bold text-white">
                  {isHi ? "सक्रिय विश्राम व रोटेशन" : "Proactive Rest & Rotation"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isHi
                    ? "कल्याण अधिकारी व कमांडर तनाव बढ़ने से पूर्व ही जवान को रोटेशनल लीव या डीकंप्रेशन विश्राम प्रदान करते हैं।"
                    : "Welfare Officers dispatch rotational leave, counseling, or outpost decompression before burnout becomes acute."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                ✓ Timely decompression dispatch
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Key Capabilities (4 Core Pillars) */}
      <section id="features" className="py-20 bg-[#090D16] border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              {isHi ? "मुख्य क्षमताएं" : "Core Capabilities"}
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
              {isHi ? "सैन्य एवं पुलिस संस्कृति के अनुकूल" : "Engineered for Armed Forces & Police Culture"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pillar 1: Buddy System */}
            <div className="rounded-xl border border-slate-800 bg-[#0F172A]/90 p-6 flex gap-4">
              <div className="p-2.5 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 shrink-0 h-fit">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {isHi ? "पवित्र बडी-पेयर (जोड़ीदार) कल्याण प्रणाली" : "The Sacred Buddy-Pair Welfare System"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isHi
                    ? "सशस्त्र बलों की दशकों पुरानी प्रथा को डिजिटल रूप दिया गया है। जवान गोपनीय तरीके से अपने साथी हेतु आराम व सहायता का अनुरोध कर सकते हैं।"
                    : "Digitizes the authentic Armed Forces doctrine where soldiers are paired with a trusted buddy for 1-tap peer wellness checks without disciplinary records."}
                </p>
              </div>
            </div>

            {/* Pillar 2: Commander View */}
            <div className="rounded-xl border border-slate-800 bg-[#0F172A]/90 p-6 flex gap-4">
              <div className="p-2.5 rounded-lg bg-slate-800 text-purple-400 border border-slate-700 shrink-0 h-fit">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {isHi ? "कमांड रोल-कॉल व तत्परता हीटमैप" : "Command Readiness & Roll-Call Heatmaps"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isHi
                    ? "कमांडरों को कंपनियों (Alpha, Bravo, Charlie, Delta) का समग्र कार्यभार दिखता है, जिसमें जवानों के नाम व निजी डेटा पूरी तरह गुप्त रहते हैं।"
                    : "Commanders and Police SPs view macro company-level fatigue trends and leave balances with strictly masked individual identities."}
                </p>
              </div>
            </div>

            {/* Pillar 3: DPDP Act Privacy */}
            <div className="rounded-xl border border-slate-800 bg-[#0F172A]/90 p-6 flex gap-4">
              <div className="p-2.5 rounded-lg bg-slate-800 text-sky-400 border border-slate-700 shrink-0 h-fit">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {isHi ? "डीपीडीपी 2023 शून्य-विश्वास सुरक्षा" : "DPDP Act 2023 & Non-Punitive Doctrine"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isHi
                    ? "कल्याणकारी जानकारी कभी भी वार्षिक गोपनीय रिपोर्ट (ACR/APAR) या पदोन्नति को प्रभावित नहीं करती। डॉक्टर के नोट्स केवल चिकित्सा अधिकारी तक सीमित हैं।"
                    : "Disclosures are cryptographically segregated. Self-assessments never impact Annual Performance Appraisals (ACR/APAR) or promotional eligibility."}
                </p>
              </div>
            </div>

            {/* Pillar 4: Force Adaptation */}
            <div className="rounded-xl border border-slate-800 bg-[#0F172A]/90 p-6 flex gap-4">
              <div className="p-2.5 rounded-lg bg-slate-800 text-amber-400 border border-slate-700 shrink-0 h-fit">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {isHi ? "6 वर्दीधारी सेवाओं हेतु अनुकूलित" : "Adaptation for 6 Uniformed Services"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isHi
                    ? "CRPF (बस्तर/नक्सल ग्रिड), सेना (सियाचिन/लद्दाख), BSF (रेगिस्तान), ITBP (-30°C), CISF और राज्य पुलिस के अनुसार शब्द व मानक स्वतः बदलते हैं।"
                    : "Dynamically adapts terminology, unit hierarchies, and operational benchmarks for CRPF, Army, BSF, ITBP, CISF, and State Police."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Zero-Trust Separation of Powers Matrix */}
      <section id="privacy" className="py-20 bg-[#090D16] border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              {isHi ? "डेटा सुरक्षा" : "Zero-Trust Confidentiality"}
            </h2>
            <h3 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
              {isHi ? "कठोर डेटा विभाजन मैट्रिक्स" : "Separation of Powers Matrix"}
            </h3>
            <p className="text-xs text-slate-400">
              {isHi
                ? "किस भूमिका को क्या डेटा दिखता है, इसका स्पष्ट व पारदर्शी नियम।"
                : "Strict role-based isolation guarantees personnel trust and clinical privacy."}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0F172A]/90 p-5 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3 font-sans font-medium">{isHi ? "डेटा श्रेणी" : "Data Class"}</th>
                    <th className="py-2.5 px-3 text-center">{isHi ? "जवान" : "Jawan"}</th>
                    <th className="py-2.5 px-3 text-center">{isHi ? "कल्याण अधिकारी / डॉक्टर" : "Welfare Officer"}</th>
                    <th className="py-2.5 px-3 text-center">{isHi ? "कमांडर" : "Commander"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 px-3 font-sans font-medium text-slate-200">{isHi ? "स्वैच्छिक चेक-इन व बडी रिपोर्ट" : "Self-Report & Buddy Feedback"}</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold">✓ Full Access</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold">✓ Care Triage</td>
                    <td className="py-3 px-3 text-center text-rose-400 font-bold">✕ BLOCKED</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-sans font-medium text-slate-200">{isHi ? "चिकित्सा परामर्श नोट्स" : "Counseling Clinical Notes"}</td>
                    <td className="py-3 px-3 text-center text-slate-500">—</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold">✓ Doctor-Only</td>
                    <td className="py-3 px-3 text-center text-rose-400 font-bold">✕ BLOCKED</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-sans font-medium text-slate-200">{isHi ? "कंपनी तनाव व तत्परता सूचकांक" : "Unit Stress & Readiness Index"}</td>
                    <td className="py-3 px-3 text-center text-slate-500">—</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold">✓ Aggregated</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold">✓ Masked Summary</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-[#090D16] text-center border-b border-slate-800/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white mx-auto shadow-xs">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
            {isHi ? "सशक्त, स्वस्थ एवं तत्पर सुरक्षा बल" : "Personnel Wellbeing is Mission Readiness"}
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            {isHi
              ? "सशस्त्र बलों एवं पुलिस कर्मियों के निरंतर मानवीय कल्याण एवं सामरिक तत्परता को समर्पित।"
              : "Dedicated to the proactive health, resilience, and operational readiness of India's defenders."}
          </p>
          <div className="pt-2 flex items-center justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isHi ? "पोर्टल में प्रवेश करें" : "Access MissionWell Portal"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Official Government Footer */}
      <footer className="bg-[#090D16] py-6 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">MissionWell AI</span>
            <span>• {isHi ? "सशस्त्र बल एवं पुलिस कल्याण खुफिया प्रणाली" : "Defense Personnel Welfare & Stress Intelligence"}</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right font-mono text-[11px]">
            <span>24x7 Helpline: <strong className="text-emerald-400 font-medium">14416</strong> • KIRAN: <strong className="text-emerald-400 font-medium">1800-599-0019</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
