import { describe, expect, it } from "vitest";

import { levels } from "./levels";
import { buildSmartHint, buildSmartHintForCell } from "./hints";

describe("smart hints", () => {
  it("prefers relation-based explanations when a clue touches the hinted cell", () => {
    const level = levels[0];
    const board = level.grid.map((row) => [...row]);
    const fixedCells = level.grid.map((row) => row.map((value) => value !== 0));

    const hint = buildSmartHint(board, level, fixedCells, "en");

    expect(hint).toBeDefined();
    expect(hint?.message).toContain("= clue");
  });

  it("falls back to row or column balance explanations when no relation applies", () => {
    const level = levels.find((entry) => entry.id === "balance-lesson")!;
    const board = level.solution.map((row) => [...row]);
    const fixedCells = level.grid.map((row) => row.map((value) => value !== 0));

    board[4][0] = 0;

    const hint = buildSmartHint(board, level, fixedCells, "en");

    expect(hint).toBeDefined();
    expect(hint?.message).toMatch(/Row|Column/);
  });

  it("can target a selected cell instead of auto-picking the first mismatch", () => {
    const level = levels[0];
    const board = level.grid.map((row) => [...row]);
    const fixedCells = level.grid.map((row) => row.map((value) => value !== 0));

    const hint = buildSmartHintForCell(board, level, fixedCells, "en", 2, 3);

    expect(hint).toBeDefined();
    expect(hint?.row).toBe(2);
    expect(hint?.col).toBe(3);
  });
});
