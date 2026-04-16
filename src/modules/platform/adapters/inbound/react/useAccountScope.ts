"use client";

/**
 * useAccountScope — platform inbound adapter (React).
 *
 * Canonical hook for reading the active account scope in the src/ layer.
 * Aliases useApp() from the platform module.
 *
 * Returns: { state: AppState, dispatch: Dispatch<AppAction> }
 */

export { useApp as useAccountScope } from "@/modules/platform/api/ui";

export type {
  AppState,
  AppAction,
  AppContextValue,
} from "@/modules/platform/api/ui";
