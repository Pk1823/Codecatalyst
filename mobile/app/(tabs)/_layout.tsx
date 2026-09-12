import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  UserCheck,
  Stethoscope,
  Crown,
  Bell,
  Sliders,
} from "lucide-react-native";

export default function TabsLayout() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const role = user?.role || "PERSONNEL";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          maxWidth: 440,
          width: "100%",
          alignSelf: "center",
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          fontFamily: "GoogleSans-Bold",
        },
      }}
    >
      {/* 1. Soldier Self Assessment */}
      <Tabs.Screen
        name="personnel"
        options={{
          title: "Assessment",
          tabBarIcon: ({ color, size }) => <UserCheck size={size - 2} color={color} />,
        }}
      />

      {/* 2. Welfare Authority (Shown for Welfare Officers/Admin) */}
      <Tabs.Screen
        name="welfare"
        options={{
          title: "Welfare",
          tabBarIcon: ({ color, size }) => <Stethoscope size={size - 2} color={color} />,
          href: role === "WELFARE_OFFICER" || role === "ADMIN" ? undefined : null,
        }}
      />

      {/* 3. Commander Authority (Shown for Commanders/Admin) */}
      <Tabs.Screen
        name="commander"
        options={{
          title: "Command",
          tabBarIcon: ({ color, size }) => <Crown size={size - 2} color={color} />,
          href: role === "COMMANDER" || role === "ADMIN" ? undefined : null,
        }}
      />

      {/* 4. Tactical Alerts */}
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size }) => <Bell size={size - 2} color={color} />,
        }}
      />

      {/* 5. Force Config & Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Sliders size={size - 2} color={color} />,
        }}
      />
    </Tabs>
  );
}
