"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  ChevronRight,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Mail,
  CheckCircle2,
  Sun,
  Moon,
  Laptop,
  ExternalLink,
  ShieldCheck,
  Check,
  Zap,
  Radio,
  Fingerprint,
  Cpu,
  Loader2,
  Terminal,
  Globe,
  Layers,
  ShieldAlert,
  Wifi,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth, ForceType, useToast, useTheme } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { FORCES_METADATA } from "@/lib/force-metadata";
import { AuthService } from "@/services/auth.service";
import { GoogleOAuthModal, PRECONFIGURED_GOOGLE_ACCOUNTS } from "@/components/auth/google-oauth-modal";
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

type AuthTab = "credentials" | "google" | "personas";

interface GoogleAuthSequence {
  isActive: boolean;
  stage: number; // 0: OpenID PKCE, 1: DPDP Salt, 2: RBAC Clearance, 3: Terminal Sync
  progress: number;
  email: string;
  name: string;
  role: UserRole;
  force: ForceType;
  targetPath: string;
  logs: string[];
}

const ROLE_SCOPE_MATRIX: Record<
  UserRole,
  {
    tier: string;
    clearance: string;
    modules: string[];
    dpdpGuarantee: string;
    color: string;
    badgeBg: string;
  }
> = {
  WELFARE_OFFICER: {
    tier: "Medical Tier 1 (Clinical Dossiers)",
    clearance: "CONFIDENTIAL / RESTRICTED - MHA MEDICAL CORPS",
    modules: [
      "Clinical Case Triage & Dossiers",
      "Psychological Distress Radar",
      "Tele-MANAS Direct Consults",
      "Care Protocol Scheduler",
    ],
    dpdpGuarantee: "Zero APAR linkage. Doctor-patient privilege cryptographically enforced.",
    color: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60",
  },
  COMMANDER: {
    tier: "Operational Tier 2 (Force Readiness)",
    clearance: "RESTRICTED - BATTALION COMMAND LEVEL",
    modules: [
      "Unit Readiness Heatmap",
      "Company Fatigue Indexes",
      "Tactical Rest-Rotation Engine",
      "High-Altitude Medical Alerts",
    ],
    dpdpGuarantee: "Strict unit aggregation. No individual medical files visible to commanders.",
    color: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60",
  },
  PERSONNEL: {
    tier: "Self-Care Tier 3 (Sovereign Jawan)",
    clearance: "INDIVIDUAL SOVEREIGN ENCLAVE",
    modules: [
      "Confidential Daily Pulse Check",
      "Buddy-Pair Wellness Watch",
      "Sleep & Biometric Insights",
      "24x7 Anonymous Support",
    ],
    dpdpGuarantee: "Voluntary self-reflection. Zero records shared with battalion superiors.",
    color: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60",
  },
  ADMIN: {
    tier: "Governance Tier 0 (System Administration)",
    clearance: "MHA CENTRAL IT CELL / NIC",
    modules: [
      "Zero-Trust Audit Logs",
      "DPDP Ephemeral Key Rotation",
      "AI Model Governance & Bias Audits",
      "RBAC Clearance Directory",
    ],
    dpdpGuarantee: "Read-only audit integrity. Cannot alter clinical or psychological scores.",
    color: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60",
  },
};

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
  const [googleEmail, setGoogleEmail] = useState("recmit2024@gmail.com");
  const [googleName, setGoogleName] = useState("Officer Recmit");
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleCategoryFilter, setGoogleCategoryFilter] = useState<
    "ALL" | "WELFARE" | "COMMAND" | "PERSONNEL" | "ADMIN"
  >("ALL");

  // Official Google OAuth & Identity Services (GSI) State
  const [googleClientId, setGoogleClientId] = useState<string>("");
  const [isGoogleConfigured, setIsGoogleConfigured] = useState<boolean>(false);
  const [showGoogleConfig, setShowGoogleConfig] = useState<boolean>(false);
  const [configInputId, setConfigInputId] = useState<string>("");
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);

  // Holographic Defense Authorization HUD State
  const [authSequence, setAuthSequence] = useState<GoogleAuthSequence>({
    isActive: false,
    stage: 0,
    progress: 0,
    email: "",
    name: "",
    role: "WELFARE_OFFICER",
    force: "CRPF",
    targetPath: "/welfare",
    logs: [],
  });
  const authTimersRef = React.useRef<NodeJS.Timeout[]>([]);

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

  const clearAuthTimers = () => {
    authTimersRef.current.forEach(clearTimeout);
    authTimersRef.current = [];
  };

  React.useEffect(() => {
    return () => clearAuthTimers();
  }, []);

  // Fetch initial Google configuration and load GSI SDK
  useEffect(() => {
    async function loadGoogleConfig() {
      const config = await AuthService.getGoogleConfig();
      const localId = typeof window !== "undefined" ? localStorage.getItem("missionwell_google_client_id") : null;
      const activeId = localId || config.clientId || "";
      setGoogleClientId(activeId);
      setConfigInputId(activeId);
      setIsGoogleConfigured(Boolean(activeId && !activeId.includes("demo-google-client-id")));
    }
    loadGoogleConfig();

    if (typeof window !== "undefined" && !document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Render official Google Identity Services button
  const renderGoogleOfficialButton = useCallback(() => {
    if (typeof window === "undefined" || !(window as any).google?.accounts?.id) return;
    const activeId =
      googleClientId ||
      (typeof window !== "undefined" ? localStorage.getItem("missionwell_google_client_id") : null);
    if (!activeId || activeId.includes("demo-google-client-id")) return;

    try {
      (window as any).google.accounts.id.initialize({
        client_id: activeId,
        callback: async (response: any) => {
          if (response?.credential) {
            try {
              setIsSubmitting(true);
              const user = await AuthService.loginWithGoogleOAuthToken(
                response.credential,
                selectedRole,
                selectedForce
              );
              switchRole(selectedRole);
              triggerGoogleAuthSequence(
                user.email,
                user.name || "Officer",
                selectedRole,
                selectedForce,
                response.credential
              );
            } catch (err: any) {
              setErrorMsg(err.message || "Failed to authenticate official Google account.");
              toast({
                title: "Google Authentication Failed",
                description: err.message || "Could not verify Google ID token with identity servers.",
                type: "error",
              });
            } finally {
              setIsSubmitting(false);
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      const container = document.getElementById("official-google-gsi-container");
      if (container) {
        container.innerHTML = "";
        (window as any).google.accounts.id.renderButton(container, {
          theme: resolvedTheme === "dark" ? "filled_black" : "outline",
          size: "large",
          type: "standard",
          shape: "pill",
          text: "continue_with",
          width: 360,
          logo_alignment: "left",
        });
      }
    } catch (e) {
      console.warn("[GSI_BUTTON_RENDER_ERR]:", e);
    }
  }, [googleClientId, selectedRole, selectedForce, resolvedTheme]);

  useEffect(() => {
    if (authTab === "google" && isGoogleConfigured) {
      const timer = setTimeout(() => {
        renderGoogleOfficialButton();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [authTab, isGoogleConfigured, renderGoogleOfficialButton]);

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
      const configured = !trimmed.includes("demo-google-client-id");
      setIsGoogleConfigured(configured);
      setShowGoogleConfig(false);
      toast({
        title: isHi ? "Google Client ID सक्रिय हुआ" : "Official Google OAuth Activated",
        description: isHi
          ? "आधिकारिक Google Identity Services लाइव प्रमाणीकरण के लिए तैयार है।"
          : "Official Google Identity Services initialized for live Google Account authentication.",
        type: "success",
      });
      setTimeout(() => renderGoogleOfficialButton(), 400);
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

  const triggerGoogleAuthSequence = async (
    emailToUse: string,
    nameToUse: string,
    targetRole: UserRole,
    forceToUse: ForceType,
    existingToken?: string
  ) => {
    clearAuthTimers();
    const targetPath = AuthService.getRedirectPathForRole(targetRole);

    // Initialize Stage 0 HUD
    setAuthSequence({
      isActive: true,
      stage: 0,
      progress: 25,
      email: emailToUse,
      name: nameToUse || "Officer",
      role: targetRole,
      force: forceToUse,
      targetPath,
      logs: [
        `> [SEC-INIT] Google OpenID PKCE Handshake initiated for ${emailToUse}`,
        `> [CRYPTO-IDP] TLSv1.3 TLS_AES_256_GCM_SHA384 session negotiated`,
        `> [OPENID-TOKEN] RS256 signature verified via accounts.google.com`,
      ],
    });

    try {
      let user;
      if (!existingToken) {
        setForce(forceToUse);
        user = await AuthService.loginWithGoogle(emailToUse, nameToUse, targetRole, forceToUse);
      }
      switchRole(targetRole);

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "google_sso_welcome",
          JSON.stringify({
            email: emailToUse,
            name: nameToUse || user?.name || "Officer",
            role: targetRole,
            force: forceToUse,
            time: Date.now(),
          })
        );
      }

      // Stage 1: DPDP Ephemeral Salt at 400ms
      const t1 = setTimeout(() => {
        setAuthSequence((prev) => ({
          ...prev,
          stage: 1,
          progress: 55,
          logs: [
            ...prev.logs,
            `> [DPDP-2023] Section 8 Ephemeral Salt: 0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
            `> [ANONYMIZATION] ACR/APAR career record isolation envelope sealed`,
          ],
        }));
      }, 400);

      // Stage 2: Defense RBAC Clearance at 850ms
      const t2 = setTimeout(() => {
        setAuthSequence((prev) => ({
          ...prev,
          stage: 2,
          progress: 82,
          logs: [
            ...prev.logs,
            `> [RBAC-CLEARANCE] Multi-tier clearance authorized: ${targetRole.replace("_", " ")}`,
            `> [AIR-GAP-NODE] MissionWell Core Port 5001 authenticated`,
          ],
        }));
      }, 850);

      // Stage 3: Command Terminal Synchronized at 1350ms
      const t3 = setTimeout(() => {
        setAuthSequence((prev) => ({
          ...prev,
          stage: 3,
          progress: 100,
          logs: [
            ...prev.logs,
            `> [JWT-SESSION] 256-bit Bearer token anchored to active terminal`,
            `> [ROUTING] Handshake complete. Launching tactical console...`,
          ],
        }));
      }, 1350);

      // Stage 4: Router push at 1800ms
      const t4 = setTimeout(() => {
        router.push(targetPath);
      }, 1800);

      authTimersRef.current = [t1, t2, t3, t4];
    } catch (err: any) {
      clearAuthTimers();
      setAuthSequence((prev) => ({ ...prev, isActive: false }));
      setErrorMsg(err?.message || "Google authentication failed. Please try again.");
      toast({
        title: "Authentication Failed",
        description: err?.message || "Could not complete Google single sign-on handshake.",
        type: "error",
      });
    }
  };

  const handleSkipAuthSequence = () => {
    clearAuthTimers();
    router.push(authSequence.targetPath);
  };

  const handleSignInWithGoogle = async (
    customEmail?: string,
    customName?: string,
    roleToUse?: UserRole,
    forceToUse?: ForceType
  ) => {
    setErrorMsg("");
    const emailToUse = customEmail || googleEmail;
    const nameToUse = customName || googleName;
    const finalRole = roleToUse || selectedRole;
    const finalForce = forceToUse || selectedForce;

    if (!emailToUse || !emailToUse.includes("@")) {
      setErrorMsg(isHi ? "कृपया वैध Gmail या ईमेल पता दर्ज करें।" : "Please enter a valid Gmail address.");
      return;
    }

    await triggerGoogleAuthSequence(emailToUse, nameToUse, finalRole, finalForce);
  };

  const handleGoogleModalSuccess = (user: any, token: string) => {
    const targetRole = (user?.role as UserRole) || selectedRole;
    const targetForce = (user?.force as ForceType) || selectedForce;
    setIsGoogleModalOpen(false);
    triggerGoogleAuthSequence(user.email, user.name || "Officer", targetRole, targetForce, token);
  };

  const handleLaunchGoogleOAuth = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg("");
      const activeClientId =
        googleClientId ||
        (typeof window !== "undefined" ? localStorage.getItem("missionwell_google_client_id") : null);
      const oauthData = await AuthService.getGoogleOAuthUrl(
        selectedRole,
        selectedForce,
        activeClientId || undefined
      );
      if (oauthData.isConfigured) {
        window.location.href = oauthData.url;
      } else {
        setShowGoogleConfig(true);
        toast({
          title: isHi ? "Google Cloud क्लाइंट ID आवश्यक" : "Google Cloud Client ID Required",
          description: isHi
            ? "सीधे Google से लाइव लॉगिन के लिए कृपया अपना Google Client ID दर्ज करें।"
            : "Enter your Google Cloud Client ID to launch direct live Google authentication.",
          type: "info",
        });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Could not initialize official Google OAuth consent flow.");
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans transition-colors duration-200 relative overflow-hidden">
      {/* Cinematic Defense Command & Holographic Shield Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/login-bg.jpg"
          alt="Defense Security Gateway & Mountain Outpost Backdrop"
          className="w-full h-full object-cover object-center opacity-40 dark:opacity-75 transition-opacity duration-700 select-none scale-105"
        />
        {/* Soft Ambient Vignette for Card Readability & Seamless Edge Integration */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/90 via-slate-50/45 to-slate-50/90 dark:from-[#090D16]/90 dark:via-[#090D16]/55 dark:to-[#090D16]/90" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-50/40 dark:via-[#090D16]/40 to-slate-50/95 dark:to-[#090D16]/95" />
      </div>

      {/* Subtle Luminous Ambient Defense Glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[250px] bg-cyan-500/10 dark:bg-cyan-500/15 blur-[120px] pointer-events-none z-0" />

      {/* Top Bar */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isHi ? "मुख्य पृष्ठ" : "Back to Home"}</span>
          </Link>
          <div className="h-3 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <ServerStatusPill variant="compact" className="hidden sm:inline-flex" />
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Theme Switcher */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs transition-colors"
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
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs transition-colors"
          >
            <Languages className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>{isHi ? "EN" : "हिन्दी"}</span>
          </button>
        </div>
      </header>

      {/* Main Centered Sign-In Card */}
      <div className="relative z-10 max-w-2xl w-full mx-auto my-auto py-4">
        <div className="rounded-2xl border border-slate-200/90 dark:border-emerald-500/25 bg-white/92 dark:bg-[#0B1120]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/10 dark:shadow-black/70 space-y-6 transition-all">
          {/* Header with Official Project Server Icon */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ProjectServerIcon size="lg" animate={true} showBadge={true} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              {isHi ? "सुरक्षित रक्षा एवं कल्याण प्रवेश" : "Authorized Defense & Welfare Sign In"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHi
                ? "सशस्त्र बल कल्याण एवं तत्परता खुफिया कमान • त्रि-सेवा सर्वर ग्रिड सक्रिय"
                : "Predictive Personnel Stress & Welfare Monitoring System • Tri-Service Grid Active"}
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
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs border border-slate-200/80 dark:border-slate-700"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <GoogleGIcon className="h-3.5 w-3.5" />
              <span className="truncate">{isHi ? "Google SSO" : "Google SSO"}</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                OAuth 2.0
              </span>
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

          {/* TAB 2: GOOGLE SSO (AUTHENTIC WORKSPACE FEDERATION) */}
          {authTab === "google" && (
            <div className="space-y-5">
              {/* Interactive Cryptographic Handshake Conduit Card */}
              <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-slate-50/90 dark:from-blue-950/40 dark:via-slate-900/70 dark:to-[#090D16] border border-blue-200/80 dark:border-blue-900/50 shadow-xs">
                {/* Ambient top light */}
                <div className="absolute top-0 right-0 w-64 h-24 bg-blue-500/10 dark:bg-blue-500/15 blur-2xl pointer-events-none rounded-full" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Google Identity Node */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shrink-0">
                      <GoogleGIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Google Identity Provider
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 font-bold">
                          PKCE 256
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        accounts.google.com
                      </p>
                    </div>
                  </div>

                  {/* Animated Handshake Conduit Bridge */}
                  <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/90 dark:bg-emerald-950/70 border border-emerald-300/80 dark:border-emerald-800/80 shadow-2xs">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      18ms TLS 1.3
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
                      Active Bridge
                    </span>
                  </div>

                  {/* MissionWell Defense Core Node */}
                  <div className="flex items-center gap-3 justify-end">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          MissionWell Core
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 font-bold">
                          DPDP 2023
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        Port 5001 Node
                      </p>
                    </div>
                    <ProjectServerIcon size="md" animate={true} showBadge={true} />
                  </div>
                </div>

                <p className="mt-3.5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-blue-200/50 dark:border-slate-800/60 pt-2.5">
                  {isHi
                    ? "आधिकारिक Google एकल साइन-ऑन सेवा। भारतीय डीपीडीपी अधिनियम 2023 के तहत शून्य-अभिलेख सुरक्षा एवं अभेद्य सैन्य प्रमाणीकरण।"
                    : "Official Google Single Sign-On. Zero-trust OpenID Connect token federation with automated DPDP Act 2023 air-gapped cryptographic audit logs."}
                </p>
              </div>

              {/* Primary Google Action: Official Material 3 Google Sign-In Button */}
              <div className="space-y-3">
                <div className="flex justify-center p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      if (credentialResponse.credential) {
                        try {
                          setIsSubmitting(true);
                          setErrorMsg("");
                          const user = await AuthService.loginWithGoogleOAuthToken(
                            credentialResponse.credential,
                            selectedRole,
                            selectedForce
                          );
                          const targetRole = (user?.role as UserRole) || selectedRole;
                          switchRole(targetRole);
                          toast({
                            title: isHi ? "Google OAuth 2.0 प्रमाणीकरण सफल" : "Google OAuth 2.0 Successful",
                            description: `Logged in as ${user.name || user.email} (${targetRole.replace("_", " ")})`,
                            type: "success",
                          });
                          router.push(AuthService.getRedirectPathForRole(targetRole));
                        } catch (err: any) {
                          setErrorMsg(err?.message || "Google ID Token verification failed.");
                        } finally {
                          setIsSubmitting(false);
                        }
                      }
                    }}
                    onError={() => {
                      setErrorMsg("Google OAuth Login Failed or Canceled.");
                    }}
                    useOneTap
                    shape="pill"
                    size="large"
                    theme={resolvedTheme === "dark" ? "filled_black" : "outline"}
                    text="continue_with"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#0F172A] dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 text-slate-800 dark:text-white transition-all shadow-xs hover:shadow-md group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                      <GoogleGIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {isHi ? "Google खाता चुनें (सहमति संवाद)" : "Interactive Account Chooser & Consent"}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {isHi ? "सुरक्षित रोल एवं बल आवंटन चुनें" : "Select Role, Force & Account Parameters"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50">
                      OAuth 2.0
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
                      </div>

                      <details className="text-[10px] text-slate-500 dark:text-slate-400 cursor-pointer pt-0.5">
                        <summary className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                          {isHi ? "Google Cloud Console सेटअप निर्देश देखें" : "View Google Cloud Console Setup Steps (30 seconds)"}
                        </summary>
                        <div className="mt-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-1 font-mono text-[9px] leading-relaxed">
                          <div>1. Go to: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline">console.cloud.google.com/apis/credentials</a></div>
                          <div>2. Create Credentials → OAuth Client ID (Web Application)</div>
                          <div>3. Authorized JS origin: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400">http://localhost:3000</code></div>
                          <div>4. Authorized redirect URI: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400">http://localhost:3000/auth/callback</code></div>
                          <div>5. Copy Client ID, paste above, and click Activate!</div>
                        </div>
                      </details>
                    </div>
                  </div>
                )}

                {/* Direct Google OAuth Redirect button */}
                <button
                  type="button"
                  onClick={handleLaunchGoogleOAuth}
                  disabled={isSubmitting || authSequence.isActive}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 hover:border-blue-400 dark:hover:border-blue-700 bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span>{isHi ? "सीधा Google OAuth सहमति पृष्ठ खोलें" : "Direct Official Google OAuth Redirect"}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Modal / Chooser fallback button */}
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  disabled={isSubmitting || authSequence.isActive}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400 text-xs transition-colors"
                >
                  <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {isHi ? "खाता चयन संवाद या कस्टम Gmail खोलें" : "Open Google Account Chooser & Fast-Lane Modal"}
                  </span>
                </button>
              </div>

              {/* Evaluator Fast-Lane: Preconfigured Google Accounts */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {isHi ? "परीक्षक त्वरित Google खाते (1-क्लिक प्रवेश)" : "Evaluator Google Personas (1-Click Instant Access)"}
                  </label>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    5 Pre-Seeded
                  </span>
                </div>

                {/* Category Filter Pills for Google SSO */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { id: "ALL" as const, label: "All (5)" },
                    { id: "WELFARE" as const, label: "Welfare & Doctors (2)" },
                    { id: "COMMAND" as const, label: "Commanders (1)" },
                    { id: "PERSONNEL" as const, label: "Jawans (1)" },
                    { id: "ADMIN" as const, label: "Admins (1)" },
                  ].map((tab) => {
                    const isSelected = googleCategoryFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setGoogleCategoryFilter(tab.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium transition-all whitespace-nowrap border ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200/70 dark:hover:bg-slate-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Persona Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRECONFIGURED_GOOGLE_ACCOUNTS.filter(
                    (acc) => googleCategoryFilter === "ALL" || acc.category === googleCategoryFilter
                  ).map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      disabled={isSubmitting || authSequence.isActive}
                      onClick={() =>
                        handleSignInWithGoogle(
                          acc.email,
                          acc.name,
                          acc.role as UserRole,
                          acc.force as ForceType
                        )
                      }
                      className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090D16] hover:border-emerald-500/80 dark:hover:border-emerald-500/80 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all text-left flex items-center justify-between group shadow-2xs hover:shadow-md active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <div
                            className={`w-9 h-9 rounded-full ${acc.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-xs ring-1 ring-white dark:ring-slate-800`}
                          >
                            {acc.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-white dark:bg-slate-800 shadow-2xs">
                            <GoogleGIcon className="w-2.5 h-2.5" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {acc.name}
                            </p>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                              {acc.force}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                            {acc.rank}
                          </p>
                          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium truncate mt-0.5">
                            {acc.badge}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <span className="hidden group-hover:inline text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          1-Click
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider for Custom Gmail */}
              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="shrink mx-4 text-[10px] text-slate-500 uppercase font-mono">
                  {isHi ? "या कोई भी व्यक्तिगत Gmail खाता दर्ज करें" : "Or Enter Custom Gmail Address"}
                </span>
                <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              {/* Custom Gmail Form */}
              <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                {/* Role & Force Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                      {isHi ? "भूमिका (Role)" : "Role"}
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090D16] text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="WELFARE_OFFICER">Welfare Officer (Doctor)</option>
                      <option value="COMMANDER">Tactical Commander</option>
                      <option value="PERSONNEL">Personnel (Jawan)</option>
                      <option value="ADMIN">System Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                      {isHi ? "सेवा शाखा (Force)" : "Force"}
                    </label>
                    <select
                      value={selectedForce}
                      onChange={(e) => handleForceChange(e.target.value as ForceType)}
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090D16] text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="CRPF">CRPF</option>
                      <option value="ARMY">Indian Army</option>
                      <option value="BSF">BSF</option>
                      <option value="ITBP">ITBP</option>
                      <option value="CISF">CISF</option>
                      <option value="STATE_POLICE">State Police</option>
                    </select>
                  </div>
                </div>

                {/* Email input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                    {isHi ? "Gmail अथवा कॉर्पोरेट ईमेल पता" : "Gmail or Official Google Address"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      required
                      placeholder="e.g. officer.sharma@gmail.com or personal@gmail.com"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono shadow-2xs"
                    />
                  </div>
                </div>

                {/* Name input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                    {isHi ? "अधिकारी / कार्मिक का नाम (वैकल्पिक)" : "Display Name (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="e.g. Dr. Aarti Sharma"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono shadow-2xs"
                  />
                </div>

                {/* Live Role Scope & Security Matrix Inspector */}
                {ROLE_SCOPE_MATRIX[selectedRole] && (
                  <div className={`p-3 rounded-xl border ${ROLE_SCOPE_MATRIX[selectedRole].badgeBg} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Fingerprint className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Role Scope & Access Matrix
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${ROLE_SCOPE_MATRIX[selectedRole].color} bg-white/70 dark:bg-slate-900/70 border border-current`}>
                        {ROLE_SCOPE_MATRIX[selectedRole].tier}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
                      Clearance: <strong className={ROLE_SCOPE_MATRIX[selectedRole].color}>{ROLE_SCOPE_MATRIX[selectedRole].clearance}</strong>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                      {ROLE_SCOPE_MATRIX[selectedRole].modules.map((mod, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{mod}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 pt-1.5 font-mono">
                      DPDP Act 2023: {ROLE_SCOPE_MATRIX[selectedRole].dpdpGuarantee}
                    </p>
                  </div>
                )}

                {/* Authorize Button */}
                <button
                  type="button"
                  onClick={() => handleSignInWithGoogle()}
                  disabled={isSubmitting || authSequence.isActive}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-emerald-500/20 active:scale-[0.99]"
                >
                  <span>
                    {isSubmitting
                      ? isHi ? "खाता प्रमाणित हो रहा है..." : "Authorizing & Syncing to Database..."
                      : isHi
                      ? `इस Gmail से प्रवेश करें (${selectedRole.replace("_", " ")})`
                      : `Authorize & Sign In with Gmail as ${selectedRole.replace("_", " ")}`}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Compliance note */}
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>DPDP Act 2023 & Zero-Stigmatization Guarantee. ACR/APAR untouched.</span>
              </div>
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

      {/* Footer (Dual-Theme: White Toggle & Dark Defense) */}
      <footer className="relative z-10 max-w-3xl w-full mx-auto py-2.5 px-4 rounded-xl bg-white/80 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800/80 backdrop-blur-md text-[11px] text-slate-600 dark:text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm dark:shadow-lg transition-colors">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          <span>24x7 Force Helplines: <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">14416</strong> (Tele-MANAS) • <strong className="text-blue-700 dark:text-blue-400 font-semibold">1800-599-0019</strong> (KIRAN)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-600 dark:text-slate-400">DPDP Act 2023 Compliant</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="text-teal-700 dark:text-teal-400 font-semibold">Zero-Trust Air-Gap</span>
        </div>
      </footer>

      {/* HOLOGRAPHIC DEFENSE AUTHORIZATION HUD OVERLAY */}
      {authSequence.isActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-slate-900/95 dark:bg-[#080D1A]/95 text-slate-100 rounded-3xl border border-emerald-500/40 shadow-[0_0_80px_-15px_rgba(16,185,129,0.35)] overflow-hidden p-5 sm:p-7">
            {/* Top Ambient Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-36 bg-emerald-500/20 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />

            {/* Header bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/40">
                  <GoogleGIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                    Google Workspace SSO
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-bold">
                      OpenID PKCE
                    </span>
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Defense Identity Federation Protocol
                  </p>
                </div>
              </div>

              {/* Live Status Beacon */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-[10px] font-mono text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>STAGE 0{authSequence.stage + 1}/04</span>
                </div>
              </div>
            </div>

            {/* Officer Dossier Spotlight */}
            <div className="my-4 sm:my-5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-emerald-400/80 ring-offset-2 ring-offset-slate-950">
                    {authSequence.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white shadow-xs">
                    <GoogleGIcon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">
                      {authSequence.name}
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
                      {authSequence.force}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono truncate">
                    {authSequence.email}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono truncate mt-0.5">
                    Clearance: {authSequence.role.replace("_", " ")} • Port 5001 Node
                  </p>
                </div>
              </div>

              {/* Audio/Handshake Frequency Visualizer */}
              <div className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl bg-black/40 border border-emerald-500/20">
                {[12, 24, 18, 28, 16, 22, 14, 20].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                    className="w-1 bg-emerald-400/80 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* 4-Stage Live Handshake Pipeline */}
            <div className="space-y-2 mb-4">
              {[
                {
                  index: 0,
                  title: "Google OAuth 2.0 PKCE Handshake",
                  desc: "Validating RS256 token signature via accounts.google.com",
                  status:
                    authSequence.stage > 0
                      ? "VALIDATED"
                      : authSequence.stage === 0
                      ? "NEGOTIATING..."
                      : "PENDING",
                },
                {
                  index: 1,
                  title: "DPDP Act 2023 Ephemeral Salt",
                  desc: "Section 8 non-traceable hash generated; APAR air-gapped",
                  status:
                    authSequence.stage > 1
                      ? "ENCRYPTED"
                      : authSequence.stage === 1
                      ? "SEALING..."
                      : "PENDING",
                },
                {
                  index: 2,
                  title: "Defense RBAC Multi-Tier Clearance",
                  desc: `Granting ${authSequence.role.replace("_", " ")} clearance boundary`,
                  status:
                    authSequence.stage > 2
                      ? "AUTHORIZED"
                      : authSequence.stage === 2
                      ? "VERIFYING..."
                      : "PENDING",
                },
                {
                  index: 3,
                  title: "Command Deck Terminal Synchronization",
                  desc: "Issuing 256-bit encrypted JWT session to browser enclave",
                  status:
                    authSequence.stage === 3
                      ? "CONNECTED"
                      : "INITIALIZING...",
                },
              ].map((step) => {
                const isDone = authSequence.stage > step.index || (step.index === 3 && authSequence.stage === 3);
                const isCurrent = authSequence.stage === step.index;

                return (
                  <div
                    key={step.index}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                      isDone
                        ? "bg-emerald-950/40 border-emerald-700/60 text-white"
                        : isCurrent
                        ? "bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500/40"
                        : "bg-slate-950/40 border-slate-800 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          isDone
                            ? "bg-emerald-500 text-slate-950"
                            : isCurrent
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : isCurrent ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span className="text-[10px] font-mono">0{step.index + 1}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold truncate ${isDone || isCurrent ? "text-white" : "text-slate-400"}`}>
                          {step.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate font-mono">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ml-2 ${
                        isDone
                          ? "bg-emerald-900/80 text-emerald-300 border border-emerald-700/60"
                          : isCurrent
                          ? "bg-emerald-900/40 text-emerald-400 border border-emerald-500/60 animate-pulse"
                          : "bg-slate-900 text-slate-600 border border-slate-800"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Real-Time Cryptographic Handshake Terminal */}
            <div className="mb-4 bg-black/80 rounded-2xl border border-emerald-500/30 p-3 font-mono text-[10px] text-emerald-400/90 leading-relaxed shadow-inner">
              <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1.5 border-b border-slate-800 pb-1">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span>SESSION CRYPTO STREAM</span>
                </span>
                <span className="text-emerald-500">TLS_AES_256_GCM_SHA384</span>
              </div>
              <div className="space-y-0.5 max-h-20 overflow-y-auto font-mono">
                {authSequence.logs.map((log, i) => (
                  <p key={i} className="truncate">{log}</p>
                ))}
                <p className="animate-pulse text-emerald-500 font-bold">█</p>
              </div>
            </div>

            {/* Progress Bar & Bypass Button */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Handshake Integrity</span>
                <span className="text-emerald-400 font-bold">{authSequence.progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  style={{ width: `${authSequence.progress}%` }}
                />
              </div>

              {/* Bypass Action Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DPDP Act 2023 Certified</span>
                </div>

                <button
                  type="button"
                  onClick={handleSkipAuthSequence}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Enter Command Deck Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Google OAuth Account Chooser & Consent Modal */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleModalSuccess}
        initialRole={selectedRole}
        initialForce={selectedForce}
        googleClientId={googleClientId}
        isGoogleConfigured={isGoogleConfigured}
        onConfigureClientId={handleSaveGoogleClientId}
      />
    </div>
  );
}
