import { Tabs } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import {
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import * as SplashScreen from "expo-splash-screen";

import { BoxiqGameProvider } from "../src/hooks/useBoxiqGame";
import { SettingsProvider, useSettings } from "../src/hooks/useSettings";
import { t } from "../src/i18n/translations";
import { Typography } from "../src/theme/typography";
import {
  OynaIcon,
  SeviyelerIcon,
  IstatistiklerIcon,
  AyarlarIcon,
} from "../src/components/icons/TabIcons";
import { getFloatingTabBarMetrics } from "../src/components/floatingTabBar";

SplashScreen.preventAutoHideAsync();

function ThemedTabs() {
  const { locale, theme } = useSettings();
  const insets = useSafeAreaInsets();
  const tabBarMetrics = getFloatingTabBarMetrics(insets.bottom);

  return (
    <BoxiqGameProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: theme.colors.background
          },
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.muted,
          tabBarStyle: {
            position: "absolute",
            left: tabBarMetrics.left,
            right: tabBarMetrics.right,
            bottom: tabBarMetrics.bottom,
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            borderWidth: 1,
            height: tabBarMetrics.height,
            paddingTop: tabBarMetrics.paddingTop,
            paddingBottom: tabBarMetrics.paddingBottom,
            borderRadius: tabBarMetrics.borderRadius,
            shadowColor: theme.colors.shadow,
            shadowOpacity: theme.mode === "dark" ? 0.22 : 0.1,
            shadowRadius: 18,
            shadowOffset: {
              width: 0,
              height: 8
            },
            elevation: 6
          },
          tabBarItemStyle: {
            paddingTop: 1
          },
          tabBarLabelStyle: {
            ...Typography.tabLabel
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t(locale, "play"),
            tabBarIcon: ({ color }) => <OynaIcon color={color} />
          }}
        />
        <Tabs.Screen
          name="levels"
          options={{
            title: t(locale, "levels"),
            tabBarIcon: ({ color }) => <SeviyelerIcon color={color} />
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: t(locale, "stats"),
            tabBarIcon: ({ color }) => <IstatistiklerIcon color={color} />
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t(locale, "settings"),
            tabBarIcon: ({ color }) => <AyarlarIcon color={color} />
          }}
        />
      </Tabs>
    </BoxiqGameProvider>
  );
}

function RootWithFonts() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_700Bold,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SettingsProvider>
      <ThemedTabs />
    </SettingsProvider>
  );
}

export default function RootLayout() {
  return <RootWithFonts />;
}
