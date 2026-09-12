import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const { colors, isDark } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.badgeBg;
    if (variant === "primary") return colors.primary;
    if (variant === "secondary") return colors.surface;
    if (variant === "danger") return colors.danger;
    if (variant === "outline") return "transparent";
    return colors.primary;
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    if (variant === "primary" || variant === "danger") return "#FFFFFF";
    if (variant === "secondary") return colors.text;
    if (variant === "outline") return colors.primary;
    return "#FFFFFF";
  };

  const getBorderColor = () => {
    if (variant === "outline") return colors.primary;
    if (variant === "secondary") return colors.cardBorder;
    if (variant === "primary" && isDark) return "rgba(255, 255, 255, 0.2)";
    return "transparent";
  };

  const getGlowStyle = () => {
    if (disabled || variant === "outline") return {};
    if (variant === "primary") {
      return Platform.select({
        web: {
          boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
        } as any,
        default: {
          shadowColor: "#2563EB",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 4,
        },
      });
    }
    if (variant === "danger") {
      return Platform.select({
        web: {
          boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)",
        } as any,
        default: {
          shadowColor: "#EF4444",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 4,
        },
      });
    }
    return {};
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
      style={[
        styles.button,
        styles[size],
        getGlowStyle(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === "outline" || variant === "secondary" || (variant === "primary" && isDark) ? 1 : 0,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.text,
              styles[`text_${size}`],
              { color: getTextColor() },
              icon ? { marginLeft: 8 } : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  lg: {
    paddingVertical: 15,
    paddingHorizontal: 24,
  },
  text: {
    fontWeight: "800",
    fontFamily: "GoogleSans-Bold",
    letterSpacing: 0.2,
  },
  text_sm: {
    fontSize: 12,
  },
  text_md: {
    fontSize: 14,
  },
  text_lg: {
    fontSize: 16,
  },
});
