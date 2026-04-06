import { useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace/api";

const MAX_VISIBLE_RECENT_WORKSPACES = 10;
const RECENT_WORKSPACES_STORAGE_PREFIX = "xuanwu:recent-workspaces:";

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
  const match = pathname.match(/^\/workspace\/([^/]+)/);
  if (!match) return;
  const workspaceId = decodeURIComponent(match[1]);
  const recentIds = readRecentWorkspaceIds(accountId);
  const deduped = [workspaceId, ...recentIds.filter((id) => id !== workspaceId)].slice(0, 50);
  persistRecentWorkspaceIds(accountId, deduped);
}

function getWorkspaceIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/workspace\/([^/]+)/);
  if (!match) return null;
  return decodeURIComponent(match[1]);
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

  const recentWorkspaceLinks = useMemo(() => {
    return recentWorkspaceIds
      .map((workspaceId) => {
        const ws = workspacesById[workspaceId];
        if (!ws) return null;
        return { id: ws.id, name: ws.name, href: `/workspace/${ws.id}` };
      })
      .filter((item): item is { id: string; name: string; href: string } => item !== null);
  }, [recentWorkspaceIds, workspacesById]);

  return { isExpanded, setIsExpanded, recentWorkspaceLinks };
}

export { MAX_VISIBLE_RECENT_WORKSPACES, getWorkspaceIdFromPath };
