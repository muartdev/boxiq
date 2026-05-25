import { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { useSettings } from "../hooks/useSettings";
import { getShellBottomPadding } from "./appShellSpacing";

export function AppShell({ children }: { children: ReactNode }) {
  const { theme } = useSettings();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: getShellBottomPadding(tabBarHeight) }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  content: {
    paddingHorizontal: 20
  },
  inner: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    gap: 16
  }
});
