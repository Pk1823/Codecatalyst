import { WelfareCase, WelfareCaseStatus, AIRecommendation, InterventionRecord } from "@/types/welfare";
import { MOCK_WELFARE_CASES, MOCK_RECOMMENDATIONS } from "@/lib/mock-data/cases";

let casesState: WelfareCase[] = [...MOCK_WELFARE_CASES];
let recommendationsState: AIRecommendation[] = [...MOCK_RECOMMENDATIONS];

export class WelfareService {
  static async getCases(): Promise<WelfareCase[]> {
    return [...casesState];
  }

  static async getCaseById(id: string): Promise<WelfareCase | null> {
    const found = casesState.find(
      (c) => c.id.toLowerCase() === id.toLowerCase() || c.personnelId.toLowerCase() === id.toLowerCase()
    );
    return found || null;
  }

  static async updateCaseStatus(id: string, status: WelfareCaseStatus): Promise<WelfareCase | null> {
    const caseIndex = casesState.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (caseIndex === -1) return null;

    const updatedCase = {
      ...casesState[caseIndex],
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
        ...casesState[caseIndex].timeline,
      ],
    };

    casesState[caseIndex] = updatedCase;
    return updatedCase;
  }

  static async addCaseNote(caseId: string, text: string, author: string = "Dr. Aarti Sharma"): Promise<WelfareCase | null> {
    const caseIndex = casesState.findIndex((c) => c.id.toLowerCase() === caseId.toLowerCase());
    if (caseIndex === -1) return null;

    const newNote = {
      id: `note-${Date.now()}`,
      author,
      date: new Date().toISOString().split("T")[0],
      text,
      isConfidential: true,
    };

    const updated = {
      ...casesState[caseIndex],
      notesCount: casesState[caseIndex].notesCount + 1,
      caseNotes: [newNote, ...casesState[caseIndex].caseNotes],
    };

    casesState[caseIndex] = updated;
    return updated;
  }

  static async addIntervention(caseId: string, intervention: Omit<InterventionRecord, "id" | "caseId">): Promise<WelfareCase | null> {
    const caseIndex = casesState.findIndex((c) => c.id.toLowerCase() === caseId.toLowerCase());
    if (caseIndex === -1) return null;

    const record: InterventionRecord = {
      ...intervention,
      id: `int-${Date.now().toString().slice(-4)}`,
      caseId,
    };

    const updated = {
      ...casesState[caseIndex],
      interventionsCount: casesState[caseIndex].interventionsCount + 1,
      interventions: [record, ...casesState[caseIndex].interventions],
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
        ...casesState[caseIndex].timeline,
      ],
    };

    casesState[caseIndex] = updated;
    return updated;
  }

  static async createSupportRequestCase(input: {
    personnelId: string;
    supportType: string;
    priority: string;
    description: string;
    preferredContact: string;
  }): Promise<WelfareCase> {
    const newCase: WelfareCase = {
      id: `CASE-2025-${Math.floor(100 + Math.random() * 900)}`,
      personnelId: input.personnelId,
      anonymizedCode: `SEC-P-${Math.floor(100 + Math.random() * 900)}`,
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

    casesState = [newCase, ...casesState];
    return newCase;
  }

  static async getRecommendations(): Promise<AIRecommendation[]> {
    return [...recommendationsState];
  }

  static async updateRecommendationStatus(id: string, status: AIRecommendation["status"]): Promise<void> {
    recommendationsState = recommendationsState.map((r) => (r.id === id ? { ...r, status } : r));
  }
}
