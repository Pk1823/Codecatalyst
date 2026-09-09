"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Eye,
  Loader2,
  X,
  FileSpreadsheet,
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Building2,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useToast } from "@/components/providers";
import { ReportClientService, OperationalReportResponse } from "@/services/report.service";

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
  const [downloading, setDownloading] = useState<{ id: string; format: string } | null>(null);
  const [previewReport, setPreviewReport] = useState<ReportConfig | null>(null);
  const [liveReportData, setLiveReportData] = useState<OperationalReportResponse | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string>("");

  useEffect(() => {
    ReportClientService.getOperationalReport()
      .then((res) => setLiveReportData(res))
      .catch((err) => console.error("Failed to preload report data:", err));
  }, []);

  const handleDownload = async (
    reportId: string,
    format: "csv" | "pdf" | "html" | "json",
    title: string
  ) => {
    setDownloading({ id: reportId, format });
    try {
      await ReportClientService.downloadReport(reportId, format, selectedUnit || undefined);
      toast({
        title: "Download Initiated",
        description: `Exported ${title} in ${format.toUpperCase()} format.`,
        type: "success",
      });
    } catch (err: any) {
      toast({
        title: "Download Failed",
        description: err.message || "Failed to download the report",
        type: "error",
      });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welfare Reports
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="h-3 w-3" />
              DPDP Compliant
            </span>
          </div>
        </div>

        {/* Global Quick Download Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {liveReportData?.data.unitBreakdown && liveReportData.data.unitBreakdown.length > 0 && (
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs shadow-xs">
              <Building2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="bg-transparent text-slate-700 dark:text-slate-300 text-xs focus:outline-hidden"
              >
                <option value="" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                  All Battalions / Units
                </option>
                {liveReportData.data.unitBreakdown.map((u) => (
                  <option key={u.id} value={u.id} className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => handleDownload("rep-05", "csv", "Sector Monthly Executive Briefing")}
            disabled={downloading !== null}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium shadow-xs transition-colors disabled:opacity-50"
          >
            {downloading?.id === "rep-05" && downloading?.format === "csv" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
            ) : (
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
            <span>Export Master CSV</span>
          </button>

          <button
            onClick={() => handleDownload("rep-05", "pdf", "Sector Monthly Executive Briefing")}
            disabled={downloading !== null}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            {downloading?.id === "rep-05" && downloading?.format === "pdf" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Printer className="h-3.5 w-3.5" />
            )}
            <span>Print Official Briefing</span>
          </button>
        </div>
      </div>

      {/* Live System Summary Strip */}
      {liveReportData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 text-xs shadow-xs">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Monitored Units</span>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {liveReportData.data.overview.totalUnits} Battalions
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Active Casework</span>
            <div className="text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {liveReportData.data.overview.casesActive} Active Cases
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Resolution Rate</span>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {liveReportData.data.overview.resolutionRatePercent}% Closed
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Avg Duty Trajectory</span>
            <div className="text-base font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              {liveReportData.data.workloadAverages.avgWeeklyHours}h / week
            </div>
          </div>
        </div>
      )}

      {/* Reports Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS_CATALOG.map((r) => {
          const isCsvDownloading = downloading?.id === r.id && downloading?.format === "csv";
          const isPdfDownloading = downloading?.id === r.id && downloading?.format === "pdf";

          return (
            <div
              key={r.id}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                    {r.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {r.frequency} • {r.pages} Pgs
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {r.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {r.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewReport(r)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {/* CSV Download */}
                  <button
                    onClick={() => handleDownload(r.id, "csv", r.title)}
                    disabled={downloading !== null}
                    title="Download CSV dataset"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium shadow-xs transition-colors disabled:opacity-40"
                  >
                    {isCsvDownloading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <span>CSV</span>
                  </button>

                  {/* PDF / Print Download */}
                  <button
                    onClick={() => handleDownload(r.id, "pdf", r.title)}
                    disabled={downloading !== null}
                    title="Print / Save Official PDF"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
                  >
                    {isPdfDownloading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Printer className="h-3.5 w-3.5" />
                    )}
                    <span>PDF / Print</span>
                  </button>
                </div>
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
            className="w-full max-w-xl rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    Official Document Preview
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    Restricted
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mt-0.5">
                  {previewReport.title}
                </h3>
              </div>
              <button onClick={() => setPreviewReport(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Simulated Document Preview Page */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 text-xs text-slate-700 dark:text-slate-300 space-y-3 font-mono shadow-inner">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2 flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                <span>GOVERNMENT OF INDIA • MINISTRY OF HOME AFFAIRS</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">NON-PUNITIVE MEDICAL</span>
              </div>
              <div className="text-center py-2">
                <p className="font-bold text-sm text-slate-900 dark:text-white font-sans">
                  {previewReport.title.toUpperCase()}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                  CRPF Sector HQ Operations • Welfare & Medical Directorate
                </p>
              </div>
              <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                <p>• Report ID: {previewReport.id.toUpperCase()}</p>
                <p>• Period Covered: Active 30-Day Operational Cycle</p>
                <p>
                  • Monitored Units:{" "}
                  {liveReportData ? `${liveReportData.data.overview.totalUnits} Battalions` : "1,248 Records"}
                </p>
                <p>
                  • Active Interventions:{" "}
                  {liveReportData ? `${liveReportData.data.overview.casesActive} Cases` : "18 Cases"}
                </p>
                <p>
                  • Resolution Rate:{" "}
                  {liveReportData ? `${liveReportData.data.overview.resolutionRatePercent}%` : "81.4%"}
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-sans text-slate-700 dark:text-slate-300 shadow-xs">
                <strong className="text-slate-900 dark:text-white">Statutory Statement:</strong> Prepared in strict accordance with the Digital Personal Data Protection (DPDP) Act 2023. Aggregated risk indices and self-reported wellness data are protected from Annual Confidential Report (ACR) prejudice.
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => setPreviewReport(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium"
              >
                Close
              </button>

              <button
                onClick={() => handleDownload(previewReport.id, "json", previewReport.title)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors shadow-xs"
              >
                <FileText className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                <span>JSON</span>
              </button>

              <button
                onClick={() => handleDownload(previewReport.id, "csv", previewReport.title)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors shadow-xs"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Download CSV</span>
              </button>

              <button
                onClick={() => handleDownload(previewReport.id, "pdf", previewReport.title)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
