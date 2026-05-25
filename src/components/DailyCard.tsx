import { Pressable, StyleSheet, Text, View } from "react-native";

import { Typography } from "../constants/fonts";
import type { DailyStats, Level, Locale } from "../game/types";
import { getDailyEntry, hasSolvedDailyToday, toDateKey } from "../game/retention";
import { formatTime, t } from "../i18n/translations";
import { useSettings } from "../hooks/useSettings";

export function DailyCard({
  level,
  locale,
  stats,
  selected,
  featured = false,
  compact = false,
  onPress
}: {
  level: Level;
  locale: Locale;
  stats: DailyStats;
  selected: boolean;
  featured?: boolean;
  compact?: boolean;
  onPress: () => void;
}) {
  const { theme } = useSettings();
  const inline = compact;
  const solvedToday = hasSolvedDailyToday(stats, toDateKey(new Date()));
  const score = getDailyEntry(stats, toDateKey(new Date()));
  const statusLine = `${t(locale, "today")}: ${solvedToday ? t(locale, "todayCompleted") : t(locale, "todayNone")}`;
  const scoreLine =
    solvedToday && score
      ? `${t(locale, "todayScore")}: ${formatTime(score.seconds)} · ${score.mistakes} ${t(locale, "mistakes").toLowerCase()} · ${"★".repeat(score.stars)}`
      : `${t(locale, "todayScore")}: ${t(locale, "noBest")}`;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        inline ? styles.inlineCard : null,
        {
          backgroundColor: inline ? "transparent" : featured ? theme.colors.accentSoft : selected ? theme.colors.accentSoft : theme.colors.card,
          borderColor: featured || selected ? theme.colors.accent : theme.colors.border,
          opacity: pressed ? 0.76 : 1
        }
      ]}
    >
      <View style={styles.row}>
        <View>
          <Text style={[styles.kicker, { color: theme.colors.accent }]}>{t(locale, "dailyBoxiq")}</Text>
          <Text style={[inline ? styles.compactTitle : styles.title, { color: theme.colors.text }]}>
            {level.names[locale]}
          </Text>
        </View>
        <View style={styles.streakBox}>
          <Text style={[inline ? styles.compactStreak : styles.streak, { color: theme.colors.text }]}>
            {stats.currentStreak}
          </Text>
          <Text style={[styles.meta, { color: theme.colors.muted }]}>{t(locale, "dailyStreak")}</Text>
        </View>
      </View>
      <Text style={[styles.meta, { color: solvedToday ? theme.colors.accent : theme.colors.muted }]}>{statusLine}</Text>
      <Text style={[styles.meta, { color: score ? theme.colors.muted : theme.colors.emptyDot }]}>
        {scoreLine}
      </Text>
      {solvedToday ? (
        <View style={styles.dailyFooter}>
          <Text style={[styles.meta, { color: theme.colors.accent }]}>{t(locale, "dailyCompleted")}</Text>
          <Text style={[styles.meta, { color: theme.colors.accent }]}>{t(locale, "tomorrowPuzzle")}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 15,
    gap: 12
  },
  inlineCard: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 10,
    gap: 6
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14
  },
  kicker: {
    ...Typography.brandLabel,
    marginBottom: 3
  },
  title: {
    ...Typography.sectionTitle
  },
  compactTitle: {
    ...Typography.bodyStrong
  },
  streakBox: {
    alignItems: "flex-end"
  },
  streak: {
    ...Typography.cardTitle,
    fontSize: 24
  },
  compactStreak: {
    ...Typography.bodyStrong,
    fontSize: 18
  },
  meta: {
    ...Typography.muted,
    fontSize: 14
  },
  dailyFooter: {
    gap: 2
  }
});
