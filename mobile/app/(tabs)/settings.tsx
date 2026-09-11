import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { Header } from "../../components/ui/Header";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { HelplineModal } from "../../components/ui/HelplineModal";
import { useTheme } from "../../contexts/ThemeContext";
import { useForce } from "../../contexts/ForceContext";
import { useAuth } from "../../contexts/AuthContext";
import { ForceId } from "../../constants/forces";
import { MissionWellLogo } from "../../components/ui/MissionWellLogo";
import {
  Shield,
  Moon,
  Sun,
  LogOut,
  User,
  ShieldCheck,
  FileSpreadsheet,
  PhoneCall,
  ChevronRight,
  Lock,
  Brain,
  LineChart,
  HandHelping,
  Sparkles,
  History,
  Server,
  Presentation,
} from "lucide-react-native";

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { currentForce, setForce, availableForces } = useForce();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [isHelplineOpen, setIsHelplineOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ScreenContainer>
      <Header
        title="Settings & Force Config"
        subtitle="Customization, Security & Statutory DPDP Oversight"
      />

      {/* User Profile Card */}
      <Card variant="elevated" style={styles.sectionCard}>
        <View style={styles.profileRow}>
          <View style={[styles.avatarBox, { backgroundColor: `${currentForce.primaryColor}25` }]}>
            <User size={24} color={currentForce.primaryColor} />
          </View>
          <View style={styles.profileMeta}>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name}</Text>
            <Text style={[styles.userRole, { color: colors.textMuted }]}>
              {user?.rank || "Cadre"} • {user?.serviceId}
            </Text>
            <Badge label={user?.role || "PERSONNEL"} variant="info" size="sm" style={styles.roleBadge} />
          </View>
        </View>
      </Card>

      {/* Multi-Branch Force Customization */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.titleWithIcon}>
            <Shield size={18} color={currentForce.primaryColor} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Branch & Force Organization
            </Text>
          </View>
          <Badge label={currentForce.id} variant="neutral" size="sm" />
        </View>

        <Text style={[styles.sectionDesc, { color: colors.textMuted }]}>
          Dynamically configures tactical terminology, command hierarchies, and mottos.
        </Text>

        <View style={styles.forceGrid}>
          {availableForces.map((f) => {
            const isSelected = currentForce.id === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setForce(f.id as ForceId)}
                style={[
                  styles.forcePill,
                  {
                    backgroundColor: isSelected ? `${f.primaryColor}20` : colors.surface,
                    borderColor: isSelected ? f.primaryColor : colors.cardBorder,
                  },
                ]}
              >
                <View style={[styles.colorDot, { backgroundColor: f.primaryColor }]} />
                <Text
                  style={[
                    styles.forcePillText,
                    { color: isSelected ? colors.text : colors.textMuted, fontWeight: isSelected ? "800" : "600" },
                  ]}
                >
                  {f.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.mottoBox, { backgroundColor: colors.surface }]}>
          <Text style={[styles.mottoHindi, { color: currentForce.primaryColor }]}>
            "{currentForce.hindiMotto}"
          </Text>
          <Text style={[styles.mottoEnglish, { color: colors.textMuted }]}>
            {currentForce.name} ({currentForce.motto})
          </Text>
          <Text style={[styles.theatreText, { color: colors.textMuted }]}>
            Deployment Theatre: {currentForce.theatreDescription}
          </Text>
        </View>
      </Card>

      {/* Soldier Support & Privacy Utilities */}
      <Card style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
          Soldier Rights & Support Resources
        </Text>

        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => router.push("/privacy")}
        >
          <View style={[styles.menuIcon, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
            <ShieldCheck size={18} color={colors.accent} />
          </View>
          <View style={styles.menuMeta}>
            <Text style={[styles.menuTitle, { color: colors.text }]}>DPDP Act Privacy & Consent Center</Text>
            <Text style={[styles.menuSub, { color: colors.textMuted }]}>Consent Revocation & Cryptographic Audit Log</Text>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setIsHelplineOpen(true)}
        >
          <View style={[styles.menuIcon, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
            <PhoneCall size={18} color={colors.danger} />
          </View>
          <View style={styles.menuMeta}>
            <Text style={[styles.menuTitle, { color: colors.text }]}>24/7 Defense Crisis Helplines</Text>
            <Text style={[styles.menuSub, { color: colors.textMuted }]}>CRPF Madadgaar 14411, Army 1904 & Tele-MANAS</Text>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </Card>

      {/* Display & Night-Vision Military Mode */}
      <Card style={styles.sectionCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              Tactical Night-Vision Mode
            </Text>
            <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
              {isDark
                ? "Active (Protected Night-Vision #090D16)"
                : "Inactive (Daylight Administrative Slate-50)"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeToggleBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
          >
            {isDark ? <Moon size={20} color="#3B82F6" /> : <Sun size={20} color="#F59E0B" />}
          </TouchableOpacity>
        </View>
      </Card>

      {/* Official Sentinel Brand Identity */}
      <Card style={[styles.sectionCard, { alignItems: "center", paddingVertical: 18, gap: 6 }]}>
        <MissionWellLogo size="lg" showText={true} showSubtitle={true} showForceBadge={true} />
        <Text style={{ color: colors.textMuted, fontSize: 10, textAlign: "center", marginTop: 4 }}>
          MissionWell AI v2.4 • Ministry of Home Affairs Alignment • DPDP Act 2023
        </Text>
      </Card>

      {/* Sign Out Action */}
      <Button
        title="Sign Out of Session"
        variant="danger"
        onPress={handleLogout}
        icon={<LogOut size={16} color="#FFFFFF" />}
        style={styles.logoutBtn}
      />

      {/* Emergency Helpline Modal */}
      <HelplineModal isOpen={isHelplineOpen} onClose={() => setIsHelplineOpen(false)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  profileMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
  },
  userRole: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: "flex-start",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  sectionDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  forceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  forcePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    gap: 6,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  forcePillText: {
    fontSize: 12,
  },
  mottoBox: {
    padding: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  mottoHindi: {
    fontSize: 13,
    fontWeight: "800",
    fontStyle: "italic",
    marginBottom: 2,
  },
  mottoEnglish: {
    fontSize: 11,
    marginBottom: 4,
  },
  theatreText: {
    fontSize: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuMeta: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  menuSub: {
    fontSize: 11,
    marginTop: 2,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  settingDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  themeToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  logoutBtn: {
    marginTop: 8,
    marginBottom: 20,
  },
});
