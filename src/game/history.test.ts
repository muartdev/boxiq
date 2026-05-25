import { describe, expect, it } from "vitest";

import type { CellValue, MoveSnapshot } from "./types";
import { canUndo, createSnapshot, popSnapshot, pushSnapshot } from "./history";

const board: CellValue[][] = [
  [1, 0],
  [2, 1]
];

describe("Boxiq move history", () => {
  it("stores snapshots before a move and can pop the latest state", () => {
    const baseSnapshot = createSnapshot(board, 0, 1, ["1-1"], 2);
    const nextHistory = pushSnapshot([], baseSnapshot);

    expect(canUndo(nextHistory)).toBe(true);
    expect(popSnapshot(nextHistory)?.seconds).toBe(2);
    expect(popSnapshot(nextHistory)?.hintsUsed).toBe(1);
  });

  it("limits history depth so repeated taps do not grow forever", () => {
    const many = Array.from({ length: 45 }, (_, index): MoveSnapshot =>
      createSnapshot(board, 0, 0, [], index)
    );

    const limited = many.reduce(pushSnapshot, [] as MoveSnapshot[]);

    expect(limited).toHaveLength(40);
    expect(limited[0].seconds).toBe(5);
  });
});
