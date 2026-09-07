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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Dynamic Overview target depending on active role
  const overviewRoute =
    role === "PERSONNEL"
      ? "/personnel"
      : role === "COMMANDER"
      ? "/commander"
      : role === "ADMIN"
      ? "/admin"
      : "/welfare";

  const navigation = [
    { name: "Overview", href: overviewRoute, icon: LayoutDashboard },
    { name: "Personnel Portal", href: "/personnel", icon: Users },
    { name: "Wellness Assessment", href: "/personnel/wellness", icon: HeartPulse },
    { name: "Risk Analytics", href: "/analytics", icon: LineChart },
    { name: "Welfare Cases", href: "/welfare/cases", icon: FolderHeart },
    { name: "Interventions", href: "/interventions", icon: HandHelping },
    { name: "Recommendations", href: "/recommendations", icon: Sparkles },
    { name: "Commander View", href: "/commander", icon: Activity },
    { name: "Alert Center", href: "/alerts", icon: Bell },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Privacy Center", href: "/privacy", icon: ShieldCheck },
    { name: "Audit Logs", href: "/audit", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Pitch Presentation", href: "/presentation", icon: Presentation, highlight: true },
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
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-blue-300 transition-colors">
                  MissionWell <span className="text-teal-400">AI</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400">
                  Welfare Intelligence
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
        <nav className="p-2 space-y-1" aria-label="Main Navigation">
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
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 relative",
                  isActive
                    ? "bg-blue-600/90 text-white shadow-xs"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white",
                  item.highlight && !isActive && "text-teal-300 hover:text-teal-200 bg-teal-950/30 border border-teal-900/40",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200",
                    item.highlight && !isActive && "text-teal-400"
                  )}
                />
                {!collapsed && (
                  <span className="truncate">{item.name}</span>
                )}
                {item.highlight && !collapsed && (
                  <span className="ml-auto rounded-xs bg-teal-500/20 px-1 py-0.5 text-[9px] font-bold text-teal-300 uppercase">
                    Pitch
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Status & Demo Info */}
      <div className="p-3 border-t border-slate-800/90 bg-slate-950/40">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-medium text-slate-300">All systems operational</span>
            </div>
            <div className="rounded-md bg-slate-800/60 p-2 text-[10px] text-slate-400 leading-tight">
              <span className="font-semibold text-slate-300 block">Synthetic Demo Environment</span>
              <span className="text-[9px] text-slate-400">CRPF/MHA Welfare Protocol 26186</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="System Status: Operational">
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
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:block shrink-0 transition-all duration-300 sticky top-0 h-screen z-30",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onMobileClose}
        >
          <div
            className="fixed inset-y-0 left-0 w-[280px] z-50 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
