export interface GoogleAccountProfile {
  email: string;
  name: string;
  avatarUrl: string;
  googleSub?: string;
  emailVerified: boolean;
  authProvider: string;
  isGoogleAccount: boolean;
  accountCreated: string;
  lastActive: string;
  serviceId: string;
  force: string;
  role: string;
  rank: string;
  department: string;
  unitName: string;
}

export interface CustomDatasetDetail {
  id: string;
  category: string;
  label: string;
  value: string;
  notes?: string;
  createdAt: string;
  authorName?: string;
  authorRole?: string;
}

export interface PersonFullDataset {
  googleAccount: GoogleAccountProfile;
  personnel: any;
  customDetails: CustomDatasetDetail[];
  authorization: {
    role: string;
    isAuthorizedOfficer: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    clearanceLevel: string;
    dataProtectionPolicy: string;
  };
}

export class ProfileService {
  /**
   * Fetch complete Google identity and all linked operational/wellness datasets
   */
  static async getProfileDataset(personnelId?: string): Promise<PersonFullDataset> {
    const query = personnelId ? `?personnelId=${encodeURIComponent(personnelId)}` : "";
    const res = await fetch(`/api/profile${query}`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to retrieve profile dataset (${res.status})`);
    }

    const json = await res.json();
    return json;
  }

  /**
   * Add a new detail to the person's dataset (restricted to authorized officers)
   */
  static async addDatasetDetail(
    personnelId: string,
    type: "deployment" | "dutySchedule" | "wellnessAssessment" | "customDetail" | "coreUpdate",
    data: any
  ): Promise<any> {
    const res = await fetch("/api/profile/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personnelId, type, data }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to add detail to dataset.");
    }
    return json.item;
  }

  /**
   * Edit/Update an existing detail in the person's dataset
   */
  static async updateDatasetDetail(
    personnelId: string,
    type: "deployment" | "dutySchedule" | "customDetail" | "coreUpdate",
    id: string,
    data: any
  ): Promise<any> {
    const res = await fetch("/api/profile/details", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personnelId, type, id, data }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to update dataset detail.");
    }
    return json.item;
  }

  /**
   * Remove/Delete a detail from the person's dataset (strict authorized officer check)
   */
  static async removeDatasetDetail(
    personnelId: string,
    type: "deployment" | "dutySchedule" | "wellnessAssessment" | "customDetail",
    id: string
  ): Promise<void> {
    const query = `?personnelId=${encodeURIComponent(personnelId)}&type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
    const res = await fetch(`/api/profile/details${query}`, {
      method: "DELETE",
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to remove detail from dataset.");
    }
  }
}
