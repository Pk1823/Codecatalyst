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
  User as UserIcon,
  ShieldAlert,
  ChevronDown,
  LogOut,
  Sliders,
  ShieldCheck,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useAuth, useTheme, useToast } from "@/components/providers";
import { UserRole } from "@/types/auth";
import { GlobalSearchModal } from "@/components/search/global-search-modal";

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Generate breadcrumb from pathname
  const getBreadcrumb = () => {
    if (pathname === "/") return { title: "MissionWell AI", section: "Public Portal" };
    if (pathname === "/personnel") return { title: "Personnel Wellbeing", section: "Self-Service" };
    if (pathname === "/personnel/wellness") return { title: "Wellness Assessment", section: "Personnel Portal" };
    if (pathname === "/personnel/support") return { title: "Request Welfare Support", section: "Personnel Portal" };
    if (pathname === "/personnel/privacy") return { title: "Personal Privacy Controls", section: "Personnel Portal" };
    if (pathname === "/welfare") return { title: "Welfare Intelligence", section: "Officer Command" };
    if (pathname === "/welfare/cases") return { title: "Active Welfare Cases", section: "Case Management" };
    if (pathname.startsWith("/welfare/cases/")) return { title: "Case Details & Timeline", section: "Welfare Cases" };
    if (pathname === "/analytics") return { title: "Risk Analytics", section: "Predictive Intelligence" };
    if (pathname.startsWith("/analytics/personnel/")) return { title: "Explainable Risk Detail", section: "Risk Analytics" };
    if (pathname === "/interventions") return { title: "Intervention Management", section: "Support Programs" };
    if (pathname === "/recommendations") return { title: "AI Recommendations", section: "Decision Support" };
    if (pathname === "/commander") return { title: "Force Wellness Overview", section: "Commander Dashboard" };
    if (pathname === "/admin") return { title: "System Administration", section: "Governance" };
    if (pathname === "/alerts") return { title: "Alert Center", section: "Notifications" };
    if (pathname === "/reports") return { title: "Reports Generator", section: "Intelligence Reports" };
    if (pathname === "/audit") return { title: "Audit & Compliance Log", section: "Zero-Trust Records" };
    if (pathname === "/privacy") return { title: "Privacy Center", section: "Security & Governance" };
    if (pathname === "/settings") return { title: "System Settings", section: "Preferences" };
    if (pathname === "/presentation") return { title: "Hackathon Presentation", section: "Judge Pitch Deck" };
    return { title: "MissionWell AI", section: "Intelligence Platform" };
  };

  const breadcrumb = getBreadcrumb();

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setRoleMenuOpen(false);
    if (newRole === "PERSONNEL") router.push("/personnel");
    else if (newRole === "WELFARE_OFFICER") router.push("/welfare");
    else if (newRole === "COMMANDER") router.push("/commander");
    else if (newRole === "ADMIN") router.push("/admin");
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    toast({
      title: "Logged Out",
      description: "Returning to secure sign-in portal.",
      type: "info",
    });
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 backdrop-blur-md transition-colors">
        {/* Left Side: Mobile Hamburger & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              <span>MissionWell AI</span>
              <span>/</span>
              <span>{breadcrumb.section}</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {breadcrumb.title}
            </h1>
          </div>
        </div>

        {/* Center / Right Side: Search, Role Badge, Theme, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs"
            title="Global Quick Search (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Search records, cases, units...</span>
            <span className="hidden sm:inline-block rounded-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-300">
              Ctrl K
            </span>
          </button>

          {/* Demo Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100/70 transition-colors shadow-2xs"
              title="Switch demo persona for testing"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Role:</span>
              <span className="truncate max-w-[110px]">{role.replace("_", " ")}</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>

            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Demo Persona
                </div>
                {(
                  [
                    { r: "PERSONNEL", label: "Personnel (Ct. Piyush)", desc: "Self-assessment & confidential care" },
                    { r: "WELFARE_OFFICER", label: "Welfare Officer (Dr. Sharma)", desc: "Case management & risk analytics" },
                    { r: "COMMANDER", label: "Commander (Col. Singh)", desc: "Force-level anonymized overview" },
                    { r: "ADMIN", label: "System Admin (Patel)", desc: "System audit & role policies" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.r}
                    onClick={() => handleRoleSwitch(item.r)}
                    className={`w-full flex flex-col text-left px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      role === item.r
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications Bell */}
          <Link
            href="/alerts"
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
            title="Welfare Alerts & Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden"
              aria-label="User profile menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white dark:bg-blue-600 font-bold text-xs shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {user.rank || user.role}
                </span>
              </div>
              <ChevronDown className="hidden xl:block h-3.5 w-3.5 text-slate-400" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                      {user.role}
                    </span>
                    <span className="text-[10px] text-slate-400">Demo Account</span>
                  </div>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Sliders className="h-3.5 w-3.5 text-slate-400" />
                  <span>My Profile & Settings</span>
                </Link>

                <Link
                  href="/privacy"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                  <span>Privacy Settings</span>
                </Link>

                <Link
                  href="/personnel/support"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  <span>Help & Welfare Support</span>
                </Link>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out (Switch Persona)</span>
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
