import type { CellValue, Locale, Relation } from "./types";

export type Issue = {
  type: "empty" | "row_balance" | "column_balance" | "three_consecutive" | "clue" | "solution_mismatch";
  message: string;
  row?: number;
  col?: number;
  axis?: "row" | "column";
  index?: number;
  relationIndex?: number;
};

export type FullValidationResult = {
  isComplete: boolean;
  isValid: boolean;
  mistakes: Issue[];
  clueErrors: Issue[];
  rowErrors: Issue[];
  columnErrors: Issue[];
};

export function isBoardComplete(board: CellValue[][]): boolean {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === 0) {
        return false;
      }
    }
  }
  return true;
}

function rowBalanceOverflowMessage(locale: Locale, row: number, filled: number, hollow: number): string {
  return locale === "tr"
    ? `Satır ${row + 1} dengesiz: ${filled} dolu, ${hollow} boş. En fazla 3 adet olabilir.`
    : `Row ${row + 1} is out of balance: ${filled} filled and ${hollow} hollow. No symbol can appear more than 3 times.`;
}

function rowBalanceCompleteMessage(locale: Locale, row: number, filled: number, hollow: number): string {
  return locale === "tr"
    ? `Satır ${row + 1} tamamlandı ama dengesiz: ${filled} dolu, ${hollow} boş. 3 dolu ve 3 boş olmalı.`
    : `Row ${row + 1} is complete but unbalanced: ${filled} filled and ${hollow} hollow. It must end with 3 and 3.`;
}

function columnBalanceOverflowMessage(locale: Locale, col: number, filled: number, hollow: number): string {
  return locale === "tr"
    ? `Sütun ${col + 1} dengesiz: ${filled} dolu, ${hollow} boş. En fazla 3 adet olabilir.`
    : `Column ${col + 1} is out of balance: ${filled} filled and ${hollow} hollow. No symbol can appear more than 3 times.`;
}

function columnBalanceCompleteMessage(locale: Locale, col: number, filled: number, hollow: number): string {
  return locale === "tr"
    ? `Sütun ${col + 1} tamamlandı ama dengesiz: ${filled} dolu, ${hollow} boş. 3 dolu ve 3 boş olmalı.`
    : `Column ${col + 1} is complete but unbalanced: ${filled} filled and ${hollow} hollow. It must end with 3 and 3.`;
}

function rowThreeMessage(locale: Locale, row: number): string {
  return locale === "tr"
    ? `Satır ${row + 1}'de üç adet ardışık aynı sembol var.`
    : `Row ${row + 1} has three identical symbols in a row.`;
}

function columnThreeMessage(locale: Locale, col: number): string {
  return locale === "tr"
    ? `Sütun ${col + 1}'de üç adet üst üste aynı sembol var.`
    : `Column ${col + 1} has three identical symbols stacked together.`;
}

function clueMessage(locale: Locale, clueType: "=" | "×"): string {
  if (clueType === "=") {
    return locale === "tr"
      ? `Eşitlik (=) ipucu ihlal edildi. Hücreler aynı olmalı.`
      : `The = clue is broken. Those two cells must match.`;
  }

  return locale === "tr"
    ? `Farklılık (×) ipucu ihlal edildi. Hücreler farklı olmalı.`
    : `The × clue is broken. Those two cells must be different.`;
}

export function checkRowBalance(board: CellValue[][], locale: Locale = "tr"): Issue[] {
  const issues: Issue[] = [];
  for (let r = 0; r < board.length; r++) {
    let filled = 0;
    let hollow = 0;
    let hasEmpty = false;
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === 1) filled++;
      else if (board[r][c] === 2) hollow++;
      else if (board[r][c] === 0) hasEmpty = true;
    }
    if (filled > 3 || hollow > 3) {
      issues.push({
        type: "row_balance",
        index: r,
        axis: "row",
        message: rowBalanceOverflowMessage(locale, r, filled, hollow)
      });
    } else if (!hasEmpty && (filled !== 3 || hollow !== 3)) {
      issues.push({
        type: "row_balance",
        index: r,
        axis: "row",
        message: rowBalanceCompleteMessage(locale, r, filled, hollow)
      });
    }
  }
  return issues;
}

