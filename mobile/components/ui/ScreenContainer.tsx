import React from "react";
import { View, StyleSheet, ScrollView, ViewStyle, StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { setupGlobalFonts } from "../../services/fonts";

setupGlobalFonts();

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  refreshControl?: React.ReactElement;
  ambientGlow?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  style,
  refreshControl,
  ambientGlow = true,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }, style]}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Ambient tactical lighting mesh (subtle background glow orbs) */}
      {ambientGlow && isDark && (
        <View style={styles.ambientContainer} pointerEvents="none">
          <View style={[styles.glowOrbTop, { backgroundColor: "rgba(37, 99, 235, 0.08)" }]} />
          <View style={[styles.glowOrbBottom, { backgroundColor: "rgba(16, 185, 129, 0.06)" }]} />
        </View>
      )}

      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.fixedContent}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: "relative",
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
  },
  ambientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  glowOrbTop: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    ...Platform.select({
      web: {
        filter: "blur(70px)",
      } as any,
      default: {
        opacity: 0.6,
      },
    }),
  },
  glowOrbBottom: {
    position: "absolute",
    bottom: 40,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    ...Platform.select({
      web: {
        filter: "blur(80px)",
      } as any,
      default: {
        opacity: 0.5,
      },
    }),
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 40,
  },
  fixedContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
