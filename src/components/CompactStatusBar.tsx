import { StyleSheet, Text, View } from "react-native";

import { formatTime, t } from "../i18n/translations";
import { useSettings } from "../hooks/useSettings";
import { Typography } from "../constants/fonts";

export function CompactStatusBar({
  bestTime,
  mistakes,
  stars
}: {
  bestTime?: number;
  mistakes: number;
  stars: number;
}) {
  const { locale, theme } = useSettings();

  return (
    <View style={[styles.wrap, { borderColor: theme.colors.border }]}>
      <View style={styles.top}>
        <Text style={[styles.primary, { color: theme.colors.text }]}>6x6 · {t(locale, "balance")} · = / ×</Text>
      </View>
      <View style={styles.bottom}>
        <Text style={[styles.item, { color: bestTime === undefined ? theme.colors.emptyDot : theme.colors.muted }]}>
          {t(locale, "bestTime")}: {bestTime === undefined ? t(locale, "noBest") : formatTime(bestTime)}
        </Text>
        <Text style={[styles.item, { color: theme.colors.muted }]}>
          {t(locale, "mistakes")}: {mistakes}
        </Text>
        <Text style={[styles.stars, { color: theme.colors.accent }]}>{"★".repeat(stars)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    gap: 6
  },
  top: {
    flexDirection: "row",
    alignItems: "center"
  },
  primary: {
    ...Typography.bodyStrong
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap"
  },
  item: {
    ...Typography.muted,
    fontSize: 14
  },
  stars: {
    ...Typography.bodyStrong,
    fontSize: 16
  }
});
