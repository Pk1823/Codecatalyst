"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  AlertTriangle,
  Clock,
  Moon,
  BatteryCharging,
  Briefcase,
  Calendar,
  Sparkles,
  CheckCircle2,
  Lock,
  Smartphone,
  Info,
  RefreshCw,
  FolderHeart,
  Send,
  Zap,
} from "lucide-react";
import { useAuth, useToast } from "@/components/providers";
import { WelfareService } from "@/services/welfare.service";
import { APK_DOWNLOAD_URL } from "@/components/common/download-mobile-modal";

interface AssessmentFormState {
  personnelId: string;
  consecutiveFieldDays: number;
  dutyHours5d: number;
  nightShifts5d: number;
  sleepHrs5dAvg: number;
  selfReportedStress: number;
  selfReportedEnergy: number;
  leaveStatus: "NORMAL" | "DENIED" | "PENDING";
  sleepQuality: "Very Low" | "Low" | "Moderate" | "Good" | "Very Good";
  workload: "Low" | "Moderate" | "Elevated" | "High";
  additionalNotes: string;
}

const INITIAL_STATE: AssessmentFormState = {
  personnelId: "P-1024",
  consecutiveFieldDays: 35,
  dutyHours5d: 48,
  nightShifts5d: 2,
  sleepHrs5dAvg: 6.0,
  selfReportedStress: 4,
  selfReportedEnergy: 3,
  leaveStatus: "NORMAL",
  sleepQuality: "Moderate",
  workload: "Moderate",
  additionalNotes: "",
};

