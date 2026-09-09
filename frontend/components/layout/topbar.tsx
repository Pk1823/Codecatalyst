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
  BookOpen,
  Lightbulb,
  X,
  Lock,
  Heart,
  Stethoscope,
  Smile,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideTab, setGuideTab] = useState<"overview" | "colors" | "roles" | "privacy">("overview");

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
            className="flex items-center gap-1 px-1.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-bold"
            title="Go back to previous screen"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Dynamic Breadcrumb Hierarchy */}
          <div className="flex flex-col ml-1">
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:inline">
                {breadcrumb.section}
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>
              <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate max-w-[140px] sm:max-w-xs md:max-w-none">
                {breadcrumb.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Controls, Role Switcher & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Role Switcher Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]",
                roleBadge.color
              )}
              title="Click to Switch Role View (Jawan, Welfare Officer, Commander, Admin)"
            >
              <RoleIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">{roleBadge.label}</span>
              <span className="sm:hidden">{roleBadge.label.split(" ")[0]}</span>
              <ChevronDown className="h-3 w-3 opacity-75" />
            </button>

            {roleMenuOpen && (
              <div
                className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                      {lang === "hi" ? "सक्रिय भूमिका बदलें" : "Switch Active Persona"}
                    </p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">1-Click</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === "hi" ? "अलग-अलग दृष्टिकोण से सिस्टम को समझें" : "Explore the system from any operational perspective"}
                  </p>
                </div>

                <div className="space-y-1">
                  {[
                    {
                      id: "WELFARE_OFFICER" as UserRole,
                      title: "Welfare Officer",
                      hiTitle: "कल्याण अधिकारी",
                      icon: UserCheck,
                      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800",
                      desc: "Triage fatigue, manage cases & assign interventions",
                    },
                    {
                      id: "PERSONNEL" as UserRole,
                      title: "Jawan / Soldier",
                      hiTitle: "जवान (सैनिक)",
                      icon: HeartPulse,
                      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800",
                      desc: "Daily vitals check-in, self-test & confidential support",
                    },
                    {
                      id: "COMMANDER" as UserRole,
                      title: "Tactical Commander",
                      hiTitle: "कमांडर",
                      icon: Activity,
                      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800",
                      desc: "Battalion readiness radar & troop fitness overview",
                    },
                    {
                      id: "ADMIN" as UserRole,
                      title: "System Administrator",
                      hiTitle: "सिस्टम व्यवस्थापक",
                      icon: Shield,
                      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800",
                      desc: "DPDP compliance, audit trails & system settings",
                    },
                  ].map((r) => {
                    const RIcon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          setRoleMenuOpen(false);
                          handleRoleQuickSwitch(r.id);
                        }}
                        className={cn(
                          "w-full text-left p-2 rounded-xl transition-all flex items-start gap-2.5 border",
                          isSelected
                            ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-500/20"
                            : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-200 dark:hover:border-slate-800"
                        )}
                      >
                        <div className={cn("p-1.5 rounded-lg border shrink-0 mt-0.5", r.color)}>
                          <RIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {lang === "hi" ? r.hiTitle : r.title}
                            </p>
                            {isSelected && (
                              <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/60 px-1.5 py-0.2 rounded">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                            {r.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Guide "How It Works" Button */}
          <button
            onClick={() => setGuideOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all text-xs font-semibold shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
            title="How MissionWell AI Works / कैसे काम करता है"
          >
            <Lightbulb className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="hidden md:inline font-bold">{lang === "hi" ? "गाइड" : "How It Works"}</span>
          </button>

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

          {/* Bilingual Language Switcher (EN / हिन्दी) */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-1.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Toggle Language (English / हिन्दी)"
          >
            <Languages className="h-3.5 w-3.5" />
            <span className="text-[11px] font-mono font-bold">{lang === "en" ? "हिन्दी" : "EN"}</span>
          </button>



          {/* Quick Search Button removed */}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 px-1.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title={theme === "dark" ? "Dark mode active — click for light mode" : "Light mode active — click for dark mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-3.5 w-3.5" />
                <span className="hidden md:inline font-mono text-[10px] font-bold">Dark</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5" />
                <span className="hidden md:inline font-mono text-[10px] font-bold">Light</span>
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
            {(() => {
              let count = 3;
              try {
                if (typeof window !== "undefined") {
                  const customStr = localStorage.getItem("missionwell_custom_alerts");
                  if (customStr) {
                    const alerts = JSON.parse(customStr);
                    count += alerts.filter((a: any) => !a.isRead).length;
                  }
                }
              } catch (e) {}
              return count > 0 ? (
                <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white font-mono shadow-xs">
                  {count}
                </span>
              ) : null;
            })()}
          </Link>

          {/* User Profile & Persona Quick Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1.5 px-1.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-hidden"
              aria-label="User profile and persona switch menu"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-6 w-6 rounded-full object-cover border border-emerald-500/40 shadow-xs shrink-0"
                />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-sm text-slate-900 dark:text-white font-mono font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
              )}
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
                  <div className="flex items-center gap-2.5">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover border border-emerald-500/40 shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-800 dark:text-emerald-300 font-bold text-xs shrink-0">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          ONLINE
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${roleBadge.color}`}>
                      {roleBadge.label}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono font-semibold">{force}</span>
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

      {/* Interactive Quick Guide & How It Works Modal */}
      {guideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-6 py-4 bg-slate-50/50 dark:bg-[#090D16]/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 shadow-xs">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{lang === "hi" ? "मिशनवेल एआई गाइड" : "How MissionWell AI Works"}</span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      User Guide
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === "hi"
                      ? "सशस्त्र बलों के स्वास्थ्य एवं विश्राम की सरल और गोपनीय प्रणाली"
                      : "A simple, friendly guide to understanding defense wellness & fatigue care"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGuideOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition-colors"
                aria-label="Close guide"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center border-b border-slate-100 dark:border-slate-800 px-6 gap-2 sm:gap-4 overflow-x-auto text-xs font-semibold py-2 bg-white dark:bg-[#0F172A]">
              {[
                { id: "overview" as const, label: lang === "hi" ? "💡 सिस्टम परिचय" : "💡 3-Step Overview" },
                { id: "colors" as const, label: lang === "hi" ? "🚦 रंग संकेत" : "🚦 Traffic Lights" },
                { id: "roles" as const, label: lang === "hi" ? "👥 भूमिकाएं" : "👥 Role Personas" },
                { id: "privacy" as const, label: lang === "hi" ? "🔒 गोपनीयता व सुरक्षा" : "🔒 Zero-Stigma Privacy" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setGuideTab(tab.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl transition-all whitespace-nowrap",
                    guideTab === tab.id
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content Body */}
            <div className="overflow-y-auto p-6 space-y-4 text-xs text-slate-700 dark:text-slate-300">
              {guideTab === "overview" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-slate-800 dark:text-slate-200 space-y-1.5">
                    <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{lang === "hi" ? "हमारा उद्देश्य: तनाव और थकान की समय पर पहचान" : "Our Mission: Proactive Care Before Burnout"}</span>
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {lang === "hi"
                        ? "मिशनवेल एआई सुरक्षा बलों के जवानों को अत्यधिक थकान और मानसिक तनाव से बचाने का एक मित्रवत साथी है। यह आपको समय पर आराम, सहायता और डॉक्टर से परामर्श लेने में मदद करता है।"
                        : "MissionWell AI is designed as a caring digital companion for defense personnel. Instead of waiting for severe burnout or fatigue to cause harm, the system spots early signs of fatigue and helps schedule restful rotations and medical support."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold font-mono">
                        1
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {lang === "hi" ? "दैनिक संकेत" : "1. Duty Signals"}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {lang === "hi"
                          ? "नींद के घंटे, लगातार गश्त के दिन और त्वरित 1-क्लिक चेक-इन दर्ज होते हैं।"
                          : "Tracks sleep hours, consecutive field deployments, and optional 10-second daily vitals."}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold font-mono">
                        2
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {lang === "hi" ? "स्मार्ट रडार" : "2. Fatigue Radar"}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {lang === "hi"
                          ? "सिस्टम बिना किसी पूर्वाग्रह के थकान का आकलन करता है और सुरक्षित अलर्ट देता है।"
                          : "Calculates fatigue objectively using transparent traffic light indicators."}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                        3
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {lang === "hi" ? "देखभाल व विश्राम" : "3. Rest & Care"}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {lang === "hi"
                          ? "कल्याण अधिकारी रोटेशनल छुट्टी, डॉक्टर परामर्श या बडी सहायता की व्यवस्था करते हैं।"
                          : "Welfare Officers schedule stand-down rest, counseling, or lighter duties without penalties."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {guideTab === "colors" && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === "hi"
                      ? "डैशबोर्ड पर दिखने वाले रंगों का सरल अर्थ इस प्रकार है:"
                      : "Here is how to read the traffic-light health scores across all pages:"}
                  </p>

                  <div className="p-3.5 rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/30 flex items-start gap-3">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 mt-1 shrink-0 ring-4 ring-emerald-500/20" />
                    <div>
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-xs">
                        {lang === "hi" ? "हरा संकेत (0 - 39%): फिट और स्वस्थ (Fit & Ready)" : "Green (0 - 39%): Fit & Ready"}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                        {lang === "hi"
                          ? "सैनिक पूरी तरह स्वस्थ है, पर्याप्त नींद ली है और सामान्य ड्यूटी के लिए तैयार है।"
                          : "Personnel is well-rested with balanced sleep patterns. Ready for routine operational duties."}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/30 flex items-start gap-3">
                    <div className="h-3 w-3 rounded-full bg-amber-500 mt-1 shrink-0 ring-4 ring-amber-500/20" />
                    <div>
                      <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs">
                        {lang === "hi" ? "पीला संकेत (40 - 69%): ध्यान अपेक्षित (Moderate Watch)" : "Amber (40 - 69%): Moderate Watch"}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                        {lang === "hi"
                          ? "लगातार रात की ड्यूटी या नींद की कमी। बडी चेक-इन, पर्याप्त पानी और हल्की ड्यूटी की सलाह दी जाती है।"
                          : "Shows mild sleep deficit or extended night shifts. Recommend buddy check-in, hydration, or lighter duty."}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-rose-300 dark:border-rose-800/80 bg-rose-50/70 dark:bg-rose-950/30 flex items-start gap-3">
                    <div className="h-3 w-3 rounded-full bg-rose-500 mt-1 shrink-0 ring-4 ring-rose-500/20" />
                    <div>
                      <h4 className="font-bold text-rose-900 dark:text-rose-300 text-xs">
                        {lang === "hi" ? "लाल संकेत (70 - 100%): विश्राम जरूरी (Rest Rotation Needed)" : "Red (70 - 100%): Priority Rest Needed"}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                        {lang === "hi"
                          ? "लगातार उच्च ड्यूटी तनाव या थकान। कल्याण अधिकारी द्वारा तत्काल विश्राम (Stand-down) या चिकित्सा जांच की सलाह।"
                          : "Consecutive high operational shifts detected. Welfare Officer should schedule a stand-down rest or medical checkup."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {guideTab === "roles" && (
                <div className="space-y-2.5 animate-in fade-in duration-150">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {lang === "hi"
                      ? "आप टॉपबार के रोल बटन से कभी भी 1-क्लिक में भूमिका बदल सकते हैं:"
                      : "You can switch between any of these 4 roles using the Topbar pill anytime:"}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <HeartPulse className="h-4 w-4 text-amber-500" />
                        <span>{lang === "hi" ? "जवान (सैनिक पोर्टल)" : "Jawan (Soldier)"}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lang === "hi"
                          ? "व्यक्तिगत स्कोर देखें, 10 सेकंड में दैनिक चेक-इन करें, या गोपनीय अवकाश/सहायता मांगें।"
                          : "Log daily vitals, take 1-minute wellness assessments, or request confidential rest support."}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <UserCheck className="h-4 w-4 text-emerald-500" />
                        <span>{lang === "hi" ? "कल्याण अधिकारी" : "Welfare Officer"}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lang === "hi"
                          ? "थके जवानों की पहचान करें, कल्याण मामले खोलें और हस्तक्षेप (Interventions) दर्ज करें।"
                          : "Review active troop fatigue, triage cases, and assign rest or counseling interventions."}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span>{lang === "hi" ? "कमांडर" : "Tactical Commander"}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lang === "hi"
                          ? "पूरी बटालियन की परिचालन तत्परता और समग्र थकान रुझान का उच्च-स्तरीय अवलोकन।"
                          : "High-level overview of battalion troop readiness, stress trends, and unit rotations."}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <Shield className="h-4 w-4 text-purple-500" />
                        <span>{lang === "hi" ? "सिस्टम व्यवस्थापक" : "System Admin"}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lang === "hi"
                          ? "डीपीडीपी अधिनियम अनुपालन, सुरक्षा ऑडिट लॉग और डेटा प्रबंधन।"
                          : "Manage audit logs, DPDP Act 2023 compliance, and access security settings."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {guideTab === "privacy" && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-slate-800 dark:text-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm">
                      <Lock className="h-4 w-4" />
                      <span>{lang === "hi" ? "100% गोपनीय और बिना किसी पूर्वाग्रह के" : "100% Confidential & Non-Punitive"}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {lang === "hi"
                        ? "मिशनवेल एआई भारतीय डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम 2023 के तहत काम करता है। सहायता मांगना आपकी सेवा, पदोन्नति या करियर रिकॉर्ड को किसी भी तरह से प्रभावित नहीं करता।"
                        : "MissionWell AI is strictly governed under the Digital Personal Data Protection (DPDP) Act 2023. Seeking rest or welfare support will NEVER negatively impact your service record, postings, or promotion prospects."}
                    </p>
                  </div>

                  <ul className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300 list-disc pl-4">
                    <li>
                      <strong>{lang === "hi" ? "शून्य कलंक (Zero Stigma):" : "Zero Stigma Guarantee:"}</strong>{" "}
                      {lang === "hi" ? "थकान को कमजोरी नहीं, बल्कि सामान्य मानव शरीर की स्वाभाविक प्रतिक्रिया माना जाता है।" : "Fatigue is treated as a natural physiological condition, never a personal weakness."}
                    </li>
                    <li>
                      <strong>{lang === "hi" ? "कमांडरों से गोपनीयता:" : "Medical Privilege:"}</strong>{" "}
                      {lang === "hi" ? "कमांडिंग ऑफिसर व्यक्तिगत परीक्षण उत्तर नहीं देख सकते—केवल स्वास्थ्य रडार देखते हैं।" : "Officers only see aggregate fatigue status; your personal quiz answers are never shared."}
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-3.5 bg-slate-50/50 dark:bg-[#090D16]/50">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                MissionWell AI v2.4 • DPDP Act 2023 Compliant
              </span>
              <button
                onClick={() => setGuideOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xs hover:opacity-90 transition-all"
              >
                {lang === "hi" ? "समझ गया, पोर्टल पर जाएं" : "Got It, Close Guide"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

