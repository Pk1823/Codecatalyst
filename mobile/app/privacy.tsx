import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { Header } from "../components/ui/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  History,
  FileCheck,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react-native";

const AUDIT_TRAIL = [
  {
    action: "VOLUNTARY_ASSESSMENT_RECORDED",
    timestamp: "2026-09-10 18:24:12 IST",
    actor: "P-1024 (Personnel)",
    target: "Survey Ref: EVA-MBL-918231",
    hash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  },
  {
    action: "BUDDY_PAIR_PING_LOGGED",
    timestamp: "2026-09-10 14:30:00 IST",
    actor: "P-1024 (Personnel)",
    target: "Buddy: Ct. Surinder Singh (Safe & Ready)",
    hash: "sha256:326693a749eb7ea43e86c0e86b76174a7b75ec651b14a93821a8d0b2fcf7d729",
  },
  {
    action: "CLINICAL_NOTE_SEALED",
    timestamp: "2026-09-08 11:15:44 IST",
    actor: "Dr. Aarti Sharma (CMO)",
    target: "Privileged Dossier Ref: CASE-2026-081",
    hash: "sha256:a140f81d11105c879d01217036a946c5185d26a27e7f78c85c0704dd2b5f6a96",
  },
];

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const [consentActive, setConsentActive] = useState(true);

  const handleDownloadData = () => {
    Alert.alert(
      "Data Archive Generated",
      "An encrypted, password-protected JSON archive of all your self-assessments and buddy-check history has been prepared."
    );
  };

  const handleRevokeConsent = () => {
    Alert.alert(
      "Revoke Voluntary Telemetry?",
      "Under DPDP Act 2023, this will purge your historical voluntary wellness ratings while preserving core military duty rosters.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Purge",
          style: "destructive",
          onPress: () => {
            setConsentActive(false);
            Alert.alert("Consent Revoked", "Your voluntary telemetry data has been marked for secure cryptographic erasure.");
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <ArrowLeft size={16} color={colors.primary} />
        <Text style={[styles.backBtnText, { color: colors.primary }]}>Back to Hub</Text>
      </TouchableOpacity>

      <Header
        title="DPDP Privacy & Consent"
        subtitle="Digital Personal Data Protection Act 2023 Compliance Center"
      />

      {/* Statutory Status Banner */}
      <Card variant="elevated" style={styles.statutoryCard}>
        <View style={styles.statusRow}>
          <View style={[styles.shieldBox, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
            <ShieldCheck size={28} color="#10B981" />
          </View>
          <View style={styles.statusMeta}>
            <Text style={[styles.statusHeading, { color: colors.text }]}>Zero-Stigma Protection Active</Text>
            <Text style={[styles.statusDesc, { color: colors.textMuted }]}>
              Service ID: {user?.serviceId} • Non-Punitive Doctrine
            </Text>
            <Badge label="LEGALLY ENFORCED" variant="success" size="sm" style={styles.statusBadge} />
          </View>
        </View>
      </Card>

      {/* Statutory Rights */}
      <Card style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Statutory Rights under DPDP Act 2023</Text>

        <View style={styles.rightsList}>
          <View style={[styles.rightItem, { backgroundColor: colors.surface }]}>
            <FileCheck size={18} color={colors.primary} />
            <View style={styles.rightContent}>
              <Text style={[styles.rightTitle, { color: colors.text }]}>Non-Punitive ACR/APAR Shield</Text>
              <Text style={[styles.rightDesc, { color: colors.textMuted }]}>
                Wellness responses are strictly segregated from promotion boards, annual confidential appraisal reports, and postings.
              </Text>
            </View>
          </View>

          <View style={[styles.rightItem, { backgroundColor: colors.surface }]}>
            <Lock size={18} color={colors.warning} />
            <View style={styles.rightContent}>
              <Text style={[styles.rightTitle, { color: colors.text }]}>Doctor-Patient Privilege</Text>
              <Text style={[styles.rightDesc, { color: colors.textMuted }]}>
                Commanding Officers receive anonymized company-level readiness ratios only. Individual psychiatric and counseling notes are locked.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonsRow}>
          <Button
            title="Download My Data (JSON)"
            variant="secondary"
            size="sm"
            onPress={handleDownloadData}
            icon={<Download size={14} color={colors.text} />}
            style={styles.actionBtn}
          />
          <Button
            title={consentActive ? "Revoke Consent" : "Consent Revoked"}
            variant="danger"
            size="sm"
            disabled={!consentActive}
            onPress={handleRevokeConsent}
            icon={<Trash2 size={14} color="#FFFFFF" />}
            style={styles.actionBtn}
          />
        </View>
      </Card>

      {/* Immutable Cryptographic Audit Log */}
      <Card style={styles.sectionCard}>
        <View style={styles.auditHeader}>
          <View style={styles.auditTitleRow}>
            <History size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Immutable Audit Trail</Text>
          </View>
          <Badge label="SHA-256 HASHED" variant="neutral" size="sm" />
        </View>

        <Text style={[styles.auditDesc, { color: colors.textMuted }]}>
          Every access and clinical event is cryptographically sealed in an append-only audit trail.
        </Text>

        {AUDIT_TRAIL.map((item, i) => (
          <View key={i} style={[styles.auditItem, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <View style={styles.auditItemTop}>
              <Text style={[styles.actionTag, { color: colors.primary }]}>{item.action}</Text>
              <Text style={[styles.auditTime, { color: colors.textMuted }]}>{item.timestamp}</Text>
            </View>
            <Text style={[styles.auditTarget, { color: colors.text }]}>{item.target}</Text>
            <Text style={[styles.auditActor, { color: colors.textMuted }]}>Actor: {item.actor}</Text>
            <Text style={[styles.auditHash, { color: colors.textMuted }]} numberOfLines={1}>
              {item.hash}
            </Text>
          </View>
        ))}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  statutoryCard: {
    padding: 16,
    marginBottom: 14,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  shieldBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  statusMeta: {
    flex: 1,
  },
  statusHeading: {
    fontSize: 15,
    fontWeight: "800",
  },
  statusDesc: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: "flex-start",
  },
  sectionCard: {
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },
  rightsList: {
    gap: 10,
    marginBottom: 14,
  },
  rightItem: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    gap: 12,
  },
  rightContent: {
    flex: 1,
  },
  rightTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  rightDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
  auditHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  auditTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  auditDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 12,
  },
  auditItem: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  auditItemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  actionTag: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  auditTime: {
    fontSize: 9,
  },
  auditTarget: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
  },
  auditActor: {
    fontSize: 10,
    marginBottom: 2,
  },
  auditHash: {
    fontSize: 9,
    fontFamily: Platform.OS === "web" ? "'JetBrains Mono', monospace" : "JetBrainsMono-Regular",
  },
});
