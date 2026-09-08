import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleAuthError } from "@/lib/auth/rbac";
import { MLPredictor, TelemetryPayload } from "@/lib/ml/predictor";
import { AuditService } from "@/services/audit.service";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const subjectId = body.subject_id || session.personnelId || "P-1024";
    const telemetry: TelemetryPayload = {
      consecutive_field_days: Number(body.consecutive_field_days || 45),
      duty_hours_5d: Number(body.duty_hours_5d || 58.0),
      night_shifts_5d: Number(body.night_shifts_5d || 2),
      leave_denial_ratio: Number(body.leave_denial_ratio || 0.25),
      sleep_hrs_5d_avg: Number(body.sleep_hrs_5d_avg || 5.5),
      self_reported_energy: Number(body.self_reported_energy || 3),
      self_reported_stress: Number(body.self_reported_stress || 5),
      survey_latency_sec: Number(body.survey_latency_sec || 42.0),
      delta_rhr: Number(body.delta_rhr || 2.5),
      masking_index: Number(body.masking_index || 0.1),
    };

    const evaluation = await MLPredictor.evaluate(subjectId, telemetry);

    await AuditService.log({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      action: "PREDICT_RISK",
      resource: "RiskEngine",
      resourceId: subjectId,
      metadata: { riskScore: evaluation.riskScore, riskLevel: evaluation.riskLevel },
    });

    return NextResponse.json({
      success: true,
      subjectId,
      prediction: evaluation,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
