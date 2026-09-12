import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  Switch,
  Platform,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { OfflineSyncService } from "../../services/offlineSync";
import {
  Radio,
  WifiOff,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Server,
  CloudOff,
  HardDrive,
  Clock,
  PhoneCall,
  X,
  Lock,
} from "lucide-react-native";

interface BannerProps {
  compact?: boolean;
}

export const TacticalOfflineBanner: React.FC<BannerProps> = ({ compact = false }) => {
  const { colors, isDark } = useTheme();
  const { isHi } = useLanguage();

  const [isAirGap, setIsAirGap] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cachedAssessmentsCount, setCachedAssessmentsCount] = useState(0);

  useEffect(() => {
    const unsubscribe = OfflineSyncService.subscribe((state) => {
      setIsAirGap(state.isAirGap);
      setQueueCount(state.queueCount);
      setLastSync(state.lastSync);
    });

    OfflineSyncService.getLocalAssessments().then((list) => {
      setCachedAssessmentsCount(list.length);
    });

    return unsubscribe;
  }, []);

  const handleToggleAirGap = async (value: boolean) => {
    await OfflineSyncService.setAirGapMode(value);
    setIsAirGap(value);
    if (value) {
      Alert.alert(
        isHi ? "फॉरवर्ड पोस्ट एयर-गैप मोड चालू" : "Forward Post Air-Gap Mode Active",
        isHi
          ? "सभी नेटवर्क ट्रांसमिशन बंद कर दिए गए हैं। ऑन-डिवाइस एआई मूल्यांकन 100% सुरक्षित स्थानीय वॉल्ट में चलेगा।"
          : "Radio-silent operation active. On-device AI evaluations and buddy checks will be cached securely in the local vault with zero RF emissions."
      );
    }
  };

  const handleSyncNow = async () => {
    if (isAirGap) {
      Alert.alert(
        isHi ? "एयर-गैप मोड सक्रिय" : "Air-Gap Active",
        isHi
          ? "सिंक करने के लिए पहले एयर-गैप मोड बंद करें।"
          : "Please disable Air-Gap Mode before synchronizing with the Battalion Server."
      );
      return;
    }

    setIsSyncing(true);
    try {
      const result = await OfflineSyncService.syncNow();
      Alert.alert(
        result.success ? (isHi ? "डेटा सिंक सफल" : "Battalion Sync Completed") : (isHi ? "आंशिक सिंक" : "Sync Notice"),
        result.message
      );
    } catch {
      Alert.alert(
        isHi ? "सिंक त्रुटि" : "Sync Error",
        isHi
          ? "बेस सर्वर से संपर्क नहीं हो सका। कृपया बेस कैंप वाई-फाई या नेटवर्क कवरेज में पुनः प्रयास करें।"
          : "Could not reach Battalion Base. Your data remains safely encrypted on-device."
      );
    } finally {
      setIsSyncing(false);
      const count = await OfflineSyncService.getQueueCount();
      setQueueCount(count);
      const list = await OfflineSyncService.getLocalAssessments();
      setCachedAssessmentsCount(list.length);
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Tactical Status Pill / Banner */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setModalOpen(true)}
        style={[
          styles.bannerCard,
          {
            backgroundColor: isAirGap ? "rgba(245, 158, 11, 0.12)" : queueCount > 0 ? "rgba(59, 130, 246, 0.12)" : "rgba(16, 185, 129, 0.10)",
            borderColor: isAirGap ? "rgba(245, 158, 11, 0.35)" : queueCount > 0 ? "rgba(59, 130, 246, 0.35)" : "rgba(16, 185, 129, 0.28)",
          },
        ]}
      >
        <View style={styles.bannerLeft}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isAirGap ? "rgba(245, 158, 11, 0.2)" : queueCount > 0 ? "rgba(59, 130, 246, 0.2)" : "rgba(16, 185, 129, 0.2)",
              },
            ]}
          >
            {isAirGap ? (
              <Radio size={14} color="#F59E0B" />
            ) : queueCount > 0 ? (
              <CloudOff size={14} color="#3B82F6" />
            ) : (
              <ShieldCheck size={14} color="#10B981" />
            )}
          </View>

          <View style={styles.bannerTextCol}>
            <Text
              style={[
                styles.bannerTitle,
                {
                  color: isAirGap ? "#F59E0B" : queueCount > 0 ? "#3B82F6" : "#10B981",
                  fontFamily: "GoogleSans-Bold",
                },
              ]}
            >
              {isAirGap
                ? isHi
                  ? "फॉरवर्ड पोस्ट एयर-गैप मोड (ऑफलाइन)"
                  : "FORWARD POST MODE • 100% OFFLINE"
                : queueCount > 0
                ? isHi
                  ? `${queueCount} रिकॉर्ड सिंक कतार में सुरक्षित`
                  : `${queueCount} RECORD(S) QUEUED FOR BASE SYNC`
                : isHi
                ? "बटालियन ग्रिड कनेक्टेड • डेटा सुरक्षित"
                : "BATTALION CENTRAL GRID ACTIVE • ALL SYNCED"}
            </Text>

            <Text style={[styles.bannerSub, { color: colors.textMuted }]}>
              {isAirGap
                ? isHi
                  ? "ज़ीरो रेडियो सिग्नेचर • स्थानीय एआई इंजन सक्रिय"
                  : "Zero RF Signature • On-Device AI Calibrated"
                : queueCount > 0
                ? isHi
                  ? "सुरक्षित स्थानीय स्टोरेज में सहेजा गया • बेस आने पर स्वतः सिंक"
                  : "Stored in Military Local Vault • Tap to Sync with Base"
                : isHi
                ? "सुरक्षित एंड-टू-एंड एन्क्रिप्शन सक्रिय"
                : "Continuous Real-time Telemetry Active"}
            </Text>
          </View>
        </View>

        {queueCount > 0 && (
          <TouchableOpacity
            style={[styles.syncQuickBtn, { backgroundColor: colors.primary }]}
            onPress={handleSyncNow}
            disabled={isSyncing || isAirGap}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <RefreshCw size={12} color="#FFFFFF" />
            )}
            <Text style={styles.syncQuickBtnText}>
              {isHi ? "सिंक" : "Sync"}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Detailed Tactical Offline & Air-Gap Modal */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalOpen(false)}>
          <View
            style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalTitleGroup}>
                <View style={[styles.modalTitleIcon, { backgroundColor: "rgba(16, 185, 129, 0.18)" }]}>
                  <HardDrive size={18} color="#10B981" />
                </View>
                <View>
                  <Text style={[styles.modalHeading, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                    {isHi ? "फॉरवर्ड पोस्ट ऑफलाइन डिफेंस मोड" : "Forward Post Defense Vault"}
                  </Text>
                  <Text style={[styles.modalSub, { color: colors.textMuted }]}>
                    {isHi ? "सियाचिन, एलडब्ल्यूई एवं सीमावर्ती चौकियों हेतु" : "High-Altitude & Zero-Network Border Outposts"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Stealth Air-Gap Switch */}
            <View style={[styles.switchBox, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={[styles.switchTitle, { color: colors.text, fontFamily: "GoogleSans-Bold" }]}>
                  {isHi ? "हवाई अलगाव (Air-Gap Stealth Mode)" : "Air-Gap Tactical Stealth"}
                </Text>
                <Text style={[styles.switchDesc, { color: colors.textMuted }]}>
                  {isHi
                    ? "रेडियो सिग्नल्स को पूरी तरह ब्लॉक कर 100% ऑन-डिवाइस मोड में चलाएं।"
                    : "Suspends all outgoing RF requests. Evaluates soldier assessments entirely on-device."}
                </Text>
              </View>
              <Switch
                value={isAirGap}
                onValueChange={handleToggleAirGap}
                trackColor={{ false: colors.border, true: "#10B981" }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Tactical Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.metricVal, { color: colors.primary, fontFamily: "GoogleSans-Bold" }]}>
                  {queueCount}
                </Text>
                <Text style={[styles.metricLbl, { color: colors.textMuted }]}>
                  {isHi ? "आउटबॉक्स कतार" : "Queued Records"}
                </Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.metricVal, { color: colors.success, fontFamily: "GoogleSans-Bold" }]}>
                  {cachedAssessmentsCount}
                </Text>
                <Text style={[styles.metricLbl, { color: colors.textMuted }]}>
                  {isHi ? "स्थानीय असेसमेंट" : "Cached History"}
                </Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Text style={[styles.metricVal, { color: "#F59E0B", fontFamily: "GoogleSans-Bold" }]}>
                  {lastSync || "--:--"}
                </Text>
                <Text style={[styles.metricLbl, { color: colors.textMuted }]}>
                  {isHi ? "अंतिम सिंक" : "Last Base Sync"}
                </Text>
              </View>
            </View>

            {/* Primary Sync Action */}
            <TouchableOpacity
              style={[
                styles.syncFullBtn,
                {
                  backgroundColor: colors.primary,
                  opacity: isAirGap ? 0.6 : 1,
                },
              ]}
              onPress={handleSyncNow}
              disabled={isSyncing || isAirGap}
              activeOpacity={0.8}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <RefreshCw size={16} color="#FFFFFF" />
              )}
              <Text style={[styles.syncFullBtnText, { fontFamily: "GoogleSans-Bold" }]}>
                {isSyncing
                  ? isHi
                    ? "बेस सर्वर से सिंक हो रहा है..."
                    : "Synchronizing with Battalion Server..."
                  : isHi
                  ? "बेस सर्वर से अभी सिंक करें"
                  : "Sync Outbox with Central Server Now"}
              </Text>
            </TouchableOpacity>

            {/* Security Assurance */}
            <View style={styles.assuranceBox}>
              <Lock size={14} color={colors.accent} />
              <Text style={[styles.assuranceText, { color: colors.textMuted }]}>
                {isHi
                  ? "सभी असेसमेंट मिलिट्री-ग्रेड एन्क्रिप्शन से सुरक्षित हैं एवं बेस कैंप पहुंचने पर स्वतः सिंक हो जाएंगे।"
                  : "All operational wellness assessments are hashed locally with zero data loss."}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
  },
  bannerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  bannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  bannerSub: {
    fontSize: 10,
    marginTop: 1,
  },
  syncQuickBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  syncQuickBtnText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
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
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 16,
    ...Platform.select({
      web: {
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
      } as any,
    }),
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  modalTitleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeading: {
    fontSize: 15,
    fontWeight: "800",
  },
  modalSub: {
    fontSize: 11,
    marginTop: 1,
  },
  switchBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  switchDesc: {
    fontSize: 11,
    marginTop: 3,
    lineHeight: 15,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  metricCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: "900",
  },
  metricLbl: {
    fontSize: 9.5,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  syncFullBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },
  syncFullBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  assuranceBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  assuranceText: {
    fontSize: 10.5,
    textAlign: "center",
    flex: 1,
    lineHeight: 14,
  },
});
