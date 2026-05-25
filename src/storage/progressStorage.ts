import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  DailyHistoryEntry,
  DailyStats,
  GameSettings,
  LevelProgress,
  Locale,
  ProgressMap,
  ThemeMode
} from "../game/types";

const keys = {
  language: "boxiq:language",
  theme: "boxiq:theme",
  currentLevel: "boxiq:current-level",
  progress: "boxiq:progress",
  gameSettings: "boxiq:game-settings",
  dailyStats: "boxiq:daily-stats",
  progressDataV2: "boxiq:progress-data-v2"
};

export const defaultGameSettings: GameSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  timerEnabled: true,
  instantFeedbackEnabled: true,
  mistakeLimit: "normal",
  colorBlindMode: false,
  dailyReminderEnabled: false,
  tutorialSeen: false
};

export const defaultDailyStats: DailyStats = {
  currentStreak: 0,
  bestStreak: 0,
  dailyHistory: []
};

function safeParse<T>(raw: string | null): T | undefined {
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function normalizeLevelProgress(progress: unknown): LevelProgress {
  if (!progress || typeof progress !== "object") {
    return {};
  }

  const value = progress as Partial<LevelProgress>;
  return {
    bestTime: typeof value.bestTime === "number" ? value.bestTime : undefined,
    completed: typeof value.completed === "boolean" ? value.completed : undefined,
    bestStars: typeof value.bestStars === "number" ? value.bestStars : undefined,
    bestMistakes: typeof value.bestMistakes === "number" ? value.bestMistakes : undefined,
    bestHintsUsed: typeof value.bestHintsUsed === "number" ? value.bestHintsUsed : undefined
  };
}

function normalizeProgress(progress: unknown): ProgressMap {
  if (!progress || typeof progress !== "object") {
    return {};
  }

  return Object.entries(progress as Record<string, unknown>).reduce<ProgressMap>((accumulator, [levelId, value]) => {
    accumulator[levelId] = normalizeLevelProgress(value);
    return accumulator;
  }, {});
}

function normalizeDailyHistoryEntry(entry: unknown): DailyHistoryEntry | undefined {
  if (!entry || typeof entry !== "object") {
    return undefined;
  }

  const value = entry as Partial<DailyHistoryEntry>;
  if (
    typeof value.date !== "string" ||
    typeof value.levelId !== "string" ||
    typeof value.seconds !== "number" ||
    typeof value.mistakes !== "number" ||
    typeof value.hintsUsed !== "number" ||
    typeof value.stars !== "number"
  ) {
    return undefined;
  }

  return {
    date: value.date,
    levelId: value.levelId,
    seconds: value.seconds,
    mistakes: value.mistakes,
    hintsUsed: value.hintsUsed,
    stars: value.stars
  };
}

function normalizeDailyStats(stats: unknown): DailyStats {
  if (!stats || typeof stats !== "object") {
    return defaultDailyStats;
  }

  const value = stats as Record<string, unknown>;
  const dailyHistory = Array.isArray(value.dailyHistory)
    ? value.dailyHistory
        .map((entry) => normalizeDailyHistoryEntry(entry))
        .filter((entry): entry is DailyHistoryEntry => Boolean(entry))
        .sort((left, right) => left.date.localeCompare(right.date))
    : [];

  const legacyTodayScore =
    value.todayScore && typeof value.todayScore === "object"
      ? (value.todayScore as Record<string, unknown>)
      : undefined;

  const migratedTodayEntry =
    legacyTodayScore &&
    typeof legacyTodayScore.date === "string" &&
    typeof legacyTodayScore.seconds === "number" &&
    typeof legacyTodayScore.stars === "number" &&
    typeof legacyTodayScore.mistakes === "number"
      ? {
          date: legacyTodayScore.date,
          levelId: typeof value.lastDailyLevelId === "string" ? value.lastDailyLevelId : "daily",
          seconds: legacyTodayScore.seconds,
          mistakes: legacyTodayScore.mistakes,
          hintsUsed: typeof legacyTodayScore.hintsUsed === "number" ? legacyTodayScore.hintsUsed : 0,
          stars: legacyTodayScore.stars
        }
      : undefined;

  const mergedHistory = [...dailyHistory];
  if (migratedTodayEntry && !mergedHistory.some((entry) => entry.date === migratedTodayEntry.date)) {
    mergedHistory.push(migratedTodayEntry);
    mergedHistory.sort((left, right) => left.date.localeCompare(right.date));
  }

  const currentStreak =
    typeof value.currentStreak === "number"
      ? value.currentStreak
      : typeof value.streak === "number"
        ? value.streak
        : 0;

  const bestStreak =
    typeof value.bestStreak === "number"
      ? value.bestStreak
      : typeof value.streak === "number"
        ? value.streak
        : 0;

  const lastDailyCompletedDate =
    typeof value.lastDailyCompletedDate === "string"
      ? value.lastDailyCompletedDate
      : typeof value.lastSolvedDate === "string"
        ? value.lastSolvedDate
        : undefined;

  const dailyBestTime =
    typeof value.dailyBestTime === "number"
      ? value.dailyBestTime
      : typeof value.bestDailyTime === "number"
        ? value.bestDailyTime
        : undefined;

  return {
    lastDailyCompletedDate,
    currentStreak,
    bestStreak,
    dailyBestTime,
    dailyHistory: mergedHistory
  };
}

async function getProgress(): Promise<ProgressMap> {
  return normalizeProgress(safeParse<unknown>(await AsyncStorage.getItem(keys.progress)));
}

async function setProgress(progress: ProgressMap): Promise<void> {
  await AsyncStorage.setItem(keys.progress, JSON.stringify(progress));
}

export async function getLanguage(): Promise<Locale> {
  const value = await AsyncStorage.getItem(keys.language);
  return value === "tr" || value === "en" ? value : "en";
}

export async function setLanguage(locale: Locale): Promise<void> {
  await AsyncStorage.setItem(keys.language, locale);
}

export async function getTheme(): Promise<ThemeMode> {
  const value = await AsyncStorage.getItem(keys.theme);
  return value === "light" || value === "dark" ? value : "light";
}

export async function setTheme(theme: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(keys.theme, theme);
}

export async function getGameSettings(): Promise<GameSettings> {
  const raw = safeParse<Partial<GameSettings>>(await AsyncStorage.getItem(keys.gameSettings));
  return raw ? { ...defaultGameSettings, ...raw } : defaultGameSettings;
}

export async function setGameSettings(settings: GameSettings): Promise<void> {
  await AsyncStorage.setItem(keys.gameSettings, JSON.stringify(settings));
}

export async function getDailyStats(): Promise<DailyStats> {
  return normalizeDailyStats(safeParse<unknown>(await AsyncStorage.getItem(keys.dailyStats)));
}

export async function setDailyStats(stats: DailyStats): Promise<void> {
  await AsyncStorage.setItem(keys.dailyStats, JSON.stringify(stats));
}

export async function getCurrentLevel(): Promise<string | undefined> {
  const value = await AsyncStorage.getItem(keys.currentLevel);
  return value ?? undefined;
}

export async function setCurrentLevel(levelId: string): Promise<void> {
  await AsyncStorage.setItem(keys.currentLevel, levelId);
}

export async function getBestTime(levelId: string): Promise<number | undefined> {
  return (await getProgress())[levelId]?.bestTime;
}

export async function setBestTime(levelId: string, seconds: number): Promise<void> {
  const progress = await getProgress();
  const previous = progress[levelId]?.bestTime;

  progress[levelId] = {
    ...progress[levelId],
    bestTime: previous === undefined ? seconds : Math.min(previous, seconds)
  };

  await setProgress(progress);
}

export async function getCompleted(levelId: string): Promise<boolean> {
  return Boolean((await getProgress())[levelId]?.completed);
}

export async function setCompleted(levelId: string, completed: true): Promise<void> {
  const progress = await getProgress();
  progress[levelId] = { ...progress[levelId], completed };
  await setProgress(progress);
}

export async function getBestStars(levelId: string): Promise<number | undefined> {
  return (await getProgress())[levelId]?.bestStars;
}

export async function setBestStars(levelId: string, stars: number): Promise<void> {
  const progress = await getProgress();
  const previous = progress[levelId]?.bestStars;

  progress[levelId] = {
    ...progress[levelId],
    bestStars: previous === undefined ? stars : Math.max(previous, stars)
  };

  await setProgress(progress);
}

export async function setLevelPerformance(
  levelId: string,
  payload: { mistakes: number; hintsUsed: number }
): Promise<void> {
  const progress = await getProgress();
  const current = progress[levelId] ?? {};

  progress[levelId] = {
    ...current,
    bestMistakes:
      current.bestMistakes === undefined ? payload.mistakes : Math.min(current.bestMistakes, payload.mistakes),
    bestHintsUsed:
      current.bestHintsUsed === undefined ? payload.hintsUsed : Math.min(current.bestHintsUsed, payload.hintsUsed)
  };

  await setProgress(progress);
}

export async function getAllProgress(): Promise<ProgressMap> {
  return getProgress();
}

export async function resetProgress(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(keys.progress),
    AsyncStorage.removeItem(keys.dailyStats),
    AsyncStorage.removeItem(keys.progressDataV2),
    AsyncStorage.removeItem(keys.currentLevel)
  ]);
}
