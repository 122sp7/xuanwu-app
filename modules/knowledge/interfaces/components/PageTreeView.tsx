"use client";

import { ChevronDown, ChevronRight, FilePlus, FileText, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@ui-shadcn/ui/button";

import type { KnowledgePageTreeNode } from "../../domain/entities/knowledge-page.entity";
import { PageDialog } from "./PageDialog";

interface PageTreeViewProps {
  nodes: KnowledgePageTreeNode[];
  accountId: string;
  workspaceId?: string;
  currentUserId: string;
  allowCreate?: boolean;
  emptyStateDescription?: string;
  onPageClick?: (pageId: string) => void;
  onCreated?: () => void;
}

function TreeNode({
  node,
  accountId,
  workspaceId,
  currentUserId,
  allowCreate,
  onPageClick,
  onCreated,
  depth,
}: {
  node: KnowledgePageTreeNode;
  accountId: string;
  workspaceId?: string;
  currentUserId: string;
  allowCreate: boolean;
  onPageClick?: (pageId: string) => void;
  onCreated?: () => void;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(depth < 1);
  const [addChildOpen, setAddChildOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const canCreate = allowCreate && Boolean(workspaceId);

  return (
    <li>
      <div
        className="group flex items-center gap-1 rounded-md px-2 py-1 hover:bg-muted/30"
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        <button
          type="button"
          className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "折疊" : "展開"}
        >
          {hasChildren ? (
            expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <FileText className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          type="button"
          className="min-w-0 flex-1 truncate text-left text-sm"
          onClick={() => onPageClick?.(node.id)}
        >
          {node.title}
        </button>

        {canCreate ? (
          <button
            type="button"
            className="invisible shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground group-hover:visible"
            onClick={(e) => { e.stopPropagation(); setAddChildOpen(true); }}
            title="新增子頁面"
          >
            <FilePlus className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {expanded && hasChildren && (
        <ul className="list-none">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              accountId={accountId}
              workspaceId={workspaceId}
              currentUserId={currentUserId}
              allowCreate={canCreate}
              onPageClick={onPageClick}
              onCreated={onCreated}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}

      {canCreate && workspaceId ? (
        <PageDialog
          open={addChildOpen}
          onOpenChange={setAddChildOpen}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
          parentPageId={node.id}
          onSuccess={() => onCreated?.()}
        />
      ) : null}
    </li>
  );
}

export function PageTreeView({
  nodes,
  accountId,
  workspaceId,
  currentUserId,
  allowCreate = true,
  emptyStateDescription = "尚無頁面。點擊「新增頁面」開始建立。",
  onPageClick,
  onCreated,
}: PageTreeViewProps) {
  const [addRootOpen, setAddRootOpen] = useState(false);
  const canCreate = allowCreate && Boolean(workspaceId);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">頁面</p>
        {canCreate ? (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setAddRootOpen(true)}
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> 新增頁面
          </Button>
        ) : null}
      </div>

      {nodes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/10 p-8 text-center">
          <FileText className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">{emptyStateDescription}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border/60 bg-background py-1">
          <ul className="list-none">
            {nodes.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                accountId={accountId}
                workspaceId={workspaceId}
                currentUserId={currentUserId}
                allowCreate={canCreate}
                onPageClick={onPageClick}
                onCreated={onCreated}
                depth={0}
              />
            ))}
          </ul>
        </div>
      )}

      {canCreate && workspaceId ? (
        <PageDialog
          open={addRootOpen}
          onOpenChange={setAddRootOpen}
          accountId={accountId}
          workspaceId={workspaceId}
          currentUserId={currentUserId}
          parentPageId={null}
          onSuccess={() => { onCreated?.(); setAddRootOpen(false); }}
        />
      ) : null}
    </div>
  );
}
