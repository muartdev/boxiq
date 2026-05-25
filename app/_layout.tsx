import { Tabs } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import {
  Sora_700Bold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import {
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
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

SplashScreen.preventAutoHideAsync();

function ThemedTabs() {
  const { locale, theme } = useSettings();

  return (
    <BoxiqGameProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.muted,
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
            height: 76,
            paddingTop: 8,
            paddingBottom: 18
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
    Sora_700Bold,
    Sora_800ExtraBold,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_800ExtraBold,
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
