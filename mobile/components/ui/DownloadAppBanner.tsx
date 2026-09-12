import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Modal,
  Image,
} from "react-native";
import { Download, Smartphone, QrCode, X, ExternalLink, ShieldCheck } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";

export const APK_DOWNLOAD_URL =
  "https://expo.dev/accounts/vikasgangwars-team/projects/vikas/builds/b2fea7a1-0e68-42aa-9621-ac60ebdfce88";

export function DownloadAppBanner({ style }: { style?: any } = {}) {
  const { colors } = useTheme();
  const [showQrModal, setShowQrModal] = useState(false);

  const handleDownload = () => {
    Linking.openURL(APK_DOWNLOAD_URL).catch(() => {});
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: "rgba(16, 185, 129, 0.4)",
          },
          style,
        ]}
      >
        <View style={styles.contentRow}>
          <View style={[styles.iconBox, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
            <Smartphone size={22} color="#10B981" />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                Install Android App
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>APK LIVE</Text>
              </View>
            </View>
            <Text style={[styles.desc, { color: colors.textMuted }]}>
              Standalone defense build for mobile jawans & officers
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDownload}
            style={[styles.downloadBtn, { backgroundColor: colors.primary }]}
          >
            <Download size={15} color="#FFFFFF" />
            <Text style={styles.downloadBtnText}>Download APK ↓</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowQrModal(true)}
            style={[styles.qrBtn, { borderColor: colors.cardBorder, backgroundColor: colors.surface }]}
          >
            <QrCode size={15} color={colors.text} />
            <Text style={[styles.qrBtnText, { color: colors.text }]}>Scan QR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* QR Code Modal */}
      <Modal visible={showQrModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Smartphone size={20} color="#10B981" />
                <Text style={[styles.modalTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                  Scan to Install APK
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowQrModal(false)}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.qrContainer}>
              <Image
                source={{
                  uri: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                    APK_DOWNLOAD_URL
                  )}`,
                }}
                style={styles.qrImage}
                resizeMode="contain"
              />
              <Text style={[styles.qrHint, { color: colors.textMuted }]}>
                Scan with your Android camera to download and install immediately.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDownload}
              style={[styles.modalDownloadBtn, { backgroundColor: colors.primary }]}
            >
              <ExternalLink size={16} color="#FFFFFF" />
              <Text style={styles.modalDownloadBtnText}>Open Download Page →</Text>
            </TouchableOpacity>

            <View style={styles.securityPill}>
              <ShieldCheck size={14} color="#10B981" />
              <Text style={[styles.securityText, { color: colors.textMuted }]}>
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
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#10B981",
    letterSpacing: 0.5,
  },
  desc: {
    fontSize: 11,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  downloadBtn: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9,
  },
  downloadBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  qrBtn: {
    flex: 0.8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9,
    borderWidth: 1,
  },
  qrBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
  },
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  qrContainer: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 14,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  qrHint: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
    color: "#475569",
    maxWidth: 220,
  },
  modalDownloadBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  modalDownloadBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  securityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  securityText: {
    fontSize: 10,
    fontWeight: "600",
  },
});
