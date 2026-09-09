"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";

interface RouteThemeConfig {
  image: string;
  alt: string;
  lightOpacity: string;
  darkOpacity: string;
  primaryGlow: string;
  secondaryGlow: string;
}

export function RouteBackground() {
  const pathname = usePathname() || "";

  const config: RouteThemeConfig = useMemo(() => {
    // 1. Tactical Command & Operational Overview
    if (pathname.startsWith("/commander")) {
      return {
        image: "/tactical-command-bg.jpg",
        alt: "Tactical Operations Command Deck & Himalayan Sector Grid",
        lightOpacity: "opacity-[0.11]",
        darkOpacity: "opacity-[0.28]",
        primaryGlow: "bg-blue-500/15 dark:bg-blue-500/20",
        secondaryGlow: "bg-cyan-500/10 dark:bg-cyan-500/15",
      };
    }

    // 2. Executive Readiness Reports & Dossiers
    if (pathname.startsWith("/reports")) {
      return {
        image: "/hero-bg.jpg",
        alt: "Himalayan Defense Outpost & Biometric Telemetry",
        lightOpacity: "opacity-[0.09]",
        darkOpacity: "opacity-[0.25]",
        primaryGlow: "bg-blue-500/15 dark:bg-blue-600/15",
        secondaryGlow: "bg-blue-500/10 dark:bg-blue-600/15",
      };
    }

    // 3. Predictive Analytics, Machine Learning & Telemetry Drill-Down
    if (pathname.startsWith("/analytics")) {
      return {
        image: "/tactical-mesh-bg.jpg",
        alt: "Tactical Contour Topography, Radar Blips & Neural Telemetry Grid",
        lightOpacity: "opacity-[0.12]",
        darkOpacity: "opacity-[0.32]",
        primaryGlow: "bg-cyan-500/15 dark:bg-cyan-500/20",
        secondaryGlow: "bg-blue-500/10 dark:bg-teal-500/15",
      };
    }

    // 4. Real-Time Alerts & AI Decision Support Recommendations
    if (pathname.startsWith("/alerts") || pathname.startsWith("/recommendations")) {
      return {
        image: "/tactical-aurora-bg.jpg",
        alt: "Command Terrace Overlooking Wireframe Terrain & Aurora Borealis",
        lightOpacity: "opacity-[0.10]",
        darkOpacity: "opacity-[0.30]",
        primaryGlow: "bg-amber-500/15 dark:bg-amber-500/18",
        secondaryGlow: "bg-blue-500/12 dark:bg-blue-500/18",
      };
    }

    // 5. Personnel Wellbeing Hub, 7-Step Check & Peer Support
    if (
      pathname.startsWith("/personnel/wellness") ||
      pathname.startsWith("/personnel/support")
    ) {
      return {
        image: "/wellness-care-bg.jpg",
        alt: "Himalayan Resilience Sanctuary - Wellness, Support & Health Telemetry",
        lightOpacity: "opacity-[0.13]",
        darkOpacity: "opacity-[0.30]",
        primaryGlow: "bg-blue-500/15 dark:bg-blue-500/20",
        secondaryGlow: "bg-teal-500/12 dark:bg-cyan-500/15",
      };
    }

    // 6. Personnel Directory / Roster
    if (pathname.startsWith("/personnel")) {
      return {
        image: "/tactical-mesh-bg.jpg",
        alt: "Tactical Personnel Grid & Squad Telemetry Backdrop",
        lightOpacity: "opacity-[0.10]",
        darkOpacity: "opacity-[0.26]",
        primaryGlow: "bg-blue-500/12 dark:bg-blue-500/18",
        secondaryGlow: "bg-blue-500/10 dark:bg-blue-500/15",
      };
    }

    // 7. Welfare Officer Command, Active Cases & Interventions
    if (
      pathname.startsWith("/welfare") ||
      pathname.startsWith("/interventions")
    ) {
      return {
        image: "/wellness-care-bg.jpg",
        alt: "Proactive Defense Welfare Operations & Health Care Network",
        lightOpacity: "opacity-[0.12]",
        darkOpacity: "opacity-[0.28]",
        primaryGlow: "bg-blue-500/15 dark:bg-blue-500/20",
        secondaryGlow: "bg-cyan-500/10 dark:bg-cyan-500/15",
      };
    }

    // 8. Zero-Knowledge Privacy Vault, Security Audit Ledger, Admin & Settings
    if (
      pathname.startsWith("/privacy") ||
      pathname.startsWith("/personnel/privacy") ||
      pathname.startsWith("/audit") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/settings")
    ) {
      return {
        image: "/login-bg.jpg",
        alt: "High-Altitude Defense Security Watchtower & Holographic Shield",
        lightOpacity: "opacity-[0.10]",
        darkOpacity: "opacity-[0.28]",
        primaryGlow: "bg-blue-500/12 dark:bg-blue-500/18",
        secondaryGlow: "bg-indigo-500/10 dark:bg-indigo-500/15",
      };
    }

    // Fallback: Digital Defense Mesh
    return {
      image: "/tactical-mesh-bg.jpg",
      alt: "Digital Defense Topography Ambient Backdrop",
      lightOpacity: "opacity-[0.09]",
      darkOpacity: "opacity-[0.25]",
      primaryGlow: "bg-blue-500/10 dark:bg-blue-500/15",
      secondaryGlow: "bg-cyan-500/10 dark:bg-cyan-500/15",
    };
  }, [pathname]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Dynamic Route Thematic Background Image */}
      <img
        key={config.image}
        src={config.image}
        alt={config.alt}
        className={`w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${config.lightOpacity} dark:${config.darkOpacity}`}
      />

      {/* Ambient Vignettes for Seamless Depth & Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-slate-50/70 to-slate-50/95 dark:from-[#090D16]/92 dark:via-[#090D16]/75 dark:to-[#090D16]/96 transition-colors duration-300" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_10%,_rgba(248,250,252,0.6)_80%)] dark:bg-[radial-gradient(ellipse_at_top,_transparent_10%,_rgba(9,13,22,0.75)_80%)]" />

      {/* Subtle Tactical Coordinate Grid Overlay */}
      <div className="absolute inset-0 bg-tactical-grid opacity-75 dark:opacity-50" />

      {/* Dynamic Luminous Ambient Glow Orbs */}
      <div
        className={`absolute top-12 left-1/4 -translate-x-1/2 w-[550px] h-[300px] ${config.primaryGlow} blur-[140px] pointer-events-none rounded-full animate-pulse-ring`}
      />
      <div
        className={`absolute bottom-20 right-1/4 w-[450px] h-[260px] ${config.secondaryGlow} blur-[130px] pointer-events-none rounded-full`}
      />
    </div>
  );
}
