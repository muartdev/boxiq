export type CellValue = 0 | 1 | 2;

export type RelationType = "=" | "×";

export type Locale = "tr" | "en";

export type ThemeMode = "light" | "dark";

export type MistakeLimitMode = "relaxed" | "normal" | "hard";

export type GameSettings = {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  timerEnabled: boolean;
  instantFeedbackEnabled: boolean;
  mistakeLimit: MistakeLimitMode;
  colorBlindMode: boolean;
  dailyReminderEnabled: boolean;
  tutorialSeen: boolean;
};

export type DailyHistoryEntry = {
  date: string;
  levelId: string;
  seconds: number;
  mistakes: number;
  hintsUsed: number;
  stars: number;
};

export type DailyStats = {
  lastDailyCompletedDate?: string;
  currentStreak: number;
  bestStreak: number;
  dailyBestTime?: number;
  dailyHistory: DailyHistoryEntry[];
};

export type AchievementId =
  | "first-solve"
  | "flawless"
  | "under-minute"
  | "no-hint"
  | "seven-day-streak";

export type Relation = {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  type: RelationType;
};

export type LocalizedText = {
  tr: string;
  en: string;
};

export type Level = {
  id: string;
  chapter: LocalizedText;
  names: LocalizedText;
  difficulty: LocalizedText;
  solution: CellValue[][];
  grid: CellValue[][];
  relations: Relation[];
};

export type ValidationResult = {
  valid: boolean;
  message: string;
};

export type LevelProgress = {
  bestTime?: number;
  completed?: boolean;
  bestStars?: number;
  bestMistakes?: number;
  bestHintsUsed?: number;
};

export type ProgressMap = Record<string, LevelProgress>;

export type MoveSnapshot = {
  board: CellValue[][];
  mistakes: number;
  hintsUsed: number;
  seconds: number;
  hintedCells: `${number}-${number}`[];
};

export type ResultSummary = {
  levelId: string;
  levelName: string;
  seconds: number;
  mistakes: number;
  hintsUsed: number;
  stars: number;
  isNewBestTime: boolean;
  isDaily: boolean;
  dailyStreak: number;
};

export type StatsSummary = {
  completedLevels: number;
  totalLevels: number;
  totalStars: number;
  completionRate: number;
  hintlessCompleted: number;
  bestTime?: number;
  currentStreak: number;
  bestStreak: number;
  dailyBestTime?: number;
  todayStatus?: DailyHistoryEntry;
  activeDaysThisWeek: number;
  difficultyProgress: Array<{
    difficulty: string;
    completed: number;
    total: number;
  }>;
  lastSevenDays: Array<{
    date: string;
    completed: boolean;
    stars?: number;
  }>;
};
