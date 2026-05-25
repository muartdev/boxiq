import type { CellValue, Level, LocalizedText, Relation, RelationType } from "./types";

export const BASE: CellValue[][] = [
  [1, 1, 2, 1, 2, 2],
  [1, 2, 2, 1, 1, 2],
  [2, 1, 1, 2, 2, 1],
  [2, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2],
  [2, 2, 1, 2, 1, 1]
];

type Given = [number, number];
type RelationPair = [number, number, number, number];

const starter: LocalizedText = { en: "Starter", tr: "Başlangıç" };
const classic: LocalizedText = { en: "Classic", tr: "Klasik" };
const expert: LocalizedText = { en: "Expert", tr: "Uzman" };
const master: LocalizedText = { en: "Master", tr: "Usta" };

export function cloneGrid(grid: CellValue[][]): CellValue[][] {
  return grid.map((row) => [...row]);
}

export function invertGrid(grid: CellValue[][]): CellValue[][] {
  return grid.map((row) => row.map((cell) => (cell === 1 ? 2 : cell === 2 ? 1 : 0)));
}

export function swapRows(grid: CellValue[][], rowA: number, rowB: number): CellValue[][] {
  const copy = cloneGrid(grid);
  const temp = copy[rowA];
  copy[rowA] = copy[rowB];
  copy[rowB] = temp;
  return copy;
}

export function swapCols(grid: CellValue[][], colA: number, colB: number): CellValue[][] {
  return grid.map((row) => {
    const next = [...row];
    const temp = next[colA];
    next[colA] = next[colB];
    next[colB] = temp;
    return next;
  });
}

export function makeGrid(solution: CellValue[][], givens: Given[]): CellValue[][] {
  const grid = solution.map((row) => row.map(() => 0 as CellValue));

  givens.forEach(([row, col]) => {
    grid[row][col] = solution[row][col];
  });

  return grid;
}

export function makeRelations(
  solution: CellValue[][],
  relationPairs: RelationPair[]
): Relation[] {
  return relationPairs.map(([r1, c1, r2, c2]) => ({
    r1,
    c1,
    r2,
    c2,
    type: solution[r1][c1] === solution[r2][c2] ? "=" : ("×" as RelationType)
  }));
}

function createLevel(
  id: string,
  chapter: LocalizedText,
  names: LocalizedText,
  difficulty: LocalizedText,
  solution: CellValue[][],
  givens: Given[],
  relationPairs: RelationPair[]
): Level {
  return {
    id,
    chapter,
    names,
    difficulty,
    solution: cloneGrid(solution),
    grid: makeGrid(solution, givens),
    relations: makeRelations(solution, relationPairs)
  };
}

const inverted = invertGrid(BASE);
const classicA = cloneGrid(BASE);
const classicB = cloneGrid(inverted);
const expertA = cloneGrid(BASE);
const expertB = cloneGrid(inverted);

