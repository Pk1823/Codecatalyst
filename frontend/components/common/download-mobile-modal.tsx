"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Smartphone,
  Download,
  QrCode,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";

export const APK_DOWNLOAD_URL =
  "https://expo.dev/accounts/vikasgangwars-team/projects/vikas/builds/b2fea7a1-0e68-42aa-9621-ac60ebdfce88";

interface DownloadMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadMobileModal({ isOpen, onClose }: DownloadMobileModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(APK_DOWNLOAD_URL);
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
                Download MissionWell Android App
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                APK LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct install for CAPF Jawans, Welfare Officers & Tactical Commanders
            </p>
          </div>
        </div>

        {/* Defense Grade Callout */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-400 text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Standalone Defense Build (Render Live Connected)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            No Expo Go app required. This APK is compiled specifically for field deployment and connects directly to the live secure Render cloud backend.
          </p>
        </div>

        {/* QR Code & Download Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-xl bg-white shadow-md">
              <QRCodeSVG
                value={APK_DOWNLOAD_URL}
                size={140}
                level="H"
                fgColor="#0F172A"
                bgColor="#FFFFFF"
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 text-center">
              Scan with phone camera to download APK directly
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Instant Android Installation</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Confidential DPDP Self-Check</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Offline Forward Post Sync</span>
              </div>
            </div>

            <a
              href={APK_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download APK File ↓</span>
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
                  <span>Copy APK Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Alternative Web App Preview */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs text-slate-400">
          <span>Prefer testing in browser?</span>
          <a
            href="http://localhost:8081"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
          >
            <span>Open Web App Preview</span>
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
        title="Download Android APK"
      >
        <Smartphone className="h-4 w-4" />
        <span>Download App</span>
        <span className="hidden sm:inline px-1.5 py-0.2 rounded bg-emerald-500 text-white font-mono text-[9px] font-bold">
          APK
        </span>
      </button>

      <DownloadMobileModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
