import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
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

const sizeMap = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
};

export const MissionWellIcon: React.FC<{ size?: "xs" | "sm" | "md" | "lg" | "xl" }> = ({
  size = "md",
}) => {
  const dim = sizeMap[size];

  return (
    <View style={{ width: dim, height: dim }}>
      <Svg width={dim} height={dim} viewBox="0 0 120 120" fill="none">
        <Defs>
          <RadialGradient id="psiBg" cx="50%" cy="50%" r="65%">
            <Stop offset="0%" stopColor="#1E293B" />
            <Stop offset="70%" stopColor="#0F172A" />
            <Stop offset="100%" stopColor="#060913" />
          </RadialGradient>

          <LinearGradient id="psiShield" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#34D399" />
            <Stop offset="50%" stopColor="#059669" />
            <Stop offset="100%" stopColor="#0284C7" />
          </LinearGradient>

          <LinearGradient id="psiTricolor" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FF9933" />
            <Stop offset="50%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#138808" />
          </LinearGradient>

          <LinearGradient id="psiBlade" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#334155" />
            <Stop offset="100%" stopColor="#1E293B" />
          </LinearGradient>

          <LinearGradient id="psiPulse" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#10B981" />
            <Stop offset="50%" stopColor="#38BDF8" />
            <Stop offset="100%" stopColor="#10B981" />
          </LinearGradient>
        </Defs>

        {/* Outer Cyber Shield Armor */}
        <Path
          d="M60 6 L104 28 L104 78 L60 114 L16 78 L16 28 Z"
          fill="url(#psiBg)"
          stroke="url(#psiShield)"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {/* Indian Tricolor Crest Notch */}
        <Path
          d="M48 10 L72 10"
          stroke="url(#psiTricolor)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Tactical Sub-grid */}
        <Path
          d="M26 34 L94 34 M26 86 L94 86"
          stroke="#334155"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity={0.4}
        />

        {/* Blade 1: Web / Edge Tier */}
        <Rect
          x="30"
          y="31"
          width="60"
          height="13"
          rx="3.5"
          fill="url(#psiBlade)"
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

        {/* Blade 2: Core Express REST API */}
        <Rect
          x="30"
          y="47"
          width="60"
          height="13"
          rx="3.5"
          fill="url(#psiBlade)"
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
          fill="url(#psiBlade)"
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
          stroke="url(#psiPulse)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Tactical Defense Node Core */}
        <Circle cx="60" cy="100" r="3.5" fill="#10B981" />
        <Circle cx="60" cy="100" r="1.5" fill="#FFFFFF" />
      </Svg>
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

  const titleSize = size === "xl" ? 22 : size === "lg" ? 18 : size === "sm" ? 14 : size === "xs" ? 12 : 16;
  const subSize = size === "xl" ? 12 : size === "lg" ? 10 : 9;

  return (
    <View style={[styles.container, style]}>
      <MissionWellIcon size={size} />

      {showText && (
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text, fontSize: titleSize }]}>
              MissionWell{" "}
              <Text style={[styles.aiSuffix, { color: "#3B82F6", fontSize: titleSize - 2 }]}>AI</Text>
            </Text>

            {showForceBadge && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: `${currentForce.primaryColor}22`, borderColor: `${currentForce.primaryColor}50` },
                ]}
              >
                <Text style={[styles.badgeText, { color: currentForce.primaryColor }]}>
                  {currentForce.id}
                </Text>
              </View>
            )}
          </View>

          {showSubtitle && (
            <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: subSize }]}>
              {isHi ? "सशस्त्र बल कल्याण खुफिया" : "Welfare Intelligence • Sentinel of Resilience"}
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
    gap: 10,
  },
  textContainer: {
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  aiSuffix: {
    fontWeight: "900",
    fontFamily: "monospace",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginTop: 1,
  },
});

export default MissionWellLogo;
