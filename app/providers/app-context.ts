"use client";

/**
 * app-context.ts — backward-compat re-export shim.
 * Canonical source: modules/platform/interfaces/web/providers/app-context.ts
 */

export type {
  ActiveAccount,
  AppState,
  AppAction,
  AppContextValue,
} from "@/modules/platform/api";
export { AppContext } from "@/modules/platform/api";
