"use client";

/**
 * Module: customize-navigation-dialog.tsx
 * Purpose: Let users pick which nav items stay pinned in the secondary sidebar.
 * Responsibilities: checkbox toggles per item, workspace nav-style radio, show-N-workspaces
 *   preference, all persisted to localStorage.
 * Constraints: UI-only; pure preference storage, no backend call.
 */

import { GripVertical } from "lucide-react";
import { useState } from "react";

import { Button } from "@/ui/shadcn/ui/button";
import { Checkbox } from "@/ui/shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/shadcn/ui/dialog";
import { Input } from "@/ui/shadcn/ui/input";
import { Label } from "@/ui/shadcn/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/shadcn/ui/radio-group";
import { Separator } from "@/ui/shadcn/ui/separator";

// ── Types ──────────────────────────────────────────────────────────────────

export interface NavPreferences {
  /** IDs of personal nav items that are pinned */
  pinnedPersonal: string[];
  /** IDs of workspace org-management items that are pinned */
  pinnedWorkspace: string[];
  /** Workspace item navigation style */
  workspaceNavStyle: "accordion" | "tabbed";
  /** Whether to show a limited number of workspaces */
  showLimitedWorkspaces: boolean;
  /** Max number of workspaces to show (when showLimitedWorkspaces = true) */
  maxWorkspaces: number;
}

const STORAGE_KEY = "xuanwu:nav-preferences";

const DEFAULT_PREFS: NavPreferences = {
  pinnedPersonal: ["home", "recent-workspaces"],
  pinnedWorkspace: ["members", "teams", "permissions", "workspaces", "knowledge", "schedule", "daily", "audit"],
  workspaceNavStyle: "accordion",
  showLimitedWorkspaces: true,
  maxWorkspaces: 10,
};

// ── Personal nav items ─────────────────────────────────────────────────────

const PERSONAL_ITEMS: { id: string; label: string }[] = [
  { id: "home", label: "首頁" },
  { id: "recent-workspaces", label: "最近工作區" },
];

// ── Workspace / org-management items ──────────────────────────────────────

const WORKSPACE_ITEMS: { id: string; label: string }[] = [
  { id: "members", label: "成員" },
  { id: "teams", label: "團隊" },
  { id: "permissions", label: "權限" },
  { id: "workspaces", label: "工作區" },
  { id: "knowledge", label: "知識" },
  { id: "schedule", label: "排程" },
  { id: "daily", label: "每日" },
  { id: "audit", label: "稽核" },
];

// ── localStorage helpers ───────────────────────────────────────────────────

export function readNavPreferences(): NavPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<NavPreferences>;
    return {
      pinnedPersonal: Array.isArray(parsed.pinnedPersonal) ? parsed.pinnedPersonal : DEFAULT_PREFS.pinnedPersonal,
      pinnedWorkspace: Array.isArray(parsed.pinnedWorkspace) ? parsed.pinnedWorkspace : DEFAULT_PREFS.pinnedWorkspace,
      workspaceNavStyle: parsed.workspaceNavStyle === "tabbed" ? "tabbed" : "accordion",
      showLimitedWorkspaces: parsed.showLimitedWorkspaces ?? DEFAULT_PREFS.showLimitedWorkspaces,
      maxWorkspaces: typeof parsed.maxWorkspaces === "number" ? parsed.maxWorkspaces : DEFAULT_PREFS.maxWorkspaces,
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

  function updatePrefs(update: Partial<NavPreferences>) {
    setPrefs((prev) => {
      const next = { ...prev, ...update };
      writeNavPreferences(next);
      onPreferencesChange?.(next);
      return next;
    });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Customize navigation</DialogTitle>
          <DialogDescription>
            Selected items will always stay visible in your sidebar. You can still find the others
            anytime from the More menu. These changes are personal to you and won&apos;t affect
            anyone else on your workspace.
          </DialogDescription>
        </DialogHeader>

        {/* ── Personal items ─────────────────────────────────────────── */}
        <div className="mt-2 space-y-1">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            個人
          </p>
          <div className="rounded-lg border border-border/60 bg-background/50">
            {PERSONAL_ITEMS.map((item) => (
              <CheckRow
                key={item.id}
                id={item.id}
                label={item.label}
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
            工作區
          </p>
          <div className="rounded-lg border border-border/60 bg-background/50">
            {WORKSPACE_ITEMS.map((item) => (
              <CheckRow
                key={item.id}
                id={item.id}
                label={item.label}
                checked={prefs.pinnedWorkspace.includes(item.id)}
                onToggle={() => {
                  toggleWorkspace(item.id);
                }}
              />
            ))}
          </div>
        </div>

        <Separator className="my-2" />

        {/* ── Projects / Workspaces section ──────────────────────────── */}
        <div className="space-y-3">
          <p className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            工作區導覽
          </p>

          <RadioGroup
            value={prefs.workspaceNavStyle}
            onValueChange={(v) => {
              updatePrefs({ workspaceNavStyle: v as "accordion" | "tabbed" });
            }}
            className="rounded-lg border border-border/60 bg-background/50 px-4 py-3 space-y-3"
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem value="accordion" id="nav-style-accordion" className="mt-0.5" />
              <div>
                <Label htmlFor="nav-style-accordion" className="cursor-pointer text-sm font-medium">
                  Accordion sidebar navigation
                </Label>
                <p className="text-xs text-muted-foreground">
                  Feature tabs will appear as nested items under workspace and acts as accordion.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RadioGroupItem value="tabbed" id="nav-style-tabbed" className="mt-0.5" />
              <div>
                <Label htmlFor="nav-style-tabbed" className="cursor-pointer text-sm font-medium">
                  Tabbed Navigation
                </Label>
                <p className="text-xs text-muted-foreground">
                  Feature tabs will appear as horizontal tabs inside a workspace.
                </p>
              </div>
            </div>
          </RadioGroup>

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
                Show limited workspaces on sidebar
              </Label>
            </div>
            {prefs.showLimitedWorkspaces && (
              <div className="space-y-1.5 pl-7">
                <Label htmlFor="nav-max-workspaces" className="text-xs text-muted-foreground">
                  Enter number of workspaces
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
            完成
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
