import { StyleSheet, Text, View } from "react-native";

import type { AchievementId } from "../game/types";
import { t } from "../i18n/translations";
import { useSettings } from "../hooks/useSettings";
import { Fonts } from "../constants/fonts";

const achievementKeys: Record<AchievementId, Parameters<typeof t>[1]> = {
  "first-solve": "firstSolve",
  flawless: "flawless",
  "under-minute": "underMinute",
  "no-hint": "noHint",
  "seven-day-streak": "sevenDayStreak"
};

export function AchievementStrip({ achievements }: { achievements: AchievementId[] }) {
  const { locale, theme } = useSettings();

  if (achievements.length === 0) {
    return null;
  }

  return (
    <View style={[styles.wrap, { backgroundColor: theme.colors.accentSoft, borderColor: theme.colors.accent }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{t(locale, "achievements")}</Text>
      <View style={styles.row}>
        {achievements.map((achievement) => (
          <View key={achievement} style={[styles.pill, { borderColor: theme.colors.accent }]}>
            <Text style={[styles.pillText, { color: theme.colors.accent }]}>
              {t(locale, achievementKeys[achievement])}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.subheading,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  pillText: {
    fontSize: 12,
    fontFamily: Fonts.label,
  }
});
