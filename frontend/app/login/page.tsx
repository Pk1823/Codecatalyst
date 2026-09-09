"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import {
  Shield,
  ArrowRight,
  UserCheck,
  HeartPulse,
  Activity,
  Sliders,
  Languages,
  Lock,
  ChevronLeft,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  Loader2,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth, ForceType, useToast, useTheme } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { FORCES_METADATA } from "@/lib/force-metadata";
import { AuthService } from "@/services/auth.service";
import { GoogleOAuthModal } from "@/components/auth/google-oauth-modal";
import { ProjectServerIcon } from "@/components/common/server-icon";
import { ServerStatusPill } from "@/components/common/server-status-pill";

function GoogleGIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
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
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, force, setForce, lang, toggleLang } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();

  const [selectedForce, setSelectedForce] = useState<ForceType>(force || "CRPF");
  const [selectedRole, setSelectedRole] = useState<UserRole>("WELFARE_OFFICER");

  // Credentials State
  const [serviceId, setServiceId] = useState("MED-DIR-0881");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);

  // Google SSO State
  const [googleClientId, setGoogleClientId] = useState<string>("");
  const [isGoogleConfigured, setIsGoogleConfigured] = useState<boolean>(true);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [showGoogleConfig, setShowGoogleConfig] = useState(false);
  const [configInputId, setConfigInputId] = useState("");
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isHi = lang === "hi";
  const meta = FORCES_METADATA[selectedForce] || FORCES_METADATA.CRPF;

  // Load Google configuration
  useEffect(() => {
    async function loadGoogleConfig() {
      try {
        const config = await AuthService.getGoogleConfig();
        const localId = typeof window !== "undefined" ? localStorage.getItem("missionwell_google_client_id") : null;
        const activeId = localId || config.clientId || "";
        setGoogleClientId(activeId);
        setConfigInputId(activeId);
        if (activeId && !activeId.includes("demo-google-client-id")) {
          setIsGoogleConfigured(true);
        }
      } catch (e) {
        console.warn("Could not load Google config", e);
      }
    }
    loadGoogleConfig();
  }, []);

  // Role preset handler
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg("");
    if (role === "PERSONNEL") {
      setServiceId(meta.sampleServiceId || "CRPF-GD-2021-04128");
      setPassword("demo123");
    } else if (role === "WELFARE_OFFICER") {
      setServiceId("MED-DIR-0881");
      setPassword("demo123");
    } else if (role === "COMMANDER") {
      setServiceId("CMD-SECTOR-01");
      setPassword("demo123");
    } else if (role === "ADMIN") {
      setServiceId("NIC-SYS-9940");
      setPassword("demo123");
    }
  };

  const handleForceChange = (f: ForceType) => {
    setSelectedForce(f);
    setForce(f);
    const newMeta = FORCES_METADATA[f];
    if (selectedRole === "PERSONNEL") {
      setServiceId(newMeta?.sampleServiceId || `${f}-GD-2022-09`);
    }
  };

  // Sign in with Service ID & Password
  const handleSignInWithCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!serviceId.trim() || !password.trim()) {
      setErrorMsg(
        isHi
          ? "कृपया सर्विस ID / ईमेल और पासवर्ड दोनों दर्ज करें।"
          : "Please enter both Service ID / Email and password."
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
        title: isHi ? "प्रमाणीकरण सफल" : "Sign In Successful",
        description: `${isHi ? "लॉगिन हुआ:" : "Welcome"}, ${user.name || targetRole}`,
        type: "success",
      });

      router.push(AuthService.getRedirectPathForRole(targetRole));
    } catch (err: any) {
      setErrorMsg(err?.message || "Invalid credentials. Please verify your ID and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1-Click Fast Demo Login for Judges & Evaluators
  const handleQuickDemoLogin = async (role: UserRole) => {
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      setForce(selectedForce);
      const user = await AuthService.loginWithPersona(role, selectedForce);
      const targetRole = (user?.role as UserRole) || role;
      switchRole(targetRole);

      toast({
        title: isHi ? "डेमो प्रवेश सफल" : "Demo Access Granted",
        description: `${isHi ? "लॉगिन हुआ:" : "Logged in as"} ${targetRole.replace("_", " ")}`,
        type: "success",
      });

      router.push(AuthService.getRedirectPathForRole(targetRole));
    } catch (err: any) {
      setErrorMsg(err?.message || "Demo login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Login Success Handler
  const handleGoogleSuccess = async (credential: string, profileUser?: { name?: string; email?: string }) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      setForce(selectedForce);
      let authUser;
      if (credential && credential.length > 50) {
        authUser = await AuthService.loginWithGoogleOAuthToken(credential, selectedRole, selectedForce);
      } else if (profileUser?.email) {
        authUser = await AuthService.loginWithGoogle(
          profileUser.email,
          profileUser.name || "Officer",
          selectedRole,
          selectedForce
        );
      }
      const targetRole = (authUser?.role as UserRole) || selectedRole;
      switchRole(targetRole);

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "google_sso_welcome",
          JSON.stringify({
            email: authUser?.email || profileUser?.email || "officer@google.com",
            name: authUser?.name || profileUser?.name || "Officer",
            role: targetRole,
            force: selectedForce,
            time: Date.now(),
          })
        );
      }

      toast({
        title: isHi ? "Google लॉगिन सफल" : "Sign-In Successful",
        description: `${isHi ? "लॉगिन हुआ:" : "Welcome"}, ${authUser?.name || "Officer"}`,
        type: "success",
      });

      router.push(AuthService.getRedirectPathForRole(targetRole));
    } catch (err: any) {
      setErrorMsg(err?.message || "Google sign-in failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveGoogleClientId = async () => {
    if (!configInputId.trim()) return;
    setIsSavingConfig(true);
    try {
      const trimmed = configInputId.trim();
      await AuthService.saveGoogleClientId(trimmed);
      if (typeof window !== "undefined") {
        localStorage.setItem("missionwell_google_client_id", trimmed);
      }
      setGoogleClientId(trimmed);
      setIsGoogleConfigured(!trimmed.includes("demo-google-client-id"));
      setShowGoogleConfig(false);
      toast({
        title: isHi ? "Google Client ID सहेजा गया" : "Google Client ID Saved",
        description: isHi
          ? "आधिकारिक Google OAuth सेटिंग्स अपडेट हो गई हैं।"
          : "Official Google OAuth settings updated.",
        type: "success",
      });
    } catch (err: any) {
      toast({
        title: "Configuration Error",
        description: err.message || "Could not save Client ID",
        type: "error",
      });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const roles = [
    {
      id: "WELFARE_OFFICER" as UserRole,
      title: isHi ? "कल्याण अधिकारी" : "Welfare Officer",
      subtitle: meta.sampleOfficerName,
      icon: UserCheck,
    },
    {
      id: "COMMANDER" as UserRole,
      title: isHi ? "कमांडेंट" : "Commander",
      subtitle: meta.sampleCommanderName,
      icon: Activity,
    },
    {
      id: "PERSONNEL" as UserRole,
      title: isHi ? "जवान" : "Personnel",
      subtitle: meta.samplePersonnelName,
      icon: HeartPulse,
    },
    {
      id: "ADMIN" as UserRole,
      title: isHi ? "प्रशासक" : "System Admin",
      subtitle: "Sh. R.K. Patel",
      icon: Sliders,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans transition-colors duration-200 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/login-bg.jpg"
          alt="Defense Outpost Backdrop"
          className="w-full h-full object-cover object-center opacity-30 dark:opacity-60 transition-opacity duration-700 select-none scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/95 via-slate-50/60 to-slate-50/95 dark:from-[#090D16]/95 dark:via-[#090D16]/70 dark:to-[#090D16]/95" />
      </div>

      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px] pointer-events-none z-0" />

      {/* Top Bar */}
      <header className="max-w-xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors py-1.5 px-2.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
          >
            <ChevronLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isHi ? "मुख्य पृष्ठ" : "Back to Home"}</span>
          </Link>
          <div className="h-3 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <ServerStatusPill variant="compact" className="hidden sm:inline-flex" />
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs transition-colors"
            title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme appearance"
          >
            {resolvedTheme === "dark" ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-blue-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs transition-colors"
            title="Toggle Language"
          >
            <Languages className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isHi ? "EN" : "हिन्दी"}</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <div className="relative z-10 max-w-lg w-full mx-auto my-auto py-4">
        <div className="rounded-2xl border border-slate-200/90 dark:border-emerald-500/25 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-slate-950/5 dark:shadow-black/60 space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ProjectServerIcon size="lg" animate={true} showBadge={true} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isHi ? "मिशनवेल में प्रवेश करें" : "Sign in to MissionWell"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {isHi
                ? "सशस्त्र बल एवं पुलिस कर्मियों के स्वास्थ्य एवं तत्परता का सुरक्षित मंच"
                : "Secure access for defense personnel wellness & operational readiness"}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-rose-500/30 bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {/* SECTION 1: Google Official SSO (Top Priority) */}
          <div className="space-y-3">
            {/* Primary Google Login Button */}
            <div className="flex justify-center p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    handleGoogleSuccess(credentialResponse.credential);
                  }
                }}
                onError={() => {
                  setErrorMsg("Google Sign-In was canceled or failed.");
                }}
                shape="pill"
                size="large"
                theme={resolvedTheme === "dark" ? "filled_black" : "outline"}
                text="continue_with"
                width="380"
              />
            </div>

            {/* Fallback / Account Chooser */}
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                className="text-[11px] text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 font-medium transition-colors"
              >
                {isHi ? "पूर्व-कॉन्फ़िगर किए गए Google खाते" : "Pre-configured demo accounts / Switch account"}
              </button>

              <button
                type="button"
                onClick={() => setShowGoogleConfig(!showGoogleConfig)}
                className="text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors inline-flex items-center gap-1 font-medium"
              >
                <Settings className="h-3 w-3" />
                <span>{showGoogleConfig ? "Close Settings" : "OAuth Settings"}</span>
                {showGoogleConfig ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>

            {/* Optional Collapsible Google Client ID Drawer */}
            {showGoogleConfig && (
              <div className="mt-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-left space-y-2 animate-in fade-in">
                <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  Google Cloud Web Client ID:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={configInputId}
                    onChange={(e) => setConfigInputId(e.target.value)}
                    placeholder="xxxx.apps.googleusercontent.com"
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveGoogleClientId}
                    disabled={isSavingConfig || !configInputId.trim()}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold"
                  >
                    {isSavingConfig ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Paste your Google Cloud OAuth Client ID to activate live direct Google account verification.
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            <span className="absolute bg-white dark:bg-[#0B1120] px-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isHi ? "या क्रेडेंशियल से लॉगिन करें" : "or sign in with credentials"}
            </span>
          </div>

          {/* SECTION 2: Standard Credentials Form */}
          <form onSubmit={handleSignInWithCredentials} className="space-y-4">
            
            {/* Force / Branch Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{isHi ? "सुरक्षा बल / शाखा:" : "Security Force Branch:"}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  {meta.shortName} • {meta.motto}
                </span>
              </label>
              <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                {(["CRPF", "BSF", "ITBP", "ARMY", "CISF"] as ForceType[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => handleForceChange(f)}
                    className={`py-1.5 rounded-lg text-center transition-all ${
                      selectedForce === f
                        ? "bg-emerald-600 text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Selection Tabs */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {isHi ? "भूमिका (Role):" : "Operating Role:"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleSelect(r.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <Icon className={`h-4 w-4 mb-1 ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`} />
                      <span className="text-[11px] leading-tight">{r.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Service ID / Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {isHi ? "सर्विस नंबर / आधिकारिक ID:" : "Service Number / Official ID:"}
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  placeholder="e.g. MED-DIR-0881"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {isHi ? "सुरक्षा पासवर्ड:" : "Password:"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isHi ? "सत्यापन हो रहा है..." : "Signing in..."}</span>
                </>
              ) : (
                <>
                  <span>{isHi ? "पोर्टल में प्रवेश करें" : "Sign In to Portal"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* SECTION 3: 1-Click Fast Demo Access */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>{isHi ? "1-क्लिक त्वरित डेमो लॉगिन:" : "1-Click Fast Demo Login:"}</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {isHi ? "परीक्षक शॉर्टकट" : "Fast-lane for Evaluators"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(r.id)}
                    disabled={isSubmitting}
                    className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 hover:border-emerald-500/40 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Icon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">1-Click</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{r.title}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{r.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Clean Footer */}
      <footer className="relative z-10 max-w-lg w-full mx-auto text-center space-y-1 text-xs text-slate-500 dark:text-slate-400 py-2">
        <div className="flex items-center justify-center gap-2 font-mono text-[11px]">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Zero APAR / ACR Career Prejudice Guarantee</span>
        </div>
        <div className="text-[10px] text-slate-400 dark:text-slate-500">
          24x7 Helplines: Tele-MANAS <strong className="text-emerald-600 dark:text-emerald-400">14416</strong> • KIRAN <strong className="text-emerald-600 dark:text-emerald-400">1800-599-0019</strong>
        </div>
      </footer>

      {/* Google OAuth Modal (Fallback & Pre-configured Accounts) */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={(user: any, token: string) => handleGoogleSuccess(token, user)}
        initialRole={selectedRole}
        initialForce={selectedForce}
        googleClientId={googleClientId}
        isGoogleConfigured={isGoogleConfigured}
      />
    </div>
  );
}
