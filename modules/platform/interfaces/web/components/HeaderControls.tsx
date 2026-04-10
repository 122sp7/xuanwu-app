"use client";

/**
 * HeaderControls – platform interfaces/web component.
 * Composes shell header utility controls: language switch, theme toggle, notification bell.
 */

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "../../../subdomains/identity";
import { NotificationBell } from "../../../subdomains/notification";
import { Button } from "@ui-shadcn/ui/button";
import { TranslationSwitcher } from "./TranslationSwitcher";

const THEME_KEY = "xuanwu_theme";

export function HeaderControls() {
  const { state: authState } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  const recipientId = authState.user?.id ?? "";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  return (
    <div className="flex items-center gap-2">
      <TranslationSwitcher />

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

      <NotificationBell recipientId={recipientId} />
    </div>
  );
}
