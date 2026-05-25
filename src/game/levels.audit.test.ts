import { describe, expect, it } from "vitest";

import { levels } from "./levels";
import { validateBoard } from "./validator";

const BOARD_SIZE = 6;

function inBounds(value: number): boolean {
  return value >= 0 && value < BOARD_SIZE;
}

describe("level catalog audit", () => {
  it("keeps every level structurally valid and playable", () => {
    const seenIds = new Set<string>();

    levels.forEach((level) => {
      expect(seenIds.has(level.id), `duplicate id: ${level.id}`).toBe(false);
      seenIds.add(level.id);

      expect(level.names.en.length).toBeGreaterThan(0);
      expect(level.names.tr.length).toBeGreaterThan(0);
      expect(level.chapter.en.length).toBeGreaterThan(0);
      expect(level.chapter.tr.length).toBeGreaterThan(0);
      expect(level.difficulty.en.length).toBeGreaterThan(0);
      expect(level.difficulty.tr.length).toBeGreaterThan(0);

      expect(level.grid.length, `${level.id} grid row count`).toBe(BOARD_SIZE);
      expect(level.solution.length, `${level.id} solution row count`).toBe(BOARD_SIZE);

      level.grid.forEach((row, rowIndex) => {
        expect(row.length, `${level.id} grid col count row ${rowIndex}`).toBe(BOARD_SIZE);
      });

      level.solution.forEach((row, rowIndex) => {
        expect(row.length, `${level.id} solution col count row ${rowIndex}`).toBe(BOARD_SIZE);
      });

      level.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          expect([0, 1, 2]).toContain(cell);

          if (cell !== 0) {
            expect(cell, `${level.id} fixed cell mismatch at ${rowIndex}-${colIndex}`).toBe(
              level.solution[rowIndex][colIndex]
            );
          }
        });
      });

      const seenRelations = new Set<string>();
      level.relations.forEach((relation, relationIndex) => {
        expect(inBounds(relation.r1), `${level.id} relation ${relationIndex} r1`).toBe(true);
        expect(inBounds(relation.c1), `${level.id} relation ${relationIndex} c1`).toBe(true);
        expect(inBounds(relation.r2), `${level.id} relation ${relationIndex} r2`).toBe(true);
        expect(inBounds(relation.c2), `${level.id} relation ${relationIndex} c2`).toBe(true);

        const manhattanDistance =
          Math.abs(relation.r1 - relation.r2) + Math.abs(relation.c1 - relation.c2);
        expect(manhattanDistance, `${level.id} relation ${relationIndex} adjacency`).toBe(1);

        const key = [relation.r1, relation.c1, relation.r2, relation.c2].join(":");
        expect(seenRelations.has(key), `${level.id} duplicate relation ${key}`).toBe(false);
        seenRelations.add(key);
      });

      expect(validateBoard(level.solution, level, "en").valid, `${level.id} intended solution`).toBe(true);
    });
  });
});
