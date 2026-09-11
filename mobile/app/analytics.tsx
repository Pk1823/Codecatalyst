import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
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
import { MOCK_PERSONNEL_ROSTER } from "../services/analytics";
import { PersonnelRecord } from "../types";
import {
  LineChart,
  Brain,
  Search,
  Filter,
  UserPlus,
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  X,
  Plus,
  Cpu,
  CheckCircle2,
  Sliders,
} from "lucide-react-native";

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const { currentForce } = useForce();
  const { t, isHi } = useLanguage();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "HIGH" | "MODERATE" | "LOW">("ALL");
  const [roster, setRoster] = useState<PersonnelRecord[]>(MOCK_PERSONNEL_ROSTER);

  // Enroll Personnel Modal
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRank, setNewRank] = useState("Constable (GD)");
  const [newUnit, setNewUnit] = useState("Bravo Company");
  const [newDays, setNewDays] = useState("45");
  const [newSleep, setNewSleep] = useState("5.5");

  // Triage Modal
  const [triageSubject, setTriageSubject] = useState<PersonnelRecord | null>(null);
  const [triageCategory, setTriageCategory] = useState("Workload Adjustment");
  const [triageSuccess, setTriageSuccess] = useState(false);

  // Filtered Roster
  const filteredRoster = useMemo(() => {
    return roster.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.serviceNumber.toLowerCase().includes(search.toLowerCase()) ||
        p.unit.toLowerCase().includes(search.toLowerCase());
      const matchLevel =
        selectedFilter === "ALL"
          ? true
          : selectedFilter === "HIGH"
          ? p.riskLevel === "High" || p.riskLevel === "Critical"
          : selectedFilter === "MODERATE"
          ? p.riskLevel === "Moderate"
          : p.riskLevel === "Low";
      return matchSearch && matchLevel;
    });
  }, [roster, search, selectedFilter]);

  const handleEnrollSubmit = () => {
    if (!newName.trim()) return;
    const newPerson: PersonnelRecord = {
      id: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceNumber: `${currentForce.id}-${Math.floor(100000 + Math.random() * 900000)}`,
      name: newName.trim(),
      rank: newRank,
      unit: newUnit,
      force: currentForce.id,
      location: "Forward Operations Post",
      bloodGroup: "B+",
      consecutiveFieldDays: parseInt(newDays, 10) || 30,
      workloadHoursWeekly: 56,
      riskScore: 62,
      riskLevel: "Moderate",
      antiMaskingFlag: false,
      lastAssessmentDate: new Date().toISOString().split("T")[0],
    };
    setRoster([newPerson, ...roster]);
    setNewName("");
    setEnrollModalOpen(false);
  };

  const handleConfirmTriage = () => {
    setTriageSuccess(true);
    setTimeout(() => {
      setTriageSuccess(false);
      setTriageSubject(null);
    }, 1500);
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title={isHi ? "पूर्वानुमानित कल्याण जोखिम" : "Predictive Risk Analytics"}
        subtitle={isHi ? "लाइटजीबीएम v4 एआई इंजन व टेलीमेट्री" : "LightGBM v4 Defense AI Engine & Live Telemetry"}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Model Telemetry Banner */}
        <Card style={[styles.telemetryCard, { backgroundColor: `${colors.primary}12`, borderColor: `${colors.primary}30` }]}>
          <View style={styles.telemetryHeader}>
            <View style={styles.telemetryTag}>
              <Cpu size={14} color={colors.primary} />
              <Text style={[styles.telemetryTagText, { color: colors.primary }]}>AI ENGINE TELEMETRY</Text>
            </View>
            <Badge label="ONLINE • 12ms" variant="success" />
          </View>
          <View style={styles.telemetryStatsGrid}>
            <View style={styles.telemetryStat}>
              <Text style={[styles.statVal, { color: colors.text }]}>LightGBM</Text>
              <Text style={[styles.statKey, { color: colors.textMuted }]}>Classifier v4.1</Text>
            </View>
            <View style={styles.telemetryStat}>
              <Text style={[styles.statVal, { color: "#10B981" }]}>0.942</Text>
              <Text style={[styles.statKey, { color: colors.textMuted }]}>ROC-AUC Score</Text>
            </View>
            <View style={styles.telemetryStat}>
              <Text style={[styles.statVal, { color: colors.text }]}>1,248</Text>
              <Text style={[styles.statKey, { color: colors.textMuted }]}>Jawans Tracked</Text>
            </View>
          </View>
        </Card>

        {/* Force Risk Vector Distribution */}
        <Card style={styles.distributionCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {isHi ? "बल जोखिम वितरण (समग्र)" : "Force Risk Distribution"}
          </Text>
          <View style={styles.distributionBar}>
            <View style={[styles.distSegment, { flex: 78, backgroundColor: "#10B981" }]} />
            <View style={[styles.distSegment, { flex: 14, backgroundColor: "#F59E0B" }]} />
            <View style={[styles.distSegment, { flex: 8, backgroundColor: "#EF4444" }]} />
          </View>
          <View style={styles.distLegendRow}>
            <View style={styles.distLegendItem}>
              <View style={[styles.dot, { backgroundColor: "#10B981" }]} />
              <Text style={[styles.distText, { color: colors.textMuted }]}>Normal: 78% (973)</Text>
            </View>
            <View style={styles.distLegendItem}>
              <View style={[styles.dot, { backgroundColor: "#F59E0B" }]} />
              <Text style={[styles.distText, { color: colors.textMuted }]}>Elevated: 14% (175)</Text>
            </View>
            <View style={styles.distLegendItem}>
              <View style={[styles.dot, { backgroundColor: "#EF4444" }]} />
              <Text style={[styles.distText, { color: colors.textMuted }]}>High: 8% (100)</Text>
            </View>
          </View>
        </Card>

        {/* Global SHAP Feature Importance */}
        <Card style={styles.shapCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {isHi ? "ग्लोबल SHAP फ़ीचर प्रभाव" : "Global SHAP Feature Importance"}
          </Text>
          <View style={styles.shapBars}>
            <View style={styles.shapRow}>
              <Text style={[styles.shapFeatureName, { color: colors.text }]}>Consecutive Deployment Days</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: "88%", backgroundColor: colors.primary }]} />
              </View>
              <Text style={[styles.shapValText, { color: colors.primary }]}>+0.42 SHAP</Text>
            </View>

            <View style={styles.shapRow}>
              <Text style={[styles.shapFeatureName, { color: colors.text }]}>Acute Sleep Deprivation</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: "74%", backgroundColor: "#3B82F6" }]} />
              </View>
              <Text style={[styles.shapValText, { color: "#3B82F6" }]}>+0.35 SHAP</Text>
            </View>

            <View style={styles.shapRow}>
              <Text style={[styles.shapFeatureName, { color: colors.text }]}>Self-Report vs Bio Divergence</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: "68%", backgroundColor: "#EF4444" }]} />
              </View>
              <Text style={[styles.shapValText, { color: "#EF4444" }]}>+0.31 SHAP</Text>
            </View>

            <View style={styles.shapRow}>
              <Text style={[styles.shapFeatureName, { color: colors.text }]}>High Altitude / Terrain Strain</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: "45%", backgroundColor: "#F59E0B" }]} />
              </View>
              <Text style={[styles.shapValText, { color: "#F59E0B" }]}>+0.21 SHAP</Text>
            </View>
          </View>
        </Card>

        {/* Search & Personnel Roster Header */}
        <View style={styles.rosterHeader}>
          <View>
            <Text style={[styles.rosterHeading, { color: colors.text }]}>
              {isHi ? "सक्रिय कार्मिक रोस्टर" : "Active Personnel Roster"}
            </Text>
            <Text style={[styles.rosterSub, { color: colors.textMuted }]}>
              {filteredRoster.length} personnel matching query
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setEnrollModalOpen(true)}
            style={[styles.enrollBtn, { backgroundColor: colors.primary }]}
          >
            <Plus size={14} color="#FFFFFF" />
            <Text style={styles.enrollBtnText}>{isHi ? "नया जोड़ें" : "Enroll"}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <Search size={16} color={colors.textMuted} />
          <TextInput
            placeholder={isHi ? "नाम, सेवा संख्या या बटालियन खोजें..." : "Search name, service ID, or coy..."}
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <X size={14} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filters */}
        <View style={styles.filterPills}>
          {(["ALL", "HIGH", "MODERATE", "LOW"] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.filterPill,
                {
                  backgroundColor: selectedFilter === filter ? colors.primary : colors.surface,
                  borderColor: selectedFilter === filter ? colors.primary : colors.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  { color: selectedFilter === filter ? "#FFFFFF" : colors.textMuted },
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Personnel Cards */}
        {filteredRoster.map((person) => (
          <Card key={person.id} style={styles.personCard}>
            <View style={styles.personTopRow}>
              <View style={styles.personIdentity}>
                <Text style={[styles.personName, { color: colors.text }]}>{person.name}</Text>
                <Text style={[styles.personService, { color: colors.textMuted }]}>
                  {person.rank} • {person.serviceNumber}
                </Text>
              </View>
              <Badge
                label={person.riskLevel.toUpperCase()}
                variant={
                  person.riskLevel === "Critical" || person.riskLevel === "High"
                    ? "error"
                    : person.riskLevel === "Moderate"
                    ? "warning"
                    : "success"
                }
              />
            </View>

            <View style={styles.personDetailsGrid}>
              <View style={styles.detailBox}>
                <Text style={[styles.detailKey, { color: colors.textMuted }]}>Unit & Coy</Text>
                <Text style={[styles.detailVal, { color: colors.text }]}>{person.unit}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={[styles.detailKey, { color: colors.textMuted }]}>Field Days</Text>
                <Text style={[styles.detailVal, { color: colors.text }]}>{person.consecutiveFieldDays}d</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={[styles.detailKey, { color: colors.textMuted }]}>AI Risk Score</Text>
                <Text
                  style={[
                    styles.detailVal,
                    {
                      color:
                        person.riskScore >= 75
                          ? "#EF4444"
                          : person.riskScore >= 50
                          ? "#F59E0B"
                          : "#10B981",
                      fontWeight: "800",
                    },
                  ]}
                >
                  {person.riskScore}/100
                </Text>
              </View>
            </View>

            {person.antiMaskingFlag && (
              <View style={styles.maskingNotice}>
                <AlertTriangle size={12} color="#EF4444" />
                <Text style={styles.maskingNoticeText}>Anti-Masking Divergence Triggered</Text>
              </View>
            )}

            <View style={styles.personActions}>
              <TouchableOpacity
                onPress={() => setTriageSubject(person)}
                style={[styles.triageBtn, { backgroundColor: `${colors.primary}18`, borderColor: `${colors.primary}40` }]}
              >
                <Stethoscope size={13} color={colors.primary} />
                <Text style={[styles.triageBtnText, { color: colors.primary }]}>Quick Triage</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/welfare-case")}
                style={[styles.caseBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
              >
                <Text style={[styles.caseBtnText, { color: colors.text }]}>View Full Case</Text>
                <ChevronRight size={13} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Enroll Personnel Modal */}
      <Modal visible={enrollModalOpen} transparent animationType="slide" onRequestClose={() => setEnrollModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Enroll Personnel in Telemetry</Text>
              <TouchableOpacity onPress={() => setEnrollModalOpen(false)}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Full Name</Text>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="e.g. Ct. Maninder Singh"
                placeholderTextColor={colors.textMuted}
                style={[styles.formInput, { color: colors.text, borderColor: colors.cardBorder }]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Rank & Designation</Text>
              <TextInput
                value={newRank}
                onChangeText={setNewRank}
                placeholder="e.g. Constable (GD)"
                placeholderTextColor={colors.textMuted}
                style={[styles.formInput, { color: colors.text, borderColor: colors.cardBorder }]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Assigned Unit / Company</Text>
              <TextInput
                value={newUnit}
                onChangeText={setNewUnit}
                placeholder="e.g. 74 Bn Bravo Company"
                placeholderTextColor={colors.textMuted}
                style={[styles.formInput, { color: colors.text, borderColor: colors.cardBorder }]}
              />
            </View>

            <Button
              title="Add to Battalion Roster"
              onPress={handleEnrollSubmit}
              variant="primary"
              style={{ marginTop: 12 }}
            />
          </View>
        </View>
      </Modal>

      {/* Quick Triage Modal */}
      <Modal visible={!!triageSubject} transparent animationType="fade" onRequestClose={() => setTriageSubject(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Initiate Medical Triage</Text>
              <TouchableOpacity onPress={() => setTriageSubject(null)}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {triageSubject && (
              <View style={styles.triageInfo}>
                <Text style={[styles.triageTarget, { color: colors.text }]}>
                  {triageSubject.rank} {triageSubject.name} ({triageSubject.serviceNumber})
                </Text>
                <Text style={[styles.triageSub, { color: colors.textMuted }]}>
                  Risk: {triageSubject.riskScore}/100 • {triageSubject.unit}
                </Text>
              </View>
            )}

            <Text style={[styles.formLabel, { color: colors.text, marginTop: 8 }]}>Triage Category:</Text>
            <View style={styles.triageOptions}>
              {["Workload Adjustment", "Mandatory R&R", "Counseling Session"].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setTriageCategory(cat)}
                  style={[
                    styles.triageOptBtn,
                    {
                      backgroundColor: triageCategory === cat ? `${colors.primary}20` : colors.surface,
                      borderColor: triageCategory === cat ? colors.primary : colors.cardBorder,
                    },
                  ]}
                >
                  <Text style={[styles.triageOptText, { color: triageCategory === cat ? colors.primary : colors.text }]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {triageSuccess ? (
              <View style={styles.successBanner}>
                <CheckCircle2 size={16} color="#10B981" />
                <Text style={styles.successBannerText}>Triage order dispatched to duty officer!</Text>
              </View>
            ) : (
              <Button
                title="Dispatch Triage Action"
                onPress={handleConfirmTriage}
                variant="primary"
                style={{ marginTop: 16 }}
              />
            )}
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
    gap: 16,
  },
  telemetryCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  telemetryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  telemetryTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  telemetryTagText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  telemetryStatsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  telemetryStat: {
    gap: 2,
  },
  statVal: {
    fontSize: 16,
    fontWeight: "800",
  },
  statKey: {
    fontSize: 10,
  },
  distributionCard: {
    padding: 16,
    borderRadius: 14,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  distributionBar: {
    height: 10,
    borderRadius: 5,
    flexDirection: "row",
    overflow: "hidden",
  },
  distSegment: {
    height: "100%",
  },
  distLegendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  distLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  distText: {
    fontSize: 11,
    fontWeight: "600",
  },
  shapCard: {
    padding: 16,
    borderRadius: 14,
    gap: 12,
  },
  shapBars: {
    gap: 10,
  },
  shapRow: {
    gap: 4,
  },
  shapFeatureName: {
    fontSize: 11,
    fontWeight: "700",
  },
  barTrack: {
    height: 8,
    backgroundColor: "rgba(150, 150, 150, 0.15)",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  shapValText: {
    fontSize: 10,
    fontWeight: "800",
    textAlign: "right",
  },
  rosterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  rosterHeading: {
    fontSize: 15,
    fontWeight: "800",
  },
  rosterSub: {
    fontSize: 11,
  },
  enrollBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  enrollBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  filterPills: {
    flexDirection: "row",
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  personCard: {
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  personTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  personIdentity: {
    gap: 2,
  },
  personName: {
    fontSize: 14,
    fontWeight: "800",
  },
  personService: {
    fontSize: 11,
  },
  personDetailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.1)",
  },
  detailBox: {
    gap: 2,
  },
  detailKey: {
    fontSize: 10,
  },
  detailVal: {
    fontSize: 12,
    fontWeight: "600",
  },
  maskingNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 6,
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderRadius: 6,
  },
  maskingNoticeText: {
    color: "#EF4444",
    fontSize: 10,
    fontWeight: "700",
  },
  personActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  triageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  triageBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  caseBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  caseBtnText: {
    fontSize: 11,
    fontWeight: "600",
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
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  triageInfo: {
    padding: 10,
    backgroundColor: "rgba(150, 150, 150, 0.08)",
    borderRadius: 8,
    gap: 2,
  },
  triageTarget: {
    fontSize: 13,
    fontWeight: "800",
  },
  triageSub: {
    fontSize: 11,
  },
  triageOptions: {
    gap: 8,
  },
  triageOptBtn: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  triageOptText: {
    fontSize: 12,
    fontWeight: "700",
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderRadius: 8,
    marginTop: 8,
  },
  successBannerText: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "700",
  },
});
