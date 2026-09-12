import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "elevated" | "bordered" | "glass";
}

export const Card: React.FC<CardProps> = ({ children, style, variant = "default" }) => {
  const { colors, isDark } = useTheme();

  const getBackground = () => {
    if (variant === "glass") {
      return isDark ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.85)";
    }
    return colors.card;
  };

  const getBorderColor = () => {
    if (variant === "bordered") {
      return colors.primary;
    }
    return colors.cardBorder;
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBackground(),
          borderColor: getBorderColor(),
          borderTopColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.95)",
        },
        (variant === "elevated" || variant === "glass") &&
          (isDark ? styles.elevatedDark : styles.elevatedLight),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
    ...Platform.select({
      web: {
        backdropFilter: "blur(12px)",
      } as any,
    }),
  },
  elevatedDark: Platform.select({
    web: {
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.3)",
    } as any,
    default: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 5,
    },
  }),
  elevatedLight: Platform.select({
    web: {
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.07), 0 1px 2px rgba(0, 0, 0, 0.04)",
    } as any,
    default: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
  }),
});
