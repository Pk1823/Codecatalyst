import { prisma } from "../lib/db";

export class ReportService {
  static async getOperationalReport(unitId?: string) {
    const units = await prisma.unit.findMany({
      where: unitId ? { id: unitId } : undefined,
      include: {
        _count: {
          select: {
            personnel: true,
            earlyWarnings: true,
          },
        },
      },
    });

    const totalPredictions = await prisma.riskPrediction.count();
    const lowCount = await prisma.riskPrediction.count({ where: { riskLevel: "LOW" } });
    const moderateCount = await prisma.riskPrediction.count({ where: { riskLevel: "MODERATE" } });
    const highCount = await prisma.riskPrediction.count({ where: { riskLevel: "HIGH" } });

    const earlyWarningsTotal = await prisma.earlyWarning.count();
    const earlyWarningsNew = await prisma.earlyWarning.count({ where: { status: "NEW" } });
    const earlyWarningsAction = await prisma.earlyWarning.count({ where: { status: "ACTION_REQUIRED" } });
    const earlyWarningsResolved = await prisma.earlyWarning.count({ where: { status: "RESOLVED" } });

    const casesTotal = await prisma.welfareCase.count();
    const casesActive = await prisma.welfareCase.count({
      where: { status: { in: ["NEW", "REVIEWING", "SUPPORT_PLANNED", "FOLLOW_UP"] } },
    });
    const casesClosed = await prisma.welfareCase.count({ where: { status: "CLOSED" } });

    const supportActionsCount = await prisma.supportAction.count();

    const workloadAgg = await prisma.workloadRecord.aggregate({
      _avg: {
        dutyHours5d: true,
        nightShifts5d: true,
        sleepHoursAvg: true,
        leaveDaysUnavailed: true,
      },
    });

    const assessments = await prisma.wellnessAssessment.findMany({
      select: { createdAt: true, score: true },
      orderBy: { createdAt: "asc" },
      take: 200,
    });

    const monthlyTrendsMap: Record<string, { totalScore: number; count: number }> = {};
    for (const a of assessments) {
      const monthStr = new Date(a.createdAt).toISOString().slice(0, 7);
      if (!monthlyTrendsMap[monthStr]) {
        monthlyTrendsMap[monthStr] = { totalScore: 0, count: 0 };
      }
      monthlyTrendsMap[monthStr].totalScore += a.score;
      monthlyTrendsMap[monthStr].count += 1;
    }

    const monthlyTrends = Object.entries(monthlyTrendsMap).map(([month, data]) => ({
      month,
      avgWellnessScore: Number((data.totalScore / data.count).toFixed(1)),
      assessmentCount: data.count,
    }));

    return {
      metadata: {
        dataset: "Synthetic Demo Data",
        department: "CRPF, Police II Division - Ministry of Home Affairs",
        generatedAt: new Date().toISOString(),
      },
      data: {
        overview: {
          totalUnits: units.length,
          totalPredictions,
          casesTotal,
          casesActive,
          casesClosed,
          resolutionRatePercent: casesTotal > 0 ? Number(((casesClosed / casesTotal) * 100).toFixed(1)) : 0,
          earlyWarningsTotal,
          earlyWarningsActive: earlyWarningsNew + earlyWarningsAction,
          supportActionsDelivered: supportActionsCount,
        },
        riskDistribution: {
          low: lowCount,
          moderate: moderateCount,
          high: highCount,
          total: totalPredictions,
        },
        earlyWarningBreakdown: {
          new: earlyWarningsNew,
          actionRequired: earlyWarningsAction,
          resolved: earlyWarningsResolved,
          total: earlyWarningsTotal,
        },
        workloadAverages: {
          avgWeeklyHours: Number((workloadAgg._avg?.dutyHours5d || 0).toFixed(1)),
          avgNightShifts: Number((workloadAgg._avg?.nightShifts5d || 0).toFixed(1)),
          avgSleepHours: Number((workloadAgg._avg?.sleepHoursAvg || 0).toFixed(1)),
          avgUnavailedLeaves: Number((workloadAgg._avg?.leaveDaysUnavailed || 0).toFixed(1)),
        },
        unitBreakdown: units.map((u) => ({
          id: u.id,
          name: u.name,
          location: u.location,
          theatre: u.theatre,
          stressLevel: u.stressLevel,
          personnelCount: u._count.personnel,
          earlyWarningsCount: u._count.earlyWarnings,
        })),
        monthlyTrends,
      },
    };
  }

