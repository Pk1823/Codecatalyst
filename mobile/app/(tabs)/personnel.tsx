import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { Header } from "../../components/ui/Header";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { HelplineModal } from "../../components/ui/HelplineModal";
import { TacticalOfflineBanner } from "../../components/ui/TacticalOfflineBanner";
import { RiskGauge } from "../../components/ui/RiskGauge";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { WellnessService } from "../../services/wellness";
import { BuddyCheckStatus, WellnessAssessmentResult } from "../../types";
import {
  HeartPulse,
  Users2,
  CalendarClock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  PhoneCall,
  FileText,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Zap,
  RotateCcw,
} from "lucide-react-native";

export default function PersonnelHomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [latestAssessment, setLatestAssessment] = useState<WellnessAssessmentResult | null>(null);
  const [buddyStatus, setBuddyStatus] = useState<BuddyCheckStatus | null>(null);
  const [buddyCheckDone, setBuddyCheckDone] = useState(false);
  const [darbarRequested, setDarbarRequested] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [trendRange, setTrendRange] = useState<"7D" | "30D">("7D");

  useEffect(() => {
    WellnessService.getBuddyStatus().then(setBuddyStatus);

    const loadAssessment = () => {
      const soldierId = user?.personnelId || (user?.id?.startsWith("P-") ? user.id : "P-1024");
      WellnessService.getLatestAssessment(soldierId).then((res) => {
        if (res) {
          setLatestAssessment(res);
        }
      });
    };

    loadAssessment();

    const unsubscribe = WellnessService.subscribeAssessment((newAssessment) => {
      setLatestAssessment(newAssessment);
    });

    const handleWebEvent = (e: any) => {
      if (e?.detail) {
        setLatestAssessment(e.detail);
      } else {
        loadAssessment();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("missionwell_assessment_updated", handleWebEvent);
      window.addEventListener("focus", loadAssessment);
    }

    return () => {
      unsubscribe();
      if (typeof window !== "undefined") {
        window.removeEventListener("missionwell_assessment_updated", handleWebEvent);
        window.removeEventListener("focus", loadAssessment);
      }
    };
  }, [user]);

  const readinessScore = latestAssessment
    ? Math.max(10, 100 - latestAssessment.riskScore)
    : 88;

  const readinessColor =
    !latestAssessment || latestAssessment.riskCategory === "Optimal"
      ? colors.success
      : latestAssessment.riskCategory === "Critical Breakdown Risk"
      ? colors.danger
      : colors.warning;

  const readinessVariant: "success" | "warning" | "danger" | "info" =
    !latestAssessment || latestAssessment.riskCategory === "Optimal"
      ? "success"
      : latestAssessment.riskCategory === "Critical Breakdown Risk"
      ? "danger"
      : "warning";

  const sleepCycleDisplay = latestAssessment?.sleepHrs5dAvg
    ? `${latestAssessment.sleepHrs5dAvg}`
    : "7.2h (Good)";

  const patrolLoadDisplay = latestAssessment?.dutyHours5d
    ? `${latestAssessment.dutyHours5d}`
    : "Normal Shift";

  const cognitiveLoadDisplay = latestAssessment?.riskCategory
    ? latestAssessment.riskCategory
    : "Low Risk";

  const handleBuddyPing = async (status: "OK" | "NEEDS_REST") => {
    await WellnessService.submitBuddyCheck(status);
    setBuddyCheckDone(true);
    Alert.alert(
      "Buddy-Pair Check Logged",
      status === "OK"
        ? "Your peer status 'Safe & Ready' has been confidentially logged."
        : "Rest alert logged. Unit welfare officer notified for buddy rotation."
    );
  };

  const handleDarbarRequest = async () => {
    await WellnessService.submitDarbarRequest({
      targetOfficer: "Commanding Officer (CO)",
      reasonCategory: "Leave Regularization",
      notes: "Requesting routine personal audience for pending administrative regularisation.",
    });
    setDarbarRequested(true);
    Alert.alert(
      "Darbar Audience Requested",
      "Your confidential request has been queued directly for the Battalion CO."
    );
  };

  return (
    <ScreenContainer>
      <Header
        title="Soldier Self-Assessment Hub"
        subtitle={`Welcome, ${user?.name || "Jawan"} • ${user?.rank || "Constable"}`}
      />

      {/* Army Forward Post / Offline Tactical Status Banner */}
      <TacticalOfflineBanner />

      {/* Daily Readiness & Assessment CTA (Tactical HUD) */}
      <Card variant="glass" style={styles.heroCard}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.heroIconBox, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
            <HeartPulse size={24} color="#3B82F6" />
          </View>
          <View style={styles.heroTagGroup}>
            <Badge
              label={latestAssessment ? latestAssessment.riskCategory.toUpperCase() : "VOLUNTARY & CONFIDENTIAL"}
              variant={readinessVariant}
              size="sm"
            />
            <View style={styles.hudLiveChip}>
              <View style={[styles.hudLiveDot, { backgroundColor: readinessColor }]} />
              <Text style={[styles.hudLiveText, { color: readinessColor }]}>
                {latestAssessment ? "EVALUATION ACTIVE" : "ACTIVE SHIELD"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.heroTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
          {latestAssessment ? "Operational Readiness Status" : "Daily Operational Self-Assessment"}
        </Text>
        <Text style={[styles.heroDesc, { color: colors.textMuted }]}>
          {latestAssessment
            ? `Latest confidential evaluation synced on ${latestAssessment.date} (Ref: ${latestAssessment.id}). Non-punitive biometric telemetry.`
            : "Confidential AI evaluates operational stress, patrol fatigue & sleep debt without middle-command stigma. Takes only 60 seconds."}
        </Text>

        {/* Tactical Readiness Metric Bar */}
        <View style={[styles.hudMetricContainer, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <View style={styles.hudScoreCol}>
            <Text style={[styles.hudScoreLabel, { color: colors.textMuted }]}>READINESS</Text>
            <View style={styles.hudScoreRow}>
              <Text style={[styles.hudScoreNumber, { color: readinessColor }]}>
                {readinessScore}
              </Text>
              <Text style={[styles.hudScoreUnit, { color: colors.textMuted }]}>%</Text>
            </View>
          </View>

          <View style={styles.hudMetricsDivider} />

          <View style={styles.hudMiniStatsCol}>
            <View style={styles.hudMiniStatRow}>
              <Text style={[styles.hudMiniStatKey, { color: colors.textMuted }]}>Sleep Cycle</Text>
              <Text style={[styles.hudMiniStatVal, { color: colors.text }]}>{sleepCycleDisplay}</Text>
            </View>
            <View style={styles.hudMiniStatRow}>
              <Text style={[styles.hudMiniStatKey, { color: colors.textMuted }]}>Patrol Load</Text>
              <Text style={[styles.hudMiniStatVal, { color: colors.primary }]}>{patrolLoadDisplay}</Text>
            </View>
            <View style={styles.hudMiniStatRow}>
              <Text style={[styles.hudMiniStatKey, { color: colors.textMuted }]}>Cognitive Load</Text>
              <Text style={[styles.hudMiniStatVal, { color: readinessColor }]}>{cognitiveLoadDisplay}</Text>
            </View>
          </View>
        </View>

        <Button
          title={latestAssessment ? "Retake Assessment (6 Steps) →" : "Start Assessment (6 Steps) →"}
          onPress={() => router.push("/assessment")}
          icon={<ArrowRight size={16} color="#FFFFFF" />}
          style={styles.heroActionBtn}
        />
      </Card>

      {/* Latest Predictive AI Assessment & Explainability Card */}
      {latestAssessment && (
        <Card variant="elevated" style={styles.evalCard}>
          <View style={styles.evalHeader}>
            <View style={[styles.evalIconBox, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
              <CheckCircle2 size={22} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={[styles.evalTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                  Latest AI Evaluation
                </Text>
                <Badge
                  label={latestAssessment.isOffline ? "LOCAL AI" : "SYNCED LIVE"}
                  variant={latestAssessment.isOffline ? "warning" : "success"}
                  size="sm"
                />
              </View>
              <Text style={[styles.evalRef, { color: colors.textMuted }]}>
                Ref: {latestAssessment.id} • {latestAssessment.date}
              </Text>
            </View>
          </View>

          {latestAssessment.isMaskingDetected && (
            <View style={[styles.maskingAlert, { backgroundColor: "rgba(245, 158, 11, 0.15)", borderColor: colors.warning }]}>
              <Zap size={16} color={colors.warning} />
              <Text style={[styles.maskingText, { color: colors.warning }]}>
                Anti-Masking Telemetry: Rapid survey response flagged. Model calibrated with continuous shift telemetry.
              </Text>
            </View>
          )}

          {/* Calibrated Risk Gauge */}
          <RiskGauge score={latestAssessment.riskScore} category={latestAssessment.riskCategory} />

          {/* Fatigue Breakdown Escalation Window */}
          {latestAssessment.predictedDaysToBreakdown && (
            <View style={[styles.breakdownBox, { backgroundColor: "rgba(239, 68, 68, 0.12)", borderColor: colors.danger }]}>
              <Text style={[styles.breakdownTitle, { color: colors.danger }]}>
                Fatigue Escalation Window: ~{latestAssessment.predictedDaysToBreakdown} Days
              </Text>
              <Text style={[styles.breakdownDesc, { color: colors.text }]}>
                Early indicators suggest cognitive exhaustion if sleep debt is not cleared in upcoming rotation.
              </Text>
            </View>
          )}

          {/* Key Stress Drivers (SHAP AI Explainability) */}
          {latestAssessment.shapDrivers && latestAssessment.shapDrivers.length > 0 && (
            <View style={styles.shapSection}>
              <View style={styles.shapHeader}>
                <Sparkles size={16} color={colors.primary} />
                <Text style={[styles.shapTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                  Key Stress Drivers (SHAP AI Explainability)
                </Text>
              </View>

              {latestAssessment.shapDrivers.map((driver, idx) => (
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
          )}

          {/* Actionable Support Recommendations */}
          {latestAssessment.recommendations && latestAssessment.recommendations.length > 0 && (
            <View style={styles.recommendationsBox}>
              <Text style={[styles.recTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                Actionable Support Recommendations
              </Text>
              {latestAssessment.recommendations.map((rec, i) => (
                <View key={i} style={styles.recItem}>
                  <Text style={[styles.recBullet, { color: colors.primary }]}>•</Text>
                  <Text style={[styles.recText, { color: colors.textMuted }]}>{rec}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>
      )}

      {/* Historical Wellness Trends & Visual Sparklines */}
      <Card variant="elevated" style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <TrendingUp size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
              Self-Assessment & Fatigue Trends
            </Text>
          </View>
          <View style={styles.trendPillRow}>
            {(["7D", "30D"] as const).map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setTrendRange(r)}
                style={[
                  styles.trendPill,
                  {
                    backgroundColor: trendRange === r ? colors.primary : colors.surface,
                    borderColor: trendRange === r ? colors.primary : colors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.trendPillText,
                    {
                      color: trendRange === r ? "#FFFFFF" : colors.textMuted,
                      fontFamily: "GoogleSans-Bold",
                    },
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 7-Day Visual Telemetry Bars */}
        <View style={[styles.sparklineContainer, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          {[
            { day: "Mon", val: 68, color: "#10B981" },
            { day: "Tue", val: 74, color: "#10B981" },
            { day: "Wed", val: 82, color: "#3B82F6" },
            { day: "Thu", val: 65, color: "#F59E0B" },
            { day: "Fri", val: 78, color: "#10B981" },
            { day: "Sat", val: 88, color: "#10B981" },
            { day: "Today", val: readinessScore, color: readinessColor, active: true },
          ].map((bar, i) => (
            <View key={i} style={styles.sparkCol}>
              <View style={styles.sparkBarTrack}>
                <View
                  style={[
                    styles.sparkBarFill,
                    {
                      height: `${bar.val}%`,
                      backgroundColor: bar.color,
                      opacity: bar.active ? 1 : 0.75,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.sparkDayLabel, { color: bar.active ? colors.primary : colors.textMuted }]}>
                {bar.day}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.trendStatsGrid, { backgroundColor: colors.surface }]}>
          <View style={styles.trendStat}>
            <Text style={[styles.trendStatVal, { color: readinessColor, fontFamily: "GoogleSans-Bold" }]}>
              {readinessScore}%
            </Text>
            <Text style={[styles.trendStatLbl, { color: colors.textMuted }]}>Avg Readiness</Text>
          </View>
          <View style={styles.trendStat}>
            <Text style={[styles.trendStatVal, { color: colors.primary, fontFamily: "GoogleSans-Bold" }]}>
              {sleepCycleDisplay.split(" ")[0]}
            </Text>
            <Text style={[styles.trendStatLbl, { color: colors.textMuted }]}>Night Sleep</Text>
          </View>
          <View style={styles.trendStat}>
            <Text style={[styles.trendStatVal, { color: latestAssessment ? readinessColor : colors.warning, fontFamily: "GoogleSans-Bold" }]}>
              {latestAssessment ? `${latestAssessment.riskScore}/100` : "22%"}
            </Text>
            <Text style={[styles.trendStatLbl, { color: colors.textMuted }]}>Fatigue Risk</Text>
          </View>
        </View>
      </Card>

      {/* Buddy-Pair System (बडी-पेयर) */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Users2 size={18} color="#10B981" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Buddy-Pair Watch (बडी-पेयर)</Text>
          </View>
          <Badge label="MUTUAL CARE" variant="success" size="sm" />
        </View>

        <View style={[styles.buddyInfoBox, { backgroundColor: colors.surface }]}>
          <View>
            <Text style={[styles.buddyName, { color: colors.text }]}>
              {buddyStatus?.buddyRank} {buddyStatus?.buddyName}
            </Text>
            <Text style={[styles.buddyMeta, { color: colors.textMuted }]}>
              {buddyStatus?.buddyServiceId} • Checked: {buddyStatus?.lastCheckTime}
            </Text>
          </View>
          <Badge label="LINKED" variant="neutral" size="sm" />
        </View>

        <Text style={[styles.promptText, { color: colors.textMuted }]}>
          How is your partner coping with current tactical deployment?
        </Text>

        <View style={styles.buddyButtonsRow}>
          <TouchableOpacity
            style={[
              styles.buddyBtn,
              {
                backgroundColor: buddyCheckDone ? "rgba(16, 185, 129, 0.2)" : colors.surface,
                borderColor: buddyCheckDone ? colors.success : colors.cardBorder,
              },
            ]}
            onPress={() => handleBuddyPing("OK")}
          >
            <CheckCircle2 size={16} color={colors.success} />
            <Text style={[styles.buddyBtnText, { color: colors.text }]}>Safe & Ready (सुरक्षित)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buddyBtn,
              { backgroundColor: colors.surface, borderColor: colors.cardBorder },
            ]}
            onPress={() => handleBuddyPing("NEEDS_REST")}
          >
            <AlertTriangle size={16} color={colors.warning} />
            <Text style={[styles.buddyBtnText, { color: colors.text }]}>Needs Rest (विश्राम)</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Confidential CO/SM Darbar Request */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <CalendarClock size={18} color="#F59E0B" />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Confidential Darbar Audience</Text>
          </View>
          <Badge label="DIRECT ACCESS" variant="warning" size="sm" />
        </View>

        <Text style={[styles.sectionDesc, { color: colors.textMuted }]}>
          Request a direct audience with the Battalion Commanding Officer or Subedar Major for personal or family issues without middle administrative filtering.
        </Text>

        <Button
          title={darbarRequested ? "Darbar Request Queued (Pending)" : "Request CO Darbar Slot"}
          variant={darbarRequested ? "secondary" : "outline"}
          disabled={darbarRequested}
          onPress={handleDarbarRequest}
          icon={<Send size={15} color={darbarRequested ? colors.textMuted : colors.primary} />}
          style={styles.darbarBtn}
        />
      </Card>

      {/* Quick Access Utility Actions: Helplines, Reports & Privacy */}
      <View style={styles.quickAccessRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsHelplineOpen(true)}
          style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
        >
          <View style={[styles.quickIconBox, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
            <PhoneCall size={18} color={colors.danger} />
          </View>
          <Text style={[styles.quickTitle, { color: colors.text }]}>24/7 Helplines</Text>
          <Text style={[styles.quickSub, { color: colors.textMuted }]}>CRPF 14411 & Army</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/assessment")}
          style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
        >
          <View style={[styles.quickIconBox, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
            <FileText size={18} color={colors.primary} />
          </View>
          <Text style={[styles.quickTitle, { color: colors.text }]}>Self-Assessment</Text>
          <Text style={[styles.quickSub, { color: colors.textMuted }]}>Start Survey</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/privacy")}
          style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
        >
          <View style={[styles.quickIconBox, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
            <ShieldCheck size={18} color={colors.accent} />
          </View>
          <Text style={[styles.quickTitle, { color: colors.text }]}>DPDP Shield</Text>
          <Text style={[styles.quickSub, { color: colors.textMuted }]}>Consent & Audit</Text>
        </TouchableOpacity>
      </View>

      {/* 24/7 Helpline Modal */}
      <HelplineModal isOpen={isHelplineOpen} onClose={() => setIsHelplineOpen(false)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    padding: 18,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  heroIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTagGroup: {
    alignItems: "flex-end",
    gap: 4,
  },
  hudLiveChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.35)",
  },
  hudLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#10B981",
  },
  hudLiveText: {
    fontSize: 8.5,
    fontWeight: "900",
    color: "#10B981",
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  heroDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  hudMetricContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  hudScoreCol: {
    alignItems: "center",
    paddingRight: 14,
    minWidth: 72,
  },
  hudScoreLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  hudScoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  hudScoreNumber: {
    fontSize: 30,
    fontWeight: "900",
    fontFamily: "GoogleSans-Bold",
    letterSpacing: -1,
  },
  hudScoreUnit: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 2,
  },
  hudMetricsDivider: {
    width: 1,
    height: 44,
    backgroundColor: "rgba(148, 163, 184, 0.2)",
    marginRight: 14,
  },
  hudMiniStatsCol: {
    flex: 1,
    gap: 4,
  },
  hudMiniStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hudMiniStatKey: {
    fontSize: 11,
    fontWeight: "600",
  },
  hudMiniStatVal: {
    fontSize: 11,
    fontWeight: "800",
  },
  sparklineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 90,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 8,
  },
  sparkCol: {
    alignItems: "center",
    flex: 1,
  },
  sparkBarTrack: {
    width: 14,
    height: 52,
    backgroundColor: "rgba(148, 163, 184, 0.12)",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  sparkBarFill: {
    width: "100%",
    borderRadius: 4,
  },
  sparkDayLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    marginTop: 4,
  },
  heroActionBtn: {
    width: "100%",
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  sectionDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    marginBottom: 14,
  },
  trendPillRow: {
    flexDirection: "row",
    gap: 6,
  },
  trendPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  trendPillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  trendStatsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  trendStat: {
    alignItems: "center",
  },
  trendStatVal: {
    fontSize: 18,
    fontWeight: "900",
  },
  trendStatLbl: {
    fontSize: 10,
    marginTop: 2,
  },
  buddyInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  buddyName: {
    fontSize: 13,
    fontWeight: "700",
  },
  buddyMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  promptText: {
    fontSize: 12,
    marginBottom: 10,
  },
  buddyButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  buddyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  buddyBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  darbarBtn: {
    marginTop: 4,
  },
  quickAccessRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  quickCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  quickIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickTitle: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  quickSub: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 2,
  },
  evalCard: {
    padding: 16,
    marginBottom: 16,
  },
  evalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  evalIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  evalTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  evalRef: {
    fontSize: 11,
    marginTop: 1,
  },
  maskingAlert: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 10,
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
    marginVertical: 10,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 3,
  },
  breakdownDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  shapSection: {
    marginTop: 14,
  },
  shapHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  shapTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  driverCard: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  driverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  driverName: {
    fontSize: 12.5,
    fontWeight: "700",
  },
  driverDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  recommendationsBox: {
    marginTop: 14,
  },
  recTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  recItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  recBullet: {
    fontSize: 14,
    marginRight: 6,
    lineHeight: 16,
  },
  recText: {
    fontSize: 11.5,
    flex: 1,
    lineHeight: 16,
  },
});
