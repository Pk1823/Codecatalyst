"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import {
  ChevronLeft,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Languages,
  Shield,
} from "lucide-react";
import { useAuth, ForceType, useToast, useTheme } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { AuthService } from "@/services/auth.service";
import { GoogleOAuthModal } from "@/components/auth/google-oauth-modal";
import { BrandIcon } from "@/components/common/brand-logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const { switchRole, force, setForce, lang, toggleLang } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();

  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [selectedForce, setSelectedForce] = useState<ForceType>(force || "CRPF");
  const [selectedRole, setSelectedRole] = useState<UserRole>("WELFARE_OFFICER");

  // Minimal Sign Up fields
  const [officerName, setOfficerName] = useState("");
  const [officerEmail, setOfficerEmail] = useState("");
  const [officerPassword, setOfficerPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sign In State for existing officers/admins
  const [signinIdentifier, setSigninIdentifier] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [showSigninPassword, setShowSigninPassword] = useState(false);

  // Google SSO State
  const [googleClientId, setGoogleClientId] = useState<string>("");
  const [isGoogleConfigured, setIsGoogleConfigured] = useState<boolean>(true);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isHi = lang === "hi";

  useEffect(() => {
    async function loadGoogleConfig() {
      try {
        const config = await AuthService.getGoogleConfig();
        const localId =
          typeof window !== "undefined"
            ? localStorage.getItem("missionwell_google_client_id")
            : null;
        const activeId = localId || config.clientId || "";
        setGoogleClientId(activeId);
        if (activeId && !activeId.includes("demo-google-client-id")) {
          setIsGoogleConfigured(true);
        }
      } catch (e) {
        console.warn("Could not load Google config", e);
      }
    }
    loadGoogleConfig();
  }, []);

  // Sign In Handler with Service ID / Email + Password for Officers & Admins
  const handleOfficerSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const identifier = signinIdentifier.trim();
    if (!identifier) {
      setErrorMsg(isHi ? "कृपया सर्विस ID अथवा ईमेल दर्ज करें।" : "Please enter Service ID or Email.");
      return;
    }
    if (!signinPassword) {
      setErrorMsg(isHi ? "कृपया पासवर्ड दर्ज करें।" : "Please enter password.");
      return;
    }

    setIsSubmitting(true);
    try {
      setForce(selectedForce);
      const user = await AuthService.loginWithCredentials(
        identifier,
        signinPassword.trim(),
        selectedRole,
        selectedForce
      );

      const targetRole = (user.role as UserRole) || selectedRole;
      switchRole(targetRole);

      toast({
        title: isHi ? "कमांड प्रवेश सफल" : "Clearance Granted",
        description: `${isHi ? "लॉगिन हुआ:" : "Welcome back"}, ${user.name}`,
        type: "success",
      });

      router.push(AuthService.getRedirectPathForRole(targetRole));
    } catch (err: any) {
      setErrorMsg(err?.message || (isHi ? "अमान्य आईडी या पासवर्ड। कृपया पुनः प्रयास करें।" : "Invalid Service ID or password. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Sign In & Sign Up Handler
  const handleGoogleSuccess = async (
    credential: string,
    profileUser?: { name?: string; email?: string }
  ) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      setForce(selectedForce);
      let authUser;

      if (credential && credential.length > 50) {
        authUser = await AuthService.loginWithGoogleOAuthToken(
          credential,
          selectedRole,
          selectedForce
        );
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

      toast({
        title: isHi ? "कमांड प्रवेश सफल" : "Clearance Granted",
        description: `${isHi ? "लॉगिन हुआ:" : "Welcome"}, ${authUser?.name || "Officer"}`,
        type: "success",
      });

      router.push(AuthService.getRedirectPathForRole(targetRole));
    } catch (err: any) {
      setErrorMsg(err?.message || "Google authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Minimal Sign Up Handler (Accepts Service ID or Email)
  const handleOfficerSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!officerName.trim()) {
      setErrorMsg(isHi ? "कृपया अपना नाम दर्ज करें।" : "Please enter your name.");
      return;
    }
    const identifier = officerEmail.trim();
    if (!identifier) {
      setErrorMsg(isHi ? "कृपया सर्विस ID अथवा ईमेल दर्ज करें।" : "Please enter Service ID or Email.");
      return;
    }
    if (!officerPassword || officerPassword.length < 4) {
      setErrorMsg(isHi ? "पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।" : "Password must be at least 4 characters.");
      return;
    }

    let finalEmail = identifier;
    let finalServiceId: string | undefined = undefined;
    if (!identifier.includes("@")) {
      finalServiceId = identifier;
      const cleanId = identifier.toLowerCase().replace(/[^a-z0-9]/g, ".");
      finalEmail = `${cleanId}@${selectedForce.toLowerCase()}.gov.in`;
    }

    setIsSubmitting(true);
    try {
      setForce(selectedForce);
      const user = await AuthService.register({
        name: officerName.trim(),
        email: finalEmail,
        serviceId: finalServiceId,
        password: officerPassword.trim(),
        role: selectedRole,
        force: selectedForce,
      });

      switchRole(selectedRole);
      setSuccessMsg(isHi ? `स्वागत है, ${user.name}` : `Welcome, ${user.name}`);

      toast({
        title: isHi ? "अधिकारी खाता तैयार है" : "Officer Profile Created",
        description: `${isHi ? "स्वागत है" : "Welcome"}, ${user.name}`,
        type: "success",
      });

      setTimeout(() => {
        router.push(AuthService.getRedirectPathForRole(selectedRole));
      }, 800);
    } catch (err: any) {
      setErrorMsg(err?.message || "Registration failed. Please check your email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans relative overflow-hidden">
      
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[300px] bg-blue-600/10 dark:bg-blue-500/15 blur-[130px]" />
      </div>

      {/* Top Bar - Minimal */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-blue-400" />
          <span>{isHi ? "होम" : "Home"}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Toggle Theme"
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={toggleLang}
            className="px-2 py-1 rounded-md text-xs font-mono font-medium text-slate-400 hover:text-white transition-colors"
          >
            {isHi ? "EN" : "हिन्दी"}
          </button>
        </div>
      </header>

      {/* Main Card - Minimal */}
      <div className="relative z-10 max-w-sm w-full mx-auto my-auto py-2">
        <div className="rounded-2xl border border-slate-800 bg-[#0B132B]/95 backdrop-blur-xl p-6 sm:p-7 shadow-2xl shadow-black/70 space-y-5">
          
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="flex justify-center mb-1">
              <BrandIcon size="md" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {authMode === "signin"
                ? isHi
                  ? "कमांड व अधिकारी प्रवेश"
                  : "Command & Officer Clearance"
                : isHi
                ? "अधिकारी खाता बनाएं"
                : "Register Officer Profile"}
            </h1>
            <p className="text-xs text-slate-400">
              {authMode === "signin"
                ? isHi
                  ? "कल्याण अधिकारी, कमांडर व एडमिन पोर्टल"
                  : "Welfare Officers, Commanders & Admins"
                : isHi
                ? "Google खाते अथवा विवरण से पंजीकरण करें"
                : "Sign up with official Google account"}
            </p>
          </div>

          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`py-1.5 rounded-lg text-center transition-all ${
                authMode === "signin"
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isHi ? "लॉगिन" : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("signup");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`py-1.5 rounded-lg text-center transition-all ${
                authMode === "signup"
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isHi ? "साइनअप" : "Sign Up"}
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
              <div className="flex-1">{successMsg}</div>
            </div>
          )}

          {/* Role Clearance Selector - Minimal */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">
              {isHi ? "भूमिका (Role):" : "Operating Role:"}
            </label>
            <div className="grid grid-cols-3 gap-1 text-xs font-semibold">
              {[
                { id: "WELFARE_OFFICER" as UserRole, label: isHi ? "कल्याण" : "Welfare" },
                { id: "COMMANDER" as UserRole, label: isHi ? "कमांडर" : "Commander" },
                { id: "ADMIN" as UserRole, label: isHi ? "एडमिन" : "Admin" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`py-1.5 rounded-lg text-center border transition-all text-xs ${
                    selectedRole === r.id
                      ? "bg-blue-600 border-blue-500 text-white font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Security Branch Pills - Minimal */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">
              {isHi ? "सुरक्षा बल:" : "Branch:"}
            </label>
            <div className="grid grid-cols-5 gap-1 text-xs font-semibold">
              {(["CRPF", "BSF", "ITBP", "ARMY", "CISF"] as ForceType[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setSelectedForce(f);
                    setForce(f);
                  }}
                  className={`py-1 rounded-lg text-center border transition-all text-xs ${
                    selectedForce === f
                      ? "bg-slate-700 border-slate-600 text-blue-400 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SIGN IN VIEW: Google + Service ID / Password Form        */}
          {/* ========================================================= */}
          {authMode === "signin" && (
            <div className="space-y-3 pt-1 animate-in fade-in duration-200">
              
              {/* Google Button */}
              <div className="flex justify-center p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      handleGoogleSuccess(credentialResponse.credential);
                    }
                  }}
                  onError={() => setErrorMsg("Google sign-in was canceled.")}
                  shape="pill"
                  size="large"
                  theme="filled_black"
                  text="continue_with"
                  width="320"
                />
              </div>

              {/* Minimal Divider */}
              <div className="relative flex items-center justify-center my-1">
                <div className="w-full border-t border-slate-800" />
                <span className="absolute bg-[#0B132B] px-2 text-[10px] uppercase font-mono text-slate-400">
                  {isHi ? "या आईडी एवं पासवर्ड से" : "or with Service ID & Password"}
                </span>
              </div>

              {/* ID & Password Form */}
              <form onSubmit={handleOfficerSignInSubmit} className="space-y-2.5">
                <div>
                  <input
                    type="text"
                    value={signinIdentifier}
                    onChange={(e) => setSigninIdentifier(e.target.value)}
                    placeholder={isHi ? "सर्विस ID अथवा ईमेल (उदा. MED-DIR-0881)" : "Service ID or Email (e.g. MED-DIR-0881)"}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showSigninPassword ? "text" : "password"}
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    placeholder={isHi ? "पासवर्ड" : "Password"}
                    required
                    className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSigninPassword(!showSigninPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showSigninPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>{isHi ? "सत्यापित किया जा रहा है..." : "Authenticating..."}</span>
                    </span>
                  ) : (
                    <span>{isHi ? "आईडी से लॉगिन करें" : "Sign In with ID & Password"}</span>
                  )}
                </button>
              </form>

              {/* Demo accounts link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
                >
                  {isHi ? "अधिकारी डेमो खाते" : "Use officer demo accounts"}
                </button>
              </div>

              {/* Toggle to Sign Up */}
              <div className="text-center pt-2 text-xs text-slate-400">
                <span>{isHi ? "नया अधिकारी खाता? " : "New officer? "}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setErrorMsg("");
                  }}
                  className="text-blue-400 font-semibold hover:underline"
                >
                  {isHi ? "साइनअप करें" : "Sign up"}
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SIGN UP VIEW                                              */}
          {/* ========================================================= */}
          {authMode === "signup" && (
            <div className="space-y-3.5 pt-1 animate-in fade-in duration-200">
              
              {/* Google 1-Click Sign Up */}
              <div className="flex justify-center p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      handleGoogleSuccess(credentialResponse.credential);
                    }
                  }}
                  onError={() => setErrorMsg("Google sign-up was canceled.")}
                  shape="pill"
                  size="large"
                  theme="filled_black"
                  text="signup_with"
                  width="320"
                />
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-800" />
                <span className="absolute bg-[#0B132B] px-2 text-[10px] uppercase font-mono text-slate-500">
                  {isHi ? "या ईमेल से" : "or with email"}
                </span>
              </div>

              {/* Minimal Form */}
              <form onSubmit={handleOfficerSignUpSubmit} className="space-y-2.5">
                <div>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    placeholder={isHi ? "अधिकारी का नाम" : "Officer Full Name"}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={officerEmail}
                    onChange={(e) => setOfficerEmail(e.target.value)}
                    placeholder={isHi ? "सर्विस ID अथवा आधिकारिक ईमेल (उदा. MED-DIR-0881)" : "Service ID or Email (e.g. MED-DIR-0881)"}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={officerPassword}
                    onChange={(e) => setOfficerPassword(e.target.value)}
                    placeholder={isHi ? "पासवर्ड" : "Password"}
                    required
                    className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>{isHi ? "सहेजा जा रहा है..." : "Registering..."}</span>
                    </span>
                  ) : (
                    <span>{isHi ? "अधिकारी खाता बनाएं" : "Register Profile"}</span>
                  )}
                </button>
              </form>

              {/* Toggle to Sign In */}
              <div className="text-center pt-1 text-xs text-slate-400">
                <span>{isHi ? "पहले से खाता है? " : "Already registered? "}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signin");
                    setErrorMsg("");
                  }}
                  className="text-blue-400 font-semibold hover:underline"
                >
                  {isHi ? "लॉगिन करें" : "Sign in"}
                </button>
              </div>

            </div>
          )}

          {/* Mobile Assessment Mandate Notice */}
          <div className="pt-2 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              {isHi
                ? "सैनिक स्वास्थ्य मूल्यांकन केवल मोबाइल ऐप पर उपलब्ध है (DPDP 2023)"
                : "Soldier assessments strictly conducted via Mobile App (DPDP Act 2023)"}
            </span>
          </div>

        </div>
      </div>

      {/* Clean Minimal Footer */}
      <footer className="relative z-10 max-w-sm w-full mx-auto text-center text-[10px] text-slate-500 py-1 flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3 w-3 text-blue-500" />
        <span>Institutional Clearance • Audit Logged</span>
      </footer>

      {/* Google OAuth Modal */}
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
