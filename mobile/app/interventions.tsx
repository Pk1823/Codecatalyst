import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { Header } from "../components/ui/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { MOCK_INTERVENTIONS } from "../services/analytics";
import { InterventionRecord } from "../types";
import {
  HandHelping,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  X,
  ChevronRight,
  Stethoscope,
  Activity,
} from "lucide-react-native";

export default function InterventionsScreen() {
  const { colors } = useTheme();
  const { t, isHi } = useLanguage();
  const router = useRouter();

  const [filter, setFilter] = useState<"All" | "Active" | "Completed" | "Scheduled">("All");
  const [interventions, setInterventions] = useState<InterventionRecord[]>(MOCK_INTERVENTIONS);

  // New Intervention Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [personnelName, setPersonnelName] = useState("");
  const [type, setType] = useState<InterventionRecord["type"]>("Mandatory R&R Leave");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<InterventionRecord["priority"]>("Urgent");

  const filtered = interventions.filter((item) => {
    if (filter === "All") return true;
    return item.status === filter;
  });

  const handleCreateSubmit = () => {
    if (!title.trim() || !personnelName.trim()) {
      if (Platform.OS === "web") {
        window.alert("Please provide both Title and Personnel Name.");
      } else {
        Alert.alert("Missing Fields", "Please provide both Title and Personnel Name.");
      }
      return;
    }

    const newRecord: InterventionRecord = {
      id: `INT-${Math.floor(800 + Math.random() * 200)}`,
      personnelId: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      personnelName: personnelName.trim(),
      personnelRank: "Constable (GD)",
      type,
      title: title.trim(),
      description: desc.trim() || "Unit commander and doctor authorized clinical rotation protocol.",
      initiatedDate: new Date().toISOString().split("T")[0],
      scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
      status: "Active",
      priority,
      officerInCharge: "Dr. Ananya Roy (SMO)",
    };

    setInterventions([newRecord, ...interventions]);
    setTitle("");
    setPersonnelName("");
    setDesc("");
    setModalOpen(false);
  };

  const handleToggleComplete = (id: string) => {
    setInterventions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Completed" ? "Active" : "Completed" }
          : item
      )
    );
  };

  const handleExportCSV = () => {
    const headers = ["ID,Personnel,Rank,Type,Title,Status,Priority,Officer"];
    const rows = filtered.map(
      (i) =>
        `"${i.id}","${i.personnelName}","${i.personnelRank}","${i.type}","${i.title}","${i.status}","${i.priority}","${i.officerInCharge}"`
    );
    const csv = [headers, ...rows].join("\n");

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `missionwell_interventions_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      Alert.alert("Export Ready", "Interventions ledger ready for local export.");
    }
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title={isHi ? "कल्याणकारी हस्तक्षेप" : "Welfare Interventions"}
        subtitle={isHi ? "ड्यूटी रोटेशन, आराम व परामर्श प्रबंधन" : "Duty Rotations, Decompression R&R & Care Tracks"}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Actions Bar */}
        <View style={styles.topActionsRow}>
          <View style={styles.filterPills}>
            {(["All", "Active", "Scheduled", "Completed"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setFilter(tab)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: filter === tab ? colors.primary : colors.surface,
                    borderColor: filter === tab ? colors.primary : colors.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.filterPillText, { color: filter === tab ? "#FFFFFF" : colors.textMuted }]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actionBtns}>
            <TouchableOpacity
              onPress={handleExportCSV}
              style={[styles.smallActionBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
              accessibilityLabel="Export CSV"
            >
              <Download size={14} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalOpen(true)}
              style={[styles.newBtn, { backgroundColor: colors.primary }]}
            >
              <Plus size={14} color="#FFFFFF" />
              <Text style={styles.newBtnText}>{isHi ? "हस्तक्षेप दर्ज करें" : "Initiate"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Interventions Count Banner */}
        <Card style={[styles.summaryCard, { backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}25` }]}>
          <View style={styles.summaryRow}>
            <HandHelping size={18} color={colors.primary} />
            <Text style={[styles.summaryText, { color: colors.text }]}>
              {interventions.filter((i) => i.status === "Active").length} Active Interventions in Progress
            </Text>
          </View>
        </Card>

        {/* List of Interventions */}
        {filtered.map((item) => (
          <Card key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.titleArea}>
                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.sub, { color: colors.textMuted }]}>
                  {item.personnelRank} {item.personnelName} • {item.type}
                </Text>
              </View>
              <Badge
                label={item.status.toUpperCase()}
                variant={item.status === "Completed" ? "success" : item.status === "Active" ? "primary" : "warning"}
              />
            </View>

            <Text style={[styles.desc, { color: colors.text }]}>{item.description}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Calendar size={12} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textMuted }]}>
                  Sched: {item.scheduledDate}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Clock size={12} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textMuted }]}>
                  In-Charge: {item.officerInCharge}
                </Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Badge
                label={`Priority: ${item.priority}`}
                variant={item.priority === "Urgent" ? "error" : "warning"}
              />

              <TouchableOpacity
                onPress={() => handleToggleComplete(item.id)}
                style={[
                  styles.toggleBtn,
                  {
                    backgroundColor: item.status === "Completed" ? colors.surface : `${colors.primary}15`,
                    borderColor: item.status === "Completed" ? colors.cardBorder : colors.primary,
                  },
                ]}
              >
                <CheckCircle2
                  size={14}
                  color={item.status === "Completed" ? colors.textMuted : colors.primary}
                />
                <Text
                  style={[
                    styles.toggleBtnText,
                    { color: item.status === "Completed" ? colors.textMuted : colors.primary },
                  ]}
                >
                  {item.status === "Completed" ? "Mark Active" : "Complete Task"}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* New Intervention Modal */}
      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Initiate Care Intervention</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Action Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. 7-Day Sentry Relief Rotation"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { color: colors.text, borderColor: colors.cardBorder }]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Target Soldier / Officer</Text>
              <TextInput
                value={personnelName}
                onChangeText={setPersonnelName}
                placeholder="e.g. Ct. Vikramaditya Singh"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { color: colors.text, borderColor: colors.cardBorder }]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Intervention Protocol</Text>
              <View style={styles.typeRow}>
                {(["Mandatory R&R Leave", "Workload Adjustment", "Clinical Counseling", "Sleep Hygiene Protocol"] as const).map(
                  (tChoice) => (
                    <TouchableOpacity
                      key={tChoice}
                      onPress={() => setType(tChoice)}
                      style={[
                        styles.typePill,
                        {
                          backgroundColor: type === tChoice ? `${colors.primary}20` : colors.surface,
                          borderColor: type === tChoice ? colors.primary : colors.cardBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.typePillText, { color: type === tChoice ? colors.primary : colors.text }]}>
                        {tChoice}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Clinical Directive & Notes</Text>
              <TextInput
                value={desc}
                onChangeText={setDesc}
                placeholder="Clinical reason, detachment plan, or counseling goals..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                style={[styles.input, { color: colors.text, borderColor: colors.cardBorder, height: 70 }]}
              />
            </View>

            <Button
              title="Issue Intervention Order"
              onPress={handleCreateSubmit}
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
  topActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterPills: {
    flexDirection: "row",
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  actionBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  smallActionBtn: {
    padding: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  newBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  summaryCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: "700",
  },
  card: {
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleArea: {
    flex: 1,
    paddingRight: 8,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
  },
  sub: {
    fontSize: 11,
  },
  desc: {
    fontSize: 12,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.1)",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleBtnText: {
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
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  typePillText: {
    fontSize: 10,
    fontWeight: "700",
  },
});
