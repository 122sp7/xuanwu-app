import { useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity } from "../../api/contracts";

interface RecentWorkspaceLink {
  id: string;
  name: string;
  href: string;
}

const MAX_VISIBLE_RECENT_WORKSPACES = 10;
const RECENT_WORKSPACES_STORAGE_PREFIX = "xuanwu:recent-workspaces:";

const NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES = new Set([
  "workspace",
  "organization",
  "settings",
  "dashboard",
  "dev-tools",
  "members",
  "teams",
  "permissions",
  "workspaces",
  "schedule",
  "daily",
  "audit",
]);

function getStorageKey(accountId: string) {
  return `${RECENT_WORKSPACES_STORAGE_PREFIX}${accountId}`;
}

function readRecentWorkspaceIds(accountId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getStorageKey(accountId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
  } catch {
    return [];
  }
}

function persistRecentWorkspaceIds(accountId: string, workspaceIds: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getStorageKey(accountId), JSON.stringify(workspaceIds));
}

function trackWorkspaceFromPath(pathname: string, accountId: string) {
  const workspaceId = getWorkspaceIdFromPath(pathname);
  if (!workspaceId) return;
  const recentIds = readRecentWorkspaceIds(accountId);
  const deduped = [workspaceId, ...recentIds.filter((id) => id !== workspaceId)].slice(0, 50);
  persistRecentWorkspaceIds(accountId, deduped);
}

function getWorkspaceIdFromPath(pathname: string): string | null {
  const legacyMatch = pathname.match(/^\/workspace\/([^/]+)/);
  if (legacyMatch) {
    return decodeURIComponent(legacyMatch[1]);
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  const [firstSegment, secondSegment, thirdSegment] = segments;
  if (NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES.has(firstSegment)) {
    return null;
  }

  if (secondSegment === "workspace") {
    if (!thirdSegment) {
      return null;
    }
    return decodeURIComponent(thirdSegment);
  }

  return decodeURIComponent(secondSegment);
}

export function useRecentWorkspaces(
  accountId: string | undefined,
  pathname: string,
  workspaces: WorkspaceEntity[],
) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    trackWorkspaceFromPath(pathname, accountId);
  }, [accountId, pathname]);

  const workspacesById = useMemo(
    () => Object.fromEntries(workspaces.map((workspace) => [workspace.id, workspace])),
    [workspaces],
  );

  const recentWorkspaceIds = useMemo(() => {
    if (!accountId) return [] as string[];
    const stored = readRecentWorkspaceIds(accountId);
    const currentId = getWorkspaceIdFromPath(pathname);
    if (!currentId) return stored;
    return [currentId, ...stored.filter((id) => id !== currentId)];
  }, [accountId, pathname]);

  const recentWorkspaceLinks = useMemo<RecentWorkspaceLink[]>(() => {
    return recentWorkspaceIds
      .map<RecentWorkspaceLink | null>((workspaceId) => {
        const ws = workspacesById[workspaceId];
        if (!ws) return null;
        const href = accountId
          ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(ws.id)}`
          : "/";
        return { id: ws.id, name: ws.name, href };
      })
      .filter((item): item is RecentWorkspaceLink => item !== null);
  }, [accountId, recentWorkspaceIds, workspacesById]);

  return { isExpanded, setIsExpanded, recentWorkspaceLinks };
}

export { MAX_VISIBLE_RECENT_WORKSPACES, getWorkspaceIdFromPath };
