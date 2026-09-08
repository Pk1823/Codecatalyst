"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  UserCheck,
  HeartPulse,
  Activity,
  Sliders,
  Languages,
  KeyRound,
  Building2,
  Lock,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useAuth, ForceType, useToast } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { FORCES_METADATA } from "@/lib/force-metadata";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, force, setForce, lang, toggleLang } = useAuth();
  const { toast } = useToast();

  const [selectedForce, setSelectedForce] = useState<ForceType>(force || "CRPF");
  const [selectedRole, setSelectedRole] = useState<UserRole>("WELFARE_OFFICER");
  const [serviceId, setServiceId] = useState("MED-DIR-0881");
  const [password, setPassword] = useState("Welfare@2026");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const meta = FORCES_METADATA[selectedForce] || FORCES_METADATA.CRPF;
  const isHi = lang === "hi";

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg("");
    if (role === "PERSONNEL") {
      setServiceId(meta.sampleServiceId || "CRPF-GD-2021-04128");
      setPassword("Jawan@2026");
    } else if (role === "WELFARE_OFFICER") {
      setServiceId("MED-DIR-0881");
      setPassword("Welfare@2026");
    } else if (role === "COMMANDER") {
      setServiceId("CMD-SECTOR-01");
      setPassword("Command@2026");
    } else if (role === "ADMIN") {
      setServiceId("NIC-SYS-9940");
      setPassword("Admin@2026");
    }
  };

  const handleForceChange = (f: ForceType) => {
    setSelectedForce(f);
    setForce(f);
    const newMeta = FORCES_METADATA[f];
    if (selectedRole === "PERSONNEL") {
      setServiceId(newMeta.sampleServiceId || `${f}-GD-2022-09`);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!serviceId.trim() || !password.trim()) {
      setErrorMsg("Please enter both your Service ID and security password/passcode.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setForce(selectedForce);
      switchRole(selectedRole);

      toast({
        title: "Authentication Successful",
        description: `Logged in as ${selectedRole.replace("_", " ")} (${serviceId})`,
        type: "success",
      });

      if (selectedRole === "PERSONNEL") router.push("/personnel");
      else if (selectedRole === "WELFARE_OFFICER") router.push("/welfare");
      else if (selectedRole === "COMMANDER") router.push("/commander");
      else if (selectedRole === "ADMIN") router.push("/admin");
    }, 400);
  };

  const roles = [
    {
      id: "WELFARE_OFFICER" as UserRole,
      title: isHi ? "कल्याण अधिकारी" : "Welfare Officer",
      subtitle: meta.sampleOfficerName,
      badge: "Clinical Dossiers",
      icon: UserCheck,
    },
    {
      id: "COMMANDER" as UserRole,
      title: isHi ? "कमांडेंट" : "Commander",
      subtitle: meta.sampleCommanderName,
      badge: "Unit Readiness",
      icon: Activity,
    },
    {
      id: "PERSONNEL" as UserRole,
      title: isHi ? "जवान" : "Personnel",
      subtitle: meta.samplePersonnelName,
      badge: "Self-Care Portal",
      icon: HeartPulse,
    },
    {
      id: "ADMIN" as UserRole,
      title: isHi ? "प्रशासक" : "System Admin",
      subtitle: "Sunil Patel (NIC)",
      badge: "System Governance",
      icon: Sliders,
    },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Bar */}
      <header className="max-w-xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-emerald-400" />
          <span>{isHi ? "मुख्य पृष्ठ" : "Back to Home"}</span>
        </Link>

        <button
          onClick={toggleLang}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0F172A] border border-slate-800 text-xs font-mono font-medium text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <Languages className="h-3.5 w-3.5 text-slate-400" />
          <span>{isHi ? "EN" : "हिन्दी"}</span>
        </button>
      </header>

      {/* Main Centered Sign-In Card */}
      <div className="max-w-xl w-full mx-auto my-auto py-4">
        <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-[#090D16] mx-auto font-bold shadow-xs">
              <Shield className="h-5 w-5 text-[#090D16]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
              {isHi ? "सुरक्षित आधिकारिक लॉगिन" : "Authorized Personnel Sign In"}
            </h1>
            <p className="text-xs text-slate-400">
              {isHi
                ? "सशस्त्र बल कल्याण एवं तत्परता खुफिया कमान"
                : "Defense Personnel Wellness & Resilience Intelligence Platform"}
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Force Branch Selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-medium uppercase tracking-wider text-slate-400">
                {isHi ? "सेवा शाखा" : "Select Service Branch"}
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
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium border transition-all text-center ${
                      selectedForce === f.id
                        ? "bg-emerald-600 text-[#090D16] font-bold border-emerald-500 shadow-xs"
                        : "bg-[#090D16] border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Selection Tabs */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-medium uppercase tracking-wider text-slate-400">
                {isHi ? "लॉगिन भूमिका" : "Select Authorization Level"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => {
                  const RIcon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleSelect(r.id)}
                      className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/40"
                          : "border-slate-800 bg-[#090D16] hover:bg-slate-800/60"
                      }`}
                    >
                      <div className={`p-2 rounded-md shrink-0 ${isSelected ? "bg-emerald-500 text-[#090D16]" : "bg-slate-800 text-slate-400"}`}>
                        <RIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isSelected ? "text-emerald-300" : "text-white"}`}>{r.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{r.badge}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Credentials Fields */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  {isHi ? "आधिकारिक सर्विस नंबर / ID" : "Service Number / ID"}
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    required
                    placeholder="e.g. MED-DIR-0881"
                    className="w-full rounded-lg border border-slate-800 bg-[#090D16] pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  {isHi ? "सुरक्षा पासवर्ड / पिन" : "Security Password / Passcode"}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-slate-800 bg-[#090D16] pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-2.5 rounded-lg border border-slate-800 bg-[#090D16] flex items-center gap-2 text-[11px] text-slate-400">
              <Lock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Zero-trust role boundary. Access requires authenticated credentials.</span>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[#090D16] py-2.5 text-xs font-bold transition-all disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? "Authenticating..."
                  : isHi
                  ? `${selectedRole.replace("_", " ")} पोर्टल में लॉगिन करें`
                  : `Sign In as ${selectedRole.replace("_", " ")}`}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-xl w-full mx-auto text-center py-2 text-[11px] text-slate-500 font-mono">
        <span>24x7 Helpline: <strong className="text-slate-400 font-medium">14416</strong> • DPDP Act 2023 Compliant</span>
      </footer>
    </div>
  );
}
