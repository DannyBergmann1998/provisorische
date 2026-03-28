"use client";

import { Sun, Moon } from "lucide-react";
import { useDarkMode } from "@/lib/dark-mode-context";

export function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative p-2 text-gray-600 dark:text-[#A0A0A0] hover:text-black dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
