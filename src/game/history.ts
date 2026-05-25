import { cloneGrid } from "./levels";
import type { CellValue, MoveSnapshot } from "./types";

const MAX_HISTORY = 40;

export function createSnapshot(
  board: CellValue[][],
  mistakes: number,
  hintsUsed: number,
  hintedCells: `${number}-${number}`[],
  seconds = 0
): MoveSnapshot {
  return {
    board: cloneGrid(board),
    mistakes,
    hintsUsed,
    seconds,
    hintedCells: [...hintedCells]
  };
}

export function pushSnapshot(history: MoveSnapshot[], snapshot: MoveSnapshot): MoveSnapshot[] {
  const next = [...history, snapshot];
  return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
}

export function popSnapshot(history: MoveSnapshot[]): MoveSnapshot | undefined {
  return history.at(-1);
}

export function canUndo(history: MoveSnapshot[]): boolean {
  return history.length > 0;
}
