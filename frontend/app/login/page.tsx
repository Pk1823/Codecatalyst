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
} from "lucide-react";
import { useAuth, ForceType, useToast, useTheme } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { AuthService } from "@/services/auth.service";
import { GoogleOAuthModal } from "@/components/auth/google-oauth-modal";
import { ProjectServerIcon } from "@/components/common/server-icon";

export default function PersonnelLoginPage() {
  const router = useRouter();
  const { switchRole, force, setForce, lang, toggleLang } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();

  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [selectedForce, setSelectedForce] = useState<ForceType>(force || "CRPF");

  // Minimal Sign Up State (Only essential fields)
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sign In State for existing users
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

  // Sign In Handler with Service ID / Email + Password for existing users
  const handleSignInSubmit = async (e: React.FormEvent) => {
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
        "PERSONNEL",
        selectedForce
      );

      const targetRole = (user.role as UserRole) || "PERSONNEL";
      switchRole(targetRole);

      toast({
        title: isHi ? "लॉगिन सफल" : "Signed In",
        description: `${isHi ? "स्वागत है" : "Welcome back"}, ${user.name}`,
        type: "success",
      });

      router.push(AuthService.getRedirectPathForRole(targetRole));
    } catch (err: any) {
      setErrorMsg(err?.message || (isHi ? "अमान्य आईडी या पासवर्ड। कृपया पुनः प्रयास करें।" : "Invalid Service ID or password. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Login & Sign Up Handler
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
          "PERSONNEL",
          selectedForce
        );
      } else if (profileUser?.email) {
        authUser = await AuthService.loginWithGoogle(
          profileUser.email,
          profileUser.name || "Soldier",
          "PERSONNEL",
          selectedForce
        );
      }

      const targetRole = (authUser?.role as UserRole) || "PERSONNEL";
      switchRole(targetRole);

      toast({
        title: isHi ? "लॉगिन सफल" : "Signed In",
        description: `${isHi ? "स्वागत है" : "Welcome"}, ${authUser?.name || "Soldier"}`,
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
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!signupName.trim()) {
      setErrorMsg(isHi ? "कृपया अपना नाम दर्ज करें।" : "Please enter your name.");
      return;
    }
    const identifier = signupEmail.trim();
    if (!identifier) {
      setErrorMsg(isHi ? "कृपया सर्विस ID अथवा ईमेल दर्ज करें।" : "Please enter Service ID or Email.");
      return;
    }
    if (!signupPassword || signupPassword.length < 4) {
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
        name: signupName.trim(),
        email: finalEmail,
        serviceId: finalServiceId,
        password: signupPassword.trim(),
        role: "PERSONNEL",
        force: selectedForce,
      });

      switchRole("PERSONNEL");
      setSuccessMsg(isHi ? `स्वागत है, ${user.name}` : `Welcome, ${user.name}`);

      toast({
        title: isHi ? "खाता तैयार है" : "Account Created",
        description: `${isHi ? "स्वागत है" : "Welcome to MissionWell"}, ${user.name}`,
        type: "success",
      });

      setTimeout(() => {
        router.push(AuthService.getRedirectPathForRole("PERSONNEL"));
      }, 800);
    } catch (err: any) {
      setErrorMsg(err?.message || "Registration failed. Please check your email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[300px] bg-blue-500/10 dark:bg-blue-500/15 blur-[120px]" />
      </div>

      {/* Top Bar - Minimal */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-blue-500" />
          <span>{isHi ? "होम" : "Home"}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            title="Toggle Theme"
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={toggleLang}
            className="px-2 py-1 rounded-md text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {isHi ? "EN" : "हिन्दी"}
          </button>
        </div>
      </header>

      {/* Main Card - Clean, focused, compact */}
      <div className="relative z-10 max-w-sm w-full mx-auto my-auto py-2">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0C1222]/95 backdrop-blur-xl p-6 sm:p-7 shadow-xl shadow-slate-900/5 dark:shadow-black/50 space-y-5">
          
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="flex justify-center mb-1">
              <ProjectServerIcon size="md" animate={false} showBadge={false} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {authMode === "signin"
                ? isHi
                  ? "मिशनवेल में प्रवेश करें"
                  : "Sign in to MissionWell"
                : isHi
                ? "नया खाता बनाएं"
                : "Create an Account"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {authMode === "signin"
                ? isHi
                  ? "सैनिक एवं जवान वेलनेस पोर्टल"
                  : "Personnel wellness & self-care portal"
                : isHi
                ? "Google खाते अथवा ईमेल से साइनअप करें"
                : "Sign up with your Google account or email"}
            </p>
          </div>

          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`py-1.5 rounded-lg text-center transition-all ${
                authMode === "signin"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
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
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {isHi ? "साइनअप" : "Sign Up"}
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
              <div className="flex-1">{successMsg}</div>
            </div>
          )}

          {/* Security Force Branch Pills - Minimal */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
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
                      ? "bg-blue-600 border-blue-600 text-white font-bold"
                      : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
              
              {/* Google One-Tap / Button */}
              <div className="flex justify-center p-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      handleGoogleSuccess(credentialResponse.credential);
                    }
                  }}
                  onError={() => setErrorMsg("Google sign-in was canceled or failed.")}
                  shape="pill"
                  size="large"
                  theme={resolvedTheme === "dark" ? "filled_black" : "outline"}
                  text="continue_with"
                  width="320"
                />
              </div>

              {/* Minimal Divider */}
              <div className="relative flex items-center justify-center my-1">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                <span className="absolute bg-white dark:bg-[#0C1222] px-2 text-[10px] uppercase font-mono text-slate-400">
                  {isHi ? "या आईडी एवं पासवर्ड से" : "or with Service ID & Password"}
                </span>
              </div>

              {/* ID & Password Sign In Form for existing users */}
              <form onSubmit={handleSignInSubmit} className="space-y-2.5">
                <div>
                  <input
                    type="text"
                    value={signinIdentifier}
                    onChange={(e) => setSigninIdentifier(e.target.value)}
                    placeholder={isHi ? "सर्विस ID अथवा ईमेल (उदा. P-1024)" : "Service ID or Email (e.g. P-1024)"}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showSigninPassword ? "text" : "password"}
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    placeholder={isHi ? "पासवर्ड" : "Password"}
                    required
                    className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSigninPassword(!showSigninPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                      <span>{isHi ? "सत्यापित किया जा रहा है..." : "Signing in..."}</span>
                    </span>
                  ) : (
                    <span>{isHi ? "आईडी से लॉगिन करें" : "Sign In with ID & Password"}</span>
                  )}
                </button>
              </form>

              {/* Demo accounts modal link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                >
                  {isHi ? "डेमो खाते / त्वरित प्रवेश" : "Use pre-configured demo accounts"}
                </button>
              </div>

              {/* Toggle to Sign Up */}
              <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{isHi ? "नया खाता चाहिए? " : "Don't have an account? "}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setErrorMsg("");
                  }}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  {isHi ? "साइनअप करें" : "Sign up"}
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SIGN UP VIEW: Minimal Google + Minimal 3 Inputs Form      */}
          {/* ========================================================= */}
          {authMode === "signup" && (
            <div className="space-y-3.5 pt-1 animate-in fade-in duration-200">
              
              {/* Primary 1-Click Google Sign Up */}
              <div className="flex justify-center p-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      handleGoogleSuccess(credentialResponse.credential);
                    }
                  }}
                  onError={() => setErrorMsg("Google sign-up was canceled.")}
                  shape="pill"
                  size="large"
                  theme={resolvedTheme === "dark" ? "filled_black" : "outline"}
                  text="signup_with"
                  width="320"
                />
              </div>

              {/* Minimal Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                <span className="absolute bg-white dark:bg-[#0C1222] px-2 text-[10px] uppercase font-mono text-slate-400">
                  {isHi ? "या ईमेल से" : "or with email"}
                </span>
              </div>

              {/* Minimal Form */}
              <form onSubmit={handleSignUpSubmit} className="space-y-2.5">
                <div>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder={isHi ? "पूरा नाम" : "Full Name"}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder={isHi ? "सर्विस ID अथवा ईमेल (उदा. MED-DIR-0881)" : "Service ID or Email (e.g. MED-DIR-0881)"}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder={isHi ? "सुरक्षा पासवर्ड" : "Password"}
                    required
                    className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                      <span>{isHi ? "सहेजा जा रहा है..." : "Creating Account..."}</span>
                    </span>
                  ) : (
                    <span>{isHi ? "खाता बनाएं" : "Create Account"}</span>
                  )}
                </button>
              </form>

              {/* Toggle to Sign In */}
              <div className="text-center pt-1 text-xs text-slate-500 dark:text-slate-400">
                <span>{isHi ? "पहले से खाता है? " : "Already have an account? "}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signin");
                    setErrorMsg("");
                  }}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  {isHi ? "लॉगिन करें" : "Sign in"}
                </button>
              </div>

            </div>
          )}

          {/* Minimal Link to Officer Portal */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <Link
              href="/login/admin"
              className="text-[11px] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {isHi ? "अधिकारी / कमांड पोर्टल प्रवेश →" : "Officer & Command Portal →"}
            </Link>
          </div>

        </div>
      </div>

      {/* Clean Minimal Footer */}
      <footer className="relative z-10 max-w-sm w-full mx-auto text-center text-[10px] text-slate-400 py-1 flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3 w-3 text-blue-500" />
        <span>Confidential • DPDP Act 2023 Compliant</span>
      </footer>

      {/* Google OAuth Modal for fallback & pre-configured demo */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={(user: any, token: string) => handleGoogleSuccess(token, user)}
        initialRole="PERSONNEL"
        initialForce={selectedForce}
        googleClientId={googleClientId}
        isGoogleConfigured={isGoogleConfigured}
      />
    </div>
  );
}
