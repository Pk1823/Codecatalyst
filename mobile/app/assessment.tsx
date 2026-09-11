import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { Header } from "../components/ui/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { RiskGauge } from "../components/ui/RiskGauge";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import {
  WELLNESS_SURVEY_QUESTIONS,
  WellnessService,
} from "../services/wellness";
import {
  WellnessAssessmentInput,
  WellnessAssessmentResult,
} from "../types";
import {
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Zap,
} from "lucide-react-native";

export default function AssessmentScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    consecutiveFieldDays: "31-60",
    dutyHours5d: "46-60 hours",
    nightShifts5d: "2",
    sleepHrs5dAvg: "5-6 hours",
    selfReportedEnergy: "3",
    selfReportedStress: "5-6",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<WellnessAssessmentResult | null>(null);

  // Anti-masking latency timer tracking
  const startTimeRef = useRef<number>(Date.now());

  const currentQuestion = WELLNESS_SURVEY_QUESTIONS[currentIndex];

  const handleSelectOption = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentIndex < WELLNESS_SURVEY_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const latencySec = Math.round((Date.now() - startTimeRef.current) / 1000);

    try {
      const soldierId = user?.personnelId || (user?.id?.startsWith("P-") ? user.id : "P-1024");
      const res = await WellnessService.submitAssessment(
        answers as unknown as WellnessAssessmentInput,
        soldierId,
        latencySec
      );
      setResult(res);
    } catch {
      Alert.alert("Error", "Could not complete assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // RESULT SCREEN AFTER SUBMISSION
  // -------------------------------------------------------------
  if (result) {
    return (
      <ScreenContainer>
        <Header title="Assessment Result" subtitle="LightGBM Predictive Wellness Analysis" />

        <Card variant="elevated" style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={[styles.successIcon, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
              <CheckCircle2 size={24} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.resultTitle, { color: colors.text }]}>Evaluation Recorded</Text>
              <Text style={[styles.resultRef, { color: colors.textMuted }]}>
                Ref: {result.id} • {result.date}
              </Text>
              <Text style={{ fontSize: 11, color: colors.success, marginTop: 2, fontWeight: "600" }}>
                ✓ Synced Live with Welfare Officer Command Center
              </Text>
            </View>
          </View>

          {result.isMaskingDetected && (
            <View style={[styles.maskingAlert, { backgroundColor: "rgba(245, 158, 11, 0.15)", borderColor: colors.warning }]}>
              <Zap size={16} color={colors.warning} />
              <Text style={[styles.maskingText, { color: colors.warning }]}>
                Anti-Masking Telemetry: Fast survey response flagged. Model calibrated with duty telemetry.
              </Text>
            </View>
          )}

          {/* Calibrated Risk Gauge */}
          <RiskGauge score={result.riskScore} category={result.riskCategory} />

          {/* Breakdown Alert if High */}
          {result.predictedDaysToBreakdown && (
            <View style={[styles.breakdownBox, { backgroundColor: "rgba(239, 68, 68, 0.12)", borderColor: colors.danger }]}>
              <Text style={[styles.breakdownTitle, { color: colors.danger }]}>
                Fatigue Escalation Window: ~{result.predictedDaysToBreakdown} Days
              </Text>
              <Text style={[styles.breakdownDesc, { color: colors.text }]}>
                Early indicators suggest cognitive exhaustion if sleep debt is not cleared in upcoming rotation.
              </Text>
            </View>
          )}

          {/* SHAP Explainability Drivers */}
          <View style={styles.shapSection}>
            <View style={styles.shapHeader}>
              <Sparkles size={16} color={colors.primary} />
              <Text style={[styles.shapTitle, { color: colors.text }]}>
                Key Stress Drivers (SHAP AI Explainability)
              </Text>
            </View>

            {result.shapDrivers.map((driver, idx) => (
              <View
                key={idx}
                style={[
                  styles.driverCard,
                  { backgroundColor: colors.surface, borderColor: colors.cardBorder },
                ]}
              >
                <View style={styles.driverHeader}>
                  <Text style={[styles.driverName, { color: colors.text }]}>{driver.feature}</Text>
                  <Badge
                    label={driver.impact.toUpperCase()}
                    variant={driver.impact === "high" ? "danger" : "warning"}
                    size="sm"
                  />
                </View>
                <Text style={[styles.driverDesc, { color: colors.textMuted }]}>
                  {driver.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Recommendations */}
          <View style={styles.recommendationsBox}>
            <Text style={[styles.recTitle, { color: colors.text }]}>Actionable Support Recommendations</Text>
            {result.recommendations.map((rec, i) => (
              <View key={i} style={styles.recItem}>
                <Text style={[styles.recBullet, { color: colors.primary }]}>•</Text>
                <Text style={[styles.recText, { color: colors.textMuted }]}>{rec}</Text>
              </View>
            ))}
          </View>

          <Button
            title="Return to Personnel Hub"
            onPress={() => router.back()}
            variant="secondary"
            icon={<RotateCcw size={16} color={colors.text} />}
            style={styles.returnBtn}
          />
        </Card>
      </ScreenContainer>
    );
  }

  // -------------------------------------------------------------
  // QUESTIONNAIRE CAROUSEL
  // -------------------------------------------------------------
  return (
    <ScreenContainer>
      <Header
        title="Voluntary Wellness Check"
        subtitle={`Step ${currentIndex + 1} of ${WELLNESS_SURVEY_QUESTIONS.length}`}
      />

      {/* Progress Bar */}
      <View style={[styles.progressBarTrack, { backgroundColor: colors.surface }]}>
        <View
          style={[
            styles.progressBarFill,
            {
              backgroundColor: colors.primary,
              width: `${((currentIndex + 1) / WELLNESS_SURVEY_QUESTIONS.length) * 100}%`,
            },
          ]}
        />
      </View>

      <Card variant="elevated" style={styles.questionCard}>
        <Badge
          label={`QUESTION ${currentIndex + 1}`}
          variant="info"
          size="sm"
          style={styles.stepBadge}
        />
        <Text style={[styles.questionText, { color: colors.text }]}>
          {currentQuestion.question}
        </Text>
        <Text style={[styles.hindiQuestionText, { color: colors.textMuted }]}>
          {currentQuestion.hindiQuestion}
        </Text>

        {/* Options List */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((opt) => {
            const isSelected = answers[currentQuestion.id] === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                activeOpacity={0.7}
                onPress={() => handleSelectOption(opt.value)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isSelected ? "rgba(59, 130, 246, 0.15)" : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.radioCircle,
                    { borderColor: isSelected ? colors.primary : colors.textMuted },
                  ]}
                >
                  {isSelected && (
                    <View style={[styles.radioFill, { backgroundColor: colors.primary }]} />
                  )}
                </View>
                <Text
                  style={[
                    styles.optionLabel,
                    {
                      color: isSelected ? colors.primary : colors.text,
                      fontWeight: isSelected ? "700" : "500",
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navRow}>
          <Button
            title="Back"
            variant="secondary"
            disabled={currentIndex === 0}
            onPress={handlePrev}
            icon={<ChevronLeft size={16} color={colors.text} />}
            style={styles.navBtn}
          />

          {currentIndex < WELLNESS_SURVEY_QUESTIONS.length - 1 ? (
            <Button
              title="Next"
              onPress={handleNext}
              icon={<ChevronRight size={16} color="#FFFFFF" />}
              style={styles.navBtn}
            />
          ) : (
            <Button
              title="Submit Evaluation"
              onPress={handleSubmit}
              loading={isSubmitting}
              icon={<CheckCircle2 size={16} color="#FFFFFF" />}
              style={styles.navBtn}
            />
          )}
        </View>
      </Card>

      {/* Non-punitive Assurance */}
      <View style={styles.assuranceBox}>
        <ShieldCheck size={16} color={colors.accent} />
        <Text style={[styles.assuranceText, { color: colors.textMuted }]}>
          Protected by Ministry of Home Affairs Non-Punitive Doctrine. Individual responses are strictly blocked from ACR/APAR appraisal dossiers.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  questionCard: {
    padding: 20,
    marginBottom: 16,
  },
  stepBadge: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 24,
    marginBottom: 4,
  },
  hindiQuestionText: {
    fontSize: 13,
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 24,
    gap: 10,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionLabel: {
    fontSize: 13,
    flex: 1,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  navBtn: {
    flex: 1,
  },
  assuranceBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 8,
  },
  assuranceText: {
    fontSize: 11,
    lineHeight: 15,
    flex: 1,
  },
  resultCard: {
    padding: 20,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  successIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  resultRef: {
    fontSize: 12,
    marginTop: 2,
  },
  maskingAlert: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  maskingText: {
    fontSize: 11,
    fontWeight: "600",
    flex: 1,
  },
  breakdownBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 12,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 4,
  },
  breakdownDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  shapSection: {
    marginTop: 16,
  },
  shapHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  shapTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  driverCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  driverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  driverName: {
    fontSize: 13,
    fontWeight: "700",
  },
  driverDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  recommendationsBox: {
    marginTop: 16,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },
  recItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  recBullet: {
    fontSize: 16,
    marginRight: 6,
    lineHeight: 18,
  },
  recText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
  returnBtn: {
    marginTop: 20,
  },
});
