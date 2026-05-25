import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocalDateString, getDaysDiff } from "../game/dateUtils";
import { levels as allLevels } from "../game/levels";
import type { DailyHistoryEntry, DailyStats } from "../game/types";

const DEV = true;

const keys = {
  progressData: "boxiq:progress-data-v2",
  legacyProgress: "boxiq:progress",
  legacyDailyStats: "boxiq:daily-stats"
};

export interface LevelProgressDetail {
  completed: boolean;
  bestTimeSeconds: number | null;
  bestStars: number;
  completions: number;
  lastPlayedAt: string | null;
  completedAt: string | null;
  bestMistakes: number | null;
  bestUsedHints: number | null;
  hintlessCompleted: boolean;
}

export interface ProgressData {
  version: number;
  levels: Record<string, LevelProgressDetail>;
  daily: {
    currentDailyLevelId: string | null;
    lastCompletedDailyDate: string | null;
    streak: number;
    bestStreak: number;
    dailyHistory: DailyHistoryEntry[];
  };
  totals: {
    totalCompleted: number;
    totalStars: number;
    totalHintless: number;
    totalMistakes: number;
    totalPlayTimeSeconds: number;
  };
}

const initialProgressData: ProgressData = {
  version: 2,
  levels: {},
  daily: {
    currentDailyLevelId: null,
    lastCompletedDailyDate: null,
    streak: 0,
    bestStreak: 0,
    dailyHistory: []
  },
  totals: {
    totalCompleted: 0,
    totalStars: 0,
    totalHintless: 0,
    totalMistakes: 0,
    totalPlayTimeSeconds: 0
  }
};

export async function loadProgress(): Promise<ProgressData> {
  try {
    const raw = await AsyncStorage.getItem(keys.progressData);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && parsed.version === 2) {
        if (DEV) console.log("[progressStore] Loaded progress successfully.");
        return parsed as ProgressData;
      }
    }

    // Attempt migration from legacy storage keys
    const legacyProgRaw = await AsyncStorage.getItem(keys.legacyProgress);
    const legacyDailyRaw = await AsyncStorage.getItem(keys.legacyDailyStats);

    if (legacyProgRaw || legacyDailyRaw) {
      if (DEV) console.log("[progressStore] Legacy data found. Migrating...");
      const migrated = { ...initialProgressData };
      
      if (legacyProgRaw) {
        try {
          const parsedLegacyProg = JSON.parse(legacyProgRaw);
          if (parsedLegacyProg && typeof parsedLegacyProg === "object") {
            Object.entries(parsedLegacyProg).forEach(([levelId, item]: [string, any]) => {
              migrated.levels[levelId] = {
                completed: !!item.completed,
                bestTimeSeconds: typeof item.bestTime === "number" ? item.bestTime : null,
                bestStars: typeof item.bestStars === "number" ? item.bestStars : 0,
                completions: item.completed ? 1 : 0,
                lastPlayedAt: null,
                completedAt: null,
                bestMistakes: typeof item.bestMistakes === "number" ? item.bestMistakes : null,
                bestUsedHints: typeof item.bestHintsUsed === "number" ? item.bestHintsUsed : null,
                hintlessCompleted: typeof item.bestHintsUsed === "number" ? item.bestHintsUsed === 0 : false
              };
            });
          }
        } catch (e) {
          if (DEV) console.error("[progressStore] Failed to parse legacy progress:", e);
        }
      }

      if (legacyDailyRaw) {
        try {
          const parsedLegacyDaily = JSON.parse(legacyDailyRaw);
          if (parsedLegacyDaily && typeof parsedLegacyDaily === "object") {
            migrated.daily.streak = typeof parsedLegacyDaily.currentStreak === "number" ? parsedLegacyDaily.currentStreak : 0;
            migrated.daily.bestStreak = typeof parsedLegacyDaily.bestStreak === "number" ? parsedLegacyDaily.bestStreak : 0;
            migrated.daily.lastCompletedDailyDate = typeof parsedLegacyDaily.lastDailyCompletedDate === "string" ? parsedLegacyDaily.lastDailyCompletedDate : null;
            migrated.daily.dailyHistory = Array.isArray(parsedLegacyDaily.dailyHistory) ? parsedLegacyDaily.dailyHistory : [];
          }
        } catch (e) {
          if (DEV) console.error("[progressStore] Failed to parse legacy daily stats:", e);
        }
      }

      // Recalculate totals
      let uniqueCompleted = 0;
      let totalStars = 0;
      let totalHintless = 0;
      Object.values(migrated.levels).forEach((lvl) => {
        if (lvl.completed) {
          uniqueCompleted++;
          totalStars += lvl.bestStars;
          if (lvl.hintlessCompleted) {
            totalHintless++;
          }
        }
      });
      migrated.totals.totalCompleted = uniqueCompleted;
      migrated.totals.totalStars = totalStars;
      migrated.totals.totalHintless = totalHintless;

      await AsyncStorage.setItem(keys.progressData, JSON.stringify(migrated));
      if (DEV) console.log("[progressStore] Migrated data saved.");
      return migrated;
    }

    if (DEV) console.log("[progressStore] No progress found, returning initial state.");
    return initialProgressData;
  } catch (error) {
    if (DEV) console.error("[progressStore] Error in loadProgress:", error);
    return initialProgressData;
  }
}

