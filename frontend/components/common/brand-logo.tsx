"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BrandIconProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
  showBadge?: boolean;
}

const sizeMap = {
  xs: "w-5 h-5",
  sm: "w-8 h-8",
  md: "w-10 h-10 sm:w-11 sm:h-11",
  lg: "w-12 h-12 sm:w-14 sm:h-14",
  xl: "w-16 h-16 sm:w-20 sm:h-20",
};

/**
 * Official MissionWell AI Cyber Sentinel Brand Emblem
 * Unified across both Web Portal and Mobile Application.
 */
export function BrandIcon({
  size = "md",
  className = "",
  animate = false,
  showBadge = false,
}: BrandIconProps) {
  const sizeClass = sizeMap[size];

  return (
    <div className={cn("relative inline-flex items-center justify-center shrink-0", className)}>
      {animate && (
        <span className="absolute -inset-1 rounded-2xl bg-blue-500/20 blur-sm animate-pulse dark:bg-blue-400/20" />
      )}
      <svg
        className={cn(sizeClass, "relative drop-shadow-md transition-transform group-hover:scale-105")}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="mwBgGrad" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="70%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#060913" />
          </radialGradient>

          <linearGradient id="mwShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <linearGradient id="mwTricolor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#138808" />
          </linearGradient>

          <linearGradient id="mwBlade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          <linearGradient id="mwPulse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          <filter id="mwGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Cyber Shield Armor */}
        <path
          d="M60 6 L104 28 L104 78 L60 114 L16 78 L16 28 Z"
          fill="url(#mwBgGrad)"
          stroke="url(#mwShieldGrad)"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {/* Indian Tricolor Crest Notch at Top */}
        <path
          d="M48 10 L72 10"
          stroke="url(#mwTricolor)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Tactical Sub-grid */}
        <path
          d="M26 34 L94 34 M26 86 L94 86"
          stroke="#334155"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.35"
        />

        {/* Server Blade 1: Web / Edge Tier */}
        <rect
          x="30"
          y="31"
          width="60"
          height="13"
          rx="3.5"
          fill="url(#mwBlade)"
          stroke="#475569"
          strokeWidth="1"
        />
        <circle cx="37" cy="37.5" r="2" fill="#10B981" filter="url(#mwGlow)" />
        <circle cx="44" cy="37.5" r="1.5" fill="#38BDF8" />
        <line
          x1="52"
          y1="37.5"
          x2="84"
          y2="37.5"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 4"
        />

        {/* Server Blade 2: Core Express REST Mesh */}
        <rect
          x="30"
          y="47"
          width="60"
          height="13"
          rx="3.5"
          fill="url(#mwBlade)"
          stroke="#475569"
          strokeWidth="1"
        />
        <circle cx="37" cy="53.5" r="2" fill="#10B981" filter="url(#mwGlow)" />
        <circle cx="44" cy="53.5" r="1.5" fill="#F59E0B" />
        <line
          x1="52"
          y1="53.5"
          x2="84"
          y2="53.5"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 4"
        />

        {/* Server Blade 3: FastAPI LightGBM AI Engine */}
        <rect
          x="30"
          y="63"
          width="60"
          height="13"
          rx="3.5"
          fill="url(#mwBlade)"
          stroke="#475569"
          strokeWidth="1"
        />
        <circle cx="37" cy="69.5" r="2" fill="#10B981" filter="url(#mwGlow)" />
        <circle cx="44" cy="69.5" r="1.5" fill="#A855F7" />
        <line
          x1="52"
          y1="69.5"
          x2="84"
          y2="69.5"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 4"
        />

        {/* Resilience Neural Waveform Pulse */}
        <path
          d="M22 84 L38 84 L46 72 L52 96 L60 76 L66 88 L72 82 L78 84 L98 84"
          fill="none"
          stroke="url(#mwPulse)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#mwGlow)"
        />

        {/* Tactical Defense Node Core */}
        <circle cx="60" cy="100" r="3.5" fill="#10B981" filter="url(#mwGlow)" />
        <circle cx="60" cy="100" r="1.5" fill="#FFFFFF" />
      </svg>

      {showBadge && (
        <span className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500 border border-white dark:border-slate-900" />
        </span>
      )}
    </div>
  );
}

export default BrandIcon;
