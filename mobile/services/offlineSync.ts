import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { OfflineQueueItem, WellnessAssessmentResult } from "../types";
import { ApiClient } from "./api";

const QUEUE_STORAGE_KEY = "missionwell_offline_queue";
const ASSESSMENTS_STORAGE_KEY = "missionwell_local_assessments";
const AIRGAP_STORAGE_KEY = "missionwell_airgap_mode";
const LAST_SYNC_KEY = "missionwell_last_sync_time";

async function getItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
    }
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function setItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (e) {
    console.warn(`[OfflineSync] Failed to set ${key}:`, e);
  }
}

type SyncListener = (state: {
  isAirGap: boolean;
  queueCount: number;
  lastSync: string | null;
}) => void;

export class OfflineSyncService {
  private static listeners: Set<SyncListener> = new Set();
  private static cachedAirGap: boolean | null = null;

  public static subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    // Trigger immediate call
    this.notify();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static async notify(): Promise<void> {
    const isAirGap = await this.isAirGapMode();
    const queueCount = await this.getQueueCount();
    const lastSync = await this.getLastSyncTime();
    for (const listener of this.listeners) {
      try {
        listener({ isAirGap, queueCount, lastSync });
      } catch {
        // Ignore listener error
      }
    }
  }

  /**
   * Tactical Air-Gap Mode:
   * When enabled by an officer/soldier, forces all network communications to stay 100% on-device
   * with zero radio/RF emission, ideal for border posts, forward ambushes, and stealth missions.
   */
  public static async isAirGapMode(): Promise<boolean> {
    if (this.cachedAirGap !== null) return this.cachedAirGap;
    const val = await getItem(AIRGAP_STORAGE_KEY);
    this.cachedAirGap = val === "true";
    return this.cachedAirGap;
  }

  public static async setAirGapMode(enabled: boolean): Promise<void> {
    this.cachedAirGap = enabled;
    await setItem(AIRGAP_STORAGE_KEY, enabled ? "true" : "false");
    await this.notify();
  }

  /**
   * Checks if central server is reachable.
   * Returns false immediately if Air-Gap mode is on.
   */
  public static async isServerReachable(): Promise<boolean> {
    const airGap = await this.isAirGapMode();
    if (airGap) return false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      // Fast ping using ApiClient
      await ApiClient.get("/wellness/assessments?limit=1");
      clearTimeout(timeoutId);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Returns true if either network is disconnected OR soldier has enabled Air-Gap mode.
   */
  public static async isEffectiveOffline(): Promise<boolean> {
    const airGap = await this.isAirGapMode();
    if (airGap) return true;
    const reachable = await this.isServerReachable();
    return !reachable;
  }

  /**
   * Queues an action into the secure offline vault.
   */
  public static async enqueue(
    type: OfflineQueueItem["type"],
    payload: any
  ): Promise<OfflineQueueItem> {
    const queue = await this.getQueue();
    const item: OfflineQueueItem = {
      id: `OFFLINE-${type.slice(0, 3)}-${Date.now().toString().slice(-6)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
      status: "QUEUED",
      retryCount: 0,
    };

    queue.unshift(item);
    await setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    await this.notify();
    return item;
  }

  public static async getQueue(): Promise<OfflineQueueItem[]> {
    const raw = await getItem(QUEUE_STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public static async getQueueCount(): Promise<number> {
    const queue = await this.getQueue();
    return queue.filter((i) => i.status === "QUEUED" || i.status === "FAILED").length;
  }

  public static async getLastSyncTime(): Promise<string | null> {
    return await getItem(LAST_SYNC_KEY);
  }

  /**
   * Saves an assessment to local history store so trends, historical charts,
   * and previous scores are instantly accessible with zero internet.
   */
  public static async saveLocalAssessment(
    assessment: WellnessAssessmentResult
  ): Promise<void> {
    const existing = await this.getLocalAssessments();
    const filtered = existing.filter((a) => a.id !== assessment.id);
    const updated = [assessment, ...filtered].slice(0, 30); // Keep last 30 assessments
    await setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(updated));
  }

  public static async getLocalAssessments(): Promise<WellnessAssessmentResult[]> {
    const raw = await getItem(ASSESSMENTS_STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /**
   * Synchronizes all queued records with the central battalion server.
   * Can be called automatically upon base camp connection or manually via UI.
   */
  public static async syncNow(): Promise<{
    success: boolean;
    syncedCount: number;
    failedCount: number;
    message: string;
  }> {
    const isAirGap = await this.isAirGapMode();
    if (isAirGap) {
      return {
        success: false,
        syncedCount: 0,
        failedCount: 0,
        message: "Air-Gap Tactical Mode is active. Disable it to synchronize with Battalion Base.",
      };
    }

    const queue = await this.getQueue();
    const pending = queue.filter((i) => i.status === "QUEUED" || i.status === "FAILED");

    if (pending.length === 0) {
      return {
        success: true,
        syncedCount: 0,
        failedCount: 0,
        message: "All defense records are up to date with Battalion Server.",
      };
    }

    let syncedCount = 0;
    let failedCount = 0;
    const updatedQueue: OfflineQueueItem[] = [];

    for (const item of queue) {
      if (item.status === "SYNCED") {
        updatedQueue.push(item);
        continue;
      }

      try {
        item.status = "SYNCING";

        if (item.type === "ASSESSMENT") {
          await ApiClient.post("/wellness/assessments", item.payload);
        } else if (item.type === "BUDDY_CHECK") {
          await ApiClient.post("/welfare/buddy-check", item.payload);
        } else if (item.type === "DARBAR_REQUEST") {
          await ApiClient.post("/welfare/darbar", item.payload);
        }

        item.status = "SYNCED";
        syncedCount++;
      } catch (err) {
        console.warn(`[OfflineSync] Sync failed for ${item.id}:`, err);
        item.status = "FAILED";
        item.retryCount = (item.retryCount || 0) + 1;
        failedCount++;
      }

      // Retain failed or recently synced items
      updatedQueue.push(item);
    }

    // Keep queue pruned
    const prunedQueue = updatedQueue.filter((i) => i.status !== "SYNCED" || Date.now() - new Date(i.timestamp).getTime() < 86400000);
    await setItem(QUEUE_STORAGE_KEY, JSON.stringify(prunedQueue));

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    await setItem(LAST_SYNC_KEY, now);
    await this.notify();

    return {
      success: failedCount === 0,
      syncedCount,
      failedCount,
      message:
        failedCount === 0
          ? `Successfully synchronized ${syncedCount} record(s) to Battalion Central Server.`
          : `Synchronized ${syncedCount} record(s). ${failedCount} could not be uploaded (retrying).`,
    };
  }

  /**
   * Resets or clears local offline queue (for administrative maintenance)
   */
  public static async clearQueue(): Promise<void> {
    await setItem(QUEUE_STORAGE_KEY, JSON.stringify([]));
    await this.notify();
  }
}
