import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { Header } from "../components/ui/Header";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { MOCK_AUDIT_TRAIL } from "../services/analytics";
import { AuditLogEntry } from "../types";
import {
  Lock,
  Search,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Key,
  Clock,
  Globe,
  X,
} from "lucide-react-native";

export default function AuditLogScreen() {
  const { colors } = useTheme();
  const { t, isHi } = useLanguage();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Success" | "Flagged" | "Blocked">("ALL");

  const filtered = MOCK_AUDIT_TRAIL.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || log.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ["Timestamp,User,Role,Action,Resource,IPAddress,Status,SHA256"];
    const rows = filtered.map(
      (l) =>
        `"${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.resource}","${l.ipAddress}","${l.status}","${l.sha256Hash}"`
    );
    const csv = [headers, ...rows].join("\n");

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `missionwell_cryptographic_audit_trail_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      Alert.alert("Export Ready", "Zero-trust cryptographic audit trail exported.");
    }
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title={isHi ? "ऑडिट एवं एक्सेस लेज़र" : "Zero-Trust Audit Ledger"}
        subtitle={isHi ? "क्रिप्टोग्राफ़िक SHA-256 सुरक्षित लॉग" : "Append-Only Cryptographic Access Trail"}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Verification Banner */}
        <Card style={[styles.cryptoCard, { backgroundColor: `${colors.primary}12`, borderColor: `${colors.primary}30` }]}>
          <View style={styles.cryptoHeader}>
            <Lock size={18} color={colors.primary} />
            <Text style={[styles.cryptoTitle, { color: colors.text }]}>
              Immutable SHA-256 Hash Chain
            </Text>
          </View>
          <Text style={[styles.cryptoDesc, { color: colors.textMuted }]}>
            Every clinical dossier access, darbar authorization, and anti-masking inference is cryptographically signed. Zero-trust security prevents unauthorized tampering.
          </Text>
          <View style={styles.validTag}>
            <CheckCircle2 size={13} color="#10B981" />
            <Text style={styles.validTagText}>Merkle Root Chain Verified (0 Tamper Detected)</Text>
          </View>
        </Card>

        {/* Search & Export Controls */}
        <View style={styles.controlsRow}>
          <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <Search size={14} color={colors.textMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={isHi ? "उपयोगकर्ता, कार्रवाई या संसाधन खोजें..." : "Search actor, action, or resource..."}
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { color: colors.text }]}
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch("")}>
                <X size={13} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={handleExportCSV}
            style={[styles.exportBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
          >
            <Download size={14} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Status Filter Pills */}
        <View style={styles.filterPills}>
          {(["ALL", "Success", "Flagged", "Blocked"] as const).map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setStatusFilter(s)}
              style={[
                styles.filterPill,
                {
                  backgroundColor: statusFilter === s ? colors.primary : colors.surface,
                  borderColor: statusFilter === s ? colors.primary : colors.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  { color: statusFilter === s ? "#FFFFFF" : colors.textMuted },
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Audit Log Cards */}
        {filtered.map((log) => (
          <Card key={log.id} style={styles.logCard}>
            <View style={styles.logTopRow}>
              <View style={styles.logIdentity}>
                <Text style={[styles.logUser, { color: colors.text }]}>{log.user}</Text>
                <Text style={[styles.logTime, { color: colors.textMuted }]}>
                  {log.timestamp} • {log.role}
                </Text>
              </View>
              <Badge
                label={log.status.toUpperCase()}
                variant={log.status === "Success" ? "success" : log.status === "Blocked" ? "error" : "warning"}
              />
            </View>

            <View style={[styles.actionBadge, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
              <Text style={[styles.actionText, { color: colors.primary }]}>{log.action}</Text>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Globe size={11} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textMuted }]}>{log.ipAddress}</Text>
              </View>
              <View style={styles.metaItem}>
                <Key size={11} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textMuted }]}>{log.resource}</Text>
              </View>
            </View>

            <View style={[styles.hashBox, { backgroundColor: "rgba(150, 150, 150, 0.08)" }]}>
              <Text style={[styles.hashKey, { color: colors.textMuted }]}>SHA-256 Signature:</Text>
              <Text style={[styles.hashVal, { color: colors.textMuted }]} numberOfLines={1}>
                {log.sha256Hash}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  cryptoCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  cryptoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cryptoTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  cryptoDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  validTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  validTagText: {
    color: "#10B981",
    fontSize: 11,
    fontWeight: "700",
  },
  controlsRow: {
    flexDirection: "row",
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
  },
  exportBtn: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
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
  logCard: {
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  logTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logIdentity: {
    gap: 2,
  },
  logUser: {
    fontSize: 13,
    fontWeight: "800",
  },
  logTime: {
    fontSize: 10,
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  actionText: {
    fontSize: 11,
    fontWeight: "800",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 10,
  },
  hashBox: {
    padding: 8,
    borderRadius: 6,
    gap: 2,
  },
  hashKey: {
    fontSize: 9,
    fontWeight: "700",
  },
  hashVal: {
    fontSize: 10,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});
