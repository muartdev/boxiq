import {
  createContext,
  createElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import type { GameSettings, Locale, ThemeMode } from "../game/types";
import {
  defaultGameSettings,
  getGameSettings,
  getLanguage,
  getTheme,
  setGameSettings as persistGameSettings,
  setLanguage as persistLanguage,
  setTheme as persistTheme
} from "../storage/progressStorage";
import { syncDailyReminder } from "../notifications/dailyReminder";
import { BoxiqTheme, themes } from "../theme/theme";

type SettingsContextValue = {
  locale: Locale;
  themeMode: ThemeMode;
  theme: BoxiqTheme;
  gameSettings: GameSettings;
  tutorialVisible: boolean;
  setLocale: (locale: Locale) => Promise<void>;
  setThemeMode: (theme: ThemeMode) => Promise<void>;
  updateGameSettings: (settings: Partial<GameSettings>) => Promise<void>;
  showTutorial: () => void;
  hideTutorial: () => void;
  loading: boolean;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");
  const [gameSettings, setGameSettingsState] = useState<GameSettings>(defaultGameSettings);
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      const [savedLocale, savedTheme, savedGameSettings] = await Promise.all([
        getLanguage(),
        getTheme(),
        getGameSettings()
      ]);
      if (active) {
        setLocaleState(savedLocale);
        setThemeModeState(savedTheme);
        setGameSettingsState(savedGameSettings);
        setTutorialVisible(!savedGameSettings.tutorialSeen);
        setLoading(false);
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading || !gameSettings.dailyReminderEnabled) {
      return;
    }

    void syncDailyReminder(true, locale);
  }, [gameSettings.dailyReminderEnabled, loading, locale]);

  const activeTheme = useMemo(() => {
    const baseTheme = themes[themeMode];
    if (!gameSettings.colorBlindMode) {
      return baseTheme;
    }

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        accent: themeMode === "light" ? "#1D4E89" : "#7CE0FF",
        accentSoft: themeMode === "light" ? "#DFEAF4" : "#12384C"
      }
    };
  }, [gameSettings.colorBlindMode, themeMode]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      locale,
      themeMode,
      theme: activeTheme,
      gameSettings,
      tutorialVisible,
      loading,
      setLocale: async (nextLocale) => {
        setLocaleState(nextLocale);
        await persistLanguage(nextLocale);
      },
      setThemeMode: async (nextTheme) => {
        setThemeModeState(nextTheme);
        await persistTheme(nextTheme);
      },
      updateGameSettings: async (settings) => {
        const nextSettings = { ...gameSettings, ...settings };
        setGameSettingsState(nextSettings);
        await persistGameSettings(nextSettings);
        if (settings.dailyReminderEnabled !== undefined) {
          const scheduled = await syncDailyReminder(settings.dailyReminderEnabled, locale);
          if (!scheduled && settings.dailyReminderEnabled) {
            const reverted = { ...nextSettings, dailyReminderEnabled: false };
            setGameSettingsState(reverted);
            await persistGameSettings(reverted);
          }
        }
        if (settings.tutorialSeen !== undefined && settings.tutorialSeen) {
          setTutorialVisible(false);
        }
      },
      showTutorial: () => {
        setTutorialVisible(true);
      },
      hideTutorial: () => {
        setTutorialVisible(false);
      }
    }),
    [activeTheme, gameSettings, loading, locale, themeMode, tutorialVisible]
  );

  return createContextProvider(SettingsContext, value, children);
}

function createContextProvider<T>(
  context: React.Context<T>,
  value: T,
  children: ReactNode
): React.ReactElement {
  return createElement(context.Provider, { value }, children);
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}
