import type { CellValue, Level, Locale } from "./types";

type SmartHint = {
  row: number;
  col: number;
  value: CellValue;
  message: string;
};

function symbolName(locale: Locale, value: CellValue): string {
  if (locale === "tr") {
    return value === 1 ? "dolu" : "boş halka";
  }

  return value === 1 ? "filled" : "hollow";
}

function relationMessage(locale: Locale, value: CellValue, relationType: "=" | "×"): string {
  const symbol = symbolName(locale, value);

  if (relationType === "=") {
    return locale === "tr"
      ? `Bu hücre ${symbol} olmalı. = ipucu yüzünden komşusuyla aynı kalmalı.`
      : `This square should be ${symbol}. Its = clue means it must match its neighbor.`;
  }

  return locale === "tr"
    ? `Bu hücre ${symbol} olmalı. × ipucu yüzünden komşusunun tersi olmalı.`
    : `This square should be ${symbol}. Its × clue means it must be opposite its neighbor.`;
}

function rowBalanceMessage(locale: Locale, row: number, value: CellValue): string {
  const symbol = symbolName(locale, value);
  return locale === "tr"
    ? `Bu hücre ${symbol} olmalı. ${row + 1}. satır hâlâ dengeyi tamamlamadı.`
    : `This square should be ${symbol}. Row ${row + 1} still needs that symbol for balance.`;
}

function columnBalanceMessage(locale: Locale, col: number, value: CellValue): string {
  const symbol = symbolName(locale, value);
  return locale === "tr"
    ? `Bu hücre ${symbol} olmalı. ${col + 1}. sütun hâlâ dengeyi tamamlamadı.`
    : `This square should be ${symbol}. Column ${col + 1} still needs that symbol for balance.`;
}

export function buildSmartHint(
  board: CellValue[][],
  level: Level,
  fixedCells: boolean[][],
  locale: Locale
): SmartHint | undefined {
  for (let row = 0; row < level.solution.length; row += 1) {
    for (let col = 0; col < level.solution[row].length; col += 1) {
      if (fixedCells[row][col] || board[row][col] === level.solution[row][col]) {
        continue;
      }

      const value = level.solution[row][col];
      const related = level.relations.find(
        (relation) =>
          (relation.r1 === row && relation.c1 === col) || (relation.r2 === row && relation.c2 === col)
      );

      if (related) {
        return {
          row,
          col,
          value,
          message: relationMessage(locale, value, related.type)
        };
      }

      const rowValues = board[row];
      const rowCount = rowValues.filter((entry) => entry === value).length;
      if (rowCount < 3) {
        return {
          row,
          col,
          value,
          message: rowBalanceMessage(locale, row, value)
        };
      }

      return {
        row,
        col,
        value,
        message: columnBalanceMessage(locale, col, value)
      };
    }
  }

  return undefined;
}
