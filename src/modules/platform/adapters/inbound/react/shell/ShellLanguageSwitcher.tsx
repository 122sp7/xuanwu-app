"use client";

/**
 * ShellLanguageSwitcher — platform inbound adapter (React).
 *
 * Lets users explicitly override the display language.
 *
 * Firebase Hosting i18n rewrites honour the `firebase-language-override`
 * cookie to select the content locale. Setting this cookie and reloading
 * the page asks Firebase Hosting to serve the matching localized files
 * (configured under hosting.i18n in firebase.json).
 *
 * Supported locales are defined in SUPPORTED_LOCALES below.
 * Add entries here when new locale directories are added to /localized-files.
 *
 * Rendered by ShellHeaderControls in the top-right header area.
 */

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@packages";
import { Languages } from "lucide-react";
import { useState } from "react";

// ── Locale catalogue ──────────────────────────────────────────────────────────

const SUPPORTED_LOCALES = [
  { code: "en", label: "English" },
  { code: "zh-TW", label: "繁體中文" },
] as const;

type LocaleCode = (typeof SUPPORTED_LOCALES)[number]["code"];

const COOKIE_NAME = "firebase-language-override";
const STORAGE_KEY = "xuanwu:locale";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStoredLocale(): LocaleCode | null {
  if (typeof document === "undefined") return null;
  // Check cookie first (Firebase Hosting override), then localStorage fallback.
  const cookieMatch = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (cookieMatch) {
    const value = cookieMatch.split("=")[1];
    if (SUPPORTED_LOCALES.some((l) => l.code === value)) {
      return value as LocaleCode;
    }
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LOCALES.some((l) => l.code === stored)) {
    return stored as LocaleCode;
  }
  return null;
}

function applyLocale(code: LocaleCode): void {
  // Set the Firebase Hosting language override cookie (1 year, root path).
  document.cookie = `${COOKIE_NAME}=${code}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  // Also persist in localStorage as a UI fallback.
  localStorage.setItem(STORAGE_KEY, code);
  // Reload so Firebase Hosting can serve the correct locale variant.
  window.location.reload();
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ShellLanguageSwitcher(): React.ReactElement {
  // Lazy initializer: reads from storage on first client render only.
  // typeof window guard ensures SSR safety.
  const [activeLocale, setActiveLocale] = useState<LocaleCode | null>(
    () => (typeof window !== "undefined" ? getStoredLocale() : null),
  );

  function handleSelect(code: LocaleCode): void {
    if (code === activeLocale) return;
    applyLocale(code);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        aria-label="切換語言"
        title="切換語言"
        className="flex size-7 items-center justify-center rounded text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Languages className="size-4" />
        <span className="sr-only">切換語言</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            顯示語言
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SUPPORTED_LOCALES.map((locale) => (
            <DropdownMenuItem
              key={locale.code}
              onClick={() => handleSelect(locale.code)}
              className={
                activeLocale === locale.code
                  ? "font-semibold text-primary focus:text-primary"
                  : "cursor-pointer"
              }
            >
              {locale.label}
              {activeLocale === locale.code && (
                <span className="ml-auto text-xs text-primary">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ) as React.ReactElement;
}
