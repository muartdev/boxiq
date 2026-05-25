import { describe, expect, it } from "vitest";

import type { DailyStats, DailyHistoryEntry, LevelProgress } from "./types";
import {
  applyDailyCompletion,
  getEarnedAchievements,
  getDailyEntry,
  hasSolvedDailyToday,
  getUnlockedAchievements,
  pickDailyLevel
} from "./retention";

describe("Boxiq retention systems", () => {
  it("rotates the daily level deterministically by date", () => {
    const levelIds = ["a", "b", "c"];

    expect(pickDailyLevel(levelIds, new Date("2026-05-24T08:00:00Z"))).toBe("c");
    expect(pickDailyLevel(levelIds, new Date("2026-05-25T08:00:00Z"))).toBe("a");
  });

  it("increments streaks on consecutive daily completions and tracks best streak", () => {
    const stats: DailyStats = {
      currentStreak: 4,
      bestStreak: 4,
      lastDailyCompletedDate: "2026-05-23",
      dailyHistory: []
    };
    const entry: DailyHistoryEntry = {
      date: "2026-05-24",
      levelId: "daily-01",
      seconds: 72,
      mistakes: 0,
      hintsUsed: 0,
      stars: 3
    };

    expect(applyDailyCompletion(stats, entry)).toEqual({
      currentStreak: 5,
      bestStreak: 5,
      lastDailyCompletedDate: "2026-05-24",
      dailyBestTime: 72,
      dailyHistory: [entry]
    });
  });

  it("does not increment streak twice on the same day and keeps the better run", () => {
    const stats: DailyStats = {
      currentStreak: 3,
      bestStreak: 4,
      lastDailyCompletedDate: "2026-05-24",
      dailyBestTime: 80,
      dailyHistory: [
        {
          date: "2026-05-24",
          levelId: "daily-01",
          seconds: 80,
          mistakes: 1,
          hintsUsed: 1,
          stars: 2
        }
      ]
    };

    const updated = applyDailyCompletion(stats, {
      date: "2026-05-24",
      levelId: "daily-01",
      seconds: 62,
      mistakes: 0,
      hintsUsed: 0,
      stars: 3
    });

    expect(updated.currentStreak).toBe(3);
    expect(updated.bestStreak).toBe(4);
    expect(updated.dailyBestTime).toBe(62);
    expect(updated.dailyHistory).toEqual([
      {
        date: "2026-05-24",
        levelId: "daily-01",
        seconds: 62,
        stars: 3,
        mistakes: 0,
        hintsUsed: 0
      }
    ]);
  });

  it("knows whether today's daily puzzle has already been solved", () => {
    const stats: DailyStats = {
      currentStreak: 3,
      bestStreak: 5,
      dailyHistory: [
        {
          date: "2026-05-24",
          levelId: "daily-01",
          seconds: 72,
          stars: 3,
          mistakes: 0,
          hintsUsed: 0
        }
      ]
    };

    expect(hasSolvedDailyToday(stats, "2026-05-24")).toBe(true);
    expect(hasSolvedDailyToday(stats, "2026-05-25")).toBe(false);
    expect(getDailyEntry(stats, "2026-05-24")?.seconds).toBe(72);
  });

  it("awards simple launch achievements from progress and solve quality", () => {
    const progress: Record<string, LevelProgress> = {
      first: { completed: true, bestStars: 3, bestTime: 42 },
      second: { completed: true, bestStars: 2, bestTime: 95 }
    };

    const achievements = getEarnedAchievements(progress, {
      mistakes: 0,
      hintsUsed: 0,
      seconds: 42,
      streak: 7
    });

    expect(achievements).toEqual([
      "first-solve",
      "flawless",
      "under-minute",
      "no-hint",
      "seven-day-streak"
    ]);
  });

  it("derives unlocked achievements from stored progress and streaks", () => {
    const progress: Record<string, LevelProgress> = {
      first: { completed: true, bestStars: 3, bestTime: 42, bestMistakes: 0, bestHintsUsed: 0 },
      second: { completed: true, bestStars: 2, bestTime: 80, bestMistakes: 1, bestHintsUsed: 1 }
    };

    expect(getUnlockedAchievements(progress, { bestStreak: 8 })).toEqual([
      "first-solve",
      "flawless",
      "under-minute",
      "no-hint",
      "seven-day-streak"
    ]);
  });
});
