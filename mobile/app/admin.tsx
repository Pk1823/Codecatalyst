import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { Header } from "../components/ui/Header";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
  Server,
  Users,
  Lock,
  Activity,
  History,
  ShieldCheck,
  Cpu,
  Database,
  Radio,
  CheckCircle2,
  RefreshCw,
} from "lucide-react-native";

export default function AdminScreen() {
  const { colors } = useTheme();
  const { isHi } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();

  const [aiTelemetrySync, setAiTelemetrySync] = useState(true);
  const [auditLogActive, setAuditLogActive] = useState(true);
  const [darbarAutoRouting, setDarbarAutoRouting] = useState(true);

  const personas = [
    { name: "Ct. Vikramaditya Singh", role: "PERSONNEL", rank: "Constable (GD)", status: "Active Session" },
    { name: "Dr. Ananya Roy", role: "WELFARE_OFFICER", rank: "Senior Medical Officer", status: "Active Session" },
    { name: "Col. R. S. Rathore", role: "COMMANDER", rank: "Commanding Officer", status: "Active Session" },
    { name: "Admin Security Office", role: "ADMIN", rank: "Director of Cyber Ops", status: "Active Session" },
  ];

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title={isHi ? "प्रशासन कंसोल" : "System Admin Console"}
        subtitle={isHi ? "सिस्टम स्वास्थ्य, सेवा खाते व डायग्नोस्टिक्स" : "System Health, Security Profiles & Core Clusters"}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 5 Core Stat Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Users size={16} color={colors.primary} />
            <Text style={[styles.statVal, { color: colors.text }]}>4 Roles</Text>
            <Text style={[styles.statKey, { color: colors.textMuted }]}>Evaluator Personas</Text>
          </Card>

          <Card style={styles.statCard}>
            <Server size={16} color="#10B981" />
            <Text style={[styles.statVal, { color: "#10B981" }]}>99.98%</Text>
            <Text style={[styles.statKey, { color: colors.textMuted }]}>Cluster Health</Text>
          </Card>

          <Card style={styles.statCard}>
            <Activity size={16} color="#3B82F6" />
            <Text style={[styles.statVal, { color: colors.text }]}>5 Coys</Text>
            <Text style={[styles.statKey, { color: colors.textMuted }]}>Tracked Units</Text>
          </Card>

          <Card style={styles.statCard}>
            <History size={16} color="#F59E0B" />
            <Text style={[styles.statVal, { color: colors.text }]}>1,420</Text>
            <Text style={[styles.statKey, { color: colors.textMuted }]}>24h Audit Queries</Text>
          </Card>
        </View>

        {/* Core Infrastructure Diagnostics */}
        <Card style={styles.clusterCard}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleRow}>
              <Cpu size={16} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Core Cluster Status</Text>
            </View>
            <Badge label="OPTIMAL" variant="success" />
          </View>

          <View style={styles.serviceRow}>
            <View style={styles.serviceInfo}>
              <Text style={[styles.serviceName, { color: colors.text }]}>FastAPI AI Inference Engine</Text>
              <Text style={[styles.serviceMeta, { color: colors.textMuted }]}>LightGBM v4 • 12ms In-Memory Microservice</Text>
            </View>
            <Badge label="PORT 8000" variant="primary" />
          </View>

          <View style={styles.serviceRow}>
            <View style={styles.serviceInfo}>
              <Text style={[styles.serviceName, { color: colors.text }]}>Express & Prisma Telemetry Backend</Text>
              <Text style={[styles.serviceMeta, { color: colors.textMuted }]}>PostgreSQL Pool • 14ms Response Time</Text>
            </View>
            <Badge label="PORT 5001" variant="primary" />
          </View>

          <View style={styles.serviceRow}>
            <View style={styles.serviceInfo}>
              <Text style={[styles.serviceName, { color: colors.text }]}>Next.js & Expo Edge Gateway</Text>
              <Text style={[styles.serviceMeta, { color: colors.textMuted }]}>OAuth 2.0 PKCE • Cross-Platform Sync</Text>
            </View>
            <Badge label="ACTIVE" variant="success" />
          </View>
        </Card>

        {/* Authorized Service Accounts */}
        <Card style={styles.accountsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleRow}>
              <Lock size={16} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Authorized Personas</Text>
            </View>
          </View>

          {personas.map((p, idx) => (
            <View key={idx} style={styles.accountRow}>
              <View style={styles.accountIdentity}>
                <Text style={[styles.accountName, { color: colors.text }]}>{p.name}</Text>
                <Text style={[styles.accountRank, { color: colors.textMuted }]}>{p.rank}</Text>
              </View>
              <Badge
                label={p.role}
                variant={
                  p.role === "ADMIN"
                    ? "error"
                    : p.role === "COMMANDER"
                    ? "warning"
                    : p.role === "WELFARE_OFFICER"
                    ? "success"
                    : "primary"
                }
              />
            </View>
          ))}
        </Card>

        {/* System Daemon Automation Toggles */}
        <Card style={styles.toggleCard}>
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 4 }]}>
            Daemon Pipeline Settings
          </Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Continuous AI Telemetry Sync</Text>
              <Text style={[styles.toggleSub, { color: colors.textMuted }]}>
                Feed live duty hours into LightGBM inference
              </Text>
            </View>
            <Switch
              value={aiTelemetrySync}
              onValueChange={setAiTelemetrySync}
              trackColor={{ false: colors.cardBorder, true: colors.primary }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Cryptographic Audit Logging</Text>
              <Text style={[styles.toggleSub, { color: colors.textMuted }]}>
                Enforce SHA-256 signatures on all clinician requests
              </Text>
            </View>
            <Switch
              value={auditLogActive}
              onValueChange={setAuditLogActive}
              trackColor={{ false: colors.cardBorder, true: colors.primary }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Confidential Darbar Routing</Text>
              <Text style={[styles.toggleSub, { color: colors.textMuted }]}>
                Route soldier requests directly to CO without middleman
              </Text>
            </View>
            <Switch
              value={darbarAutoRouting}
              onValueChange={setDarbarAutoRouting}
              trackColor={{ false: colors.cardBorder, true: colors.primary }}
            />
          </View>
        </Card>

        {/* Quick Links */}
        <View style={styles.linksRow}>
          <Button
            title="Inspect Audit Ledger"
            onPress={() => router.push("/audit")}
            variant="outline"
            style={{ flex: 1 }}
          />
          <Button
            title="Welfare Reports"
            onPress={() => router.push("/reports")}
            variant="outline"
            style={{ flex: 1 }}
          />
        </View>
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  statVal: {
    fontSize: 16,
    fontWeight: "800",
  },
  statKey: {
    fontSize: 10,
  },
  clusterCard: {
    padding: 14,
    borderRadius: 14,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150, 150, 150, 0.1)",
  },
  serviceInfo: {
    flex: 1,
    gap: 2,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: "700",
  },
  serviceMeta: {
    fontSize: 10,
  },
  accountsCard: {
    padding: 14,
    borderRadius: 14,
    gap: 12,
  },
  accountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150, 150, 150, 0.1)",
  },
  accountIdentity: {
    gap: 2,
  },
  accountName: {
    fontSize: 12,
    fontWeight: "700",
  },
  accountRank: {
    fontSize: 10,
  },
  toggleCard: {
    padding: 14,
    borderRadius: 14,
    gap: 14,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  toggleTextCol: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  toggleSub: {
    fontSize: 10,
  },
  linksRow: {
    flexDirection: "row",
    gap: 10,
  },
});
