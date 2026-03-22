"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { buildWikiBetaKnowledgeTree } from "../../application";
import type {
  WikiBetaAccountKnowledgeNode,
  WikiBetaAccountSeed,
  WikiBetaKnowledgeItemNode,
} from "../../domain";

interface WikiBetaHubViewProps {
  readonly onGoRagTest: () => void;
}

function getItemStyle(enabled: boolean): string {
  if (enabled) {
    return "text-muted-foreground hover:text-foreground";
  }
  return "text-muted-foreground/70";
}

function getAccountChipStyle(isActive: boolean): string {
  if (isActive) {
    return "border-primary/40 bg-primary/10 text-primary";
  }
  return "border-border/60 bg-muted/30 text-muted-foreground";
}

function KnowledgeItem({ item }: { readonly item: WikiBetaKnowledgeItemNode }) {
  return (
    <li className="flex items-center gap-2 text-xs">
      <span aria-hidden className="text-muted-foreground/60">
        •
      </span>
      {item.enabled ? (
        <Link href={item.href} className={getItemStyle(true)}>
          {item.label}
        </Link>
      ) : (
        <span className={getItemStyle(false)}>{item.label} (planned)</span>
      )}
    </li>
  );
}

function AccountTreeNode({ node }: { readonly node: WikiBetaAccountKnowledgeNode }) {
  return (
    <li className="rounded-lg border border-border/60 bg-background p-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold text-foreground">{node.accountName}</p>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase ${getAccountChipStyle(node.isActive)}`}>
          {node.accountType}
        </span>
      </div>

      {node.accountType === "organization" && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {node.membersHref ? (
            <Link href={node.membersHref} className="text-muted-foreground hover:text-foreground">
              Members
            </Link>
          ) : null}
          {node.teamsHref ? (
            <Link href={node.teamsHref} className="text-muted-foreground hover:text-foreground">
              Teams (Permission)
            </Link>
          ) : null}
        </div>
      )}

      <div className="mt-3 space-y-2">
        {node.workspaces.length === 0 ? (
          <p className="text-xs text-muted-foreground">暫無工作區</p>
        ) : (
          node.workspaces.map((workspace) => (
            <div key={workspace.workspaceId} className="rounded-md border border-border/60 bg-muted/20 p-2">
              <Link href={workspace.href} className="text-xs font-medium text-primary hover:underline">
                {workspace.workspaceName}
              </Link>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">Knowledge Base</p>
              <ul className="mt-1 space-y-1">
                {workspace.knowledgeBaseItems.map((item) => (
                  <KnowledgeItem key={item.key} item={item} />
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </li>
  );
}

export function WikiBetaHubView({ onGoRagTest }: WikiBetaHubViewProps) {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const [knowledgeTree, setKnowledgeTree] = useState<WikiBetaAccountKnowledgeNode[]>([]);
  const [loadingTree, setLoadingTree] = useState(true);

  const accountSeeds = useMemo<WikiBetaAccountSeed[]>(() => {
    const personalUser = authState.user;
    const activeAccountId = appState.activeAccount?.id;
    const seeds: WikiBetaAccountSeed[] = [];

    if (personalUser) {
      seeds.push({
        accountId: personalUser.id,
        accountName: personalUser.name,
        accountType: "personal",
        isActive: activeAccountId === personalUser.id,
      });
    }

    const organizations = Object.values(appState.accounts);
    for (const organization of organizations) {
      seeds.push({
        accountId: organization.id,
        accountName: organization.name,
        accountType: "organization",
        isActive: activeAccountId === organization.id,
      });
    }

    return seeds;
  }, [appState.accounts, appState.activeAccount?.id, authState.user]);

  useEffect(() => {
    let disposed = false;

    async function loadTree() {
      setLoadingTree(true);
      try {
        const result = await buildWikiBetaKnowledgeTree(accountSeeds);
        if (!disposed) {
          setKnowledgeTree(result);
        }
      } catch (error) {
        console.error(error);
        if (!disposed) {
          setKnowledgeTree([]);
        }
      } finally {
        if (!disposed) {
          setLoadingTree(false);
        }
      }
    }

    void loadTree();

    return () => {
      disposed = true;
    };
  }, [accountSeeds]);

  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Wiki Beta</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Knowledge Base 拓樸（跟 App Rail 帳號脈絡）</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          先以最小可用模型對齊 Account → Workspaces → Knowledge Base。可直接點進現有路由，尚未落地的節點保留為 planned。
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-border/60 px-2 py-1">callable: rag_query</span>
        <span className="rounded-full border border-border/60 px-2 py-1">callable: rag_reindex_document</span>
        <span className="rounded-full border border-border/60 px-2 py-1">{"collection: accounts/{accountId}/documents"}</span>
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Account Topology</p>
        {loadingTree ? (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            載入 account/workspace 結構中...
          </div>
        ) : knowledgeTree.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">目前沒有可用的 account/workspace。</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {knowledgeTree.map((node) => (
              <AccountTreeNode key={node.accountId} node={node} />
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onGoRagTest}
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        前往 RAG Query
      </button>
    </section>
  );
}
