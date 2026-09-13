import React from "react";
import { Platform } from "react-native";
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
          height: Platform.OS === "web" ? 64 : 60,
          paddingBottom: Platform.OS === "web" ? 10 : 6,
          paddingTop: 6,
          paddingHorizontal: 12,
          width: "100%",
          maxWidth: 440,
          alignSelf: "center",
        },
        tabBarItemStyle: {
          paddingHorizontal: 0,
          marginHorizontal: 0,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 9.5,
          fontWeight: "700",
          fontFamily: "GoogleSans-Bold",
          letterSpacing: -0.2,
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

      {/* 2. Welfare Authority */}
      <Tabs.Screen
        name="welfare"
        options={{
          title: "Welfare",
          tabBarIcon: ({ color, size }) => <Stethoscope size={size - 2} color={color} />,
        }}
      />

      {/* 3. Commander Authority */}
      <Tabs.Screen
        name="commander"
        options={{
          title: "Command",
          tabBarIcon: ({ color, size }) => <Crown size={size - 2} color={color} />,
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
