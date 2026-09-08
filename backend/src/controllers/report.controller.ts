import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { ReportService } from "../services/report.service";

export class ReportController {
  /**
   * GET /api/reports
   * Generate aggregated non-punitive operational welfare readiness report
   */
  static async getReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const unitId = req.query.unitId as string | undefined;
      const report = await ReportService.getOperationalReport(unitId);
      res.json(report);
    } catch {
      res.status(500).json({ error: "Failed to generate report" });
    }
  }

  /**
   * GET /api/reports/download
   * Download official operational welfare report in CSV, HTML/PDF, or JSON format
   */
  static async downloadReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const reportId = (req.query.reportId as string) || "rep-01";
      const format = ((req.query.format as string) || "csv").toLowerCase();
      const unitId = req.query.unitId as string | undefined;
      const asAttachment = req.query.download === "true" || req.query.download === "1";

      if (format === "csv") {
        const { filename, csv } = await ReportService.generateReportCsv(reportId, unitId);
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.status(200).send(csv);
        return;
      }

      if (format === "html" || format === "pdf") {
        const { filename, html } = await ReportService.generateReportHtml(reportId, unitId);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        if (asAttachment) {
          res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        } else {
          res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
        }
        res.status(200).send(html);
        return;
      }

      if (format === "json") {
        const report = await ReportService.getOperationalReport(unitId);
        const timestamp = new Date().toISOString().slice(0, 10);
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="operational_welfare_report_${reportId}_${timestamp}.json"`
        );
        res.status(200).json(report);
        return;
      }

      res.status(400).json({ error: `Unsupported format: ${format}. Use csv, html, pdf, or json.` });
    } catch (err: any) {
      console.error("Report download error:", err);
      res.status(500).json({ error: "Failed to download report" });
    }
  }
}
