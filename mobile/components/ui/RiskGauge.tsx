import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface RiskGaugeProps {
  score: number; // 0 to 100
  category?: string;
  label?: string;
  maxScore?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  category,
  label,
  maxScore = 100,
}) => {
  const { colors } = useTheme();

  const getColor = () => {
    if (score >= 70) return colors.danger;
    if (score >= 45) return colors.warning;
    return colors.success;
  };

  const activeColor = getColor();
  const displayCategory = category || (score >= 70 ? "HIGH STRESS" : score >= 45 ? "MODERATE FATIGUE" : "OPTIMAL READINESS");

  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <View style={styles.scoreBox}>
          <Text style={[styles.scoreValue, { color: activeColor }]}>{score}</Text>
          <Text style={[styles.scoreMax, { color: colors.textMuted }]}>/{maxScore}</Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: `${activeColor}20`, borderColor: `${activeColor}40` }]}>
          <Text style={[styles.categoryText, { color: activeColor }]}>{(label || displayCategory).toUpperCase()}</Text>
        </View>
      </View>

      {/* Segmented bar */}
      <View style={[styles.track, { backgroundColor: colors.surface }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.min(100, Math.max(5, score))}%`,
              backgroundColor: activeColor,
            },
          ]}
        />
      </View>

      <View style={styles.labelsRow}>
        <Text style={[styles.labelText, { color: colors.success }]}>Optimal (0-30)</Text>
        <Text style={[styles.labelText, { color: colors.warning }]}>Fatigue (31-69)</Text>
        <Text style={[styles.labelText, { color: colors.danger }]}>Critical (70+)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  scoreBox: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1,
  },
  scoreMax: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 3,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 6,
  },
  fill: {
    height: "100%",
    borderRadius: 5,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelText: {
    fontSize: 10,
    fontWeight: "600",
  },
});
