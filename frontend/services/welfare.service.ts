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

export class WelfareService {
  static async getCases(): Promise<WelfareCase[]> {
    const custom = getStoredCustomCases();
    const customIds = new Set(custom.map((c) => c.id.toLowerCase()));
    const base = casesState.filter((c) => !customIds.has(c.id.toLowerCase()));
    return [...custom, ...base];
  }

  static async getCaseById(id: string): Promise<WelfareCase | null> {
    const allCases = await this.getCases();
    const found = allCases.find(
      (c) => c.id.toLowerCase() === id.toLowerCase() || c.personnelId.toLowerCase() === id.toLowerCase()
    );
    return found || null;
  }

  static async updateCaseStatus(id: string, status: WelfareCaseStatus): Promise<WelfareCase | null> {
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
