// @atlaskit/pragmatic-drag-and-drop wrapper
// Install: npm install @atlaskit/pragmatic-drag-and-drop

export type DragDropConfig = {
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDrop?: (source: unknown, target: unknown) => void;
};
