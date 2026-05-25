import type { AchievementId, DailyHistoryEntry, DailyStats, LevelProgress } from "./types";
import { getLocalDateString } from "./dateUtils";

const DAY_MS = 24 * 60 * 60 * 1000;

export type SolveQuality = {
  mistakes: number;
  hintsUsed: number;
  seconds: number;
  streak: number;
};

export function toDateKey(date: Date): string {
  return getLocalDateString(date);
}

function dayIndex(dateKey: string): number {
  return Math.floor(new Date(`${dateKey}T00:00:00Z`).getTime() / DAY_MS);
}

function isBetterHistoryEntry(current: DailyHistoryEntry, next: DailyHistoryEntry): boolean {
  if (next.stars !== current.stars) {
    return next.stars > current.stars;
  }

  if (next.mistakes !== current.mistakes) {
    return next.mistakes < current.mistakes;
  }

  if (next.hintsUsed !== current.hintsUsed) {
    return next.hintsUsed < current.hintsUsed;
  }

  return next.seconds < current.seconds;
}

export function pickDailyLevel(levelIds: string[], date: Date): string {
  if (levelIds.length === 0) {
    throw new Error("pickDailyLevel requires at least one level id");
  }

  return levelIds[dayIndex(toDateKey(date)) % levelIds.length];
}

export function getDailyEntry(stats: DailyStats, dateKey: string): DailyHistoryEntry | undefined {
  return stats.dailyHistory.find((entry) => entry.date === dateKey);
}

export function hasSolvedDailyToday(stats: DailyStats, todayKey: string): boolean {
  return Boolean(getDailyEntry(stats, todayKey));
}

export function applyDailyCompletion(stats: DailyStats, entry: DailyHistoryEntry): DailyStats {
  const existingEntry = getDailyEntry(stats, entry.date);
  const historyWithoutToday = stats.dailyHistory.filter((historyEntry) => historyEntry.date !== entry.date);
  const bestEntry = existingEntry && !isBetterHistoryEntry(existingEntry, entry) ? existingEntry : entry;
  const nextHistory = [...historyWithoutToday, bestEntry].sort((left, right) => left.date.localeCompare(right.date));
  const alreadyCountedToday = stats.lastDailyCompletedDate === entry.date;

  let currentStreak = stats.currentStreak;

  if (!alreadyCountedToday) {
    const yesterdayIndex = dayIndex(entry.date) - 1;
    const previousIndex = stats.lastDailyCompletedDate ? dayIndex(stats.lastDailyCompletedDate) : undefined;
    currentStreak = previousIndex === yesterdayIndex ? stats.currentStreak + 1 : 1;
  }

  return {
    lastDailyCompletedDate: entry.date,
    currentStreak,
    bestStreak: Math.max(stats.bestStreak, currentStreak),
    dailyBestTime:
      stats.dailyBestTime === undefined ? bestEntry.seconds : Math.min(stats.dailyBestTime, bestEntry.seconds),
    dailyHistory: nextHistory
  };
}

export function getEarnedAchievements(
  progress: Record<string, LevelProgress>,
  quality: SolveQuality
): AchievementId[] {
  const completedCount = Object.values(progress).filter((level) => level.completed).length;
  const achievements: AchievementId[] = [];

  if (completedCount > 0) {
    achievements.push("first-solve");
  }

  if (quality.mistakes === 0) {
    achievements.push("flawless");
  }

  if (quality.seconds < 60) {
    achievements.push("under-minute");
  }

  if (quality.hintsUsed === 0) {
    achievements.push("no-hint");
  }

  if (quality.streak >= 7) {
    achievements.push("seven-day-streak");
  }

  return achievements;
}

export function getUnlockedAchievements(
  progress: Record<string, LevelProgress>,
  dailyStats: Pick<DailyStats, "bestStreak">
): AchievementId[] {
  const achievements: AchievementId[] = [];
  const entries = Object.values(progress);
  const completed = entries.filter((entry) => entry.completed);

  if (completed.length > 0) {
    achievements.push("first-solve");
  }

  if (completed.some((entry) => entry.bestMistakes === 0 || entry.bestStars === 3)) {
    achievements.push("flawless");
  }

  if (completed.some((entry) => typeof entry.bestTime === "number" && entry.bestTime < 60)) {
    achievements.push("under-minute");
  }

  if (completed.some((entry) => entry.bestHintsUsed === 0 || entry.bestStars === 3)) {
    achievements.push("no-hint");
  }

  if (dailyStats.bestStreak >= 7) {
    achievements.push("seven-day-streak");
  }

  return achievements;
}
