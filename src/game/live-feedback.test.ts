import { describe, expect, it } from "vitest";

import { findInstantConflicts } from "./live-feedback";
import { levels } from "./levels";

describe("instant conflict feedback", () => {
  it("flags a horizontal three-in-a-row on the changed cell", () => {
    const level = levels[0];
    const board = level.grid.map((row) => [...row]);

    board[0][0] = 1;
    board[0][1] = 1;
    board[0][2] = 1;

    const conflicts = findInstantConflicts(board, level, 0, 2);

    expect(conflicts).toContain("0-2");
  });

  it("flags relation conflicts when both related cells are filled incorrectly", () => {
    const level = levels[0];
    const board = level.grid.map((row) => [...row]);
    const relation = level.relations[0];

    board[relation.r1][relation.c1] = 1;
    board[relation.r2][relation.c2] = 2;

    const conflicts = findInstantConflicts(board, level, relation.r1, relation.c1);

    expect(conflicts).toContain(`${relation.r1}-${relation.c1}`);
    expect(conflicts).toContain(`${relation.r2}-${relation.c2}`);
  });
});
