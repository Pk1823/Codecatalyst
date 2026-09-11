import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { Header } from "../components/ui/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useTheme } from "../contexts/ThemeContext";
import { useForce } from "../contexts/ForceContext";
import {
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react-native";

interface ReportItem {
  id: string;
  title: string;
  category: "Operational" | "Predictive" | "Workload" | "Rehabilitation" | "Executive";
  description: string;
  frequency: string;
  classification: string;
}

const REPORTS_CATALOG: ReportItem[] = [
  {
    id: "rep-01",
    title: "Unit Welfare & Morale Assessment",
    category: "Operational",
    description: "Battalion-by-battalion analysis of duty hours, rest intervals, and voluntary self-reporting.",
    frequency: "Weekly",
    classification: "CONFIDENTIAL // WELFARE USE ONLY",
  },
  {
    id: "rep-02",
    title: "Risk Trend & Fatigue Trajectory",
    category: "Predictive",
    description: "Time-series evaluation of cumulative fatigue, sleep deficits, and forward deployment stress.",
    frequency: "Monthly",
    classification: "RESTRICTED // CMO OVERSIGHT",
  },
  {
    id: "rep-03",
    title: "Force Workload & Duty Roster Audit",
    category: "Workload",
    description: "Operational shift equity, night patrol duration, and perimeter stand-to distribution.",
    frequency: "Bi-Weekly",
    classification: "OPERATIONAL // COMMAND STAFF",
  },
  {
    id: "rep-04",
    title: "Welfare Intervention & Case Outcomes",
    category: "Rehabilitation",
    description: "Summary of duty reassignments, rest stand-downs, and psychological counseling impact.",
    frequency: "Monthly",
    classification: "CONFIDENTIAL // MEDICAL CORPS",
  },
  {
    id: "rep-05",
    title: "Sector Monthly Welfare Briefing",
    category: "Executive",
    description: "Comprehensive executive briefing prepared for Sector HQ Commandant and Welfare Directorate.",
    frequency: "Monthly",
    classification: "SECRET // EYES ONLY COMMANDER",
  },
];

export default function ReportsScreen() {
  const { colors } = useTheme();
  const { currentForce } = useForce();
  const router = useRouter();

  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<string | null>(null);

  const handleDownload = (format: "csv" | "pdf" | "html") => {
    setDownloadFormat(format);
    setTimeout(() => {
      setDownloadFormat(null);
      Alert.alert(
        "Report Exported",
        `Official dossier '${selectedReport?.title}' generated in ${format.toUpperCase()} format with digital security stamp.`
      );
    }, 1000);
  };

  return (
    <ScreenContainer>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <ArrowLeft size={16} color={colors.primary} />
        <Text style={[styles.backBtnText, { color: colors.primary }]}>Back to Hub</Text>
      </TouchableOpacity>

      <Header
        title="Official Reports & Dossiers"
        subtitle="MHA Compliant Operational & Clinical Welfare Exports"
      />

      {/* Catalog List */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Welfare Intelligence Dossiers</Text>

      {REPORTS_CATALOG.map((rep) => (
        <Card key={rep.id} style={styles.reportCard}>
          <View style={styles.repHeader}>
            <View style={styles.repMeta}>
              <Text style={[styles.repTitle, { color: colors.text }]}>{rep.title}</Text>
              <Text style={[styles.repFreq, { color: colors.textMuted }]}>
                Cycle: {rep.frequency} • Classification: {rep.classification}
              </Text>
            </View>
            <Badge
              label={rep.category}
              variant={rep.category === "Predictive" ? "warning" : rep.category === "Executive" ? "danger" : "info"}
              size="sm"
            />
          </View>

          <Text style={[styles.repDesc, { color: colors.textMuted }]}>{rep.description}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={() => setSelectedReport(rep)}
              style={[styles.previewBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
            >
              <FileText size={14} color={colors.primary} />
              <Text style={[styles.previewBtnText, { color: colors.primary }]}>View Dossier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedReport(rep);
                handleDownload("csv");
              }}
              style={[styles.exportBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
            >
              <FileSpreadsheet size={14} color={colors.success} />
              <Text style={[styles.exportBtnText, { color: colors.text }]}>Export CSV</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedReport(rep);
                handleDownload("html");
              }}
              style={[styles.exportBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
            >
              <Printer size={14} color={colors.info} />
              <Text style={[styles.exportBtnText, { color: colors.text }]}>Printable HTML</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}

      {/* Selected Report Dossier Preview */}
      {selectedReport && (
        <Card variant="elevated" style={styles.dossierCard}>
          <View style={styles.dossierHeader}>
            <Text style={[styles.emblemText, { color: currentForce.primaryColor }]}>
              सत्यमेव जयते • GOVERNMENT OF INDIA
            </Text>
            <Text style={[styles.mhaHeading, { color: colors.text }]}>
              MINISTRY OF HOME AFFAIRS (POLICE II DIVISION)
            </Text>
            <Text style={[styles.forceHeading, { color: currentForce.primaryColor }]}>
              {currentForce.name.toUpperCase()}
            </Text>
            <View style={[styles.stampPill, { borderColor: colors.danger, backgroundColor: `${colors.danger}15` }]}>
              <Text style={[styles.stampText, { color: colors.danger }]}>
                {selectedReport.classification}
              </Text>
            </View>
          </View>

          <View style={styles.dossierBody}>
            <Text style={[styles.dossierTitle, { color: colors.text }]}>
              SUBJECT: {selectedReport.title.toUpperCase()}
            </Text>
            <Text style={[styles.dossierDate, { color: colors.textMuted }]}>
              Date of Issue: {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })} • Automated ML-Assisted Run
            </Text>

            <View style={[styles.statsGrid, { backgroundColor: colors.surface }]}>
              <View style={styles.statCol}>
                <Text style={[styles.statVal, { color: colors.text }]}>405</Text>
                <Text style={[styles.statLbl, { color: colors.textMuted }]}>Personnel Screened</Text>
              </View>
              <View style={styles.statCol}>
                <Text style={[styles.statVal, { color: colors.success }]}>84%</Text>
                <Text style={[styles.statLbl, { color: colors.textMuted }]}>Mission Ready</Text>
              </View>
              <View style={styles.statCol}>
                <Text style={[styles.statVal, { color: colors.warning }]}>18</Text>
                <Text style={[styles.statLbl, { color: colors.textMuted }]}>Rest Stand-Downs</Text>
              </View>
            </View>

            <View style={styles.recSection}>
              <Text style={[styles.recHeading, { color: colors.text }]}>Executive Directive & Medical Guidance:</Text>
              <Text style={[styles.recContent, { color: colors.textMuted }]}>
                1. Continuous forward patrol deployment shall not exceed 30 consecutive days in High-Altitude and CI grids without mandatory 48-hr base camp turnaround.{"\n"}
                2. Buddy-pair mutual care protocols are strictly verified twice daily at 06:00 and 18:00 hrs.{"\n"}
                3. All individual self-reported survey disclosures remain legally sealed under the DPDP Act 2023 with zero ACR/APAR career penalty.
              </Text>
            </View>

            <View style={styles.downloadRow}>
              <Button
                title={downloadFormat === "csv" ? "Exporting CSV..." : "Download Official CSV"}
                size="sm"
                onPress={() => handleDownload("csv")}
                icon={<FileSpreadsheet size={14} color="#FFFFFF" />}
                style={styles.actionDownload}
              />
              <Button
                title={downloadFormat === "html" ? "Generating HTML..." : "Download Printable HTML"}
                size="sm"
                variant="secondary"
                onPress={() => handleDownload("html")}
                icon={<Printer size={14} color={colors.text} />}
                style={styles.actionDownload}
              />
            </View>
          </View>
        </Card>
      )}

      {/* Statutory Footer */}
      <View style={styles.footerNote}>
        <ShieldCheck size={16} color={colors.accent} />
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Reports conform strictly to Ministry of Home Affairs Welfare Formats and DPDP Act 2023. Individual self-assessments are anonymized before compilation.
        </Text>
      </View>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },
  reportCard: {
    padding: 14,
    marginBottom: 12,
  },
  repHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  repMeta: {
    flex: 1,
  },
  repTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  repFreq: {
    fontSize: 10,
    marginTop: 2,
  },
  repDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  previewBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
  },
  previewBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
  },
  exportBtnText: {
    fontSize: 11,
    fontWeight: "600",
  },
  dossierCard: {
    padding: 18,
    marginTop: 10,
    marginBottom: 16,
  },
  dossierHeader: {
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.2)",
    marginBottom: 12,
  },
  emblemText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  mhaHeading: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },
  forceHeading: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 2,
    letterSpacing: 0.3,
  },
  stampPill: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  stampText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  dossierBody: {},
  dossierTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 2,
  },
  dossierDate: {
    fontSize: 10,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  statCol: {
    alignItems: "center",
  },
  statVal: {
    fontSize: 18,
    fontWeight: "900",
  },
  statLbl: {
    fontSize: 10,
    marginTop: 2,
  },
  recSection: {
    marginBottom: 16,
  },
  recHeading: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },
  recContent: {
    fontSize: 11,
    lineHeight: 16,
  },
  downloadRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionDownload: {
    flex: 1,
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 8,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 10,
    lineHeight: 14,
    flex: 1,
  },
});
