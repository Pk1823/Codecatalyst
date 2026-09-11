import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useForce } from "../../contexts/ForceContext";
import { Badge } from "./Badge";
import {
  PhoneCall,
  X,
  ShieldCheck,
  HeartHandshake,
  AlertCircle,
  Clock,
} from "lucide-react-native";

interface HelplineModalProps {
  isOpen?: boolean;
  visible?: boolean;
  onClose: () => void;
}

const HELPLINES = [
  {
    name: "CRPF Madadgaar Helpline",
    number: "14411",
    tel: "tel:14411",
    timing: "24x7 Continuous Toll-Free",
    scope: "Dedicated assistance for CRPF jawans, families & internal grievances",
    force: "CRPF",
    priority: "HIGH",
  },
  {
    name: "Tele-MANAS Armed Forces Desk",
    number: "14416",
    tel: "tel:14416",
    timing: "24x7 Multi-lingual Tele-Counseling",
    scope: "National mental health continuum under Ministry of Health & MHA",
    force: "ALL",
    priority: "HIGH",
  },
  {
    name: "Army Wellness & Stress Helpline",
    number: "1904",
    tel: "tel:1904",
    timing: "24x7 Command Medical Corps",
    scope: "Direct access to military psychologists and base hospital CMOs",
    force: "ARMY",
    priority: "HIGH",
  },
  {
    name: "BSF Seema Prahari Kalyan Kendra",
    number: "011-24364851",
    tel: "tel:01124364851",
    timing: "08:00 - 20:00 hrs Daily",
    scope: "Border outpost welfare coordination and family emergency liaison",
    force: "BSF",
    priority: "MEDIUM",
  },
];

export const HelplineModal: React.FC<HelplineModalProps> = ({ isOpen, visible, onClose }) => {
  const { colors, isDark } = useTheme();
  const { currentForce } = useForce();

  const handleCall = (tel: string) => {
    Linking.openURL(tel).catch(() => {});
  };

  return (
    <Modal visible={visible ?? isOpen ?? false} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.dialog,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.titleRow}>
              <View style={[styles.iconBox, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
                <PhoneCall size={20} color={colors.danger} />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.text }]}>Emergency Welfare Helplines</Text>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                  24/7 Confidential Armed Forces & Police Support
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentList} showsVerticalScrollIndicator={false}>
            <View style={[styles.banner, { backgroundColor: `${colors.info}15`, borderColor: colors.info }]}>
              <ShieldCheck size={16} color={colors.info} />
              <Text style={[styles.bannerText, { color: colors.text }]}>
                Calls are strictly confidential, non-punitive, and do not require prior administrative permission from Coy Commander.
              </Text>
            </View>

            {HELPLINES.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.helplineCard,
                  { backgroundColor: colors.surface, borderColor: colors.cardBorder },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.helplineName, { color: colors.text }]}>{item.name}</Text>
                    <Badge
                      label={item.number}
                      variant="danger"
                      size="sm"
                    />
                  </View>
                </View>

                <Text style={[styles.scopeText, { color: colors.textMuted }]}>{item.scope}</Text>

                <View style={styles.timingRow}>
                  <Clock size={12} color={colors.textMuted} />
                  <Text style={[styles.timingText, { color: colors.textMuted }]}>{item.timing}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleCall(item.tel)}
                  style={[styles.callBtn, { backgroundColor: colors.primary }]}
                >
                  <PhoneCall size={14} color="#FFFFFF" />
                  <Text style={styles.callBtnText}>Dial {item.number} Now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={[styles.doneBtn, { backgroundColor: colors.surface }]}>
            <Text style={[styles.doneBtnText, { color: colors.text }]}>Close Helplines</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  dialog: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "85%",
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  contentList: {
    padding: 16,
  },
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    marginBottom: 14,
  },
  bannerText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  helplineCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    marginBottom: 6,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  helplineName: {
    fontSize: 14,
    fontWeight: "800",
    flex: 1,
  },
  scopeText: {
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 8,
  },
  timingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  timingText: {
    fontSize: 10,
    fontWeight: "600",
  },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  callBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  doneBtn: {
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
