export interface OperationalReportOverview {
  totalUnits: number;
  totalPredictions: number;
  casesTotal: number;
  casesActive: number;
  casesClosed: number;
  resolutionRatePercent: number;
  earlyWarningsTotal: number;
  earlyWarningsActive: number;
  supportActionsDelivered: number;
}

export interface OperationalReportResponse {
  metadata: {
    dataset: string;
    department: string;
    generatedAt: string;
    requestingRole?: string;
  };
  data: {
    overview: OperationalReportOverview;
    riskDistribution: {
      low: number;
      moderate: number;
      high: number;
      total: number;
    };
    earlyWarningBreakdown: {
      new: number;
      actionRequired: number;
      resolved: number;
      total: number;
    };
    workloadAverages: {
      avgWeeklyHours: number;
      avgNightShifts: number;
      avgSleepHours: number;
      avgUnavailedLeaves: number;
    };
    unitBreakdown: Array<{
      id: string;
      name: string;
      location: string;
      theatre: string;
      stressLevel: string;
      personnelCount: number;
      earlyWarningsCount: number;
    }>;
    monthlyTrends: Array<{
      month: string;
      avgWellnessScore: number;
      assessmentCount: number;
    }>;
  };
}

export class ReportClientService {
  /**
   * Fetch aggregated operational report metrics
   */
  static async getOperationalReport(unitId?: string): Promise<OperationalReportResponse> {
    const url = unitId ? `/api/reports?unitId=${encodeURIComponent(unitId)}` : "/api/reports";
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) {
      throw new Error(`Failed to load operational report (status ${res.status})`);
    }
    return res.json();
  }

  /**
   * Download a report in CSV, PDF/HTML, or JSON format
   */
  static async downloadReport(
    reportId: string,
    format: "csv" | "pdf" | "html" | "json" = "csv",
    unitId?: string
  ): Promise<void> {
    const queryParams = new URLSearchParams({
      reportId,
      format,
      ...(unitId ? { unitId } : {}),
      ...(format === "csv" || format === "json" ? { download: "1" } : {}),
    });

    const url = `/api/reports/download?${queryParams.toString()}`;

    if (format === "pdf" || format === "html") {
      // Open in new tab for direct printing or PDF saving via browser native dialog
      window.open(url, "_blank");
      return;
    }

    // Direct blob file download for CSV & JSON
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: "Download failed" }));
      throw new Error(errData.error || `Download failed with status ${res.status}`);
    }

    const blob = await res.blob();
    const disposition = res.headers.get("Content-Disposition");
    let filename = `${reportId}.${format}`;
    if (disposition && disposition.includes("filename=")) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) filename = match[1];
    }

    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
  }
}
