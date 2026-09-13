import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useForce } from "../../contexts/ForceContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { GoogleOAuthModal } from "../../components/auth/GoogleOAuthModal";
import { MissionWellIcon, MissionWellLogo } from "../../components/ui/MissionWellLogo";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Stethoscope,
  Crown,
  ChevronRight,
  ShieldAlert,
  Mail,
  Shield,
  Smartphone,
  Sliders,
  Sun,
  Moon,
  Zap,
  ArrowRight,
} from "lucide-react-native";
import { EVALUATOR_PERSONAS } from "../../services/auth";
import { User } from "../../types";
import { DownloadAppBanner } from "../../components/ui/DownloadAppBanner";

export default function LoginScreen() {
  const { login, loginAsPersona, loginWithGoogle, isLoading } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const { currentForce } = useForce();
  const { lang, toggleLang, isHi } = useLanguage();
  const router = useRouter();

  const [serviceId, setServiceId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [personaTab, setPersonaTab] = useState<"soldiers" | "officers">("soldiers");

  const routeForUser = (u?: User) => {
    if (u?.role === "WELFARE_OFFICER") {
      router.replace("/(tabs)/welfare");
    } else if (u?.role === "COMMANDER" || u?.role === "ADMIN") {
      router.replace("/(tabs)/commander");
    } else {
      router.replace("/(tabs)/personnel");
    }
  };

  const handleCredentialsLogin = async () => {
    if (!serviceId.trim()) {
      setErrorMsg("Please enter your Service ID");
      return;
    }
    setErrorMsg("");
    try {
      const u = await login(serviceId, password);
      routeForUser(u);
    } catch (e: any) {
      setErrorMsg(e.message || "Login failed");
    }
  };

  const handlePersonaLogin = async (key: keyof typeof EVALUATOR_PERSONAS) => {
    try {
      const u = await loginAsPersona(key);
      routeForUser(u);
    } catch {
      Alert.alert("Error", "Could not sign in with this persona");
    }
  };

  const handleGoogleSuccess = async (googleUser: User) => {
    setIsGoogleModalOpen(false);
    const u = await loginWithGoogle(googleUser);
    routeForUser(u);
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
      {/* 1. Top National Tricolor Strip */}
      <View style={styles.tricolorBar}>
        <View style={[styles.tricolorSegment, { backgroundColor: "#FF9933" }]} />
        <View style={[styles.tricolorSegment, { backgroundColor: "#FFFFFF" }]} />
        <View style={[styles.tricolorSegment, { backgroundColor: "#138808" }]} />
      </View>

      {/* 2. Top Header Navigation Bar */}
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: isDark ? "rgba(9, 13, 22, 0.95)" : "rgba(255, 255, 255, 0.95)",
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.navLeft}>
          <MissionWellIcon size="sm" />
          <View style={styles.navBrandCol}>
            <View style={styles.navBrandTitleRow}>
              <Text style={[styles.navBrandTitle, { color: colors.text }]}>
                MissionWell{" "}
                <Text style={styles.navBrandAiText}>AI</Text>
              </Text>
              <View style={styles.navBlueDot} />
            </View>
            <Text style={[styles.navBrandSubtitle, { color: colors.textMuted }]}>
              {isHi ? "गृह मंत्रालय • सीएपीएफ महानिदेशालय" : "MINISTRY OF HOME AFFAIRS • CAPF DIRECTORATE"}
            </Text>
          </View>
        </View>

        {/* Top Header Quick Utilities */}
        <View style={styles.navRight}>
          {/* Light / Dark Mode Toggle */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.navUtilBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            {isDark ? (
              <>
                <Sun size={13} color="#FBBF24" />
                <Text style={[styles.navUtilText, { color: colors.text }]}>Light</Text>
              </>
            ) : (
              <>
                <Moon size={13} color="#3B82F6" />
                <Text style={[styles.navUtilText, { color: colors.text }]}>Dark</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Bilingual Switcher */}
          <TouchableOpacity
            onPress={toggleLang}
            style={[styles.navUtilBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.navUtilText, { color: colors.text, fontWeight: "700" }]}>
              {isHi ? "EN" : "हिन्दी"}
            </Text>
          </TouchableOpacity>

          {/* Quick Soldier App Link */}
          <TouchableOpacity
            onPress={() => handlePersonaLogin("jawan")}
            style={[styles.navSoldierBtn, { backgroundColor: isDark ? "#1E293B" : "#F1F5F9", borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Smartphone size={13} color="#3B82F6" />
            <Text style={[styles.navSoldierText, { color: colors.text }]}>
              {isHi ? "सैनिक ऐप" : "Soldier App"}
            </Text>
          </TouchableOpacity>

          {/* Quick Command Portal Button */}
          <TouchableOpacity
            onPress={() => handlePersonaLogin("commander")}
            style={styles.navCommandBtn}
            activeOpacity={0.7}
          >
            <Shield size={13} color="#FFFFFF" />
            <Text style={styles.navCommandText}>
              {isHi ? "कमांड पोर्टल" : "Command Portal"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 3. Hero Tactical Mountain Section */}
        <View style={styles.heroWrapper}>
          <ImageBackground
            source={require("../../assets/hero-bg.jpg")}
            style={styles.heroBackground}
            imageStyle={styles.heroBackgroundImage}
            resizeMode="cover"
          >
            {/* Dark Gradient / Vignette Overlay */}
            <View style={styles.heroOverlay} />

            {/* Subtle Blue Glow Center */}
            <View style={styles.heroGlowCenter} />

            {/* Hero Main Content */}
            <View style={styles.heroContent}>
              <Text style={styles.heroHeadline}>
                {isHi ? (
                  <>
                    ड्यूटी तनाव और थकान की{"\n"}
                    <Text style={styles.heroHighlight}>समय रहते पहचान</Text>
                  </>
                ) : (
                  <>
                    Predictive Stress & Fatigue{"\n"}
                    Intelligence for{" "}
                    <Text style={styles.heroHighlight}>Safer, Resilient{"\n"}Armed Forces</Text>
                  </>
                )}
              </Text>

              <Text style={styles.heroSubheadline}>
                {isHi
                  ? "सशस्त्र बलों एवं पुलिस कर्मियों हेतु एआई-आधारित मानसिक स्वास्थ्य व सामरिक तत्परता प्रणाली।"
                  : "AI-powered proactive stress detection & non-punitive welfare intelligence for defense personnel."}
              </Text>

              {/* 3 Primary Action Buttons */}
              <View style={styles.heroCtaRow}>
                {/* 1. Command Portal Button */}
                <TouchableOpacity
                  style={styles.heroPrimaryBtn}
                  onPress={() => handlePersonaLogin("commander")}
                  activeOpacity={0.8}
                >
                  <Shield size={16} color="#BFDBFE" />
                  <Text style={styles.heroPrimaryBtnText}>
                    {isHi ? "कमांड व अधिकारी पोर्टल" : "Command & Officer Portal"}
                  </Text>
                  <ArrowRight size={15} color="#FFFFFF" />
                </TouchableOpacity>

                {/* 2. Soldier Assessment Button */}
                <TouchableOpacity
                  style={styles.heroSecondaryBtn}
                  onPress={() => handlePersonaLogin("jawan")}
                  activeOpacity={0.8}
                >
                  <Smartphone size={16} color="#34D399" />
                  <Text style={styles.heroSecondaryBtnText}>
                    {isHi ? "सैनिक मूल्यांकन (मोबाइल ऐप)" : "Soldier Assessment (Mobile App)"}
                  </Text>
                </TouchableOpacity>

                {/* 3. Try AI Simulator Button */}
                <TouchableOpacity
                  style={styles.heroTertiaryBtn}
                  onPress={() => router.push("/simulator")}
                  activeOpacity={0.8}
                >
                  <Sliders size={15} color="#60A5FA" />
                  <Text style={styles.heroTertiaryBtnText}>
                    {isHi ? "एआई सिम्युलेटर" : "Try AI Simulator"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 3 Floating Trust Badges */}
              <View style={styles.heroTrustBadgesRow}>
                <View style={styles.trustBadge}>
                  <Lock size={12} color="#60A5FA" />
                  <Text style={styles.trustBadgeText}>100% DPDP Act Compliant</Text>
                </View>
                <View style={styles.trustBadge}>
                  <ShieldCheck size={12} color="#60A5FA" />
                  <Text style={styles.trustBadgeText}>Zero ACR Career Prejudice</Text>
                </View>
                <View style={styles.trustBadge}>
                  <Zap size={12} color="#FBBF24" />
                  <Text style={styles.trustBadgeText}>Anti-Masking LightGBM Engine</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* 4. Lower Section: 1-Tap Evaluator Personas & Sign In */}
        <View style={styles.lowerContainer}>
          {/* 1-Tap Quick Evaluator Switcher */}
          <Card style={styles.evaluatorCard}>
            <View style={styles.evaluatorHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <ShieldCheck size={18} color={colors.primary} />
                <Text style={[styles.evaluatorTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                  1-Tap Instant Evaluation Access
                </Text>
              </View>
              <Badge label="OFFICIAL DEMO" variant="info" size="sm" />
            </View>

            {/* Segmented Persona Mode */}
            <View style={[styles.personaTabContainer, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
              <TouchableOpacity
                style={[styles.personaTabBtn, personaTab === "soldiers" && { backgroundColor: colors.primary }]}
                onPress={() => setPersonaTab("soldiers")}
                activeOpacity={0.7}
              >
                <Text style={[styles.personaTabBtnText, { color: personaTab === "soldiers" ? "#FFFFFF" : colors.textMuted }]}>
                  Jawans & NCOs (Soldier App)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.personaTabBtn, personaTab === "officers" && { backgroundColor: colors.primary }]}
                onPress={() => setPersonaTab("officers")}
                activeOpacity={0.7}
              >
                <Text style={[styles.personaTabBtnText, { color: personaTab === "officers" ? "#FFFFFF" : colors.textMuted }]}>
                  Commanders & Medical Officers
                </Text>
              </TouchableOpacity>
            </View>

            {personaTab === "soldiers" ? (
              <>
                {/* Soldier 1: Ct. Piyush Kumar */}
                <TouchableOpacity
                  style={[styles.personaItem, { borderBottomColor: colors.border }]}
                  onPress={() => handlePersonaLogin("jawan")}
                >
                  <View style={[styles.personaIcon, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
                    <UserCheck size={18} color="#3B82F6" />
                  </View>
                  <View style={styles.personaMeta}>
                    <Text style={[styles.personaName, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                      Ct. Piyush Kumar
                    </Text>
                    <Text style={[styles.personaRole, { color: colors.textMuted }]}>
                      Constable (GD) • Alpha Coy, Sukma
                    </Text>
                  </View>
                  <ChevronRight size={18} color={colors.textMuted} />
                </TouchableOpacity>

                {/* Soldier 2: Hav. Rajesh Kumar */}
                <TouchableOpacity
                  style={[styles.personaItem, { borderBottomColor: colors.border }]}
                  onPress={() => handlePersonaLogin("jawan2")}
                >
                  <View style={[styles.personaIcon, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
                    <UserCheck size={18} color="#10B981" />
                  </View>
                  <View style={styles.personaMeta}>
                    <Text style={[styles.personaName, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                      Hav. Rajesh Kumar
                    </Text>
                    <Text style={[styles.personaRole, { color: colors.textMuted }]}>
                      Havildar • Bravo Coy
                    </Text>
                  </View>
                  <ChevronRight size={18} color={colors.textMuted} />
                </TouchableOpacity>

                {/* Soldier 3: ASI Gurpreet Singh */}
                <TouchableOpacity
                  style={styles.personaItem}
                  onPress={() => handlePersonaLogin("jawan3")}
                >
                  <View style={[styles.personaIcon, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
                    <UserCheck size={18} color="#F59E0B" />
                  </View>
                  <View style={styles.personaMeta}>
                    <Text style={[styles.personaName, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                      ASI Gurpreet Singh
                    </Text>
                    <Text style={[styles.personaRole, { color: colors.textMuted }]}>
                      Assistant Sub-Inspector • HQ Coy
                    </Text>
                  </View>
                  <ChevronRight size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Officer 1: Dr. Aarti Sharma */}
                <TouchableOpacity
                  style={[styles.personaItem, { borderBottomColor: colors.border }]}
                  onPress={() => handlePersonaLogin("doctor")}
                >
                  <View style={[styles.personaIcon, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
                    <Stethoscope size={18} color="#10B981" />
                  </View>
                  <View style={styles.personaMeta}>
                    <Text style={[styles.personaName, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                      Dr. Aarti Sharma
                    </Text>
                    <Text style={[styles.personaRole, { color: colors.textMuted }]}>
                      Chief Medical Officer • Welfare Wing
                    </Text>
                  </View>
                  <ChevronRight size={18} color={colors.textMuted} />
                </TouchableOpacity>

                {/* Officer 2: Col. Rajesh Rathore */}
                <TouchableOpacity
                  style={[styles.personaItem, { borderBottomColor: colors.border }]}
                  onPress={() => handlePersonaLogin("commander")}
                >
                  <View style={[styles.personaIcon, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
                    <Crown size={18} color="#F59E0B" />
                  </View>
                  <View style={styles.personaMeta}>
                    <Text style={[styles.personaName, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                      Col. Rajesh Rathore
                    </Text>
                    <Text style={[styles.personaRole, { color: colors.textMuted }]}>
                      Commandant (CO) • 114 Battalion HQ
                    </Text>
                  </View>
                  <ChevronRight size={18} color={colors.textMuted} />
                </TouchableOpacity>

                {/* Officer 3: Vikram Malhotra */}
                <TouchableOpacity
                  style={styles.personaItem}
                  onPress={() => handlePersonaLogin("admin")}
                >
                  <View style={[styles.personaIcon, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
                    <ShieldCheck size={18} color="#3B82F6" />
                  </View>
                  <View style={styles.personaMeta}>
                    <Text style={[styles.personaName, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                      Vikram Malhotra
                    </Text>
                    <Text style={[styles.personaRole, { color: colors.textMuted }]}>
                      Director • Force Welfare, MHA
                    </Text>
                  </View>
                  <ChevronRight size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </>
            )}
          </Card>

          {/* Credentials Sign In Card */}
          <Card style={styles.loginCard} variant="glass">
            <View style={styles.cardHeaderRow}>
              <Text style={[styles.cardTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                Defense Service Sign In
              </Text>
              <Badge label={currentForce.name} variant="primary" size="sm" />
            </View>
            <Text style={[styles.cardDesc, { color: colors.textMuted }]}>
              Enter your Service ID or registered armed forces credentials
            </Text>

            {errorMsg ? (
              <View style={[styles.errorBanner, { backgroundColor: `${colors.danger}20`, borderColor: colors.danger }]}>
                <ShieldAlert size={16} color={colors.danger} />
                <Text style={[styles.errorText, { color: colors.danger }]}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>SERVICE ID OR EMAIL</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                placeholder="e.g. CRPF-GD-2021-04128"
                placeholderTextColor={colors.textMuted}
                value={serviceId}
                onChangeText={setServiceId}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>PASSWORD</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <Button
              title="Sign In to MissionWell →"
              onPress={handleCredentialsLogin}
              loading={isLoading}
              icon={<Lock size={16} color="#FFFFFF" />}
              style={styles.signInBtn}
            />

            {/* Google OAuth Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsGoogleModalOpen(true)}
              style={[styles.googleBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
            >
              <View style={styles.googlePill}>
                <Text style={styles.googleG}>G</Text>
                <Text style={styles.googleO1}>o</Text>
                <Text style={styles.googleO2}>o</Text>
                <Text style={styles.googleG2}>g</Text>
                <Text style={styles.googleL}>l</Text>
                <Text style={styles.googleE}>e</Text>
              </View>
              <Text style={[styles.googleBtnText, { color: colors.text }]}>Sign in with Google SSO</Text>
            </TouchableOpacity>
          </Card>

          {/* Download Android Mobile App Banner */}
          <DownloadAppBanner style={styles.downloadBanner} />

          {/* Statutory DPDP Act Badge */}
          <View style={styles.dpdpSection}>
            <ShieldCheck size={15} color={colors.accent} />
            <Text style={[styles.dpdpText, { color: colors.textMuted }]}>
              DPDP Act 2023 Shield Active • Non-Punitive & End-to-End Encrypted
            </Text>
          </View>
        </View>

        {/* Google OAuth Modal */}
        <GoogleOAuthModal
          isOpen={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
          onSuccess={handleGoogleSuccess}
          mode="signin"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  tricolorBar: {
    flexDirection: "row",
    height: 4,
    width: "100%",
  },
  tricolorSegment: {
    flex: 1,
    height: "100%",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexWrap: "wrap",
    gap: 10,
    zIndex: 20,
  },
  navLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navBrandCol: {
    justifyContent: "center",
  },
  navBrandTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  navBrandTitle: {
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "GoogleSans-Bold",
    letterSpacing: -0.4,
  },
  navBrandAiText: {
    color: "#3B82F6",
    fontFamily: Platform.OS === "web" ? "'JetBrains Mono', monospace" : "JetBrainsMono-Bold",
  },
  navBlueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3B82F6",
  },
  navBrandSubtitle: {
    fontSize: 9,
    fontFamily: "GoogleSans-Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 1,
  },
  navRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  navUtilBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  navUtilText: {
    fontSize: 11,
    fontWeight: "700",
  },
  navSoldierBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  navSoldierText: {
    fontSize: 11,
    fontWeight: "700",
  },
  navCommandBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#2563EB",
  },
  navCommandText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 48,
  },
  heroWrapper: {
    width: "100%",
    minHeight: 460,
    position: "relative",
    overflow: "hidden",
  },
  heroBackground: {
    width: "100%",
    minHeight: 460,
    alignItems: "center",
    justifyContent: "center",
  },
  heroBackgroundImage: {
    opacity: 0.55,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(9, 13, 22, 0.78)",
  },
  heroGlowCenter: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(37, 99, 235, 0.18)",
    ...Platform.select({
      web: {
        filter: "blur(60px)",
      } as any,
      default: {
        opacity: 0.5,
      },
    }),
  },
  heroContent: {
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 48,
    maxWidth: 800,
    width: "100%",
  },
  heroHeadline: {
    fontSize: Platform.OS === "web" ? 34 : 26,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: Platform.OS === "web" ? 42 : 33,
    fontFamily: "GoogleSans-Bold",
    letterSpacing: -0.8,
    marginBottom: 14,
  },
  heroHighlight: {
    color: "#60A5FA",
  },
  heroSubheadline: {
    fontSize: 13,
    color: "#CBD5E1",
    textAlign: "center",
    maxWidth: 580,
    lineHeight: 20,
    fontFamily: "GoogleSans-Regular",
    marginBottom: 26,
  },
  heroCtaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
    width: "100%",
  },
  heroPrimaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  heroPrimaryBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    fontFamily: "GoogleSans-Bold",
  },
  heroSecondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1E293B",
    borderColor: "#334155",
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 12,
  },
  heroSecondaryBtnText: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "GoogleSans-Medium",
  },
  heroTertiaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderColor: "rgba(59, 130, 246, 0.35)",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 12,
  },
  heroTertiaryBtnText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
  },
  heroTrustBadgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    borderColor: "rgba(51, 65, 85, 0.8)",
    borderWidth: 1,
  },
  trustBadgeText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "600",
    fontFamily: Platform.OS === "web" ? "'JetBrains Mono', monospace" : "JetBrainsMono-Regular",
  },
  lowerContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    maxWidth: 620,
    width: "100%",
    alignSelf: "center",
  },
  evaluatorCard: {
    padding: 16,
    marginBottom: 20,
  },
  evaluatorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  evaluatorTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  personaTabContainer: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
    marginTop: 12,
    marginBottom: 10,
  },
  personaTabBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  personaTabBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  personaItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  personaIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  personaMeta: {
    flex: 1,
  },
  personaName: {
    fontSize: 13,
    fontWeight: "700",
  },
  personaRole: {
    fontSize: 11,
    marginTop: 1,
  },
  loginCard: {
    padding: 20,
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  cardDesc: {
    fontSize: 12,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 13,
  },
  signInBtn: {
    marginTop: 4,
    marginBottom: 12,
    height: 46,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  googlePill: {
    flexDirection: "row",
  },
  googleG: { color: "#4285F4", fontWeight: "900", fontSize: 16 },
  googleO1: { color: "#EA4335", fontWeight: "900", fontSize: 16 },
  googleO2: { color: "#FBBC05", fontWeight: "900", fontSize: 16 },
  googleG2: { color: "#4285F4", fontWeight: "900", fontSize: 16 },
  googleL: { color: "#34A853", fontWeight: "900", fontSize: 16 },
  googleE: { color: "#EA4335", fontWeight: "900", fontSize: 16 },
  googleBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "600",
  },
  downloadBanner: {
    marginBottom: 16,
  },
  dpdpSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 8,
  },
  dpdpText: {
    fontSize: 10,
    textAlign: "center",
    flex: 1,
    lineHeight: 14,
  },
});
