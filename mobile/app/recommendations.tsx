import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { Header } from "../components/ui/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { MOCK_RECOMMENDATIONS } from "../services/analytics";
import { AIRecommendation } from "../types";
import {
  Sparkles,
  CheckCircle2,
  Check,
  X,
  Download,
  Share2,
  TrendingDown,
  ShieldCheck,
  Target,
} from "lucide-react-native";

export default function RecommendationsScreen() {
  const { colors } = useTheme();
  const { isHi, t } = useLanguage();
  const router = useRouter();

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(MOCK_RECOMMENDATIONS);
  const [assignModalRec, setAssignModalRec] = useState<AIRecommendation | null>(null);
  const [selectedUnit, setSelectedUnit] = useState("74 Bn Bravo Company");

  const handleUpdateStatus = (id: string, status: AIRecommendation["status"]) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleConfirmAssignment = () => {
    if (!assignModalRec) return;
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === assignModalRec.id ? { ...r, status: "Assigned", targetUnit: selectedUnit } : r
      )
    );
    setAssignModalRec(null);
  };

  const handleExportCSV = () => {
    const headers = ["ID,Category,Title,ExpectedRiskReduction,ConfidenceScore,Status,TargetUnit"];
    const rows = recommendations.map(
      (r) =>
        `"${r.id}","${r.category}","${r.title}","${r.expectedRiskReductionPct}%","${r.confidenceScore}%","${r.status}","${r.targetUnit || "Battalion Grid"}"`
    );
    const csv = [headers, ...rows].join("\n");

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `missionwell_ai_recommendations_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      Alert.alert("Export Ready", "AI recommendations ledger downloaded.");
    }
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title={isHi ? "एआई निर्णय सिफ़ारिशें" : "AI Prescriptive Recommendations"}
        subtitle={isHi ? "नैदानिक व परिचालन निर्णय समर्थन" : "Clinical & Tactical Stress Mitigation Directives"}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header & Export */}
        <View style={styles.topBar}>
          <View style={styles.topInfo}>
            <Sparkles size={16} color={colors.primary} />
            <Text style={[styles.topInfoText, { color: colors.text }]}>
              {recommendations.length} Active AI Directives
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleExportCSV}
            style={[styles.exportBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
          >
            <Download size={13} color={colors.text} />
            <Text style={[styles.exportBtnText, { color: colors.text }]}>Export CSV</Text>
          </TouchableOpacity>
        </View>

        {/* AI Recommendations List */}
        {recommendations.map((rec) => (
          <Card key={rec.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Badge
                label={rec.category.toUpperCase()}
                variant={
                  rec.category === "Operational"
                    ? "primary"
                    : rec.category === "Clinical"
                    ? "error"
                    : rec.category === "Policy"
                    ? "warning"
                    : "info"
                }
              />
              <Badge
                label={rec.status.toUpperCase()}
                variant={rec.status === "Approved" || rec.status === "Assigned" ? "success" : "default"}
              />
            </View>

            <Text style={[styles.recTitle, { color: colors.text }]}>{rec.title}</Text>

            <View style={[styles.reasonBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
              <Text style={[styles.reasonHeading, { color: colors.textMuted }]}>Detection Rationale:</Text>
              <Text style={[styles.reasonText, { color: colors.text }]}>{rec.reason}</Text>
            </View>

            <View style={[styles.actionBox, { backgroundColor: `${colors.primary}12`, borderColor: `${colors.primary}30` }]}>
              <Text style={[styles.actionHeading, { color: colors.primary }]}>Prescribed Tactical Action:</Text>
              <Text style={[styles.actionText, { color: colors.text }]}>{rec.recommendedAction}</Text>
            </View>

            <View style={styles.impactGrid}>
              <View style={styles.impactItem}>
                <TrendingDown size={14} color="#10B981" />
                <Text style={[styles.impactVal, { color: "#10B981" }]}>
                  -{rec.expectedRiskReductionPct}% Risk
                </Text>
              </View>
              <View style={styles.impactItem}>
                <ShieldCheck size={14} color={colors.primary} />
                <Text style={[styles.impactVal, { color: colors.primary }]}>
                  {rec.confidenceScore}% Confidence
                </Text>
              </View>
              {rec.targetUnit && (
                <View style={styles.impactItem}>
                  <Target size={14} color="#F59E0B" />
                  <Text style={[styles.impactVal, { color: colors.textMuted }]}>
                    {rec.targetUnit}
                  </Text>
                </View>
              )}
            </View>

            {/* Decision Controls */}
            <View style={styles.btnRow}>
              {rec.status === "New" ? (
                <>
                  <TouchableOpacity
                    onPress={() => handleUpdateStatus(rec.id, "Approved")}
                    style={[styles.actionBtn, { backgroundColor: "#10B981" }]}
                  >
                    <Check size={14} color="#FFFFFF" />
                    <Text style={styles.btnLabel}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setAssignModalRec(rec)}
                    style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                  >
                    <Target size={14} color="#FFFFFF" />
                    <Text style={styles.btnLabel}>Assign Unit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleUpdateStatus(rec.id, "Dismissed")}
                    style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder, borderWidth: 1 }]}
                  >
                    <X size={14} color={colors.textMuted} />
                    <Text style={[styles.btnLabel, { color: colors.textMuted }]}>Dismiss</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.completedNotice}>
                  <CheckCircle2 size={15} color="#10B981" />
                  <Text style={styles.completedText}>
                    Action {rec.status} • Assigned to {rec.targetUnit || "Battalion Grid"}
                  </Text>
                </View>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Assignment Modal */}
      <Modal visible={!!assignModalRec} transparent animationType="fade" onRequestClose={() => setAssignModalRec(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Assign Action to Unit</Text>
              <TouchableOpacity onPress={() => setAssignModalRec(null)}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSub, { color: colors.textMuted }]}>
              Target Unit Roster for deployment relief:
            </Text>

            <View style={styles.unitList}>
              {["74 Bn Bravo Company", "204 CoBRA Battalion", "3/11 Gorkha Rifles", "Sukma Sector FOB 4"].map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => setSelectedUnit(u)}
                  style={[
                    styles.unitOpt,
                    {
                      backgroundColor: selectedUnit === u ? `${colors.primary}20` : colors.surface,
                      borderColor: selectedUnit === u ? colors.primary : colors.cardBorder,
                    },
                  ]}
                >
                  <Text style={[styles.unitOptText, { color: selectedUnit === u ? colors.primary : colors.text }]}>
                    {u}
                  </Text>
                  {selectedUnit === u && <Check size={16} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Confirm Unit Assignment"
              onPress={handleConfirmAssignment}
              variant="primary"
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  topInfoText: {
    fontSize: 13,
    fontWeight: "800",
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  exportBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  card: {
    padding: 14,
    borderRadius: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recTitle: {
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
  },
  reasonBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
  },
  reasonHeading: {
    fontSize: 10,
    fontWeight: "700",
  },
  reasonText: {
    fontSize: 11,
    lineHeight: 16,
  },
  actionBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
  },
  actionHeading: {
    fontSize: 10,
    fontWeight: "800",
  },
  actionText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  impactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    paddingVertical: 4,
  },
  impactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  impactVal: {
    fontSize: 11,
    fontWeight: "700",
  },
  btnRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  completedNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  completedText: {
    color: "#10B981",
    fontSize: 11,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  modalSub: {
    fontSize: 12,
  },
  unitList: {
    gap: 8,
  },
  unitOpt: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  unitOptText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
