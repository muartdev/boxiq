import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { AppShell } from "../src/components/AppShell";
import { SectionHeader } from "../src/components/SectionHeader";
import { SegmentedControl } from "../src/components/SegmentedControl";
import { SecondaryButton } from "../src/components/SecondaryButton";
import { StatRow } from "../src/components/StatRow";
import { ToggleRow } from "../src/components/ToggleRow";
import { APP_VERSION, PRIVACY_POLICY_URL, SUPPORT_URL } from "../src/constants/links";
import type { Locale, MistakeLimitMode, ThemeMode } from "../src/game/types";
import { useBoxiqGame } from "../src/hooks/useBoxiqGame";
import { useSettings } from "../src/hooks/useSettings";
import { t } from "../src/i18n/translations";
import { resetProgress } from "../src/storage/progressStorage";
import { Typography } from "../src/theme/typography";

export default function SettingsScreen() {
  const {
    gameSettings,
    locale,
    theme,
    themeMode,
    setLocale,
    setThemeMode,
    updateGameSettings,
    showTutorial
  } = useSettings();
  const { reloadProgress } = useBoxiqGame();

  function confirmReset() {
    Alert.alert(t(locale, "resetProgress"), t(locale, "resetProgressBody"), [
      { text: t(locale, "cancel"), style: "cancel" },
      {
        text: t(locale, "reset"),
        style: "destructive",
        onPress: () => {
          void resetProgress().then(async () => {
            await reloadProgress();
          });
        }
      }
    ]);
  }

  function openLink(url: string) {
    void Linking.openURL(url);
  }

  return (
    <AppShell>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t(locale, "settings")}</Text>
      </View>

      <View style={[styles.section, { borderTopColor: theme.colors.border }]}>
        <SectionHeader title={t(locale, "appearance")} />
        <SegmentedControl<Locale>
          options={[
            { label: "English", value: "en" },
            { label: "Türkçe", value: "tr" }
          ]}
          value={locale}
          onChange={(value) => void setLocale(value)}
        />
        <SegmentedControl<ThemeMode>
          options={[
            { label: t(locale, "light"), value: "light" },
            { label: t(locale, "dark"), value: "dark" }
          ]}
          value={themeMode}
          onChange={(value) => void setThemeMode(value)}
        />
      </View>

      <View style={[styles.section, { borderTopColor: theme.colors.border }]}>
        <SectionHeader title={t(locale, "game")} />
        <ToggleRow
          label={t(locale, "soundEffects")}
          value={gameSettings.soundEnabled}
          onValueChange={(value) => void updateGameSettings({ soundEnabled: value })}
        />
        <ToggleRow
          label={t(locale, "haptics")}
          value={gameSettings.hapticsEnabled}
          onValueChange={(value) => void updateGameSettings({ hapticsEnabled: value })}
        />
        <ToggleRow
          label={t(locale, "timer")}
          value={gameSettings.timerEnabled}
          onValueChange={(value) => void updateGameSettings({ timerEnabled: value })}
        />
        <View style={styles.block}>
          <SectionHeader title={t(locale, "mistakeLimit")} />
          <SegmentedControl<MistakeLimitMode>
            options={[
              { label: t(locale, "relaxed"), value: "relaxed" },
              { label: t(locale, "normal"), value: "normal" },
              { label: t(locale, "hard"), value: "hard" }
            ]}
            value={gameSettings.mistakeLimit}
            onChange={(value) => void updateGameSettings({ mistakeLimit: value })}
          />
          <Text style={[styles.helper, { color: theme.colors.muted }]}>
            {gameSettings.mistakeLimit === "relaxed"
              ? t(locale, "mistakeLimitBodyRelaxed")
              : gameSettings.mistakeLimit === "normal"
                ? t(locale, "mistakeLimitBodyNormal")
                : t(locale, "mistakeLimitBodyHard")}
          </Text>
        </View>
      </View>

      <View style={[styles.section, { borderTopColor: theme.colors.border }]}>
        <SectionHeader title={t(locale, "accessibility")} />
        <ToggleRow
          label={t(locale, "colorBlindMode")}
          value={gameSettings.colorBlindMode}
          onValueChange={(value) => void updateGameSettings({ colorBlindMode: value })}
        />
      </View>

      <View style={[styles.section, { borderTopColor: theme.colors.border }]}>
        <SectionHeader title={t(locale, "notifications")} />
        <ToggleRow
          label={t(locale, "dailyReminder")}
          value={gameSettings.dailyReminderEnabled}
          onValueChange={(value) => void updateGameSettings({ dailyReminderEnabled: value })}
        />
      </View>

      <View style={[styles.section, { borderTopColor: theme.colors.border }]}>
        <SectionHeader title={t(locale, "data")} />
        <View style={styles.row}>
          <SecondaryButton label={t(locale, "watchTutorial")} onPress={showTutorial} />
        </View>
        <View style={styles.row}>
          <SecondaryButton label={t(locale, "resetProgress")} onPress={confirmReset} danger />
        </View>
      </View>

      <View style={[styles.section, { borderTopColor: theme.colors.border }]}>
        <SectionHeader title={t(locale, "about")} body={t(locale, "aboutBody")} />
        <View style={styles.aboutList}>
          <StatRow label={t(locale, "version")} value={APP_VERSION} />
          <Pressable accessibilityRole="button" onPress={() => openLink(PRIVACY_POLICY_URL)} style={styles.linkRow}>
            <Text style={[styles.linkLabel, { color: theme.colors.muted }]}>{t(locale, "privacyPolicy")}</Text>
            <Text style={[styles.linkValue, { color: theme.colors.accent }]}>{t(locale, "open")}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => openLink(SUPPORT_URL)} style={styles.linkRow}>
            <Text style={[styles.linkLabel, { color: theme.colors.muted }]}>{t(locale, "support")}</Text>
            <Text style={[styles.linkValue, { color: theme.colors.accent }]}>{t(locale, "open")}</Text>
          </Pressable>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 10
  },
  title: {
    ...Typography.screenTitle
  },
  section: {
    borderTopWidth: 1,
    paddingTop: 16,
    gap: 14
  },
  block: {
    gap: 10
  },
  helper: {
    ...Typography.muted,
    fontSize: 14
  },
  row: {
    flexDirection: "row"
  },
  aboutList: {
    gap: 14
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16
  },
  linkLabel: {
    ...Typography.muted
  },
  linkValue: {
    ...Typography.bodyStrong
  }
});
