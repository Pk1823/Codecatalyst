import { API_BASE_URL } from "./api";
import { WelfareCase } from "../types";
import * as SecureStore from "expo-secure-store";

export const MOCK_WELFARE_CASES: WelfareCase[] = [
  {
    id: "CASE-2026-081",
    personnelId: "P-1024",
    serviceNumber: "CRPF-GD-2021-04128",
    rank: "Constable (GD)",
    name: "Ct. Piyush Kumar",
    unitName: "114 Bn - Alpha Coy (Sukma)",
    riskScore: 78,
    status: "Active Review",
    openedDate: "2026-09-08",
    clinicalNotes: "High cumulative sleep debt (avg <3.5 hrs) and continuous CI patrol duty. Reported elevated cognitive strain. Recommended 48-hr base camp stand-down.",
    assignedOfficer: "Dr. Aarti Sharma (CMO)",
    priority: "HIGH",
    caseNotes: [
      {
        id: "note-01",
        authorName: "Dr. Aarti Sharma",
        createdAt: "2026-09-08",
        text: "Initial screening confirmed continuous combat patrol without restorative rest. Cognitive reaction metrics lowered.",
        isConfidential: true,
      },
    ],
    supportActions: [
      {
        id: "act-01",
        caseId: "CASE-2026-081",
        actionType: "Duty Pacing",
        title: "48-Hour Base Stand-Down",
        description: "Exempted from forward night ambushes for 48 hours to restore baseline sleep.",
        status: "Active",
        officerName: "Dr. Aarti Sharma",
      },
    ],
    riskFactors: [
      { featureName: "Consecutive Field Days", featureValue: 24, contributionWeight: 0.35, description: "24 consecutive days without rotation" },
      { featureName: "Duty Hours (5-Day)", featureValue: 68, contributionWeight: 0.28, description: "68 hours logged in last 5 days" },
      { featureName: "Sleep Deficit", featureValue: 3.5, contributionWeight: 0.22, description: "Averaging under 3.5 hrs sleep" },
    ],
    recommendations: [
      { category: "Rest & Recovery", title: "Mandatory Stand-Down", description: "Clear 48h sleep debt before weapons patrol.", priority: "High" },
      { category: "Clinical Consultation", title: "Stress Decompression Session", description: "Schedule confidential 1-on-1 counseling window.", priority: "Moderate" },
    ],
  },
  {
    id: "CASE-2026-079",
    personnelId: "P-1092",
    serviceNumber: "CRPF-GD-2019-8812",
    rank: "Head Constable",
    name: "HC Ramesh Chandra",
    unitName: "114 Bn - Bravo Coy",
    riskScore: 62,
    status: "Under Counseling",
    openedDate: "2026-09-05",
    clinicalNotes: "Family distress combined with high operational tempo in forward grid. First tele-counseling completed.",
    assignedOfficer: "Dr. Aarti Sharma (CMO)",
    priority: "MEDIUM",
  },
  {
    id: "CASE-2026-074",
    personnelId: "P-1144",
    serviceNumber: "CRPF-ASI-2016-3391",
    rank: "Assistant Sub-Inspector",
    name: "ASI Gurpreet Singh",
    unitName: "114 Bn - HQ Coy",
    riskScore: 42,
    status: "Rest Rotation",
    openedDate: "2026-08-28",
    clinicalNotes: "Post-ambush fatigue. Successfully completed 7-day scheduled rest rotation. Sleep metrics returned to normal baseline.",
    assignedOfficer: "Dr. Aarti Sharma (CMO)",
    priority: "LOW",
  },
];

