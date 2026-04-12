"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/modules/platform/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import type { KnowledgePageTreeNode } from "../../../subdomains/knowledge/application/dto/knowledge.dto";
import { getKnowledgePageTree, getKnowledgePageTreeByWorkspace } from "../queries";
import { PageTreePanel } from "./PageTreePanel";

/**
 * KnowledgePagesPanel
 * Route-level screen component for /knowledge/pages.
 * Encapsulates data-loading, scope resolution and layout so that the
 * Next.js route file stays thin (params/context wiring only).
 */
export interface KnowledgePagesPanelProps {
  readonly accountId: string;
  readonly workspaceId?: string | null;
  readonly currentUserId?: string | null;
  readonly scope?: "workspace" | "account";
}

export function KnowledgePagesPanel({
  accountId,
  workspaceId,
  currentUserId,
  scope,
}: KnowledgePagesPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: authState } = useAuth();

  const resolvedAccountId = accountId.trim();
  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";
  const scopeParam = scope ?? searchParams.get("scope")?.trim() ?? "";
  const isAccountSummary = scopeParam === "account";
  const resolvedWorkspaceId = isAccountSummary ? "" : workspaceId?.trim() || requestedWorkspaceId || "";
  const resolvedCurrentUserId = (currentUserId?.trim() || authState.user?.id) ?? "";
  const workspaceBasePath =
    resolvedAccountId && resolvedWorkspaceId
      ? `/${encodeURIComponent(resolvedAccountId)}/${encodeURIComponent(resolvedWorkspaceId)}`
      : resolvedAccountId
        ? `/${encodeURIComponent(resolvedAccountId)}`
        : "/";
  const overviewHref = resolvedWorkspaceId
    ? `${workspaceBasePath}?tab=Overview&panel=knowledge-pages`
    : resolvedAccountId
      ? `/${encodeURIComponent(resolvedAccountId)}`
      : "/";

  function buildPageDetailHref(pageId: string) {
    if (resolvedAccountId && resolvedWorkspaceId) {
      return `${workspaceBasePath}/knowledge/pages/${encodeURIComponent(pageId)}`;
    }
    return `/knowledge/pages/${encodeURIComponent(pageId)}${
      resolvedWorkspaceId ? `?workspaceId=${encodeURIComponent(resolvedWorkspaceId)}` : ""
    }`;
  }

  const [nodes, setNodes] = useState<KnowledgePageTreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!resolvedAccountId) {
      setLoading(false);
      return;
    }
    if (!isAccountSummary && !resolvedWorkspaceId) {
      setNodes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const tree = isAccountSummary
        ? await getKnowledgePageTree(resolvedAccountId)
        : await getKnowledgePageTreeByWorkspace(resolvedAccountId, resolvedWorkspaceId);
      setNodes(tree);
    } finally {
      setLoading(false);
    }
  }, [resolvedAccountId, isAccountSummary, resolvedWorkspaceId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">?</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isAccountSummary ? "secondary" : "outline"}>
            {isAccountSummary ? "Account Summary" : "Workspace Scope"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {isAccountSummary
              ? "Account summary mode: showing account-level pages and metadata."
              : "Workspace scope mode: showing pages for the selected workspace."}
          </p>
        </div>
      </header>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push(overviewHref)}
          className="inline-flex items-center rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          餈? Knowledge Hub
        </button>
      </div>

      {!resolvedAccountId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          Account is required to load pages.
        </p>
      ) : !isAccountSummary && !resolvedWorkspaceId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          Workspace ID is required when viewing workspace-scoped pages.
        </p>
      ) : loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <PageTreePanel
          nodes={nodes}
          accountId={resolvedAccountId}
          workspaceId={resolvedWorkspaceId || undefined}
          currentUserId={resolvedCurrentUserId}
          allowCreate={!isAccountSummary && Boolean(resolvedWorkspaceId)}
          emptyStateDescription={
            isAccountSummary
              ? "No pages in account summary yet."
              : "No pages in this workspace yet."
          }
          onPageClick={(pageId) => router.push(buildPageDetailHref(pageId))}
          onCreated={() => load()}
        />
      )}
    </div>
  );
}

