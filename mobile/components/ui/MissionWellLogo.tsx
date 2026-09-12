import React from "react";
import { View, Text, StyleSheet, ViewStyle, Platform } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Path,
  Circle,
  Line,
} from "react-native-svg";
import { useTheme } from "../../contexts/ThemeContext";
import { useForce } from "../../contexts/ForceContext";
import { useLanguage } from "../../contexts/LanguageContext";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  showForceBadge?: boolean;
  style?: ViewStyle;
}

const dimMap = {
  xs: 22,
  sm: 32,
  md: 42,
  lg: 54,
  xl: 72,
};

/**
 * Official MissionWell AI Cyber Sentinel Brand Emblem
 * Unified across both Web Portal and Mobile Application.
 * Renders the military-grade Cyber Hex Armor, Indian Tricolor crest notch,
 * server mesh blades, and neural resilience waveform.
 */
export const MissionWellIcon: React.FC<{
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showBadge?: boolean;
}> = ({ size = "md", showBadge = false }) => {
  const dim = dimMap[size];

  return (
    <View style={[styles.iconWrapper, { width: dim, height: dim }]}>
      <Svg width={dim} height={dim} viewBox="0 0 120 120" fill="none">
        <Defs>
          <RadialGradient id="mwMobileBg" cx="50%" cy="50%" r="65%">
            <Stop offset="0%" stopColor="#1E293B" />
            <Stop offset="70%" stopColor="#0F172A" />
            <Stop offset="100%" stopColor="#060913" />
          </RadialGradient>

          <LinearGradient id="mwMobileShield" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#34D399" />
            <Stop offset="50%" stopColor="#059669" />
            <Stop offset="100%" stopColor="#0284C7" />
          </LinearGradient>

          <LinearGradient id="mwMobileTricolor" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FF9933" />
            <Stop offset="50%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#138808" />
          </LinearGradient>

          <LinearGradient id="mwMobileBlade" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#334155" />
            <Stop offset="100%" stopColor="#1E293B" />
          </LinearGradient>

          <LinearGradient id="mwMobilePulse" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#10B981" />
            <Stop offset="50%" stopColor="#38BDF8" />
            <Stop offset="100%" stopColor="#10B981" />
          </LinearGradient>
        </Defs>

        {/* Outer Cyber Shield Armor */}
        <Path
          d="M60 6 L104 28 L104 78 L60 114 L16 78 L16 28 Z"
          fill="url(#mwMobileBg)"
          stroke="url(#mwMobileShield)"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {/* Indian Tricolor Crest Notch at Top */}
        <Path
          d="M48 10 L72 10"
          stroke="url(#mwMobileTricolor)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Tactical Sub-grid */}
        <Path
          d="M26 34 L94 34 M26 86 L94 86"
          stroke="#334155"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity={0.35}
        />

        {/* Blade 1: Web / Edge Tier */}
        <Rect
          x="30"
          y="31"
          width="60"
          height="13"
          rx="3.5"
          fill="url(#mwMobileBlade)"
          stroke="#475569"
          strokeWidth="1"
        />
        <Circle cx="37" cy="37.5" r="2" fill="#10B981" />
        <Circle cx="44" cy="37.5" r="1.5" fill="#38BDF8" />
        <Line
          x1="52"
          y1="37.5"
          x2="84"
          y2="37.5"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 4"
        />

        {/* Blade 2: Core Express REST API Mesh */}
        <Rect
          x="30"
          y="47"
          width="60"
          height="13"
          rx="3.5"
          fill="url(#mwMobileBlade)"
          stroke="#475569"
          strokeWidth="1"
        />
        <Circle cx="37" cy="53.5" r="2" fill="#10B981" />
        <Circle cx="44" cy="53.5" r="1.5" fill="#F59E0B" />
        <Line
          x1="52"
          y1="53.5"
          x2="84"
          y2="53.5"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 4"
        />

        {/* Blade 3: FastAPI LightGBM AI Engine */}
        <Rect
          x="30"
          y="63"
          width="60"
          height="13"
          rx="3.5"
          fill="url(#mwMobileBlade)"
          stroke="#475569"
          strokeWidth="1"
        />
        <Circle cx="37" cy="69.5" r="2" fill="#10B981" />
        <Circle cx="44" cy="69.5" r="1.5" fill="#A855F7" />
        <Line
          x1="52"
          y1="69.5"
          x2="84"
          y2="69.5"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 4"
        />

        {/* Resilience Neural Waveform Pulse */}
        <Path
          d="M22 84 L38 84 L46 72 L52 96 L60 76 L66 88 L72 82 L78 84 L98 84"
          fill="none"
          stroke="url(#mwMobilePulse)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Tactical Defense Node Core */}
        <Circle cx="60" cy="100" r="3.5" fill="#10B981" />
        <Circle cx="60" cy="100" r="1.5" fill="#FFFFFF" />
      </Svg>

      {showBadge && (
        <View style={styles.badgePulse}>
          <View style={styles.badgePulseInner} />
        </View>
      )}
    </View>
  );
};

export const MissionWellLogo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  showSubtitle = true,
  showForceBadge = false,
  style,
}) => {
  const { colors } = useTheme();
  const { currentForce } = useForce();
  const { isHi } = useLanguage();

  const titleSize =
    size === "xl" ? 24 : size === "lg" ? 20 : size === "sm" ? 15 : size === "xs" ? 12 : 17;
  const subSize = size === "xl" ? 12 : size === "lg" ? 11 : 9.5;

  return (
    <View style={[styles.container, style]}>
      <MissionWellIcon size={size} />

      {showText && (
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                  fontSize: titleSize,
                  fontFamily: "GoogleSans-Bold",
                },
              ]}
            >
              MissionWell{" "}
              <Text
                style={[
                  styles.aiSuffix,
                  {
                    color: "#3B82F6",
                    fontSize: titleSize - 1,
                  },
                ]}
              >
                AI
              </Text>
            </Text>

            {showForceBadge && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: `${currentForce.primaryColor}22`,
                    borderColor: `${currentForce.primaryColor}60`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: currentForce.primaryColor,
                      fontFamily: "GoogleSans-Bold",
                    },
                  ]}
                >
                  {currentForce.id}
                </Text>
              </View>
            )}
          </View>

          {showSubtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textMuted,
                  fontSize: subSize,
                  fontFamily: "GoogleSans-Medium",
                },
              ]}
            >
              {isHi
                ? "सशस्त्र बल कल्याण खुफिया • गृह मंत्रालय"
                : "Welfare Intelligence • Ministry of Home Affairs"}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        filter: "drop-shadow(0 4px 12px rgba(16, 185, 129, 0.25))",
      } as any,
      default: {
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  badgePulse: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    borderWidth: 1.5,
    borderColor: "#0F172A",
  },
  badgePulseInner: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#34D399",
  },
  textContainer: {
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  title: {
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  aiSuffix: {
    fontWeight: "900",
    fontFamily: Platform.OS === "web" ? "'JetBrains Mono', monospace" : "JetBrainsMono-Bold",
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  subtitle: {
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginTop: 1.5,
  },
});

export default MissionWellLogo;
