import React from "react";

import { Moon, SunDim } from "lucide-react";

import { useTheme } from "../../context/theme/useTheme";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      className={`relative w-8.5 h-4.5 rounded-full transition-all duration-300 cursor-pointer
          ${isDark ? "bg-zinc-800 border-zinc-600" : "bg-zinc-200 border-zinc-300"}`}
    >
      <span
        className={`absolute top-px left-px p-0.5 rounded-full flex items-center justify-center shadow-sm transition-all duration-300
            ${isDark ? "translate-x-4 bg-zinc-900 text-violet-400" : "translate-x-0 bg-white text-amber-400"}`}
      >
        {isDark ? <Moon size={12} /> : <SunDim size={12} />}
      </span>
    </button>
  );
}