  static async generateReportCsv(reportId: string, unitId?: string): Promise<{ filename: string; csv: string }> {
    const timestamp = new Date().toISOString().slice(0, 10);

    if (reportId === "rep-01" || reportId === "unit-welfare") {
      const units = await prisma.unit.findMany({
        where: unitId ? { id: unitId } : undefined,
        include: { _count: { select: { personnel: true, earlyWarnings: true } } },
      });
      const rows = [
        ["Unit ID", "Unit Name", "Force", "Location", "Theatre", "Commanding Officer", "Stress Level", "Personnel Count", "Early Warnings Count"],
        ...units.map((u) => [
          u.id,
          `"${u.name}"`,
          u.force,
          `"${u.location}"`,
          `"${u.theatre}"`,
          `"${u.commandingOfficer || "N/A"}"`,
          `"${u.stressLevel}"`,
          u._count.personnel,
          u._count.earlyWarnings,
        ]),
      ];
      return {
        filename: `unit_welfare_morale_assessment_${timestamp}.csv`,
        csv: rows.map((r) => r.join(",")).join("\n"),
      };
    }

    if (reportId === "rep-02" || reportId === "risk-trend") {
      const predictions = await prisma.riskPrediction.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: { personnel: true, factors: true },
      });
      const rows = [
        ["Personnel ID", "Service Number", "Name", "Rank", "Force", "Risk Level", "Score", "Top Driver", "Evaluation Date"],
        ...predictions.map((p) => [
          p.personnelId,
          p.personnel?.serviceNumber || "N/A",
          `"${p.personnel?.name || "Anonymous"}"`,
          `"${p.personnel?.rank || "N/A"}"`,
          p.personnel?.force || "CRPF",
          p.riskLevel,
          p.riskScore.toFixed(1) + "/100",
          `"${p.factors[0]?.featureName || "Deployment Fatigue"}: ${p.factors[0]?.featureValue ?? "N/A"}"`,
          p.createdAt.toISOString().slice(0, 10),
        ]),
      ];
      return {
        filename: `risk_trend_fatigue_trajectory_${timestamp}.csv`,
        csv: rows.map((r) => r.join(",")).join("\n"),
      };
    }

    if (reportId === "rep-03" || reportId === "workload") {
      const workloads = await prisma.workloadRecord.findMany({
        take: 100,
        orderBy: { periodStart: "desc" },
        include: { personnel: { include: { unit: true } } },
      });
      const rows = [
        ["Personnel ID", "Name", "Unit", "Duty Hours (5D)", "Night Shifts (5D)", "Avg Sleep (Hrs)", "Unavailed Leaves", "Period Start"],
        ...workloads.map((w) => [
          w.personnelId,
          `"${w.personnel?.name || "N/A"}"`,
          `"${w.personnel?.unit?.name || "114 Bn"}"`,
          w.dutyHours5d,
          w.nightShifts5d,
          w.sleepHoursAvg,
          w.leaveDaysUnavailed,
          w.periodStart.toISOString().slice(0, 10),
        ]),
      ];
      return {
        filename: `force_workload_roster_audit_${timestamp}.csv`,
        csv: rows.map((r) => r.join(",")).join("\n"),
      };
    }

    if (reportId === "rep-04" || reportId === "welfare-cases") {
      const cases = await prisma.welfareCase.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: { personnel: true, assignedOfficer: true, supportActions: true },
      });
      const rows = [
        ["Case ID", "Personnel ID", "Personnel Name", "Case Title", "Priority", "Status", "Risk Score", "Assigned Officer", "Interventions Count", "Created Date"],
        ...cases.map((c) => [
          c.id,
          c.personnelId,
          `"${c.personnel?.name || "N/A"}"`,
          `"${c.title.replace(/"/g, '""')}"`,
          c.priority,
          c.status,
          c.riskScore,
          `"${c.assignedOfficer?.name || "Welfare Directorate"}"`,
          c.supportActions.length,
          c.createdAt.toISOString().slice(0, 10),
        ]),
      ];
      return {
        filename: `welfare_intervention_case_outcomes_${timestamp}.csv`,
        csv: rows.map((r) => r.join(",")).join("\n"),
      };
    }

    // Default / rep-05: Sector Monthly Executive Summary
    const reportData = await this.getOperationalReport(unitId);
    const rows = [
      ["Metric Category", "Metric Key", "Metric Value"],
      ["Overview", "Total Operational Units", reportData.data.overview.totalUnits],
      ["Overview", "Total Risk Predictions", reportData.data.overview.totalPredictions],
      ["Overview", "Total Welfare Cases", reportData.data.overview.casesTotal],
      ["Overview", "Active Welfare Cases", reportData.data.overview.casesActive],
      ["Overview", "Closed Welfare Cases", reportData.data.overview.casesClosed],
      ["Overview", "Resolution Rate", `${reportData.data.overview.resolutionRatePercent}%`],
      ["Overview", "Active Early Warnings", reportData.data.overview.earlyWarningsActive],
      ["Overview", "Support Actions Delivered", reportData.data.overview.supportActionsDelivered],
      ["Risk Distribution", "Low Concern Personnel", reportData.data.riskDistribution.low],
      ["Risk Distribution", "Moderate Attention Personnel", reportData.data.riskDistribution.moderate],
      ["Risk Distribution", "Elevated Risk Personnel", reportData.data.riskDistribution.high],
      ["Workload Averages", "Avg Weekly Duty Hours", reportData.data.workloadAverages.avgWeeklyHours],
      ["Workload Averages", "Avg Night Shifts (5D)", reportData.data.workloadAverages.avgNightShifts],
      ["Workload Averages", "Avg Sleep Hours (24H)", reportData.data.workloadAverages.avgSleepHours],
      ["Workload Averages", "Avg Unavailed Leave Days", reportData.data.workloadAverages.avgUnavailedLeaves],
      ...reportData.data.unitBreakdown.map((u) => [
        "Unit Breakdown",
        `"${u.name}"`,
        `Personnel: ${u.personnelCount} | Stress: ${u.stressLevel} | Alerts: ${u.earlyWarningsCount}`,
      ]),
    ];

    return {
      filename: `sector_monthly_welfare_summary_${timestamp}.csv`,
      csv: rows.map((r) => r.join(",")).join("\n"),
    };
  }

  static async generateReportHtml(reportId: string, unitId?: string): Promise<{ filename: string; html: string }> {
    const timestamp = new Date().toISOString().slice(0, 10);
    const reportData = await this.getOperationalReport(unitId);
    const units = reportData.data.unitBreakdown;
    const ov = reportData.data.overview;
    const wl = reportData.data.workloadAverages;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MISSIONWELL AI - Official Operational Report</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; color: #1e293b; line-height: 1.5; margin: 0; padding: 20px; font-size: 12px; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 20px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
    .header h2 { margin: 4px 0 0 0; font-size: 13px; color: #059669; font-weight: 600; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
    .badge-restricted { background: #fee2e2; color: #dc2626; border: 1px solid #f87171; }
    .badge-ok { background: #d1fae5; color: #065f46; }
    .badge-warn { background: #fef3c7; color: #92400e; }
    .meta-bar { display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; }
    .card-label { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 600; }
    .card-val { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
    th { background: #0f172a; color: #ffffff; text-align: left; padding: 8px 10px; font-weight: 600; font-size: 10px; text-transform: uppercase; }
    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    .section-title { font-size: 13px; font-weight: 700; color: #0f172a; margin: 18px 0 8px 0; border-left: 3px solid #059669; padding-left: 8px; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #cbd5e1; font-size: 10px; color: #64748b; display: flex; justify-content: space-between; }
    .signature-row { display: flex; justify-content: space-between; margin-top: 40px; padding: 0 30px; }
    .signature-block { text-align: center; border-top: 1px solid #94a3b8; width: 180px; padding-top: 6px; font-weight: 600; font-size: 11px; color: #334155; }
    .print-btn-bar { margin-bottom: 20px; text-align: right; }
    .btn { background: #059669; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; }
    @media print {
      .print-btn-bar { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-btn-bar">
    <button class="btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>
  <div class="header">
    <span class="badge badge-restricted">RESTRICTED // OFFICIAL</span>
    <h1 style="margin-top: 8px;">GOVERNMENT OF INDIA • MINISTRY OF HOME AFFAIRS</h1>
    <h2>MISSIONWELL AI — ARMED FORCES & CAPF WELFARE MONITORING REPORT</h2>
    <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Central Reserve Police Force (CRPF) • Police II Division Directorate</div>
  </div>

  <div class="meta-bar">
    <div><strong>Report ID:</strong> ${reportId.toUpperCase()}</div>
    <div><strong>Generated At:</strong> ${new Date().toLocaleString("en-IN")}</div>
    <div><strong>DPDP Act 2023:</strong> COMPLIANT (Zero ACR Prejudice)</div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-label">Operational Units</div>
      <div class="card-val">${ov.totalUnits} Bns</div>
    </div>
    <div class="card">
      <div class="card-label">Active Casework</div>
      <div class="card-val">${ov.casesActive} Cases</div>
    </div>
    <div class="card">
      <div class="card-label">Resolution Rate</div>
      <div class="card-val">${ov.resolutionRatePercent}%</div>
    </div>
    <div class="card">
      <div class="card-label">Early Warnings</div>
      <div class="card-val">${ov.earlyWarningsActive} Pkts</div>
    </div>
  </div>

  <div class="section-title">Operational Unit Breakdown & Stress Index</div>
  <table>
    <thead>
      <tr>
        <th>Unit / Coy</th>
        <th>Sector / Location</th>
        <th>Commanding Officer</th>
        <th>Personnel Strength</th>
        <th>Stress Level</th>
        <th>Active Alerts</th>
      </tr>
    </thead>
    <tbody>
      ${units
        .map(
          (u) => `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.location}</td>
        <td>${u.theatre}</td>
        <td>${u.personnelCount}</td>
        <td><span class="badge ${
          u.stressLevel.toLowerCase().includes("optimal") ? "badge-ok" : "badge-warn"
        }">${u.stressLevel}</span></td>
        <td>${u.earlyWarningsCount}</td>
      </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <div class="section-title">Force Workload & Rest Averages (5-Day Trajectory)</div>
  <div class="grid">
    <div class="card">
      <div class="card-label">Avg Weekly Duty Hours</div>
      <div class="card-val">${wl.avgWeeklyHours}h</div>
    </div>
    <div class="card">
      <div class="card-label">Avg Night Shifts</div>
      <div class="card-val">${wl.avgNightShifts} / 5d</div>
    </div>
    <div class="card">
      <div class="card-label">Restorative Sleep Avg</div>
      <div class="card-val">${wl.avgSleepHours}h / 24h</div>
    </div>
    <div class="card">
      <div class="card-label">Unavailed Leave Days</div>
      <div class="card-val">${wl.avgUnavailedLeaves} Days</div>
    </div>
  </div>

  <div class="signature-row">
    <div class="signature-block">
      Chief Medical Officer<br/>
      <span style="font-weight: normal; font-size: 10px;">Medical & Welfare Directorate</span>
    </div>
    <div class="signature-block">
      Commandant, 114 Bn<br/>
      <span style="font-weight: normal; font-size: 10px;">Tactical Sector Operations</span>
    </div>
  </div>

  <div class="footer">
    <div>MissionWell AI v1.1.0 • Defense Welfare Intelligence</div>
    <div>Strictly Confidential • Non-Punitive Medical Protection</div>
    <div>24x7 Force Helpline: 14416</div>
  </div>
</body>
</html>`;

    return {
      filename: `official_welfare_report_${reportId}_${timestamp}.html`,
      html,
    };
  }
}
