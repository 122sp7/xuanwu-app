"use client";

/**
 * ShellThemeToggle — platform inbound adapter (React).
 *
 * Toggles between light, dark, and system themes in the shell header.
 * Relies on ThemeProvider (next-themes) being mounted at the layout root.
 *
 * Rendered by ShellHeaderControls in the top-right header area.
 */

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ShellThemeToggle(): React.ReactElement {
  const { resolvedTheme, setTheme } = useTheme();

  function toggle() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={resolvedTheme === "dark" ? "切換至淺色模式" : "切換至深色模式"}
      title={resolvedTheme === "dark" ? "切換至淺色模式" : "切換至深色模式"}
      className="flex size-7 items-center justify-center rounded text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">
        {resolvedTheme === "dark" ? "切換至淺色模式" : "切換至深色模式"}
      </span>
    </button>
  ) as React.ReactElement;
}
