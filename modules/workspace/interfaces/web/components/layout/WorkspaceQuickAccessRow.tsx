"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { useRef } from "react";

import type { WorkspaceQuickAccessItem } from "../navigation/workspace-quick-access";

interface WorkspaceQuickAccessRowProps {
  items: WorkspaceQuickAccessItem[];
  pathname: string;
  currentPanel: string | null;
  currentWorkspaceTab: string | null;
  workspaceSettingsHref: string;
  isActiveRoute: (href: string) => boolean;
}

export function WorkspaceQuickAccessRow({
  items,
  pathname,
  currentPanel,
  currentWorkspaceTab,
  workspaceSettingsHref,
  isActiveRoute,
}: WorkspaceQuickAccessRowProps) {
  const quickAccessDragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    didDrag: boolean;
  } | null>(null);

  const suppressQuickAccessClickRef = useRef(false);

  if (items.length === 0) {
    return null;
  }

  function handleQuickAccessPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const container = event.currentTarget;
    if (container.scrollWidth <= container.clientWidth) {
      return;
    }

    quickAccessDragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: container.scrollLeft,
      didDrag: false,
    };
  }

  function handleQuickAccessPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const dragState = quickAccessDragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    if (!dragState.didDrag && Math.abs(deltaX) > 4) {
      dragState.didDrag = true;
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }

    if (!dragState.didDrag) {
      return;
    }

    event.preventDefault();
    event.currentTarget.scrollLeft = dragState.startScrollLeft - deltaX;
  }

  function finishQuickAccessPointer(event: React.PointerEvent<HTMLDivElement>) {
    const dragState = quickAccessDragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (dragState.didDrag) {
      suppressQuickAccessClickRef.current = true;
      window.setTimeout(() => {
        suppressQuickAccessClickRef.current = false;
      }, 0);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    quickAccessDragStateRef.current = null;
  }

  function handleQuickAccessItemClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!suppressQuickAccessClickRef.current) {
      return;
    }

    suppressQuickAccessClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  function handleQuickAccessDragStart(event: React.DragEvent<HTMLAnchorElement>) {
    event.preventDefault();
  }

  return (
    <div className="shrink-0 border-b border-border/30 px-2 py-2">
      <div className="flex items-center gap-1">
        <div
          className="min-w-0 flex-1 cursor-grab overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing"
          onPointerDown={handleQuickAccessPointerDown}
          onPointerMove={handleQuickAccessPointerMove}
          onPointerUp={finishQuickAccessPointer}
          onPointerCancel={finishQuickAccessPointer}
        >
          <div className="flex w-max items-center gap-1 pr-1 select-none">
            {items.map((item) => {
              const active = item.isActive?.(pathname, {
                panel: currentPanel,
                tab: currentWorkspaceTab,
              }) ?? isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  onClick={handleQuickAccessItemClick}
                  onDragStart={handleQuickAccessDragStart}
                  draggable={false}
                  className={`flex size-7 shrink-0 items-center justify-center rounded-md transition ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  <span className="sr-only">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        {workspaceSettingsHref ? (
          <Link
            href={workspaceSettingsHref}
            aria-label="工作區設定"
            aria-current={currentPanel === "settings" ? "page" : undefined}
            onClick={handleQuickAccessItemClick}
            onDragStart={handleQuickAccessDragStart}
            draggable={false}
            className={`ml-auto flex size-7 items-center justify-center rounded-md transition ${
              currentPanel === "settings"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <Settings className="size-3.5" />
            <span className="sr-only">工作區設定</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
