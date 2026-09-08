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
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Mail,
  CheckCircle2,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { useAuth, ForceType, useToast, useTheme } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { FORCES_METADATA } from "@/lib/force-metadata";
import { AuthService } from "@/services/auth.service";

type AuthTab = "credentials" | "google" | "personas";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, force, setForce, lang, toggleLang } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();

  const [authTab, setAuthTab] = useState<AuthTab>("credentials");
  const [selectedForce, setSelectedForce] = useState<ForceType>(force || "CRPF");
  const [selectedRole, setSelectedRole] = useState<UserRole>("WELFARE_OFFICER");

  // Credentials State
  const [serviceId, setServiceId] = useState("MED-DIR-0881");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);

  // Google / Custom Email State
  const [googleEmail, setGoogleEmail] = useState("dr.aarti.welfare@gmail.com");
  const [googleName, setGoogleName] = useState("Dr. Aarti Sharma");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const meta = FORCES_METADATA[selectedForce] || FORCES_METADATA.CRPF;
  const isHi = lang === "hi";

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg("");
    if (role === "PERSONNEL") {
      setServiceId(meta.sampleServiceId || "CRPF-GD-2021-04128");
      setPassword("demo123");
      setGoogleEmail("ct.piyush.jawan@gmail.com");
      setGoogleName(meta.samplePersonnelName);
    } else if (role === "WELFARE_OFFICER") {
      setServiceId("MED-DIR-0881");
      setPassword("demo123");
      setGoogleEmail("dr.aarti.welfare@gmail.com");
      setGoogleName(meta.sampleOfficerName);
    } else if (role === "COMMANDER") {
      setServiceId("CMD-SECTOR-01");
      setPassword("demo123");
      setGoogleEmail("col.vikram.tactical@gmail.com");
      setGoogleName(meta.sampleCommanderName);
    } else if (role === "ADMIN") {
      setServiceId("NIC-SYS-9940");
      setPassword("demo123");
      setGoogleEmail("patel.admin.nic@gmail.com");
      setGoogleName("Sh. R.K. Patel");
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

  const handleSignInWithCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!serviceId.trim() || !password.trim()) {
      setErrorMsg(
        isHi
          ? "कृपया सर्विस ID / ईमेल और पासवर्ड दोनों दर्ज करें।"
          : "Please enter both Service ID / Email and security password."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      setForce(selectedForce);
      const user = await AuthService.loginWithCredentials(
        serviceId,
        password,
        selectedRole,
        selectedForce
      );
      const targetRole = (user?.role as UserRole) || selectedRole;
      switchRole(targetRole);

      toast({
        title: isHi ? "प्रमाणीकरण सफल" : "Authentication Successful",
        description: `${isHi ? "लॉगिन हुआ" : "Connected as"} ${user.name || targetRole} (${user.serviceId || serviceId})`,
        type: "success",
      });

      router.push(AuthService.getRedirectPathForRole(targetRole));
    } catch (err: any) {
      setErrorMsg(err?.message || "Invalid credentials. Please verify your ID and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignInWithGoogle = async (customEmail?: string, customName?: string) => {
    setErrorMsg("");
    const emailToUse = customEmail || googleEmail;
    const nameToUse = customName || googleName;

    if (!emailToUse || !emailToUse.includes("@")) {
      setErrorMsg(isHi ? "कृपया वैध Gmail या ईमेल पता दर्ज करें।" : "Please enter a valid Gmail address.");
      return;
    }

    setIsSubmitting(true);
    try {
      setForce(selectedForce);
      const user = await AuthService.loginWithGoogle(
        emailToUse,
        nameToUse,
        selectedRole,
        selectedForce
      );
      const targetRole = (user?.role as UserRole) || selectedRole;
      switchRole(targetRole);

      toast({
        title: isHi ? "Google प्रमाणीकरण सफल" : "Google Authentication Successful",
        description: `${isHi ? "खाता" : "Account"}: ${emailToUse} (${targetRole})`,
        type: "success",
      });

      router.push(AuthService.getRedirectPathForRole(targetRole));
    } catch (err: any) {
      setErrorMsg(err?.message || "Google authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignInWithPersona = async (role: UserRole) => {
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      setForce(selectedForce);
      const user = await AuthService.loginWithPersona(role, selectedForce);
      const targetRole = (user?.role as UserRole) || role;
      switchRole(targetRole);

      toast({
        title: isHi ? "परीक्षक प्रवेश सफल" : "Evaluation Access Granted",
        description: `Logged in as ${targetRole.replace("_", " ")}`,
        type: "success",
      });

      router.push(AuthService.getRedirectPathForRole(targetRole));
    } catch (err: any) {
      setErrorMsg(err?.message || "Persona login failed.");
    } finally {
      setIsSubmitting(false);
    }
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
      subtitle: "Sh. R.K. Patel (NIC)",
      badge: "System Governance",
      icon: Sliders,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans transition-colors duration-200">
      {/* Top Bar */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{isHi ? "मुख्य पृष्ठ" : "Back to Home"}</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Quick Theme Switcher */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs transition-colors"
            title={`Active: ${resolvedTheme}. Click to switch theme.`}
            aria-label="Toggle theme appearance"
          >
            {resolvedTheme === "dark" ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-blue-500" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs transition-colors"
          >
            <Languages className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>{isHi ? "EN" : "हिन्दी"}</span>
          </button>
        </div>
      </header>

      {/* Main Centered Sign-In Card */}
      <div className="max-w-2xl w-full mx-auto my-auto py-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-8 shadow-xl dark:shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mx-auto font-bold shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/30">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              {isHi ? "सुरक्षित आधिकारिक लॉगिन" : "Authorized Defense & Welfare Sign In"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHi
                ? "सशस्त्र बल कल्याण एवं तत्परता खुफिया कमान • डेटाबेस प्रमाणित"
                : "Predictive Personnel Stress & Welfare Monitoring System • Database Verified"}
            </p>
          </div>

          {/* Authentication Mode Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthTab("credentials");
                setErrorMsg("");
              }}
              className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authTab === "credentials"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span className="truncate">{isHi ? "ID एवं पासवर्ड" : "ID & Password"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthTab("google");
                setErrorMsg("");
              }}
              className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authTab === "google"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{isHi ? "Gmail / अन्य खाता" : "Gmail / Other"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthTab("personas");
                setErrorMsg("");
              }}
              className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authTab === "personas"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-300" />
              <span className="truncate">{isHi ? "1-क्लिक टेस्ट" : "1-Click Persona"}</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Force Branch Selector (Available on all tabs) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isHi ? "1. सेवा शाखा चुनें" : "1. Select Uniformed Service Branch"}
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
                      ? "bg-emerald-600 text-white font-bold border-emerald-500 shadow-xs"
                      : "bg-slate-50 dark:bg-[#090D16] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: ID & PASSWORD LOGIN */}
          {authTab === "credentials" && (
            <form onSubmit={handleSignInWithCredentials} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {isHi ? "2. प्राधिकृत भूमिका चुनें" : "2. Select Authorization Level"}
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
                            : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-md shrink-0 ${
                            isSelected ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <RIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-bold truncate ${
                              isSelected ? "text-emerald-700 dark:text-emerald-300" : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {r.title}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">
                            {r.badge}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Fill Demo Credentials */}
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16]/60">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-mono">{isHi ? "त्वरित डेटाबेस परीक्षण क्रेडेंशियल्स:" : "Quick Database Test Credentials:"}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">Pass: demo123</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleSelect("WELFARE_OFFICER");
                      setServiceId("MED-DIR-0881");
                      setPassword("demo123");
                    }}
                    className="px-2 py-1 rounded-md bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 hover:border-emerald-500 truncate shadow-2xs"
                  >
                    Dr. Aarti (Welfare)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleSelect("COMMANDER");
                      setServiceId("CMD-SECTOR-01");
                      setPassword("demo123");
                    }}
                    className="px-2 py-1 rounded-md bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 hover:border-emerald-500 truncate shadow-2xs"
                  >
                    Col. Vikram (Cmd)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleSelect("PERSONNEL");
                      setServiceId("CRPF-GD-2021-04128");
                      setPassword("demo123");
                    }}
                    className="px-2 py-1 rounded-md bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 hover:border-emerald-500 truncate shadow-2xs"
                  >
                    Ct. Rawat (Jawan)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleSelect("ADMIN");
                      setServiceId("NIC-SYS-9940");
                      setPassword("demo123");
                    }}
                    className="px-2 py-1 rounded-md bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 hover:border-emerald-500 truncate shadow-2xs"
                  >
                    Sh. Patel (Admin)
                  </button>
                </div>
              </div>

              {/* Credentials Input Fields */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                    {isHi ? "आधिकारिक सर्विस नंबर / ईमेल" : "Service Number / Official Email"}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      required
                      placeholder="e.g. CRPF-GD-2021-04128 or rawat.piyush@crpf.gov.in"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                      {isHi ? "सुरक्षा पासवर्ड / पिन" : "Security Password / Passcode"}
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">Default: demo123</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] pl-9 pr-10 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Zero-trust role boundary. All session access verified via encrypted database JWT.</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-emerald-500/20"
              >
                <span>
                  {isSubmitting
                    ? isHi ? "डेटाबेस सत्यापन हो रहा है..." : "Verifying against Database..."
                    : isHi
                    ? `${selectedRole.replace("_", " ")} के रूप में लॉगिन करें`
                    : `Sign In with ID & Password (${selectedRole.replace("_", " ")})`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* TAB 2: GOOGLE / GMAIL & OTHER ACCOUNT */}
          {authTab === "google" && (
            <div className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {isHi ? "2. खाते की भूमिका निर्धारित करें" : "2. Assign Authorization Level for Gmail Account"}
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
                            : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-md shrink-0 ${
                            isSelected ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <RIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-bold truncate ${
                              isSelected ? "text-emerald-700 dark:text-emerald-300" : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {r.title}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">
                            {r.badge}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Official Google SSO Button */}
              <button
                type="button"
                onClick={() => handleSignInWithGoogle()}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 dark:border-transparent text-slate-800 py-3 text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {isSubmitting
                    ? isHi ? "Google से जुड़ रहा है..." : "Connecting to Google..."
                    : `Continue with Google (${googleEmail.split("@")[0]})`}
                </span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="shrink mx-4 text-[10px] text-slate-500 uppercase font-mono">
                  {isHi ? "या कोई भी Gmail / अन्य खाता दर्ज करें" : "Or enter any Gmail / Other account"}
                </span>
                <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              {/* Custom Gmail / Email Input */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                    {isHi ? "Gmail अथवा ईमेल पता" : "Gmail or Other Account Address"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      required
                      placeholder="e.g. officer.sharma@gmail.com or personal@gmail.com"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                    {isHi ? "अधिकारी / कार्मिक का नाम (वैकल्पिक)" : "Personnel Full Name (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="e.g. Dr. Aarti Sharma"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono shadow-2xs"
                  />
                </div>

                {/* Instant Gmail Switchers */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { email: "dr.aarti.welfare@gmail.com", role: "WELFARE_OFFICER" as UserRole, label: "Aarti (Gmail)" },
                    { email: "col.vikram.tactical@gmail.com", role: "COMMANDER" as UserRole, label: "Vikram (Gmail)" },
                    { email: "ct.piyush.jawan@gmail.com", role: "PERSONNEL" as UserRole, label: "Piyush (Gmail)" },
                    { email: "custom.officer@gmail.com", role: "WELFARE_OFFICER" as UserRole, label: "Custom Gmail" },
                  ].map((preset) => (
                    <button
                      key={preset.email}
                      type="button"
                      onClick={() => {
                        setGoogleEmail(preset.email);
                        handleRoleSelect(preset.role);
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                        googleEmail === preset.email
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-2xs"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Authorize Button */}
              <button
                type="button"
                onClick={() => handleSignInWithGoogle()}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-emerald-500/20"
              >
                <span>
                  {isSubmitting
                    ? isHi ? "खाता प्रमाणित हो रहा है..." : "Authorizing & Syncing to Database..."
                    : isHi
                    ? `इस Gmail से प्रवेश करें (${selectedRole.replace("_", " ")})`
                    : `Sign In with Gmail as ${selectedRole.replace("_", " ")}`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-[10px] text-slate-500 text-center font-mono">
                ✓ Auto-provisions database account if signing in for the first time.
              </p>
            </div>
          )}

          {/* TAB 3: 1-CLICK EVALUATION PERSONAS */}
          {authTab === "personas" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHi
                  ? "परीक्षण एवं मूल्यांकन हेतु 1-क्लिक में किसी भी भूमिका के रूप में सीधा प्रवेश करें:"
                  : "Instant evaluator sandbox: Select any official role below to immediately access that portal view:"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    role: "WELFARE_OFFICER" as UserRole,
                    title: isHi ? "कल्याण अधिकारी / डॉक्टर" : "Welfare Officer Dossier",
                    name: meta.sampleOfficerName,
                    desc: isHi ? "सक्रिय मामले, तनाव स्कोर व रोटेशन सुझाव" : "Case triage, clinical distress radar & rotation care",
                    icon: UserCheck,
                    color: "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/30",
                  },
                  {
                    role: "COMMANDER" as UserRole,
                    title: isHi ? "बटालियन कमान / कमांडेंट" : "Commander Readiness View",
                    name: meta.sampleCommanderName,
                    desc: isHi ? "कंपनी-वार रोल-कॉल दबाव एवं हीटमैप" : "Anonymized unit stress heatmap & tactical readiness",
                    icon: Activity,
                    color: "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/30",
                  },
                  {
                    role: "PERSONNEL" as UserRole,
                    title: isHi ? "जवान / आरक्षक पोर्टल" : "Personnel Self-Care View",
                    name: meta.samplePersonnelName,
                    desc: isHi ? "स्व-मूल्यांकन, बडी-पेयर वॉच व विश्राम सहायता" : "Confidential check-ins, sleep insights & support",
                    icon: HeartPulse,
                    color: "text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/40 bg-purple-50 dark:bg-purple-950/30",
                  },
                  {
                    role: "ADMIN" as UserRole,
                    title: isHi ? "सिस्टम प्रशासक (MHA / NIC)" : "System Admin & Audit",
                    name: "Sh. R.K. Patel (NIC IT Cell)",
                    desc: isHi ? "डीपीडीपी 2023 शून्य-विश्वास ऑडिट लॉग" : "Zero-trust cryptologs, model governance & RBAC",
                    icon: Sliders,
                    color: "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/30",
                  },
                ].map((demo) => {
                  const DIcon = demo.icon;
                  return (
                    <button
                      key={demo.role}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleSignInWithPersona(demo.role)}
                      className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20 text-left transition-all flex items-start gap-3 group disabled:opacity-50 shadow-2xs"
                    >
                      <div className={`p-2 rounded-lg border shrink-0 ${demo.color} group-hover:border-emerald-400`}>
                        <DIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 truncate">
                            {demo.title}
                          </p>
                          <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono truncate mt-0.5">{demo.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                          {demo.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-2xl w-full mx-auto text-center py-2 text-[11px] text-slate-500 font-mono flex items-center justify-between">
        <span>24x7 Force Helpline: <strong className="text-slate-700 dark:text-slate-300 font-medium">14416 / 1800-599-0019</strong></span>
        <span>DPDP Act 2023 Compliant • Zero-Trust Guardrails</span>
      </footer>
    </div>
  );
}
