import { PersonnelRecord } from "@/types/personnel";
import { MOCK_PERSONNEL } from "@/lib/mock-data/personnel";

let inMemoryPersonnel: PersonnelRecord[] = [...MOCK_PERSONNEL];

function getStoredCustomPersonnel(): PersonnelRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("missionwell_custom_personnel");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomPersonnel(records: PersonnelRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("missionwell_custom_personnel", JSON.stringify(records));
  } catch {}
}

export class PersonnelService {
  static async getAllPersonnel(): Promise<PersonnelRecord[]> {
    const custom = getStoredCustomPersonnel();
    const existingIds = new Set(custom.map((p) => p.id));
    const base = inMemoryPersonnel.filter((p) => !existingIds.has(p.id));
    return [...custom, ...base];
  }

  static async getPersonnelById(id: string): Promise<PersonnelRecord | null> {
    const all = await this.getAllPersonnel();
    const found = all.find(
      (p) =>
        p.id.toLowerCase() === id.toLowerCase() ||
        p.anonymizedCode.toLowerCase() === id.toLowerCase()
    );
    return found || null;
  }

  static async getPersonnelByUnit(unit: string): Promise<PersonnelRecord[]> {
    const all = await this.getAllPersonnel();
    return all.filter((p) => p.unit.toLowerCase().includes(unit.toLowerCase()));
  }

  static async createPersonnel(data: {
    name: string;
    rank?: string;
    unit?: string;
    deploymentLocation?: string;
    deploymentDurationDays?: number;
    force?: string;
    bloodGroup?: string;
    workloadScore?: number;
  }): Promise<PersonnelRecord> {
    const newIdNum = Math.floor(1000 + Math.random() * 9000);
    const id = `P-${newIdNum}`;
    const anonymizedCode = `SEC-P-${newIdNum}`;
    const score = data.workloadScore ?? 54;

    let workloadStatus: PersonnelRecord["workloadStatus"] = "Optimal";
    if (score > 80) workloadStatus = "Severe";
    else if (score > 65) workloadStatus = "Elevated";
    else if (score > 50) workloadStatus = "Moderate";

    const newRecord: PersonnelRecord = {
      id,
      name: data.name.trim(),
      rank: data.rank || "Constable (GD)",
      unit: data.unit || "Bravo Company",
      deploymentLocation: data.deploymentLocation || "Sector Forward Post",
      deploymentDurationDays: data.deploymentDurationDays ?? 14,
      continuousDutyHours: 8,
      lastLeaveDate: new Date(Date.now() - 45 * 86400000).toISOString().split("T")[0],
      leaveDaysTakenYTD: 12,
      leaveEntitlementDays: 60,
      workloadScore: score,
      workloadStatus,
      recoveryTimeHours: 12,
      dutyHoursPerWeek: 54,
      assignedOfficerId: "user-welfare-01",
      assignedOfficerName: "Dr. Aarti Sharma",
      anonymizedCode,
    };

    // Attempt to persist to Next.js API route if online
    try {
      if (typeof window !== "undefined") {
        await fetch("/api/personnel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            rank: data.rank,
            force: data.force || "CRPF",
            unitName: data.unit,
            baseLocation: data.deploymentLocation,
            activeDeployDays: data.deploymentDurationDays,
            bloodGroup: data.bloodGroup || "O+",
            initialWorkloadScore: score,
          }),
        });
      }
    } catch {
      // Graceful offline fallback
    }

    // Persist to local storage
    const custom = getStoredCustomPersonnel();
    const updatedCustom = [newRecord, ...custom];
    saveCustomPersonnel(updatedCustom);
    inMemoryPersonnel = [newRecord, ...inMemoryPersonnel];

    return newRecord;
  }
}
