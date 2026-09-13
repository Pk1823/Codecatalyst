"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Smartphone,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Globe,
} from "lucide-react";
import {
  FIREBASE_APP_URL,
  PERSONNEL_ASSESSMENT_URL,
  APK_DOWNLOAD_URL,
} from "@/lib/download-constants";
export { APK_DOWNLOAD_URL, FIREBASE_APP_URL, PERSONNEL_ASSESSMENT_URL };

interface DownloadMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadMobileModal({ isOpen, onClose }: DownloadMobileModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(PERSONNEL_ASSESSMENT_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0B132B] p-6 sm:p-7 shadow-2xl text-slate-100 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                MissionWell Soldier App
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                FIREBASE LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct access for CAPF Jawans & Personnel (Zero installation needed)
            </p>
          </div>
        </div>

        {/* Defense Grade Callout */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-400 text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Cloud Edge Deployment (Firebase PWA)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Personnel can directly complete confidential self-assessments, buddy-pair check-ins, and welfare logs in any phone or desktop browser. No APK or app store download required.
          </p>
        </div>

        {/* QR Code & Direct Launch Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-xl bg-white shadow-md">
              <QRCodeSVG
                value={PERSONNEL_ASSESSMENT_URL}
                size={140}
                level="H"
                fgColor="#0F172A"
                bgColor="#FFFFFF"
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 text-center">
              Scan with phone camera to open assessment directly
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Instant Browser Launch (No APK)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Confidential DPDP Assessment</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Real-time Secure Cloud Sync</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={PERSONNEL_ASSESSMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open Soldier Assessment (Live) ↗</span>
              </a>

              <a
                href={FIREBASE_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Open Mobile App Home ↗</span>
              </a>

              <button
                onClick={handleCopy}
                className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-mono transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-slate-400" />
                    <span>Copy Assessment Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Direct URL Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs text-slate-400">
          <span className="font-mono text-[11px] truncate text-slate-400">
            missionwell-ai-capf.web.app/personnel
          </span>
          <a
            href={PERSONNEL_ASSESSMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium shrink-0 ml-2"
          >
            <span>Launch Web App</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function DownloadMobileButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all shadow-xs ${className}`}
        title="Open Soldier Assessment (Live on Firebase)"
      >
        <Smartphone className="h-4 w-4" />
        <span>Soldier App</span>
        <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-500 text-white font-mono text-[9px] font-bold">
          LIVE
        </span>
      </button>

      <DownloadMobileModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
