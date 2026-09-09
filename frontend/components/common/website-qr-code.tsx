"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Copy, Check, ExternalLink, QrCode, Shield } from "lucide-react";

interface WebsiteQRCodeProps {
  variant?: "footer" | "card" | "inline";
  className?: string;
}

export function WebsiteQRCode({ variant = "footer", className = "" }: WebsiteQRCodeProps) {
  const [currentUrl, setCurrentUrl] = useState<string>("https://missionwell.ai");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Resolve current live window URL or origin
      const originUrl = window.location.origin || window.location.href;
      setCurrentUrl(originUrl);
    }
  }, []);

  const handleCopyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs ${className}`}>
        <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-200/80 shrink-0">
          <QRCodeSVG value={currentUrl} size={64} level="M" includeMargin={false} />
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
            <Smartphone className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Scan Mobile App</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[180px]">
            {currentUrl}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 backdrop-blur-md shadow-md hover:shadow-lg transition-all ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        
        {/* Left: QR Code Canvas with High Contrast Frame */}
        <div className="relative group shrink-0">
          <div className="p-3 rounded-xl bg-white shadow-sm border border-slate-200/90 text-slate-900 flex items-center justify-center">
            <QRCodeSVG
              value={currentUrl}
              size={110}
              level="H"
              includeMargin={false}
              fgColor="#0F172A"
              bgColor="#FFFFFF"
            />
          </div>
          <div className="absolute -top-2 -right-2 p-1 rounded-full bg-blue-600 text-white shadow-xs">
            <QrCode className="h-3 w-3" />
          </div>
        </div>

        {/* Right: Informative Details & Quick Actions */}
        <div className="space-y-2.5 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/80">
              <Smartphone className="h-3 w-3" />
              Scan for Mobile Portal
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <Shield className="h-3 w-3 text-blue-500" />
              Instant Access
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Mobile Assessment & Buddy Check-in
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Scan QR code on your mobile camera to launch 7-step confidential check-in.
            </p>
          </div>

          {/* URL & Copy Actions Bar */}
          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
            <code className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] border border-slate-200 dark:border-slate-700 truncate max-w-[200px] sm:max-w-[260px]">
              {currentUrl}
            </code>

            <button
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-mono font-semibold transition-colors shadow-xs"
              title="Copy URL"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Open Link"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
