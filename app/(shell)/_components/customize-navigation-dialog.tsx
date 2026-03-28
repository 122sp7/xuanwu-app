"use client";

/**
 * Module: customize-navigation-dialog.tsx
 * Purpose: Let users pick which nav items stay pinned in the secondary sidebar.
 * Responsibilities: checkbox toggles per item, workspace nav-style radio, show-N-workspaces
 *   preference, all persisted to localStorage.
 * Constraints: UI-only; pure preference storage, no backend call.
 */

import { GripVertical } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  attachClosestEdge,
  combine,
  draggable,
  DropIndicator,
  dropTargetForElements,
  extractClosestEdge,
  reorder,
  type Edge,
} from "@lib-dragdrop";

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

// ── Types ──────────────────────────────────────────────────────────────────

export interface NavPreferences {
  /** IDs of personal nav items that are pinned */
  pinnedPersonal: string[];
  /** IDs of workspace org-management items that are pinned */
  pinnedWorkspace: string[];
  /** Whether to show a limited number of workspaces */
  showLimitedWorkspaces: boolean;
  /** Max number of workspaces to show (when showLimitedWorkspaces = true) */
  maxWorkspaces: number;
  /** Explicit display order of workspace items for sidebar and customize dialog */
  workspaceOrder: string[];
}

const STORAGE_KEY = "xuanwu:nav-preferences";

// ── Personal nav items ─────────────────────────────────────────────────────

const PERSONAL_ITEMS: { id: string; labelKey: "recentWorkspaces" }[] = [
  { id: "recent-workspaces", labelKey: "recentWorkspaces" },
];

// ── Workspace / org-management items ──────────────────────────────────────

const WORKSPACE_NAV_ITEMS: { id: string; tabKey: string; fallbackLabel: string }[] = [
  { id: "home", tabKey: "Overview", fallbackLabel: "Home" },
  { id: "recent", tabKey: "Recent", fallbackLabel: "Recent" },
  { id: "favorites", tabKey: "Favorites", fallbackLabel: "Favorites" },
  { id: "workspace-modules", tabKey: "workspaceModules", fallbackLabel: "Workspace Modules" },
  { id: "spaces", tabKey: "Spaces", fallbackLabel: "Spaces" },
  { id: "docs", tabKey: "Docs", fallbackLabel: "Docs" },
  { id: "wiki", tabKey: "Wiki", fallbackLabel: "Wiki" },
  { id: "meeting-notes", tabKey: "Meeting Notes", fallbackLabel: "Meeting Notes" },
  { id: "sop", tabKey: "SOP", fallbackLabel: "SOP" },
  { id: "engineering", tabKey: "Engineering", fallbackLabel: "Engineering" },
  { id: "product", tabKey: "Product", fallbackLabel: "Product" },
  { id: "design", tabKey: "Design", fallbackLabel: "Design" },
  { id: "databases", tabKey: "Databases", fallbackLabel: "Databases" },
  { id: "projects", tabKey: "Projects", fallbackLabel: "Projects" },
  { id: "roadmap", tabKey: "Roadmap", fallbackLabel: "Roadmap" },
  { id: "notes", tabKey: "Notes", fallbackLabel: "Notes" },
  { id: "documents", tabKey: "Documents", fallbackLabel: "Documents" },
  { id: "assets", tabKey: "Assets", fallbackLabel: "Assets" },
  { id: "crm", tabKey: "CRM", fallbackLabel: "CRM" },
  { id: "files", tabKey: "Files", fallbackLabel: "Files" },
  { id: "tags", tabKey: "Tags", fallbackLabel: "Tags" },
  { id: "templates", tabKey: "Templates", fallbackLabel: "Templates" },
  { id: "members", tabKey: "Members", fallbackLabel: "Members" },
  { id: "trash", tabKey: "Trash", fallbackLabel: "Trash" },
  { id: "daily", tabKey: "Daily", fallbackLabel: "Daily" },
  { id: "schedule", tabKey: "Schedule", fallbackLabel: "Schedule" },
  { id: "audit", tabKey: "Audit", fallbackLabel: "Audit" },
  { id: "tasks", tabKey: "Tasks", fallbackLabel: "Tasks" },
];

const ORGANIZATION_NAV_ITEMS: { id: string; zhLabel: string; enLabel: string }[] = [
  { id: "teams", zhLabel: "團隊", enLabel: "Teams" },
  { id: "permissions", zhLabel: "權限", enLabel: "Permissions" },
  { id: "workspaces", zhLabel: "工作區", enLabel: "Workspaces" },
];

