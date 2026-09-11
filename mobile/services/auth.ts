import { ApiClient } from "./api";
import { User, AuthResponse, UserRole } from "../types";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

async function saveStorageItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch {
    // Fallback if unavailable
  }
}

async function getStorageItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
    }
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function deleteStorageItem(key: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch {
    // Ignore
  }
}

// Soldier profiles matching defense database for instant soldier self-assessment testing
export const EVALUATOR_PERSONAS: Record<string, User> = {
  jawan: {
    id: "user-jawan-01",
    name: "Ct. Piyush Kumar",
    serviceId: "CRPF-GD-2021-04128",
    email: "piyush.kumar@crpf.gov.in",
    role: "PERSONNEL",
    rank: "Constable (GD)",
    force: "CRPF",
    unitId: "114-coy-a",
    department: "114 Bn (Alpha Company, Sukma)",
    personnelId: "P-1024",
  },
  jawan2: {
    id: "user-jawan-02",
    name: "Hav. Rajesh Kumar",
    serviceId: "CRPF-GD-2018-09124",
    email: "rajesh.kumar@crpf.gov.in",
    role: "PERSONNEL",
    rank: "Havildar",
    force: "CRPF",
    unitId: "114-coy-b",
    department: "114 Bn (Bravo Company)",
    personnelId: "P-1025",
  },
  jawan3: {
    id: "user-jawan-03",
    name: "ASI Gurpreet Singh",
    serviceId: "CRPF-ASI-2016-3391",
    email: "gurpreet.singh@crpf.gov.in",
    role: "PERSONNEL",
    rank: "Assistant Sub-Inspector",
    force: "CRPF",
    unitId: "114-coy-hq",
    department: "114 Bn (HQ Company)",
    personnelId: "P-1144",
  },
  doctor: {
    id: "user-jawan-01",
    name: "Ct. Piyush Kumar",
    serviceId: "CRPF-GD-2021-04128",
    email: "piyush.kumar@crpf.gov.in",
    role: "PERSONNEL",
    rank: "Constable (GD)",
    force: "CRPF",
    unitId: "114-coy-a",
    department: "114 Bn (Alpha Company, Sukma)",
    personnelId: "P-1024",
  },
  commander: {
    id: "user-jawan-01",
    name: "Ct. Piyush Kumar",
    serviceId: "CRPF-GD-2021-04128",
    email: "piyush.kumar@crpf.gov.in",
    role: "PERSONNEL",
    rank: "Constable (GD)",
    force: "CRPF",
    unitId: "114-coy-a",
    department: "114 Bn (Alpha Company, Sukma)",
    personnelId: "P-1024",
  },
  admin: {
    id: "user-jawan-01",
    name: "Ct. Piyush Kumar",
    serviceId: "CRPF-GD-2021-04128",
    email: "piyush.kumar@crpf.gov.in",
    role: "PERSONNEL",
    rank: "Constable (GD)",
    force: "CRPF",
    unitId: "114-coy-a",
    department: "114 Bn (Alpha Company, Sukma)",
    personnelId: "P-1024",
  },
};

export class AuthService {
  public static async loginWithCredentials(serviceId: string, password: string): Promise<AuthResponse> {
    try {
      const response = await ApiClient.post<AuthResponse>("/auth/login", {
        serviceId,
        password,
      });

      if (response.token) {
        await saveStorageItem("missionwell_token", response.token);
      }
      return response;
    } catch {
      // Fallback for demo / offline evaluator login
      const matched = Object.values(EVALUATOR_PERSONAS).find(
        (p) => p.serviceId.toLowerCase() === serviceId.toLowerCase()
      );

      if (matched) {
        const dummyToken = `persona-jwt-${matched.id}`;
        await saveStorageItem("missionwell_token", dummyToken);
        return {
          success: true,
          token: dummyToken,
          user: matched,
        };
      }

      throw new Error("Invalid Service ID or password. Use evaluator quick buttons below for testing.");
    }
  }

  public static async loginAsPersona(personaKey: string): Promise<User> {
    const persona = (EVALUATOR_PERSONAS as Record<string, User>)[personaKey] || EVALUATOR_PERSONAS.jawan;
    try {
      const response = await ApiClient.post<AuthResponse>("/auth/login", {
        serviceId: persona.serviceId,
        role: persona.role,
      });

      if (response.token) {
        await saveStorageItem("missionwell_token", response.token);
        if (response.user) {
          await saveStorageItem("missionwell_user", JSON.stringify(response.user));
          return response.user;
        }
      }
    } catch {
      // Fallback for offline mode
    }

    const dummyToken = `persona-jwt-${persona.id}`;
    try {
      await saveStorageItem("missionwell_token", dummyToken);
      await saveStorageItem("missionwell_user", JSON.stringify(persona));
    } catch {
      // Ignore
    }
    return persona;
  }

  public static async loginWithGoogleUser(user: User): Promise<User> {
    const dummyToken = `google-jwt-${user.id}`;
    try {
      await saveStorageItem("missionwell_token", dummyToken);
      await saveStorageItem("missionwell_user", JSON.stringify(user));
    } catch {
      // Ignore
    }
    return user;
  }

  public static async getCurrentSession(): Promise<User | null> {
    try {
      const stored = await getStorageItem("missionwell_user");
      if (stored) return JSON.parse(stored);
      const token = await getStorageItem("missionwell_token");
      if (!token) return null;

      // Extract which persona from token if possible
      for (const p of Object.values(EVALUATOR_PERSONAS)) {
        if (token.includes(p.id)) return p;
      }

      return EVALUATOR_PERSONAS.jawan;
    } catch {
      return null;
    }
  }

  public static async logout(): Promise<void> {
    try {
      await deleteStorageItem("missionwell_token");
      await deleteStorageItem("missionwell_user");
    } catch {
      // Ignore
    }
  }
}
