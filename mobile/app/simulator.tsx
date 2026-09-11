import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useForce } from "../contexts/ForceContext";
import { useLanguage } from "../contexts/LanguageContext";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { Header } from "../components/ui/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { RiskGauge } from "../components/ui/RiskGauge";
import {
  Brain,
  Zap,
  AlertTriangle,
  RotateCcw,
  Sliders,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Activity,
  Flame,
  Moon,
  Clock,
} from "lucide-react-native";

export default function SimulatorScreen() {
  const { colors, isDark } = useTheme();
  const { currentForce, setForce } = useForce();
  const { t, isHi } = useLanguage();
  const router = useRouter();

  // Simulator State
  const [consecutiveDays, setConsecutiveDays] = useState<number>(128);
  const [sleepHours, setSleepHours] = useState<number>(3.8);
  const [selfReportVal, setSelfReportVal] = useState<number>(1); // 1 = Masking (claims fit), 2 = Normal, 3 = Stressed, 4 = Critical
  const [sectorTension, setSectorTension] = useState<"routine" | "elevated" | "active">("active");

  // Dynamic simulation calculations
  const simResults = useMemo(() => {
    const daysStrain = Math.min(consecutiveDays * 0.45, 55);
    const sleepDeficit = Math.max((6.5 - sleepHours) * 8.5, 0);
    const sectorFactor = sectorTension === "active" ? 18 : sectorTension === "elevated" ? 10 : 3;

    const rawScore = Math.round(daysStrain + sleepDeficit + sectorFactor);
    const compositeScore = Math.min(Math.max(rawScore, 18), 98);

    // Anti-masking calculation
    const isMaskingTriggered = compositeScore >= 60 && selfReportVal <= 2;
    const maskingConfidence = isMaskingTriggered
      ? Math.min(72 + (compositeScore - 60) * 0.8, 96)
      : 0;

    let riskBand: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" = "LOW";
    if (compositeScore >= 80) riskBand = "CRITICAL";
    else if (compositeScore >= 65) riskBand = "HIGH";
    else if (compositeScore >= 45) riskBand = "MODERATE";

    return {
      score: compositeScore,
      riskBand,
      isMaskingTriggered,
      maskingConfidence: Math.round(maskingConfidence),
      daysImpact: Math.round((daysStrain / compositeScore) * 100) || 35,
      sleepImpact: Math.round((sleepDeficit / compositeScore) * 100) || 30,
      sectorImpact: Math.round((sectorFactor / compositeScore) * 100) || 20,
    };
  }, [consecutiveDays, sleepHours, selfReportVal, sectorTension]);

  const handlePreset = (preset: "bastar" | "siachen" | "routine") => {
    if (preset === "bastar") {
      setForce("CRPF");
      setConsecutiveDays(145);
      setSleepHours(3.4);
      setSelfReportVal(1); // Claims '100% Fit'
      setSectorTension("active");
    } else if (preset === "siachen") {
      setForce("ARMY");
      setConsecutiveDays(110);
      setSleepHours(4.0);
      setSelfReportVal(1);
      setSectorTension("active");
    } else {
      setForce("CRPF");
      setConsecutiveDays(14);
      setSleepHours(7.2);
      setSelfReportVal(2);
      setSectorTension("routine");
    }
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title={isHi ? "एआई एंटी-मास्किंग सिम्युलेटर" : "AI Anti-Masking Simulator"}
        subtitle={isHi ? "वास्तविक समय तनाव व विचलन अनुमान" : "Live Physiological & Behavioral Stress Divergence"}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Card style={[styles.heroCard, { backgroundColor: `${colors.primary}15`, borderColor: `${colors.primary}30` }]}>
          <View style={styles.heroHeader}>
            <Brain size={22} color={colors.primary} />
            <Text style={[styles.heroTitle, { color: colors.text }]}>
              {isHi ? "एंटी-मास्किंग ड्यूल-इंजन विश्लेषण" : "Anti-Masking Dual-Engine AI"}
            </Text>
          </View>
          <Text style={[styles.heroDesc, { color: colors.textMuted }]}>
            {isHi
              ? "जब जवान अत्यधिक तनाव में होते हुए भी 'सब ठीक है' रिपोर्ट करते हैं, तो मशीन लर्निंग मॉडल उद्देश्यपूर्ण तनाव और व्यक्तिपरक रिपोर्ट में विचलन पकड़ लेता है।"
              : "Detects tactical masking when soldiers under severe objective strain report 'All Normal'. Divergence flags clinical attention before behavioral breakdown."}
          </Text>

          {/* Quick Scenario Presets */}
          <Text style={[styles.presetLabel, { color: colors.text }]}>
            {isHi ? "त्वरित परिदृश्य लोड करें:" : "Load Realistic Defense Scenarios:"}
          </Text>
          <View style={styles.presetRow}>
            <TouchableOpacity
              onPress={() => handlePreset("bastar")}
              style={[styles.presetBtn, { backgroundColor: colors.surface, borderColor: "#EF4444" }]}
            >
              <Flame size={12} color="#EF4444" />
              <Text style={[styles.presetBtnText, { color: colors.text }]}>Bastar (CRPF)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePreset("siachen")}
              style={[styles.presetBtn, { backgroundColor: colors.surface, borderColor: "#3B82F6" }]}
            >
              <Activity size={12} color="#3B82F6" />
              <Text style={[styles.presetBtnText, { color: colors.text }]}>Siachen (Army)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePreset("routine")}
              style={[styles.presetBtn, { backgroundColor: colors.surface, borderColor: "#10B981" }]}
            >
              <CheckCircle2 size={12} color="#10B981" />
              <Text style={[styles.presetBtnText, { color: colors.text }]}>Peace Station</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Live Risk Output & Anti-Masking Divergence Status */}
        <Card style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View>
              <Text style={[styles.resultTitle, { color: colors.text }]}>Predicted Composite Stress</Text>
              <Text style={[styles.resultSub, { color: colors.textMuted }]}>LightGBM v4 Military Inference Engine</Text>
            </View>
            <Badge
              label={simResults.riskBand}
              variant={simResults.riskBand === "CRITICAL" || simResults.riskBand === "HIGH" ? "error" : simResults.riskBand === "MODERATE" ? "warning" : "success"}
            />
          </View>

          <RiskGauge score={simResults.score} maxScore={100} label="AI STRESS INDEX" />

          {/* Anti-Masking Divergence Banner */}
          {simResults.isMaskingTriggered ? (
            <View style={[styles.divergenceAlert, { backgroundColor: "rgba(239, 68, 68, 0.15)", borderColor: "#EF4444" }]}>
              <View style={styles.divergenceAlertHeader}>
                <ShieldAlert size={18} color="#EF4444" />
                <Text style={styles.divergenceAlertTitle}>ANTI-MASKING ANOMALY DETECTED</Text>
              </View>
              <Text style={styles.divergenceAlertDesc}>
                Confidence: <Text style={{ fontWeight: "800" }}>{simResults.maskingConfidence}%</Text>. Subject self-reported 'Fit & Ready', but sustained deployment strain ({consecutiveDays}d) and acute sleep deprivation ({sleepHours}h) reveal silent exhaustion.
              </Text>
            </View>
          ) : (
            <View style={[styles.divergenceAlert, { backgroundColor: "rgba(16, 185, 129, 0.15)", borderColor: "#10B981" }]}>
              <View style={styles.divergenceAlertHeader}>
                <CheckCircle2 size={18} color="#10B981" />
                <Text style={[styles.divergenceAlertTitle, { color: "#10B981" }]}>SUBJECT REPORTS CONSISTENT</Text>
              </View>
              <Text style={[styles.divergenceAlertDesc, { color: colors.textMuted }]}>
                Objective indicators match self-reported wellness rating. No masking divergence flagged.
              </Text>
            </View>
          )}

          {/* SHAP Feature Drivers Breakdown */}
          <Text style={[styles.shapHeading, { color: colors.text }]}>SHAP Decision Drivers:</Text>
          <View style={styles.shapList}>
            <View style={styles.shapItem}>
              <Text style={[styles.shapLabel, { color: colors.textMuted }]}>Consecutive Combat Days</Text>
              <Text style={[styles.shapVal, { color: colors.text }]}>+{simResults.daysImpact}% impact</Text>
            </View>
            <View style={styles.shapItem}>
              <Text style={[styles.shapLabel, { color: colors.textMuted }]}>Sleep Deprivation Deficit</Text>
              <Text style={[styles.shapVal, { color: colors.text }]}>+{simResults.sleepImpact}% impact</Text>
            </View>
            <View style={styles.shapItem}>
              <Text style={[styles.shapLabel, { color: colors.textMuted }]}>Sector Tension Factor</Text>
              <Text style={[styles.shapVal, { color: colors.text }]}>+{simResults.sectorImpact}% impact</Text>
            </View>
          </View>
        </Card>

        {/* Interactive Controls Card */}
        <Card style={styles.controlsCard}>
          <View style={styles.controlSectionHeader}>
            <Sliders size={18} color={colors.primary} />
            <Text style={[styles.controlSectionTitle, { color: colors.text }]}>Adjust Parameters Interactively</Text>
          </View>

          {/* 1. Consecutive Deployment Days */}
          <View style={styles.controlGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.controlLabel, { color: colors.text }]}>Consecutive Field Days</Text>
              <Text style={[styles.controlValueBadge, { color: colors.primary }]}>{consecutiveDays} Days</Text>
            </View>
            <View style={styles.btnRow}>
              <TouchableOpacity onPress={() => setConsecutiveDays(Math.max(10, consecutiveDays - 15))} style={[styles.stepperBtn, { backgroundColor: colors.surface }]}>
                <Text style={[styles.stepperText, { color: colors.text }]}>-15d</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setConsecutiveDays(Math.max(0, consecutiveDays - 5))} style={[styles.stepperBtn, { backgroundColor: colors.surface }]}>
                <Text style={[styles.stepperText, { color: colors.text }]}>-5d</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setConsecutiveDays(Math.min(200, consecutiveDays + 5))} style={[styles.stepperBtn, { backgroundColor: colors.surface }]}>
                <Text style={[styles.stepperText, { color: colors.text }]}>+5d</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setConsecutiveDays(Math.min(200, consecutiveDays + 25))} style={[styles.stepperBtn, { backgroundColor: colors.surface }]}>
                <Text style={[styles.stepperText, { color: colors.text }]}>+25d</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. Sleep Hours */}
          <View style={styles.controlGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.controlLabel, { color: colors.text }]}>Average Daily Sleep</Text>
              <Text style={[styles.controlValueBadge, { color: sleepHours < 4.5 ? "#EF4444" : "#10B981" }]}>
                {sleepHours.toFixed(1)} hrs / night
              </Text>
            </View>
            <View style={styles.btnRow}>
              <TouchableOpacity onPress={() => setSleepHours(Math.max(2.0, sleepHours - 1.0))} style={[styles.stepperBtn, { backgroundColor: colors.surface }]}>
                <Text style={[styles.stepperText, { color: colors.text }]}>-1.0h</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSleepHours(Math.max(2.0, sleepHours - 0.5))} style={[styles.stepperBtn, { backgroundColor: colors.surface }]}>
                <Text style={[styles.stepperText, { color: colors.text }]}>-0.5h</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSleepHours(Math.min(8.5, sleepHours + 0.5))} style={[styles.stepperBtn, { backgroundColor: colors.surface }]}>
                <Text style={[styles.stepperText, { color: colors.text }]}>+0.5h</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSleepHours(Math.min(8.5, sleepHours + 1.0))} style={[styles.stepperBtn, { backgroundColor: colors.surface }]}>
                <Text style={[styles.stepperText, { color: colors.text }]}>+1.0h</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Self-Reported Rating */}
          <View style={styles.controlGroup}>
            <Text style={[styles.controlLabel, { color: colors.text }]}>Soldier Self-Reported Wellness Rating:</Text>
            <View style={styles.choiceGrid}>
              <TouchableOpacity
                onPress={() => setSelfReportVal(1)}
                style={[styles.choiceBtn, { backgroundColor: colors.surface, borderColor: selfReportVal === 1 ? colors.primary : colors.cardBorder }]}
              >
                <Text style={[styles.choiceTitle, { color: selfReportVal === 1 ? colors.primary : colors.text }]}>
                  "Fit & Ready" (Masking)
                </Text>
                <Text style={[styles.choiceSub, { color: colors.textMuted }]}>Claims zero distress</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelfReportVal(2)}
                style={[styles.choiceBtn, { backgroundColor: colors.surface, borderColor: selfReportVal === 2 ? colors.primary : colors.cardBorder }]}
              >
                <Text style={[styles.choiceTitle, { color: selfReportVal === 2 ? colors.primary : colors.text }]}>
                  "Normal Duty"
                </Text>
                <Text style={[styles.choiceSub, { color: colors.textMuted }]}>Standard routine</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelfReportVal(3)}
                style={[styles.choiceBtn, { backgroundColor: colors.surface, borderColor: selfReportVal === 3 ? colors.primary : colors.cardBorder }]}
              >
                <Text style={[styles.choiceTitle, { color: selfReportVal === 3 ? colors.primary : colors.text }]}>
                  "Mild Fatigue"
                </Text>
                <Text style={[styles.choiceSub, { color: colors.textMuted }]}>Acknowledges exhaustion</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelfReportVal(4)}
                style={[styles.choiceBtn, { backgroundColor: colors.surface, borderColor: selfReportVal === 4 ? colors.primary : colors.cardBorder }]}
              >
                <Text style={[styles.choiceTitle, { color: selfReportVal === 4 ? colors.primary : colors.cardBorder }]}>
                  "Severe Strain"
                </Text>
                <Text style={[styles.choiceSub, { color: colors.textMuted }]}>Open distress report</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. Sector Tension */}
          <View style={styles.controlGroup}>
            <Text style={[styles.controlLabel, { color: colors.text }]}>Operational Sector Environment:</Text>
            <View style={styles.sectorRow}>
              <TouchableOpacity
                onPress={() => setSectorTension("routine")}
                style={[styles.sectorBtn, { backgroundColor: colors.surface, borderColor: sectorTension === "routine" ? "#10B981" : colors.cardBorder }]}
              >
                <Text style={[styles.sectorText, { color: sectorTension === "routine" ? "#10B981" : colors.text }]}>Peace Base</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSectorTension("elevated")}
                style={[styles.sectorBtn, { backgroundColor: colors.surface, borderColor: sectorTension === "elevated" ? "#F59E0B" : colors.cardBorder }]}
              >
                <Text style={[styles.sectorText, { color: sectorTension === "elevated" ? "#F59E0B" : colors.text }]}>Border Watch</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSectorTension("active")}
                style={[styles.sectorBtn, { backgroundColor: colors.surface, borderColor: sectorTension === "active" ? "#EF4444" : colors.cardBorder }]}
              >
                <Text style={[styles.sectorText, { color: sectorTension === "active" ? "#EF4444" : colors.text }]}>Active Conflict</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Action button to test real 6-step assessment */}
        <View style={styles.bottomActions}>
          <Button
            title={isHi ? "वास्तविक 6-चरणीय जांच लें" : "Take Live 6-Step Wellness Check"}
            onPress={() => router.push("/assessment")}
            variant="primary"
            icon={<ArrowRight size={16} color="#FFFFFF" />}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  heroCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  heroDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  resultCard: {
    padding: 16,
    borderRadius: 14,
    gap: 14,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  resultSub: {
    fontSize: 11,
    marginTop: 2,
  },
  divergenceAlert: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  divergenceAlertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  divergenceAlertTitle: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
    color: "#EF4444",
  },
  divergenceAlertDesc: {
    fontSize: 11,
    lineHeight: 16,
    color: "#EF4444",
  },
  shapHeading: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
  },
  shapList: {
    gap: 6,
  },
  shapItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150, 150, 150, 0.1)",
  },
  shapLabel: {
    fontSize: 12,
  },
  shapVal: {
    fontSize: 12,
    fontWeight: "700",
  },
  controlsCard: {
    padding: 16,
    borderRadius: 14,
    gap: 16,
  },
  controlSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  controlSectionTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  controlGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  controlValueBadge: {
    fontSize: 12,
    fontWeight: "800",
  },
  btnRow: {
    flexDirection: "row",
    gap: 8,
  },
  stepperBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  stepperText: {
    fontSize: 12,
    fontWeight: "700",
  },
  choiceGrid: {
    gap: 8,
  },
  choiceBtn: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
  },
  choiceTitle: {
    fontSize: 12,
    fontWeight: "700",
  },
  choiceSub: {
    fontSize: 10,
  },
  sectorRow: {
    flexDirection: "row",
    gap: 8,
  },
  sectorBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  sectorText: {
    fontSize: 11,
    fontWeight: "700",
  },
  bottomActions: {
    marginTop: 8,
  },
});
