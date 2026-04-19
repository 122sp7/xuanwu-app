/**
 * @module ui-dnd
 * Drag-and-drop primitives via Atlassian Pragmatic DnD.
 *
 * Element adapter — draggable, dropTargetForElements, monitorForElements for
 *   attaching drag/drop behaviour to DOM elements imperatively via effect cleanup.
 * combine — merges multiple cleanup functions into one; essential when attaching
 *   multiple adapters in a single useEffect.
 * reorder — pure array reorder helper after a drop.
 * Hitbox — attachClosestEdge / extractClosestEdge for edge-aware drop targets
 *   (e.g. insert before/after, tree indentation).
 * reorderWithEdge — pure array reorder accounting for closest drop edge (top/bottom/left/right).
 * DropIndicator — React visual component rendering drop position indicator line.
 *
 * "use client" required for all consumers — uses browser drag API internally.
 *
 * Alias: @ui-dnd
 */

// ─── Element Adapter ──────────────────────────────────────────────────────────

export {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

// ─── Utilities ────────────────────────────────────────────────────────────────

export { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
export { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";

// ─── Hitbox ───────────────────────────────────────────────────────────────────

export {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

export type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

export { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";

// ─── Auto Scroll ─────────────────────────────────────────────────────────────

export { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";

// ─── Visual Indicators ────────────────────────────────────────────────────────

export { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
export { DropIndicator as TreeDropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/tree-item";
