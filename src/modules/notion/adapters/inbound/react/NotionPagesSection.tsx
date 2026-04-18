"use client";

/**
 * NotionPagesSection — notion.pages tab — hierarchical page list.
 *
 * Closed-loop design: pages are the knowledge output of document parsing.
 * Each page can be sent to workspace.task-formation as a task generation source.
 */

import { FileText, Plus, ListPlus } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import type { PageSnapshot } from "../../../subdomains/page/domain/entities/Page";
import { queryPagesAction, createPageAction } from "../server-actions/page-actions";

interface NotionPagesSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId: string;
}

function taskFormationHref(accountId: string, workspaceId: string) {
  return `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?tab=TaskFormation`;
}

export function NotionPagesSection({
  workspaceId,
  accountId,
  currentUserId,
}: NotionPagesSectionProps): React.ReactElement {
  const [pages, setPages] = useState<PageSnapshot[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const load = () => {
    startTransition(async () => {
      const result = await queryPagesAction({ workspaceId, accountId });
      setPages(Array.isArray(result) ? result : []);
      setLoaded(true);
    });
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    startTransition(async () => {
      await createPageAction({
        workspaceId,
        accountId,
        title: newTitle.trim(),
        createdByUserId: currentUserId,
      });
      setNewTitle("");
      const result = await queryPagesAction({ workspaceId, accountId });
      setPages(Array.isArray(result) ? result : []);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">頁面</h2>
        </div>
        {!loaded && (
          <Button size="sm" variant="ghost" onClick={load} disabled={isPending}>
            {isPending ? "載入中…" : "載入頁面"}
          </Button>
        )}
      </div>

      {loaded && (
        <>
          <div className="flex gap-2">
            <Input
              placeholder="新頁面標題…"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="h-8 text-sm"
            />
            <Button size="sm" onClick={handleCreate} disabled={isPending || !newTitle.trim()}>
              <Plus className="size-3.5" />
            </Button>
          </div>

          {pages.length === 0 ? (
            <p className="text-sm text-muted-foreground">尚無頁面，請建立第一個頁面。</p>
          ) : (
            <ul className="space-y-2">
              {pages.map((page) => (
                <li
                  key={page.id}
                  className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium">{page.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{page.status}</span>
                  </div>
                  <Link
                    href={taskFormationHref(accountId, workspaceId)}
                    className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="發送至任務形成"
                  >
                    <ListPlus className="size-3" />
                    → 任務形成
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {pages.length > 0 && (
            <p className="text-xs text-muted-foreground">
              點擊頁面右側「→ 任務形成」可將此頁面作為任務生成的來源。
            </p>
          )}
        </>
      )}
    </div>
  ) as React.ReactElement;
}
