import type { ThemeMode } from "../game/types";

export type BoxiqTheme = {
  mode: ThemeMode;
  colors: {
    background: string;
    card: string;
    cardStrong: string;
    text: string;
    muted: string;
    border: string;
    accent: string;
    accentSoft: string;
    danger: string;
    shadow: string;
    fixedCell: string;
    emptyDot: string;
  };
};

export const themes: Record<ThemeMode, BoxiqTheme> = {
  light: {
    mode: "light",
    colors: {
      background: "#F6F0E6",
      card: "#FFFCF5",
      cardStrong: "#E9DFD0",
      text: "#111713",
      muted: "#756F66",
      border: "#D8CDBD",
      accent: "#1F5A42",
      accentSoft: "#DCE9DF",
      danger: "#B54A3E",
      shadow: "#111713",
      fixedCell: "#E4DACB",
      emptyDot: "#CFC5B6"
    }
  },
  dark: {
    mode: "dark",
    colors: {
      background: "#111713",
      card: "#18221B",
      cardStrong: "#222E25",
      text: "#FFFDF8",
      muted: "#A79E92",
      border: "#334237",
      accent: "#52AC88",
      accentSoft: "#214335",
      danger: "#E0695B",
      shadow: "#070A08",
      fixedCell: "#2A382F",
      emptyDot: "#495E50"
    }
  }
};
