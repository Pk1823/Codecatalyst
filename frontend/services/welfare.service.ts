import { WelfareCase, WelfareCaseStatus, AIRecommendation, InterventionRecord } from "@/types/welfare";
import { MOCK_WELFARE_CASES, MOCK_RECOMMENDATIONS } from "@/lib/mock-data/cases";

let casesState: WelfareCase[] = [...MOCK_WELFARE_CASES];
let recommendationsState: AIRecommendation[] = [...MOCK_RECOMMENDATIONS];

function getStoredCustomCases(): WelfareCase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("missionwell_custom_cases");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomCases(records: WelfareCase[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("missionwell_custom_cases", JSON.stringify(records));
  } catch {}
}

function mapDbCaseToWelfareCase(c: any): WelfareCase {
  const riskScore = typeof c.riskScore === "number" ? c.riskScore : 50;
  const riskLvl = (riskScore >= 70 ? "HIGH" : riskScore >= 45 ? "MODERATE" : "LOW") as any;
  const statusMap: Record<string, WelfareCaseStatus> = {
    NEW: "New",
    New: "New",
    REVIEWING: "Under Review",
    "Under Review": "Under Review",
    "Active Review": "Under Review",
    SUPPORT_PLANNED: "Intervention",
    "Under Counseling": "Intervention",
    "Rest Rotation": "Intervention",
    FOLLOW_UP: "Follow-up",
    "Follow-up": "Follow-up",
    "Medical Stand-Down": "Intervention",
    CLOSED: "Resolved",
    Resolved: "Resolved",
  };
  const status: WelfareCaseStatus = statusMap[c.status] || "New";

  const caseNotes = (c.caseNotes || []).map((n: any) => ({
    id: n.id,
    author: n.authorName || n.author || "Welfare Officer",
    date: n.createdAt ? new Date(n.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    text: n.text,
    isConfidential: n.isConfidential ?? true,
  }));

  const interventions = (c.supportActions || []).map((a: any) => ({
    id: a.id,
    caseId: c.id,
    personnelId: c.personnelId,
    type: (a.actionType || "Workload Adjustment") as any,
    title: a.title,
    description: a.description,
    status: (a.status === "Planned" ? "Active" : a.status || "Active") as any,
    scheduledDate: a.scheduledDate ? new Date(a.scheduledDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    completedDate: a.completedDate ? new Date(a.completedDate).toISOString().split("T")[0] : undefined,
    officerName: a.officerName || "Dr. Aarti Sharma",
    notes: a.notes,
  }));

  const timeline = [
    {
      id: `tl-open-${c.id}`,
      timestamp: c.createdAt ? new Date(c.createdAt).toLocaleString() : new Date().toLocaleString(),
      title: "Welfare Case Opened",
      description: c.reason || "Case initiated for wellness support.",
      actor: c.assignedOfficer?.name || "Dr. Aarti Sharma",
      actorRole: "Welfare Officer",
      type: "alert" as const,
    },
    ...interventions.map((int: any) => ({
      id: `tl-int-${int.id}`,
      timestamp: int.scheduledDate,
      title: `Intervention: ${int.title}`,
      description: int.description,
      actor: int.officerName,
      actorRole: "Welfare Officer",
      type: "intervention" as const,
    })),
  ];

  return {
    id: c.id,
    personnelId: c.personnelId,
    anonymizedCode: `SEC-P-${c.personnelId?.replace(/^P-/, "") || "1024"}`,
    riskLevel: riskLvl,
    primaryConcern: c.title || c.reason || "Wellness Triage",
    unit: c.personnel?.unit?.name || c.unit || "114 Bn - Alpha Coy (Sukma)",
    assignedOfficer: c.assignedOfficer?.name || c.assignedOfficer || "Dr. Aarti Sharma",
    assignedOfficerId: c.officerId || c.assignedOfficerId || "user-doc-02",
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    status,
    notesCount: c.notesCount ?? caseNotes.length,
    interventionsCount: c.interventionsCount ?? interventions.length,
    timeline,
    interventions,
    caseNotes,
  };
}

export class WelfareService {
  static async getCases(): Promise<WelfareCase[]> {
    let apiCases: WelfareCase[] = [];
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/welfare-cases", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.cases && Array.isArray(json.cases)) {
            apiCases = json.cases.map(mapDbCaseToWelfareCase);
          }
        }
      } catch (e) {
        console.warn("Could not fetch /api/welfare-cases, using local fallback", e);
      }
    }

    const custom = getStoredCustomCases();
    const existingIds = new Set(apiCases.map((c) => c.id.toLowerCase()));
    
    // Add custom/local cases that are not in database yet
    const additionalCustom = custom.filter((c) => !existingIds.has(c.id.toLowerCase()));
    const base = casesState.filter((c) => !existingIds.has(c.id.toLowerCase()));

    const combined = [...apiCases, ...additionalCustom, ...base];
    return combined.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt).getTime();
      return timeB - timeA;
    });
  }

  static async getCaseById(id: string): Promise<WelfareCase | null> {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/welfare-cases/${id}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.case) {
            return mapDbCaseToWelfareCase(json.case);
          }
        }
      } catch {}
    }

    const allCases = await this.getCases();
    const found = allCases.find(
      (c) => c.id.toLowerCase() === id.toLowerCase() || c.personnelId.toLowerCase() === id.toLowerCase()
    );
    return found || null;
  }

  static async updateCaseStatus(id: string, status: WelfareCaseStatus): Promise<WelfareCase | null> {
    // Persist to backend database API
    if (typeof window !== "undefined") {
      fetch(`/api/welfare-cases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }).catch(() => {});
    }

    const allCases = await this.getCases();
    const caseIndex = allCases.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (caseIndex === -1) return null;

    const targetCase = allCases[caseIndex];
    const updatedCase: WelfareCase = {
      ...targetCase,
      status,
      updatedAt: new Date().toISOString().split("T")[0],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          title: `Status Changed to ${status}`,
          description: `Case progression updated by Welfare Officer.`,
          actor: "Dr. Aarti Sharma",
          actorRole: "Welfare Officer",
          type: "status_change" as const,
        },
        ...targetCase.timeline,
      ],
    };

    allCases[caseIndex] = updatedCase;
    saveCustomCases(allCases);

    const memIndex = casesState.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (memIndex !== -1) {
      casesState[memIndex] = updatedCase;
    } else {
      casesState.unshift(updatedCase);
    }

    return updatedCase;
  }

  static async addCaseNote(caseId: string, text: string, author: string = "Dr. Aarti Sharma"): Promise<WelfareCase | null> {
    // Persist to backend database API
    if (typeof window !== "undefined") {
      fetch(`/api/welfare-cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteText: text }),
      }).catch(() => {});
    }

    const allCases = await this.getCases();
    const caseIndex = allCases.findIndex((c) => c.id.toLowerCase() === caseId.toLowerCase());
    if (caseIndex === -1) return null;

    const targetCase = allCases[caseIndex];
    const newNote = {
      id: `note-${Date.now()}`,
      author,
      date: new Date().toISOString().split("T")[0],
      text,
      isConfidential: true,
    };

    const updated: WelfareCase = {
      ...targetCase,
      notesCount: targetCase.notesCount + 1,
      caseNotes: [newNote, ...targetCase.caseNotes],
    };

    allCases[caseIndex] = updated;
    saveCustomCases(allCases);

    const memIndex = casesState.findIndex((c) => c.id.toLowerCase() === caseId.toLowerCase());
    if (memIndex !== -1) {
      casesState[memIndex] = updated;
    } else {
      casesState.unshift(updated);
    }

    return updated;
  }

  static async addIntervention(caseId: string, intervention: Omit<InterventionRecord, "id" | "caseId">): Promise<WelfareCase | null> {
    // Persist to backend database API
    if (typeof window !== "undefined") {
      fetch("/api/support-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          actionType: intervention.type,
          title: intervention.title,
          description: intervention.description,
          scheduledDate: intervention.scheduledDate,
        }),
      }).catch(() => {});
    }

    const allCases = await this.getCases();
    const caseIndex = allCases.findIndex((c) => c.id.toLowerCase() === caseId.toLowerCase());
    if (caseIndex === -1) return null;

    const targetCase = allCases[caseIndex];
    const record: InterventionRecord = {
      ...intervention,
      id: `int-${Date.now().toString().slice(-4)}`,
      caseId,
    };

    const updated: WelfareCase = {
      ...targetCase,
      interventionsCount: targetCase.interventionsCount + 1,
      interventions: [record, ...targetCase.interventions],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          title: `Intervention Added: ${record.title}`,
          description: record.description,
          actor: record.officerName,
          actorRole: "Welfare Officer",
          type: "intervention" as const,
        },
        ...targetCase.timeline,
      ],
    };

    allCases[caseIndex] = updated;
    saveCustomCases(allCases);

    const memIndex = casesState.findIndex((c) => c.id.toLowerCase() === caseId.toLowerCase());
    if (memIndex !== -1) {
      casesState[memIndex] = updated;
    } else {
      casesState.unshift(updated);
    }

    return updated;
  }

  static async createSupportRequestCase(input: {
    personnelId: string;
    supportType: string;
    priority: string;
    description: string;
    preferredContact: string;
  }): Promise<WelfareCase> {
    const caseNum = Math.floor(100 + Math.random() * 900);
    const newCase: WelfareCase = {
      id: `CASE-2025-${caseNum}`,
      personnelId: input.personnelId.toUpperCase(),
      anonymizedCode: `SEC-P-${caseNum}`,
      riskLevel: input.priority === "High" ? "HIGH" : input.priority === "Medium" ? "MODERATE" : "LOW",
      primaryConcern: `${input.supportType} Support Request`,
      unit: "Bravo Company",
      assignedOfficer: "Dr. Aarti Sharma",
      assignedOfficerId: "user-welfare-01",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      status: "New",
      notesCount: 1,
      interventionsCount: 0,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          title: "Confidential Support Request Submitted",
          description: `Personnel submitted self-initiated request for ${input.supportType} via ${input.preferredContact}.`,
          actor: "Personnel (Self-Initiated)",
          actorRole: "Personnel",
          type: "alert",
        },
      ],
      interventions: [],
      caseNotes: [
        {
          id: `note-${Date.now()}`,
          author: "Confidential Self-Submission",
          date: new Date().toISOString().split("T")[0],
          text: input.description,
          isConfidential: true,
        },
      ],
    };

    // Attempt to persist to /api/welfare-cases
    try {
      if (typeof window !== "undefined") {
        await fetch("/api/welfare-cases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personnelId: input.personnelId.toUpperCase(),
            title: `${input.supportType} Support Request`,
            reason: input.description,
            priority: input.priority,
            riskScore: input.priority === "High" ? 75 : input.priority === "Medium" ? 50 : 25,
          }),
        });
      }
    } catch {
      // Graceful offline fallback
    }

    // Persist to local storage
    const custom = getStoredCustomCases();
    saveCustomCases([newCase, ...custom]);
    casesState = [newCase, ...casesState];

    return newCase;
  }

  static async getRecommendations(): Promise<AIRecommendation[]> {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("missionwell_custom_recommendations");
        if (raw) {
          const stored = JSON.parse(raw);
          if (Array.isArray(stored) && stored.length > 0) {
            return stored;
          }
        }
      } catch {}
    }
    return [...recommendationsState];
  }

  static async updateRecommendationStatus(id: string, status: AIRecommendation["status"]): Promise<void> {
    recommendationsState = recommendationsState.map((r) => (r.id === id ? { ...r, status } : r));
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("missionwell_custom_recommendations", JSON.stringify(recommendationsState));
      } catch {}
    }
  }
}