function normalizeWelfareCase(c: any): WelfareCase {
  const riskScore = typeof c.riskScore === "number" ? Math.round(c.riskScore) : 50;
  let priority = c.priority || (riskScore >= 70 ? "HIGH" : riskScore >= 45 ? "MEDIUM" : "LOW");
  if (priority.toUpperCase() === "CRITICAL") priority = "HIGH";
  else if (priority.toUpperCase() === "MODERATE") priority = "MEDIUM";
  else priority = priority.toUpperCase();

  const statusMap: Record<string, string> = {
    NEW: "Active Review",
    New: "Active Review",
    REVIEWING: "Under Counseling",
    "Under Review": "Under Counseling",
    "Active Review": "Active Review",
    SUPPORT_PLANNED: "Rest Rotation",
    "Under Counseling": "Under Counseling",
    "Rest Rotation": "Rest Rotation",
    "Medical Stand-Down": "Medical Stand-Down",
    FOLLOW_UP: "Active Review",
    "Follow-up": "Active Review",
    CLOSED: "Resolved",
    Resolved: "Resolved",
  };
  const status = statusMap[c.status] || c.status || "Active Review";

  const caseNotes = (c.caseNotes || []).map((n: any) => ({
    id: n.id,
    authorName: n.authorName || n.author || "Dr. Aarti Sharma",
    createdAt: n.createdAt ? new Date(n.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    text: n.text,
    isConfidential: n.isConfidential ?? true,
  }));

  const supportActions = (c.supportActions || []).map((a: any) => ({
    id: a.id,
    caseId: c.id,
    actionType: a.actionType || "Workload Adjustment",
    title: a.title,
    description: a.description,
    status: a.status || "Active",
    scheduledDate: a.scheduledDate ? new Date(a.scheduledDate).toISOString().split("T")[0] : undefined,
    completedDate: a.completedDate ? new Date(a.completedDate).toISOString().split("T")[0] : undefined,
    officerName: a.officerName || "Dr. Aarti Sharma",
  }));

  const riskFactors =
    c.personnel?.riskPredictions?.[0]?.factors ||
    c.factors ||
    [
      { featureName: "Consecutive Field Days", featureValue: 24, contributionWeight: 0.35, description: "Continuous deployment in operational sector." },
      { featureName: "Duty Hours (5-Day)", featureValue: 62, contributionWeight: 0.28, description: "Extended shift hours with minimal recovery time." },
      { featureName: "Sleep Deficit", featureValue: 4.2, contributionWeight: 0.20, description: "Sub-optimal restorative sleep duration." },
    ];

  const recommendations =
    c.personnel?.recommendations ||
    c.recommendations ||
    [
      { category: "Rest & Recovery", title: "Mandatory Rest Window", description: "Schedule mandatory restorative rest within 48 hours.", priority: "High" },
      { category: "Duty Adjustment", title: "Operational Duty Pacing", description: "Rebalance duty schedule to alternate high-intensity shifts.", priority: "Moderate" },
    ];

  const primaryNote = caseNotes[0]?.text || c.reason || c.clinicalNotes || "Case undergoing confidential welfare evaluation.";
  const openedDate = c.createdAt
    ? new Date(c.createdAt).toISOString().split("T")[0]
    : (c.openedDate || new Date().toISOString().split("T")[0]);

  return {
    id: c.id,
    personnelId: c.personnelId || c.personnel?.id || "P-1024",
    serviceNumber: c.personnel?.serviceNumber || c.serviceNumber || c.personnelId || "CRPF-GD-2021-04128",
    rank: c.personnel?.rank || c.rank || "Constable (GD)",
    name: c.personnel?.name || c.name || "Ct. Piyush Kumar",
    unitName: c.personnel?.unit?.name || c.unitName || "114 Bn - Alpha Coy (Sukma)",
    riskScore,
    status,
    openedDate,
    clinicalNotes: primaryNote,
    assignedOfficer: c.assignedOfficer?.name || c.assignedOfficer || "Dr. Aarti Sharma (CMO)",
    priority: priority as any,
    caseNotes,
    supportActions,
    riskFactors,
    recommendations,
  };
}

export class WelfareService {
  private static async getWelfareAuthToken(): Promise<string> {
    try {
      const currentToken = await SecureStore.getItemAsync("missionwell_token");
      const currentUserStr = await SecureStore.getItemAsync("missionwell_user");
      if (currentUserStr) {
        const u = JSON.parse(currentUserStr);
        if (u.role === "WELFARE_OFFICER" || u.role === "ADMIN") {
          return currentToken || "persona-jwt-user-doc-02";
        }
      }
      return currentToken || "persona-jwt-user-doc-02";
    } catch {
      return "persona-jwt-user-doc-02";
    }
  }

  public static async getCases(): Promise<WelfareCase[]> {
    try {
      const officerToken = await this.getWelfareAuthToken();
      const response = await fetch(`${API_BASE_URL}/welfare/cases`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${officerToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.cases && Array.isArray(data.cases) && data.cases.length > 0) {
          const liveCases = data.cases.map(normalizeWelfareCase);
          return liveCases;
        }
      }
      return MOCK_WELFARE_CASES;
    } catch {
      return MOCK_WELFARE_CASES;
    }
  }

  public static async getCaseById(id: string): Promise<WelfareCase | undefined> {
    try {
      const officerToken = await this.getWelfareAuthToken();
      const response = await fetch(`${API_BASE_URL}/welfare/cases/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${officerToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.case) {
          return normalizeWelfareCase(data.case);
        }
      }

      const all = await this.getCases();
      return all.find(
        (c) => c.id.toLowerCase() === id.toLowerCase() || c.personnelId.toLowerCase() === id.toLowerCase()
      );
    } catch {
      return MOCK_WELFARE_CASES.find((c) => c.id === id);
    }
  }

  public static async updateCaseNotes(id: string, notes: string, status: string): Promise<boolean> {
    try {
      const officerToken = await this.getWelfareAuthToken();
      const response = await fetch(`${API_BASE_URL}/welfare/cases/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${officerToken}`,
        },
        body: JSON.stringify({ noteText: notes, notes, status }),
      });
      return response.ok;
    } catch {
      const target = MOCK_WELFARE_CASES.find((c) => c.id === id);
      if (target) {
        target.clinicalNotes = notes;
        target.status = status;
      }
      return true;
    }
  }

  public static async addSupportAction(
    caseId: string,
    action: { actionType: string; title: string; description: string; scheduledDate?: string }
  ): Promise<boolean> {
    try {
      const officerToken = await this.getWelfareAuthToken();
      const res = await fetch(`${API_BASE_URL}/welfare/support-actions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${officerToken}`,
        },
        body: JSON.stringify({ caseId, ...action }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  public static async createCase(data: {
    personnelId: string;
    title: string;
    reason: string;
    priority: string;
    riskScore?: number;
  }): Promise<WelfareCase | null> {
    try {
      const officerToken = await this.getWelfareAuthToken();
      const res = await fetch(`${API_BASE_URL}/welfare/cases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${officerToken}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.case) {
          return normalizeWelfareCase(json.case);
        }
      }
      return null;
    } catch {
      return null;
    }
  }
}
