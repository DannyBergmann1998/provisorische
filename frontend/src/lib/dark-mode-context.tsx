"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type DarkModeContextType = {
  isDark: boolean;
  toggleDarkMode: () => void;
};

// Default value for SSR
const defaultValue: DarkModeContextType = {
  isDark: false,
  toggleDarkMode: () => {},
};

const DarkModeContext = createContext<DarkModeContextType>(defaultValue);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize from localStorage on client
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = saved ? saved === "true" : prefersDark;

    setIsDark(shouldBeDark);
    updateDarkMode(shouldBeDark);
    setIsMounted(true);
  }, []);

  const updateDarkMode = (value: boolean) => {
    if (typeof document !== "undefined") {
      if (value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    localStorage.setItem("darkMode", String(value));
  };

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      updateDarkMode(newValue);
      return newValue;
    });
  };

  // Always provide context value, even during SSR
  const value: DarkModeContextType = {
    isDark: isMounted ? isDark : false,
    toggleDarkMode,
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    // Fallback for SSR or missing provider
    return { isDark: false, toggleDarkMode: () => {} };
  }
  return context;
}
