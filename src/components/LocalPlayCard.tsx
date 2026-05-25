import { StyleSheet, Text, View } from "react-native";

import { useSettings } from "../hooks/useSettings";
import { t } from "../i18n/translations";
import { Typography } from "../theme/typography";

export function LocalPlayCard({ compact = false }: { compact?: boolean }) {
  const { locale, theme } = useSettings();

  return (
    <View
      style={[
        styles.card,
        compact ? styles.compact : null,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border
        }
      ]}
    >
      <Text style={[styles.kicker, { color: theme.colors.accent }]}>{t(locale, "localPlay")}</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>{t(locale, "noAccountPlay")}</Text>
      <View style={styles.list}>
        <Text style={[styles.item, { color: theme.colors.text }]}>• {t(locale, "localProgressSaved")}</Text>
        <Text style={[styles.item, { color: theme.colors.text }]}>• {t(locale, "dailyPuzzle")}</Text>
        <Text style={[styles.item, { color: theme.colors.text }]}>• {t(locale, "statsTracked")}</Text>
        <Text style={[styles.item, { color: theme.colors.text }]}>• {t(locale, "privacySupportReady")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 15,
    gap: 10
  },
  compact: {
    paddingVertical: 13
  },
  kicker: {
    ...Typography.brandLabel
  },
  title: {
    ...Typography.bodyStrong,
    fontSize: 16
  },
  list: {
    gap: 6
  },
  item: {
    ...Typography.muted,
    fontSize: 15,
    lineHeight: 20
  }
});
