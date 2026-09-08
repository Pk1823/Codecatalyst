import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, handleAuthError, AuthError } from "@/lib/auth/rbac";
import { AuditService } from "@/services/audit.service";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { role, userId, name: userName } = session;

    // Zero-Trust / DPDP Act: Personnel cannot download aggregated operational reports
    if (role === "PERSONNEL") {
      throw new AuthError("Forbidden: Personnel role cannot access or download aggregated operational reports", 403);
    }

    const searchParams = req.nextUrl.searchParams;
    const reportId = searchParams.get("reportId") || "rep-01";
    const format = (searchParams.get("format") || "csv").toLowerCase();
    const unitId = searchParams.get("unitId") || undefined;
    const asAttachment = searchParams.get("download") === "true" || searchParams.get("download") === "1";
    const timestamp = new Date().toISOString().slice(0, 10);

    // Audit log this download request
    await AuditService.log({
      actorId: userId,
      actorName: userName || "Operational User",
      actorRole: role,
      action: "DOWNLOAD_REPORT",
      resource: "REPORT",
      resourceId: reportId,
      metadata: { format, unitId, timestamp },
    });

    if (format === "csv") {
      let filename = `report_${reportId}_${timestamp}.csv`;
      let csv = "";

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
        filename = `unit_welfare_morale_assessment_${timestamp}.csv`;
        csv = rows.map((r) => r.join(",")).join("\n");
      } else if (reportId === "rep-02" || reportId === "risk-trend") {
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
        filename = `risk_trend_fatigue_trajectory_${timestamp}.csv`;
        csv = rows.map((r) => r.join(",")).join("\n");
      } else if (reportId === "rep-03" || reportId === "workload") {
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
        filename = `force_workload_roster_audit_${timestamp}.csv`;
        csv = rows.map((r) => r.join(",")).join("\n");
      } else if (reportId === "rep-04" || reportId === "welfare-cases") {
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
        filename = `welfare_intervention_case_outcomes_${timestamp}.csv`;
        csv = rows.map((r) => r.join(",")).join("\n");
      } else {
        // rep-05 / default
        const units = await prisma.unit.findMany({
          where: unitId ? { id: unitId } : undefined,
          include: { _count: { select: { personnel: true, earlyWarnings: true } } },
        });
        const totalPredictions = await prisma.riskPrediction.count();
        const lowCount = await prisma.riskPrediction.count({ where: { riskLevel: "LOW" } });
        const moderateCount = await prisma.riskPrediction.count({ where: { riskLevel: "MODERATE" } });
        const highCount = await prisma.riskPrediction.count({ where: { riskLevel: "HIGH" } });
        const earlyWarningsTotal = await prisma.earlyWarning.count();
        const casesTotal = await prisma.welfareCase.count();
        const casesActive = await prisma.welfareCase.count({
          where: { status: { in: ["NEW", "REVIEWING", "SUPPORT_PLANNED", "FOLLOW_UP"] } },
        });
        const casesClosed = await prisma.welfareCase.count({ where: { status: "CLOSED" } });

        const rows = [
          ["Metric Category", "Metric Key", "Metric Value"],
          ["Executive Overview", "Operational Battalions", units.length],
          ["Executive Overview", "Risk Predictions", totalPredictions],
          ["Executive Overview", "Active Welfare Cases", casesActive],
          ["Executive Overview", "Closed Cases", casesClosed],
          ["Executive Overview", "Total Warnings", earlyWarningsTotal],
          ["Risk Distribution", "Low Concern", lowCount],
          ["Risk Distribution", "Moderate Attention", moderateCount],
          ["Risk Distribution", "Elevated Risk", highCount],
          ...units.map((u) => [
            "Unit Status",
            `"${u.name}"`,
            `Strength: ${u._count.personnel} | Stress: ${u.stressLevel} | Alerts: ${u._count.earlyWarnings}`,
          ]),
        ];
        filename = `sector_monthly_welfare_summary_${timestamp}.csv`;
        csv = rows.map((r) => r.join(",")).join("\n");
      }

      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    if (format === "html" || format === "pdf") {
      const units = await prisma.unit.findMany({
        where: unitId ? { id: unitId } : undefined,
        include: { _count: { select: { personnel: true, earlyWarnings: true } } },
      });
      const totalUnits = units.length;
      const totalPredictions = await prisma.riskPrediction.count();
      const casesActive = await prisma.welfareCase.count({
        where: { status: { in: ["NEW", "REVIEWING", "SUPPORT_PLANNED", "FOLLOW_UP"] } },
      });
      const casesClosed = await prisma.welfareCase.count({ where: { status: "CLOSED" } });
      const casesTotal = await prisma.welfareCase.count();
      const earlyWarningsActive = await prisma.earlyWarning.count({
        where: { status: { in: ["NEW", "ACTION_REQUIRED"] } },
      });

      const workloadAgg = await prisma.workloadRecord.aggregate({
        _avg: { dutyHours5d: true, nightShifts5d: true, sleepHoursAvg: true, leaveDaysUnavailed: true },
      });

      const avgHours = Number((workloadAgg._avg.dutyHours5d || 0).toFixed(1));
      const avgNight = Number((workloadAgg._avg.nightShifts5d || 0).toFixed(1));
      const avgSleep = Number((workloadAgg._avg.sleepHoursAvg || 0).toFixed(1));
      const avgLeaves = Number((workloadAgg._avg.leaveDaysUnavailed || 0).toFixed(1));
      const resolutionRate = casesTotal > 0 ? Number(((casesClosed / casesTotal) * 100).toFixed(1)) : 0;

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
      <div class="card-val">${totalUnits} Bns</div>
    </div>
    <div class="card">
      <div class="card-label">Active Casework</div>
      <div class="card-val">${casesActive} Cases</div>
    </div>
    <div class="card">
      <div class="card-label">Resolution Rate</div>
      <div class="card-val">${resolutionRate}%</div>
    </div>
    <div class="card">
      <div class="card-label">Early Warnings</div>
      <div class="card-val">${earlyWarningsActive} Pkts</div>
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
        <td>${u._count.personnel}</td>
        <td><span class="badge ${
          u.stressLevel.toLowerCase().includes("optimal") ? "badge-ok" : "badge-warn"
        }">${u.stressLevel}</span></td>
        <td>${u._count.earlyWarnings}</td>
      </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <div class="section-title">Force Workload & Rest Averages (5-Day Trajectory)</div>
  <div class="grid">
    <div class="card">
      <div class="card-label">Avg Weekly Duty Hours</div>
      <div class="card-val">${avgHours}h</div>
    </div>
    <div class="card">
      <div class="card-label">Avg Night Shifts</div>
      <div class="card-val">${avgNight} / 5d</div>
    </div>
    <div class="card">
      <div class="card-label">Restorative Sleep Avg</div>
      <div class="card-val">${avgSleep}h / 24h</div>
    </div>
    <div class="card">
      <div class="card-label">Unavailed Leave Days</div>
      <div class="card-val">${avgLeaves} Days</div>
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

      const filename = `official_welfare_report_${reportId}_${timestamp}.html`;
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": asAttachment
            ? `attachment; filename="${filename}"`
            : `inline; filename="${filename}"`,
        },
      });
    }

    if (format === "json") {
      const units = await prisma.unit.findMany({
        where: unitId ? { id: unitId } : undefined,
        include: { _count: { select: { personnel: true, earlyWarnings: true } } },
      });
      const payload = {
        metadata: {
          dataset: "Synthetic Demo Data",
          department: "CRPF, Police II Division - Ministry of Home Affairs",
          reportId,
          generatedAt: new Date().toISOString(),
          requestingRole: role,
        },
        units,
      };

      return new Response(JSON.stringify(payload, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="operational_welfare_report_${reportId}_${timestamp}.json"`,
        },
      });
    }

    return NextResponse.json(
      { error: `Unsupported format: ${format}. Supported: csv, html, pdf, json.` },
      { status: 400 }
    );
  } catch (error) {
    return handleAuthError(error);
  }
}
