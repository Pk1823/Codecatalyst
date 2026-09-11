import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { Header } from "../components/ui/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { RiskGauge } from "../components/ui/RiskGauge";
import { useTheme } from "../contexts/ThemeContext";
import { WelfareService } from "../services/welfare";
import { WelfareCase } from "../types";
import {
  ArrowLeft,
  Save,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  User,
  Activity,
  FileText,
} from "lucide-react-native";

export default function CaseDetailsScreen() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const { colors } = useTheme();
  const router = useRouter();

  const [caseData, setCaseData] = useState<WelfareCase | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [status, setStatus] = useState<string>("Active Review");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Prescribe Support Action Modal State
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState("Duty Pacing");
  const [actionTitle, setActionTitle] = useState("");
  const [actionDesc, setActionDesc] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const loadCase = useCallback(async () => {
    if (caseId) {
      const data = await WelfareService.getCaseById(caseId);
      if (data) {
        setCaseData(data);
        setStatus(data.status);
      }
    }
  }, [caseId]);

  useEffect(() => {
    loadCase();
  }, [loadCase]);

  if (!caseData) {
    return (
      <ScreenContainer>
        <Header title="Case Dossier" subtitle="Loading confidential file..." />
      </ScreenContainer>
    );
  }

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    const ok = await WelfareService.updateCaseNotes(caseData.id, "", newStatus);
    if (ok) {
      setCaseData((prev) => (prev ? { ...prev, status: newStatus } : null));
      Alert.alert("Status Updated", `Case status progressed to "${newStatus}".`);
    }
  };

  const handleAddNote = async () => {
    if (!newNoteText.trim()) {
      Alert.alert("Required", "Please enter clinical note remarks.");
      return;
    }

    setIsSavingNote(true);
    const ok = await WelfareService.updateCaseNotes(caseData.id, newNoteText.trim(), status);
    setIsSavingNote(false);

    if (ok) {
      const addedNote = {
        id: `note-${Date.now()}`,
        authorName: "Dr. Aarti Sharma (CMO)",
        createdAt: new Date().toISOString().split("T")[0],
        text: newNoteText.trim(),
        isConfidential: true,
      };

      setCaseData((prev) => {
        if (!prev) return null;
        const notes = [addedNote, ...(prev.caseNotes || [])];
        return {
          ...prev,
          caseNotes: notes,
          clinicalNotes: addedNote.text,
        };
      });

      setNewNoteText("");
      Alert.alert("Clinical Note Saved", "Confidential observation logged to case dossier.");
    } else {
      Alert.alert("Notice", "Saved locally in case history.");
    }
  };

  const handlePrescribeAction = async () => {
    if (!actionTitle.trim() || !actionDesc.trim()) {
      Alert.alert("Required Fields", "Please provide an action title and description.");
      return;
    }

    setIsSubmittingAction(true);
    const ok = await WelfareService.addSupportAction(caseData.id, {
      actionType,
      title: actionTitle.trim(),
      description: actionDesc.trim(),
    });
    setIsSubmittingAction(false);

    if (ok) {
      const newAction = {
        id: `act-${Date.now().toString().slice(-4)}`,
        caseId: caseData.id,
        actionType,
        title: actionTitle.trim(),
        description: actionDesc.trim(),
        status: "Active",
        officerName: "Dr. Aarti Sharma",
      };

      setCaseData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: "Rest Rotation",
          supportActions: [newAction, ...(prev.supportActions || [])],
        };
      });
      setStatus("Rest Rotation");

      setIsActionModalOpen(false);
      setActionTitle("");
      setActionDesc("");
      Alert.alert("Support Action Prescribed", `${actionTitle} has been authorized for this personnel.`);
    } else {
      Alert.alert("Error", "Could not prescribe action at this moment.");
    }
  };

  return (
    <ScreenContainer>
      {/* Back Link */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={16} color={colors.primary} />
        <Text style={[styles.backText, { color: colors.primary }]}>Back to Triage Queue</Text>
      </TouchableOpacity>

      {/* Header */}
      <Header
        title={`${caseData.rank} ${caseData.name}`}
        subtitle={`${caseData.serviceNumber} • Dossier Ref: ${caseData.id}`}
      />

      {/* Overview & Risk Assessment Card */}
      <Card variant="elevated" style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Clinical Fatigue & Risk Index</Text>
          <Badge
            label={caseData.priority}
            variant={caseData.priority === "HIGH" ? "danger" : "warning"}
          />
        </View>

        <RiskGauge
          score={caseData.riskScore}
          category={caseData.riskScore > 65 ? "Elevated Fatigue" : caseData.riskScore > 45 ? "Moderate Stress" : "Manageable Load"}
        />

        {caseData.riskScore > 65 && (
          <View style={[styles.breakdownBox, { backgroundColor: "rgba(239, 68, 68, 0.12)", borderColor: colors.danger }]}>
            <AlertTriangle size={16} color={colors.danger} />
            <Text style={[styles.breakdownText, { color: colors.danger }]}>
              Fatigue Escalation Warning: High cumulative sleep deficit detected. Non-punitive rest rotation advised.
            </Text>
          </View>
        )}

        <View style={[styles.unitBox, { backgroundColor: colors.surface }]}>
          <Text style={[styles.unitLabel, { color: colors.textMuted }]}>Assigned Deployment Unit:</Text>
          <Text style={[styles.unitValue, { color: colors.text }]}>{caseData.unitName}</Text>
        </View>
      </Card>

      {/* AI Explainability (SHAP Factors) */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerIconRow}>
            <Sparkles size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>AI Explainability Factors (SHAP)</Text>
          </View>
          <Badge label="Explainable AI" variant="neutral" size="sm" />
        </View>

        <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
          Identified operational fatigue drivers based on voluntary telemetry.
        </Text>

        {(caseData.riskFactors || []).map((factor, idx) => (
          <View key={idx} style={[styles.factorRow, { borderColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.factorName, { color: colors.text }]}>{factor.featureName}</Text>
              <Text style={[styles.factorDesc, { color: colors.textMuted }]}>{factor.description}</Text>
            </View>
            <Badge
              label={`${Math.round((factor.contributionWeight || 0.25) * 100)}% impact`}
              variant={Math.abs(factor.contributionWeight || 0) >= 0.3 ? "danger" : "warning"}
              size="sm"
            />
          </View>
        ))}
      </Card>

      {/* AI Proactive Recommendations */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerIconRow}>
            <Activity size={16} color={colors.success} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Clinical Recommendations</Text>
          </View>
          <Badge label="Non-Punitive" variant="success" size="sm" />
        </View>

        {(caseData.recommendations || []).map((rec, idx) => (
          <View key={idx} style={[styles.recCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.recHeader}>
              <Text style={[styles.recCategory, { color: colors.primary }]}>{rec.category || "Care Plan"}</Text>
              <Badge label={rec.priority || "High"} variant={rec.priority === "High" ? "danger" : "neutral"} size="sm" />
            </View>
            <Text style={[styles.recTitle, { color: colors.text }]}>{rec.title}</Text>
            {rec.description && (
              <Text style={[styles.recDesc, { color: colors.textMuted }]}>{rec.description}</Text>
            )}
          </View>
        ))}
      </Card>

      {/* Support Actions / Interventions (Web Feature on Mobile) */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerIconRow}>
            <CheckCircle2 size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Prescribed Support Actions</Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsActionModalOpen(true)}
            style={[styles.smallActionBtn, { backgroundColor: colors.primary }]}
          >
            <Plus size={14} color="#FFFFFF" />
            <Text style={styles.smallActionBtnText}>Prescribe</Text>
          </TouchableOpacity>
        </View>

        {(!caseData.supportActions || caseData.supportActions.length === 0) ? (
          <Text style={[styles.emptyNote, { color: colors.textMuted }]}>
            No active support actions logged. Tap "+ Prescribe" to order duty pacing, sleep protocol, or leave.
          </Text>
        ) : (
          caseData.supportActions.map((action, idx) => (
            <View key={action.id || idx} style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.actionCardHeader}>
                <Badge label={action.actionType || "Support"} variant="info" size="sm" />
                <Badge label={action.status || "Active"} variant="success" size="sm" />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
              <Text style={[styles.actionDesc, { color: colors.textMuted }]}>{action.description}</Text>
              <View style={styles.actionFooter}>
                <Stethoscope size={12} color={colors.primary} />
                <Text style={[styles.actionOfficer, { color: colors.textMuted }]}>
                  Authorized by {action.officerName || "Dr. Aarti Sharma"}
                </Text>
              </View>
            </View>
          ))
        )}
      </Card>

      {/* Case Notes & Clinical File */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerIconRow}>
            <FileText size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Confidential Clinical Notes</Text>
          </View>
          <Badge label="DOCTOR PRIVILEGED" variant="info" size="sm" />
        </View>

        {/* Existing Notes History */}
        {(caseData.caseNotes || []).map((n, idx) => (
          <View key={n.id || idx} style={[styles.noteEntry, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.noteHeader}>
              <Text style={[styles.noteAuthor, { color: colors.text }]}>{n.authorName || "Welfare Officer"}</Text>
              <Text style={[styles.noteDate, { color: colors.textMuted }]}>{n.createdAt || n.date}</Text>
            </View>
            <Text style={[styles.noteBody, { color: colors.text }]}>{n.text}</Text>
          </View>
        ))}

        {/* Add Note Form */}
        <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 14 }]}>
          ADD CONFIDENTIAL CLINICAL OBSERVATION
        </Text>
        <TextInput
          style={[
            styles.notesInput,
            { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
          ]}
          multiline
          numberOfLines={4}
          value={newNoteText}
          onChangeText={setNewNoteText}
          placeholder="Document therapy progress, recovery metrics, or recommended duty adjustments..."
          placeholderTextColor={colors.textMuted}
        />

        <Button
          title="Save Clinical Note"
          onPress={handleAddNote}
          loading={isSavingNote}
          icon={<Save size={16} color="#FFFFFF" />}
          style={{ marginTop: 10 }}
        />
      </Card>

      {/* Case Status Disposition */}
      <Card style={styles.sectionCard}>
        <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 10 }]}>
          Case Status Disposition
        </Text>
        <View style={styles.statusRow}>
          {(["Active Review", "Under Counseling", "Rest Rotation", "Medical Stand-Down", "Resolved"] as const).map(
            (s) => (
              <TouchableOpacity
                key={s}
                onPress={() => handleStatusChange(s)}
                style={[
                  styles.statusPill,
                  {
                    backgroundColor: status === s ? colors.primary : colors.surface,
                    borderColor: status === s ? colors.primary : colors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    { color: status === s ? "#FFFFFF" : colors.textMuted },
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </Card>

      {/* Security & DPDP Seal */}
      <View style={styles.securitySeal}>
        <ShieldCheck size={16} color={colors.accent} />
        <Text style={[styles.securityText, { color: colors.textMuted }]}>
          Encrypted with AES-256 GCM • Legally sealed under DPDP Act 2023
        </Text>
      </View>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: PRESCRIBE SUPPORT ACTION / INTERVENTION                */}
      {/* ------------------------------------------------------------- */}
      <Modal visible={isActionModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Prescribe Support Action</Text>
              <TouchableOpacity onPress={() => setIsActionModalOpen(false)}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>INTERVENTION CATEGORY</Text>
              <View style={styles.actionTypeRow}>
                {(["Duty Pacing", "Rest Stand-Down", "Counselor Referral", "Family Leave", "Sleep Hygiene Protocol"] as const).map(
                  (t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setActionType(t)}
                      style={[
                        styles.actionTypePill,
                        {
                          backgroundColor: actionType === t ? colors.primary : colors.surface,
                          borderColor: actionType === t ? colors.primary : colors.cardBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.actionTypePillText,
                          { color: actionType === t ? "#FFFFFF" : colors.textMuted },
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 14 }]}>ACTION TITLE</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                value={actionTitle}
                onChangeText={setActionTitle}
                placeholder="e.g. 48h Shift Pacing & Sleep Recovery"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 14 }]}>PRESCRIPTION INSTRUCTIONS</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  styles.modalTextArea,
                  { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
                ]}
                multiline
                numberOfLines={4}
                value={actionDesc}
                onChangeText={setActionDesc}
                placeholder="Specific operational restrictions, sleep scheduling guidelines, or counselor assignments..."
                placeholderTextColor={colors.textMuted}
              />

              <Button
                title="Prescribe & Execute Action"
                onPress={handlePrescribeAction}
                loading={isSubmittingAction}
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  backText: {
    fontSize: 13,
    fontWeight: "700",
  },
  sectionCard: {
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  sectionSubtitle: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 16,
  },
  breakdownBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
  },
  breakdownText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  unitBox: {
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  unitLabel: {
    fontSize: 11,
  },
  unitValue: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  factorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  factorName: {
    fontSize: 12,
    fontWeight: "700",
  },
  factorDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  recCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  recHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  recCategory: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  recTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  recDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  smallActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  smallActionBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  emptyNote: {
    fontSize: 12,
    fontStyle: "italic",
    paddingVertical: 6,
  },
  actionCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  actionCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  actionDesc: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },
  actionFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 6,
  },
  actionOfficer: {
    fontSize: 10,
  },
  noteEntry: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  noteAuthor: {
    fontSize: 11,
    fontWeight: "700",
  },
  noteDate: {
    fontSize: 10,
  },
  noteBody: {
    fontSize: 12,
    lineHeight: 16,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  notesInput: {
    minHeight: 80,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top",
    fontSize: 13,
    lineHeight: 18,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  securitySeal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  securityText: {
    fontSize: 11,
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
  actionTypeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  actionTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  actionTypePillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 10,
  },
});
