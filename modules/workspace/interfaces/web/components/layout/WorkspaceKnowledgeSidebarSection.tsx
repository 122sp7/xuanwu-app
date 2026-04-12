"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

interface WorkspaceLinkItem {
  id: string;
  name: string;
  href: string;
}

interface WorkspaceKnowledgeSidebarSectionProps {
  readonly pathname: string;
  readonly workspacesHydrated: boolean;
  readonly allWorkspaceLinks: WorkspaceLinkItem[];
  readonly activeAccountId: string | null;
  readonly activeWorkspaceId: string | null;
  readonly creatingKind: "page" | "database" | null;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
  readonly onQuickCreatePage: () => void | Promise<void>;
}

function withContextQuery(href: string, accountId: string | null, workspaceId: string | null): string {
  if (!accountId && !workspaceId) {
    return href;
  }

  const [path, search = ""] = href.split("?");
  const params = new URLSearchParams(search);

  if (accountId) {
    params.set("accountId", accountId);
  }

  if (workspaceId) {
    params.set("workspaceId", workspaceId);
  }

  const query = params.toString();
  return query.length > 0 ? `${path}?${query}` : path;
}

export function WorkspaceKnowledgeSidebarSection({
  pathname,
  workspacesHydrated,
  allWorkspaceLinks,
  activeAccountId,
  activeWorkspaceId,
  creatingKind,
  onSelectWorkspace,
  onQuickCreatePage,
}: WorkspaceKnowledgeSidebarSectionProps) {
  const [isKnowledgeWorkspacesExpanded, setIsKnowledgeWorkspacesExpanded] = useState(
    () => Boolean(activeWorkspaceId),
  );

  const workspaceBasePath =
    activeAccountId && activeWorkspaceId
      ? `/${encodeURIComponent(activeAccountId)}/${encodeURIComponent(activeWorkspaceId)}`
      : "";

  const contextualPagesHref = workspaceBasePath
    ? `${workspaceBasePath}/knowledge/pages`
    : withContextQuery("/knowledge/pages", activeAccountId, activeWorkspaceId);

  return (
    <nav className="space-y-0.5" aria-label="Knowledge navigation">
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        知識管理
      </p>
      {(activeAccountId || activeWorkspaceId) && (
        <p className="px-2 pb-1 text-[11px] text-muted-foreground">
          {activeAccountId ? `Account: ${activeAccountId.slice(0, 8)}` : "Account: -"}
          {" · "}
          {activeWorkspaceId ? `Workspace: ${activeWorkspaceId.slice(0, 8)}` : "Workspace: -"}
        </p>
      )}
      <div className="relative flex items-center rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
        <Link
          href={contextualPagesHref}
          aria-current={pathname.includes("/knowledge/pages") ? "page" : undefined}
          className={`flex-1 ${
            pathname.includes("/knowledge/pages")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          頁面
        </Link>
        <button
          type="button"
          onClick={() => void onQuickCreatePage()}
          disabled={creatingKind !== null}
          className="ml-1 inline-flex size-5 items-center justify-center rounded transition hover:bg-muted-foreground/15 disabled:opacity-50"
          aria-label="快速新增頁面"
          title="新增頁面"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
      {(
        [
          {
            href: workspaceBasePath
              ? `${workspaceBasePath}?tab=Overview&panel=knowledge-pages`
              : "/",
            label: "Knowledge Hub",
          },
          {
            href: workspaceBasePath
              ? `${workspaceBasePath}/knowledge/block-editor`
              : "/",
            label: "區塊編輯器",
          },
        ] as const
      ).map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const contextualHref = workspaceBasePath
          ? item.href
          : withContextQuery(item.href, activeAccountId, activeWorkspaceId);
        return (
          <Link
            key={item.href}
            href={contextualHref}
            aria-current={active ? "page" : undefined}
            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <div className="my-1.5 border-t border-border/40" />

      <button
        type="button"
        onClick={() => {
          setIsKnowledgeWorkspacesExpanded((prev) => !prev);
        }}
        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        aria-expanded={isKnowledgeWorkspacesExpanded}
      >
        <span>Workspaces</span>
        {isKnowledgeWorkspacesExpanded ? (
          <ChevronDown className="size-3.5" />
        ) : (
          <ChevronRight className="size-3.5" />
        )}
      </button>

      {isKnowledgeWorkspacesExpanded && (
        <div className="space-y-0.5 pl-2">
          {!workspacesHydrated ? (
            <p className="px-2 py-1.5 text-[11px] text-muted-foreground">工作區載入中...</p>
          ) : allWorkspaceLinks.length === 0 ? (
            <p className="px-2 py-1.5 text-[11px] text-muted-foreground">目前帳號沒有工作區</p>
          ) : (
            allWorkspaceLinks.map((workspace) => {
              const active = activeWorkspaceId === workspace.id;
              return (
                <Link
                  key={workspace.id}
                  href={workspace.href}
                  onClick={() => {
                    onSelectWorkspace(workspace.id);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  title={workspace.name}
                >
                  <span className="truncate">{workspace.name}</span>
                </Link>
              );
            })
          )}
        </div>
      )}
    </nav>
  );
}
