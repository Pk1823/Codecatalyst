import { ApiClient } from "./api";
import { Platform } from "react-native";

export interface MobileNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  priority: "HIGH" | "MEDIUM" | "INFO";
  icon: "warning" | "darbar" | "buddy" | "medical";
  category?: string;
  isDoctorVisit?: boolean;
  doctorName?: string;
  scheduledDate?: string;
  visitLevel?: string;
}

export class NotificationService {
  private static listeners: Array<(notifications: MobileNotification[]) => void> = [];

  public static async getNotifications(personnelId: string = "P-1024"): Promise<MobileNotification[]> {
    const results: MobileNotification[] = [];

    // 1. Check local storage / cross-tab broadcast first for instant offline responsiveness
    try {
      if (Platform.OS === "web" && typeof window !== "undefined") {
        const storedVisits = localStorage.getItem("missionwell_doctor_visits");
        if (storedVisits) {
          const visits = JSON.parse(storedVisits);
          for (const v of visits) {
            const vLevel = v.shortLevel || (v.visitLevel?.match(/Level\s*\d/i) ? v.visitLevel.match(/Level\s*\d/i)[0].toUpperCase() : "LEVEL 2");
            results.push({
              id: v.id || `doc-${Date.now()}`,
              title: v.title || `🩺 [${vLevel}] Dr. ${v.doctorName || "Medical Officer"} will visit you`,
              description: v.message || `A Medical Officer has been assigned to visit you on ${v.scheduledDate || "Tomorrow"} for assessment review.`,
              time: "Just now",
              priority: vLevel.includes("1") ? "HIGH" : "HIGH",
              icon: "medical",
              category: "Medical",
              isDoctorVisit: true,
              doctorName: v.doctorName,
              scheduledDate: v.scheduledDate,
              visitLevel: vLevel,
            });
          }
        }
      }
    } catch {}

    // 2. Fetch from backend API
    try {
      const res = await ApiClient.get<{ notifications: any[] }>(`/notifications?personnelId=${encodeURIComponent(personnelId)}`);
      if (res && Array.isArray(res.notifications)) {
        for (const n of res.notifications) {
          const isDoc =
            n.category === "Medical" ||
            n.title.toLowerCase().includes("dr.") ||
            n.title.toLowerCase().includes("doctor") ||
            n.message.toLowerCase().includes("doctor") ||
            n.message.toLowerCase().includes("medical officer");

          const matchLevel = (n.title + " " + n.message).match(/Level\s*[123]/i);
          const extractedLevel = matchLevel ? matchLevel[0].toUpperCase() : isDoc ? "LEVEL 2" : undefined;

          // Avoid duplicates if already added from local broadcast
          if (!results.some((r) => r.title === n.title || r.id === n.id)) {
            results.push({
              id: n.id,
              title: n.title,
              description: n.message,
              time: n.createdAt ? this.formatRelativeTime(n.createdAt) : "Recently",
              priority: extractedLevel?.includes("1") ? "HIGH" : isDoc ? "HIGH" : n.type === "alert" ? "HIGH" : "INFO",
              icon: isDoc ? "medical" : "warning",
              category: n.category || "General",
              isDoctorVisit: isDoc,
              visitLevel: extractedLevel,
            });
          }
        }
      }
    } catch (err) {
      console.warn("[NotificationService] Fetching online notifications failed, using fallback:", err);
    }

    // 3. Fallback default tactical alerts if empty
    if (results.length === 0) {
      results.push(
        {
          id: "ALT-101",
          title: "Buddy-Pair Check Required",
          description: "Scheduled 18:00 hrs mutual welfare check with Ct. Surinder Singh pending.",
          time: "15 mins ago",
          priority: "HIGH",
          icon: "buddy",
        },
        {
          id: "ALT-102",
          title: "CO Darbar Slot Confirmed",
          description: "Audience with Commanding Officer scheduled for tomorrow at 10:00 hrs at Battalion HQ.",
          time: "2 hours ago",
          priority: "MEDIUM",
          icon: "darbar",
        },
        {
          id: "ALT-103",
          title: "Sleep Stand-Down Routine",
          description: "48-hour continuous area domination cycle completed. 8-hour mandatory recovery window active.",
          time: "5 hours ago",
          priority: "INFO",
          icon: "warning",
        }
      );
    }

    return results;
  }

  public static subscribe(callback: (notifications: MobileNotification[]) => void, personnelId: string = "P-1024"): () => void {
    this.listeners.push(callback);

    const checkAndUpdate = async () => {
      const items = await this.getNotifications(personnelId);
      callback(items);
    };

    // Periodic check every 4 seconds for live updates
    const timer = setInterval(checkAndUpdate, 4000);

    let handleWebEvent: any = null;
    if (Platform.OS === "web" && typeof window !== "undefined") {
      handleWebEvent = () => {
        checkAndUpdate();
      };
      window.addEventListener("missionwell_doctor_assigned", handleWebEvent);
      window.addEventListener("storage", handleWebEvent);
      window.addEventListener("focus", checkAndUpdate);
    }

    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
      clearInterval(timer);
      if (Platform.OS === "web" && typeof window !== "undefined") {
        if (handleWebEvent) {
          window.removeEventListener("missionwell_doctor_assigned", handleWebEvent);
          window.removeEventListener("storage", handleWebEvent);
          window.removeEventListener("focus", checkAndUpdate);
        }
      }
    };
  }

  public static clearDoctorVisits(): void {
    try {
      if (Platform.OS === "web" && typeof window !== "undefined") {
        localStorage.removeItem("missionwell_doctor_visits");
        window.dispatchEvent(new CustomEvent("missionwell_doctor_assigned", { detail: null }));
      }
    } catch {}
  }

  private static formatRelativeTime(dateStr: string): string {
    try {
      const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
      if (diffSec < 60) return "Just now";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mins ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
      return `${Math.floor(diffSec / 86400)} days ago`;
    } catch {
      return "Recently";
    }
  }
}
