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
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useForce } from "../../contexts/ForceContext";
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
} from "lucide-react-native";
import { EVALUATOR_PERSONAS } from "../../services/auth";
import { User } from "../../types";

export default function LoginScreen() {
  const { login, loginAsPersona, loginWithGoogle, isLoading } = useAuth();
  const { colors } = useTheme();
  const { currentForce } = useForce();
  const router = useRouter();

  const [serviceId, setServiceId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleCredentialsLogin = async () => {
    if (!serviceId.trim()) {
      setErrorMsg("Please enter your Service ID");
      return;
    }
    setErrorMsg("");
    try {
      await login(serviceId, password);
      router.replace("/personnel");
    } catch (e: any) {
      setErrorMsg(e.message || "Login failed");
    }
  };

  const handlePersonaLogin = async (key: keyof typeof EVALUATOR_PERSONAS) => {
    try {
      await loginAsPersona(key);
      router.replace("/personnel");
    } catch {
      Alert.alert("Error", "Could not sign in with this persona");
    }
  };

  const handleGoogleSuccess = async (googleUser: User) => {
    setIsGoogleModalOpen(false);
    await loginWithGoogle(googleUser);
    router.replace("/personnel");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Auth Mode Segmented Control */}
      <View style={[styles.authSwitchContainer, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
        <View style={[styles.authSwitchActiveTab, { backgroundColor: colors.primary }]}>
          <Text style={styles.authSwitchActiveText}>Sign In</Text>
        </View>
        <TouchableOpacity
          style={styles.authSwitchInactiveTab}
          onPress={() => router.replace("/signup")}
          activeOpacity={0.7}
        >
          <Text style={[styles.authSwitchInactiveText, { color: colors.textMuted }]}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Authentic MissionWell AI Defense Sentinel Logo */}
      <View style={styles.heroSection}>
        <View style={styles.heroGlowBackdrop} />
        <MissionWellIcon size="xl" showBadge={true} />
        <View style={styles.heroBrandTextRow}>
          <Text style={[styles.brandTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
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
        </View>
        <Text style={[styles.brandSubtitle, { color: colors.textMuted, fontFamily: "GoogleSans-Medium" }]}>
          {currentForce.hindiName} • {currentForce.name}
        </Text>
        <View style={[styles.mottoPill, { backgroundColor: `${currentForce.primaryColor}18`, borderColor: `${currentForce.primaryColor}40` }]}>
          <Text style={[styles.mottoText, { color: currentForce.primaryColor, fontFamily: "GoogleSans-Medium" }]}>
            "{currentForce.hindiMotto}"
          </Text>
        </View>
      </View>

      {/* Main Credentials Card */}
      <Card style={styles.loginCard} variant="glass">
        <Text style={[styles.cardTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>Sign In to MissionWell</Text>
        <Text style={[styles.cardDesc, { color: colors.textMuted }]}>
          Enter your Service ID or registered email to continue
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
            placeholder="e.g. CRPF-GD-2021-04128 or email"
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
          title="Sign In →"
          onPress={handleCredentialsLogin}
          loading={isLoading}
          icon={<Lock size={16} color="#FFFFFF" />}
          style={styles.signInBtn}
        />

        {/* Google SSO Button */}
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

        {/* Redirect to Sign Up */}
        <View style={styles.signupRedirectRow}>
          <Text style={[styles.signupRedirectText, { color: colors.textMuted }]}>
            New personnel or officer?
          </Text>
          <TouchableOpacity onPress={() => router.push("/signup")} activeOpacity={0.7}>
            <Text style={[styles.signupRedirectLink, { color: colors.primary }]}>
              Register / Sign Up →
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* 1-Tap Soldier Profiles */}
      <Card style={styles.evaluatorCard}>
        <View style={styles.evaluatorHeader}>
          <Text style={[styles.evaluatorTitle, { color: colors.text }]}>
            Quick Soldier Access (Jawan / NCO)
          </Text>
          <Badge label="SOLDIER ACCESS" variant="info" size="sm" />
        </View>
        <Text style={[styles.evaluatorSubtitle, { color: colors.textMuted }]}>
          Instant voluntary self-assessment profile access
        </Text>

        {/* Soldier 1: Ct. Piyush Kumar */}
        <TouchableOpacity
          style={[styles.personaItem, { borderBottomColor: colors.border }]}
          onPress={() => handlePersonaLogin("jawan")}
        >
          <View style={[styles.personaIcon, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
            <UserCheck size={18} color="#3B82F6" />
          </View>
          <View style={styles.personaMeta}>
            <Text style={[styles.personaName, { color: colors.text }]}>Ct. Piyush Kumar</Text>
            <Text style={[styles.personaRole, { color: colors.textMuted }]}>
              Constable (GD) • 114 Bn Alpha Coy (Sukma)
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
            <Text style={[styles.personaName, { color: colors.text }]}>Hav. Rajesh Kumar</Text>
            <Text style={[styles.personaRole, { color: colors.textMuted }]}>
              Havildar • 114 Bn Bravo Coy
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
            <Text style={[styles.personaName, { color: colors.text }]}>ASI Gurpreet Singh</Text>
            <Text style={[styles.personaRole, { color: colors.textMuted }]}>
              Assistant Sub-Inspector • 114 Bn HQ Coy
            </Text>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </Card>

      {/* Statutory DPDP Act Badge */}
      <View style={styles.dpdpSection}>
        <ShieldCheck size={16} color={colors.accent} />
        <Text style={[styles.dpdpText, { color: colors.textMuted }]}>
          Compliant with Digital Personal Data Protection (DPDP) Act 2023 • Non-Punitive Zero-Stigma Shield Active
        </Text>
      </View>

      {/* Google OAuth Modal */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
        mode="signin"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 24,
    gap: 6,
    position: "relative",
  },
  heroGlowBackdrop: {
    position: "absolute",
    top: -10,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(37, 99, 235, 0.16)",
    ...Platform.select({
      web: {
        filter: "blur(40px)",
      } as any,
      default: {
        opacity: 0.6,
      },
    }),
  },
  heroBrandTextRow: {
    marginTop: 8,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    textAlign: "center",
  },
  mottoPill: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  mottoText: {
    fontSize: 12,
    fontWeight: "700",
    fontStyle: "italic",
  },
  loginCard: {
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  cardDesc: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 16,
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
    flex: 1,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  signInBtn: {
    marginTop: 6,
    marginBottom: 10,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    borderRadius: 12,
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
  evaluatorSubtitle: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 12,
  },
  personaItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
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
  authSwitchContainer: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    marginBottom: 20,
  },
  authSwitchActiveTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  authSwitchActiveText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  authSwitchInactiveTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  authSwitchInactiveText: {
    fontSize: 12,
    fontWeight: "600",
  },
  signupRedirectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 12,
  },
  signupRedirectText: {
    fontSize: 12,
  },
  signupRedirectLink: {
    fontSize: 12,
    fontWeight: "800",
  },
});
