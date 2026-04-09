/**
 * nav-preferences-data.ts
 * Owns: NavPreferences type, nav-item catalogs, default values,
 *   validation helpers, and localStorage read/write utilities.
 * Constraints: No React imports. No UI imports. Pure data / serialization.
 */

import {
  WORKSPACE_NAV_ITEMS,
  normalizeWorkspaceOrder,
} from "@/modules/workspace/api";

// Re-export so existing consumers of this file (customize-navigation-dialog
// via nav-preferences-data) keep working during the transition.
export { WORKSPACE_NAV_ITEMS, normalizeWorkspaceOrder };

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

export interface SidebarLocaleBundle {
  workspace?: {
    groups?: Record<string, string>;
    tabLabels?: Record<string, string>;
  };
}

const STORAGE_KEY = "xuanwu:nav-preferences";

// ── Personal nav items ─────────────────────────────────────────────────────

export const PERSONAL_ITEMS: { id: string; labelKey: "recentWorkspaces" }[] = [
  { id: "recent-workspaces", labelKey: "recentWorkspaces" },
];

// ── Workspace / org-management items ──────────────────────────────────────
// WORKSPACE_NAV_ITEMS is owned by modules/workspace/api (workspace BC).
// It is re-exported above for backward-compatible consumers of this file.

export const ORGANIZATION_NAV_ITEMS: { id: string; zhLabel: string; enLabel: string }[] = [
  { id: "teams", zhLabel: "團隊", enLabel: "Teams" },
  { id: "permissions", zhLabel: "權限", enLabel: "Permissions" },
  { id: "workspaces", zhLabel: "工作區", enLabel: "Workspaces" },
];

export const DIALOG_TEXT = {
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

// ── Defaults + validation ──────────────────────────────────────────────────

export const DEFAULT_PREFS: NavPreferences = {
  pinnedPersonal: ["recent-workspaces"],
  pinnedWorkspace: [
    ...WORKSPACE_NAV_ITEMS.map((item) => item.id),
    ...ORGANIZATION_NAV_ITEMS.map((item) => item.id),
  ],
  showLimitedWorkspaces: true,
  maxWorkspaces: 10,
  workspaceOrder: WORKSPACE_NAV_ITEMS.map((item) => item.id),
};

const VALID_PERSONAL_ITEM_IDS = new Set(PERSONAL_ITEMS.map((item) => item.id));
const VALID_WORKSPACE_ITEM_IDS = new Set([
  ...WORKSPACE_NAV_ITEMS.map((item) => item.id),
  ...ORGANIZATION_NAV_ITEMS.map((item) => item.id),
]);
// normalizeWorkspaceOrder is owned by modules/workspace/api (workspace BC).
// It is re-exported above.

function normalizePinnedIds(ids: unknown, validSet: Set<string>, fallback: string[]): string[] {
  if (!Array.isArray(ids)) return fallback;
  const normalized = ids
    .filter((id): id is string => typeof id === "string")
    .filter((id) => validSet.has(id));
  return normalized.length > 0 ? Array.from(new Set(normalized)) : fallback;
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
      maxWorkspaces:
        typeof parsed.maxWorkspaces === "number"
          ? parsed.maxWorkspaces
          : DEFAULT_PREFS.maxWorkspaces,
      workspaceOrder: normalizeWorkspaceOrder(parsed.workspaceOrder),
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function writeNavPreferences(prefs: NavPreferences): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
