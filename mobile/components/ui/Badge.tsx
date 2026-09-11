import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface BadgeProps {
  label: string;
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "primary" | "error" | "default";
  size?: "sm" | "md";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "neutral",
  size = "md",
  style,
  textStyle,
}) => {
  const { colors, isDark } = useTheme();

  const getColors = () => {
    switch (variant) {
      case "success":
        return {
          bg: isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.12)",
          text: colors.success,
          border: isDark ? "rgba(16, 185, 129, 0.3)" : "rgba(16, 185, 129, 0.25)",
        };
      case "warning":
        return {
          bg: isDark ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.12)",
          text: colors.warning,
          border: isDark ? "rgba(245, 158, 11, 0.3)" : "rgba(245, 158, 11, 0.25)",
        };
      case "danger":
      case "error":
        return {
          bg: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.12)",
          text: colors.danger,
          border: isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.25)",
        };
      case "info":
      case "primary":
        return {
          bg: isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.12)",
          text: colors.info,
          border: isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.25)",
        };
      default:
        return {
          bg: colors.badgeBg,
          text: colors.badgeText,
          border: colors.cardBorder,
        };
    }
  };

  const c = getColors();

  return (
    <View
      style={[
        styles.badge,
        size === "sm" ? styles.sm : styles.md,
        { backgroundColor: c.bg, borderColor: c.border },
        style,
      ]}
    >
      <Text style={[styles.text, { color: c.text }, size === "sm" && styles.text_sm, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  text_sm: {
    fontSize: 9,
  },
});
