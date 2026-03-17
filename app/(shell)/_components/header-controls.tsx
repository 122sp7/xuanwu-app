"use client";

import { Bell, Languages, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/ui/shadcn/ui/button";

const LOCALE_KEY = "xuanwu_locale";
const THEME_KEY = "xuanwu_theme";

export function HeaderControls() {
  const [locale, setLocale] = useState(() => {
    if (typeof window === "undefined") return "en";
    return window.localStorage.getItem(LOCALE_KEY) ?? "en";
  });
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(LOCALE_KEY, locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function toggleLocale() {
    setLocale((current) => (current === "en" ? "zh-TW" : "en"));
  }

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={toggleLocale}
        aria-label="Toggle language"
        className="text-muted-foreground"
      >
        <Languages className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="text-muted-foreground"
      >
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Open notifications"
        className="relative text-muted-foreground"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-[10px] font-semibold leading-4 text-primary-foreground">
          0
        </span>
      </Button>
    </div>
  );
}
