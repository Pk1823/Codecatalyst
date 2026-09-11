export interface ColorScheme {
  background: string;
  card: string;
  cardBorder: string;
  surface: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryDark: string;
  primaryForeground: string;
  accent: string;
  border: string;
  inputBg: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  badgeBg: string;
  badgeText: string;
  tabBarBg: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
}

export const darkTheme: ColorScheme = {
  background: "#090D16",
  card: "#0F172A",
  cardBorder: "#1E293B",
  surface: "#131C31",
  text: "#F8FAFC",
  textMuted: "#94A3B8",
  primary: "#3B82F6",
  primaryDark: "#1D4ED8",
  primaryForeground: "#FFFFFF",
  accent: "#10B981",
  border: "#1E293B",
  inputBg: "#111827",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4",
  badgeBg: "#1E293B",
  badgeText: "#E2E8F0",
  tabBarBg: "#0B1120",
  tabBarBorder: "#1E293B",
  tabBarActive: "#3B82F6",
  tabBarInactive: "#64748B",
};

export const lightTheme: ColorScheme = {
  background: "#F8FAFC",
  card: "#FFFFFF",
  cardBorder: "#E2E8F0",
  surface: "#F1F5F9",
  text: "#0F172A",
  textMuted: "#64748B",
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryForeground: "#FFFFFF",
  accent: "#059669",
  border: "#E2E8F0",
  inputBg: "#FFFFFF",
  success: "#059669",
  warning: "#D97706",
  danger: "#DC2626",
  info: "#0284C7",
  badgeBg: "#F1F5F9",
  badgeText: "#334155",
  tabBarBg: "#FFFFFF",
  tabBarBorder: "#E2E8F0",
  tabBarActive: "#2563EB",
  tabBarInactive: "#94A3B8",
};
