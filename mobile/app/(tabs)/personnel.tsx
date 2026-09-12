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
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { WellnessService } from "../../services/wellness";
import { BuddyCheckStatus } from "../../types";
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
} from "lucide-react-native";

export default function PersonnelHomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const [buddyStatus, setBuddyStatus] = useState<BuddyCheckStatus | null>(null);
  const [buddyCheckDone, setBuddyCheckDone] = useState(false);
  const [darbarRequested, setDarbarRequested] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [trendRange, setTrendRange] = useState<"7D" | "30D">("7D");

  useEffect(() => {
    WellnessService.getBuddyStatus().then(setBuddyStatus);
  }, []);

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
            <Badge label="VOLUNTARY & CONFIDENTIAL" variant="info" size="sm" />
            <View style={styles.hudLiveChip}>
              <View style={styles.hudLiveDot} />
              <Text style={styles.hudLiveText}>ACTIVE SHIELD</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.heroTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
          Daily Operational Self-Assessment
        </Text>
        <Text style={[styles.heroDesc, { color: colors.textMuted }]}>
          Confidential AI evaluates operational stress, patrol fatigue & sleep debt without middle-command stigma. Takes only 60 seconds.
        </Text>

        {/* Tactical Readiness Metric Bar */}
        <View style={[styles.hudMetricContainer, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <View style={styles.hudScoreCol}>
            <Text style={[styles.hudScoreLabel, { color: colors.textMuted }]}>READINESS</Text>
            <View style={styles.hudScoreRow}>
              <Text style={[styles.hudScoreNumber, { color: colors.success }]}>88</Text>
              <Text style={[styles.hudScoreUnit, { color: colors.textMuted }]}>%</Text>
            </View>
          </View>

          <View style={styles.hudMetricsDivider} />

          <View style={styles.hudMiniStatsCol}>
            <View style={styles.hudMiniStatRow}>
              <Text style={[styles.hudMiniStatKey, { color: colors.textMuted }]}>Sleep Cycle</Text>
              <Text style={[styles.hudMiniStatVal, { color: colors.text }]}>7.2h (Good)</Text>
            </View>
            <View style={styles.hudMiniStatRow}>
              <Text style={[styles.hudMiniStatKey, { color: colors.textMuted }]}>Patrol Load</Text>
              <Text style={[styles.hudMiniStatVal, { color: colors.primary }]}>Normal Shift</Text>
            </View>
            <View style={styles.hudMiniStatRow}>
              <Text style={[styles.hudMiniStatKey, { color: colors.textMuted }]}>Cognitive Load</Text>
              <Text style={[styles.hudMiniStatVal, { color: colors.success }]}>Low Risk</Text>
            </View>
          </View>
        </View>

        <Button
          title="Start Assessment (6 Steps) →"
          onPress={() => router.push("/assessment")}
          icon={<ArrowRight size={16} color="#FFFFFF" />}
          style={styles.heroActionBtn}
        />
      </Card>

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
            { day: "Today", val: 86, color: "#10B981", active: true },
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
            <Text style={[styles.trendStatVal, { color: colors.success, fontFamily: "GoogleSans-Bold" }]}>86%</Text>
            <Text style={[styles.trendStatLbl, { color: colors.textMuted }]}>Avg Readiness</Text>
          </View>
          <View style={styles.trendStat}>
            <Text style={[styles.trendStatVal, { color: colors.primary, fontFamily: "GoogleSans-Bold" }]}>7.2h</Text>
            <Text style={[styles.trendStatLbl, { color: colors.textMuted }]}>Night Sleep</Text>
          </View>
          <View style={styles.trendStat}>
            <Text style={[styles.trendStatVal, { color: colors.warning, fontFamily: "GoogleSans-Bold" }]}>22%</Text>
            <Text style={[styles.trendStatLbl, { color: colors.textMuted }]}>Fatigue Index</Text>
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
});
