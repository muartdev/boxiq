import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

import { AchievementStrip } from "../src/components/AchievementStrip";
import { AppShell } from "../src/components/AppShell";
import { BoxiqBoard } from "../src/components/BoxiqBoard";
import { BoxiqLogo } from "../src/components/BoxiqLogo";
import { CompactStatusBar } from "../src/components/CompactStatusBar";
import { DailyCard } from "../src/components/DailyCard";
import { HowToPlay } from "../src/components/HowToPlay";
import { PrimaryButton } from "../src/components/PrimaryButton";
import { ResultModal } from "../src/components/ResultModal";
import { SecondaryButton } from "../src/components/SecondaryButton";
import { TutorialModal } from "../src/components/TutorialModal";
import { formatTime, t } from "../src/i18n/translations";
import { useBoxiqGame } from "../src/hooks/useBoxiqGame";
import { useSettings } from "../src/hooks/useSettings";
import { Typography } from "../src/theme/typography";

export default function PlayScreen() {
  const router = useRouter();
  const { gameSettings, locale, theme, tutorialVisible, hideTutorial, updateGameSettings } = useSettings();
  const {
    levels,
    selectedLevel,
    selectedLevelId,
    board,
    fixedCells,
    hintedCells,
    seconds,
    mistakes,
    stars,
    message,
    achievements,
    canUndo,
    dailyLevelId,
    dailyStats,
    resultSummary,
    selectedProgress,
    selectLevel,
    cycleCell,
    resetLevel,
    replayLevel,
    undoMove,
    dismissResult,
    giveHint,
    checkSolution
  } = useBoxiqGame();
  const dailyLevel = levels.find((level) => level.id === dailyLevelId) ?? selectedLevel;
  const nextLevel = levels[levels.findIndex((level) => level.id === selectedLevelId) + 1];
  const boardShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mistakes === 0) {
      return;
    }

    Animated.sequence([
      Animated.timing(boardShake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(boardShake, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(boardShake, { toValue: 4, duration: 50, useNativeDriver: true }),
      Animated.timing(boardShake, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  }, [boardShake, mistakes]);

  async function finishTutorial() {
    await updateGameSettings({ tutorialSeen: true });
    hideTutorial();
  }

  return (
    <AppShell>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <BoxiqLogo width={118} height={32} />
          <Text style={[styles.title, { color: theme.colors.text }]}>{selectedLevel.names[locale]}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
            {selectedLevel.difficulty[locale]} · 6x6 · {t(locale, "balance")}
          </Text>
        </View>
        {gameSettings.timerEnabled ? (
          <View
            style={[
              styles.timer,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border
              }
            ]}
          >
            <Text style={[styles.timerText, { color: theme.colors.accent }]}>{formatTime(seconds)}</Text>
          </View>
        ) : null}
      </View>

      <CompactStatusBar bestTime={selectedProgress.bestTime} mistakes={mistakes} stars={stars} />

      <Animated.View style={{ transform: [{ translateX: boardShake }] }}>
        <BoxiqBoard
          board={board}
          fixedCells={fixedCells}
          hintedCells={hintedCells}
          relations={selectedLevel.relations}
          onCellPress={cycleCell}
        />
      </Animated.View>

      <View style={styles.buttonRow}>
        <SecondaryButton label={t(locale, "undo")} onPress={undoMove} disabled={!canUndo} />
        <SecondaryButton label={t(locale, "reset")} onPress={resetLevel} />
      </View>

      <View style={styles.buttonRow}>
        <SecondaryButton label={t(locale, "hint")} onPress={giveHint} />
        <PrimaryButton label={t(locale, "check")} onPress={() => void checkSolution()} />
      </View>

      <View
        style={[
          styles.messageCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border
          }
        ]}
      >
        <Text style={[styles.messageText, { color: theme.colors.text }]}>{message}</Text>
      </View>

      <AchievementStrip achievements={achievements} />

      <DailyCard
        level={dailyLevel}
        locale={locale}
        stats={dailyStats}
        selected={selectedLevelId === dailyLevelId}
        compact
        onPress={() => void selectLevel(dailyLevelId)}
      />

      <HowToPlay />

      <ResultModal
        result={resultSummary}
        hasNextLevel={Boolean(nextLevel)}
        onClose={dismissResult}
        onLevels={() => {
          dismissResult();
          router.push("/levels");
        }}
        onReplay={() => {
          dismissResult();
          replayLevel();
        }}
        onNextLevel={() => {
          dismissResult();
          if (nextLevel) {
            void selectLevel(nextLevel.id);
          }
        }}
      />

      <TutorialModal
        visible={tutorialVisible}
        onSkip={() => void finishTutorial()}
        onClose={() => void finishTutorial()}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14
  },
  titleBlock: {
    flex: 1
  },
  title: {
    ...Typography.levelTitle,
    fontSize: 40
  },
  subtitle: {
    marginTop: 4,
    ...Typography.muted
  },
  timer: {
    minWidth: 78,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center"
  },
  timerText: {
    ...Typography.timerText
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10
  },
  messageCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    minHeight: 58,
    justifyContent: "center"
  },
  messageText: {
    ...Typography.body
  }
} satisfies Record<string, ViewStyle | TextStyle>);
