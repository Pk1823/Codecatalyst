import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { Header } from "../../components/ui/Header";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useTheme } from "../../contexts/ThemeContext";
import {
  AlertTriangle,
  CalendarCheck,
  HeartHandshake,
  CheckCheck,
  ShieldCheck,
} from "lucide-react-native";

interface AlertItem {
  id: string;
  title: string;
  description: string;
  time: string;
  priority: "HIGH" | "MEDIUM" | "INFO";
  icon: "warning" | "darbar" | "buddy";
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "ALT-101",
    title: "Buddy-Pair Check Required",
    description: "Scheduled 18:00 hrs mutual welfare check with Ct. Surinder Singh pending.",
    time: "15 mins ago",
    priority: "HIGH",
    icon: "buddy",
  },
  {
    id: "ALT-102",
    title: "CO Darbar Slot Confirmed",
    description: "Audience with Commanding Officer scheduled for tomorrow at 10:00 hrs at Battalion HQ.",
    time: "2 hours ago",
    priority: "MEDIUM",
    icon: "darbar",
  },
  {
    id: "ALT-103",
    title: "Sleep Stand-Down Routine",
    description: "48-hour continuous area domination cycle completed. 8-hour mandatory recovery window active.",
    time: "5 hours ago",
    priority: "INFO",
    icon: "warning",
  },
];

export default function AlertsScreen() {
  const { colors } = useTheme();
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  const handleClear = () => {
    setAlerts([]);
  };

  return (
    <ScreenContainer>
      <Header
        title="Tactical Alerts"
        subtitle="Operational Early Warnings & Check-in Reminders"
      />

      <View style={styles.topBar}>
        <Text style={[styles.countText, { color: colors.textMuted }]}>
          {alerts.length} Active Notifications
        </Text>
        {alerts.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <CheckCheck size={14} color={colors.primary} />
            <Text style={[styles.clearText, { color: colors.primary }]}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {alerts.length === 0 ? (
        <Card style={styles.emptyCard}>
          <ShieldCheck size={40} color={colors.success} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>All Clear</Text>
          <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
            No high-priority welfare or operational alerts currently pending.
          </Text>
        </Card>
      ) : (
        alerts.map((item) => (
          <Card key={item.id} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <View style={styles.iconTitleRow}>
                <View
                  style={[
                    styles.alertIconBox,
                    {
                      backgroundColor:
                        item.priority === "HIGH"
                          ? "rgba(239, 68, 68, 0.15)"
                          : item.priority === "MEDIUM"
                          ? "rgba(245, 158, 11, 0.15)"
                          : "rgba(59, 130, 246, 0.15)",
                    },
                  ]}
                >
                  {item.icon === "buddy" ? (
                    <HeartHandshake size={16} color={item.priority === "HIGH" ? colors.danger : colors.primary} />
                  ) : item.icon === "darbar" ? (
                    <CalendarCheck size={16} color={colors.warning} />
                  ) : (
                    <AlertTriangle size={16} color={colors.info} />
                  )}
                </View>
                <View style={styles.titleMeta}>
                  <Text style={[styles.alertTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.alertTime, { color: colors.textMuted }]}>{item.time}</Text>
                </View>
              </View>
              <Badge
                label={item.priority}
                variant={item.priority === "HIGH" ? "danger" : item.priority === "MEDIUM" ? "warning" : "info"}
                size="sm"
              />
            </View>
            <Text style={[styles.alertDesc, { color: colors.textMuted }]}>
              {item.description}
            </Text>
          </Card>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  clearText: {
    fontSize: 12,
    fontWeight: "700",
  },
  alertCard: {
    padding: 14,
    marginBottom: 10,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  iconTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  alertIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  titleMeta: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  alertTime: {
    fontSize: 10,
    marginTop: 2,
  },
  alertDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  emptyCard: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
  },
});