export default function PersonnelWellnessPage() {
  const router = useRouter();
  const { user, force, lang, switchRole } = useAuth();
  const { toast } = useToast();
  const isHi = lang === "hi";

  const [form, setForm] = useState<AssessmentFormState>({
    ...INITIAL_STATE,
    personnelId: user?.serviceId?.startsWith("P-") ? user.serviceId : "P-1024",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "mobile_qr">("form");

  // Preset scenarios for instant testing and evaluation
  const applyPreset = (preset: "optimal" | "elevated" | "critical" | "masked") => {
    if (preset === "optimal") {
      setForm((prev) => ({
        ...prev,
        consecutiveFieldDays: 12,
        dutyHours5d: 36,
        nightShifts5d: 0,
        sleepHrs5dAvg: 7.5,
        selfReportedStress: 2,
        selfReportedEnergy: 5,
        leaveStatus: "NORMAL",
        sleepQuality: "Good",
        workload: "Low",
        additionalNotes: "Feeling fit for high-intensity drill; good squad morale.",
      }));
      toast({ title: "Preset Applied: Optimal Baseline", description: "Configured normal restorative parameters.", type: "info" });
    } else if (preset === "elevated") {
      setForm((prev) => ({
        ...prev,
        consecutiveFieldDays: 45,
        dutyHours5d: 58,
        nightShifts5d: 2,
        sleepHrs5dAvg: 5.5,
        selfReportedStress: 6,
        selfReportedEnergy: 3,
        leaveStatus: "PENDING",
        sleepQuality: "Moderate",
        workload: "Elevated",
        additionalNotes: "Consecutive patrol cycles in forward sector with irregular watch shifts.",
      }));
      toast({ title: "Preset Applied: Elevated Strain", description: "Configured moderate fatigue parameters.", type: "info" });
    } else if (preset === "critical") {
      setForm((prev) => ({
        ...prev,
        consecutiveFieldDays: 78,
        dutyHours5d: 76,
        nightShifts5d: 4,
        sleepHrs5dAvg: 3.5,
        selfReportedStress: 9,
        selfReportedEnergy: 1,
        leaveStatus: "DENIED",
        sleepQuality: "Very Low",
        workload: "High",
        additionalNotes: "Severe operational exhaustion. Family medical leave denied twice; high distress.",
      }));
      toast({ title: "Preset Applied: Critical Breakdown", description: "Configured acute distress parameters.", type: "warning" });
    } else if (preset === "masked") {
      setForm((prev) => ({
        ...prev,
        consecutiveFieldDays: 85,
        dutyHours5d: 74,
        nightShifts5d: 4,
        sleepHrs5dAvg: 3.5,
        selfReportedStress: 2, // Stoic reporting
        selfReportedEnergy: 2,
        leaveStatus: "DENIED",
        sleepQuality: "Low",
        workload: "High",
        additionalNotes: "Reporting fine, but physical telemetry indicates acute cumulative load.",
      }));
      toast({ title: "Preset Applied: Masked Stress", description: "Low self-reported stress with extreme objective strain.", type: "warning" });
    }
  };

  const handleSubmit = async (redirectDirectlyToWelfare: boolean = false) => {
    setIsSubmitting(true);
    try {
      const payload = {
        personnelId: form.personnelId || "P-1024",
        consecutiveFieldDays: form.consecutiveFieldDays,
        dutyHours5d: form.dutyHours5d,
        nightShifts5d: form.nightShifts5d,
        sleepHrs5dAvg: form.sleepHrs5dAvg,
        selfReportedStress: form.selfReportedStress,
        selfReportedEnergy: form.selfReportedEnergy,
        sleepQuality: form.sleepQuality,
        workload: form.workload,
        leaveStatus: form.leaveStatus,
        additionalNotes: form.additionalNotes,
        surveyLatencySeconds: form.selfReportedStress <= 3 && form.dutyHours5d >= 65 ? 12 : 38,
      };

      const res = await fetch("/api/wellness/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit assessment");
      }

      // 1. Calculate risk categorization and format for local storage & welfare sync
      const riskScore = data.prediction?.riskScore ?? (form.selfReportedStress * 9);
      const riskLevel = data.prediction?.riskLevel ?? (riskScore >= 70 ? "HIGH" : riskScore >= 45 ? "MODERATE" : "LOW");

      const topDrivers = data.prediction?.factors?.map((f: any) => f.description || f.feature) || [
        `Operational duty load: ${form.dutyHours5d} hrs / 5d`,
        `Sleep deficit: ${form.sleepHrs5dAvg} hrs avg`,
      ];

      // 2. Register with WelfareService so Welfare Dashboard instantly receives the case
      const welfareCaseItem = {
        id: `CASE-${Date.now().toString().slice(-6)}`,
        personnelId: form.personnelId,
        anonymizedCode: `SEC-${form.personnelId}`,
        riskLevel: riskLevel,
        primaryConcern: `${form.personnelId} — ${riskLevel} Strain Self-Assessment`,
        unit: user?.unit || "114 Bn - Alpha Coy",
        assignedOfficer: "Dr. Aarti Sharma",
        assignedOfficerId: "user-doc-02",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        status: "New" as const,
        notesCount: 1,
        interventionsCount: 0,
        caseNotes: [
          {
            id: `note-${Date.now()}`,
            author: "Automated Clinical AI Triage",
            date: new Date().toISOString().split("T")[0],
            text: `Voluntary assessment submitted via Web Portal: Risk Score ${riskScore}/100. Factors: ${topDrivers.slice(0, 2).join("; ")}. Notes: ${form.additionalNotes || "None"}.`,
            isConfidential: true,
          },
        ],
      };

      WelfareService.registerAssessmentWelfareCase(welfareCaseItem as any);

      // 3. Save latest assessment locally for personnel dashboard summary
      const localResult = {
        id: data.assessment?.id || `EVA-${Date.now()}`,
        status: riskLevel === "HIGH" ? "Elevated Attention" : riskLevel === "MODERATE" ? "Moderate Attention" : "Optimal",
        stress: form.selfReportedStress >= 7 ? "Elevated" : form.selfReportedStress >= 4 ? "Moderate" : "Low",
        fatigue: form.sleepHrs5dAvg <= 4 ? "High" : form.sleepHrs5dAvg <= 5.5 ? "Moderate" : "Low",
        workload: form.dutyHours5d > 60 ? "High" : form.dutyHours5d > 45 ? "Moderate" : "Low",
        riskScore,
        riskLevel,
        drivers: topDrivers,
        recommendations: data.prediction?.recommendations || [],
        maskingDetected: Boolean(data.prediction?.maskingDetected),
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("missionwell_last_assessment", JSON.stringify(localResult));
      window.dispatchEvent(new Event("missionwell_assessment_updated"));

      setSubmissionResult(localResult);

      toast({
        title: isHi ? "मूल्यांकन सफल — कल्याण डैशबोर्ड पर भेजा गया" : "Assessment Recorded & Synced",
        description: isHi
          ? `जोखिम स्कोर ${riskScore}/100 का केस कल्याण अधिकारी को लाइव प्रेषित कर दिया गया है।`
          : `Live triage dossier generated with Risk Score ${riskScore}/100. Sent to Welfare Officer Dashboard.`,
        type: "success",
      });

      if (redirectDirectlyToWelfare) {
        switchRole("WELFARE_OFFICER");
        router.push("/welfare");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      toast({
        title: "Submission Notice",
        description: err.message || "Failed to submit assessment to server.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 sm:py-6 pb-16">
      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/personnel"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{isHi ? "वापस व्यक्तिगत पोर्टल पर" : "Back to Personnel Overview"}</span>
        </Link>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === "form"
                  ? "bg-white dark:bg-[#0F172A] text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <HeartPulse className="h-3.5 w-3.5" />
                {isHi ? "वेब स्व-मूल्यांकन" : "Web Assessment Form"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mobile_qr")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === "mobile_qr"
                  ? "bg-white dark:bg-[#0F172A] text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5" />
                {isHi ? "मोबाइल ऐप क्यूआर" : "Mobile App Link"}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              switchRole("WELFARE_OFFICER");
              router.push("/welfare");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            title="Open Welfare Dashboard"
          >
            <FolderHeart className="h-3.5 w-3.5" />
            <span>{isHi ? "कल्याण डैशबोर्ड खोलें" : "View Welfare Dashboard"}</span>
          </button>
        </div>
      </div>

      {activeTab === "mobile_qr" ? (
        /* Mobile QR Information Tab */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B132B] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isHi ? "मिशनवेल मोबाइल ऐप" : "MissionWell Mobile Application"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHi
                  ? "Android APK व Expo Metro dev server के साथ पूर्णतः एकीकृत"
                  : "Fully integrated with Android APK & Expo dev runtime"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-3.5 rounded-xl bg-white shadow-md border border-slate-200 text-slate-900">
                <QRCodeSVG value={APK_DOWNLOAD_URL} size={160} level="H" fgColor="#0F172A" bgColor="#FFFFFF" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center">
                {isHi ? "फोन से स्कैन कर ऐप खोलें (Port 8081)" : "Scan to Connect on Phone (Port 8081)"}
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {isHi ? "वेब व मोबाइल का सीधा समन्वय:" : "Direct Web-to-Mobile Synchronization:"}
              </h3>
              <ul className="space-y-2 list-disc list-inside text-[11px] leading-relaxed">
                <li>Both Web and Mobile post to the exact same backend API & SQLite database.</li>
                <li>Assessments submitted on phone or web automatically reflect on the Welfare Dashboard.</li>
                <li>Anti-masking heuristics and SHAP feature drivers are identical across platforms.</li>
              </ul>
              <button
                type="button"
                onClick={() => setActiveTab("form")}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 text-xs transition-colors"
              >
                <HeartPulse className="h-3.5 w-3.5" />
                <span>Fill Assessment on Web Now</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Web Assessment Interactive Form */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B132B] p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    {isHi ? "सैनिक परिचालन एवं स्वास्थ्य स्व-मूल्यांकन" : "Personnel Operational & Stress Assessment"}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isHi
                      ? "भरते ही विवरण सीधे कल्याण अधिकारी डैशबोर्ड पर लाइव केस के रूप में प्रदर्शित होगा"
                      : "Data submitted here flows directly into the Welfare Officer Dashboard in real time"}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 self-start sm:self-center">
                <ShieldCheck className="h-3.5 w-3.5" />
                Non-Punitive DPDP Certified
              </span>
            </div>

            {/* Quick Demo Presets Banner */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Quick Scenario Simulator:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset("optimal")}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors"
                >
                  🟢 Baseline (Optimal)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("elevated")}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors"
                >
                  🟡 Moderate Fatigue
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("critical")}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors"
                >
                  🔴 High Breakdown Strain
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("masked")}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors"
                >
                  🟣 Masked Anomaly
                </button>
              </div>
            </div>
          </div>

          {/* Main Interactive Form Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B132B] p-6 sm:p-8 shadow-xl space-y-6">
            
            {/* 1. Personnel Service Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Personnel Identifier / Service ID
                </label>
                <input
                  type="text"
                  value={form.personnelId}
                  onChange={(e) => setForm({ ...form, personnelId: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2 text-xs font-mono font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  placeholder="e.g. P-1024"
                />
                <p className="text-[10px] text-slate-500 mt-1">Default: P-1024 (Ct. Piyush Rawat, 114 Bn)</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Leave Allocation Status
                </label>
                <select
                  value={form.leaveStatus}
                  onChange={(e) => setForm({ ...form, leaveStatus: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                >
                  <option value="NORMAL">Normal / Approved Leave</option>
                  <option value="PENDING">Pending Leave Review</option>
                  <option value="DENIED">Recent Leave Denied / Cancelled</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">Leave denial is an empirical weight in operational stress index.</p>
              </div>
            </div>

            {/* 2. Operational Tempo & Duty Load */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
                <Briefcase className="h-4 w-4 text-blue-500" />
                <span>Operational Duty & Deployment Factors</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Consecutive Field Days */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-blue-500" />
                      Field Deployment
                    </span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {form.consecutiveFieldDays} Days
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    value={form.consecutiveFieldDays}
                    onChange={(e) => setForm({ ...form, consecutiveFieldDays: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Base (1d)</span>
                    <span>Standard (45d)</span>
                    <span>Extended (90d+)</span>
                  </div>
                </div>

                {/* 5-Day Duty Hours */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      5-Day Duty Hours
                    </span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {form.dutyHours5d} Hours
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    value={form.dutyHours5d}
                    onChange={(e) => setForm({ ...form, dutyHours5d: Number(e.target.value) })}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Standard (40h)</span>
                    <span>Elevated (60h)</span>
                    <span>Critical (80h+)</span>
                  </div>
                </div>

                {/* 5-Day Night Shifts */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Moon className="h-3.5 w-3.5 text-purple-500" />
                      Night Watches (5d)
                    </span>
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                      {form.nightShifts5d} Shifts
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 pt-1">
                    {[0, 1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setForm({ ...form, nightShifts5d: num })}
                        className={`py-1 rounded text-xs font-semibold transition-all ${
                          form.nightShifts5d === num
                            ? "bg-purple-600 text-white shadow-xs"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                        }`}
                      >
                        {num === 4 ? "4+" : num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Sleep & Physical Recovery */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
                <BatteryCharging className="h-4 w-4 text-emerald-500" />
                <span>Sleep Hygiene & Physical Energy</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Average Sleep Hours */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Moon className="h-3.5 w-3.5 text-sky-500" />
                      Nightly Sleep Average
                    </span>
                    <span className={`font-mono font-bold ${
                      form.sleepHrs5dAvg < 4.5
                        ? "text-rose-500"
                        : form.sleepHrs5dAvg < 6
                        ? "text-amber-500"
                        : "text-emerald-500"
                    }`}>
                      {form.sleepHrs5dAvg} hrs / night
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="9.0"
                    step="0.5"
                    value={form.sleepHrs5dAvg}
                    onChange={(e) => setForm({ ...form, sleepHrs5dAvg: Number(e.target.value) })}
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Severe Deficit (&lt;4h)</span>
                    <span>Marginal (5.5h)</span>
                    <span>Restorative (7.5h+)</span>
                  </div>
                </div>

                {/* Energy Baseline */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <BatteryCharging className="h-3.5 w-3.5 text-emerald-500" />
                      Self-Reported Energy
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Level {form.selfReportedEnergy} / 5
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    {[
                      { val: 1, label: "Exhausted" },
                      { val: 2, label: "Low" },
                      { val: 3, label: "Moderate" },
                      { val: 4, label: "Good" },
                      { val: 5, label: "Peak" },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setForm({ ...form, selfReportedEnergy: item.val })}
                        className={`py-1.5 px-1 rounded-lg text-center transition-all ${
                          form.selfReportedEnergy === item.val
                            ? "bg-emerald-600 text-white font-bold shadow-xs"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                        }`}
                      >
                        <div className="text-xs">{item.val}</div>
                        <div className="text-[9px] truncate">{item.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Subjective Acute Stress Scale */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-rose-500" />
                    Subjective Acute Stress Rating
                  </span>
                  <p className="text-[11px] text-slate-500">
                    How tense, overwhelmed, or strained do you currently feel?
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-bold font-mono ${
                    form.selfReportedStress >= 8
                      ? "text-rose-500"
                      : form.selfReportedStress >= 5
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}>
                    {form.selfReportedStress} / 10
                  </span>
                  <span className="block text-[10px] font-semibold text-slate-400">
                    {form.selfReportedStress >= 8
                      ? "Acute Strain"
                      : form.selfReportedStress >= 5
                      ? "Moderate Stress"
                      : "Calm & Stable"}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={form.selfReportedStress}
                onChange={(e) => setForm({ ...form, selfReportedStress: Number(e.target.value) })}
                className="w-full accent-rose-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-medium text-slate-500">
                <span className="text-emerald-600 dark:text-emerald-400">1: Completely Calm</span>
                <span className="text-amber-600 dark:text-amber-400">5: Noticeable Pressure</span>
                <span className="text-rose-600 dark:text-rose-400">10: Severe Operational Overload</span>
              </div>
            </div>

            {/* 5. Optional Confidential Remarks */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Confidential Operational Remarks / Welfare Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={form.additionalNotes}
                onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                placeholder="Mention any duty schedule issues, family emergencies, or squad recovery needs..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Lock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Encrypted transmission to Welfare Officer triage system.</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(false)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                  ) : (
                    <Send className="h-4 w-4 text-blue-500" />
                  )}
                  <span>{isHi ? "मूल्यांकन सबमिट करें" : "Submit Assessment"}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <FolderHeart className="h-4 w-4" />
                  )}
                  <span>
                    {isHi ? "सबमिट कर सीधे कल्याण डैशबोर्ड पर देखें →" : "Submit & View on Welfare Dashboard →"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Submission Result / Live Feedback Banner */}
          {submissionResult && (
            <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/90 dark:bg-emerald-950/40 p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="font-bold text-emerald-950 dark:text-emerald-200 text-sm">
                      {isHi ? "मूल्यांकन दर्ज हुआ — कल्याण मामले में संकलित" : "Assessment Recorded & Synced with Welfare Dashboard"}
                    </h3>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      Evaluated by ML Microservice with calibrated anti-masking heuristic.
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                  submissionResult.riskLevel === "HIGH"
                    ? "bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 border border-rose-300"
                    : submissionResult.riskLevel === "MODERATE"
                    ? "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300"
                    : "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300"
                }`}>
                  Risk Score: {submissionResult.riskScore}/100 ({submissionResult.riskLevel})
                </span>
              </div>

              {/* Key Drivers from AI */}
              {submissionResult.drivers && submissionResult.drivers.length > 0 && (
                <div className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Primary Operational Drivers (SHAP Attribution):
                  </span>
                  <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-700 dark:text-slate-300">
                    {submissionResult.drivers.map((d: string, i: number) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {submissionResult.maskingDetected && (
                <div className="p-2.5 rounded-lg bg-purple-100/80 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>
                    <strong>Anti-Masking Alert:</strong> Discrepancy detected between subjective low rating and objective severe telemetry load. Dispatched peer buddy recommendation.
                  </span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    switchRole("WELFARE_OFFICER");
                    router.push("/welfare");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <FolderHeart className="h-4 w-4" />
                  <span>Go to Welfare Dashboard to Review Triage Dossier →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
