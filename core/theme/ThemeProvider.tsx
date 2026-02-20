"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}>({
  theme: "light",
  setTheme: () => {},
  toggle: () => {},
});

function readThemeFromDom(): Theme | null {
  if (typeof document === "undefined") return null;
  const root = document.documentElement;
  if (root.classList.contains("theme-dark")) return "dark";
  if (root.classList.contains("theme-light")) return "light";
  return null;
}

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("theme");
  if (stored === "dark") return "dark";
  if (stored === "light") return "light";
  return null;
}

function applyTheme(nextTheme: Theme) {
  const root = document.documentElement;
  root.classList.remove("theme-light", "theme-dark");
  root.classList.add(`theme-${nextTheme}`);
  root.style.colorScheme = nextTheme;
  localStorage.setItem("theme", nextTheme);
  document.cookie = `theme=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return readStoredTheme() ?? readThemeFromDom() ?? "light";
  });

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
