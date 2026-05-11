import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "forest" | "ocean";

const VALID_THEMES: Theme[] = ["light", "dark", "forest", "ocean"];

function isValidTheme(v: unknown): v is Theme {
  return VALID_THEMES.includes(v as Theme);
}

const ALL_THEME_CLASSES = ["theme-light", "dark", "theme-forest", "theme-ocean"] as const;

const THEME_CLASS: Record<Theme, string> = {
  light:  "theme-light",
  dark:   "dark",           // keeps Tailwind dark: variant working
  forest: "theme-forest",
  ocean:  "theme-ocean",
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey);
    return isValidTheme(stored) ? stored : defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    ALL_THEME_CLASSES.forEach(cls => root.classList.remove(cls));
    root.classList.add(THEME_CLASS[theme]);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