export function checkColumnBalance(board: CellValue[][], locale: Locale = "tr"): Issue[] {
  const issues: Issue[] = [];
  const size = board.length > 0 ? board[0].length : 6;
  for (let c = 0; c < size; c++) {
    let filled = 0;
    let hollow = 0;
    let hasEmpty = false;
    for (let r = 0; r < board.length; r++) {
      if (board[r][c] === 1) filled++;
      else if (board[r][c] === 2) hollow++;
      else if (board[r][c] === 0) hasEmpty = true;
    }
    if (filled > 3 || hollow > 3) {
      issues.push({
        type: "column_balance",
        index: c,
        axis: "column",
        message: columnBalanceOverflowMessage(locale, c, filled, hollow)
      });
    } else if (!hasEmpty && (filled !== 3 || hollow !== 3)) {
      issues.push({
        type: "column_balance",
        index: c,
        axis: "column",
        message: columnBalanceCompleteMessage(locale, c, filled, hollow)
      });
    }
  }
  return issues;
}

export function checkNoThreeConsecutive(board: CellValue[][], locale: Locale = "tr"): Issue[] {
  const issues: Issue[] = [];
  // Row checks
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c <= board[r].length - 3; c++) {
      const v1 = board[r][c];
      const v2 = board[r][c + 1];
      const v3 = board[r][c + 2];
      if (v1 !== 0 && v1 === v2 && v2 === v3) {
        issues.push({
          type: "three_consecutive",
          index: r,
          col: c,
          axis: "row",
          message: rowThreeMessage(locale, r)
        });
      }
    }
  }
  // Column checks
  const size = board.length > 0 ? board[0].length : 6;
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= board.length - 3; r++) {
      const v1 = board[r][c];
      const v2 = board[r + 1][c];
      const v3 = board[r + 2][c];
      if (v1 !== 0 && v1 === v2 && v2 === v3) {
        issues.push({
          type: "three_consecutive",
          index: c,
          row: r,
          axis: "column",
          message: columnThreeMessage(locale, c)
        });
      }
    }
  }
  return issues;
}

export function checkClues(board: CellValue[][], clues: Relation[], locale: Locale = "tr"): Issue[] {
  const issues: Issue[] = [];
  clues.forEach((clue, idx) => {
    const v1 = board[clue.r1][clue.c1];
    const v2 = board[clue.r2][clue.c2];
    if (v1 !== 0 && v2 !== 0) {
      if (clue.type === "=" && v1 !== v2) {
        issues.push({
          type: "clue",
          relationIndex: idx,
          message: clueMessage(locale, "=")
        });
      } else if (clue.type === "×" && v1 === v2) {
        issues.push({
          type: "clue",
          relationIndex: idx,
          message: clueMessage(locale, "×")
        });
      }
    }
  });
  return issues;
}

export function calculateStars({
  mistakes,
  usedHints
}: {
  mistakes: number;
  usedHints: number;
  elapsedSeconds?: number;
  difficulty?: string;
}): number {
  if (mistakes === 0 && usedHints === 0) {
    return 3;
  }
  if (mistakes <= 1 && usedHints <= 1) {
    return 2;
  }
  return 1;
}

export function validateBoard(board: CellValue[][], clues: Relation[], locale: Locale = "tr"): FullValidationResult {
  const rowErrors = checkRowBalance(board, locale);
  const columnErrors = checkColumnBalance(board, locale);
  const consecutiveErrors = checkNoThreeConsecutive(board, locale);
  const clueErrors = checkClues(board, clues, locale);

  const mistakes = [...rowErrors, ...columnErrors, ...consecutiveErrors, ...clueErrors];
  const isComplete = isBoardComplete(board);
  const isValid = mistakes.length === 0;

  return {
    isComplete,
    isValid,
    mistakes,
    clueErrors,
    rowErrors,
    columnErrors
  };
}
