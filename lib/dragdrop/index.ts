/**
 * @module lib/dragdrop
 * Thin wrapper for Atlaskit Pragmatic Drag and Drop.
 *
 * Provides a single import path for all drag-and-drop primitives:
 *   - Element drag adapter     — draggable, dropTargetForElements, monitorForElements
 *   - External drag adapter    — dropTargetForExternal, monitorForExternal
 *   - Utilities                — combine, reorder, preventUnhandled, once
 *   - Preview helpers          — setCustomNativeDragPreview, disableNativeDragPreview, etc.
 *   - Hitbox                   — closest-edge (flat lists), list-item / tree-item (reorderable trees)
 *   - Drop indicator           — DropIndicator React component for box targets
 *
 * All exports are client-side.  Do not use in Server Components.
 *
 * Usage:
 *   import { draggable, dropTargetForElements, DropIndicator } from "@/lib/dragdrop";
 *   import { attachClosestEdge, extractClosestEdge } from "@/lib/dragdrop";
 */

// ── Combine ────────────────────────────────────────────────────────────────
export { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

// ── Element adapter ────────────────────────────────────────────────────────
export {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

// ── Element preview helpers ────────────────────────────────────────────────
export { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
export { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
export { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
export { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";

// ── Utilities ──────────────────────────────────────────────────────────────
export { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
export { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";
export { once } from "@atlaskit/pragmatic-drag-and-drop/once";

// ── Hitbox — flat closest-edge (cards, columns) ───────────────────────────
export {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

// ── Hitbox — list / tree item (reorderable lists and trees) ───────────────
export {
  attachInstruction,
  extractInstruction,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/list-item";

// ── Drop indicator React component ────────────────────────────────────────
// Note: imports CSS at runtime; only use inside Client Components.
export { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
