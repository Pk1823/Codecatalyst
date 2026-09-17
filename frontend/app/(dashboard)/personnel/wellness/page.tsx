"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Smartphone,
  ShieldCheck,
  Lock,
  ExternalLink,
  ChevronLeft,
  AlertCircle,
  QrCode,
  HeartPulse,
  Send,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Moon,
  Clock,
  BatteryCharging,
  Sparkles,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { useAuth, useToast } from "@/components/providers";
import {
  PERSONNEL_ASSESSMENT_URL,
  FIREBASE_APP_URL,
} from "@/components/common/download-mobile-modal";
import { WellnessService } from "@/services/wellness.service";
import { WellnessAssessmentInput, WellnessAssessmentResult } from "@/types/wellness";

export default function WellnessAssessmentPage() {
  const { lang, user } = useAuth();
  const { toast } = useToast();
  const isHi = lang === "hi";

  const [activeTab, setActiveTab] = useState<"interactive" | "mobile">("interactive");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<WellnessAssessmentResult | null>(null);

  // Form State matching mobile assessment questions exactly
  const [fieldDays, setFieldDays] = useState<WellnessAssessmentInput["consecutiveFieldDays"]>("31-60");
  const [dutyHours, setDutyHours] = useState<WellnessAssessmentInput["dutyHours5d"]>("46-60 hours");
  const [nightShifts, setNightShifts] = useState<WellnessAssessmentInput["nightShifts5d"]>("2");
  const [sleepAvg, setSleepAvg] = useState<WellnessAssessmentInput["sleepHrs5dAvg"]>("5-6 hours");
  const [energyLevel, setEnergyLevel] = useState<WellnessAssessmentInput["selfReportedEnergy"]>("3");
  const [stressLevel, setStressLevel] = useState<WellnessAssessmentInput["selfReportedStress"]>("7-8");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inputPayload: WellnessAssessmentInput = {
        consecutiveFieldDays: fieldDays,
        dutyHours5d: dutyHours,
        nightShifts5d: nightShifts,
        sleepHrs5dAvg: sleepAvg,
        selfReportedEnergy: energyLevel,
        selfReportedStress: stressLevel,
        additionalNotes,
      };

      const soldierId = user?.personnelId || (user?.id?.startsWith("P-") ? user.id : "P-1024");
      const res = await WellnessService.submitAssessment(inputPayload, soldierId);
      setResult(res);

      toast({
        title: isHi ? "मूल्यांकन सफलतापूर्वक दर्ज" : "Assessment Evaluated & Dispatched",
        description: isHi
          ? `कल्याण अधिकारी को वास्तविक समय में अलर्ट प्रेषित कर दिया गया है।`
          : `Live triage notification dispatched to Welfare Command Center.`,
        type: res.indicatorStatus === "Elevated Attention" ? "error" : "success",
      });
    } catch (err) {
      toast({
        title: isHi ? "त्रुटि" : "Error",
        description: isHi ? "मूल्यांकन सबमिट नहीं हो सका।" : "Failed to record assessment.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 sm:py-6">
      {/* Back Navigation */}
      <Link
        href="/personnel"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>{isHi ? "वापस डैशबोर्ड पर" : "Back to Overview"}</span>
      </Link>

      {/* Main Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B132B] p-5 sm:p-7 shadow-xl space-y-6">
        {/* Header with Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {isHi ? "सैनिक कल्याण व स्वास्थ्य मूल्यांकन" : "Soldier Wellness & Operational Triage"}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHi
                  ? "60-सेकंड त्वरित गोपनीय चेक-इन • वास्तविक समय में वेलफेयर अलर्ट प्रेषण"
                  : "60-Second Confidential Check-in • Instant Real-time Alert Sync"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              DPDP Guard Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs font-mono font-semibold text-blue-700 dark:text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
              LIVE TELEMETRY
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("interactive")}
            className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "interactive"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isHi ? "लाइव वेब मूल्यांकन (तत्काल परीक्षण)" : "Interactive Live Check-in (Instant)"}</span>
          </button>
          <button
            onClick={() => setActiveTab("mobile")}
            className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "mobile"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>{isHi ? "मोबाइल ऐप व क्यूआर कोड" : "Mobile App & Tactical QR"}</span>
          </button>
        </div>

        {/* Tab 1: Interactive Live Assessment Form */}
        {activeTab === "interactive" && (
          <div>
            {!result ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Q1: Field Days */}
                  <div className="space-y-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Flame className="h-4 w-4 text-amber-500" />
                      <span>{isHi ? "1. लगातार फील्ड/फॉरवर्ड पोस्टिंग के दिन" : "1. Consecutive Forward Field Days"}</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      {isHi ? "अंतिम 72 घंटे के अवकाश के बाद से दिन" : "Deployment days without 72h rest turnaround"}
                    </p>
                    <select
                      value={fieldDays}
                      onChange={(e) => setFieldDays(e.target.value as any)}
                      className="w-full text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                    >
                      <option value="0-10">0 - 10 Days (Fresh deployment)</option>
                      <option value="11-30">11 - 30 Days (Standard deployment)</option>
                      <option value="31-60">31 - 60 Days (Prolonged stationing)</option>
                      <option value="61-90">61 - 90 Days (Extended load - Fatigue risk)</option>
                      <option value="90+">90+ Days (Critical fatigue threshold)</option>
                    </select>
                  </div>

                  {/* Q2: Duty Hours */}
                  <div className="space-y-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{isHi ? "2. पिछले 5 दिनों में कुल ड्यूटी के घंटे" : "2. Total Duty Hours in Past 5 Days"}</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      {isHi ? "गश्त, नाका व संतरी ड्यूटी अवधि" : "Active patrol, ambush & sentry watches"}
                    </p>
                    <select
                      value={dutyHours}
                      onChange={(e) => setDutyHours(e.target.value as any)}
                      className="w-full text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                    >
                      <option value="< 30 hours">&lt; 30 hours (Light shift)</option>
                      <option value="30-45 hours">30 - 45 hours (Standard shift)</option>
                      <option value="46-60 hours">46 - 60 hours (Elevated duty load)</option>
                      <option value="61-75 hours">61 - 75 hours (High cognitive load)</option>
                      <option value="> 75 hours">&gt; 75 hours (Extreme operational strain)</option>
                    </select>
                  </div>

                  {/* Q3: Night Shifts */}
                  <div className="space-y-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Moon className="h-4 w-4 text-indigo-500" />
                      <span>{isHi ? "3. पिछले 5 दिनों में नाइट शिफ्ट (रात्रि गश्त)" : "3. Night Shifts in Last 5 Days"}</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      {isHi ? "22:00 से 06:00 के मध्य सक्रिय ड्यूटी" : "Watches between 22:00 - 06:00 hrs"}
                    </p>
                    <select
                      value={nightShifts}
                      onChange={(e) => setNightShifts(e.target.value as any)}
                      className="w-full text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                    >
                      <option value="0">0 Night Shifts (Normal Circadian)</option>
                      <option value="1">1 Night Shift (Minor Disruption)</option>
                      <option value="2">2 Night Shifts (Moderate)</option>
                      <option value="3">3 Night Shifts (Circadian Disruption)</option>
                      <option value="4+">4+ Night Shifts (Severe Circadian Strain)</option>
                    </select>
                  </div>

                  {/* Q4: Sleep Average */}
                  <div className="space-y-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <BatteryCharging className="h-4 w-4 text-emerald-500" />
                      <span>{isHi ? "4. 5-दिवसीय औसत दैनिक नींद" : "4. Average Sleep per 24-hr Cycle"}</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      {isHi ? "वास्तविक निर्बाध आराम की अवधि" : "Uninterrupted restorative sleep hours"}
                    </p>
                    <select
                      value={sleepAvg}
                      onChange={(e) => setSleepAvg(e.target.value as any)}
                      className="w-full text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                    >
                      <option value="> 7 hours">&gt; 7 hours (Optimal recovery)</option>
                      <option value="6-7 hours">6 - 7 hours (Adequate rest)</option>
                      <option value="5-6 hours">5 - 6 hours (Mild deficit)</option>
                      <option value="4-5 hours">4 - 5 hours (Acute sleep debt)</option>
                      <option value="< 4 hours">&lt; 4 hours (Severe sleep deprivation)</option>
                    </select>
                  </div>

                  {/* Q5: Energy */}
                  <div className="space-y-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      <span>{isHi ? "5. स्व-रिपोर्टेड ऊर्जा स्तर (1 से 5)" : "5. Self-Reported Energy Level (1 to 5)"}</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      {isHi ? "शारीरिक सतर्कता एवं स्फूर्ति" : "Physical stamina & alert readiness"}
                    </p>
                    <select
                      value={energyLevel}
                      onChange={(e) => setEnergyLevel(e.target.value as any)}
                      className="w-full text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                    >
                      <option value="5">5 - Peak Energy (Ready for high-intensity duty)</option>
                      <option value="4">4 - Good Energy (Normal vigor)</option>
                      <option value="3">3 - Moderate Energy (Routine fatigue)</option>
                      <option value="2">2 - Low Energy (Noticeable lethargy)</option>
                      <option value="1">1 - Exhausted (Physical & mental depletion)</option>
                    </select>
                  </div>

                  {/* Q6: Stress */}
                  <div className="space-y-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40">
                    <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-500" />
                      <span>{isHi ? "6. मानसिक तनाव व दबाव (1 से 10)" : "6. Mental Stress & Cognitive Strain (1 to 10)"}</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      {isHi ? "पारिवारिक, प्रशासनिक अथवा मिशन तनाव" : "Family, administrative, or mission stress"}
                    </p>
                    <select
                      value={stressLevel}
                      onChange={(e) => setStressLevel(e.target.value as any)}
                      className="w-full text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                    >
                      <option value="1-2">1 - 2 (Calm & Balanced)</option>
                      <option value="3-4">3 - 4 (Normal Operational Focus)</option>
                      <option value="5-6">5 - 6 (Elevated Cognitive Pressure)</option>
                      <option value="7-8">7 - 8 (High Stress / Compounding Strain)</option>
                      <option value="9-10">9 - 10 (Critical / Severe Strain - Triage Urged)</option>
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isHi ? "अतिरिक्त टिप्पणियाँ (वैकल्पिक एवं गोपनीय):" : "Confidential Operational Observations (Optional):"}
                  </label>
                  <input
                    type="text"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder={isHi ? "उदा. बैक-टू-बैक गश्त, लंबित छुट्टी अथवा पारिवारिक चिंता..." : "e.g., Pending leave regularization, nocturnal watch pacing..."}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-2.5 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    ⚡ {isHi ? "मूल्यांकन सबमिट करते ही वेलफेयर पोर्टल पर तुरंत लाइव नोटिफिकेशन जाएगा।" : "Submitting instantly broadcasts live alert notification across the Welfare Command Center."}
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>{isHi ? "मूल्यांकन जारी..." : "Evaluating Telemetry..."}</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>{isHi ? "गोपनीय मूल्यांकन दर्ज करें →" : "Submit Confidential Assessment →"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* RESULT VIEW */
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {isHi ? "मूल्यांकन सफलतापूर्वक रिकॉर्ड व सिंक हुआ" : "Evaluation Successfully Recorded & Synced"}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          Ref: {result.id} • {result.date}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                        result.indicatorStatus === "Elevated Attention"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          : result.indicatorStatus === "Moderate Attention"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      }`}
                    >
                      {result.indicatorStatus.toUpperCase()}
                    </span>
                  </div>

                  {/* Telemetry Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Stress Level</span>
                      <span className="text-xs font-bold text-slate-100">{result.stressLevel}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Fatigue Level</span>
                      <span className="text-xs font-bold text-slate-100">{result.fatigueLevel}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Workload Status</span>
                      <span className="text-xs font-bold text-slate-100">{result.workloadStatus}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Recovery Status</span>
                      <span className="text-xs font-bold text-slate-100">{result.recoveryStatus}</span>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                      {isHi ? "चिकित्सीय एवं कल्याण मार्गदर्शन:" : "Clinical & Welfare Guidance:"}
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">{result.recommendation}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>{isHi ? "नया चेक-इन करें" : "Retake Assessment"}</span>
                  </button>

                  <Link
                    href="/alerts"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all"
                  >
                    <span>{isHi ? "चेतावनी केंद्र में अलर्ट देखें →" : "View Alert in Alert Center →"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Mobile App & QR Code Card */}
        {activeTab === "mobile" && (
          <div className="space-y-6">
            {/* Security Explanation */}
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>{isHi ? "वैधानिक सुरक्षा एवं गैर-दंडात्मक गोपनीयता प्रोटोकॉल:" : "Statutory Privacy & Non-Punitive Protocol:"}</span>
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-300/90 leading-normal">
                {isHi
                  ? "कार्यस्थल अथवा शेयर्ड कंप्यूटरों पर सैनिक का मानसिक व शारीरिक स्वास्थ्य मूल्यांकन भरना पूर्णतः प्रतिबंधित है ताकि किसी भी सहकर्मी या कमांडर द्वारा स्क्रीन पर उत्तर न देखे जा सकें। मूल्यांकन सैनिक के निजी फोन पर मिशनवेल मोबाइल ऐप के माध्यम से स्वीकार किया जाता है।"
                  : "To guarantee zero-stigmatization and safeguard personnel from workplace observation, self-assessments can be administered through the confidential MissionWell Mobile Application on personal smartphones."}
              </p>
            </div>

            {/* Interactive QR Code Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-3.5 rounded-xl bg-white shadow-md border border-slate-200 text-slate-900">
                  <QRCodeSVG
                    value={PERSONNEL_ASSESSMENT_URL}
                    size={160}
                    level="H"
                    fgColor="#0F172A"
                    bgColor="#FFFFFF"
                  />
                </div>
                <div className="text-center space-y-1">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {isHi ? "फोन कैमरे से स्कैन कर सैनिक पोर्टल खोलें" : "Scan to Open Soldier Assessment"}
                  </span>
                  <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    Live Firebase PWA • Direct Browser Access
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {isHi ? "मूल्यांकन के 3 सरल चरण:" : "3 Simple Steps to Complete:"}
                </h3>
                
                <ol className="space-y-2.5 list-decimal list-inside text-[11px] leading-relaxed">
                  <li>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {isHi ? "तुरंत मूल्यांकन खोलें" : "Instant Access"}:
                    </span>{" "}
                    {isHi ? "क्यूआर कोड स्कैन करें अथवा नीचे दिए गए बटन से शुरू करें।" : "Scan the QR code or click Launch Assessment below."}
                  </li>
                  <li>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {isHi ? "60-सेकंड त्वरित चेक-इन" : "60-Second Check-in"}:
                    </span>{" "}
                    {isHi ? "ड्यूटी के घंटे, नींद व थकान पर 6 त्वरित प्रश्नों के उत्तर दें।" : "Answer 6 rapid check-in questions on workload & rest."}
                  </li>
                  <li>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {isHi ? "100% गोपनीय रिकॉर्ड" : "Encrypted Vault"}:
                    </span>{" "}
                    {isHi ? "डेटा सीधे सुरक्षित एन्क्रिप्शन के साथ वेलफेयर हब में सिंक होगा।" : "Your assessment records safely in the confidential welfare hub."}
                  </li>
                </ol>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <a
                    href={PERSONNEL_ASSESSMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>{isHi ? "सैनिक मूल्यांकन शुरू करें (लाइव) ↗" : "Launch Soldier Assessment (Live) ↗"}</span>
                  </a>
                  <a
                    href={FIREBASE_APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs transition-all cursor-pointer"
                  >
                    <span>{isHi ? "मुख्य मोबाइल ऐप" : "Mobile App Home"}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Guarantee */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-blue-500" />
            <span>{isHi ? "शून्य एसीआर/एपीएआर लिंकेज गारंटी" : "Zero APAR / ACR Career Linkage Guarantee"}</span>
          </div>
          <span>Ministry of Home Affairs • CAPF</span>
        </div>
      </div>
    </div>
  );
}
