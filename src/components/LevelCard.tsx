import { Pressable, StyleSheet, Text, View } from "react-native";

import { Typography } from "../constants/fonts";
import type { Level, LevelProgress, Locale } from "../game/types";
import { formatTime, t } from "../i18n/translations";
import { useSettings } from "../hooks/useSettings";

export function LevelCard({
  level,
  index,
  locale,
  selected,
  isDaily = false,
  progress,
  onPress
}: {
  level: Level;
  index: number;
  locale: Locale;
  selected: boolean;
  isDaily?: boolean;
  progress?: LevelProgress;
  onPress: () => void;
}) {
  const { theme } = useSettings();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: "transparent",
          borderColor: selected ? theme.colors.accent : theme.colors.border,
          opacity: pressed ? 0.72 : 1
        }
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.numberBlock, { borderColor: selected ? theme.colors.accent : theme.colors.border }]}>
          <Text style={[styles.number, { color: theme.colors.accent }]}>{String(index + 1).padStart(2, "0")}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={[styles.name, { color: theme.colors.text }]}>{level.names[locale]}</Text>
            {progress?.bestStars ? (
              <Text style={[styles.complete, { color: theme.colors.accent }]}>{"★".repeat(progress.bestStars)}</Text>
            ) : null}
          </View>
          <Text style={[styles.detail, { color: theme.colors.muted }]}>
            6x6 · {level.difficulty[locale]} · {level.relations.length} {t(locale, "hints").toLowerCase()}
          </Text>
          <View style={styles.bottomRow}>
            <Text
              style={[
                styles.meta,
                { color: progress?.bestTime === undefined ? theme.colors.emptyDot : theme.colors.muted }
              ]}
            >
              {t(locale, "bestTime")}:{" "}
              {progress?.bestTime === undefined ? t(locale, "noBest") : formatTime(progress.bestTime)}
            </Text>
            <View style={styles.badgeRow}>
              {isDaily ? <Text style={[styles.complete, { color: theme.colors.accent }]}>{t(locale, "today")}</Text> : null}
              {progress?.completed ? (
                <Text style={[styles.complete, { color: theme.colors.accent }]}>✓ {t(locale, "completed")}</Text>
              ) : selected ? (
                <Text style={[styles.complete, { color: theme.colors.accent }]}>{t(locale, "continueLevel")}</Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    paddingVertical: 14
  },
  row: {
    flexDirection: "row",
    gap: 14
  },
  numberBlock: {
    width: 46,
    height: 46,
    borderWidth: 1,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    flex: 1,
    gap: 6
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  number: {
    ...Typography.brandLabel,
    fontSize: 14,
    lineHeight: 16
  },
  meta: {
    ...Typography.muted,
    fontSize: 14
  },
  name: {
    ...Typography.sectionTitle
  },
  detail: {
    ...Typography.muted,
    fontSize: 14
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap"
  },
  complete: {
    ...Typography.bodyStrong,
    fontSize: 14
  }
});
