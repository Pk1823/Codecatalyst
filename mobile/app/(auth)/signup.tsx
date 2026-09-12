import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useForce } from "../../contexts/ForceContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { GoogleOAuthModal } from "../../components/auth/GoogleOAuthModal";
import { MissionWellIcon } from "../../components/ui/MissionWellLogo";
import {
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  ShieldAlert,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react-native";
import { User } from "../../types";
import { ForceId } from "../../constants/forces";

export default function SignupScreen() {
  const { signup, loginWithGoogle, isLoading } = useAuth();
  const { colors } = useTheme();
  const { currentForce, setForce, availableForces } = useForce();
  const router = useRouter();

  // Simple, Essential Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleSignup = async () => {
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your full name");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg("Password must be at least 4 characters");
      return;
    }

    try {
      await signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        force: currentForce.id,
        role: "PERSONNEL",
      });

      router.replace("/personnel");
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please check your details.");
    }
  };

  const handleGoogleSuccess = async (googleUser: User) => {
    setIsGoogleModalOpen(false);
    try {
      await loginWithGoogle({
        ...googleUser,
        force: currentForce.id,
        role: "PERSONNEL",
      });
      router.replace("/personnel");
    } catch {
      router.replace("/personnel");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Top Segmented Tab: Switch between Sign In and Create Account */}
      <View style={[styles.authSwitchContainer, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
        <TouchableOpacity
          style={styles.authSwitchInactiveTab}
          onPress={() => router.replace("/login")}
          activeOpacity={0.7}
        >
          <Text style={[styles.authSwitchInactiveText, { color: colors.textMuted }]}>Sign In</Text>
        </TouchableOpacity>
        <View style={[styles.authSwitchActiveTab, { backgroundColor: colors.primary }]}>
          <Text style={styles.authSwitchActiveText}>Create Account</Text>
        </View>
      </View>

      {/* Hero Branding */}
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
          Central Armed Police Forces & Defense Welfare
        </Text>
      </View>

      {/* Main Registration Card */}
      <Card style={styles.card} variant="glass">
        <Text style={[styles.cardTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
          Create Your Account
        </Text>
        <Text style={[styles.cardDesc, { color: colors.textMuted }]}>
          Confidential stress tracking, buddy-pair support, and proactive welfare.
        </Text>

        {/* 1-Tap Google Sign Up */}
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
          <Text style={[styles.googleBtnText, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
            Sign up with Google SSO
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textMuted }]}>
            or continue with email
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Error Alert */}
        {errorMsg ? (
          <View style={[styles.errorBanner, { backgroundColor: `${colors.danger}20`, borderColor: colors.danger }]}>
            <ShieldAlert size={16} color={colors.danger} />
            <Text style={[styles.errorText, { color: colors.danger }]}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Select Force / Branch (Quick 1-Tap Chips) */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textMuted }]}>SELECT YOUR FORCE / BRANCH</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.forceScroll}>
            {availableForces.map((f) => {
              const isSelected = currentForce.id === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => setForce(f.id as ForceId)}
                  style={[
                    styles.forceChip,
                    {
                      backgroundColor: isSelected ? `${f.primaryColor}25` : colors.surface,
                      borderColor: isSelected ? f.primaryColor : colors.cardBorder,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.forceDot, { backgroundColor: f.primaryColor }]} />
                  <Text
                    style={[
                      styles.forceChipText,
                      {
                        color: isSelected ? colors.text : colors.textMuted,
                        fontWeight: isSelected ? "800" : "600",
                        fontFamily: isSelected ? "GoogleSans-Bold" : "GoogleSans-Medium",
                      },
                    ]}
                  >
                    {f.id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textMuted }]}>FULL NAME</Text>
          <View style={styles.inputWithIcon}>
            <View style={styles.inputIconBox}>
              <UserIcon size={16} color={colors.textMuted} />
            </View>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="e.g. Vikas Sharma"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textMuted }]}>EMAIL ADDRESS</Text>
          <View style={styles.inputWithIcon}>
            <View style={styles.inputIconBox}>
              <Mail size={16} color={colors.textMuted} />
            </View>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="e.g. vikas@gmail.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textMuted }]}>PASSWORD</Text>
          <View style={styles.inputWithIcon}>
            <View style={styles.inputIconBox}>
              <Lock size={16} color={colors.textMuted} />
            </View>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="At least 4 characters"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              {showPassword ? <EyeOff size={18} color={colors.textMuted} /> : <Eye size={18} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <Button
          title="Create Account →"
          onPress={handleSignup}
          loading={isLoading}
          icon={<ArrowRight size={16} color="#FFFFFF" />}
          style={styles.submitBtn}
        />

        {/* Already have an account link */}
        <View style={styles.loginRedirectRow}>
          <Text style={[styles.loginRedirectText, { color: colors.textMuted }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.replace("/login")} activeOpacity={0.7}>
            <Text style={[styles.loginRedirectLink, { color: colors.primary, fontFamily: "GoogleSans-Bold" }]}>
              Sign In →
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Statutory DPDP Act Privacy Notice */}
      <View style={styles.dpdpSection}>
        <ShieldCheck size={16} color={colors.accent} />
        <Text style={[styles.dpdpText, { color: colors.textMuted }]}>
          Protected under Digital Personal Data Protection (DPDP) Act 2023. Non-punitive and strictly confidential.
        </Text>
      </View>

      {/* Google OAuth Modal in Signup Mode */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
        initialRole="PERSONNEL"
        initialForce={currentForce.id}
        mode="signup"
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
    paddingTop: 44,
    paddingBottom: 48,
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
    fontFamily: "GoogleSans-Bold",
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
    fontFamily: "GoogleSans-Medium",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 20,
    gap: 4,
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
    marginTop: 6,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  card: {
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  cardDesc: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 16,
    lineHeight: 17,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginBottom: 16,
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
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
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 6,
    fontFamily: "GoogleSans-Bold",
  },
  forceScroll: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  forceChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  forceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  forceChipText: {
    fontSize: 11,
  },
  inputWithIcon: {
    position: "relative",
    justifyContent: "center",
  },
  inputIconBox: {
    position: "absolute",
    left: 12,
    zIndex: 2,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingLeft: 38,
    paddingRight: 14,
    fontSize: 14,
    fontFamily: "GoogleSans-Regular",
  },
  passwordInput: {
    paddingRight: 44,
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    padding: 4,
    zIndex: 2,
  },
  submitBtn: {
    marginTop: 6,
    marginBottom: 12,
  },
  loginRedirectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 8,
  },
  loginRedirectText: {
    fontSize: 12,
    fontFamily: "GoogleSans-Regular",
  },
  loginRedirectLink: {
    fontSize: 12,
    fontWeight: "800",
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
    fontFamily: "GoogleSans-Regular",
  },
});
