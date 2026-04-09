"use client";

/**
 * Module: customize-navigation-dialog.tsx
 * Purpose: Let users pick which nav items stay pinned in the secondary sidebar.
 * Responsibilities: dialog shell, section rendering, preference state management.
 * Constraints: UI-only; pure preference storage, no backend call.
 *   Data/constants/localStorage live in nav-preferences-data.ts.
 *   Row components live in nav-check-row.tsx.
 */

import { useMemo, useState, useEffect } from "react";

import { reorder, type Edge } from "@lib-dragdrop";

import { Button } from "@ui-shadcn/ui/button";
import { Checkbox } from "@ui-shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Separator } from "@ui-shadcn/ui/separator";

import { CheckRow, WorkspaceCheckRow } from "./nav-check-row";
import { type WorkspaceNavItem, WORKSPACE_NAV_ITEMS } from "@/modules/workspace/interfaces/api";
import {
  DIALOG_TEXT,
  ORGANIZATION_NAV_ITEMS,
  PERSONAL_ITEMS,
  readNavPreferences,
  writeNavPreferences,
  type NavPreferences,
  type SidebarLocaleBundle,
} from "./nav-preferences-data";

// Re-export the stable public surface so existing consumers (dashboard-sidebar,
// workspace-sidebar-section) don't need to change their import paths.
export type { NavPreferences };
export { readNavPreferences };

// ── Props ──────────────────────────────────────────────────────────────────

interface CustomizeNavigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPreferencesChange?: (prefs: NavPreferences) => void;
}

// ── Component ──────────────────────────────────────────────────────────────