const DIALOG_TEXT = {
  zh: {
    title: "Customize navigation",
    description:
      "已勾選項目會固定顯示於側欄。此設定僅影響你自己的介面，不會影響其他成員。",
    sectionPersonal: "個人",
    sectionWorkspace: "工作區",
    sectionOrganization: "組織管理",
    sectionDisplay: "顯示設定",
    limitedLabel: "側欄僅顯示固定數量的最近工作區",
    limitedInputLabel: "工作區數量",
    done: "完成",
    recentWorkspaces: "最近工作區",
  },
  en: {
    title: "Customize navigation",
    description:
      "Checked items stay visible in your sidebar. This setting is personal and does not affect other members.",
    sectionPersonal: "Personal",
    sectionWorkspace: "Workspace",
    sectionOrganization: "Organization",
    sectionDisplay: "Display",
    limitedLabel: "Show a limited number of recent workspaces in sidebar",
    limitedInputLabel: "Number of workspaces",
    done: "Done",
    recentWorkspaces: "Recent workspaces",
  },
} as const;

interface SidebarLocaleBundle {
  workspace?: {
    groups?: Record<string, string>;
    tabLabels?: Record<string, string>;
  };
}

const DEFAULT_PREFS: NavPreferences = {
  pinnedPersonal: ["recent-workspaces"],
  pinnedWorkspace: [...WORKSPACE_NAV_ITEMS.map((item) => item.id), ...ORGANIZATION_NAV_ITEMS.map((item) => item.id)],
  showLimitedWorkspaces: true,
  maxWorkspaces: 10,
  workspaceOrder: WORKSPACE_NAV_ITEMS.map((item) => item.id),
};

const VALID_PERSONAL_ITEM_IDS = new Set(PERSONAL_ITEMS.map((item) => item.id));
const VALID_WORKSPACE_ITEM_IDS = new Set([
  ...WORKSPACE_NAV_ITEMS.map((item) => item.id),
  ...ORGANIZATION_NAV_ITEMS.map((item) => item.id),
]);
const VALID_WORKSPACE_ORDER_IDS = new Set(WORKSPACE_NAV_ITEMS.map((item) => item.id));

function normalizePinnedIds(
  ids: unknown,
  validSet: Set<string>,
  fallback: string[],
) {
  if (!Array.isArray(ids)) {
    return fallback;
  }

  const normalized = ids
    .filter((id): id is string => typeof id === "string")
    .filter((id) => validSet.has(id));

  return normalized.length > 0 ? Array.from(new Set(normalized)) : fallback;
}

function normalizeWorkspaceOrder(order: unknown) {
  const fallback = DEFAULT_PREFS.workspaceOrder;
  if (!Array.isArray(order)) {
    return fallback;
  }

  const validOrder = order
    .filter((id): id is string => typeof id === "string")
    .filter((id) => VALID_WORKSPACE_ORDER_IDS.has(id));

  const deduped = Array.from(new Set(validOrder));
  for (const id of fallback) {
    if (!deduped.includes(id)) {
      deduped.push(id);
    }
  }

  return deduped;
}

// ── localStorage helpers ───────────────────────────────────────────────────

export function readNavPreferences(): NavPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<NavPreferences>;
    return {
      pinnedPersonal: normalizePinnedIds(
        parsed.pinnedPersonal,
        VALID_PERSONAL_ITEM_IDS,
        DEFAULT_PREFS.pinnedPersonal,
      ),
      pinnedWorkspace: normalizePinnedIds(
        parsed.pinnedWorkspace,
        VALID_WORKSPACE_ITEM_IDS,
        DEFAULT_PREFS.pinnedWorkspace,
      ),
      showLimitedWorkspaces: parsed.showLimitedWorkspaces ?? DEFAULT_PREFS.showLimitedWorkspaces,
      maxWorkspaces: typeof parsed.maxWorkspaces === "number" ? parsed.maxWorkspaces : DEFAULT_PREFS.maxWorkspaces,
      workspaceOrder: normalizeWorkspaceOrder(parsed.workspaceOrder),
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function writeNavPreferences(prefs: NavPreferences) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

// ── Sub-components ─────────────────────────────────────────────────────────

interface CheckRowProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}