export const levels: Level[] = [
  createLevel(
    "daily-01",
    starter,
    { en: "Daily Puzzle #01", tr: "Günlük Bulmaca #01" },
    { en: "Easy", tr: "Kolay" },
    BASE,
    [
      [0, 0],
      [0, 5],
      [1, 1],
      [1, 4],
      [2, 2],
      [3, 3],
      [4, 1],
      [4, 4],
      [5, 0],
      [5, 5]
    ],
    [
      [0, 0, 0, 1],
      [1, 1, 1, 2],
      [2, 2, 2, 3],
      [3, 3, 4, 3],
      [4, 4, 5, 4]
    ]
  ),
  createLevel(
    "balance-lesson",
    starter,
    { en: "Balance Lesson", tr: "Denge Dersi" },
    { en: "Easy", tr: "Kolay" },
    inverted,
    [
      [0, 1],
      [0, 4],
      [1, 0],
      [1, 3],
      [2, 1],
      [3, 4],
      [4, 2],
      [4, 5],
      [5, 1],
      [5, 3]
    ],
    [
      [0, 1, 0, 2],
      [1, 3, 1, 4],
      [2, 1, 3, 1],
      [3, 4, 4, 4],
      [5, 2, 5, 3]
    ]
  ),
  createLevel(
    "cross-clues",
    classic,
    { en: "Cross Clues", tr: "Çapraz İpuçları" },
    { en: "Medium", tr: "Orta" },
    classicA,
    [
      [0, 0],
      [0, 3],
      [1, 2],
      [1, 5],
      [2, 0],
      [2, 4],
      [3, 1],
      [4, 3],
      [5, 2]
    ],
    [
      [0, 0, 1, 0],
      [0, 3, 1, 3],
      [2, 0, 2, 1],
      [3, 1, 3, 2],
      [4, 3, 5, 3],
      [5, 1, 5, 2]
    ]
  ),
  createLevel(
    "silent-rows",
    classic,
    { en: "Silent Rows", tr: "Sessiz Satırlar" },
    { en: "Medium", tr: "Orta" },
    classicB,
    [
      [0, 2],
      [0, 5],
      [1, 1],
      [2, 3],
      [2, 5],
      [3, 0],
      [3, 4],
      [4, 2],
      [5, 1]
    ],
    [
      [0, 2, 0, 3],
      [1, 1, 2, 1],
      [2, 3, 3, 3],
      [3, 4, 4, 4],
      [4, 1, 4, 2],
      [5, 0, 5, 1]
    ]
  ),
  createLevel(
    "narrow-corridor",
    expert,
    { en: "Narrow Corridor", tr: "Dar Koridor" },
    { en: "Hard", tr: "Zor" },
    expertA,
    [
      [0, 0],
      [0, 4],
      [1, 2],
      [2, 1],
      [2, 5],
      [3, 3],
      [4, 0],
      [5, 4]
    ],
    [
      [0, 0, 0, 1],
      [1, 2, 1, 3],
      [2, 1, 3, 1],
      [2, 5, 3, 5],
      [4, 0, 5, 0],
      [5, 3, 5, 4]
    ]
  ),
  createLevel(
    "final-box",
    expert,
    { en: "Final Box", tr: "Final Kutusu" },
    { en: "Hard", tr: "Zor" },
    expertB,
    [
      [0, 2],
      [1, 0],
      [1, 5],
      [2, 3],
      [3, 1],
      [4, 4],
      [5, 0],
      [5, 5]
    ],
    [
      [0, 2, 0, 3],
      [1, 0, 2, 0],
      [1, 4, 1, 5],
      [2, 3, 3, 3],
      [3, 1, 4, 1],
      [4, 4, 5, 4],
      [5, 0, 5, 1]
    ]
  ),
  createLevel(
    "double-cross",
    expert,
    { en: "Double Cross", tr: "Çift Çarpım" },
    { en: "Hard", tr: "Zor" },
    BASE,
    [
      [0, 4],
      [1, 1],
      [1, 3],
      [2, 0],
      [3, 5],
      [4, 2],
      [5, 1]
    ],
    [
      [0, 4, 0, 5],
      [1, 1, 2, 1],
      [1, 3, 1, 4],
      [2, 0, 3, 0],
      [4, 2, 4, 3],
      [5, 1, 5, 2]
    ]
  ),
  createLevel(
    "blind-spot",
    master,
    { en: "Blind Spot", tr: "Kör Nokta" },
    { en: "Expert", tr: "Uzman" },
    inverted,
    [
      [0, 0],
      [1, 4],
      [2, 2],
      [3, 3],
      [4, 1],
      [5, 5]
    ],
    [
      [0, 0, 0, 1],
      [1, 4, 2, 4],
      [2, 2, 2, 3],
      [3, 2, 3, 3],
      [4, 1, 5, 1],
      [5, 4, 5, 5]
    ]
  ),
  createLevel(
    "symmetry-trap",
    master,
    { en: "Symmetry Trap", tr: "Simetri Tuzağı" },
    { en: "Expert", tr: "Uzman" },
    BASE,
    [
      [0, 2],
      [1, 5],
      [2, 1],
      [3, 4],
      [4, 0],
      [5, 3]
    ],
    [
      [0, 2, 1, 2],
      [1, 4, 1, 5],
      [2, 1, 2, 2],
      [3, 4, 4, 4],
      [4, 0, 5, 0],
      [5, 2, 5, 3]
    ]
  ),
  createLevel(
    "last-balance",
    master,
    { en: "Last Balance", tr: "Son Denge" },
    { en: "Expert", tr: "Uzman" },
    inverted,
    [
      [0, 5],
      [1, 2],
      [2, 4],
      [3, 0],
      [4, 3],
      [5, 1]
    ],
    [
      [0, 4, 0, 5],
      [1, 2, 1, 3],
      [2, 4, 3, 4],
      [3, 0, 4, 0],
      [4, 2, 4, 3],
      [5, 1, 5, 2]
    ]
  ),
  createLevel(
    "mirror-pair",
    starter,
    { en: "Mirror Pair", tr: "Ayna Çifti" },
    { en: "Easy", tr: "Kolay" },
    BASE,
    [
      [0, 1],
      [0, 4],
      [1, 3],
      [2, 0],
      [3, 5],
      [4, 2],
      [5, 4]
    ],
    [
      [0, 1, 0, 2],
      [1, 3, 1, 4],
      [2, 0, 3, 0],
      [3, 4, 3, 5],
      [4, 2, 5, 2]
    ]
  ),
  createLevel(
    "morning-balance",
    starter,
    { en: "Morning Balance", tr: "Sabah Dengesi" },
    { en: "Easy", tr: "Kolay" },
    inverted,
    [
      [0, 0],
      [0, 3],
      [1, 2],
      [2, 4],
      [3, 1],
      [4, 5],
      [5, 2]
    ],
    [
      [0, 0, 1, 0],
      [0, 3, 0, 4],
      [1, 2, 2, 2],
      [3, 1, 3, 2],
      [4, 4, 4, 5]
    ]
  ),
  createLevel(
    "equal-steps",
    starter,
    { en: "Equal Steps", tr: "Eş Adımlar" },
    { en: "Easy", tr: "Kolay" },
    BASE,
    [
      [0, 5],
      [1, 1],
      [1, 4],
      [2, 2],
      [3, 0],
      [4, 3],
      [5, 1]
    ],
    [
      [0, 4, 0, 5],
      [1, 1, 1, 2],
      [1, 4, 2, 4],
      [3, 0, 4, 0],
      [4, 3, 5, 3]
    ]
  ),
  createLevel(
    "soft-corners",
    starter,
    { en: "Soft Corners", tr: "Yumuşak Köşeler" },
    { en: "Easy", tr: "Kolay" },
    inverted,
    [
      [0, 2],
      [1, 0],
      [2, 5],
      [3, 3],
      [4, 1],
      [5, 4]
    ],
    [
      [0, 2, 0, 3],
      [1, 0, 2, 0],
      [2, 4, 2, 5],
      [3, 3, 4, 3],
      [5, 3, 5, 4]
    ]
  ),
  createLevel(
    "quiet-match",
    starter,
    { en: "Quiet Match", tr: "Sessiz Eşleşme" },
    { en: "Easy", tr: "Kolay" },
    BASE,
    [
      [0, 0],
      [1, 5],
      [2, 1],
      [3, 4],
      [4, 2],
      [5, 5]
    ],
    [
      [0, 0, 0, 1],
      [1, 4, 1, 5],
      [2, 1, 2, 2],
      [3, 4, 4, 4],
      [4, 2, 5, 2]
    ]
  ),
  createLevel(
    "clue-bridge",
    classic,
    { en: "Clue Bridge", tr: "İpucu Köprüsü" },
    { en: "Medium", tr: "Orta" },
    inverted,
    [
      [0, 4],
      [1, 1],
      [2, 3],
      [2, 5],
      [3, 0],
      [4, 2],
      [5, 4]
    ],
    [
      [0, 4, 0, 5],
      [1, 1, 2, 1],
      [2, 3, 2, 4],
      [3, 0, 4, 0],
      [4, 2, 4, 3],
      [5, 3, 5, 4]
    ]
  ),
  createLevel(
    "narrow-equals",
    classic,
    { en: "Narrow Equals", tr: "Dar Eşitlik" },
    { en: "Medium", tr: "Orta" },
    BASE,
    [
      [0, 1],
      [1, 4],
      [2, 0],
      [3, 2],
      [4, 5],
      [5, 3]
    ],
    [
      [0, 1, 0, 2],
      [1, 3, 1, 4],
      [2, 0, 2, 1],
      [3, 2, 4, 2],
      [4, 4, 4, 5]
    ]
  ),
  createLevel(
    "twin-column",
    classic,
    { en: "Twin Column", tr: "İkiz Sütun" },
    { en: "Medium", tr: "Orta" },
    inverted,
    [
      [0, 5],
      [1, 2],
      [2, 4],
      [3, 1],
      [4, 0],
      [5, 3]
    ],
    [
      [0, 4, 0, 5],
      [1, 2, 2, 2],
      [2, 4, 3, 4],
      [3, 1, 3, 2],
      [4, 0, 5, 0]
    ]
  ),
  createLevel(
    "hidden-pair",
    classic,
    { en: "Hidden Pair", tr: "Gizli Çift" },
    { en: "Medium", tr: "Orta" },
    BASE,
    [
      [0, 3],
      [1, 0],
      [2, 2],
      [3, 5],
      [4, 1],
      [5, 4]
    ],
    [
      [0, 2, 0, 3],
      [1, 0, 1, 1],
      [2, 2, 3, 2],
      [3, 4, 3, 5],
      [4, 1, 5, 1]
    ]
  ),
  createLevel(
    "center-weave",
    classic,
    { en: "Center Weave", tr: "Merkez Örgüsü" },
    { en: "Medium", tr: "Orta" },
    inverted,
    [
      [0, 0],
      [1, 3],
      [2, 1],
      [3, 4],
      [4, 2],
      [5, 5]
    ],
    [
      [0, 0, 1, 0],
      [1, 3, 2, 3],
      [2, 1, 2, 2],
      [3, 3, 3, 4],
      [4, 2, 5, 2]
    ]
  ),
  createLevel(
    "lock-chain",
    expert,
    { en: "Lock Chain", tr: "Kilit Zinciri" },
    { en: "Hard", tr: "Zor" },
    BASE,
    [
      [0, 2],
      [1, 5],
      [2, 0],
      [3, 3],
      [4, 1],
      [5, 4]
    ],
    [
      [0, 2, 0, 3],
      [1, 4, 1, 5],
      [2, 0, 3, 0],
      [3, 3, 4, 3],
      [4, 1, 4, 2],
      [5, 3, 5, 4]
    ]
  ),
  createLevel(
    "echo-turn",
    expert,
    { en: "Echo Turn", tr: "Yankı Dönüşü" },
    { en: "Hard", tr: "Zor" },
    inverted,
    [
      [0, 1],
      [1, 3],
      [2, 5],
      [3, 0],
      [4, 4],
      [5, 2]
    ],
    [
      [0, 1, 0, 2],
      [1, 3, 2, 3],
      [2, 4, 2, 5],
      [3, 0, 4, 0],
      [4, 4, 5, 4],
      [5, 2, 5, 3]
    ]
  ),
  createLevel(
    "double-link",
    expert,
    { en: "Double Link", tr: "Çift Bağ" },
    { en: "Hard", tr: "Zor" },
    BASE,
    [
      [0, 4],
      [1, 1],
      [2, 3],
      [3, 5],
      [4, 0],
      [5, 2]
    ],
    [
      [0, 4, 0, 5],
      [1, 1, 2, 1],
      [2, 3, 3, 3],
      [3, 4, 3, 5],
      [4, 0, 5, 0],
      [5, 2, 5, 3]
    ]
  ),
  createLevel(
    "split-lantern",
    expert,
    { en: "Split Lantern", tr: "Bölünmüş Fener" },
    { en: "Hard", tr: "Zor" },
    inverted,
    [
      [0, 0],
      [1, 4],
      [2, 2],
      [3, 1],
      [4, 5],
      [5, 3]
    ],
    [
      [0, 0, 0, 1],
      [1, 3, 1, 4],
      [2, 2, 2, 3],
      [3, 1, 4, 1],
      [4, 4, 4, 5],
      [5, 2, 5, 3]
    ]
  ),
  createLevel(
    "iron-balance",
    expert,
    { en: "Iron Balance", tr: "Demir Denge" },
    { en: "Hard", tr: "Zor" },
    BASE,
    [
      [0, 5],
      [1, 0],
      [2, 4],
      [3, 2],
      [4, 1],
      [5, 3]
    ],
    [
      [0, 4, 0, 5],
      [1, 0, 2, 0],
      [2, 4, 2, 5],
      [3, 2, 4, 2],
      [4, 1, 5, 1],
      [5, 3, 5, 4]
    ]
  ),
  createLevel(
    "zero-margin",
    master,
    { en: "Zero Margin", tr: "Sıfır Pay" },
    { en: "Expert", tr: "Uzman" },
    inverted,
    [
      [0, 3],
      [1, 1],
      [2, 5],
      [3, 0],
      [4, 2],
      [5, 4]
    ],
    [
      [0, 3, 0, 4],
      [1, 1, 1, 2],
      [2, 4, 2, 5],
      [3, 0, 4, 0],
      [4, 2, 4, 3],
      [5, 4, 5, 5]
    ]
  ),
  createLevel(
    "deep-pattern",
    master,
    { en: "Deep Pattern", tr: "Derin Desen" },
    { en: "Expert", tr: "Uzman" },
    BASE,
    [
      [0, 1],
      [1, 5],
      [2, 0],
      [3, 4],
      [4, 2],
      [5, 3]
    ],
    [
      [0, 1, 0, 2],
      [1, 4, 1, 5],
      [2, 0, 2, 1],
      [3, 4, 3, 5],
      [4, 2, 5, 2],
      [5, 3, 5, 4]
    ]
  ),
  createLevel(
    "still-logic",
    master,
    { en: "Still Logic", tr: "Durgun Mantık" },
    { en: "Expert", tr: "Uzman" },
    inverted,
    [
      [0, 5],
      [1, 2],
      [2, 3],
      [3, 1],
      [4, 4],
      [5, 0]
    ],
    [
      [0, 4, 0, 5],
      [1, 2, 1, 3],
      [2, 3, 3, 3],
      [3, 1, 4, 1],
      [4, 3, 4, 4],
      [5, 0, 5, 1]
    ]
  ),
  createLevel(
    "last-thread",
    master,
    { en: "Last Thread", tr: "Son İz" },
    { en: "Expert", tr: "Uzman" },
    BASE,
    [
      [0, 2],
      [1, 4],
      [2, 1],
      [3, 5],
      [4, 0],
      [5, 3]
    ],
    [
      [0, 2, 0, 3],
      [1, 4, 2, 4],
      [2, 1, 2, 2],
      [3, 4, 3, 5],
      [4, 0, 5, 0],
      [5, 2, 5, 3]
    ]
  ),
  createLevel(
    "midnight-grid",
    master,
    { en: "Midnight Grid", tr: "Gece Yarısı Izgarası" },
    { en: "Expert", tr: "Uzman" },
    inverted,
    [
      [0, 0],
      [1, 3],
      [2, 5],
      [3, 2],
      [4, 1],
      [5, 4]
    ],
    [
      [0, 0, 1, 0],
      [1, 3, 1, 4],
      [2, 4, 2, 5],
      [3, 2, 4, 2],
      [4, 1, 5, 1],
      [5, 4, 5, 5]
    ]
  )
];
