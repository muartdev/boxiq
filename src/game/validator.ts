import { formatTime } from "../i18n/translations";
import type { CellValue, Level, Locale, ValidationResult } from "./types";

function symbolCounts(values: CellValue[]): { filled: number; hollow: number } {
  return values.reduce(
    (counts, value) => ({
      filled: counts.filled + (value === 1 ? 1 : 0),
      hollow: counts.hollow + (value === 2 ? 1 : 0)
    }),
    { filled: 0, hollow: 0 }
  );
}

function emptyMessage(locale: Locale, row: number, col: number): string {
  return locale === "tr"
    ? `Satır ${row + 1}, sütun ${col + 1} hâlâ boş. Önce tüm kutuları doldur.`
    : `Row ${row + 1}, column ${col + 1} is still empty. Fill every box first.`;
}

function rowBalanceMessage(locale: Locale, row: number, filled: number, hollow: number): string {
  return locale === "tr"
    ? `${row + 1}. satırda ${filled} dolu ve ${hollow} boş var. Her satır 3 dolu + 3 boş olmalı.`
    : `Row ${row + 1} has ${filled} filled and ${hollow} hollow circles. Each row needs 3 and 3.`;
}

function columnBalanceMessage(
  locale: Locale,
  col: number,
  filled: number,
  hollow: number
): string {
  return locale === "tr"
    ? `${col + 1}. sütunda ${filled} dolu ve ${hollow} boş var. Her sütun 3 dolu + 3 boş olmalı.`
    : `Column ${col + 1} has ${filled} filled and ${hollow} hollow circles. Each column needs 3 and 3.`;
}

function threeMessage(locale: Locale, axis: "row" | "column", index: number): string {
  if (locale === "tr") {
    return axis === "row"
      ? `${index + 1}. satırda aynı sembolden üç tane yan yana var.`
      : `${index + 1}. sütunda aynı sembolden üç tane üst üste var.`;
  }

  return axis === "row"
    ? `Row ${index + 1} has three same symbols touching.`
    : `Column ${index + 1} has three same symbols touching.`;
}

function relationMessage(locale: Locale, type: "=" | "×"): string {
  if (type === "=") {
    return locale === "tr"
      ? "= ipucu hatalı. Bu iki komşu hücre aynı olmalı."
      : "The = clue is wrong. These two neighboring cells must match.";
  }

  return locale === "tr"
    ? "× ipucu hatalı. Bu iki komşu hücre farklı olmalı."
    : "The × clue is wrong. These two neighboring cells must be opposite.";
}

function solutionMessage(locale: Locale): string {
  return locale === "tr"
    ? "Kurallar doğru görünüyor ama çözüm hedef kutuyla eşleşmiyor."
    : "The rules look right, but this is not the intended Boxiq solution.";
}

export function solvedMessage(locale: Locale, seconds = 0): string {
  return locale === "tr"
    ? `Mükemmel. Boxiq'i ${formatTime(seconds)} sürede çözdün.`
    : `Perfect. You solved Boxiq in ${formatTime(seconds)}.`;
}

function hasThree(values: CellValue[]): boolean {
  for (let index = 0; index <= values.length - 3; index += 1) {
    const value = values[index];
    if (value !== 0 && value === values[index + 1] && value === values[index + 2]) {
      return true;
    }
  }

  return false;
}

export function validateBoard(
  board: CellValue[][],
  level: Level,
  locale: Locale,
  seconds?: number
): ValidationResult {
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      if (board[row][col] === 0) {
        return { valid: false, message: emptyMessage(locale, row, col) };
      }
    }
  }

  for (let row = 0; row < board.length; row += 1) {
    const counts = symbolCounts(board[row]);
    if (counts.filled !== 3 || counts.hollow !== 3) {
      return {
        valid: false,
        message: rowBalanceMessage(locale, row, counts.filled, counts.hollow)
      };
    }
  }

  for (let col = 0; col < 6; col += 1) {
    const values = board.map((row) => row[col]);
    const counts = symbolCounts(values);
    if (counts.filled !== 3 || counts.hollow !== 3) {
      return {
        valid: false,
        message: columnBalanceMessage(locale, col, counts.filled, counts.hollow)
      };
    }
  }

  for (let row = 0; row < board.length; row += 1) {
    if (hasThree(board[row])) {
      return { valid: false, message: threeMessage(locale, "row", row) };
    }
  }

  for (let col = 0; col < 6; col += 1) {
    const values = board.map((row) => row[col]);
    if (hasThree(values)) {
      return { valid: false, message: threeMessage(locale, "column", col) };
    }
  }

  for (const relation of level.relations) {
    const first = board[relation.r1][relation.c1];
    const second = board[relation.r2][relation.c2];
    const matches = first === second;
    if ((relation.type === "=" && !matches) || (relation.type === "×" && matches)) {
      return { valid: false, message: relationMessage(locale, relation.type) };
    }
  }

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      if (board[row][col] !== level.solution[row][col]) {
        return { valid: false, message: solutionMessage(locale) };
      }
    }
  }

  return { valid: true, message: solvedMessage(locale, seconds) };
}