export async function saveProgress(progress: ProgressData): Promise<void> {
  try {
    await AsyncStorage.setItem(keys.progressData, JSON.stringify(progress));
    if (DEV) console.log("[progressStore] Progress saved successfully.");
  } catch (error) {
    if (DEV) console.error("[progressStore] Error in saveProgress:", error);
  }
}

export async function getLevelProgress(levelId: string): Promise<LevelProgressDetail | null> {
  const progress = await loadProgress();
  return progress.levels[levelId] || null;
}

export async function recordLevelStarted(levelId: string): Promise<void> {
  try {
    const progress = await loadProgress();
    const current = progress.levels[levelId] || {
      completed: false,
      bestTimeSeconds: null,
      bestStars: 0,
      completions: 0,
      lastPlayedAt: null,
      completedAt: null,
      bestMistakes: null,
      bestUsedHints: null,
      hintlessCompleted: false
    };

    current.lastPlayedAt = new Date().toISOString();
    progress.levels[levelId] = current;
    await saveProgress(progress);
  } catch (error) {
    if (DEV) console.error("[progressStore] Error in recordLevelStarted:", error);
  }
}

export async function recordLevelCompleted({
  levelId,
  elapsedSeconds,
  mistakes,
  usedHints,
  stars,
  isDaily
}: {
  levelId: string;
  elapsedSeconds: number;
  mistakes: number;
  usedHints: number;
  stars: number;
  isDaily: boolean;
}): Promise<void> {
  try {
    const progress = await loadProgress();
    const current = progress.levels[levelId] || {
      completed: false,
      bestTimeSeconds: null,
      bestStars: 0,
      completions: 0,
      lastPlayedAt: null,
      completedAt: null,
      bestMistakes: null,
      bestUsedHints: null,
      hintlessCompleted: false
    };

    current.completed = true;
    current.completions += 1;
    current.completedAt = new Date().toISOString();

    current.bestTimeSeconds = current.bestTimeSeconds === null 
      ? elapsedSeconds 
      : Math.min(current.bestTimeSeconds, elapsedSeconds);

    current.bestStars = Math.max(current.bestStars, stars);

    current.bestMistakes = current.bestMistakes === null 
      ? mistakes 
      : Math.min(current.bestMistakes, mistakes);

    current.bestUsedHints = current.bestUsedHints === null 
      ? usedHints 
      : Math.min(current.bestUsedHints, usedHints);

    if (usedHints === 0) {
      current.hintlessCompleted = true;
    }

    progress.levels[levelId] = current;

    // Handle Streak and Daily stats
    if (isDaily) {
      const todayStr = getLocalDateString();
      const lastCompleted = progress.daily.lastCompletedDailyDate;

      if (lastCompleted !== todayStr) {
        if (lastCompleted) {
          const diff = getDaysDiff(lastCompleted, todayStr);
          if (diff === 1) {
            progress.daily.streak += 1;
          } else {
            progress.daily.streak = 1;
          }
        } else {
          progress.daily.streak = 1;
        }
        progress.daily.bestStreak = Math.max(progress.daily.bestStreak, progress.daily.streak);
        progress.daily.lastCompletedDailyDate = todayStr;
      }
      progress.daily.currentDailyLevelId = levelId;

      // Add or update dailyHistory entry
      const existingHistoryIdx = progress.daily.dailyHistory.findIndex(e => e.date === todayStr);
      const newEntry: DailyHistoryEntry = {
        date: todayStr,
        levelId,
        seconds: elapsedSeconds,
        mistakes,
        hintsUsed: usedHints,
        stars
      };

      if (existingHistoryIdx >= 0) {
        const oldEntry = progress.daily.dailyHistory[existingHistoryIdx];
        // Keep the best score
        if (stars > oldEntry.stars || (stars === oldEntry.stars && elapsedSeconds < oldEntry.seconds)) {
          progress.daily.dailyHistory[existingHistoryIdx] = newEntry;
        }
      } else {
        progress.daily.dailyHistory.push(newEntry);
      }
      progress.daily.dailyHistory.sort((a, b) => a.date.localeCompare(b.date));
    }

    // Recalculate totals dynamically
    let uniqueCompleted = 0;
    let totalStars = 0;
    let totalHintless = 0;
    Object.values(progress.levels).forEach((lvl) => {
      if (lvl.completed) {
        uniqueCompleted++;
        totalStars += lvl.bestStars;
        if (lvl.hintlessCompleted) {
          totalHintless++;
        }
      }
    });

    progress.totals.totalCompleted = uniqueCompleted;
    progress.totals.totalStars = totalStars;
    progress.totals.totalHintless = totalHintless;
    progress.totals.totalMistakes += mistakes;
    progress.totals.totalPlayTimeSeconds += elapsedSeconds;

    await saveProgress(progress);
    if (DEV) console.log(`[progressStore] Level completed recorded: ${levelId}`);
  } catch (error) {
    if (DEV) console.error("[progressStore] Error in recordLevelCompleted:", error);
  }
}