export function CustomizeNavigationDialog({
  open,
  onOpenChange,
  onPreferencesChange,
}: CustomizeNavigationDialogProps) {
  const [prefs, setPrefs] = useState<NavPreferences>(() => readNavPreferences());
  const [dragTarget, setDragTarget] = useState<{ id: string; edge: Edge | null } | null>(null);

  const uiLocale = useMemo<"zh" | "en">(() => {
    if (typeof navigator === "undefined") return "zh";
    const language = navigator.language?.toLowerCase() ?? "";
    return language.startsWith("zh") ? "zh" : "en";
  }, []);

  const [localeBundle, setLocaleBundle] = useState<SidebarLocaleBundle | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const localeFile =
      uiLocale === "zh" ? "/localized-files/zh-TW.json" : "/localized-files/en.json";
    let canceled = false;
    fetch(localeFile)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load locale file: ${res.status}`);
        return res.json() as Promise<SidebarLocaleBundle>;
      })
      .then((json) => { if (!canceled) setLocaleBundle(json); })
      .catch(() => { if (!canceled) setLocaleBundle(null); });
    return () => { canceled = true; };
  }, [uiLocale]);

  const text = DIALOG_TEXT[uiLocale];

  const workspaceItemsById = useMemo(
    () => Object.fromEntries(WORKSPACE_NAV_ITEMS.map((item) => [item.id, item])),
    [],
  );

  const orderedWorkspaceItems = useMemo(
    () =>
      prefs.workspaceOrder
        .map((id) => workspaceItemsById[id])
        .filter((item): item is WorkspaceNavItem => item != null),
    [prefs.workspaceOrder, workspaceItemsById],
  );

  const getWorkspaceLabel = (item: WorkspaceNavItem) =>
    localeBundle?.workspace?.tabLabels?.[item.tabKey] ?? item.fallbackLabel;

  const getOrganizationLabel = (item: (typeof ORGANIZATION_NAV_ITEMS)[number]) =>
    uiLocale === "zh" ? item.zhLabel : item.enLabel;

  function updatePrefs(update: Partial<NavPreferences>) {
    const next = { ...prefs, ...update };
    writeNavPreferences(next);
    setPrefs(next);
    onPreferencesChange?.(next);
  }

  function togglePersonal(id: string) {
    const next = prefs.pinnedPersonal.includes(id)
      ? prefs.pinnedPersonal.filter((x) => x !== id)
      : [...prefs.pinnedPersonal, id];
    updatePrefs({ pinnedPersonal: next });
  }

  function toggleWorkspace(id: string) {
    const next = prefs.pinnedWorkspace.includes(id)
      ? prefs.pinnedWorkspace.filter((x) => x !== id)
      : [...prefs.pinnedWorkspace, id];
    updatePrefs({ pinnedWorkspace: next });
  }

  function reorderWorkspaceItems(sourceId: string, targetId: string, edge: Edge | null) {
    const startIndex = prefs.workspaceOrder.indexOf(sourceId);
    const targetIndex = prefs.workspaceOrder.indexOf(targetId);
    if (startIndex === -1 || targetIndex === -1) return;
    const destinationIndex = edge === "bottom" ? targetIndex + 1 : targetIndex;
    const nextOrder = reorder({ list: prefs.workspaceOrder, startIndex, finishIndex: destinationIndex });
    updatePrefs({ workspaceOrder: nextOrder });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>

        {/* ── Personal items ─────────────────────────────────────────── */}
        <div className="mt-2 space-y-1">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {text.sectionPersonal}
          </p>
          <div className="rounded-lg border border-border/60 bg-background/50">
            {PERSONAL_ITEMS.map((item) => (
              <CheckRow
                key={item.id}
                id={item.id}
                label={text[item.labelKey]}
                checked={prefs.pinnedPersonal.includes(item.id)}
                onToggle={() => { togglePersonal(item.id); }}
              />
            ))}
          </div>
        </div>

        <Separator className="my-2" />

        {/* ── Workspace items ────────────────────────────────────────── */}
        <div className="space-y-1">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {text.sectionWorkspace}
          </p>
          <div className="rounded-lg border border-border/60 bg-background/50">
            {orderedWorkspaceItems.map((item) => (
              <WorkspaceCheckRow
                key={item.id}
                id={item.id}
                label={getWorkspaceLabel(item)}
                checked={prefs.pinnedWorkspace.includes(item.id)}
                isDropTarget={dragTarget?.id === item.id}
                activeDropEdge={dragTarget?.id === item.id ? dragTarget.edge : null}
                onToggle={() => { toggleWorkspace(item.id); }}
                onDragOverItem={(targetId, edge) => { setDragTarget({ id: targetId, edge }); }}
                onDragLeaveItem={(targetId) => {
                  setDragTarget((current) => (current?.id === targetId ? null : current));
                }}
                onReorder={reorderWorkspaceItems}
              />
            ))}
          </div>
        </div>

        <Separator className="my-2" />

        {/* ── Organization items ──────────────────────────────────────── */}
        <div className="space-y-1">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {text.sectionOrganization}
          </p>
          <div className="rounded-lg border border-border/60 bg-background/50">
            {ORGANIZATION_NAV_ITEMS.map((item) => (
              <CheckRow
                key={item.id}
                id={item.id}
                label={getOrganizationLabel(item)}
                checked={prefs.pinnedWorkspace.includes(item.id)}
                onToggle={() => { toggleWorkspace(item.id); }}
              />
            ))}
          </div>
        </div>

        <Separator className="my-2" />

        {/* ── Display settings ───────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {text.sectionDisplay}
          </p>
          <div className="rounded-lg border border-border/60 bg-background/50 px-4 py-3 space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="nav-limit-workspaces"
                checked={prefs.showLimitedWorkspaces}
                onCheckedChange={(checked) => { updatePrefs({ showLimitedWorkspaces: Boolean(checked) }); }}
              />
              <Label htmlFor="nav-limit-workspaces" className="cursor-pointer text-sm font-medium">
                {text.limitedLabel}
              </Label>
            </div>
            {prefs.showLimitedWorkspaces && (
              <div className="space-y-1.5 pl-7">
                <Label htmlFor="nav-max-workspaces" className="text-xs text-muted-foreground">
                  {text.limitedInputLabel}
                </Label>
                <Input
                  id="nav-max-workspaces"
                  type="number"
                  min={1}
                  max={50}
                  value={prefs.maxWorkspaces}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1) updatePrefs({ maxWorkspaces: Math.min(val, 50) });
                  }}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="flex justify-end pt-2">
          <Button type="button" onClick={() => { onOpenChange(false); }}>
            {text.done}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
