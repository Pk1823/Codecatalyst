import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Modal,
  Image,
  Platform,
} from "react-native";
import {
  Download,
  Smartphone,
  QrCode,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";

export const APK_DOWNLOAD_URL =
  "https://expo.dev/artifacts/eas/yvAtBZw2zbikRy_vpT088XX7N8988K03nYs-dPocoas.apk";

export function DownloadAppBanner({ style }: { style?: any } = {}) {
  const { colors } = useTheme();
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      try {
        const a = document.createElement("a");
        a.href = APK_DOWNLOAD_URL;
        a.setAttribute("download", "missionwell.apk");
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      } catch {}
      window.location.href = APK_DOWNLOAD_URL;
      return;
    }
    Linking.openURL(APK_DOWNLOAD_URL).catch(() => {});
  };

  const handleCopy = () => {
    if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(APK_DOWNLOAD_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Web-identical standalone defense APK card */}
      <View style={[styles.container, style]}>
        {/* Header with Emerald Icon and APK LIVE Badge */}
        <View style={styles.headerRow}>
          <View style={styles.iconBox}>
            <Smartphone size={22} color="#10B981" />
          </View>
          <View style={styles.headerTextCol}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                Download MissionWell Android App
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>APK LIVE</Text>
              </View>
            </View>
            <Text style={[styles.desc, { color: colors.textMuted, fontFamily: "GoogleSans-Medium" }]}>
              Direct install for CAPF Jawans, Welfare Officers & Tactical Commanders
            </Text>
          </View>
        </View>

        {/* Defense Grade Callout Box (Exact match with Web Portal) */}
        <View style={styles.defenseCallout}>
          <View style={styles.defenseCalloutTitleRow}>
            <ShieldCheck size={14} color="#10B981" />
            <Text style={styles.defenseCalloutTitle}>
              Standalone Defense Build (Render Live Connected)
            </Text>
          </View>
          <Text style={styles.defenseCalloutDesc}>
            No Expo Go required. Compiled specifically for field deployment and connects directly to the live secure Render cloud backend.
          </Text>
        </View>

        {/* Features Checklist */}
        <View style={styles.checklist}>
          <View style={styles.checkItem}>
            <CheckCircle2 size={13} color="#10B981" />
            <Text style={styles.checkText}>Instant Android Installation</Text>
          </View>
          <View style={styles.checkItem}>
            <CheckCircle2 size={13} color="#10B981" />
            <Text style={styles.checkText}>Confidential DPDP Self-Check</Text>
          </View>
          <View style={styles.checkItem}>
            <CheckCircle2 size={13} color="#10B981" />
            <Text style={styles.checkText}>Offline Forward Post Sync</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleDownload}
            style={styles.downloadBtn}
          >
            <Download size={16} color="#FFFFFF" />
            <Text style={styles.downloadBtnText}>Download APK File (Direct) ↓</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowQrModal(true)}
            style={styles.qrBtn}
          >
            <QrCode size={16} color="#10B981" />
            <Text style={styles.qrBtnText}>Scan QR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Interactive QR Code Modal (Exact match with Web Download Modal) */}
      <Modal visible={showQrModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Close Button */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={styles.modalIconBox}>
                  <Smartphone size={20} color="#10B981" />
                </View>
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={styles.modalTitle}>
                      Scan to Install APK
                    </Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>APK LIVE</Text>
                    </View>
                  </View>
                  <Text style={styles.modalSubtitle}>
                    MissionWell AI Mobile Deployment
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowQrModal(false)}
                style={styles.closeBtn}
                accessibilityLabel="Close"
              >
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Defense callout in modal */}
            <View style={styles.defenseCallout}>
              <View style={styles.defenseCalloutTitleRow}>
                <ShieldCheck size={13} color="#10B981" />
                <Text style={styles.defenseCalloutTitle}>
                  Direct Production Release
                </Text>
              </View>
              <Text style={styles.defenseCalloutDesc}>
                Point your smartphone camera at the code below to download the latest signed build.
              </Text>
            </View>

            {/* QR Code Container */}
            <View style={styles.qrContainer}>
              <View style={styles.qrWhiteWrapper}>
                <Image
                  source={{
                    uri: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                      APK_DOWNLOAD_URL
                    )}`,
                  }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.qrHint}>
                Scan with phone camera to download APK directly
              </Text>
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleDownload}
                style={styles.modalDownloadBtn}
              >
                <Download size={15} color="#FFFFFF" />
                <Text style={styles.modalDownloadBtnText}>Download Android APK ↓</Text>
              </TouchableOpacity>

              {Platform.OS === "web" && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleCopy}
                  style={styles.copyBtn}
                >
                  {copied ? (
                    <>
                      <Check size={14} color="#10B981" />
                      <Text style={styles.copyBtnTextActive}>Link Copied!</Text>
                    </>
                  ) : (
                    <>
                      <Copy size={14} color="#94A3B8" />
                      <Text style={styles.copyBtnText}>Copy APK Link</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Security Pill Footer */}
            <View style={styles.securityPill}>
              <ShieldCheck size={13} color="#10B981" />
              <Text style={styles.securityText}>
                EAS Signed Release • Non-Punitive Defense Shield
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0B132B",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(16, 185, 129, 0.35)",
    padding: 16,
    marginTop: 18,
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(16, 185, 129, 0.15)",
      } as any,
      default: {
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
      },
    }),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 14.5,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: "900",
    color: "#10B981",
    letterSpacing: 0.5,
  },
  desc: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
  },
  defenseCallout: {
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(51, 65, 85, 0.6)",
    borderRadius: 12,
    padding: 11,
    marginTop: 12,
  },
  defenseCalloutTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 3,
  },
  defenseCalloutTitle: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#34D399",
  },
  defenseCalloutDesc: {
    fontSize: 10.5,
    lineHeight: 14.5,
    color: "#94A3B8",
  },
  checklist: {
    marginTop: 10,
    gap: 6,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checkText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6EE7B7",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  downloadBtn: {
    flex: 1.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#059669",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    ...Platform.select({
      web: {
        boxShadow: "0 4px 12px rgba(5, 150, 105, 0.35)",
        cursor: "pointer",
      } as any,
    }),
  },
  downloadBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  qrBtn: {
    flex: 0.9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    ...Platform.select({
      web: {
        cursor: "pointer",
      } as any,
    }),
  },
  qrBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#10B981",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    ...Platform.select({
      web: {
        backdropFilter: "blur(6px)",
      } as any,
    }),
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#0B132B",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(16, 185, 129, 0.4)",
    padding: 20,
    ...Platform.select({
      web: {
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
      } as any,
    }),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  modalIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  modalSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(30, 41, 59, 0.6)",
  },
  qrContainer: {
    alignItems: "center",
    paddingVertical: 14,
  },
  qrWhiteWrapper: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  qrImage: {
    width: 170,
    height: 170,
  },
  qrHint: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
    color: "#94A3B8",
    fontFamily: Platform.OS === "web" ? "monospace" : undefined,
  },
  modalActions: {
    gap: 8,
    marginTop: 6,
    marginBottom: 14,
  },
  modalDownloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#059669",
    paddingVertical: 12,
    borderRadius: 10,
  },
  modalDownloadBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(71, 85, 105, 0.6)",
    paddingVertical: 9,
    borderRadius: 8,
  },
  copyBtnText: {
    color: "#CBD5E1",
    fontSize: 11.5,
    fontWeight: "700",
  },
  copyBtnTextActive: {
    color: "#10B981",
    fontSize: 11.5,
    fontWeight: "700",
  },
  securityPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(30, 41, 59, 0.8)",
  },
  securityText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
  },
});
