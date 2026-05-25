import { getDailyEntry } from "./retention";
import type { DailyStats, Level, Locale, ProgressMap, StatsSummary } from "./types";

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
  todayKey = todayKeyFallback(),
  locale: Locale = "en"
): StatsSummary {
  const entries = Object.values(progress);
  const completed = entries.filter((entry) => entry.completed);
  const bestTimes = completed
    .map((entry) => entry.bestTime)
    .filter((time): time is number => typeof time === "number");
  const difficultyProgress = Array.from(
    levels.reduce<Map<string, { completed: number; total: number }>>((accumulator, level) => {
      const key = level.difficulty?.[locale] ?? level.difficulty?.en ?? "Unknown";
      const current = accumulator.get(key) ?? { completed: 0, total: 0 };
      current.total += 1;
      if (progress[level.id]?.completed) {
        current.completed += 1;
      }
      accumulator.set(key, current);
      return accumulator;
    }, new Map())
  ).map(([difficulty, value]) => ({
    difficulty,
    completed: value.completed,
    total: value.total
  }));

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = shiftDateKey(todayKey, index - 6);
    const entry = getDailyEntry(dailyStats, date);

    return entry
      ? { date, completed: true, stars: entry.stars }
      : { date, completed: false };
  });

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
    activeDaysThisWeek: lastSevenDays.filter((day) => day.completed).length,
    difficultyProgress,
    todayStatus: getDailyEntry(dailyStats, todayKey),
    lastSevenDays
  };
}
