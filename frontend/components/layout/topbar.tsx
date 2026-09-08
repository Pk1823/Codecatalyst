"use client";

import React, { useState } from "react";
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
  Lock,
} from "lucide-react";
import { useAuth, useTheme, useToast, ForceType } from "@/components/providers";
import { GlobalSearchModal } from "@/components/search/global-search-modal";

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout, force, setForce, lang, toggleLang } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [forceMenuOpen, setForceMenuOpen] = useState(false);

  // Generate breadcrumb from pathname with bilingual support
  const getBreadcrumb = () => {
    const isHi = lang === "hi";
    if (pathname === "/") return { title: "MissionWell AI", section: isHi ? "सार्वजनिक पोर्टल" : "Public Portal" };
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

  const handleForceSwitch = (newForce: ForceType) => {
    setForce(newForce);
    setForceMenuOpen(false);
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
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#090D16]/90 px-4 sm:px-6 backdrop-blur-md transition-colors">
        {/* Left Side: Mobile Hamburger, Back Button & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white focus:outline-hidden transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Navigation Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-medium shadow-xs"
            title="Go back to previous screen"
          >
            <ChevronLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex flex-col ml-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                {force}
              </span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="text-slate-600 dark:text-slate-400">{breadcrumb.section}</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F8FAFC] tracking-tight truncate max-w-[200px] sm:max-w-none">
              {breadcrumb.title}
            </h1>
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Force Branch Context Dropdown */}
          <div className="relative">
            <button
              onClick={() => setForceMenuOpen(!forceMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
              title="Select Force Branch (CRPF, BSF, ITBP, CISF, Army, Police)"
            >
              <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono text-[11px] font-semibold">{force}</span>
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
            <span className="text-[11px] font-mono font-semibold">{lang === "en" ? "हिन्दी" : "EN"}</span>
          </button>

          {/* Quick Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200 transition-all shadow-xs"
            title="Global Quick Search (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden lg:inline text-[11px]">Search records...</span>
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

          {/* Notifications Bell */}
          <Link
            href="/alerts"
            className="relative rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Welfare Alerts & Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </Link>

          {/* User Profile & Secure Sign Out */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-lg p-1 px-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-hidden shadow-xs"
              aria-label="User profile menu"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-white font-mono font-bold text-xs shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col text-left leading-none">
                <span className="text-xs font-semibold text-slate-900 dark:text-[#F8FAFC] truncate max-w-[90px]">{user.name}</span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono uppercase mt-0.5">{role.replace("_", " ")}</span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">{user.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{user.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 uppercase">
                      {user.role}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">{force}</span>
                  </div>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Sliders className="h-3.5 w-3.5 text-slate-400" />
                  <span>Profile & Settings</span>
                </Link>

                <Link
                  href="/privacy"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                  <span>Privacy Protocol</span>
                </Link>

                <Link
                  href="/personnel/support"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  <span>Help & Helpline</span>
                </Link>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
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
