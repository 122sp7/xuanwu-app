/**
 * @package shared-utils
 * Pure utility functions and app-wide constants.
 *
 * This package provides stateless helper functions and configuration
 * constants used throughout the application. All exports are pure
 * (no side effects) and safe to import from any layer.
 *
 * Usage:
 *   import { formatDate, generateId, APP_NAME, PAGINATION_DEFAULTS } from "@shared-utils";
 */

// ─── Re-export utility functions (canonical source: shared-types) ─────────────
export { formatDate, generateId } from "@shared-types";

// ─── App-wide constants ───────────────────────────────────────────────────────

export const APP_NAME = "Xuanwu App";

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
} as const;
