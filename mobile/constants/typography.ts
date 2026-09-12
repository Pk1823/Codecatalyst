import { Platform, TextStyle } from "react-native";

export const Typography = {
  fontFamily: {
    regular: Platform.select({
      web: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      default: "GoogleSans-Regular",
    }),
    medium: Platform.select({
      web: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      default: "GoogleSans-Medium",
    }),
    semiBold: Platform.select({
      web: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      default: "GoogleSans-SemiBold",
    }),
    bold: Platform.select({
      web: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      default: "GoogleSans-Bold",
    }),
    mono: Platform.select({
      web: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      default: "JetBrainsMono-Regular",
    }),
    monoBold: Platform.select({
      web: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      default: "JetBrainsMono-Bold",
    }),
  },
};
