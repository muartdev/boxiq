import { StyleSheet, Text, View } from "react-native";

import { AppShell } from "../src/components/AppShell";
import { BoxiqLogo } from "../src/components/BoxiqLogo";
import { SectionHeader } from "../src/components/SectionHeader";
import { StatRow } from "../src/components/StatRow";
import { buildStatsSummary } from "../src/game/stats";
import { formatTime, t } from "../src/i18n/translations";
import { useBoxiqGame } from "../src/hooks/useBoxiqGame";
import { useSettings } from "../src/hooks/useSettings";
import { Typography } from "../src/theme/typography";

export default function StatsScreen() {
  const { locale, theme } = useSettings();
  const { levels, progress, dailyStats } = useBoxiqGame();
  const stats = buildStatsSummary(levels, progress, dailyStats);

  return (
    <AppShell>
      <View style={styles.header}>
        <BoxiqLogo width={118} height={32} />
        <Text style={[styles.title, { color: theme.colors.text }]}>{t(locale, "stats")}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
          {t(locale, "dailyBoxiq")} · {stats.currentStreak} {t(locale, "dailyStreak").toLowerCase()}
        </Text>
      </View>

      <View style={[styles.hero, { borderTopColor: theme.colors.border, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.heroValue, { color: theme.colors.text }]}>{stats.completionRate}%</Text>
        <Text style={[styles.heroLabel, { color: theme.colors.muted }]}>{t(locale, "completionRate")}</Text>
      </View>

      <View style={styles.metricRow}>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: theme.colors.text }]}>
            {stats.completedLevels}/{stats.totalLevels}
          </Text>
          <Text style={[styles.metricLabel, { color: theme.colors.muted }]}>{t(locale, "completedLevels")}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: theme.colors.text }]}>{stats.totalStars}</Text>
          <Text style={[styles.metricLabel, { color: theme.colors.muted }]}>{t(locale, "totalStars")}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: theme.colors.text }]}>{stats.hintlessCompleted}</Text>
          <Text style={[styles.metricLabel, { color: theme.colors.muted }]}>{t(locale, "hintless")}</Text>
        </View>
      </View>

      <View style={[styles.section, { borderTopColor: theme.colors.border }]}>
        <SectionHeader title={t(locale, "today")} />
        <Text style={[styles.sectionBody, { color: theme.colors.text }]}>
          {stats.todayStatus
            ? `${t(locale, "todayCompleted")} · ${formatTime(stats.todayStatus.seconds)} · ${stats.todayStatus.mistakes} ${t(locale, "mistakes").toLowerCase()} · ${"★".repeat(stats.todayStatus.stars)}`
            : `${t(locale, "todayNone")}`}
        </Text>
      </View>

      <View style={[styles.section, { borderTopColor: theme.colors.border }]}>
        <SectionHeader title={t(locale, "records")} />
        <View style={styles.statList}>
          <StatRow
            label={t(locale, "bestSingle")}
            value={stats.bestTime === undefined ? t(locale, "noBest") : formatTime(stats.bestTime)}
          />
          <StatRow
            label={t(locale, "bestDaily")}
            value={stats.dailyBestTime === undefined ? t(locale, "noBest") : formatTime(stats.dailyBestTime)}
          />
          <StatRow label={t(locale, "dailyStreak")} value={String(stats.currentStreak)} />
          <StatRow label={t(locale, "streakBest")} value={String(stats.bestStreak)} />
        </View>
      </View>

      <View style={[styles.section, { borderTopColor: theme.colors.border }]}>
        <SectionHeader title={t(locale, "lastSevenDays")} />
        <View style={styles.heatmapRow}>
          {stats.lastSevenDays.map((day) => (
            <View key={day.date} style={styles.heatmapColumn}>
              <View
                style={[
                  styles.heatDot,
                  {
                    backgroundColor: day.completed ? theme.colors.accent : "transparent",
                    borderColor: day.completed ? theme.colors.accent : theme.colors.border
                  }
                ]}
              />
              <Text style={[styles.heatLabel, { color: theme.colors.muted }]}>{day.date.slice(8)}</Text>
            </View>
          ))}
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
    ...Typography.screenTitle,
    fontSize: 44,
    lineHeight: 48
  },
  subtitle: {
    marginTop: 4,
    ...Typography.muted
  },
  hero: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 18,
    alignItems: "center",
    gap: 4
  },
  heroValue: {
    ...Typography.screenTitle
  },
  heroLabel: {
    ...Typography.brandLabel
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  metric: {
    flex: 1,
    gap: 4
  },
  metricValue: {
    ...Typography.sectionTitle,
    fontSize: 26
  },
  metricLabel: {
    ...Typography.brandLabel,
    fontSize: 12
  },
  section: {
    borderTopWidth: 1,
    paddingTop: 16,
    gap: 10
  },
  sectionBody: {
    ...Typography.bodyStrong
  },
  statList: {
    gap: 14
  },
  heatmapRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6
  },
  heatmapColumn: {
    alignItems: "center",
    gap: 8
  },
  heatDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1
  },
  heatLabel: {
    ...Typography.muted,
    fontSize: 12,
    lineHeight: 14
  }
});
