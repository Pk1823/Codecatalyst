import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useForce } from "../contexts/ForceContext";
import { useAuth } from "../contexts/AuthContext";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { Header } from "../components/ui/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { MissionWellLogo } from "../components/ui/MissionWellLogo";
import {
  Presentation,
  Shield,
  HeartPulse,
  Brain,
  Lock,
  LineChart,
  ArrowRight,
  CheckCircle2,
  Award,
  Zap,
  Users,
  Activity,
  Flame,
  Scale,
  ChevronRight,
  UserCheck,
  Stethoscope,
  Crown,
  Sliders,
} from "lucide-react-native";

export default function PresentationScreen() {
  const { colors } = useTheme();
  const { isHi, t } = useLanguage();
  const { currentForce } = useForce();
  const { loginAsPersona } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "crisis" | "solution" | "xai" | "privacy" | "impact" | "matrix" | "demo"
  >("crisis");

  const handleLaunchRole = async (role: "jawan" | "doctor" | "commander") => {
    await loginAsPersona(role);
    if (role === "doctor") router.replace("/welfare");
    else if (role === "commander") router.replace("/commander");
    else router.replace("/personnel");
  };

  return (
    <ScreenContainer scrollable={false}>
      <Header
        title={isHi ? "एसआईएच जज प्रस्तुति" : "SIH Judge Presentation"}
        subtitle={isHi ? "मिशनवेल एआई रक्षा पिच डेक" : "Smart India Hackathon • Sentinel of Resilience"}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Official SIH Defense Presentation Brand Banner */}
        <Card style={[styles.slideCard, { alignItems: "center", paddingVertical: 14, gap: 4, backgroundColor: `${colors.primary}12`, borderColor: `${colors.primary}30` }]}>
          <MissionWellLogo size="md" showText={true} showSubtitle={true} showForceBadge={true} />
        </Card>

        {/* Slide Selector Carousel */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {[
            { id: "crisis", label: "1. The Crisis", icon: Flame },
            { id: "solution", label: "2. Solution", icon: Shield },
            { id: "xai", label: "3. Anti-Masking", icon: Brain },
            { id: "privacy", label: "4. DPDP & Crypto", icon: Lock },
            { id: "impact", label: "5. Force Impact", icon: Activity },
            { id: "matrix", label: "6. Defense Matrix", icon: Scale },
            { id: "demo", label: "7. Live Matrix", icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
                style={[
                  styles.tabBtn,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                ]}
              >
                <Icon size={13} color={isSelected ? "#FFFFFF" : colors.textMuted} />
                <Text style={[styles.tabBtnText, { color: isSelected ? "#FFFFFF" : colors.text }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Tab 1: The Invisible Crisis */}
        {activeTab === "crisis" && (
          <Card style={styles.slideCard}>
            <View style={styles.slideHeader}>
              <Flame size={20} color="#EF4444" />
              <Text style={[styles.slideTitle, { color: colors.text }]}>
                The Invisible Crisis in Armed Forces & CAPFs
              </Text>
            </View>

            <View style={[styles.highlightBox, { backgroundColor: "rgba(239, 68, 68, 0.12)", borderColor: "#EF4444" }]}>
              <Text style={styles.statBig}>1,532+</Text>
              <Text style={styles.statLabel}>
                Non-combat stress casualties in CAPFs over the past decade — outnumbering active combat fatalities.
              </Text>
            </View>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={[styles.bulletDot, { backgroundColor: "#EF4444" }]} />
                <Text style={[styles.bulletText, { color: colors.text }]}>
                  <Text style={{ fontWeight: "800" }}>Silent Masking Culture:</Text> Jawans fear seeking mental healthcare due to fear of weapon withdrawal or career stigma.
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={[styles.bulletDot, { backgroundColor: "#EF4444" }]} />
                <Text style={[styles.bulletText, { color: colors.text }]}>
                  <Text style={{ fontWeight: "800" }}>Severe Duty Cycles:</Text> 120+ consecutive deployment days in high-stress counter-insurgency and extreme-altitude sectors.
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={[styles.bulletDot, { backgroundColor: "#EF4444" }]} />
                <Text style={[styles.bulletText, { color: colors.text }]}>
                  <Text style={{ fontWeight: "800" }}>Command Blindspots:</Text> Commanders lack predictive, early-warning indicators before acute behavioral breakdown occurs.
                </Text>
              </View>
            </View>

            <Button
              title="See Sentinel Solution →"
              onPress={() => setActiveTab("solution")}
              variant="primary"
            />
          </Card>
        )}

        {/* Tab 2: Solution Architecture */}
        {activeTab === "solution" && (
          <Card style={styles.slideCard}>
            <View style={styles.slideHeader}>
              <Shield size={20} color={colors.primary} />
              <Text style={[styles.slideTitle, { color: colors.text }]}>
                Sentinel of Resilience Architecture
              </Text>
            </View>
            <Text style={[styles.slideSub, { color: colors.textMuted }]}>
              Defense-grade multi-tier ecosystem designed for zero-connectivity forward posts and headquarters:
            </Text>

            <View style={styles.pillarGrid}>
              <View style={[styles.pillarBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Brain size={16} color={colors.primary} />
                <Text style={[styles.pillarTitle, { color: colors.text }]}>Anti-Masking AI</Text>
                <Text style={[styles.pillarDesc, { color: colors.textMuted }]}>LightGBM v4 with SHAP explainability</Text>
              </View>
              <View style={[styles.pillarBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Lock size={16} color="#10B981" />
                <Text style={[styles.pillarTitle, { color: colors.text }]}>Dual-Key Privacy</Text>
                <Text style={[styles.pillarDesc, { color: colors.textMuted }]}>DPDP Act 2023 zero-trust encryption</Text>
              </View>
              <View style={[styles.pillarBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Users size={16} color="#F59E0B" />
                <Text style={[styles.pillarTitle, { color: colors.text }]}>Buddy-Pair Watch</Text>
                <Text style={[styles.pillarDesc, { color: colors.textMuted }]}>Mutual care peer check-in system</Text>
              </View>
              <View style={[styles.pillarBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <HeartPulse size={16} color="#EC4899" />
                <Text style={[styles.pillarTitle, { color: colors.text }]}>Confidential Darbar</Text>
                <Text style={[styles.pillarDesc, { color: colors.textMuted }]}>Direct audience with CO / Subedar Major</Text>
              </View>
            </View>

            <Button
              title="Anti-Masking Innovation →"
              onPress={() => setActiveTab("xai")}
              variant="primary"
            />
          </Card>
        )}

        {/* Tab 3: Anti-Masking Innovation */}
        {activeTab === "xai" && (
          <Card style={styles.slideCard}>
            <View style={styles.slideHeader}>
              <Brain size={20} color={colors.primary} />
              <Text style={[styles.slideTitle, { color: colors.text }]}>
                The Anti-Masking Mathematical Innovation
              </Text>
            </View>

            <View style={[styles.formulaBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
              <Text style={[styles.formulaLabel, { color: colors.primary }]}>DIVERGENCE FORMULA:</Text>
              <Text style={[styles.formulaCode, { color: colors.text }]}>
                Δ_mask = f(DutyHours_5d, SleepDeficit, FieldDays) - SelfReport_Norm
              </Text>
              <Text style={[styles.formulaDesc, { color: colors.textMuted }]}>
                When objective strain score exceeds 60 but self-report is ≤ 2 (claims 'fit'), divergence engine trips high-confidence clinical flag.
              </Text>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricBox}>
                <Text style={[styles.metricBig, { color: "#10B981" }]}>0.942</Text>
                <Text style={[styles.metricLabel, { color: colors.textMuted }]}>ROC-AUC Score</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={[styles.metricBig, { color: colors.primary }]}>12ms</Text>
                <Text style={[styles.metricLabel, { color: colors.textMuted }]}>In-Memory Latency</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={[styles.metricBig, { color: "#F59E0B" }]}>100%</Text>
                <Text style={[styles.metricLabel, { color: colors.textMuted }]}>SHAP Explained</Text>
              </View>
            </View>

            <Button
              title="Launch Live AI Simulator →"
              onPress={() => router.push("/simulator")}
              variant="primary"
            />
          </Card>
        )}

        {/* Tab 4: DPDP & Dual-Key Privacy */}
        {activeTab === "privacy" && (
          <Card style={styles.slideCard}>
            <View style={styles.slideHeader}>
              <Lock size={20} color="#10B981" />
              <Text style={[styles.slideTitle, { color: colors.text }]}>
                DPDP Act 2023 & Dual-Key Architecture
              </Text>
            </View>

            <View style={styles.roleAccessMatrix}>
              <View style={[styles.matrixRow, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <UserCheck size={16} color="#3B82F6" />
                <View style={styles.matrixInfo}>
                  <Text style={[styles.matrixTitle, { color: colors.text }]}>Jawan (Data Principal)</Text>
                  <Text style={[styles.matrixSub, { color: colors.textMuted }]}>Full access to self data, consent revocation & deletion</Text>
                </View>
              </View>

              <View style={[styles.matrixRow, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Stethoscope size={16} color="#10B981" />
                <View style={styles.matrixInfo}>
                  <Text style={[styles.matrixTitle, { color: colors.text }]}>Doctor (Medical Key)</Text>
                  <Text style={[styles.matrixSub, { color: colors.textMuted }]}>Decrypts clinical notes & individual therapy dossiers only</Text>
                </View>
              </View>

              <View style={[styles.matrixRow, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Crown size={16} color="#F59E0B" />
                <View style={styles.matrixInfo}>
                  <Text style={[styles.matrixTitle, { color: colors.text }]}>Commander (Command Key)</Text>
                  <Text style={[styles.matrixSub, { color: colors.textMuted }]}>Sees battalion aggregated readiness; CANNOT view medical PII</Text>
                </View>
              </View>
            </View>

            <Button
              title="Inspect Privacy Center →"
              onPress={() => router.push("/privacy")}
              variant="primary"
            />
          </Card>
        )}

        {/* Tab 5: Measurable Force Impact */}
        {activeTab === "impact" && (
          <Card style={styles.slideCard}>
            <View style={styles.slideHeader}>
              <Activity size={20} color={colors.primary} />
              <Text style={[styles.slideTitle, { color: colors.text }]}>
                Measurable Impact on Armed Forces Readiness
              </Text>
            </View>

            <View style={styles.impactGrid2}>
              <View style={[styles.impactCard2, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.impactNum, { color: "#10B981" }]}>-34%</Text>
                <Text style={[styles.impactText, { color: colors.text }]}>Predicted reduction in chronic stress incidents</Text>
              </View>
              <View style={[styles.impactCard2, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.impactNum, { color: colors.primary }]}>88%</Text>
                <Text style={[styles.impactText, { color: colors.text }]}>Faster doctor triage & duty rotation approval</Text>
              </View>
              <View style={[styles.impactCard2, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.impactNum, { color: "#F59E0B" }]}>100%</Text>
                <Text style={[styles.impactText, { color: colors.text }]}>Statutory DPDP Act 2023 military compliance</Text>
              </View>
              <View style={[styles.impactCard2, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.impactNum, { color: "#EC4899" }]}>0ms</Text>
                <Text style={[styles.impactText, { color: colors.text }]}>Dependency on public cloud (works 100% on air-gapped intranet)</Text>
              </View>
            </View>

            <Button
              title="Next: Defense Matrix →"
              onPress={() => setActiveTab("matrix")}
              variant="primary"
            />
          </Card>
        )}

        {/* Tab 6: Defense Matrix Comparison */}
        {activeTab === "matrix" && (
          <Card style={styles.slideCard}>
            <View style={styles.slideHeader}>
              <Scale size={20} color={colors.primary} />
              <Text style={[styles.slideTitle, { color: colors.text }]}>
                Defense Readiness vs. Commercial Apps
              </Text>
            </View>

            <View style={styles.comparisonTable}>
              <View style={[styles.tableRow, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.featureCol, { color: colors.text }]}>Anti-Masking Detection</Text>
                <Text style={[styles.valYes, { color: "#10B981" }]}>✓ Yes (Dual-Engine)</Text>
                <Text style={[styles.valNo, { color: "#EF4444" }]}>✗ None</Text>
              </View>

              <View style={[styles.tableRow, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.featureCol, { color: colors.text }]}>Air-Gapped Intranet</Text>
                <Text style={[styles.valYes, { color: "#10B981" }]}>✓ 100% Offline</Text>
                <Text style={[styles.valNo, { color: "#EF4444" }]}>✗ Cloud Only</Text>
              </View>

              <View style={[styles.tableRow, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.featureCol, { color: colors.text }]}>Dual-Key Crypto</Text>
                <Text style={[styles.valYes, { color: "#10B981" }]}>✓ Enforced</Text>
                <Text style={[styles.valNo, { color: "#EF4444" }]}>✗ Single Key</Text>
              </View>

              <View style={[styles.tableRow, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.featureCol, { color: colors.text }]}>Confidential Darbar</Text>
                <Text style={[styles.valYes, { color: "#10B981" }]}>✓ CO Channel</Text>
                <Text style={[styles.valNo, { color: "#EF4444" }]}>✗ None</Text>
              </View>
            </View>

            <Button
              title="Next: Live Role Demo Matrix →"
              onPress={() => setActiveTab("demo")}
              variant="primary"
            />
          </Card>
        )}

        {/* Tab 7: Live Demo Persona Matrix */}
        {activeTab === "demo" && (
          <Card style={styles.slideCard}>
            <View style={styles.slideHeader}>
              <Award size={20} color={colors.primary} />
              <Text style={[styles.slideTitle, { color: colors.text }]}>
                Interactive Live Evaluator Roles
              </Text>
            </View>
            <Text style={[styles.slideSub, { color: colors.textMuted }]}>
              Tap any role to immediately test real workflows on this device:
            </Text>

            <View style={styles.roleGrid}>
              <TouchableOpacity
                onPress={() => handleLaunchRole("jawan")}
                style={[styles.roleLaunchCard, { backgroundColor: colors.surface, borderColor: "#3B82F6" }]}
              >
                <UserCheck size={20} color="#3B82F6" />
                <View style={styles.roleLaunchMeta}>
                  <Text style={[styles.roleLaunchTitle, { color: colors.text }]}>Jawan / Soldier Portal</Text>
                  <Text style={[styles.roleLaunchDesc, { color: colors.textMuted }]}>
                    6-step voluntary assessment, Buddy-Pair check, Darbar requests
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleLaunchRole("doctor")}
                style={[styles.roleLaunchCard, { backgroundColor: colors.surface, borderColor: "#10B981" }]}
              >
                <Stethoscope size={20} color="#10B981" />
                <View style={styles.roleLaunchMeta}>
                  <Text style={[styles.roleLaunchTitle, { color: colors.text }]}>Welfare Medical Officer</Text>
                  <Text style={[styles.roleLaunchDesc, { color: colors.textMuted }]}>
                    Clinical triage queue, case dossiers, counseling intervention notes
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleLaunchRole("commander")}
                style={[styles.roleLaunchCard, { backgroundColor: colors.surface, borderColor: "#F59E0B" }]}
              >
                <Crown size={20} color="#F59E0B" />
                <View style={styles.roleLaunchMeta}>
                  <Text style={[styles.roleLaunchTitle, { color: colors.text }]}>Commanding Officer (CO)</Text>
                  <Text style={[styles.roleLaunchDesc, { color: colors.textMuted }]}>
                    Battalion readiness gauge, company heatmaps, Darbar approvals
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </Card>
        )}
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
  tabsRow: {
    gap: 8,
    paddingBottom: 4,
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  slideCard: {
    padding: 16,
    borderRadius: 14,
    gap: 14,
  },
  slideHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  slideTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
  },
  slideSub: {
    fontSize: 12,
    lineHeight: 18,
  },
  highlightBox: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  statBig: {
    fontSize: 28,
    fontWeight: "900",
    color: "#EF4444",
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 18,
    color: "#EF4444",
    fontWeight: "600",
  },
  bulletList: {
    gap: 10,
  },
  bulletItem: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  pillarGrid: {
    gap: 8,
  },
  pillarBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  pillarTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  pillarDesc: {
    fontSize: 11,
  },
  formulaBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  formulaLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  formulaCode: {
    fontSize: 12,
    fontWeight: "800",
    fontFamily: Platform.OS === "web" ? "'JetBrains Mono', monospace" : "JetBrainsMono-Bold",
  },
  formulaDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricBox: {
    alignItems: "center",
    gap: 2,
  },
  metricBig: {
    fontSize: 20,
    fontWeight: "900",
  },
  metricLabel: {
    fontSize: 10,
  },
  roleAccessMatrix: {
    gap: 8,
  },
  matrixRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  matrixInfo: {
    flex: 1,
    gap: 2,
  },
  matrixTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  matrixSub: {
    fontSize: 11,
  },
  impactGrid2: {
    gap: 8,
  },
  impactCard2: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  impactNum: {
    fontSize: 22,
    fontWeight: "900",
  },
  impactText: {
    fontSize: 12,
    fontWeight: "600",
  },
  comparisonTable: {
    gap: 6,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  featureCol: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
  },
  valYes: {
    fontSize: 11,
    fontWeight: "800",
    marginRight: 10,
  },
  valNo: {
    fontSize: 11,
    fontWeight: "700",
  },
  roleGrid: {
    gap: 8,
  },
  roleLaunchCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  roleLaunchMeta: {
    flex: 1,
    gap: 2,
  },
  roleLaunchTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  roleLaunchDesc: {
    fontSize: 11,
  },
});
