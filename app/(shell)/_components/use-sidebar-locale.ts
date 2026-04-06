"use client";

import { useState, useEffect } from "react";

export interface SidebarLocaleBundle {
  workspace?: {
    groups?: Record<string, string>;
    tabLabels?: Record<string, string>;
  };
}

/**
 * Loads the sidebar locale bundle from the public localized-files directory.
 * Returns null until the bundle is loaded or if loading fails (callers fall back to hardcoded labels).
 */
export function useSidebarLocale(): SidebarLocaleBundle | null {
  const [localeBundle, setLocaleBundle] = useState<SidebarLocaleBundle | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSidebarLocale() {
      const isZhHant =
        typeof navigator !== "undefined" &&
        /^(zh-TW|zh-HK|zh-MO|zh-Hant)/i.test(navigator.language);
      const localeFile = isZhHant ? "zh-TW.json" : "en.json";

      try {
        const response = await fetch(`/localized-files/${localeFile}`, { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as SidebarLocaleBundle;
        if (!cancelled) {
          setLocaleBundle(data);
        }
      } catch {
        // Keep fallback labels when localization files are unavailable.
      }
    }

    void loadSidebarLocale();

    return () => {
      cancelled = true;
    };
  }, []);

  return localeBundle;
}
