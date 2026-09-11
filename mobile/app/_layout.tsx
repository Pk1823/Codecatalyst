import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ForceProvider } from "../contexts/ForceContext";
import { AuthProvider } from "../contexts/AuthContext";
import { LanguageProvider } from "../contexts/LanguageContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <ForceProvider>
              <AuthProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)/login" />
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
              </AuthProvider>
            </ForceProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
