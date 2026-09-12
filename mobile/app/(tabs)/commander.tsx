import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { Header } from "../../components/ui/Header";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { useTheme } from "../../contexts/ThemeContext";
import { CommanderService } from "../../services/commander";
import { UnitReadinessMetric, DarbarRequest } from "../../types";
import {
  Crown,
  Activity,
  CalendarCheck,
  ShieldCheck,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  TrendingUp,
} from "lucide-react-native";

export default function CommanderScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [unitMetrics, setUnitMetrics] = useState<UnitReadinessMetric[]>([]);
  const [darbarRequests, setDarbarRequests] = useState<DarbarRequest[]>([]);

  useEffect(() => {
    CommanderService.getUnitReadiness().then(setUnitMetrics);
    CommanderService.getPendingDarbars().then(setDarbarRequests);
  }, []);

  const handleApproveDarbar = async (id: string) => {
    await CommanderService.resolveDarbar(id, "SCHEDULED", "Tomorrow at 10:00 hrs");
    setDarbarRequests((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "SCHEDULED", scheduledSlot: "Tomorrow at 10:00 hrs" } : d))
    );
    Alert.alert("Darbar Scheduled", "Audience slot confirmed and dispatched to Subedar Major.");
  };

  return (
    <ScreenContainer>
      <Header
        title="Command Operations"
        subtitle="Battalion Readiness & Heatmaps"
      />

      {/* Battalion Readiness Tactical HUD */}
      <Card variant="elevated" style={styles.readinessCard}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.iconBox, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
            <Crown size={22} color="#F59E0B" />
          </View>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>CO GRID LIVE</Text>
          </View>
        </View>

        <Text style={[styles.readinessTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
          Battalion Force Readiness
        </Text>

        <View style={styles.scoreRow}>
          <Text style={[styles.readinessScore, { color: colors.success, fontFamily: "GoogleSans-Bold" }]}>
            84%
          </Text>
          <View style={styles.scoreMeta}>
            <Text style={[styles.readinessStatus, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
              MISSION READY
            </Text>
            <Text style={[styles.readinessSub, { color: colors.textMuted }]}>
              405 Jawans Deployed across 4 Coys
            </Text>
          </View>
        </View>

        {/* Tactical Metric Chips */}
        <View style={styles.hudStatsGrid}>
          <View style={[styles.hudStatItem, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <Text style={[styles.hudStatVal, { color: colors.success, fontFamily: "GoogleSans-Bold" }]}>338</Text>
            <Text style={[styles.hudStatLbl, { color: colors.textMuted }]}>Optimal (83%)</Text>
          </View>
          <View style={[styles.hudStatItem, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <Text style={[styles.hudStatVal, { color: colors.warning, fontFamily: "GoogleSans-Bold" }]}>54</Text>
            <Text style={[styles.hudStatLbl, { color: colors.textMuted }]}>Fatigued (13%)</Text>
          </View>
          <View style={[styles.hudStatItem, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <Text style={[styles.hudStatVal, { color: colors.danger, fontFamily: "GoogleSans-Bold" }]}>13</Text>
            <Text style={[styles.hudStatLbl, { color: colors.textMuted }]}>Strained (4%)</Text>
          </View>
        </View>

        <Button
          title="Export Battalion Welfare Dossier"
          onPress={() => router.push("/reports")}
          variant="secondary"
          size="sm"
          icon={<FileSpreadsheet size={14} color={colors.text} />}
          style={styles.exportDossierBtn}
        />
      </Card>

      {/* Company-Level Anonymized Heatmap */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.titleWithIcon}>
            <Activity size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
              Company Stress Breakdown
            </Text>
          </View>
          <Badge label="ANONYMIZED" variant="neutral" size="sm" />
        </View>

        {unitMetrics.map((unit) => {
          const isHighRisk = unit.highRiskPercentage > 10;
          return (
            <View
              key={unit.unitId}
              style={[styles.unitItem, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
            >
              <View style={styles.unitHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={[styles.unitName, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                    {unit.unitName}
                  </Text>
                  <Badge
                    label={isHighRisk ? "WATCH" : "NORMAL"}
                    variant={isHighRisk ? "warning" : "success"}
                    size="sm"
                  />
                </View>
                <Text style={[styles.unitPersonnelCount, { color: colors.textMuted }]}>
                  {unit.totalPersonnel} Jawans
                </Text>
              </View>

              {/* Segmented Stress Ratio Bar */}
              <View style={styles.segmentedBar}>
                <View
                  style={[
                    styles.segment,
                    { width: `${unit.optimalPercentage}%`, backgroundColor: colors.success },
                  ]}
                />
                <View
                  style={[
                    styles.segment,
                    { width: `${unit.moderatePercentage}%`, backgroundColor: colors.warning },
                  ]}
                />
                <View
                  style={[
                    styles.segment,
                    { width: `${unit.highRiskPercentage}%`, backgroundColor: colors.danger },
                  ]}
                />
              </View>

              <View style={styles.legendRow}>
                <Text style={[styles.legendText, { color: colors.success }]}>
                  {unit.optimalPercentage}% Ready
                </Text>
                <Text style={[styles.legendText, { color: colors.warning }]}>
                  {unit.moderatePercentage}% Fatigue
                </Text>
                <Text style={[styles.legendText, { color: colors.danger }]}>
                  {unit.highRiskPercentage}% Strained
                </Text>
              </View>
            </View>
          );
        })}
      </Card>

      {/* Pending Darbar Audience Requests Queue */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.titleWithIcon}>
            <CalendarCheck size={18} color="#F59E0B" />
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
              Confidential Darbar Queue
            </Text>
          </View>
          <Badge label="CO AUDIENCE" variant="warning" size="sm" />
        </View>

        {darbarRequests.map((req) => (
          <View
            key={req.id}
            style={[styles.darbarItem, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
          >
            <View style={styles.darbarItemHeader}>
              <View>
                <Text style={[styles.darbarReason, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                  {req.reasonCategory}
                </Text>
                <Text style={[styles.darbarRef, { color: colors.textMuted }]}>
                  Ref: {req.id} • Target: {req.targetOfficer}
                </Text>
              </View>
              <Badge
                label={req.status}
                variant={req.status === "SCHEDULED" ? "success" : "warning"}
                size="sm"
              />
            </View>

            <Text style={[styles.darbarNotes, { color: colors.textMuted }]} numberOfLines={2}>
              "{req.confidentialNotes}"
            </Text>

            {req.status === "PENDING" ? (
              <Button
                title="Confirm 10:00 hrs Slot"
                size="sm"
                onPress={() => handleApproveDarbar(req.id)}
                icon={<Clock size={14} color="#FFFFFF" />}
                style={styles.scheduleBtn}
              />
            ) : (
              <View style={styles.scheduledInfo}>
                <CheckCircle2 size={14} color={colors.success} />
                <Text style={[styles.scheduledText, { color: colors.success }]}>
                  Confirmed: {req.scheduledSlot}
                </Text>
              </View>
            )}
          </View>
        ))}
      </Card>

      {/* DPDP Compliance Reassurance */}
      <View style={styles.statutoryFooter}>
        <ShieldCheck size={15} color={colors.accent} />
        <Text style={[styles.statutoryText, { color: colors.textMuted }]}>
          DPDP Act 2023 Shielded • Anonymized Telemetry • Zero Individual Medical Disclosures
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  readinessCard: {
    padding: 18,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.35)",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  liveText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#10B981",
    letterSpacing: 0.6,
  },
  readinessTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  hudStatsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  hudStatItem: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  hudStatVal: {
    fontSize: 16,
    fontWeight: "900",
  },
  hudStatLbl: {
    fontSize: 9.5,
    fontWeight: "600",
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 14,
  },
  readinessScore: {
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -1.5,
  },
  scoreMeta: {
    flex: 1,
  },
  readinessStatus: {
    fontSize: 15,
    fontWeight: "800",
  },
  readinessSub: {
    fontSize: 12,
    marginTop: 2,
  },
  exportDossierBtn: {
    width: "100%",
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  unitItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  unitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  unitName: {
    fontSize: 13,
    fontWeight: "700",
  },
  unitPersonnelCount: {
    fontSize: 11,
  },
  segmentedBar: {
    height: 8,
    borderRadius: 4,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 6,
  },
  segment: {
    height: "100%",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendText: {
    fontSize: 10,
    fontWeight: "600",
  },
  darbarDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  darbarItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  darbarItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  darbarReason: {
    fontSize: 13,
    fontWeight: "700",
  },
  darbarRef: {
    fontSize: 11,
    marginTop: 1,
  },
  darbarNotes: {
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 10,
    lineHeight: 16,
  },
  scheduleBtn: {
    alignSelf: "flex-start",
  },
  scheduledInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 4,
  },
  scheduledText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statutoryFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  statutoryText: {
    fontSize: 10,
    lineHeight: 14,
    flex: 1,
  },
});
