/**
 * workspace-nav-items.ts
 *
 * Catalog of workspace sidebar tab entries owned by the workspace BC.
 * Consumers read this catalog; they do not define it.
 */

import {
  getWorkspaceTabLabel,
  getWorkspaceTabPrefId,
  getWorkspaceTabsInSidebarOrder,
  normalizeWorkspaceTabPrefId,
  type WorkspaceTabValue,
} from "./workspace-tabs";

export interface WorkspaceNavItem {
  id: string;
  tabKey: WorkspaceTabValue;
  fallbackLabel: string;
}

export const WORKSPACE_NAV_ITEMS: WorkspaceNavItem[] = getWorkspaceTabsInSidebarOrder().map((tabKey) => ({
  id: getWorkspaceTabPrefId(tabKey),
  tabKey,
  fallbackLabel: getWorkspaceTabLabel(tabKey),
}));

const VALID_WORKSPACE_ORDER_IDS = new Set(WORKSPACE_NAV_ITEMS.map((item) => item.id));
const DEFAULT_WORKSPACE_ORDER = WORKSPACE_NAV_ITEMS.map((item) => item.id);

export function normalizeWorkspaceOrder(order: unknown): string[] {
  const fallback = DEFAULT_WORKSPACE_ORDER;
  if (!Array.isArray(order)) return fallback;
  const validOrder = order
    .filter((id): id is string => typeof id === "string")
    .map((id) => normalizeWorkspaceTabPrefId(id))
    .filter((id) => VALID_WORKSPACE_ORDER_IDS.has(id));
  const deduped = Array.from(new Set(validOrder));
  for (const id of fallback) {
    if (!deduped.includes(id)) deduped.push(id);
  }
  return deduped;
}