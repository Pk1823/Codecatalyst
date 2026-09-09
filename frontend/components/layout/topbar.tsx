"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Sliders,
  ShieldCheck,
  HelpCircle,
  Languages,
  Layers,
  ChevronLeft,
  Presentation,
  UserCheck,
  Activity,
  HeartPulse,
  Shield,
  Check,
  Sparkles,
} from "lucide-react";
import { useAuth, useTheme, useToast, ForceType } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { AuthService } from "@/services/auth.service";
import { GlobalSearchModal } from "@/components/search/global-search-modal";
import { ServerStatusPill } from "@/components/common/server-status-pill";

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, switchRole, logout, force, setForce, lang, toggleLang } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [forceMenuOpen, setForceMenuOpen] = useState(false);

  // Google SSO Verified Active Session Detection
  const [googleSsoData, setGoogleSsoData] = useState<{
    email: string;
    name: string;
    role: string;
    force?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("google_sso_welcome");
      if (stored) {
        try {
          setGoogleSsoData(JSON.parse(stored));
        } catch {}
      } else if (user?.email && (user.email.includes("@gmail.com") || user.email.includes("google"))) {
        setGoogleSsoData({
          email: user.email,
          name: user.name || "Officer",
          role: role,
          force: force,
        });
      }
    }
  }, [user, role, force]);

  // Generate breadcrumb from pathname with accurate bilingual support
  const getBreadcrumb = () => {
    const isHi = lang === "hi";
    if (pathname === "/") return { title: "MissionWell AI", section: isHi ? "सार्वजनिक पोर्टल" : "Public Portal" };
    if (pathname === "/presentation") return { title: isHi ? "कार्यकारी प्रस्तुति डेक" : "Executive Presentation Deck", section: isHi ? "सिस्टम डॉक" : "Doctrine & Brief" };
    if (pathname === "/personnel") return { title: isHi ? "जवान कल्याण पोर्टल" : "Personnel Wellbeing", section: isHi ? "स्व-सेवा" : "Self-Service" };
    if (pathname === "/personnel/wellness") return { title: isHi ? "कल्याण स्व-मूल्यांकन" : "Wellness Assessment", section: isHi ? "जवान पोर्टल" : "Personnel Portal" };
    if (pathname === "/personnel/support") return { title: isHi ? "गोपनीय सहायता अनुरोध" : "Request Welfare Support", section: isHi ? "जवान पोर्टल" : "Personnel Portal" };
    if (pathname === "/personnel/privacy") return { title: isHi ? "व्यक्तिगत गोपनीयता नियंत्रण" : "Personal Privacy Controls", section: isHi ? "सुरक्षा नीति" : "Personnel Portal" };
    if (pathname === "/welfare") return { title: isHi ? "कल्याण कमान केंद्र" : "Welfare Intelligence", section: isHi ? "अधिकारी कमान" : "Officer Command" };
    if (pathname === "/welfare/cases") return { title: isHi ? "सक्रिय कल्याण मामले" : "Active Welfare Cases", section: isHi ? "मामला प्रबंधन" : "Case Management" };
    if (pathname.startsWith("/welfare/cases/")) return { title: isHi ? "मामला विवरण एवं समयरेखा" : "Case Details & Timeline", section: isHi ? "कल्याण समीक्षा" : "Welfare Cases" };
    if (pathname === "/analytics") return { title: isHi ? "पूर्वानुमानित जोखिम विश्लेषण" : "Risk Analytics", section: isHi ? "खुफिया डेटा" : "Predictive Intelligence" };
    if (pathname.startsWith("/analytics/personnel/")) return { title: isHi ? "स्पष्टीकरणीय एआई विवरण" : "Explainable Risk Detail", section: isHi ? "जोखिम विश्लेषण" : "Risk Analytics" };
    if (pathname === "/interventions") return { title: isHi ? "कल्याणकारी हस्तक्षेप" : "Intervention Management", section: isHi ? "सहायता कार्यक्रम" : "Support Programs" };
    if (pathname === "/recommendations") return { title: isHi ? "एआई निर्णय सिफ़ारिशें" : "AI Recommendations", section: isHi ? "निर्णय समर्थन" : "Decision Support" };
    if (pathname === "/commander") return { title: isHi ? "बल समग्र कल्याण अवलोकन" : "Force Wellness Overview", section: isHi ? "कमांडर डैशबोर्ड" : "Commander Dashboard" };
    if (pathname === "/admin") return { title: isHi ? "प्रणाली प्रशासन" : "System Administration", section: isHi ? "शासन" : "Governance" };
    if (pathname === "/alerts") return { title: isHi ? "चेतावनी केंद्र" : "Alert Center", section: isHi ? "अधिसूचनाएं" : "Notifications" };
    if (pathname === "/reports") return { title: isHi ? "कल्याण रिपोर्ट जनरेटर" : "Reports Generator", section: isHi ? "खुफिया रिपोर्ट" : "Intelligence Reports" };
    if (pathname === "/audit") return { title: isHi ? "अनुपालन एवं ऑडिट लॉग" : "Audit & Compliance Log", section: isHi ? "शून्य-विश्वास रिकॉर्ड" : "Zero-Trust Records" };
    if (pathname === "/privacy") return { title: isHi ? "गोपनीयता एवं डीपीए केंद्र" : "Privacy Center", section: isHi ? "डीपीडीपी अधिनियम 2023" : "Security & Governance" };
    if (pathname === "/settings") return { title: isHi ? "प्रणाली सेटिंग्स" : "System Settings", section: isHi ? "प्राथमिकताएं" : "Preferences" };
    return { title: "MissionWell AI", section: "Welfare Intelligence" };
  };

  const breadcrumb = getBreadcrumb();

  const getRoleBadge = (currentRole: UserRole) => {
    switch (currentRole) {
      case "WELFARE_OFFICER":
        return {
          label: "Welfare Officer",
          color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80",
          icon: UserCheck,
        };
      case "COMMANDER":
        return {
          label: "Commander",
          color: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800/80",
          icon: Activity,
        };
      case "PERSONNEL":
        return {
          label: "Personnel (Jawan)",
          color: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80",
          icon: HeartPulse,
        };
      case "ADMIN":
        return {
          label: "System Admin",
          color: "text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800/80",
          icon: Shield,
        };
      default:
        return {
          label: currentRole,
          color: "text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700",
          icon: ShieldCheck,
        };
    }
  };

  const roleBadge = getRoleBadge(role as UserRole);
  const RoleIcon = roleBadge.icon;

  const handleForceSwitch = (newForce: ForceType) => {
    setForce(newForce);
    setForceMenuOpen(false);
    toast({
      title: "Force Context Switched",
      description: `Active doctrine adjusted for ${newForce}.`,
      type: "info",
    });
  };

  const handleRoleQuickSwitch = (targetRole: UserRole) => {
    switchRole(targetRole);
    setProfileOpen(false);
    toast({
      title: "Role Persona Switched",
      description: `Terminal active as ${targetRole.replace("_", " ")}.`,
      type: "success",
    });
    router.push(AuthService.getRedirectPathForRole(targetRole));
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    toast({
      title: "Logged Out",
      description: "Session terminated. Return via authorized sign-in.",
      type: "info",
    });
    router.push("/login");
  };

  const forcesList: { id: ForceType; name: string; full: string }[] = [
    { id: "CRPF", name: "CRPF", full: "Central Reserve Police Force" },
    { id: "BSF", name: "BSF", full: "Border Security Force" },
    { id: "ITBP", name: "ITBP", full: "Indo-Tibetan Border Police" },
    { id: "CISF", name: "CISF", full: "Central Industrial Security Force" },
    { id: "ARMY", name: "Indian Army", full: "Armed Forces Command" },
    { id: "STATE_POLICE", name: "State Police", full: "State Police Welfare Wing" },
  ];

  return (
    <>
      {/* Sovereign National Tricolor Accent Strip */}
      <div className="h-[2.5px] w-full flex shrink-0">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#090D16]/90 px-4 sm:px-6 backdrop-blur-xl transition-colors shadow-xs">
        {/* Left Side: Mobile Hamburger, Back Button, Breadcrumb & Server Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white focus:outline-hidden transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Back Navigation Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-semibold shadow-xs"
            title="Go back to previous screen"
          >
            <ChevronLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Breadcrumb Hierarchy */}
          <div className="flex flex-col ml-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {force}
              </span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="text-slate-600 dark:text-slate-400 font-medium">{breadcrumb.section}</span>
              <span className="text-slate-300 dark:text-slate-600 hidden md:inline">/</span>
              {/* Role chip */}
              <span className={`hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${roleBadge.color}`}>
                <RoleIcon className="h-3 w-3" />
                <span>{roleBadge.label}</span>
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight truncate max-w-[180px] sm:max-w-xs md:max-w-none">
              {breadcrumb.title}
            </h1>
          </div>

          {/* Minimal Server Status Pill on larger screens */}
          <div className="hidden xl:flex ml-3 pl-3 border-l border-slate-200 dark:border-slate-800">
            <ServerStatusPill variant="minimal" />
          </div>
        </div>

        {/* Right Side: Quick Controls & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Google SSO Verified Badge */}
          {googleSsoData && (
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 text-[10px] font-mono shadow-2xs"
              title={`Google Workspace SSO Verified: ${googleSsoData.email} (${googleSsoData.role.replace("_", " ")})`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="text-blue-700 dark:text-blue-300 font-bold font-sans">
                Google SSO
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                Verified
              </span>
            </div>
          )}

          {/* Force Branch Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setForceMenuOpen(!forceMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
              title="Select Uniformed Service Branch"
            >
              <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono text-[11px] font-bold">{force}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {forceMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setForceMenuOpen(false)}
              >
                <div className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Uniformed Service
                </div>
                {forcesList.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleForceSwitch(f.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      force === f.id
                        ? "bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="text-left">
                      <span className="block font-semibold">{f.name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{f.full}</span>
                    </div>
                    {force === f.id && <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bilingual Language Switcher (EN / हिन्दी) */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
            title="Toggle Language (English / हिन्दी)"
          >
            <Languages className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px] font-mono font-bold">{lang === "en" ? "हिन्दी" : "EN"}</span>
          </button>

          {/* Executive Presentation Deck Link Button */}
          <Link
            href="/presentation"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-teal-500/30 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
            title="View Executive Pitch Deck & System Brief"
          >
            <Presentation className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden xl:inline font-mono text-[11px]">Judge Pitch Deck</span>
          </Link>

          {/* Quick Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200 transition-all shadow-xs"
            title="Global Quick Search (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden lg:inline text-[11px]">Search...</span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Ctrl K
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
            title={theme === "dark" ? "Dark mode active — click for light mode" : "Light mode active — click for dark mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400 transition-transform rotate-0" />
                <span className="hidden md:inline font-mono text-[10px] font-medium text-slate-300">Dark</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-blue-600 transition-transform -rotate-12" />
                <span className="hidden md:inline font-mono text-[10px] font-medium text-slate-700">Light</span>
              </>
            )}
          </button>

          {/* Alert Notifications Bell with Unread Badge */}
          <Link
            href="/alerts"
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Welfare Alerts & Critical Triage Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white font-mono shadow-xs">
              3
            </span>
          </Link>

          {/* User Profile & Persona Quick Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-lg p-1 px-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-hidden shadow-xs"
              aria-label="User profile and persona switch menu"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-white font-mono font-bold text-xs shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col text-left leading-none">
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[100px]">{user.name}</span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono uppercase mt-0.5">{role.replace("_", " ")}</span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setProfileOpen(false)}
              >
                {/* Active Session Info */}
                <div className="px-2.5 py-2 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">{user.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${roleBadge.color}`}>
                      {roleBadge.label}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono font-semibold">{force}</span>
                  </div>
                </div>

                {/* 1-Click Evaluation Persona Switcher */}
                <div className="px-2 py-1 mb-1 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-100 dark:border-slate-800/80">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Quick Role Switcher:
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => handleRoleQuickSwitch("WELFARE_OFFICER")}
                      className={`px-2 py-1 rounded text-[10px] font-mono text-left transition-colors flex items-center gap-1 ${
                        role === "WELFARE_OFFICER"
                          ? "bg-emerald-600 text-white font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <UserCheck className="h-3 w-3" />
                      <span>Welfare</span>
                    </button>
                    <button
                      onClick={() => handleRoleQuickSwitch("COMMANDER")}
                      className={`px-2 py-1 rounded text-[10px] font-mono text-left transition-colors flex items-center gap-1 ${
                        role === "COMMANDER"
                          ? "bg-blue-600 text-white font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Activity className="h-3 w-3" />
                      <span>Commander</span>
                    </button>
                    <button
                      onClick={() => handleRoleQuickSwitch("PERSONNEL")}
                      className={`px-2 py-1 rounded text-[10px] font-mono text-left transition-colors flex items-center gap-1 ${
                        role === "PERSONNEL"
                          ? "bg-amber-600 text-white font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <HeartPulse className="h-3 w-3" />
                      <span>Jawan</span>
                    </button>
                    <button
                      onClick={() => handleRoleQuickSwitch("ADMIN")}
                      className={`px-2 py-1 rounded text-[10px] font-mono text-left transition-colors flex items-center gap-1 ${
                        role === "ADMIN"
                          ? "bg-purple-600 text-white font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Shield className="h-3 w-3" />
                      <span>Admin</span>
                    </button>
                  </div>
                </div>

                {/* Navigation Links */}
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Sliders className="h-3.5 w-3.5 text-slate-400" />
                  <span>Profile & Settings</span>
                </Link>

                <Link
                  href="/privacy"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                  <span>DPDP Privacy Protocol</span>
                </Link>

                <Link
                  href="/personnel/support"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  <span>Help & Helpline</span>
                </Link>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 transition-colors font-medium"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out (Switch Account)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

