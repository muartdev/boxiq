import { describe, expect, it } from "vitest";

import type { DailyStats, Level, ProgressMap } from "./types";
import { buildStatsSummary } from "./stats";

const levels = [{ id: "a" }, { id: "b" }, { id: "c" }] as Level[];

describe("Boxiq stats summary", () => {
  it("computes totals from solved progress and daily stats", () => {
    const progress: ProgressMap = {
      a: { completed: true, bestStars: 3, bestTime: 42, bestHintsUsed: 0 },
      b: { completed: true, bestStars: 2, bestTime: 75, bestHintsUsed: 1 }
    };
    const dailyStats: DailyStats = {
      currentStreak: 7,
      bestStreak: 9,
      dailyBestTime: 55,
      dailyHistory: [
        {
          date: "2026-05-24",
          levelId: "daily-01",
          seconds: 55,
          mistakes: 0,
          hintsUsed: 0,
          stars: 3
        },
        {
          date: "2026-05-22",
          levelId: "daily-02",
          seconds: 81,
          mistakes: 1,
          hintsUsed: 0,
          stars: 2
        }
      ]
    };

    expect(buildStatsSummary(levels, progress, dailyStats, "2026-05-24")).toEqual({
      completedLevels: 2,
      totalLevels: 3,
      totalStars: 5,
      completionRate: 67,
      hintlessCompleted: 1,
      bestTime: 42,
      currentStreak: 7,
      bestStreak: 9,
      dailyBestTime: 55,
      todayStatus: {
        date: "2026-05-24",
        levelId: "daily-01",
        seconds: 55,
        mistakes: 0,
        hintsUsed: 0,
        stars: 3
      },
      lastSevenDays: [
        { date: "2026-05-18", completed: false },
        { date: "2026-05-19", completed: false },
        { date: "2026-05-20", completed: false },
        { date: "2026-05-21", completed: false },
        { date: "2026-05-22", completed: true, stars: 2 },
        { date: "2026-05-23", completed: false },
        { date: "2026-05-24", completed: true, stars: 3 }
      ]
    });
  });
});
