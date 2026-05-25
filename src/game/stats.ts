import { getDailyEntry } from "./retention";
import type { DailyStats, Level, ProgressMap, StatsSummary } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

function shiftDateKey(dateKey: string, offset: number): string {
  const base = new Date(`${dateKey}T00:00:00Z`).getTime();
  return new Date(base + offset * DAY_MS).toISOString().slice(0, 10);
}

function todayKeyFallback(): string {
  return new Date().toISOString().slice(0, 10);
}

export function buildStatsSummary(
  levels: Level[],
  progress: ProgressMap,
  dailyStats: DailyStats,
  todayKey = todayKeyFallback()
): StatsSummary {
  const entries = Object.values(progress);
  const completed = entries.filter((entry) => entry.completed);
  const bestTimes = completed
    .map((entry) => entry.bestTime)
    .filter((time): time is number => typeof time === "number");

  return {
    completedLevels: completed.length,
    totalLevels: levels.length,
    totalStars: completed.reduce((sum, entry) => sum + (entry.bestStars ?? 0), 0),
    completionRate: levels.length === 0 ? 0 : Math.round((completed.length / levels.length) * 100),
    hintlessCompleted: completed.filter(
      (entry) => entry.bestHintsUsed === 0 || (entry.bestHintsUsed === undefined && entry.bestStars === 3)
    ).length,
    bestTime: bestTimes.length > 0 ? Math.min(...bestTimes) : undefined,
    currentStreak: dailyStats.currentStreak,
    bestStreak: dailyStats.bestStreak,
    dailyBestTime: dailyStats.dailyBestTime,
    todayStatus: getDailyEntry(dailyStats, todayKey),
    lastSevenDays: Array.from({ length: 7 }, (_, index) => {
      const date = shiftDateKey(todayKey, index - 6);
      const entry = getDailyEntry(dailyStats, date);

      return entry
        ? { date, completed: true, stars: entry.stars }
        : { date, completed: false };
    })
  };
}
