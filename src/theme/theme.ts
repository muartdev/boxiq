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
      background: "#F5F0E8",
      card: "#FFFDF8",
      cardStrong: "#ECE5DA",
      text: "#151A16",
      muted: "#766F66",
      border: "#DDD3C5",
      accent: "#214F3B",
      accentSoft: "#DDE9DF",
      danger: "#A5483D",
      shadow: "#151A16",
      fixedCell: "#E6DED1",
      emptyDot: "#B8AA98"
    }
  },
  dark: {
    mode: "dark",
    colors: {
      background: "#07111F",
      card: "#101C2D",
      cardStrong: "#17263A",
      text: "#F6FAFF",
      muted: "#94A7BC",
      border: "#22344D",
      accent: "#61D7F2",
      accentSoft: "#123648",
      danger: "#FF8A7A",
      shadow: "#000000",
      fixedCell: "#1D3048",
      emptyDot: "#526780"
    }
  }
};
