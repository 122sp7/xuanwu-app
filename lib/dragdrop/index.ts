/**
 * @module lib/dragdrop
 * Thin wrapper for Atlaskit Pragmatic Drag and Drop contracts.
 */

export { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
export {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
export {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
export { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";

export type DragDropConfig = {
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDrop?: (source: unknown, target: unknown) => void;
};
