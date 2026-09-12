import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform } from "react-native";
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
  LogIn,
  UserPlus,
  User,
  ChevronRight,
} from "lucide-react-native";
import { UserRole } from "../../types";
import { HelplineModal } from "./HelplineModal";
import { MissionWellIcon, MissionWellLogo } from "./MissionWellLogo";
import { GoogleOAuthModal } from "../auth/GoogleOAuthModal";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showForceBadge?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, showForceBadge = true }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { currentForce, setForce, availableForces } = useForce();
  const { lang, toggleLang, isHi, t } = useLanguage();
  const { user, loginAsPersona, loginWithGoogle } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [forceModalOpen, setForceModalOpen] = useState(false);
  const [helplineModalOpen, setHelplineModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [googleOAuthOpen, setGoogleOAuthOpen] = useState(false);

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      {/* Top Bar Utilities: MissionWell AI Brand Logo, Force Badge, Helpline, Lang Toggle, Theme Toggle */}
      <View style={styles.utilityBar}>
        {/* MissionWell AI Brand with Sentinel Icon */}
        <View style={styles.brandTrigger}>
          <MissionWellIcon size="sm" />
          <View style={styles.brandTitleCol}>
            <View style={styles.brandInline}>
              <Text style={[styles.brandNameText, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                MissionWell{" "}
                <Text
                  style={{
                    color: "#3B82F6",
                    fontFamily: Platform.OS === "web" ? "'JetBrains Mono', monospace" : "JetBrainsMono-Bold",
                  }}
                >
                  AI
                </Text>
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

        {/* Right Actions: Helpline, Lang, Theme, Google Identity */}
        <View style={styles.rightActions}>
          {/* 24/7 Defense Crisis Helpline */}
          <TouchableOpacity
            onPress={() => setHelplineModalOpen(true)}
            style={[styles.actionBtn, { backgroundColor: "rgba(239, 68, 68, 0.15)", borderColor: "rgba(239, 68, 68, 0.35)" }]}
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
            <Text style={[styles.langText, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
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

          {/* Google Identity & Profile Trigger (Available on Every Route) */}
          <TouchableOpacity
            onPress={() => setProfileModalOpen(true)}
            style={[
              styles.actionBtn,
              {
                backgroundColor: user?.email ? "rgba(66, 133, 244, 0.16)" : colors.surface,
                borderColor: user?.email ? "rgba(66, 133, 244, 0.5)" : colors.cardBorder,
              },
            ]}
            accessibilityLabel="Google Account & Defense Profile"
          >
            <View style={styles.googleActionBtnInner}>
              <Text style={styles.googleActionBtnLetter}>G</Text>
            </View>
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

      {/* 5. Google SSO & Defense Identity Modal (Accessible on every route) */}
      <Modal visible={profileModalOpen} transparent animationType="fade" onRequestClose={() => setProfileModalOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setProfileModalOpen(false)}>
          <View
            style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.profileModalHeader}>
              <View style={styles.profileModalTitleGroup}>
                <View style={styles.googleColorRow}>
                  <View style={[styles.googleColorDot, { backgroundColor: "#4285F4" }]} />
                  <View style={[styles.googleColorDot, { backgroundColor: "#EA4335" }]} />
                  <View style={[styles.googleColorDot, { backgroundColor: "#FBBC05" }]} />
                  <View style={[styles.googleColorDot, { backgroundColor: "#34A853" }]} />
                </View>
                <Text style={[styles.modalHeading, { color: colors.text, marginBottom: 0 }]}>
                  Google Identity SSO
                </Text>
              </View>
              <TouchableOpacity onPress={() => setProfileModalOpen(false)}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Active User Card */}
            <View style={[styles.profileInfoBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
              <View style={[styles.profileAvatar, { backgroundColor: `${currentForce.primaryColor}25` }]}>
                <Text style={[styles.profileAvatarText, { color: currentForce.primaryColor }]}>
                  {user?.name ? user.name.charAt(0) : "M"}
                </Text>
              </View>
              <View style={styles.profileInfoMeta}>
                <Text style={[styles.profileInfoName, { color: colors.text }]}>{user?.name || "Personnel Session"}</Text>
                <Text style={[styles.profileInfoSub, { color: colors.textMuted }]}>
                  {user?.rank || "Cadre"} • {user?.serviceId || "CAPF-OFFICIAL"}
                </Text>
                <Text style={[styles.profileInfoEmail, { color: colors.primary }]}>
                  {user?.email ? user.email : "Local Field Session • No Google Linked"}
                </Text>
              </View>
            </View>

            {/* 1-Tap Google SSO Action */}
            <TouchableOpacity
              style={[styles.googleSsoTriggerBtn, { borderColor: "#4285F4", backgroundColor: "rgba(66, 133, 244, 0.08)" }]}
              onPress={() => {
                setProfileModalOpen(false);
                setGoogleOAuthOpen(true);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.googleSsoTriggerLeft}>
                <View style={styles.googleGLogoCircle}>
                  <Text style={styles.googleGLogoText}>G</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.googleSsoTriggerTitle, { color: colors.text }]}>
                    {user?.email ? "Switch Google SSO Account" : "Sign In with Google SSO"}
                  </Text>
                  <Text style={[styles.googleSsoTriggerDesc, { color: colors.textMuted }]}>
                    OpenID Connect authentication
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>

            {/* Quick Navigation Links */}
            <View style={styles.profileQuickNavRow}>
              <TouchableOpacity
                style={[styles.profileNavBtn, { borderColor: colors.cardBorder, backgroundColor: colors.surface }]}
                onPress={() => {
                  setProfileModalOpen(false);
                  router.push("/signup");
                }}
                activeOpacity={0.7}
              >
                <UserPlus size={14} color={colors.primary} />
                <Text style={[styles.profileNavBtnText, { color: colors.text }]}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.profileNavBtn, { borderColor: colors.cardBorder, backgroundColor: colors.surface }]}
                onPress={() => {
                  setProfileModalOpen(false);
                  router.push("/login");
                }}
                activeOpacity={0.7}
              >
                <LogIn size={14} color={colors.textMuted} />
                <Text style={[styles.profileNavBtnText, { color: colors.text }]}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* DPDP Act Compliance Footer */}
            <Text style={[styles.dpdpNotice, { color: colors.textMuted }]}>
              Protected under DPDP Act 2023. Real-time telemetry on every route.
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 6. Google OAuth Modal (Directly executable from any route) */}
      <GoogleOAuthModal
        isOpen={googleOAuthOpen}
        onClose={() => setGoogleOAuthOpen(false)}
        onSuccess={async (googleUser) => {
          setGoogleOAuthOpen(false);
          await loginWithGoogle(googleUser);
        }}
        mode="signin"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
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
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
      } as any,
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  langText: {
    fontSize: 10,
    fontWeight: "800",
  },
  titleSection: {
    marginTop: 3,
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
  googleActionBtnInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  googleActionBtnLetter: {
    fontSize: 12,
    fontWeight: "900",
    color: "#4285F4",
  },
  profileModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileModalTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  googleColorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  googleColorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  profileInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarText: {
    fontSize: 18,
    fontWeight: "900",
  },
  profileInfoMeta: {
    flex: 1,
  },
  profileInfoName: {
    fontSize: 15,
    fontWeight: "800",
  },
  profileInfoSub: {
    fontSize: 11,
    marginTop: 2,
  },
  profileInfoEmail: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  googleSsoTriggerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  googleSsoTriggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  googleGLogoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(66, 133, 244, 0.3)",
  },
  googleGLogoText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#4285F4",
  },
  googleSsoTriggerTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  googleSsoTriggerDesc: {
    fontSize: 11,
    marginTop: 1,
  },
  profileQuickNavRow: {
    flexDirection: "row",
    gap: 8,
  },
  profileNavBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  profileNavBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  dpdpNotice: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 14,
  },
});
