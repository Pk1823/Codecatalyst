import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Resolves backend host across Android emulator, iOS simulator, web browser, and physical devices
export const getHostIp = (): string => {
  if (Platform.OS === "web" && typeof window !== "undefined" && window.location?.hostname) {
    return window.location.hostname;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(":")[0];
    if (ip) {
      return ip;
    }
  }

  const linkingUri = (Constants as any).linkingUri;
  if (linkingUri && typeof linkingUri === "string") {
    const match = linkingUri.match(/:\/\/(.*?)(:\d+|$)/);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Active Mac LAN IP on local Wi-Fi / network
  return "172.16.26.187";
};

// Generates prioritized candidate API base URLs
export const getCandidateBaseUrls = (): string[] => {
  const urls: string[] = [];

  if (process.env.EXPO_PUBLIC_BACKEND_URL) {
    urls.push(process.env.EXPO_PUBLIC_BACKEND_URL.replace(/\/$/, ""));
  }

  // 1. On Web Browser: current page host is immediately reachable
  if (Platform.OS === "web" && typeof window !== "undefined" && window.location?.hostname) {
    const h = window.location.hostname;
    urls.push(`http://${h}:5001/api`);
    urls.push(`http://${h}:3000/api`);
  }

  const hostIp = getHostIp();

  // 2. Detected Host / LAN IP (Port 5001 Express, Port 3000 Next.js Portal)
  if (hostIp) {
    urls.push(`http://${hostIp}:5001/api`);
    urls.push(`http://${hostIp}:3000/api`);
  }

  // 3. Direct Mac LAN IP (Reachable across local Wi-Fi from real devices)
  urls.push("http://172.16.26.187:5001/api");
  urls.push("http://172.16.26.187:3000/api");

  // 4. Localhost fallbacks
  urls.push("http://localhost:5001/api");
  urls.push("http://localhost:3000/api");
  urls.push("http://127.0.0.1:5001/api");
  urls.push("http://127.0.0.1:3000/api");

  // 5. Android Emulator
  if (Platform.OS === "android") {
    urls.push("http://10.0.2.2:5001/api");
    urls.push("http://10.0.2.2:3000/api");
  }

  return Array.from(new Set(urls));
};

export const getAiEngineUrl = (): string => {
  if (process.env.EXPO_PUBLIC_AI_ENGINE_URL) {
    return process.env.EXPO_PUBLIC_AI_ENGINE_URL.replace(/\/$/, "");
  }
  if (Platform.OS === "web" && typeof window !== "undefined" && window.location?.hostname) {
    return `http://${window.location.hostname}:8000`;
  }
  const hostIp = getHostIp();
  if (hostIp) {
    return `http://${hostIp}:8000`;
  }
  return "http://172.16.26.187:8000";
};

let cachedWorkingBaseUrl: string | null = null;

export const API_BASE_URL = getCandidateBaseUrls()[0];
export const AI_ENGINE_URL = getAiEngineUrl();

export class ApiClient {
  private static async getAuthHeader(): Promise<Record<string, string>> {
    try {
      let token: string | null = null;
      if (Platform.OS === "web") {
        token = typeof localStorage !== "undefined" ? localStorage.getItem("missionwell_token") : null;
      } else {
        token = await SecureStore.getItemAsync("missionwell_token");
      }
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    } catch {
      // SecureStore or storage access failed
    }
    return { Authorization: "Bearer persona-jwt-user-jawan-01" };
  }

  private static async fetchWithFallback(
    path: string,
    options: RequestInit
  ): Promise<Response> {
    const candidates = getCandidateBaseUrls();
    // Prioritize previously working candidate if available
    const ordered = cachedWorkingBaseUrl
      ? [cachedWorkingBaseUrl, ...candidates.filter((u) => u !== cachedWorkingBaseUrl)]
      : candidates;

    let lastError: any = null;

    for (const baseUrl of ordered) {
      const url = `${baseUrl}${path}`;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s fast timeout per candidate

        const res = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok || res.status === 400 || res.status === 401 || res.status === 403 || res.status === 404) {
          cachedWorkingBaseUrl = baseUrl;
          return res;
        }
        lastError = new Error(`Server at ${baseUrl} returned status ${res.status}`);
      } catch (err: any) {
        lastError = err;
        // Continue to next candidate
      }
    }

    throw lastError || new Error(`Failed to connect to backend on any candidate URL for ${path}`);
  }

  public static async get<T>(path: string): Promise<T> {
    const authHeaders = await this.getAuthHeader();
    const response = await this.fetchWithFallback(path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `GET ${path} failed (${response.status})`);
    }

    return response.json();
  }

  public static async post<T, B = unknown>(path: string, body: B): Promise<T> {
    const authHeaders = await this.getAuthHeader();
    const response = await this.fetchWithFallback(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `POST ${path} failed (${response.status})`);
    }

    return response.json();
  }

  public static async patch<T, B = unknown>(path: string, body: B): Promise<T> {
    const authHeaders = await this.getAuthHeader();
    const response = await this.fetchWithFallback(path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `PATCH ${path} failed (${response.status})`);
    }

    return response.json();
  }
}
