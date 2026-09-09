"use client";

import React from "react";

export function RouteBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Home Page Tactical Backdrop Image with Blurred Effect */}
      <img
        src="/hero-bg.jpg"
        alt="Himalayan Defense Command & Biometric Telemetry Operational Backdrop"
        className="w-full h-full object-cover object-center blur-[3px] scale-105 opacity-35 dark:opacity-75 transition-opacity duration-700 ease-in-out select-none"
      />

      {/* Soft Translucent Vignette Overlays with Glass Backdrop Blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-slate-50/55 to-slate-50/85 dark:from-[#090D16]/80 dark:via-[#090D16]/55 dark:to-[#090D16]/85 backdrop-blur-xs transition-colors duration-300" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_10%,_rgba(248,250,252,0.6)_80%)] dark:bg-[radial-gradient(ellipse_at_top,_transparent_10%,_rgba(9,13,22,0.75)_80%)]" />

      {/* Subtle Tactical Coordinate Grid Overlay */}
      <div className="absolute inset-0 bg-tactical-grid opacity-50 dark:opacity-40" />

      {/* Dynamic Luminous Ambient Glow Orbs */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[550px] h-[300px] bg-blue-500/15 dark:bg-blue-600/18 blur-[140px] pointer-events-none rounded-full animate-pulse-ring" />
      <div className="absolute bottom-20 right-1/4 w-[450px] h-[260px] bg-cyan-500/10 dark:bg-cyan-500/15 blur-[130px] pointer-events-none rounded-full" />
    </div>
  );
}
