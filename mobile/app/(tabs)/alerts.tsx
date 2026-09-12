import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ScreenContainer } from "../../components/ui/ScreenContainer";
import { Header } from "../../components/ui/Header";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { NotificationService, MobileNotification } from "../../services/notifications";
import {
  AlertTriangle,
  CalendarCheck,
  HeartHandshake,
  CheckCheck,
  ShieldCheck,
} from "lucide-react-native";

export default function AlertsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<MobileNotification[]>([]);

  useEffect(() => {
    const soldierId = user?.personnelId || "P-1024";
    NotificationService.getNotifications(soldierId).then(setAlerts);

    const unsubscribe = NotificationService.subscribe((updated) => {
      setAlerts(updated);
    }, soldierId);

    return () => unsubscribe();
  }, [user]);

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
        alerts.map((item) => {
          const isDoc = item.isDoctorVisit || item.icon === "medical";
          return (
            <Card
              key={item.id}
              style={[
                styles.alertCard,
                isDoc && {
                  borderColor: "#10B981",
                  borderWidth: 1.5,
                  backgroundColor: "rgba(16, 185, 129, 0.05)",
                },
              ]}
            >
              <View style={styles.alertHeader}>
                <View style={styles.iconTitleRow}>
                  <View
                    style={[
                      styles.alertIconBox,
                      {
                        backgroundColor: isDoc
                          ? item.visitLevel?.includes("1")
                            ? "rgba(239, 68, 68, 0.2)"
                            : item.visitLevel?.includes("3")
                            ? "rgba(16, 185, 129, 0.2)"
                            : "rgba(245, 158, 11, 0.2)"
                          : item.priority === "HIGH"
                          ? "rgba(239, 68, 68, 0.15)"
                          : item.priority === "MEDIUM"
                          ? "rgba(245, 158, 11, 0.15)"
                          : "rgba(59, 130, 246, 0.15)",
                      },
                    ]}
                  >
                    {isDoc ? (
                      <HeartHandshake
                        size={18}
                        color={
                          item.visitLevel?.includes("1")
                            ? "#EF4444"
                            : item.visitLevel?.includes("3")
                            ? "#10B981"
                            : "#F59E0B"
                        }
                      />
                    ) : item.icon === "buddy" ? (
                      <HeartHandshake size={16} color={item.priority === "HIGH" ? colors.danger : colors.primary} />
                    ) : item.icon === "darbar" ? (
                      <CalendarCheck size={16} color={colors.warning} />
                    ) : (
                      <AlertTriangle size={16} color={colors.info} />
                    )}
                  </View>
                  <View style={styles.titleMeta}>
                    <Text
                      style={[
                        styles.alertTitle,
                        {
                          color: isDoc
                            ? item.visitLevel?.includes("1")
                              ? "#DC2626"
                              : item.visitLevel?.includes("3")
                              ? "#059669"
                              : "#D97706"
                            : colors.text,
                        },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={[styles.alertTime, { color: colors.textMuted }]}>{item.time}</Text>
                  </View>
                </View>
                <Badge
                  label={
                    isDoc
                      ? item.visitLevel?.includes("1")
                        ? "🔴 LVL 1: IMMEDIATE"
                        : item.visitLevel?.includes("3")
                        ? "🟢 LVL 3: ROUTINE"
                        : "🟡 LVL 2: PRIORITY"
                      : item.priority
                  }
                  variant={
                    isDoc
                      ? item.visitLevel?.includes("1")
                        ? "danger"
                        : item.visitLevel?.includes("3")
                        ? "success"
                        : "warning"
                      : item.priority === "HIGH"
                      ? "danger"
                      : item.priority === "MEDIUM"
                      ? "warning"
                      : "info"
                  }
                  size="sm"
                />
              </View>
              <Text style={[styles.alertDesc, { color: colors.textMuted }]}>
                {item.description}
              </Text>
              {isDoc && (
                <View style={styles.docFooter}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={styles.docFooterText}>
                      ⚡ Triage: {item.visitLevel || "Level 2 (Priority)"}
                    </Text>
                    <Text style={{ fontSize: 10, color: colors.textMuted, fontStyle: "italic" }}>
                      Welfare Assessment Follow-Up
                    </Text>
                  </View>
                </View>
              )}
            </Card>
          );
        })
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
  docFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(16, 185, 129, 0.2)",
  },
  docFooterText: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
});
