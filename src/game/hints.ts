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

function relationMessage(
  locale: Locale,
  value: CellValue,
  relationType: "=" | "×",
  row: number,
  col: number,
  rowNeed: number,
  columnNeed: number
): string {
  const symbol = symbolName(locale, value);
  const balanceTail =
    locale === "tr"
      ? ` ${row + 1}. satırda ${rowNeed}, ${col + 1}. sütunda ${columnNeed} tane daha ${symbol} yeri var.`
      : ` Row ${row + 1} and column ${col + 1} still need that symbol for balance.`;

  if (relationType === "=") {
    return locale === "tr"
      ? `Bu hücre ${symbol} olmalı. = ipucu yüzünden komşusuyla aynı kalmalı.${balanceTail}`
      : `This square should be ${symbol}. Its = clue means it must match its neighbor.${balanceTail}`;
  }

  return locale === "tr"
    ? `Bu hücre ${symbol} olmalı. × ipucu yüzünden komşusunun tersi olmalı.${balanceTail}`
    : `This square should be ${symbol}. Its × clue means it must be opposite its neighbor.${balanceTail}`;
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

function buildHintForCoordinates(
  board: CellValue[][],
  level: Level,
  fixedCells: boolean[][],
  locale: Locale,
  row: number,
  col: number
): SmartHint | undefined {
  if (fixedCells[row][col] || board[row][col] === level.solution[row][col]) {
    return undefined;
  }

  const value = level.solution[row][col];
  const rowNeed = 3 - board[row].filter((entry) => entry === value).length;
  const columnNeed = 3 - board.map((line) => line[col]).filter((entry) => entry === value).length;
  const related = level.relations.find(
    (relation) =>
      (relation.r1 === row && relation.c1 === col) || (relation.r2 === row && relation.c2 === col)
  );

  if (related) {
    return {
      row,
      col,
      value,
      message: relationMessage(locale, value, related.type, row, col, rowNeed, columnNeed)
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

export function buildSmartHintForCell(
  board: CellValue[][],
  level: Level,
  fixedCells: boolean[][],
  locale: Locale,
  row: number,
  col: number
): SmartHint | undefined {
  return buildHintForCoordinates(board, level, fixedCells, locale, row, col);
}

export function buildSmartHint(
  board: CellValue[][],
  level: Level,
  fixedCells: boolean[][],
  locale: Locale
): SmartHint | undefined {
  for (let row = 0; row < level.solution.length; row += 1) {
    for (let col = 0; col < level.solution[row].length; col += 1) {
      const hint = buildHintForCoordinates(board, level, fixedCells, locale, row, col);
      if (hint) {
        return hint;
      }
    }
  }

  return undefined;
}
