import { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";

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
  const [visibleStars, setVisibleStars] = useState(0);
  const summaryY = useRef(new Animated.Value(14)).current;
  const summaryOpacity = useRef(new Animated.Value(0)).current;
  const burst = useRef(
    Array.from({ length: 5 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.6)
    }))
  ).current;

  if (!result) {
    return null;
  }

  useEffect(() => {
    setVisibleStars(0);
    summaryY.setValue(14);
    summaryOpacity.setValue(0);

    const starTimers = Array.from({ length: result.stars }, (_, index) =>
      setTimeout(() => setVisibleStars(index + 1), 120 + index * 160)
    );

    burst.forEach((particle, index) => {
      particle.x.setValue(0);
      particle.y.setValue(0);
      particle.opacity.setValue(0);
      particle.scale.setValue(0.6);

      Animated.parallel([
        Animated.timing(particle.opacity, {
          toValue: 0.9,
          duration: 160,
          delay: 120 + index * 50,
          useNativeDriver: true
        }),
        Animated.spring(particle.scale, {
          toValue: 1,
          delay: 120 + index * 50,
          useNativeDriver: true,
          friction: 6
        }),
        Animated.timing(particle.x, {
          toValue: [-42, -18, 0, 18, 42][index],
          duration: 420,
          delay: 120 + index * 50,
          useNativeDriver: true
        }),
        Animated.timing(particle.y, {
          toValue: [-14, -24, -28, -22, -12][index],
          duration: 420,
          delay: 120 + index * 50,
          useNativeDriver: true
        })
      ]).start(() => {
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true
        }).start();
      });
    });

    Animated.parallel([
      Animated.timing(summaryY, { toValue: 0, duration: 320, useNativeDriver: true }),
      Animated.timing(summaryOpacity, { toValue: 1, duration: 320, useNativeDriver: true })
    ]).start();

    return () => {
      starTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [burst, result, summaryOpacity, summaryY]);

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.kicker, { color: theme.colors.accent }]}>{t(locale, "results")}</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {result.levelName} {t(locale, "completedTitleSuffix")}
          </Text>
          <View style={styles.burstWrap}>
            {burst.map((particle, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.burstDot,
                  {
                    backgroundColor: index % 2 === 0 ? theme.colors.accent : theme.colors.accentSoft,
                    opacity: particle.opacity,
                    transform: [
                      { translateX: particle.x },
                      { translateY: particle.y },
                      { scale: particle.scale }
                    ]
                  }
                ]}
              />
            ))}
          </View>
          <Text style={[styles.stars, { color: theme.colors.accent }]}>
            {Array.from({ length: visibleStars }, () => "★").join("")}
          </Text>

          <Animated.View
            style={[
              styles.summary,
              {
                opacity: summaryOpacity,
                transform: [{ translateY: summaryY }]
              }
            ]}
          >
            <Text style={[styles.summaryLine, { color: theme.colors.text }]}>{formatTime(result.seconds)}</Text>
            <Text style={[styles.summaryLine, { color: theme.colors.text }]}>
              {result.mistakes} {t(locale, "mistakes").toLowerCase()}
            </Text>
            <Text style={[styles.summaryLine, { color: theme.colors.text }]}>
              {result.hintsUsed === 0
                ? t(locale, "noHintsUsed")
                : `${result.hintsUsed} ${t(locale, "hint").toLowerCase()}`}
            </Text>
          </Animated.View>

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
    fontSize: 24,
    lineHeight: 30
  },
  burstWrap: {
    height: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  burstDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4
  },
  stars: {
    ...Typography.sectionTitle,
    fontSize: 22,
    lineHeight: 24
  },
  summary: {
    gap: 6
  },
  summaryLine: {
    ...Typography.bodyStrong,
    fontSize: 17,
    lineHeight: 24
  },
  badge: {
    ...Typography.brandLabel,
    fontSize: 13
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
    ...Typography.muted,
    fontSize: 15
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
