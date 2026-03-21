/**
 * @package shared-hooks
 * Cross-cutting React hooks and Zustand app state.
 *
 * This package provides application-level React hooks that are not
 * owned by any specific domain module. For domain-specific hooks,
 * import from the module's interfaces layer.
 *
 * All exports are "use client" compatible — do not import in Server Components.
 *
 * Usage:
 *   import { useAppStore } from "@shared-hooks";
 */

"use client";

import { create } from "zustand";

// ─── App Store ────────────────────────────────────────────────────────────────

interface AppState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
