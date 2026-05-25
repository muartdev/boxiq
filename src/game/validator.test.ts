import { describe, expect, it } from "vitest";

import { levels } from "./levels";
import { calculateStars } from "./scoring";
import { validateBoard } from "./validator";

describe("Boxiq game logic", () => {
  it("ships with a store-ready launch catalog", () => {
    expect(levels.length).toBeGreaterThanOrEqual(30);
  });

  it("accepts a completed level solution", () => {
    const level = levels[0];

    const result = validateBoard(level.solution, level, "en");

    expect(result.valid).toBe(true);
    expect(result.message).toContain("solved Boxiq");
  });

  it("ships only levels whose intended solution passes every rule", () => {
    levels.forEach((level) => {
      expect(validateBoard(level.solution, level, "en").valid, level.id).toBe(true);
    });
  });

  it("reports empty cells before other rule failures", () => {
    const level = levels[0];
    const board = level.solution.map((row) => [...row]);
    board[1][3] = 0;

    const result = validateBoard(board, level, "en");

    expect(result.valid).toBe(false);
    expect(result.message).toBe("Row 2, column 4 is still empty. Fill every box first.");
  });

  it("scores solved levels with mistake and hint penalties", () => {
    expect(calculateStars(0, 0)).toBe(3);
    expect(calculateStars(1, 0)).toBe(2);
    expect(calculateStars(0, 1)).toBe(2);
    expect(calculateStars(1, 1)).toBe(2);
    expect(calculateStars(2, 0)).toBe(1);
    expect(calculateStars(0, 2)).toBe(1);
  });
});
