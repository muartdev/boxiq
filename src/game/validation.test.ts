import { describe, expect, it } from "vitest";
import { levels } from "./levels";
import type { CellValue } from "./types";
import {
  validateBoard,
  calculateStars,
  isBoardComplete,
  checkRowBalance,
  checkColumnBalance,
  checkNoThreeConsecutive,
  checkClues
} from "./validation";
import { getLocalDateString, getDaysDiff, areDatesConsecutive } from "./dateUtils";

describe("Boxiq validation & logic systems", () => {
  it("validates intended solutions for all catalog levels", () => {
    levels.forEach((level) => {
      const result = validateBoard(level.solution, level.relations);
      expect(result.isValid, level.id).toBe(true);
      expect(result.isComplete, level.id).toBe(true);
    });
  });

  it("identifies empty cells correctly", () => {
    const level = levels[0];
    const board = level.solution.map((row) => [...row]);
    expect(isBoardComplete(board)).toBe(true);
    board[0][0] = 0;
    expect(isBoardComplete(board)).toBe(false);
  });

  it("checks row and column balance rules", () => {
    // 4 filled, 2 hollow in a row
    const invalidRowBoard: CellValue[][] = [
      [1, 1, 1, 1, 2, 2],
      [1, 2, 2, 1, 1, 2],
      [2, 1, 1, 2, 2, 1],
      [2, 1, 2, 1, 2, 1],
      [1, 2, 1, 2, 1, 2],
      [2, 2, 1, 2, 1, 1]
    ];
    const rowIssues = checkRowBalance(invalidRowBoard);
    expect(rowIssues.length).toBe(1);
    expect(rowIssues[0].type).toBe("row_balance");

    // 4 hollow, 2 filled in a col
    const invalidColBoard: CellValue[][] = [
      [2, 1, 2, 1, 2, 2],
      [2, 2, 2, 1, 1, 2],
      [2, 1, 1, 2, 2, 1],
      [2, 1, 2, 1, 2, 1],
      [1, 2, 1, 2, 1, 2],
      [1, 2, 1, 2, 1, 1]
    ];
    const colIssues = checkColumnBalance(invalidColBoard);
    expect(colIssues.length).toBeGreaterThanOrEqual(1);
  });

  it("checks three consecutive identical symbols", () => {
    const consecutiveBoard: CellValue[][] = [
      [1, 1, 1, 2, 2, 2],
      [1, 2, 2, 1, 1, 2],
      [2, 1, 1, 2, 2, 1],
      [2, 1, 2, 1, 2, 1],
      [1, 2, 1, 2, 1, 2],
      [2, 2, 1, 2, 1, 1]
    ];
    const issues = checkNoThreeConsecutive(consecutiveBoard);
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues.some(issue => issue.type === "three_consecutive")).toBe(true);
  });

  it("checks equal and cross clues correctly", () => {
    const level = levels[0];
    const board = level.solution.map((row) => [...row]);
    
    // Violate equals clue: r1/c1 is 1 (filled), let's make r2/c2 opposite
    const clue = level.relations[0]; // [0, 0, 0, 1] which has type "="
    board[clue.r2][clue.c2] = board[clue.r1][clue.c1] === 1 ? 2 : 1;
    
    const clueIssues = checkClues(board, level.relations);
    expect(clueIssues.length).toBeGreaterThanOrEqual(1);
  });

  it("correctly calculates stars based on play metrics", () => {
    expect(calculateStars({ mistakes: 0, usedHints: 0 })).toBe(3);
    expect(calculateStars({ mistakes: 1, usedHints: 0 })).toBe(2);
    expect(calculateStars({ mistakes: 0, usedHints: 1 })).toBe(2);
    expect(calculateStars({ mistakes: 1, usedHints: 1 })).toBe(2);
    expect(calculateStars({ mistakes: 2, usedHints: 0 })).toBe(1);
    expect(calculateStars({ mistakes: 0, usedHints: 2 })).toBe(1);
  });

  it("verifies stable timezone-safe dateUtils functions", () => {
    const today = getLocalDateString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    
    expect(getDaysDiff("2026-05-25", "2026-05-26")).toBe(1);
    expect(getDaysDiff("2026-05-25", "2026-05-28")).toBe(3);
    expect(areDatesConsecutive("2026-05-25", "2026-05-26")).toBe(true);
    expect(areDatesConsecutive("2026-05-25", "2026-05-27")).toBe(false);
  });
});
