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
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
        },
      }}
    >
      {/* 1. Soldier Self Assessment */}
      <Tabs.Screen
        name="personnel"
        options={{
          title: "Self Assessment",
          tabBarIcon: ({ color, size }) => <UserCheck size={size - 2} color={color} />,
        }}
      />

      {/* 2. Welfare Authority (Operated on Web Portal) */}
      <Tabs.Screen
        name="welfare"
        options={{
          href: null,
        }}
      />

      {/* 3. Commander Authority (Operated on Web Portal) */}
      <Tabs.Screen
        name="commander"
        options={{
          href: null,
        }}
      />

      {/* 4. Soldier Personal Alerts */}
      <Tabs.Screen
        name="alerts"
        options={{
          title: "My Alerts",
          tabBarIcon: ({ color, size }) => <Bell size={size - 2} color={color} />,
        }}
      />

      {/* 5. Soldier Settings & Force Config */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Profile & Force",
          tabBarIcon: ({ color, size }) => <Sliders size={size - 2} color={color} />,
        }}
      />
    </Tabs>
  );
}
