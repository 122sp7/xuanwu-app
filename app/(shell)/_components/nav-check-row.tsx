"use client";

/**
 * nav-check-row.tsx
 * Owns: CheckRow (static) and WorkspaceCheckRow (drag-and-drop) row components
 *   used inside the CustomizeNavigationDialog.
 */

import { GripVertical } from "lucide-react";
import { useEffect, useRef } from "react";

import {
  attachClosestEdge,
  combine,
  draggable,
  DropIndicator,
  dropTargetForElements,
  extractClosestEdge,
  type Edge,
} from "@lib-dragdrop";
import { Checkbox } from "@ui-shadcn/ui/checkbox";
import { Label } from "@ui-shadcn/ui/label";

// ── CheckRow ───────────────────────────────────────────────────────────────

interface CheckRowProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function CheckRow({ id, label, checked, onToggle }: CheckRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-muted/50">
      <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing" />
      <Checkbox
        id={`nav-check-${id}`}
        checked={checked}
        onCheckedChange={onToggle}
        className="shrink-0"
      />
      <Label
        htmlFor={`nav-check-${id}`}
        className="cursor-pointer select-none text-sm font-normal"
      >
        {label}
      </Label>
    </div>
  );
}

// ── WorkspaceCheckRow ──────────────────────────────────────────────────────

interface WorkspaceCheckRowProps {
  id: string;
  label: string;
  checked: boolean;
  activeDropEdge: Edge | null;
  isDropTarget: boolean;
  onToggle: () => void;
  onDragOverItem: (targetId: string, edge: Edge | null) => void;
  onDragLeaveItem: (targetId: string) => void;
  onReorder: (sourceId: string, targetId: string, edge: Edge | null) => void;
}

export function WorkspaceCheckRow({
  id,
  label,
  checked,
  activeDropEdge,
  isDropTarget,
  onToggle,
  onDragOverItem,
  onDragLeaveItem,
  onReorder,
}: WorkspaceCheckRowProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({ type: "workspace-nav-item", itemId: id }),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) =>
          source.data.type === "workspace-nav-item" && source.data.itemId !== id,
        getData: ({ input, element: dropElement }) =>
          attachClosestEdge(
            { type: "workspace-nav-item", itemId: id },
            { input, element: dropElement, allowedEdges: ["top", "bottom"] },
          ),
        onDragEnter: ({ self }) => { onDragOverItem(id, extractClosestEdge(self.data)); },
        onDrag: ({ self }) => { onDragOverItem(id, extractClosestEdge(self.data)); },
        onDragLeave: () => { onDragLeaveItem(id); },
        onDrop: ({ source, self }) => {
          const sourceId =
            typeof source.data.itemId === "string" ? source.data.itemId : null;
          if (!sourceId || sourceId === id) {
            onDragLeaveItem(id);
            return;
          }
          onReorder(sourceId, id, extractClosestEdge(self.data));
          onDragLeaveItem(id);
        },
      }),
    );
  }, [id, onDragLeaveItem, onDragOverItem, onReorder]);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-muted/50">
        <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing" />
        <Checkbox
          id={`nav-check-${id}`}
          checked={checked}
          onCheckedChange={onToggle}
          className="shrink-0"
        />
        <Label
          htmlFor={`nav-check-${id}`}
          className="cursor-pointer select-none text-sm font-normal"
        >
          {label}
        </Label>
      </div>

      {isDropTarget && activeDropEdge && (
        <div className="pointer-events-none absolute inset-x-2">
          <DropIndicator edge={activeDropEdge} />
        </div>
      )}
    </div>
  );
}
