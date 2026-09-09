import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function getRiskColorClass(level: "LOW" | "MODERATE" | "HIGH" | "URGENT REVIEW" | string) {
  switch (level?.toUpperCase()) {
    case "LOW":
      return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800";
    case "MODERATE":
      return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
    case "HIGH":
      return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800";
    case "URGENT REVIEW":
    case "URGENT":
      return "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";
    default:
      return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800";
  }
}

export function getBackendUrl(): string {
  const raw = (process.env.BACKEND_URL || "http://localhost:5000").trim();
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.replace(/\/$/, "");
  }
  return `http://${raw}`.replace(/\/$/, "");
}
