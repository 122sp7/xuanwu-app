"use client";

import { ChevronDown, ChevronRight, FilePlus, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@ui-shadcn/ui/button";
import type { KnowledgePageTreeNode } from "../../domain/aggregates/KnowledgePage";
import { PageDialog } from "./PageDialog";

export interface PageTreeViewProps {
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
  node, accountId, workspaceId, currentUserId, allowCreate, onPageClick, onCreated, depth,
}: { node: KnowledgePageTreeNode; accountId: string; workspaceId?: string; currentUserId: string; allowCreate: boolean; onPageClick?: (id: string) => void; onCreated?: () => void; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const [addChildOpen, setAddChildOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const canCreate = allowCreate && Boolean(workspaceId);

  return (
    <li>
      <div className="group flex items-center gap-1 rounded-md px-2 py-1 hover:bg-muted/30" style={{ paddingLeft: `${8 + depth * 16}px` }}>
        <button type="button" className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground" onClick={() => setExpanded((v) => !v)}>
          {hasChildren ? (expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />) : <FileText className="h-3.5 w-3.5" />}
        </button>
        <button type="button" className="min-w-0 flex-1 truncate text-left text-sm" onClick={() => onPageClick?.(node.id)}>
          {node.title}
        </button>
        {canCreate && (
          <button type="button" className="invisible shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground group-hover:visible" onClick={(e) => { e.stopPropagation(); setAddChildOpen(true); }}>
            <FilePlus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {expanded && hasChildren && (
        <ul>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} accountId={accountId} workspaceId={workspaceId} currentUserId={currentUserId} allowCreate={allowCreate} onPageClick={onPageClick} onCreated={onCreated} depth={depth + 1} />
          ))}
        </ul>
      )}
      {addChildOpen && (
        <PageDialog open={addChildOpen} onOpenChange={setAddChildOpen} accountId={accountId} workspaceId={workspaceId ?? ""} currentUserId={currentUserId} parentPageId={node.id} onSuccess={onCreated} />
      )}
    </li>
  );
}

export function PageTreeView({ nodes, accountId, workspaceId, currentUserId, allowCreate = true, emptyStateDescription, onPageClick, onCreated }: PageTreeViewProps) {
  const [createOpen, setCreateOpen] = useState(false);
  if (!nodes.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-muted-foreground">
        <FileText className="h-8 w-8 opacity-40" />
        <p>{emptyStateDescription ?? "尚無頁面"}</p>
        {allowCreate && workspaceId && (
          <>
            <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>新增頁面</Button>
            <PageDialog open={createOpen} onOpenChange={setCreateOpen} accountId={accountId} workspaceId={workspaceId} currentUserId={currentUserId} parentPageId={null} onSuccess={onCreated} />
          </>
        )}
      </div>
    );
  }
  return <ul className="space-y-0.5">{nodes.map((n) => <TreeNode key={n.id} node={n} accountId={accountId} workspaceId={workspaceId} currentUserId={currentUserId} allowCreate={allowCreate} onPageClick={onPageClick} onCreated={onCreated} depth={0} />)}</ul>;
}
