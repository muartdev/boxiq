import type { CellValue, Level } from "./types";

type CellKey = `${number}-${number}`;

function addKey(set: Set<CellKey>, row: number, col: number) {
  set.add(`${row}-${col}`);
}

function symbolCount(values: CellValue[], target: CellValue): number {
  return values.filter((value) => value === target).length;
}

export function findInstantConflicts(
  board: CellValue[][],
  level: Level,
  changedRow: number,
  changedCol: number
): CellKey[] {
  const conflicts = new Set<CellKey>();
  const value = board[changedRow]?.[changedCol];

  if (!value) {
    return [];
  }

  const rowValues = board[changedRow];
  const columnValues = board.map((row) => row[changedCol]);

  if (symbolCount(rowValues, value) > 3 || symbolCount(columnValues, value) > 3) {
    addKey(conflicts, changedRow, changedCol);
  }

  for (let index = Math.max(0, changedCol - 2); index <= Math.min(3, changedCol); index += 1) {
    if (rowValues[index] !== 0 && rowValues[index] === rowValues[index + 1] && rowValues[index] === rowValues[index + 2]) {
      addKey(conflicts, changedRow, index);
      addKey(conflicts, changedRow, index + 1);
      addKey(conflicts, changedRow, index + 2);
    }
  }

  for (let index = Math.max(0, changedRow - 2); index <= Math.min(3, changedRow); index += 1) {
    if (
      board[index][changedCol] !== 0 &&
      board[index][changedCol] === board[index + 1][changedCol] &&
      board[index][changedCol] === board[index + 2][changedCol]
    ) {
      addKey(conflicts, index, changedCol);
      addKey(conflicts, index + 1, changedCol);
      addKey(conflicts, index + 2, changedCol);
    }
  }

  level.relations.forEach((relation) => {
    const touchesChanged =
      (relation.r1 === changedRow && relation.c1 === changedCol) ||
      (relation.r2 === changedRow && relation.c2 === changedCol);

    if (!touchesChanged) {
      return;
    }

    const first = board[relation.r1][relation.c1];
    const second = board[relation.r2][relation.c2];
    if (first === 0 || second === 0) {
      return;
    }

    const matches = first === second;
    const invalid = (relation.type === "=" && !matches) || (relation.type === "×" && matches);
    if (invalid) {
      addKey(conflicts, relation.r1, relation.c1);
      addKey(conflicts, relation.r2, relation.c2);
    }
  });

  return Array.from(conflicts);
}
