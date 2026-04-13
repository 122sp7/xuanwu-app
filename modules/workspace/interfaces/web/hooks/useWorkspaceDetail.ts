"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { WorkspaceEntity } from "../../api/contracts";
import { getWorkspaceById, getWorkspaceByIdForAccount } from "../../api/facades";

export type WorkspaceLoadState = "loading" | "loaded" | "error";

export interface UseWorkspaceDetailResult {
  workspace: WorkspaceEntity | null;
  loadState: WorkspaceLoadState;
  setWorkspace: (ws: WorkspaceEntity) => void;
}

export function useWorkspaceDetail(
  workspaceId: string,
  accountId: string | null | undefined,
  accountsHydrated: boolean,
  accessibleAccountIds: readonly string[] = [],
): UseWorkspaceDetailResult {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<WorkspaceEntity | null>(null);
  const [loadState, setLoadState] = useState<WorkspaceLoadState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadWorkspace() {
      if (!workspaceId) {
        setLoadState("error");
        return;
      }

      if (!accountId || !accountsHydrated) {
        setWorkspace(null);
        setLoadState("loading");
        return;
      }

      setLoadState("loading");
      try {
        const detail = await getWorkspaceByIdForAccount(accountId, workspaceId);
        if (cancelled) return;
        if (!detail) {
          const fallbackWorkspace = await getWorkspaceById(workspaceId);
          if (cancelled) return;

          const fallbackAccountId = fallbackWorkspace?.accountId?.trim();
          const canAccessFallbackAccount =
            typeof fallbackAccountId === "string" &&
            fallbackAccountId.length > 0 &&
            accessibleAccountIds.includes(fallbackAccountId);

          if (
            fallbackWorkspace &&
            canAccessFallbackAccount &&
            fallbackAccountId !== accountId
          ) {
            const query = typeof window === "undefined" ? "" : window.location.search;
            const targetPath = `/${encodeURIComponent(fallbackAccountId)}/workspace/${encodeURIComponent(workspaceId)}`;
            router.replace(query ? `${targetPath}${query}` : targetPath);
            return;
          }

          router.replace(`/${encodeURIComponent(accountId)}?context=unavailable`);
          return;
        }
        setWorkspace(detail);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[useWorkspaceDetail] Failed to load workspace:", error);
        }
        if (!cancelled) {
          setWorkspace(null);
          setLoadState("error");
        }
      }
    }

    void loadWorkspace();

    return () => {
      cancelled = true;
    };
  }, [accountId, accountsHydrated, router, workspaceId, accessibleAccountIds]);

  return { workspace, loadState, setWorkspace };
}