function CheckRow({ id, label, checked, onToggle }: CheckRowProps) {
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

function WorkspaceCheckRow({
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
    if (!element) {
      return;
    }

    return combine(
      draggable({
        element,
        getInitialData: () => ({
          type: "workspace-nav-item",
          itemId: id,
        }),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          return source.data.type === "workspace-nav-item" && source.data.itemId !== id;
        },
        getData: ({ input, element: dropElement }) => {
          return attachClosestEdge(
            {
              type: "workspace-nav-item",
              itemId: id,
            },
            {
              input,
              element: dropElement,
              allowedEdges: ["top", "bottom"],
            },
          );
        },
        onDragEnter: ({ self }) => {
          onDragOverItem(id, extractClosestEdge(self.data));
        },
        onDrag: ({ self }) => {
          onDragOverItem(id, extractClosestEdge(self.data));
        },
        onDragLeave: () => {
          onDragLeaveItem(id);
        },
        onDrop: ({ source, self }) => {
          const sourceId = typeof source.data.itemId === "string" ? source.data.itemId : null;
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

// ── Main component ─────────────────────────────────────────────────────────

interface CustomizeNavigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPreferencesChange?: (prefs: NavPreferences) => void;
}

export function CustomizeNavigationDialog({
  open,
  onOpenChange,
  onPreferencesChange,
}: CustomizeNavigationDialogProps) {
  const [prefs, setPrefs] = useState<NavPreferences>(() => readNavPreferences());
  const [dragTarget, setDragTarget] = useState<{ id: string; edge: Edge | null } | null>(null);
  const uiLocale = useMemo<"zh" | "en">(() => {
    if (typeof navigator === "undefined") {
      return "zh";
    }
    const language = navigator.language?.toLowerCase() ?? "";
    return language.startsWith("zh") ? "zh" : "en";
  }, []);
  const [localeBundle, setLocaleBundle] = useState<SidebarLocaleBundle | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const localeFile = uiLocale === "zh" ? "/localized-files/zh-TW.json" : "/localized-files/en.json";
    let canceled = false;

    fetch(localeFile)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load locale file: ${res.status}`);
        }
        return res.json() as Promise<SidebarLocaleBundle>;
      })
      .then((json) => {
        if (!canceled) {
          setLocaleBundle(json);
        }
      })
      .catch(() => {
        if (!canceled) {
          setLocaleBundle(null);
        }
      });

    return () => {
      canceled = true;
    };
  }, [uiLocale]);

  const text = DIALOG_TEXT[uiLocale];

  const workspaceItemsById = useMemo(
    () => Object.fromEntries(WORKSPACE_NAV_ITEMS.map((item) => [item.id, item])),
    [],
  );

  const orderedWorkspaceItems = useMemo(() => {
    return prefs.workspaceOrder
      .map((id) => workspaceItemsById[id])
      .filter((item): item is (typeof WORKSPACE_NAV_ITEMS)[number] => item != null);
  }, [prefs.workspaceOrder, workspaceItemsById]);

  const getWorkspaceLabel = (item: (typeof WORKSPACE_NAV_ITEMS)[number]) => {
    return localeBundle?.workspace?.tabLabels?.[item.tabKey] ?? item.fallbackLabel;
  };

  const getOrganizationLabel = (item: (typeof ORGANIZATION_NAV_ITEMS)[number]) => {
    return uiLocale === "zh" ? item.zhLabel : item.enLabel;
  };

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

    if (startIndex === -1 || targetIndex === -1) {
      return;
    }

    const destinationIndex = edge === "bottom" ? targetIndex + 1 : targetIndex;
    const nextOrder = reorder({
      list: prefs.workspaceOrder,
      startIndex,
      finishIndex: destinationIndex,
    });

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
                onToggle={() => {
                  togglePersonal(item.id);
                }}
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
                onToggle={() => {
                  toggleWorkspace(item.id);
                }}
                onDragOverItem={(targetId, edge) => {
                  setDragTarget({ id: targetId, edge });
                }}
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
                onToggle={() => {
                  toggleWorkspace(item.id);
                }}
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

          {/* Show limited workspaces */}
          <div className="rounded-lg border border-border/60 bg-background/50 px-4 py-3 space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="nav-limit-workspaces"
                checked={prefs.showLimitedWorkspaces}
                onCheckedChange={(checked) => {
                  updatePrefs({ showLimitedWorkspaces: Boolean(checked) });
                }}
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
                    if (!isNaN(val) && val >= 1) {
                      updatePrefs({ maxWorkspaces: Math.min(val, 50) });
                    }
                  }}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            {text.done}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
