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
import { buildSmartHintForCell } from "../game/hints";
import { cloneGrid, levels } from "../game/levels";
import { findInstantConflicts } from "../game/live-feedback";
import { getEarnedAchievements, pickDailyLevel } from "../game/retention";
import type {
  AchievementId,
  CellValue,
  CellKey,
  DailyStats,
  Level,
  LevelProgress,
  MoveSnapshot,
  ProgressMap,
  ResultSummary
} from "../game/types";
import { solvedMessage } from "../game/validator";
import { validateBoard, calculateStars as calculateValidationStars } from "../game/validation";
import { t } from "../i18n/translations";
import {
  getCurrentLevel,
  setCurrentLevel,
} from "../storage/progressStorage";
import {
  loadProgress as getProgressStoreData,
  recordLevelCompleted,
  recordLevelStarted,
} from "../storage/progressStore";
import {
  triggerErrorFeedback,
  triggerHintFeedback,
  triggerSelectionFeedback,
  triggerSuccessFeedback
} from "../lib/feedback";
import { useSettings } from "./useSettings";

type HintCell = CellKey;

type GameContextValue = {
  levels: Level[];
  selectedLevel: Level;
  selectedLevelId: string;
  board: CellValue[][];
  fixedCells: boolean[][];
  hintedCells: Set<HintCell>;
  invalidCells: Set<HintCell>;
  selectedCell?: HintCell;
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
  selectCell: (row: number, col: number) => void;
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

function mapProgressFromStore(data: Awaited<ReturnType<typeof getProgressStoreData>>): ProgressMap {
  const nextProgress: ProgressMap = {};

  Object.entries(data.levels).forEach(([levelId, levelProgress]) => {
    nextProgress[levelId] = {
      completed: levelProgress.completed,
      bestTime: levelProgress.bestTimeSeconds ?? undefined,
      bestStars: levelProgress.bestStars,
      bestMistakes: levelProgress.bestMistakes ?? undefined,
      bestHintsUsed: levelProgress.bestUsedHints ?? undefined
    };
  });

  return nextProgress;
}

function mapDailyStatsFromStore(data: Awaited<ReturnType<typeof getProgressStoreData>>): DailyStats {
  const dailyBestTime =
    data.daily.dailyHistory.length > 0
      ? Math.min(...data.daily.dailyHistory.map((entry) => entry.seconds))
      : undefined;

  return {
    lastDailyCompletedDate: data.daily.lastCompletedDailyDate || undefined,
    currentStreak: data.daily.streak,
    bestStreak: data.daily.bestStreak,
    dailyBestTime,
    dailyHistory: data.daily.dailyHistory
  };
}

export function BoxiqGameProvider({ children }: { children: ReactNode }) {
  const { gameSettings, locale } = useSettings();
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0].id);
  const selectedLevel = useMemo(() => findLevel(selectedLevelId), [selectedLevelId]);
  const [board, setBoard] = useState<CellValue[][]>(() => cloneGrid(selectedLevel.grid));
  const [hintedCells, setHintedCells] = useState<Set<HintCell>>(() => new Set());
  const [invalidCells, setInvalidCells] = useState<Set<HintCell>>(() => new Set());
  const [selectedCell, setSelectedCell] = useState<HintCell | undefined>();
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
  const stars = calculateValidationStars({ mistakes, usedHints: hintsUsed });
  const selectedProgress = progress[selectedLevel.id] ?? {};
  const dailyLevelId = useMemo(() => pickDailyLevel(levels.map((level) => level.id), new Date()), []);
  const mistakeLimit =
    gameSettings.mistakeLimit === "relaxed" ? undefined : gameSettings.mistakeLimit === "normal" ? 3 : 1;

  const loadProgress = useCallback(async () => {
    const data = await getProgressStoreData();
    setProgress(mapProgressFromStore(data));
    setDailyStatsState(mapDailyStatsFromStore(data));
  }, []);

  const loadLevel = useCallback(
    (level: Level, readyMessage = t(locale, "ready")) => {
      setBoard(cloneGrid(level.grid));
      setHintedCells(new Set());
      setInvalidCells(new Set());
      setSelectedCell(undefined);
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
      const storedLevelId = await getCurrentLevel();
      const data = await getProgressStoreData();
      if (!active) {
        return;
      }

      const legacyProgress = mapProgressFromStore(data);
      const legacyDailyStats = mapDailyStatsFromStore(data);

      const nextLevel = findLevel(storedLevelId);
      setSelectedLevelId(nextLevel.id);
      setProgress(legacyProgress);
      setDailyStatsState(legacyDailyStats);
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
      await recordLevelStarted(nextLevel.id);
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
    setInvalidCells(new Set());
    setHistory((current) => current.slice(0, -1));
    setMessage(t(locale, "undoApplied"));
    void triggerSelectionFeedback(gameSettings.hapticsEnabled);
  }, [gameSettings.hapticsEnabled, history, locale, solved]);

  const dismissResult = useCallback(() => {
    setResultSummary(undefined);
  }, []);

  const selectCell = useCallback(
    (row: number, col: number) => {
      if (solved || fixedCells[row][col]) {
        return;
      }

      setSelectedCell(keyForCell(row, col));
    },
    [fixedCells, solved]
  );

  const cycleCell = useCallback(
    (row: number, col: number) => {
      if (solved || fixedCells[row][col]) {
        return;
      }

      setSelectedCell(keyForCell(row, col));
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
      if (gameSettings.instantFeedbackEnabled) {
        const nextBoard = board.map((currentRow, rowIndex) =>
          currentRow.map((cell, colIndex) => {
            if (rowIndex !== row || colIndex !== col) {
              return cell;
            }

            return ((cell + 1) % 3) as CellValue;
          })
        );
        setInvalidCells(new Set(findInstantConflicts(nextBoard, selectedLevel, row, col)));
      } else {
        setInvalidCells(new Set());
      }
    },
    [
      board,
      fixedCells,
      gameSettings.hapticsEnabled,
      gameSettings.instantFeedbackEnabled,
      hintedCells,
      hintsUsed,
      mistakes,
      seconds,
      selectedLevel,
      solved
    ]
  );

  const giveHint = useCallback(() => {
    if (solved) {
      setMessage(t(locale, "alreadySolved"));
      return;
    }

    if (!selectedCell) {
      setMessage(t(locale, "selectHintTarget"));
      return;
    }

    const [rowText, colText] = selectedCell.split("-");
    const row = Number(rowText);
    const col = Number(colText);

    if (!Number.isInteger(row) || !Number.isInteger(col) || fixedCells[row]?.[col]) {
      setMessage(t(locale, "selectHintTarget"));
      return;
    }

    const smartHint = buildSmartHintForCell(board, selectedLevel, fixedCells, locale, row, col);

    if (smartHint) {
      const { value, message: hintMessage } = smartHint;
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
      setInvalidCells(new Set());
      setHintedCells((current) => new Set(current).add(keyForCell(row, col)));
      setHintsUsed((current) => current + 1);
      void triggerHintFeedback(gameSettings.hapticsEnabled);
      setMessage(hintMessage);
      return;
    }

    setMessage(t(locale, "selectedCellAlreadyCorrect"));
  }, [
    board,
    fixedCells,
    gameSettings.hapticsEnabled,
    hintedCells,
    hintsUsed,
    locale,
    mistakes,
    selectedCell,
    seconds,
    selectedLevel,
    solved
  ]);

  const checkSolution = useCallback(async () => {
    if (solved) {
      setMessage(solvedMessage(locale, seconds));
      return;
    }

    const result = validateBoard(board, selectedLevel.relations, locale);
    if (!result.isComplete) {
      let emptyRow = 0;
      let emptyCol = 0;
      let foundEmpty = false;
      for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
          if (board[r][c] === 0) {
            emptyRow = r;
            emptyCol = c;
            foundEmpty = true;
            break;
          }
        }
        if (foundEmpty) break;
      }
      const emptyMsg = locale === "tr"
        ? `Satır ${emptyRow + 1}, sütun ${emptyCol + 1} hâlâ boş. Önce tüm kutuları doldur.`
        : `Row ${emptyRow + 1}, column ${emptyCol + 1} is still empty. Fill every box first.`;
      
      setMessage(emptyMsg);
      return;
    }

    if (!result.isValid) {
      const firstMistake = result.mistakes[0];
      setMessage(firstMistake.message);
      
      const invalidSet = new Set<HintCell>();
      if (firstMistake.row !== undefined && firstMistake.col !== undefined) {
        invalidSet.add(`${firstMistake.row}-${firstMistake.col}`);
      } else if (firstMistake.index !== undefined) {
        if (firstMistake.axis === "row") {
          for (let c = 0; c < 6; c++) invalidSet.add(`${firstMistake.index}-${c}`);
        } else if (firstMistake.axis === "column") {
          for (let r = 0; r < 6; r++) invalidSet.add(`${r}-${firstMistake.index}`);
        }
      }
      setInvalidCells(invalidSet);

      const nextMistakes = mistakes + 1;
      if (mistakeLimit !== undefined && nextMistakes >= mistakeLimit) {
        loadLevel(selectedLevel, t(locale, "mistakeLimitReached"));
      } else {
        setMistakes(nextMistakes);
      }
      void triggerErrorFeedback(gameSettings.hapticsEnabled);
      return;
    }

    // Validate matching the intended solution
    let matchesSolution = true;
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] !== selectedLevel.solution[r][c]) {
          matchesSolution = false;
          break;
        }
      }
      if (!matchesSolution) break;
    }

    if (!matchesSolution) {
      const solutionMsg = locale === "tr"
        ? "Kurallar doğru görünüyor ama çözüm hedef kutuyla eşleşmiyor."
        : "The rules look right, but this is not the intended Boxiq solution.";
      setMessage(solutionMsg);
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
    const finalStars = calculateValidationStars({ mistakes, usedHints: hintsUsed });
    const isNewBestTime =
      selectedProgress.bestTime === undefined || seconds < selectedProgress.bestTime;

    await recordLevelCompleted({
      levelId: selectedLevel.id,
      elapsedSeconds: seconds,
      mistakes,
      usedHints: hintsUsed,
      stars: finalStars,
      isDaily: selectedLevel.id === dailyLevelId
    });

    const data = await getProgressStoreData();
    const legacyProgress = mapProgressFromStore(data);
    setProgress(legacyProgress);

    const legacyDailyStats = mapDailyStatsFromStore(data);
    setDailyStatsState(legacyDailyStats);

    setResultSummary({
      levelId: selectedLevel.id,
      levelName: selectedLevel.names[locale],
      seconds,
      mistakes,
      hintsUsed,
      stars: finalStars,
      isNewBestTime,
      isDaily: selectedLevel.id === dailyLevelId,
      dailyStreak: legacyDailyStats.currentStreak
    });

    setAchievements(
      getEarnedAchievements(legacyProgress, {
        mistakes,
        hintsUsed,
        seconds,
        streak: legacyDailyStats.currentStreak
      })
    );

    void triggerSuccessFeedback(gameSettings.hapticsEnabled);
  }, [
    board,
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
    solved
  ]);

  const value = useMemo<GameContextValue>(
    () => ({
      levels,
      selectedLevel,
      selectedLevelId,
      board,
      fixedCells,
      hintedCells,
      invalidCells,
      selectedCell,
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
      selectCell,
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
      invalidCells,
      hintsUsed,
      loadProgress,
      message,
      mistakes,
      progress,
      resultSummary,
      resetLevel,
      replayLevel,
      selectCell,
      selectedCell,
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
