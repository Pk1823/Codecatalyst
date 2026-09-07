"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  HeartPulse,
  Activity,
  Sliders,
  CheckCircle2,
  Info,
  PhoneCall,
  Languages,
  KeyRound,
  FileCheck,
  Building2,
  Sparkles,
} from "lucide-react";
import { useAuth, ForceType } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { MOCK_USERS } from "@/lib/mock-data/users";
import { FORCES_METADATA } from "@/lib/force-metadata";
import { DemoBanner } from "@/components/layout/demo-banner";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, force, setForce, lang, toggleLang } = useAuth();

  const [authMode, setAuthMode] = useState<"quick_persona" | "service_id">("quick_persona");
  const [selectedForce, setSelectedForce] = useState<ForceType>(force || "CRPF");
  const [serviceId, setServiceId] = useState("CRPF-GD-2021-04128");
  const [otpCode, setOtpCode] = useState("892104");
  const [selectedRole, setSelectedRole] = useState<UserRole>("WELFARE_OFFICER");

  const meta = FORCES_METADATA[selectedForce] || FORCES_METADATA.CRPF;
  const isHi = lang === "hi";

  const handleDemoSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "PERSONNEL") setServiceId(meta.sampleServiceId);
    else if (role === "WELFARE_OFFICER") setServiceId("MED-DIR-0881");
    else if (role === "COMMANDER") setServiceId("CMD-SECTOR-01");
    else if (role === "ADMIN") setServiceId("NIC-SYS-9940");
  };

  const handleForceChange = (f: ForceType) => {
    setSelectedForce(f);
    setForce(f);
    const newMeta = FORCES_METADATA[f];
    if (selectedRole === "PERSONNEL") setServiceId(newMeta.sampleServiceId);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setForce(selectedForce);
    switchRole(selectedRole);

    if (selectedRole === "PERSONNEL") router.push("/personnel");
    else if (selectedRole === "WELFARE_OFFICER") router.push("/welfare");
    else if (selectedRole === "COMMANDER") router.push("/commander");
    else if (selectedRole === "ADMIN") router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <DemoBanner />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
          {/* Left Column: MissionWell AI Brand & Doctrine (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            <div>
              <div className="flex items-center justify-between">
                <Link href="/" className="inline-flex items-center gap-3 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-blue-700 to-teal-500 shadow-md border border-amber-400/40">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-extrabold text-lg text-white">MissionWell</span>{" "}
                    <span className="text-teal-400 font-bold font-mono">AI</span>
                    <span className="block text-[10px] text-slate-400 font-medium">
                      {isHi ? "सशस्त्र बल कल्याण पोर्टल" : "Forces Welfare Intelligence"}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={toggleLang}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-teal-300 hover:bg-slate-800"
                >
                  <Languages className="h-3.5 w-3.5" />
                  <span>{isHi ? "EN" : "हिन्दी"}</span>
                </button>
              </div>

              <div className="mt-8 space-y-4">
                <span className="inline-block rounded-full bg-amber-500/20 px-2.5 py-1 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                  SIH PS 26186 • MHA / Police II Division
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                  {isHi
                    ? "सुरक्षित, सशक्त बलों हेतु पूर्वानुमानात्मक कल्याण मंच"
                    : "Predictive Wellness Monitoring for Safer, Stronger Forces"}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isHi
                    ? "भारतीय सेना, सीएपीएफ (CRPF, BSF, ITBP, CISF) और राज्य पुलिस बलों के लिए मानवीय, गैर-दंडात्मक कल्याण प्रणाली।"
                    : "Ethical, human-in-the-loop welfare intelligence. Early stress identification with zero career prejudice or ACR penalty."}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isHi ? "सैनिक सम्मान एवं डिग्निटी सुरक्षा" : "Personnel Dignity Safeguard"}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isHi
                      ? "कल्याणकारी डेटा कभी भी अनुशासनात्मक कार्रवाई या पदोन्नति में बाधा नहीं बनेगा। यह केवल सहायता एवं विश्राम रोटेशन हेतु है।"
                      : '"Personnel wellbeing is mission readiness." Wellness disclosures are strictly confidential and never used for disciplinary evaluations.'}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-950/40 border border-blue-900/50 p-3 text-[11px] text-blue-200 flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>
                    <strong>24x7 Force Helpline:</strong> <span className="font-mono text-teal-300">14416 / 1800-599-0019</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="text-amber-400 font-mono">RESTRICTED // OFFICIAL</span>
              <span>DPDP Act 2023 Compliant</span>
            </div>
          </div>

          {/* Right Column: Secure Form & Demo Switcher (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-slate-900/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {isHi ? "आधिकारिक पोर्टल प्रवेश" : "Official Portal Sign-In"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isHi ? "सशस्त्र बल शाखा चुनें या 1-क्लिक टेस्ट क्रेडेंशियल्स का उपयोग करें" : "Select your force branch or evaluate directly via 1-click persona"}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-blue-900/40 text-blue-400 border border-blue-800/40">
                  <Lock className="h-5 w-5" />
                </div>
              </div>

              {/* Force Branch Selection Tabs */}
              <div className="mb-5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {isHi ? "1. वर्दीधारी सेवा शाखा का चयन करें" : "1. Select Uniformed Service Branch"}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {(
                    [
                      { id: "CRPF", label: "CRPF" },
                      { id: "ARMY", label: "Army" },
                      { id: "BSF", label: "BSF" },
                      { id: "ITBP", label: "ITBP" },
                      { id: "CISF", label: "CISF" },
                      { id: "STATE_POLICE", label: "Police" },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleForceChange(f.id)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all text-center ${
                        selectedForce === f.id
                          ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                          : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-750"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auth Mode Tabs */}
              <div className="flex items-center gap-2 mb-4 p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setAuthMode("quick_persona")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    authMode === "quick_persona"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>{isHi ? "1-क्लिक परीक्षक प्रवेश (अनुशंसित)" : "1-Click Evaluation Mode (Recommended)"}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("service_id")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    authMode === "service_id"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>{isHi ? "सर्विस नंबर + OTP" : "Service ID + OTP"}</span>
                  </span>
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSignIn} className="space-y-4">
                {authMode === "service_id" ? (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {isHi ? "आधिकारिक सर्विस नंबर / PIS No. / Army No." : "Official Service Number / PIS No. / Army No."}
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          value={serviceId}
                          onChange={(e) => setServiceId(e.target.value)}
                          required
                          placeholder="e.g. CRPF-GD-2021-04128"
                          className="w-full rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {isHi ? "Sandes ऐप / NIC 6-अंकीय सुरक्षित OTP" : "Sandes App / NIC 6-Digit Secure OTP"}
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          required
                          maxLength={6}
                          className="w-full rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono tracking-widest"
                        />
                      </div>
                      <span className="block text-[10px] text-teal-400 mt-1">
                        ✓ {isHi ? "परीक्षण हेतु OTP स्वतः भरा गया है (892104)" : "Simulated OTP pre-filled for hackathon review (892104)"}
                      </span>
                    </div>
                  </>
                ) : (
                  /* 1-Click Evaluation Persona Cards */
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {isHi ? "2. मूल्यांकन हेतु आधिकारिक पद चुनें" : "2. Select Official Role to Test"}
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        {
                          role: "PERSONNEL" as UserRole,
                          title: isHi ? "जवान / आरक्षक" : "Personnel View",
                          name: meta.samplePersonnelName,
                          desc: isHi ? "स्व-मूल्यांकन व बडी-पेयर जांच" : "Self-report & Buddy watch",
                          icon: HeartPulse,
                          color: "text-emerald-400 border-emerald-900/40 bg-emerald-950/30",
                        },
                        {
                          role: "WELFARE_OFFICER" as UserRole,
                          title: isHi ? "कल्याण अधिकारी / डॉक्टर" : "Welfare Officer View",
                          name: meta.sampleOfficerName,
                          desc: isHi ? "सक्रिय मामले व रोटेशन सुझाव" : "Case triage & rotation care",
                          icon: UserCheck,
                          color: "text-blue-400 border-blue-900/40 bg-blue-950/30",
                        },
                        {
                          role: "COMMANDER" as UserRole,
                          title: isHi ? "बटालियन कमान / कमांडेंट" : "Commander View",
                          name: meta.sampleCommanderName,
                          desc: isHi ? "कंपनी-वार रोल-कॉल दबाव" : "Readiness & stress heatmap",
                          icon: Activity,
                          color: "text-purple-400 border-purple-900/40 bg-purple-950/30",
                        },
                        {
                          role: "ADMIN" as UserRole,
                          title: isHi ? "सिस्टम प्रशासक" : "Admin & Audit View",
                          name: "Sunil Patel (NIC/MHA)",
                          desc: isHi ? "डीपीडीपी 2023 ऑडिट लॉग" : "Zero-trust cryptologs",
                          icon: Sliders,
                          color: "text-amber-400 border-amber-900/40 bg-amber-950/30",
                        },
                      ].map((demo) => {
                        const DIcon = demo.icon;
                        const isSelected = selectedRole === demo.role;
                        return (
                          <button
                            key={demo.role}
                            type="button"
                            onClick={() => handleDemoSelect(demo.role)}
                            className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                              isSelected
                                ? "border-amber-400 bg-amber-950/30 ring-1 ring-amber-400"
                                : "border-slate-800 bg-slate-800/40 hover:bg-slate-800/80"
                            }`}
                          >
                            <div className={`p-2 rounded-lg border shrink-0 ${demo.color}`}>
                              <DIcon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{demo.title}</p>
                              <p className="text-[11px] text-amber-300/90 font-medium truncate">{demo.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{demo.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-teal-600 hover:from-blue-600 hover:to-teal-500 text-white py-3 text-xs sm:text-sm font-bold shadow-lg shadow-blue-900/50 transition-all hover:scale-[1.01]"
                >
                  <span>
                    {isHi
                      ? `${selectedForce} पोर्टल में प्रवेश करें (${selectedRole.replace("_", " ")})`
                      : `Enter ${selectedForce} Portal as ${selectedRole.replace("_", " ")}`}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-slate-500" />
                <span>Synthetic Environment • SIH PS 26186</span>
              </span>
              <Link href="/" className="text-teal-400 hover:underline">
                {isHi ? "← मुख्य पृष्ठ" : "← Back to Home"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
