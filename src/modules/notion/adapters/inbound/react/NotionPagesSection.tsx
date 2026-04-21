"use client";

/**
 * NotionPagesSection — notion.pages tab — hierarchical page list.
 *
 * Closed-loop design: pages are the knowledge output of document parsing.
 * Each page can be sent to workspace.task-formation as a task generation source.
 */

import { Button, Input } from "@packages";
import { FileText, Plus, ListPlus, Pencil, Archive } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import type { PageSnapshot } from "../../../subdomains/page/domain/entities/Page";
import {
  queryPages,
  createPage,
  renamePage,
  archivePage,
} from "../../../adapters/outbound/firebase-composition";

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
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const reloadPages = async () => {
    const result = await queryPages({ workspaceId, accountId });
    setPages(Array.isArray(result) ? result : []);
  };

  const load = () => {
    startTransition(async () => {
      await reloadPages();
      setLoaded(true);
    });
  };

  // Auto-load on mount
  useEffect(() => {
    load();
  }, [workspaceId, accountId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    startTransition(async () => {
      await createPage({
        workspaceId,
        accountId,
        title: newTitle.trim(),
        createdByUserId: currentUserId,
      });
      setNewTitle("");
      await reloadPages();
    });
  };

  const handleStartRename = (page: PageSnapshot) => {
    setEditingPageId(page.id);
    setRenameTitle(page.title);
  };

  const handleRename = (pageId: string) => {
    const nextTitle = renameTitle.trim();
    if (!nextTitle) return;
    startTransition(async () => {
      await renamePage(pageId, nextTitle);
      setEditingPageId(null);
      setRenameTitle("");
      await reloadPages();
    });
  };

  const handleArchive = (pageId: string) => {
    startTransition(async () => {
      await archivePage(pageId);
      if (editingPageId === pageId) {
        setEditingPageId(null);
        setRenameTitle("");
      }
      await reloadPages();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">頁面</h2>
        </div>
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
                  <div className="min-w-0 flex-1">
                    {editingPageId === page.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={renameTitle}
                          onChange={(e) => setRenameTitle(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleRename(page.id)}
                          className="h-7 text-xs"
                          disabled={isPending}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleRename(page.id)}
                          disabled={isPending || !renameTitle.trim()}
                        >
                          儲存
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            setEditingPageId(null);
                            setRenameTitle("");
                          }}
                          disabled={isPending}
                        >
                          取消
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{page.title}</span>
                        <span className="text-xs text-muted-foreground">{page.status}</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex items-center gap-1">
                    {editingPageId !== page.id && page.status === "active" && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2"
                          onClick={() => handleStartRename(page)}
                          disabled={isPending}
                          title="重新命名"
                        >
                          <Pencil className="size-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-muted-foreground hover:text-destructive"
                          onClick={() => handleArchive(page.id)}
                          disabled={isPending}
                          title="封存"
                        >
                          <Archive className="size-3" />
                        </Button>
                      </>
                    )}
                    <Link
                      href={taskFormationHref(accountId, workspaceId)}
                      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                      title="發送至任務形成"
                    >
                      <ListPlus className="size-3" />
                      → 任務形成
                    </Link>
                  </div>
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
