/**
 * workspace-nav-items.ts
 *
 * Catalog of workspace sidebar tab entries owned by the workspace BC.
 * Consumers read this catalog; they do not define it.
 */

export interface WorkspaceNavItem {
  id: string;
  tabKey: string;
  fallbackLabel: string;
}

export const WORKSPACE_NAV_ITEMS: WorkspaceNavItem[] = [
  { id: "home", tabKey: "Overview", fallbackLabel: "Home" },
  { id: "daily", tabKey: "Daily", fallbackLabel: "Daily" },
  { id: "schedule", tabKey: "Schedule", fallbackLabel: "Schedule" },
  { id: "audit", tabKey: "Audit", fallbackLabel: "Audit" },
  { id: "tasks", tabKey: "Tasks", fallbackLabel: "Workflow" },
  { id: "feed", tabKey: "Feed", fallbackLabel: "Feed" },
  { id: "files", tabKey: "Files", fallbackLabel: "Files" },
  { id: "members", tabKey: "Members", fallbackLabel: "Members" },
];

const VALID_WORKSPACE_ORDER_IDS = new Set(WORKSPACE_NAV_ITEMS.map((item) => item.id));
const DEFAULT_WORKSPACE_ORDER = WORKSPACE_NAV_ITEMS.map((item) => item.id);

export function normalizeWorkspaceOrder(order: unknown): string[] {
  const fallback = DEFAULT_WORKSPACE_ORDER;
  if (!Array.isArray(order)) return fallback;
  const validOrder = order
    .filter((id): id is string => typeof id === "string")
    .filter((id) => VALID_WORKSPACE_ORDER_IDS.has(id));
  const deduped = Array.from(new Set(validOrder));
  for (const id of fallback) {
    if (!deduped.includes(id)) deduped.push(id);
  }
  return deduped;
}