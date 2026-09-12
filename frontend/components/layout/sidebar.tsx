"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  HeartPulse,
  LineChart,
  FolderHeart,
  HandHelping,
  Sparkles,
  Bell,
  FileText,
  ShieldCheck,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  PhoneCall,
  Presentation,
  Smartphone,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers";
import { BrandIcon } from "@/components/common/brand-logo";
import { DownloadMobileModal } from "@/components/common/download-mobile-modal";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { role, force, lang } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const isHi = lang === "hi";

  const getNavigationForRole = () => {
    if (role === "PERSONNEL") {
      return [
        { name: isHi ? "जवान कल्याण पोर्टल" : "My Wellbeing", sub: isHi ? "व्यक्तिगत डैशबोर्ड" : "Personal Hub", href: "/personnel", icon: LayoutDashboard },
        { name: isHi ? "मोबाइल ऐप मूल्यांकन" : "Mobile App Check", sub: isHi ? "मोबाइल ऐप क्यूआर" : "App QR Access", href: "/personnel/wellness", icon: Smartphone },
        { name: isHi ? "कल्याण सहायता मांगें" : "Request Support", sub: isHi ? "गोपनीय अनुरोध" : "Confidential Intake", href: "/personnel/support", icon: HandHelping },
        { name: isHi ? "गोपनीयता नियंत्रण" : "My Privacy", sub: isHi ? "डीपीडीपी सहमति" : "Consent & DPDP", href: "/personnel/privacy", icon: ShieldCheck },
      ];
    }

    if (role === "COMMANDER") {
      return [
        { name: isHi ? "कमांडर अवलोकन" : "Unit Readiness", sub: isHi ? "बल समग्र डेटा" : "Squad Telemetry", href: "/commander", icon: Activity },
        { name: isHi ? "खुफिया रिपोर्ट" : "Force Reports", sub: isHi ? "पीडीएफ निर्यात" : "Executive Brief", href: "/reports", icon: FileText },
        { name: isHi ? "गोपनीयता नीति" : "Privacy Guard", sub: isHi ? "डीपीडीपी अनुपालन" : "DPDP Act 2023", href: "/privacy", icon: ShieldCheck },
        { name: isHi ? "ऑडिट एवं रिकॉर्ड" : "Audit Trail", sub: isHi ? "शून्य-विश्वास" : "Access Ledger", href: "/audit", icon: History },
        { name: isHi ? "प्रणाली सेटिंग्स" : "Settings", sub: isHi ? "प्राथमिकताएं" : "Preferences", href: "/settings", icon: Settings },
      ];
    }

    if (role === "ADMIN") {
      return [
        { name: isHi ? "प्रशासन कंसोल" : "Admin Console", sub: isHi ? "सिस्टम स्थिति" : "System Health", href: "/admin", icon: LayoutDashboard },
        { name: isHi ? "ऑडिट एवं रिकॉर्ड" : "Audit Ledger", sub: isHi ? "शून्य-विश्वास" : "Access Logs", href: "/audit", icon: History },
        { name: isHi ? "गोपनीयता केंद्र" : "Privacy Center", sub: isHi ? "डीपीडीपी अनुपालन" : "DPDP Act 2023", href: "/privacy", icon: ShieldCheck },
        { name: isHi ? "खुफिया रिपोर्ट" : "System Reports", sub: isHi ? "पीडीएफ निर्यात" : "Executive Brief", href: "/reports", icon: FileText },
        { name: isHi ? "प्रणाली सेटिंग्स" : "Settings", sub: isHi ? "प्राथमिकताएं" : "Preferences", href: "/settings", icon: Settings },
      ];
    }

    // Default: WELFARE_OFFICER (Full clinical welfare intelligence)
    return [
      { name: isHi ? "कल्याण खुफिया" : "Welfare Intelligence", sub: isHi ? "डैशबोर्ड" : "Overview Hub", href: "/welfare", icon: LayoutDashboard },
      { name: isHi ? "पूर्वानुमानित जोखिम" : "Risk Analytics", sub: isHi ? "एआई विश्लेषण" : "Predictive AI", href: "/analytics", icon: LineChart },
      { name: isHi ? "कल्याण मामले" : "Welfare Cases", sub: isHi ? "अधिकारी समीक्षा" : "Case Dossiers", href: "/welfare/cases", icon: FolderHeart },
      { name: isHi ? "कल्याणकारी हस्तक्षेप" : "Interventions", sub: isHi ? "रोटेशन व आराम" : "Duty Rotation", href: "/interventions", icon: HandHelping },
      { name: isHi ? "एआई सिफ़ारिशें" : "Recommendations", sub: isHi ? "निर्णय समर्थन" : "Decision Aid", href: "/recommendations", icon: Sparkles },
      { name: isHi ? "चेतावनी केंद्र" : "Alert Center", sub: isHi ? "प्राथमिकता अलर्ट" : "Live Triage", href: "/alerts", icon: Bell },
      { name: isHi ? "खुफिया रिपोर्ट" : "Reports", sub: isHi ? "पीडीएफ निर्यात" : "Executive Brief", href: "/reports", icon: FileText },
      { name: isHi ? "गोपनीयता केंद्र" : "Privacy Center", sub: isHi ? "डीपीडीपी अनुपालन" : "DPDP Act 2023", href: "/privacy", icon: ShieldCheck },
      { name: isHi ? "ऑडिट एवं रिकॉर्ड" : "Audit Logs", sub: isHi ? "शून्य-विश्वास" : "Access Trail", href: "/audit", icon: History },
      { name: isHi ? "प्रणाली सेटिंग्स" : "Settings", sub: isHi ? "प्राथमिकताएं" : "Preferences", href: "/settings", icon: Settings },
    ];
  };

  const navigation = getNavigationForRole();

  const getRoleLabel = () => {
    switch (role) {
      case "PERSONNEL":
        return { label: "Jawan / Soldier", color: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" };
      case "COMMANDER":
        return { label: "Tactical Commander", color: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" };
      case "ADMIN":
        return { label: "System Administrator", color: "text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20" };
      default:
        return { label: "Welfare Officer", color: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" };
    }
  };

  const roleInfo = getRoleLabel();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto bg-white/90 dark:bg-[#090D16]/90 backdrop-blur-xl text-slate-800 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300">
      {/* Brand Header */}
      <div>
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800/80">
          <Link
            href="/"
            onClick={onMobileClose}
            className="flex items-center gap-3 overflow-hidden group focus:outline-hidden"
          >
            <BrandIcon size="sm" animate={true} />
            {!collapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-[#F8FAFC]">
                    MissionWell <span className="text-blue-600 dark:text-blue-400 font-mono text-xs">AI</span>
                  </span>
                  <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {force}
                  </span>
                </div>
                <span className="text-[9px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                  {isHi ? "सशस्त्र बल कल्याण खुफिया" : "Welfare Intelligence"}
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Active Persona Badge */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className={cn("px-2.5 py-1.5 rounded-lg border text-[11px] font-mono flex items-center justify-between", roleInfo.color)}>
              <span className="truncate font-semibold uppercase">{roleInfo.label}</span>
              <span className="text-[9px] opacity-75 font-mono">PORTAL</span>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="p-2 space-y-0.5" aria-label="Main Navigation">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href) && item.href.length > 2);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onMobileClose}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 relative",
                  isActive
                    ? "bg-blue-50 text-blue-800 font-semibold border-l-2 border-blue-600 shadow-xs dark:bg-slate-800/90 dark:text-white dark:border-blue-500"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white",
                  collapsed && "justify-center px-2 border-l-0"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                  )}
                />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <span className="truncate block leading-tight">{item.name}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Force Welfare Helpline & Telemetry Status */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#090D16] space-y-2">
        {!collapsed ? (
          <>
            <button
              onClick={() => setDownloadModalOpen(true)}
              className="w-full rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 p-2 text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center justify-between hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-bold">Download Mobile App</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white font-mono text-[9px] font-bold">
                APK
              </span>
            </button>

            <div className="rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-2.5 text-[10px] text-slate-700 dark:text-slate-300 flex items-center gap-2.5 shadow-xs">
              <PhoneCall className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <span className="font-semibold block text-slate-800 dark:text-slate-200">24x7 Force Helpline</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono text-[11px] font-medium">14416 / 1800-599-0019</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-slate-400 font-mono text-[10px]">AI Engine Active</span>
              </div>
              <span className="font-mono text-[9px] text-blue-400">78.4% Acc</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setDownloadModalOpen(true)}
              className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
              title="Download Mobile App (APK)"
            >
              <Smartphone className="h-4 w-4" />
            </button>
            <div className="flex justify-center" title="AI Engine Active (78.4% Acc) • 24x7 Helpline 14416">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden md:block shrink-0 transition-all duration-300 sticky top-0 h-screen z-30",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs md:hidden"
          onClick={onMobileClose}
        >
          <div
            className="fixed inset-y-0 left-0 w-[280px] z-50 bg-[#090D16] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      <DownloadMobileModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </>
  );
}
