"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "twitter-analytics-theme";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const skipNextSync = useRef(true);

  // On mount: read saved theme or system preference and apply to <html>
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const stored = localStorage.getItem(STORAGE_KEY) as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "dark" || (stored !== "light" && prefersDark);

    setIsDark(initial);
    if (initial) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  // When user toggles: sync class to <html> and persist (skip first run so we don't overwrite mount)
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem(STORAGE_KEY, "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem(STORAGE_KEY, "light");
    }
  }, [isDark, mounted]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((value) => !value)}
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
      aria-label="Toggle color theme"
    >
      <span className="relative inline-flex h-4 w-8 items-center rounded-full bg-gray-200 dark:bg-gray-700">
        <span
          className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform ${
            isDark ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </span>
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

