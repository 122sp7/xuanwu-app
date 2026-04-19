/**
 * @module infra/virtual
 * Headless list and grid virtualization via TanStack Virtual v3.
 *
 * useVirtualizer — element-scoped virtualizer; provide getScrollElement pointing
 *   to a scrollable DOM container.
 * useWindowVirtualizer — window-scoped virtualizer for full-page lists; use
 *   scrollMargin to account for fixed headers or offsets.
 *
 * Pattern: getVirtualItems() → render only visible items; getTotalSize() → set
 *   container height to maintain scrollbar accuracy.
 *
 * Alias: @infra/virtual
 */

// ─── React Virtualizers ───────────────────────────────────────────────────────

export { useVirtualizer } from "@tanstack/react-virtual";
export { useWindowVirtualizer } from "@tanstack/react-virtual";

// ─── Types ────────────────────────────────────────────────────────────────────

export type {
  VirtualItem,
  VirtualizerOptions,
  Virtualizer,
  Range,
} from "@tanstack/react-virtual";
