import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { Header } from "../../components/ui/Header";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { HelplineModal } from "../../components/ui/HelplineModal";
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

      {/* Daily Readiness & Assessment CTA */}
      <Card variant="elevated" style={styles.heroCard}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.heroIconBox, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
            <HeartPulse size={24} color="#3B82F6" />
          </View>
          <Badge label="VOLUNTARY & CONFIDENTIAL" variant="info" />
        </View>
        <Text style={[styles.heroTitle, { color: colors.text }]}>
          Daily Operational Self-Assessment
        </Text>
        <Text style={[styles.heroDesc, { color: colors.textMuted }]}>
          Take 60 seconds to record sleep debt, patrol fatigue, and cognitive load. Confidential data is evaluated by AI and reviewed by your Welfare Officer for timely support.
        </Text>
        <Button
          title="Start Assessment (6 Steps)"
          onPress={() => router.push("/assessment")}
          icon={<ArrowRight size={16} color="#FFFFFF" />}
          style={styles.heroActionBtn}
        />
      </Card>

      {/* Historical Wellness Trends */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <TrendingUp size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Self-Assessment & Fatigue Trends</Text>
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
                <Text style={[styles.trendPillText, { color: trendRange === r ? "#FFFFFF" : colors.textMuted }]}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.trendStatsGrid, { backgroundColor: colors.surface }]}>
          <View style={styles.trendStat}>
            <Text style={[styles.trendStatVal, { color: colors.success }]}>74%</Text>
            <Text style={[styles.trendStatLbl, { color: colors.textMuted }]}>Avg Recovery</Text>
          </View>
          <View style={styles.trendStat}>
            <Text style={[styles.trendStatVal, { color: colors.primary }]}>6.2h</Text>
            <Text style={[styles.trendStatLbl, { color: colors.textMuted }]}>Night Sleep</Text>
          </View>
          <View style={styles.trendStat}>
            <Text style={[styles.trendStatVal, { color: colors.warning }]}>32%</Text>
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
  heroTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  heroDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
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
