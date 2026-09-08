"use client";

import React, { useState } from "react";
import {
  Download,
  Eye,
  Loader2,
  X,
} from "lucide-react";
import { useToast } from "@/components/providers";

interface ReportConfig {
  id: string;
  title: string;
  category: string;
  description: string;
  frequency: string;
  pages: number;
}

const REPORTS_CATALOG: ReportConfig[] = [
  {
    id: "rep-01",
    title: "Unit Welfare & Morale Assessment",
    category: "Operational",
    description: "Battalion-by-battalion analysis of duty hours, rest intervals, and voluntary self-reporting.",
    frequency: "Weekly",
    pages: 12,
  },
  {
    id: "rep-02",
    title: "Risk Trend & Fatigue Trajectory",
    category: "Predictive",
    description: "Time-series evaluation of cumulative fatigue, sleep deficits, and forward deployment stress.",
    frequency: "Monthly",
    pages: 18,
  },
  {
    id: "rep-03",
    title: "Force Workload & Duty Roster Audit",
    category: "Workload",
    description: "Operational shift equity, night patrol duration, and perimeter stand-to distribution.",
    frequency: "Bi-Weekly",
    pages: 8,
  },
  {
    id: "rep-04",
    title: "Welfare Intervention & Case Outcomes",
    category: "Rehabilitation",
    description: "Summary of duty reassignments, rest stand-downs, and psychological counseling impact.",
    frequency: "Monthly",
    pages: 14,
  },
  {
    id: "rep-05",
    title: "Sector Monthly Welfare Summary",
    category: "Executive",
    description: "Comprehensive executive briefing prepared for Sector HQ Commandant and Welfare Directorate.",
    frequency: "Monthly",
    pages: 24,
  },
];

export default function ReportsPage() {
  const { toast } = useToast();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [previewReport, setPreviewReport] = useState<ReportConfig | null>(null);

  const handleGenerate = (report: ReportConfig) => {
    setGeneratingId(report.id);
    setTimeout(() => {
      setGeneratingId(null);
      toast({
        title: "Report Generated",
        description: `Exported ${report.title} (PDF, ${report.pages} pages).`,
        type: "success",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Welfare Intelligence Reports
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Automated executive summaries, duty audit manifests, and predictive trend publications.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS_CATALOG.map((r) => {
          const isGenerating = generatingId === r.id;
          return (
            <div
              key={r.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                    {r.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {r.frequency} • {r.pages} Pgs
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white">
                  {r.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {r.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewReport(r)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleGenerate(r)}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-40"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      <span>Generate PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setPreviewReport(null)}
        >
          <div
            className="w-full max-w-xl rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-emerald-400">
                  Document Preview
                </span>
                <h3 className="text-base font-semibold text-white">
                  {previewReport.title}
                </h3>
              </div>
              <button onClick={() => setPreviewReport(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Simulated Document Preview Page */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-5 text-xs text-slate-300 space-y-3 font-mono">
              <div className="border-b border-slate-800 pb-2 flex justify-between text-[10px] text-slate-400 font-medium">
                <span>GOVERNMENT OF INDIA • MINISTRY OF HOME AFFAIRS</span>
                <span className="text-emerald-400">RESTRICTED</span>
              </div>
              <div className="text-center py-2">
                <p className="font-bold text-sm text-white font-sans">
                  {previewReport.title.toUpperCase()}
                </p>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  CRPF Sector HQ Operations • Welfare Directorate
                </p>
              </div>
              <div className="space-y-1 text-[11px] text-slate-400">
                <p>• Period Covered: 01 Feb 2025 to 28 Feb 2025</p>
                <p>• Total Uniformed Personnel Analyzed: 1,248 Records</p>
                <p>• Active Interventions Deployed: 18 Cases</p>
                <p>• Average Force Welfare Readiness Score: 81.4 / 100</p>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 text-[11px] font-sans text-slate-300">
                <strong className="text-white">Executive Summary:</strong> Operational deployments in Units Alpha and Echo require rotation. Leave clearance rate is 32% below peacetime standard. Zero disciplinary flags applied.
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setPreviewReport(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleGenerate(previewReport);
                  setPreviewReport(null);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
