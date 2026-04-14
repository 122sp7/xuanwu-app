/**
 * nav-preferences-data.ts  (workspace BC – interfaces/web/navigation)
 * Owns: NavPreferences type, nav-item catalogs, default values,
 *   validation helpers, and localStorage read/write utilities.
 * Constraints: No React imports. No UI imports. Pure data / serialization.
 */

import {
  WORKSPACE_NAV_ITEMS,
  normalizeWorkspaceOrder,
} from "./workspace-nav-items";
import { normalizeWorkspaceTabPrefId } from "./workspace-tabs";

// Re-export for consumers that import from this file directly.
export { WORKSPACE_NAV_ITEMS, normalizeWorkspaceOrder };

// ── Types ──────────────────────────────────────────────────────────────────

export interface NavPreferences {
  pinnedPersonal: string[];
  pinnedWorkspace: string[];
  showLimitedWorkspaces: boolean;
  maxWorkspaces: number;
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

// ── Organization management items ─────────────────────────────────────────

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

/**
 * Legacy default order before workspace tab UX reorder.
 * Only exact legacy defaults are migrated; custom user orders are preserved.
 */
const RAW_LEGACY_DEFAULT_WORKSPACE_ORDER = [
  "home",
  "daily",
  "schedule",
  "audit",
  "tasks",
  "task-qa",
  "task-acceptance",
  "task-issues",
  "task-finance",
  "feed",
  "knowledge",
  "workspace-settings",
  "notion-knowledge",
  "notion-authoring",
  "notion-database",
  "notion-collaboration",
  "notion-relations",
  "notion-taxonomy",
  "notebook",
  "notebook-conversation",
  "notebook-notebook",
  "notebook-source",
  "notebook-synthesis",
  "ai-chat",
  "files",
  "members",
] as const;

const LEGACY_DEFAULT_WORKSPACE_ORDER = Array.from(
  new Set(RAW_LEGACY_DEFAULT_WORKSPACE_ORDER.map((id) => normalizeWorkspaceTabPrefId(id))),
);

const VALID_PERSONAL_ITEM_IDS = new Set(PERSONAL_ITEMS.map((item) => item.id));
const VALID_WORKSPACE_ITEM_IDS = new Set([
  ...WORKSPACE_NAV_ITEMS.map((item) => item.id),
  ...ORGANIZATION_NAV_ITEMS.map((item) => item.id),
]);

const WORKFLOW_PIN_MIGRATION_IDS = [
  "task-qa",
  "task-acceptance",
  "task-issues",
  "task-finance",
] as const;

/**
 * Notion / NotebookLM orchestration tabs added via workspace orchestration layer.
 * Existing users whose localStorage pre-dates these tabs need auto-migration.
 */
const NOTION_NOTEBOOKLM_PIN_MIGRATION_IDS = [
  "knowledge",
  "workspace-settings",
  "notion-authoring",
  "notion-database",
  "notion-collaboration",
  "notion-relations",
  "notion-taxonomy",
  "notebook",
  "notebook-notebook",
  "notebook-source",
  "ai-chat",
] as const;

const WORKSPACE_SURFACE_PIN_MIGRATION_IDS = ["audit"] as const;

function normalizePinnedIds(ids: unknown, validSet: Set<string>, fallback: string[]): string[] {
  if (!Array.isArray(ids)) return fallback;
  const normalized = ids
    .filter((id): id is string => typeof id === "string")
    .map((id) => normalizeWorkspaceTabPrefId(id))
    .filter((id) => validSet.has(id));
  return normalized.length > 0 ? Array.from(new Set(normalized)) : fallback;
}

function migrateWorkflowPins(ids: string[]): string[] {
  if (!ids.includes("tasks")) return ids;
  const next = [...ids];
  for (const id of WORKFLOW_PIN_MIGRATION_IDS) {
    if (!next.includes(id) && VALID_WORKSPACE_ITEM_IDS.has(id)) {
      next.push(id);
    }
  }
  return next;
}

function migrateNotionNotebooklmPins(ids: string[]): string[] {
  const next = [...ids];
  let changed = false;
  for (const id of NOTION_NOTEBOOKLM_PIN_MIGRATION_IDS) {
    if (!next.includes(id) && VALID_WORKSPACE_ITEM_IDS.has(id)) {
      next.push(id);
      changed = true;
    }
  }
  return changed ? next : ids;
}

function migrateWorkspaceSurfacePins(ids: string[]): string[] {
  const next = [...ids];
  let changed = false;

  for (const id of WORKSPACE_SURFACE_PIN_MIGRATION_IDS) {
    if (!next.includes(id) && VALID_WORKSPACE_ITEM_IDS.has(id)) {
      const settingsIndex = next.indexOf("workspace-settings");
      if (settingsIndex >= 0) {
        next.splice(settingsIndex, 0, id);
      } else {
        next.push(id);
      }
      changed = true;
    }
  }

  return changed ? next : ids;
}

function migrateWorkspaceSurfaceOrder(order: string[]): string[] {
  if (!order.includes("audit")) {
    const next = [...order];
    const settingsIndex = next.indexOf("workspace-settings");
    const aiChatIndex = next.indexOf("ai-chat");

    if (settingsIndex >= 0) {
      next.splice(settingsIndex, 0, "audit");
      return next;
    }

    if (aiChatIndex >= 0) {
      next.splice(aiChatIndex + 1, 0, "audit");
      return next;
    }

    next.push("audit");
    return next;
  }

  const next = order.filter((id) => id !== "audit");
  const settingsIndex = next.indexOf("workspace-settings");
  const aiChatIndex = next.indexOf("ai-chat");

  if (settingsIndex >= 0) {
    next.splice(settingsIndex, 0, "audit");
    return next;
  }

  if (aiChatIndex >= 0) {
    next.splice(aiChatIndex + 1, 0, "audit");
    return next;
  }

  next.push("audit");
  return next;
}

function isExactOrderMatch(source: string[], target: readonly string[]): boolean {
  if (source.length !== target.length) {
    return false;
  }
  return source.every((id, index) => id === target[index]);
}

function migrateWorkspaceOrder(order: string[]): string[] {
  if (isExactOrderMatch(order, LEGACY_DEFAULT_WORKSPACE_ORDER)) {
    return migrateWorkspaceSurfaceOrder(DEFAULT_PREFS.workspaceOrder);
  }
  return migrateWorkspaceSurfaceOrder(order);
}

// ── localStorage helpers ───────────────────────────────────────────────────

export function readNavPreferences(): NavPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<NavPreferences>;
    const normalizedWorkspacePinned = normalizePinnedIds(
      parsed.pinnedWorkspace,
      VALID_WORKSPACE_ITEM_IDS,
      DEFAULT_PREFS.pinnedWorkspace,
    );
    return {
      pinnedPersonal: normalizePinnedIds(
        parsed.pinnedPersonal,
        VALID_PERSONAL_ITEM_IDS,
        DEFAULT_PREFS.pinnedPersonal,
      ),
      pinnedWorkspace: migrateWorkspaceSurfacePins(
        migrateNotionNotebooklmPins(migrateWorkflowPins(normalizedWorkspacePinned)),
      ),
      showLimitedWorkspaces: parsed.showLimitedWorkspaces ?? DEFAULT_PREFS.showLimitedWorkspaces,
      maxWorkspaces:
        typeof parsed.maxWorkspaces === "number"
          ? parsed.maxWorkspaces
          : DEFAULT_PREFS.maxWorkspaces,
      workspaceOrder: migrateWorkspaceOrder(normalizeWorkspaceOrder(parsed.workspaceOrder)),
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function writeNavPreferences(prefs: NavPreferences): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
