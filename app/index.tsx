import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

import { AchievementStrip } from "../src/components/AchievementStrip";
import { AppShell } from "../src/components/AppShell";
import { BoxiqBoard } from "../src/components/BoxiqBoard";
import { CompactStatusBar } from "../src/components/CompactStatusBar";
import { DailyCard } from "../src/components/DailyCard";
import { HowToPlay } from "../src/components/HowToPlay";
import { InlineCoach } from "../src/components/InlineCoach";
import { PrimaryButton } from "../src/components/PrimaryButton";
import { ResultModal } from "../src/components/ResultModal";
import { SecondaryButton } from "../src/components/SecondaryButton";
import { TutorialModal } from "../src/components/TutorialModal";
import { INTRO_LEVEL_ID, getInlineCoachStep } from "../src/game/onboarding";
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
    solved,
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
  const boardScale = useRef(new Animated.Value(1)).current;
  const [editablePresses, setEditablePresses] = useState(0);
  const [checksUsed, setChecksUsed] = useState(0);
  const [equalityStepSeen, setEqualityStepSeen] = useState(false);
  const [differenceStepSeen, setDifferenceStepSeen] = useState(false);

  const coachStep = useMemo(
    () =>
      getInlineCoachStep({
        levelId: selectedLevelId,
        tutorialSeen: gameSettings.tutorialSeen,
        levelCompleted: solved || selectedProgress.completed === true,
        editablePresses,
        cycleAdvances: Math.max(0, editablePresses - 1),
        checksUsed,
        equalityStepSeen,
        differenceStepSeen
      }),
    [
      checksUsed,
      differenceStepSeen,
      editablePresses,
      equalityStepSeen,
      gameSettings.tutorialSeen,
      selectedLevelId,
      selectedProgress.completed,
      solved
    ]
  );

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

  useEffect(() => {
    Animated.sequence([
      Animated.spring(boardScale, { toValue: 1.025, useNativeDriver: true, friction: 6 }),
      Animated.spring(boardScale, { toValue: 1, useNativeDriver: true, friction: 7 })
    ]).start();
  }, [boardScale, resultSummary?.levelId]);

  useEffect(() => {
    setEditablePresses(0);
    setChecksUsed(0);
    setEqualityStepSeen(false);
    setDifferenceStepSeen(false);
  }, [selectedLevelId]);

  async function finishTutorial() {
    await updateGameSettings({ tutorialSeen: true });
    hideTutorial();
  }

  return (
    <AppShell>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={[styles.brandLabel, { color: theme.colors.accent }]}>BOXIQ</Text>
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

      {coachStep ? (
        <InlineCoach
          step={coachStep}
          onDismiss={() => void updateGameSettings({ tutorialSeen: true })}
          onAdvanceClue={() => {
            if (coachStep === "equal") {
              setEqualityStepSeen(true);
              return;
            }

            if (coachStep === "cross") {
              setDifferenceStepSeen(true);
            }
          }}
        />
      ) : null}

      <Animated.View style={{ transform: [{ translateX: boardShake }, { scale: boardScale }] }}>
        <BoxiqBoard
          board={board}
          fixedCells={fixedCells}
          hintedCells={hintedCells}
          relations={selectedLevel.relations}
          onCellPress={(row, col) => {
            setEditablePresses((current) => current + 1);
            cycleCell(row, col);
          }}
        />
      </Animated.View>

      <View style={styles.buttonRow}>
        <SecondaryButton label={t(locale, "undo")} onPress={undoMove} disabled={!canUndo} />
        <SecondaryButton label={t(locale, "reset")} onPress={resetLevel} />
      </View>

      <View style={styles.buttonRow}>
        <SecondaryButton label={t(locale, "hint")} onPress={giveHint} />
        <PrimaryButton
          label={t(locale, "check")}
          onPress={() => {
            setChecksUsed((current) => current + 1);
            if (!gameSettings.tutorialSeen && selectedLevelId === INTRO_LEVEL_ID) {
              void updateGameSettings({ tutorialSeen: true });
            }
            void checkSolution();
          }}
        />
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
  brandLabel: {
    ...Typography.brandLabel,
    marginBottom: 2
  },
  title: {
    ...Typography.levelTitle
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
    ...Typography.body,
    fontSize: 16,
    lineHeight: 23
  }
} satisfies Record<string, ViewStyle | TextStyle>);
