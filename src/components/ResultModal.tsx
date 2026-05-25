import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useSettings } from "../hooks/useSettings";
import { formatTime, t } from "../i18n/translations";
import { Typography } from "../theme/typography";
import type { ResultSummary } from "../game/types";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

export function ResultModal({
  result,
  hasNextLevel,
  onClose,
  onReplay,
  onLevels,
  onNextLevel
}: {
  result?: ResultSummary;
  hasNextLevel: boolean;
  onClose: () => void;
  onReplay: () => void;
  onLevels: () => void;
  onNextLevel: () => void;
}) {
  const { locale, theme } = useSettings();

  if (!result) {
    return null;
  }

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.kicker, { color: theme.colors.accent }]}>{t(locale, "results")}</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {result.levelName} {t(locale, "completedTitleSuffix")}
          </Text>
          <Text style={[styles.stars, { color: theme.colors.accent }]}>{Array.from({ length: result.stars }, () => "★").join("")}</Text>

          <View style={styles.summary}>
            <Text style={[styles.summaryLine, { color: theme.colors.text }]}>{formatTime(result.seconds)}</Text>
            <Text style={[styles.summaryLine, { color: theme.colors.text }]}>
              {result.mistakes} {t(locale, "mistakes").toLowerCase()}
            </Text>
            <Text style={[styles.summaryLine, { color: theme.colors.text }]}>
              {result.hintsUsed === 0
                ? t(locale, "noHintsUsed")
                : `${result.hintsUsed} ${t(locale, "hint").toLowerCase()}`}
            </Text>
          </View>

          {result.isNewBestTime ? (
            <Text style={[styles.badge, { color: theme.colors.accent }]}>{t(locale, "newBest")}</Text>
          ) : null}

          {result.isDaily ? (
            <View style={[styles.dailyBlock, { borderColor: theme.colors.accentSoft, backgroundColor: theme.colors.accentSoft }]}>
              <Text style={[styles.dailyTitle, { color: theme.colors.text }]}>{t(locale, "dailyCompleted")}</Text>
              <Text style={[styles.dailyMeta, { color: theme.colors.muted }]}>
                {t(locale, "dailyStreak")}: {result.dailyStreak}
              </Text>
              <Text style={[styles.dailyMeta, { color: theme.colors.muted }]}>{t(locale, "tomorrowPuzzle")}</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <SecondaryButton label={t(locale, "replay")} onPress={onReplay} />
            <PrimaryButton label={t(locale, "nextLevel")} onPress={onNextLevel} disabled={!hasNextLevel} />
          </View>

          <View style={styles.footerLinks}>
            <Pressable accessibilityRole="button" onPress={onLevels} style={styles.closeLink}>
              <Text style={[styles.closeText, { color: theme.colors.accent }]}>{t(locale, "openLevels")}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeLink}>
              <Text style={[styles.closeText, { color: theme.colors.muted }]}>{t(locale, "close")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10, 14, 12, 0.34)",
    justifyContent: "center",
    padding: 20
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    gap: 14
  },
  kicker: {
    ...Typography.brandLabel
  },
  title: {
    ...Typography.cardTitle,
    fontSize: 30,
    lineHeight: 36
  },
  stars: {
    ...Typography.sectionTitle,
    fontSize: 24
  },
  summary: {
    gap: 6
  },
  summaryLine: {
    ...Typography.bodyStrong,
    fontSize: 18
  },
  badge: {
    ...Typography.brandLabel,
    fontSize: 14
  },
  dailyBlock: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 4
  },
  dailyTitle: {
    ...Typography.bodyStrong
  },
  dailyMeta: {
    ...Typography.muted
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4
  },
  closeLink: {
    alignSelf: "center",
    paddingTop: 2,
    paddingBottom: 2
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18
  },
  closeText: {
    ...Typography.bodyStrong,
    fontSize: 14
  }
});
