"use client";

/**
 * Module: translation-switcher.tsx
 * Purpose: provide a reusable locale switch control for shell-level UI.
 * Responsibilities: persist locale preference and sync html lang attribute.
 * Constraints: keep state client-side and avoid coupling to business modules.
 */

import { Languages } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/ui/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/ui/shadcn/ui/dropdown-menu";

const LOCALE_STORAGE_KEY = "xuanwu_locale";

const localeOptions = [
  { value: "en", label: "English" },
  { value: "zh-TW", label: "繁體中文" },
] as const;

type LocaleValue = (typeof localeOptions)[number]["value"];

function isLocaleValue(value: string | null): value is LocaleValue {
  return value === "en" || value === "zh-TW";
}

export function TranslationSwitcher() {
  const [locale, setLocale] = useState<LocaleValue>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const storedValue = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocaleValue(storedValue) ? storedValue : "en";
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Switch language"
          className="text-muted-foreground"
        >
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale} onValueChange={(value) => {
          if (isLocaleValue(value)) {
            setLocale(value);
          }
        }}>
          {localeOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
