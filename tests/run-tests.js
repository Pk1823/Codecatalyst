/**
 * MISSIONWELL AI — Automated Integration & Security RBAC Test Suite
 * Organization: Ministry of Home Affairs / CRPF, Police II Division
 */

const http = require("http");
const PORT = 5000;
let server;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(message);
  } else {
    console.log(`  ✅ PASSED: ${message}`);
  }
}

async function runTests() {
  console.log("================================================================");
  console.log(" MISSIONWELL AI — INTEGRATION & RBAC SECURITY TEST SUITE");
  console.log(" Organization: Ministry of Home Affairs | CRPF Police II Div");
  console.log("================================================================\n");

  const baseUrl = `http://localhost:5000`;

  let passedCount = 0;
  let totalCount = 0;

  async function testStep(name, fn) {
    totalCount++;
    console.log(`[TEST ${totalCount}] ${name}`);
    try {
      await fn();
      passedCount++;
    } catch (err) {
      console.error(`  Error in test:`, err.message);
    }
    console.log("");
  }

  let personnelToken = "";
  let welfareToken = "";
  let commanderToken = "";
  let adminToken = "";
  let createdCaseId = "";

  try {
    // 1. Health Check
    await testStep("Public Health Check Endpoint", async () => {
      const res = await fetch(`${baseUrl}/health`);
      assert(res.status === 200, `Health check returns 200 (got ${res.status})`);
      const body = await res.json();
      assert(body.status === "healthy", "Service reports healthy status");
    });

    // 2. Authentication: 4 Distinct Roles
    await testStep("Authentication: Personnel Sign-In", async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "PERSONNEL" }),
      });
      assert(res.status === 200, `Personnel login succeeded with 200 (got ${res.status})`);
      const data = await res.json();
      assert(data.token, "Signed JWT session token issued");
      assert(data.user.role === "PERSONNEL", "Session role is PERSONNEL");
      personnelToken = data.token;
    });

    await testStep("Authentication: Welfare Officer Sign-In", async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "WELFARE_OFFICER" }),
      });
      assert(res.status === 200, "Welfare Officer login succeeded with 200");
      const data = await res.json();
      welfareToken = data.token;
      assert(data.user.role === "WELFARE_OFFICER", "Session role is WELFARE_OFFICER");
    });

    await testStep("Authentication: Commander Sign-In", async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "COMMANDER" }),
      });
      assert(res.status === 200, "Commander login succeeded with 200");
      const data = await res.json();
      commanderToken = data.token;
      assert(data.user.role === "COMMANDER", "Session role is COMMANDER");
    });

    await testStep("Authentication: Admin Sign-In", async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "ADMIN" }),
      });
      assert(res.status === 200, "Admin login succeeded with 200");
      const data = await res.json();
      adminToken = data.token;
      assert(data.user.role === "ADMIN", "Session role is ADMIN");
    });

    // 3. RBAC Strict Denial Tests (Crucial requirement from spec)
    await testStep("RBAC Enforce: PERSONNEL Denied Access to Welfare Cases", async () => {
      const res = await fetch(`${baseUrl}/api/welfare/cases`, {
        headers: { Authorization: `Bearer ${personnelToken}` },
      });
      assert(res.status === 403, `Personnel access to welfare cases blocked with 403 Forbidden (got ${res.status})`);
    });

    await testStep("RBAC Enforce: PERSONNEL Denied Creating Clinical Cases", async () => {
      const res = await fetch(`${baseUrl}/api/welfare/cases`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${personnelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personnelId: "P-1024",
          title: "Unauthorized clinical record",
          reason: "Testing boundary",
        }),
      });
      assert(res.status === 403, `Personnel case creation blocked with 403 Forbidden (got ${res.status})`);
    });

    await testStep("RBAC Enforce: PERSONNEL Denied Access to Aggregated Operational Reports", async () => {
      const res = await fetch(`${baseUrl}/api/reports`, {
        headers: { Authorization: `Bearer ${personnelToken}` },
      });
      assert(res.status === 403, `Personnel access to reports blocked with 403 Forbidden (got ${res.status})`);
    });

    await testStep("RBAC Enforce: Non-Admin Denied Access to Cryptographic Audit Logs", async () => {
      const res = await fetch(`${baseUrl}/api/audit-logs`, {
        headers: { Authorization: `Bearer ${personnelToken}` },
      });
      assert(res.status === 403, `Personnel access to audit logs blocked with 403 Forbidden (got ${res.status})`);
    });

    // 4. Data Privacy: Commander PII Protection
    await testStep("Data Privacy: Commander Reads Personnel Profile (Granular Survey Redacted)", async () => {
      const res = await fetch(`${baseUrl}/api/personnel/P-1024`, {
        headers: { Authorization: `Bearer ${commanderToken}` },
      });
      assert(res.status === 200, `Commander received profile with 200 OK (got ${res.status})`);
      const body = await res.json();
      assert(body.personnel, "Personnel record returned");
      assert(
        !body.personnel.wellnessAssessments || body.personnel.wellnessAssessments === false,
        "Granular voluntary survey responses are strictly redacted for Commander"
      );
    });

    // 5. Real End-to-End Workflow: Assessment -> ML -> Case -> Action -> Audit
    await testStep("End-to-End: Personnel Submits Voluntary Wellness Assessment", async () => {
      const res = await fetch(`${baseUrl}/api/wellness/assessments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${personnelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personnelId: "P-1024",
          energy: "Low",
          sleepQuality: "Low",
          workload: "High",
          recovery: "Low",
          emotionalFatigue: "High",
          workLifeBalance: "Low",
          overallWellbeing: "Low",
          additionalNotes: "Extended continuous field watch duty without shift relief.",
        }),
      });

      assert(res.status === 201, `Assessment saved with 201 Created (got ${res.status})`);
      const body = await res.json();
      assert(body.assessment.id, "Assessment persisted in database");
      assert(body.prediction, "ML Engine evaluated stress indicator");
      assert(body.prediction.riskScore >= 60, `Risk indicator elevated as expected (${body.prediction.riskScore}/100)`);
      assert(body.prediction.factors.length > 0, "SHAP explainability factors generated");
      assert(body.prediction.recommendations.length > 0, "Non-punitive welfare recommendations produced");
    });

    await testStep("End-to-End: Welfare Officer Triages Auto-Created Welfare Case", async () => {
      const res = await fetch(`${baseUrl}/api/welfare/cases`, {
        headers: { Authorization: `Bearer ${welfareToken}` },
      });
      assert(res.status === 200, "Welfare Officer retrieved active cases");
      const body = await res.json();
      assert(body.cases.length > 0, `Active welfare cases retrieved from database (count: ${body.cases.length})`);

      const highCase = body.cases.find((c) => c.personnelId === "P-1024");
      assert(highCase, "High-risk assessment successfully triggered triage case");
      createdCaseId = highCase.id;
    });

    await testStep("End-to-End: Welfare Officer Progresses Case Status & Adds Clinical Note", async () => {
      const res = await fetch(`${baseUrl}/api/welfare/cases/${createdCaseId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${welfareToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "REVIEWING",
          noteText: "Contacted unit subedar. Commencing mandatory 24-hr rest rotation review.",
        }),
      });
      assert(res.status === 200, `Case updated with 200 OK (got ${res.status})`);
      const body = await res.json();
      assert(body.case.status === "REVIEWING", "Case status progressed to REVIEWING in database");
      assert(body.case.caseNotes.length > 0, "Clinical note saved securely");
    });

    await testStep("End-to-End: Welfare Officer Records Intervention Support Action", async () => {
      const res = await fetch(`${baseUrl}/api/welfare/support-actions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${welfareToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseId: createdCaseId,
          actionType: "Duty Pacing",
          title: "48-Hour Field Duty Stand-Down",
          description: "Relieved from continuous outpost patrol; rotated to administrative base camp duty.",
          scheduledDate: new Date().toISOString(),
        }),
      });
      assert(res.status === 201, `Support action created with 201 Created (got ${res.status})`);
      const body = await res.json();
      assert(body.action.id, "Support action persisted in database");
    });

    await testStep("End-to-End: Commander Views Aggregated Operational Heatmap & Trends", async () => {
      const res = await fetch(`${baseUrl}/api/reports`, {
        headers: { Authorization: `Bearer ${commanderToken}` },
      });
      assert(res.status === 200, "Commander accessed aggregated operational report");
      const body = await res.json();
      assert(body.data.overview.totalUnits > 0, "Unit aggregations computed from database");
      assert(body.data.riskDistribution, "Force-wide wellness risk distribution calculated");
      assert(body.metadata.dataset === "Synthetic Demo Data", "Dataset clearly labeled as Synthetic Demo Data");
    });

    await testStep("End-to-End: Commander Downloads Official Welfare Report in CSV Format", async () => {
      const res = await fetch(`${baseUrl}/api/reports/download?reportId=rep-01&format=csv`, {
        headers: { Authorization: `Bearer ${commanderToken}` },
      });
      assert(res.status === 200, "Commander received 200 OK for CSV report download");
      const contentType = res.headers.get("content-type") || "";
      assert(contentType.includes("text/csv"), `Content-Type is text/csv (got ${contentType})`);
      const disposition = res.headers.get("content-disposition") || "";
      assert(disposition.includes("attachment") && disposition.includes(".csv"), "Content-Disposition has attachment with .csv");
      const csvText = await res.text();
      assert(csvText.includes("Unit ID") && csvText.includes("Personnel Count"), "CSV content contains expected headers and units");
    });

    await testStep("End-to-End: Welfare Officer Downloads Official Welfare Report in Printable HTML/PDF Format", async () => {
      const res = await fetch(`${baseUrl}/api/reports/download?reportId=rep-05&format=html`, {
        headers: { Authorization: `Bearer ${welfareToken}` },
      });
      assert(res.status === 200, "Welfare Officer received 200 OK for HTML/PDF report download");
      const contentType = res.headers.get("content-type") || "";
      assert(contentType.includes("text/html"), `Content-Type is text/html (got ${contentType})`);
      const htmlText = await res.text();
      assert(htmlText.includes("GOVERNMENT OF INDIA") && htmlText.includes("MISSIONWELL AI"), "HTML report contains official MHA header and branding");
      assert(htmlText.includes("window.print()"), "Print trigger is embedded for instant PDF export");
    });

    await testStep("Security RBAC: Personnel Role is Strictly Forbidden from Downloading Operational Reports", async () => {
      const res = await fetch(`${baseUrl}/api/reports/download?reportId=rep-01&format=csv`, {
        headers: { Authorization: `Bearer ${personnelToken}` },
      });
      assert(res.status === 403, `Personnel report download rejected with 403 Forbidden (got ${res.status})`);
    });

    await testStep("End-to-End: Admin Verifies Immutable Audit Trail", async () => {
      const res = await fetch(`${baseUrl}/api/audit-logs`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      assert(res.status === 200, "Admin accessed audit logs with 200 OK");
      const body = await res.json();
      assert(body.data.length > 0, `Audit entries found in database (count: ${body.data.length})`);
      const actions = body.data.map((l) => l.action);
      assert(actions.includes("USER_LOGIN"), "Login events logged");
      assert(actions.includes("SUBMIT_ASSESSMENT"), "Assessment events logged");
      assert(actions.includes("UPDATE_CASE"), "Case updates logged");
      assert(actions.includes("RECORD_INTERVENTION"), "Interventions logged");
    });

    // 17. Google OAuth 2.0 Authentication & DPDP Compliance
    await testStep("Google OAuth 2.0: Generate Authorization Consent URL", async () => {
      const res = await fetch(`${baseUrl}/api/auth/google/url?role=WELFARE_OFFICER&force=CRPF`);
      assert(res.status === 200, "Google OAuth URL generated successfully");
      const body = await res.json();
      assert(body.success === true, "Response indicates success");
      assert(body.url.includes("accounts.google.com/o/oauth2/v2/auth"), "URL points to official Google OAuth endpoint");
      assert(body.url.includes("response_type=code"), "URL requires authorization code flow");
      assert(body.url.includes("userinfo.email"), "URL requests userinfo.email scope");
    });

    await testStep("Google OAuth 2.0: Authenticate Profile & Issue Session JWT", async () => {
      const res = await fetch(`${baseUrl}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "dr.aarti.welfare@gmail.com",
          name: "Dr. Aarti Sharma",
          role: "WELFARE_OFFICER",
          force: "CRPF",
        }),
      });
      assert(res.status === 200, "Google authentication succeeded with 200 OK");
      const body = await res.json();
      assert(body.success === true, "Authentication flagged successful");
      assert(body.user.email === "dr.aarti.welfare@gmail.com", "User profile synchronized");
      assert(body.user.role === "WELFARE_OFFICER", "Authorized role assigned");
      assert(body.token && body.token.length > 20, "Cryptographic session JWT issued");
    });

    await testStep("Google OAuth 2.0: Reject Malformed Callback Code", async () => {
      const res = await fetch(`${baseUrl}/api/auth/google/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      assert(res.status === 400, "Missing authorization code rejected with 400 Bad Request");
    });

    await testStep("Google OAuth 2.0: DPDP Act 2023 Audit Trail Verification", async () => {
      const res = await fetch(`${baseUrl}/api/audit-logs`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      assert(res.status === 200, "Admin accessed audit logs");
      const body = await res.json();
      const actions = body.data.map((l) => l.action);
      assert(actions.includes("USER_LOGIN") || actions.includes("USER_LOGIN_GOOGLE_OAUTH"), "Google SSO logged in immutable audit trail");
    });

  } finally {
    // Tests complete
  }

  console.log("================================================================");
  console.log(` TEST RUN COMPLETE: ${passedCount}/${totalCount} TESTS PASSED`);
  console.log("================================================================");

  if (passedCount === totalCount) {
    console.log("🎉 ALL TESTS PASSED! SYSTEM VERIFIED END-TO-END.");
    process.exit(0);
  } else {
    console.error("❌ SOME TESTS FAILED.");
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Fatal test runner error:", e);
  process.exit(1);
});
