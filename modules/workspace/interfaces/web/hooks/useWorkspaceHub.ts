"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceEntity } from "../../api/contracts";
import { createWorkspace, getWorkspacesForAccount } from "../../api/facade";

export type WorkspaceHubLoadState = "idle" | "loading" | "loaded" | "error";

interface UseWorkspaceHubOptions {
  readonly accountId: string | null | undefined;
  readonly accountType: "user" | "organization";
}

function sortWorkspaces(items: WorkspaceEntity[]) {
  return [...items].sort((left, right) =>
    left.name.localeCompare(right.name, "en", { sensitivity: "base" }),
  );
}

export function useWorkspaceHub({ accountId, accountType }: UseWorkspaceHubOptions) {
  const [workspaces, setWorkspaces] = useState<WorkspaceEntity[]>([]);
  const [loadState, setLoadState] = useState<WorkspaceHubLoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  const fetchWorkspaces = useCallback(
    async (nextAccountId: string, failureMessage: string) => {
      try {
        const nextWorkspaces = await getWorkspacesForAccount(nextAccountId);
        setWorkspaces(sortWorkspaces(nextWorkspaces));
        setLoadState("loaded");
        setErrorMessage(null);
        return nextWorkspaces;
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[useWorkspaceHub] Failed to load workspaces:", error);
        }
        setWorkspaces([]);
        setLoadState("error");
        setErrorMessage(failureMessage);
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    async function loadWorkspaces() {
      if (!accountId) {
        setWorkspaces([]);
        setLoadState("loaded");
        setErrorMessage(null);
        return;
      }

      setLoadState("loading");
      setErrorMessage(null);

      await fetchWorkspaces(
        accountId,
        "Unable to load workspace records right now.",
      );
    }

    void loadWorkspaces();
  }, [accountId, fetchWorkspaces]);

  const refreshWorkspaces = useCallback(async () => {
    if (!accountId) {
      setWorkspaces([]);
      setLoadState("loaded");
      setErrorMessage(null);
      return;
    }

    await fetchWorkspaces(
      accountId,
      "工作區已建立，但清單更新失敗。請重新整理頁面以查看新的工作區。",
    );
  }, [accountId, fetchWorkspaces]);

  const createWorkspaceForAccount = useCallback(
    async (name: string): Promise<CommandResult> => {
      const nextWorkspaceName = name.trim();

      if (!accountId) {
        const error = commandFailureFrom(
          "WORKSPACE_ACCOUNT_REQUIRED",
          "帳號資訊已失效，請重新整理頁面後再建立工作區。",
        );
        setCreateError(error.error.message);
        return error;
      }

      if (!nextWorkspaceName) {
        const error = commandFailureFrom("WORKSPACE_NAME_REQUIRED", "請輸入工作區名稱。");
        setCreateError(error.error.message);
        return error;
      }

      setIsCreatingWorkspace(true);
      setCreateError(null);

      const result = await createWorkspace({
        name: nextWorkspaceName,
        accountId,
        accountType,
      });

      if (!result.success) {
        setCreateError(result.error.message);
        setIsCreatingWorkspace(false);
        return result;
      }

      await refreshWorkspaces();
      setIsCreatingWorkspace(false);
      return result;
    },
    [accountId, accountType, refreshWorkspaces],
  );

  const workspaceStats = useMemo(() => {
    return {
      total: workspaces.length,
      active: workspaces.filter((workspace) => workspace.lifecycleState === "active").length,
      preparatory: workspaces.filter((workspace) => workspace.lifecycleState === "preparatory").length,
    };
  }, [workspaces]);

  const clearCreateError = useCallback(() => {
    setCreateError(null);
  }, []);

  return {
    createError,
    clearCreateError,
    createWorkspaceForAccount,
    errorMessage,
    isCreatingWorkspace,
    loadState,
    refreshWorkspaces,
    workspaceStats,
    workspaces,
  };
}
