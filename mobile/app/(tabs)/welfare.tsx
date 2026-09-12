import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { Header } from "../../components/ui/Header";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { WelfareService } from "../../services/welfare";
import { WelfareCase } from "../../types";
import {
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  Search,
  Plus,
  X,
  Sparkles,
  UserCheck,
  Activity,
  Calendar,
} from "lucide-react-native";

export default function WelfareIndexScreen() {
  const { colors } = useTheme();
  const { user, loginAsPersona } = useAuth();
  const router = useRouter();

  const [cases, setCases] = useState<WelfareCase[]>([]);
  const [filter, setFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "REST">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New Case Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPersonnelId, setNewPersonnelId] = useState("P-1024");
  const [newTitle, setNewTitle] = useState("Workload Adjustment & Rest Protocol");
  const [newPriority, setNewPriority] = useState<"Critical" | "High" | "Moderate" | "Low">("High");
  const [newReason, setNewReason] = useState("");
  const [isSubmittingCase, setIsSubmittingCase] = useState(false);

  const loadCases = useCallback(async () => {
    try {
      const live = await WelfareService.getCases();
      setCases(live);
    } catch {
      // Fallback already handled inside service
    }
  }, []);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadCases();
    setIsRefreshing(false);
  };

  const handleCreateCase = async () => {
    if (!newReason.trim()) {
      Alert.alert("Required Field", "Please enter the clinical reason or initial notes for opening this case.");
      return;
    }

    setIsSubmittingCase(true);
    const score = newPriority === "Critical" ? 85 : newPriority === "High" ? 65 : 40;
    const created = await WelfareService.createCase({
      personnelId: newPersonnelId.trim().toUpperCase(),
      title: newTitle.trim(),
      reason: newReason.trim(),
      priority: newPriority,
      riskScore: score,
    });

    setIsSubmittingCase(false);
    if (created) {
      setIsModalOpen(false);
      setNewReason("");
      await loadCases();
      Alert.alert("Case Created", `Welfare Case ${created.id} initiated for ${created.personnelId}.`);
    } else {
      Alert.alert("Success", "Case logged and queued for synchronization.");
      setIsModalOpen(false);
      await loadCases();
    }
  };

  const handleSwitchToDoctor = async () => {
    try {
      await loginAsPersona("doctor");
      await loadCases();
      Alert.alert("Switched Persona", "Logged in as Dr. Aarti Sharma (Chief Medical Officer / Welfare Officer).");
    } catch {
      Alert.alert("Notice", "Welfare officer preview active.");
    }
  };

  const filteredCases = cases.filter((c) => {
    // Priority / Status filter
    if (filter === "HIGH" && c.priority !== "HIGH") return false;
    if (filter === "MEDIUM" && c.priority !== "MEDIUM") return false;
    if (filter === "REST" && c.status !== "Rest Rotation") return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (c.name || "").toLowerCase().includes(q);
      const matchId = (c.personnelId || "").toLowerCase().includes(q) || (c.serviceNumber || "").toLowerCase().includes(q);
      const matchUnit = (c.unitName || "").toLowerCase().includes(q);
      const matchNotes = (c.clinicalNotes || "").toLowerCase().includes(q);
      return matchName || matchId || matchUnit || matchNotes;
    }

    return true;
  });

  return (
    <ScreenContainer
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      {/* Header & Title */}
      <Header
        title="Welfare Clinical Triage"
        subtitle="Confidential Medical, Psychological & Support Dossiers"
      />

      {/* Evaluator Persona Switcher Banner if logged in as Jawan */}
      {user?.role !== "WELFARE_OFFICER" && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSwitchToDoctor}
          style={[styles.personaBanner, { backgroundColor: `${colors.primary}18`, borderColor: colors.primary }]}
        >
          <View style={styles.personaBannerContent}>
            <UserCheck size={16} color={colors.primary} />
            <Text style={[styles.personaBannerText, { color: colors.text }]}>
              Currently viewing as <Text style={{ fontWeight: "800" }}>{user?.name || "Jawan"}</Text>. Tap to switch to <Text style={{ fontWeight: "800", color: colors.primary }}>Dr. Aarti Sharma (CMO)</Text>.
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Summary KPI Banner */}
      <Card style={styles.kpiCard} variant="elevated">
        <View style={styles.kpiRow}>
          <View style={styles.kpiItem}>
            <Text style={[styles.kpiNumber, { color: colors.danger }]}>
              {cases.filter((c) => c.priority === "HIGH").length}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>Critical Triage</Text>
          </View>
          <View style={[styles.kpiDivider, { backgroundColor: colors.border }]} />
          <View style={styles.kpiItem}>
            <Text style={[styles.kpiNumber, { color: colors.warning }]}>
              {cases.filter((c) => c.status === "Under Counseling").length}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>In Therapy</Text>
          </View>
          <View style={[styles.kpiDivider, { backgroundColor: colors.border }]} />
          <View style={styles.kpiItem}>
            <Text style={[styles.kpiNumber, { color: colors.success }]}>
              {cases.filter((c) => c.status === "Rest Rotation").length}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>Rest Rotation</Text>
          </View>
        </View>
      </Card>

      {/* Search & New Case Button Bar */}
      <View style={styles.actionBar}>
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <Search size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by name, ID, or unit..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsModalOpen(true)}
          style={[styles.newCaseBtn, { backgroundColor: colors.primary }]}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.newCaseBtnText}>New Case</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(
          [
            { id: "ALL", label: "All Cases" },
            { id: "HIGH", label: "Critical" },
            { id: "MEDIUM", label: "Moderate" },
            { id: "REST", label: "Rest Rotation" },
          ] as const
        ).map((f) => (
          <TouchableOpacity
            key={f.id}
            onPress={() => setFilter(f.id)}
            style={[
              styles.filterPill,
              {
                backgroundColor: filter === f.id ? colors.primary : colors.surface,
                borderColor: filter === f.id ? colors.primary : colors.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === f.id ? "#FFFFFF" : colors.textMuted },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Empty State */}
      {filteredCases.length === 0 && (
        <Card style={styles.emptyCard}>
          <Activity size={32} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Welfare Cases Found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
            {searchQuery ? "No cases match your search query." : "Pull down to refresh or open a new welfare case."}
          </Text>
        </Card>
      )}

      {/* Case Files List */}
      {filteredCases.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.7}
          onPress={() => router.push(`/welfare-case?caseId=${item.id}` as any)}
        >
          <Card style={styles.caseCard}>
            <View style={styles.caseHeader}>
              <View style={styles.caseIdentity}>
                <View style={styles.nameRow}>
                  <Text style={[styles.personName, { color: colors.text }]}>
                    {item.rank} {item.name}
                  </Text>
                  <Text style={[styles.caseRef, { color: colors.primary }]}>{item.id}</Text>
                </View>
                <Text style={[styles.serviceId, { color: colors.textMuted }]}>
                  {item.serviceNumber} • {item.unitName}
                </Text>
              </View>
              <Badge
                label={item.priority}
                variant={item.priority === "HIGH" ? "danger" : item.priority === "MEDIUM" ? "warning" : "neutral"}
                size="sm"
              />
            </View>

            <View style={[styles.scorePill, { backgroundColor: colors.surface }]}>
              <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>Fatigue Risk Index:</Text>
              <Text
                style={[
                  styles.scoreValue,
                  { color: item.riskScore > 65 ? colors.danger : item.riskScore > 45 ? colors.warning : colors.success },
                ]}
              >
                {item.riskScore}/100
              </Text>
              <Badge label={item.status} variant="info" size="sm" style={styles.statusBadge} />
            </View>

            <Text style={[styles.notesPreview, { color: colors.textMuted }]} numberOfLines={2}>
              {item.clinicalNotes}
            </Text>

            {/* Support Actions Count Badge if present */}
            {item.supportActions && item.supportActions.length > 0 && (
              <View style={[styles.interventionTag, { backgroundColor: `${colors.primary}15` }]}>
                <Sparkles size={12} color={colors.primary} />
                <Text style={[styles.interventionTagText, { color: colors.primary }]}>
                  {item.supportActions.length} Support Action{item.supportActions.length > 1 ? "s" : ""} Prescribed
                </Text>
              </View>
            )}

            <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
              <View style={styles.doctorInfo}>
                <Stethoscope size={12} color={colors.primary} />
                <Text style={[styles.doctorText, { color: colors.textMuted }]}>
                  {item.assignedOfficer}
                </Text>
              </View>
              <View style={styles.footerRight}>
                <Calendar size={12} color={colors.textMuted} />
                <Text style={[styles.dateText, { color: colors.textMuted }]}>{item.openedDate}</Text>
                <ChevronRight size={14} color={colors.textMuted} />
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      ))}

      {/* Privacy Notice */}
      <View style={styles.privacyNotice}>
        <ShieldCheck size={16} color={colors.accent} />
        <Text style={[styles.privacyText, { color: colors.textMuted }]}>
          Doctor-Patient Privileged Access Only. Sealed under DPDP Act 2023.
        </Text>
      </View>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: INITIATE NEW WELFARE CASE                              */}
      {/* ------------------------------------------------------------- */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Initiate Welfare Case</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>PERSONNEL ID / SERVICE NUMBER</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                value={newPersonnelId}
                onChangeText={setNewPersonnelId}
                placeholder="e.g. P-1024 or CRPF-GD-2021-04128"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 12 }]}>SUPPORT TYPE / CASE TITLE</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="e.g. Workload Adjustment, Tactical Counseling"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 12 }]}>TRIAGE PRIORITY</Text>
              <View style={styles.prioritySelector}>
                {(["Critical", "High", "Moderate", "Low"] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setNewPriority(p)}
                    style={[
                      styles.priorityPill,
                      {
                        backgroundColor: newPriority === p ? colors.primary : colors.surface,
                        borderColor: newPriority === p ? colors.primary : colors.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityPillText,
                        { color: newPriority === p ? "#FFFFFF" : colors.textMuted },
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 12 }]}>CLINICAL REASON & REMARKS</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  styles.modalTextArea,
                  { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
                ]}
                multiline
                numberOfLines={4}
                value={newReason}
                onChangeText={setNewReason}
                placeholder="Document observed stressors, duty fatigue indicators, or voluntary request details..."
                placeholderTextColor={colors.textMuted}
              />

              <Button
                title="Create Confidential Case"
                onPress={handleCreateCase}
                loading={isSubmittingCase}
                style={{ marginTop: 18 }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  personaBanner: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  personaBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  personaBannerText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  kpiCard: {
    paddingVertical: 14,
    marginBottom: 14,
  },
  kpiRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  kpiItem: {
    alignItems: "center",
  },
  kpiNumber: {
    fontSize: 24,
    fontWeight: "900",
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  kpiDivider: {
    width: 1,
    height: 32,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  newCaseBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
  },
  newCaseBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 11,
    fontWeight: "700",
  },
  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginVertical: 16,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  caseCard: {
    padding: 14,
    marginBottom: 12,
  },
  caseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  caseIdentity: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  personName: {
    fontSize: 14,
    fontWeight: "800",
  },
  caseRef: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: Platform.OS === "web" ? "'JetBrains Mono', monospace" : "JetBrainsMono-Bold",
  },
  serviceId: {
    fontSize: 11,
    marginTop: 2,
  },
  scorePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 11,
    marginRight: 6,
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: "800",
    marginRight: 10,
  },
  statusBadge: {
    marginLeft: "auto",
  },
  notesPreview: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  interventionTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  interventionTagText: {
    fontSize: 10,
    fontWeight: "700",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  doctorText: {
    fontSize: 11,
    fontWeight: "600",
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 11,
  },
  privacyNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    marginTop: 10,
    gap: 8,
  },
  privacyText: {
    fontSize: 10,
    textAlign: "center",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
  },
  modalTextArea: {
    height: 90,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  prioritySelector: {
    flexDirection: "row",
    gap: 6,
  },
  priorityPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  priorityPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
