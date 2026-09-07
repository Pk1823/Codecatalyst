import { PersonnelRecord } from "@/types/personnel";
import { MOCK_PERSONNEL } from "@/lib/mock-data/personnel";

export class PersonnelService {
  static async getAllPersonnel(): Promise<PersonnelRecord[]> {
    return [...MOCK_PERSONNEL];
  }

  static async getPersonnelById(id: string): Promise<PersonnelRecord | null> {
    const found = MOCK_PERSONNEL.find(
      (p) => p.id.toLowerCase() === id.toLowerCase() || p.anonymizedCode.toLowerCase() === id.toLowerCase()
    );
    return found || null;
  }

  static async getPersonnelByUnit(unit: string): Promise<PersonnelRecord[]> {
    return MOCK_PERSONNEL.filter((p) => p.unit.toLowerCase().includes(unit.toLowerCase()));
  }
}
