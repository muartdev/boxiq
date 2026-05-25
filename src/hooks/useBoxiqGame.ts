import {
  createContext,
  createElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Alert } from "react-native";

import { canUndo, createSnapshot, popSnapshot, pushSnapshot } from "../game/history";
import { buildSmartHint } from "../game/hints";
import { cloneGrid, levels } from "../game/levels";
import { applyDailyCompletion, getEarnedAchievements, pickDailyLevel, toDateKey } from "../game/retention";
import { calculateStars } from "../game/scoring";
import type {
  AchievementId,
  CellValue,
  DailyStats,
  Level,
  LevelProgress,
  MoveSnapshot,
  ProgressMap,
  ResultSummary
} from "../game/types";
import { solvedMessage, validateBoard } from "../game/validator";
import { t } from "../i18n/translations";
import {
  getAllProgress,
  getCurrentLevel,
  getDailyStats,
  setBestStars,
  setBestTime,
  setCompleted,
  setCurrentLevel,
  setDailyStats,
  setLevelPerformance
} from "../storage/progressStorage";
import {
  triggerErrorFeedback,
  triggerHintFeedback,
  triggerSelectionFeedback,
  triggerSuccessFeedback
} from "../lib/feedback";
import { useSettings } from "./useSettings";

type HintCell = `${number}-${number}`;

type GameContextValue = {
  levels: Level[];
  selectedLevel: Level;
  selectedLevelId: string;
  board: CellValue[][];
  fixedCells: boolean[][];
  hintedCells: Set<HintCell>;
  seconds: number;
  mistakes: number;
  hintsUsed: number;
  stars: number;
  solved: boolean;
  message: string;
  progress: ProgressMap;
  dailyLevelId: string;
  dailyStats: DailyStats;
  achievements: AchievementId[];
  resultSummary?: ResultSummary;
  selectedProgress: LevelProgress;
  canUndo: boolean;
  selectLevel: (levelId: string) => Promise<void>;
  resetLevel: () => void;
  replayLevel: () => void;
  undoMove: () => void;
  dismissResult: () => void;
  cycleCell: (row: number, col: number) => void;
  giveHint: () => void;
  checkSolution: () => Promise<void>;
  reloadProgress: () => Promise<void>;
};

const GameContext = createContext<GameContextValue | undefined>(undefined);

function fixedFromGrid(grid: CellValue[][]): boolean[][] {
  return grid.map((row) => row.map((cell) => cell !== 0));
}

function keyForCell(row: number, col: number): HintCell {
  return `${row}-${col}`;
}

function findLevel(levelId?: string): Level {
  return levels.find((level) => level.id === levelId) ?? levels[0];
}