export async function resetProgress(): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem(keys.progressData),
      AsyncStorage.removeItem(keys.legacyProgress),
      AsyncStorage.removeItem(keys.legacyDailyStats)
    ]);
    if (DEV) console.log("[progressStore] Cleared all progress keys.");
  } catch (error) {
    if (DEV) console.error("[progressStore] Error in resetProgress:", error);
  }
}

export async function getStats() {
  const progress = await loadProgress();
  const totalLevels = allLevels.length;
  const completedLevels = progress.totals.totalCompleted;
  const completionPercentage = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

  let bestTime: number | undefined = undefined;
  Object.values(progress.levels).forEach((lvl) => {
    if (lvl.bestTimeSeconds !== null) {
      if (bestTime === undefined || lvl.bestTimeSeconds < bestTime) {
        bestTime = lvl.bestTimeSeconds;
      }
    }
  });

  return {
    completedLevels,
    totalLevels,
    completionPercentage,
    totalStars: progress.totals.totalStars,
    hintlessCompleted: progress.totals.totalHintless,
    bestTime,
    currentDailyStreak: progress.daily.streak,
    bestStreak: progress.daily.bestStreak,
    totalPlayTimeSeconds: progress.totals.totalPlayTimeSeconds,
    lastCompletedDailyDate: progress.daily.lastCompletedDailyDate
  };
}
