import React, { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ForceProvider } from "../contexts/ForceContext";
import { AuthProvider } from "../contexts/AuthContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { setupGlobalFonts } from "../services/fonts";

const queryClient = new QueryClient();

// Setup font styles for web and defaults
setupGlobalFonts();

// Prevent splash screen auto-hiding while fonts are loading
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Google Sans": require("../assets/fonts/GoogleSans-Regular.ttf"),
    "Google Sans Bold": require("../assets/fonts/GoogleSans-Bold.ttf"),
    "GoogleSans": require("../assets/fonts/GoogleSans-Regular.ttf"),
    "GoogleSans-Regular": require("../assets/fonts/GoogleSans-Regular.ttf"),
    "GoogleSans-Medium": require("../assets/fonts/GoogleSans-Medium.ttf"),
    "GoogleSans-SemiBold": require("../assets/fonts/GoogleSans-SemiBold.ttf"),
    "GoogleSans-Bold": require("../assets/fonts/GoogleSans-Bold.ttf"),
    "Google-Sans": require("../assets/fonts/GoogleSans-Regular.ttf"),
    "Google-Sans-Bold": require("../assets/fonts/GoogleSans-Bold.ttf"),
    "JetBrains Mono": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
    "JetBrains Mono Bold": require("../assets/fonts/JetBrainsMono-Bold.ttf"),
    "JetBrainsMono": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
    "JetBrainsMono-Regular": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
    "JetBrainsMono-Bold": require("../assets/fonts/JetBrainsMono-Bold.ttf"),
    "JetBrains-Mono": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
    "JetBrains-Mono-Bold": require("../assets/fonts/JetBrainsMono-Bold.ttf"),
  });

  const [forceReady, setForceReady] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setForceReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setupGlobalFonts();
    if (fontsLoaded || fontError || forceReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, forceReady]);

  if (!fontsLoaded && !fontError && !forceReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <ForceProvider>
              <AuthProvider>
                <View style={styles.webContainer}>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)/login" />
                    <Stack.Screen name="(auth)/signup" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="assessment" />
                    <Stack.Screen name="welfare-case" />
                    <Stack.Screen name="reports" />
                    <Stack.Screen name="privacy" />
                    <Stack.Screen name="simulator" />
                    <Stack.Screen name="analytics" />
                    <Stack.Screen name="interventions" />
                    <Stack.Screen name="recommendations" />
                    <Stack.Screen name="audit" />
                    <Stack.Screen name="admin" />
                    <Stack.Screen name="presentation" />
                  </Stack>
                </View>
              </AuthProvider>
            </ForceProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    width: "100%",
    ...Platform.select({
      web: {
        maxWidth: 440,
        alignSelf: "center",
      },
      default: {},
    }),
  },
});

