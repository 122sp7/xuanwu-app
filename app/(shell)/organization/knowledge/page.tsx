"use client";

import { useEffect, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import { OrganizationKnowledgeTab } from "@/modules/knowledge";
import { getWorkspacesForAccount } from "@/modules/workspace";
import { isOrganizationAccount } from "../_utils";

export default function OrganizationKnowledgePage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  const [workspaces, setWorkspaces] = useState<
    Awaited<ReturnType<typeof getWorkspacesForAccount>>
  >([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  useEffect(() => {
    if (!activeOrganizationId) return;
    let cancelled = false;

    setLoadState("loading");
    getWorkspacesForAccount(activeOrganizationId)
      .then((data) => {
        if (!cancelled) {
          setWorkspaces(data);
          setLoadState("loaded");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWorkspaces([]);
          setLoadState("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId]);

  if (!activeOrganizationId) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">知識</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          組織下各工作區的知識庫狀態總覽。
        </p>
      </div>

      {loadState === "loading" && (
        <p className="text-sm text-muted-foreground">載入知識資料中…</p>
      )}
      {loadState === "error" && (
        <p className="text-sm text-destructive">讀取知識資料失敗，請稍後重新整理頁面。</p>
      )}
      {loadState === "loaded" && <OrganizationKnowledgeTab workspaces={workspaces} />}
    </div>
  );
}