export function BoxiqGameProvider({ children }: { children: ReactNode }) {
  const { gameSettings, locale } = useSettings();
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0].id);
  const selectedLevel = useMemo(() => findLevel(selectedLevelId), [selectedLevelId]);
  const [board, setBoard] = useState<CellValue[][]>(() => cloneGrid(selectedLevel.grid));
  const [hintedCells, setHintedCells] = useState<Set<HintCell>>(() => new Set());
  const [seconds, setSeconds] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [solved, setSolved] = useState(false);
  const [message, setMessage] = useState(t(locale, "ready"));
  const [progress, setProgress] = useState<ProgressMap>({});
  const [dailyStats, setDailyStatsState] = useState<DailyStats>({
    currentStreak: 0,
    bestStreak: 0,
    dailyHistory: []
  });
  const [achievements, setAchievements] = useState<AchievementId[]>([]);
  const [history, setHistory] = useState<MoveSnapshot[]>([]);
  const [resultSummary, setResultSummary] = useState<ResultSummary | undefined>();

  const fixedCells = useMemo(() => fixedFromGrid(selectedLevel.grid), [selectedLevel]);
  const stars = calculateStars(mistakes, hintsUsed);
  const selectedProgress = progress[selectedLevel.id] ?? {};
  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const dailyLevelId = useMemo(() => pickDailyLevel(levels.map((level) => level.id), new Date()), []);
  const mistakeLimit =
    gameSettings.mistakeLimit === "relaxed" ? undefined : gameSettings.mistakeLimit === "normal" ? 3 : 1;

  const loadProgress = useCallback(async () => {
    const [storedProgress, storedDailyStats] = await Promise.all([getAllProgress(), getDailyStats()]);
    setProgress(storedProgress);
    setDailyStatsState(storedDailyStats);
  }, []);

  const loadLevel = useCallback(
    (level: Level, readyMessage = t(locale, "ready")) => {
      setBoard(cloneGrid(level.grid));
      setHintedCells(new Set());
      setSeconds(0);
      setMistakes(0);
      setHintsUsed(0);
      setSolved(false);
      setAchievements([]);
      setHistory([]);
      setResultSummary(undefined);
      setMessage(readyMessage);
    },
    [locale]
  );

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const [storedLevelId, storedProgress, storedDailyStats] = await Promise.all([
        getCurrentLevel(),
        getAllProgress(),
        getDailyStats()
      ]);
      if (!active) {
        return;
      }

      const nextLevel = findLevel(storedLevelId);
      setSelectedLevelId(nextLevel.id);
      setProgress(storedProgress);
      setDailyStatsState(storedDailyStats);
      loadLevel(nextLevel);
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, [loadLevel]);

  useEffect(() => {
    setMessage((current) => (current === t(locale === "en" ? "tr" : "en", "ready") ? t(locale, "ready") : current));
  }, [locale]);

  useEffect(() => {
    if (solved || !gameSettings.timerEnabled) {
      return undefined;
    }

    const interval = setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [gameSettings.timerEnabled, solved, selectedLevelId]);

  const selectLevel = useCallback(
    async (levelId: string) => {
      const nextLevel = findLevel(levelId);
      setSelectedLevelId(nextLevel.id);
      loadLevel(nextLevel);
      await setCurrentLevel(nextLevel.id);
    },
    [loadLevel]
  );

  const resetLevel = useCallback(() => {
    Alert.alert(t(locale, "reset"), history.length > 0 ? t(locale, "resetBoardQuestion") : t(locale, "resetBoardConfirm"), [
      { text: t(locale, "cancel"), style: "cancel" },
      {
        text: t(locale, "reset"),
        style: "destructive",
        onPress: () => loadLevel(selectedLevel, t(locale, "boardReset"))
      }
    ]);
  }, [history.length, loadLevel, locale, selectedLevel]);

  const replayLevel = useCallback(() => {
    loadLevel(selectedLevel, t(locale, "ready"));
  }, [loadLevel, locale, selectedLevel]);

  const undoMove = useCallback(() => {
    const latest = popSnapshot(history);
    if (!latest || solved) {
      return;
    }

    setBoard(cloneGrid(latest.board));
    setMistakes(latest.mistakes);
    setHintsUsed(latest.hintsUsed);
    setSeconds(latest.seconds);
    setHintedCells(new Set(latest.hintedCells));
    setHistory((current) => current.slice(0, -1));
    setMessage(t(locale, "undoApplied"));
    void triggerSelectionFeedback(gameSettings.hapticsEnabled);
  }, [gameSettings.hapticsEnabled, history, locale, solved]);

  const dismissResult = useCallback(() => {
    setResultSummary(undefined);
  }, []);

  const cycleCell = useCallback(
    (row: number, col: number) => {
      if (solved || fixedCells[row][col]) {
        return;
      }

      void triggerSelectionFeedback(gameSettings.hapticsEnabled);

      setHistory((current) =>
        pushSnapshot(
          current,
          createSnapshot(board, mistakes, hintsUsed, Array.from(hintedCells), seconds)
        )
      );

      setBoard((currentBoard) =>
        currentBoard.map((currentRow, rowIndex) =>
          currentRow.map((cell, colIndex) => {
            if (rowIndex !== row || colIndex !== col) {
              return cell;
            }

            return ((cell + 1) % 3) as CellValue;
          })
        )
      );
    },
    [board, fixedCells, gameSettings.hapticsEnabled, hintedCells, hintsUsed, mistakes, seconds, solved]
  );

  const giveHint = useCallback(() => {
    if (solved) {
      setMessage(t(locale, "alreadySolved"));
      return;
    }

    const smartHint = buildSmartHint(board, selectedLevel, fixedCells, locale);

    if (smartHint) {
      const { row, col, value, message: hintMessage } = smartHint;
      setHistory((current) =>
        pushSnapshot(
          current,
          createSnapshot(board, mistakes, hintsUsed, Array.from(hintedCells), seconds)
        )
      );
      setBoard((currentBoard) =>
        currentBoard.map((currentRow, rowIndex) =>
          currentRow.map((cell, colIndex) => (rowIndex === row && colIndex === col ? value : cell))
        )
      );
      setHintedCells((current) => new Set(current).add(keyForCell(row, col)));
      setHintsUsed((current) => current + 1);
      void triggerHintFeedback(gameSettings.hapticsEnabled);
      setMessage(hintMessage);
      return;
    }

    setMessage(t(locale, "noHintsLeft"));
  }, [
    board,
    fixedCells,
    gameSettings.hapticsEnabled,
    hintedCells,
    hintsUsed,
    locale,
    mistakes,
    seconds,
    selectedLevel,
    solved
  ]);

  const checkSolution = useCallback(async () => {
    if (solved) {
      setMessage(solvedMessage(locale, seconds));
      return;
    }

    const result = validateBoard(board, selectedLevel, locale, seconds);
    setMessage(result.message);

    if (!result.valid) {
      const nextMistakes = mistakes + 1;
      if (mistakeLimit !== undefined && nextMistakes >= mistakeLimit) {
        loadLevel(selectedLevel, t(locale, "mistakeLimitReached"));
      } else {
        setMistakes(nextMistakes);
      }
      void triggerErrorFeedback(gameSettings.hapticsEnabled);
      return;
    }

    setSolved(true);
    const finalStars = calculateStars(mistakes, hintsUsed);
    const isNewBestTime =
      selectedProgress.bestTime === undefined || seconds < selectedProgress.bestTime;
    const levelPerformance = {
      mistakes,
      hintsUsed
    };
    let nextDailyStats = dailyStats;

    if (selectedLevel.id === dailyLevelId) {
      nextDailyStats = applyDailyCompletion(dailyStats, {
        date: todayKey,
        levelId: selectedLevel.id,
        seconds,
        mistakes,
        hintsUsed,
        stars: finalStars
      });
    }

    await Promise.all([
      setCompleted(selectedLevel.id, true),
      setBestTime(selectedLevel.id, seconds),
      setBestStars(selectedLevel.id, finalStars),
      setLevelPerformance(selectedLevel.id, levelPerformance),
      selectedLevel.id === dailyLevelId ? setDailyStats(nextDailyStats) : Promise.resolve()
    ]);
    setResultSummary({
      levelId: selectedLevel.id,
      levelName: selectedLevel.names[locale],
      seconds,
      mistakes,
      hintsUsed,
      stars: finalStars,
      isNewBestTime,
      isDaily: selectedLevel.id === dailyLevelId,
      dailyStreak:
        selectedLevel.id === dailyLevelId ? nextDailyStats.currentStreak : dailyStats.currentStreak
    });

    const refreshedProgress = await getAllProgress();
    setProgress(refreshedProgress);
    if (selectedLevel.id === dailyLevelId) {
      setDailyStatsState(nextDailyStats);
    }

    setAchievements(
      getEarnedAchievements(refreshedProgress, {
        mistakes,
        hintsUsed,
        seconds,
        streak: nextDailyStats.currentStreak
      })
    );

    void triggerSuccessFeedback(gameSettings.hapticsEnabled);
  }, [
    board,
    dailyStats,
    dailyLevelId,
    gameSettings.hapticsEnabled,
    hintsUsed,
    loadLevel,
    locale,
    mistakeLimit,
    mistakes,
    seconds,
    selectedLevel,
    selectedProgress.bestTime,
    solved,
    todayKey
  ]);

  const value = useMemo<GameContextValue>(
    () => ({
      levels,
      selectedLevel,
      selectedLevelId,
      board,
      fixedCells,
      hintedCells,
      seconds,
      mistakes,
      hintsUsed,
      stars,
      solved,
      message,
      progress,
      dailyLevelId,
      dailyStats,
      achievements,
      resultSummary,
      canUndo: canUndo(history),
      selectedProgress,
      selectLevel,
      resetLevel,
      replayLevel,
      undoMove,
      dismissResult,
      cycleCell,
      giveHint,
      checkSolution,
      reloadProgress: loadProgress
    }),
    [
      achievements,
      board,
      history,
      checkSolution,
      cycleCell,
      dailyLevelId,
      dailyStats,
      dismissResult,
      fixedCells,
      giveHint,
      hintedCells,
      hintsUsed,
      loadProgress,
      message,
      mistakes,
      progress,
      resultSummary,
      resetLevel,
      replayLevel,
      seconds,
      selectLevel,
      selectedLevel,
      selectedLevelId,
      selectedProgress,
      solved,
      stars,
      undoMove
    ]
  );

  return createContextProvider(GameContext, value, children);
}

function createContextProvider<T>(
  context: React.Context<T>,
  value: T,
  children: ReactNode
): React.ReactElement {
  return createElement(context.Provider, { value }, children);
}

export function useBoxiqGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useBoxiqGame must be used inside BoxiqGameProvider");
  }

  return context;
}
