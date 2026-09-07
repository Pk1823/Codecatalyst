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
  Presentation,
  PhoneCall,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { role, force, lang } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const isHi = lang === "hi";

  const overviewRoute =
    role === "PERSONNEL"
      ? "/personnel"
      : role === "COMMANDER"
      ? "/commander"
      : role === "ADMIN"
      ? "/admin"
      : "/welfare";

  const navigation = [
    { name: isHi ? "अवलोकन" : "Overview", sub: isHi ? "डैशबोर्ड" : "Overview", href: overviewRoute, icon: LayoutDashboard },
    { name: isHi ? "जवान कल्याण पोर्टल" : "Personnel Portal", sub: isHi ? "स्व-सेवा" : "Self-Care", href: "/personnel", icon: Users },
    { name: isHi ? "कल्याण स्व-मूल्यांकन" : "Wellness Assessment", sub: isHi ? "7-चरण जांच" : "7-Step Check", href: "/personnel/wellness", icon: HeartPulse },
    { name: isHi ? "पूर्वानुमानित जोखिम" : "Risk Analytics", sub: isHi ? "एआई विश्लेषण" : "Predictive AI", href: "/analytics", icon: LineChart },
    { name: isHi ? "कल्याण मामले" : "Welfare Cases", sub: isHi ? "अधिकारी समीक्षा" : "Case Records", href: "/welfare/cases", icon: FolderHeart },
    { name: isHi ? "कल्याणकारी हस्तक्षेप" : "Interventions", sub: isHi ? "रोटेशन व आराम" : "Duty Rotation", href: "/interventions", icon: HandHelping },
    { name: isHi ? "एआई सिफ़ारिशें" : "Recommendations", sub: isHi ? "निर्णय समर्थन" : "Decision Aid", href: "/recommendations", icon: Sparkles },
    { name: isHi ? "कमांडर अवलोकन" : "Commander View", sub: isHi ? "बल समग्र डेटा" : "Force Readiness", href: "/commander", icon: Activity },
    { name: isHi ? "चेतावनी केंद्र" : "Alert Center", sub: isHi ? "प्राथमिकता अलर्ट" : "Live Triage", href: "/alerts", icon: Bell },
    { name: isHi ? "खुफिया रिपोर्ट" : "Reports", sub: isHi ? "पीडीएफ निर्यात" : "Executive Brief", href: "/reports", icon: FileText },
    { name: isHi ? "गोपनीयता केंद्र" : "Privacy Center", sub: isHi ? "डीपीडीपी अनुपालन" : "DPDP Act 2023", href: "/privacy", icon: ShieldCheck },
    { name: isHi ? "ऑडिट एवं रिकॉर्ड" : "Audit Logs", sub: isHi ? "शून्य-विश्वास" : "Access Trail", href: "/audit", icon: History },
    { name: isHi ? "प्रणाली सेटिंग्स" : "Settings", sub: isHi ? "प्राथमिकताएं" : "Preferences", href: "/settings", icon: Settings },
    { name: isHi ? "हैकथॉन प्रस्तुति" : "Pitch Presentation", sub: isHi ? "न्यायाधीश डेक" : "Judge Deck", href: "/presentation", icon: Presentation, highlight: true },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300">
      {/* Brand Header */}
      <div>
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
          <Link
            href="/"
            onClick={onMobileClose}
            className="flex items-center gap-3 overflow-hidden group focus:outline-hidden"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-blue-700 to-teal-500 shadow-md border border-amber-500/30">
              <Shield className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    MissionWell <span className="text-teal-400">AI</span>
                  </span>
                  <span className="rounded-xs bg-amber-500/20 px-1 py-0.2 text-[8px] font-mono font-bold text-amber-300 border border-amber-500/30">
                    {force}
                  </span>
                </div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">
                  {isHi ? "सशस्त्र बल कल्याण खुफिया" : "Welfare Intelligence"}
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-2 space-y-0.5" aria-label="Main Navigation">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href) && item.href !== overviewRoute);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onMobileClose}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150 relative",
                  isActive
                    ? "bg-blue-700 text-white shadow-sm border border-blue-600/50"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white",
                  item.highlight && !isActive && "text-amber-300 hover:text-amber-200 bg-amber-950/30 border border-amber-900/40",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200",
                    item.highlight && !isActive && "text-amber-400"
                  )}
                />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <span className="truncate block font-semibold leading-tight">{item.name}</span>
                    <span className="text-[9px] text-slate-400 group-hover:text-slate-300 block truncate leading-none mt-0.5">
                      {item.sub}
                    </span>
                  </div>
                )}
                {item.highlight && !collapsed && (
                  <span className="rounded-xs bg-amber-500/20 px-1 py-0.5 text-[8px] font-black text-amber-300 uppercase">
                    Pitch
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Force Welfare Helpline & Operational Status */}
      <div className="p-3 border-t border-slate-800/90 bg-slate-950/60 space-y-2">
        {!collapsed ? (
          <>
            {/* National Tele-MANAS / Armed Forces 24x7 Helpline */}
            <div className="rounded-lg bg-blue-950/50 border border-blue-900/60 p-2 text-[10px] text-blue-200 flex items-center gap-2">
              <PhoneCall className="h-3.5 w-3.5 text-teal-400 shrink-0" />
              <div>
                <span className="font-bold block text-white">24x7 Force Helpline</span>
                <span className="text-teal-300 font-mono">14416 / 1800-599-0019</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>All telemetry live</span>
              </div>
              <span className="font-mono text-[9px] text-slate-500">MHA PS 26186</span>
            </div>
          </>
        ) : (
          <div className="flex justify-center" title="System Operational • 24x7 Helpline 14416">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
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
          collapsed ? "w-[68px]" : "w-[270px]"
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
            className="fixed inset-y-0 left-0 w-[290px] z-50 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
