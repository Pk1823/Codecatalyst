import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useForce } from "../../contexts/ForceContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter, usePathname } from "expo-router";
import {
  Shield,
  Moon,
  Sun,
  Languages,
  UserCheck,
  Stethoscope,
  Crown,
  ChevronDown,
  Check,
  LayoutGrid,
  Lock,
  LineChart,
  Brain,
  HandHelping,
  Sparkles,
  Bell,
  FileText,
  ShieldCheck,
  History,
  Server,
  Presentation,
  PhoneCall,
  Sliders,
  X,
} from "lucide-react-native";
import { UserRole } from "../../types";
import { HelplineModal } from "./HelplineModal";
import { MissionWellIcon, MissionWellLogo } from "./MissionWellLogo";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showForceBadge?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, showForceBadge = true }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { currentForce, setForce, availableForces } = useForce();
  const { lang, toggleLang, isHi, t } = useLanguage();
  const { user, loginAsPersona } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [forceModalOpen, setForceModalOpen] = useState(false);
  const [helplineModalOpen, setHelplineModalOpen] = useState(false);

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      {/* Top Bar Utilities: MissionWell AI Brand Logo, Force Badge, Helpline, Lang Toggle, Theme Toggle */}
      <View style={styles.utilityBar}>
        {/* MissionWell AI Brand with Sentinel Icon */}
        <View style={styles.brandTrigger}>
          <MissionWellIcon size="sm" />
          <View style={styles.brandTitleCol}>
            <View style={styles.brandInline}>
              <Text style={[styles.brandNameText, { color: colors.text }]}>
                MissionWell <Text style={{ color: "#3B82F6", fontFamily: "monospace" }}>AI</Text>
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setForceModalOpen(true)}
                style={[styles.forceTag, { backgroundColor: `${currentForce.primaryColor}22`, borderColor: `${currentForce.primaryColor}40` }]}
              >
                <Text style={[styles.forceTagText, { color: currentForce.primaryColor }]}>
                  {currentForce.id}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Right Actions: Helpline, Lang, Theme */}
        <View style={styles.rightActions}>
          {/* 24/7 Defense Crisis Helpline */}
          <TouchableOpacity
            onPress={() => setHelplineModalOpen(true)}
            style={[styles.actionBtn, { backgroundColor: "rgba(239, 68, 68, 0.15)", borderColor: "rgba(239, 68, 68, 0.3)" }]}
            accessibilityLabel="24/7 Crisis Helplines"
          >
            <PhoneCall size={14} color={colors.danger} />
          </TouchableOpacity>

          {/* Language Toggle */}
          <TouchableOpacity
            onPress={toggleLang}
            style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
            accessibilityLabel="Toggle Language"
          >
            <Text style={[styles.langText, { color: colors.text }]}>
              {lang === "en" ? "HI" : "EN"}
            </Text>
          </TouchableOpacity>

          {/* Night Vision Theme Toggle */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
            accessibilityLabel="Toggle Theme"
          >
            {isDark ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="#475569" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Title Section */}
      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
      </View>

      {/* 3. Force Switcher Modal */}
      <Modal visible={forceModalOpen} transparent animationType="fade" onRequestClose={() => setForceModalOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setForceModalOpen(false)}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.modalHeading, { color: colors.text }]}>Select Armed Force Branch</Text>
            <Text style={[styles.modalSub, { color: colors.textMuted }]}>
              Customizes unit insignia, battle mottos & operational sectors:
            </Text>

            {availableForces.map((f) => {
              const isSelected = f.id === currentForce.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.forceOption, isSelected && { backgroundColor: `${f.primaryColor}18`, borderColor: f.primaryColor }]}
                  onPress={() => {
                    setForce(f.id);
                    setForceModalOpen(false);
                  }}
                >
                  <View style={[styles.forceOptionInsignia, { backgroundColor: `${f.primaryColor}25` }]}>
                    <Shield size={16} color={f.primaryColor} />
                  </View>
                  <View style={styles.forceOptionMeta}>
                    <Text style={[styles.forceOptionName, { color: colors.text }]}>{f.name}</Text>
                    <Text style={[styles.forceOptionMotto, { color: colors.textMuted }]}>"{f.motto}"</Text>
                  </View>
                  {isSelected && <Check size={16} color={f.primaryColor} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 4. 24/7 Helpline Modal */}
      <HelplineModal visible={helplineModalOpen} onClose={() => setHelplineModalOpen(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  utilityBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  brandTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandTitleCol: {
    justifyContent: "center",
  },
  brandInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  brandNameText: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  forceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  forceTagText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  langText: {
    fontSize: 10,
    fontWeight: "800",
  },
  titleSection: {
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  modalHeading: {
    fontSize: 15,
    fontWeight: "800",
  },
  modalSub: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 10,
  },
  roleOptMeta: {
    flex: 1,
    gap: 2,
  },
  roleOptTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  roleOptDesc: {
    fontSize: 11,
  },
  forceOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  forceOptionInsignia: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  forceOptionMeta: {
    flex: 1,
    gap: 2,
  },
  forceOptionName: {
    fontSize: 13,
    fontWeight: "700",
  },
  forceOptionMotto: {
    fontSize: 11,
    fontStyle: "italic",
  },
  matrixModalCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 10,
  },
  matrixHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matrixTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  matrixTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  matrixSub: {
    fontSize: 11,
    marginBottom: 4,
  },
  matrixCategoryTitle: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  matrixGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  matrixItem: {
    flex: 1,
    minWidth: "46%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  matrixItemTitle: {
    fontSize: 12,
    fontWeight: "700",
  },
});
