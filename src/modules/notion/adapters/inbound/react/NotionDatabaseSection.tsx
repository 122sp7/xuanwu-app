"use client";

/**
 * NotionDatabaseSection — notion.database tab — structured database list.
 *
 * Closed-loop design: databases hold structured workspace data (requirements,
 * milestones, personnel). Each database can be sent to workspace.task-formation.
 */

import { Button, Input } from "@packages";
import { LayoutGrid, ListPlus, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import type { DatabaseSnapshot } from "../../../subdomains/database/domain/entities/Database";
import { queryDatabasesAction, createDatabaseAction } from "../server-actions/database-actions";

interface NotionDatabaseSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId: string;
}

function taskFormationHref(accountId: string, workspaceId: string) {
  return `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?tab=TaskFormation`;
}

export function NotionDatabaseSection({
  workspaceId,
  accountId,
  currentUserId,
}: NotionDatabaseSectionProps): React.ReactElement {
  const [databases, setDatabases] = useState<DatabaseSnapshot[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  const load = () => {
    startTransition(async () => {
      const result = await queryDatabasesAction({ workspaceId, accountId });
      setDatabases(Array.isArray(result) ? result : []);
      setLoaded(true);
    });
  };

  // Auto-load on mount
  useEffect(() => {
    load();
  }, [workspaceId, accountId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = () => {
    if (!newName.trim()) return;
    startTransition(async () => {
      await createDatabaseAction({
        workspaceId,
        accountId,
        name: newName.trim(),
        description: newDescription.trim() || undefined,
        createdByUserId: currentUserId,
      });
      setNewName("");
      setNewDescription("");
      const result = await queryDatabasesAction({ workspaceId, accountId });
      setDatabases(Array.isArray(result) ? result : []);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">資料庫</h2>
        </div>
      </div>

      {loaded && (
        <>
          <div className="space-y-2">
            <Input
              placeholder="新資料庫名稱…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="h-8 text-sm"
              disabled={isPending}
            />
            <div className="flex gap-2">
              <Input
                placeholder="描述（可選）…"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="h-8 text-sm"
                disabled={isPending}
              />
              <Button size="sm" onClick={handleCreate} disabled={isPending || !newName.trim()}>
                <Plus className="size-3.5" />
              </Button>
            </div>
          </div>

          {databases.length === 0 ? (
            <p className="text-sm text-muted-foreground">尚無資料庫，請建立第一個資料庫。</p>
          ) : (
            <ul className="space-y-2">
              {databases.map((db) => (
                <li
                  key={db.id}
                  className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium">{db.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {db.properties.length} 個欄位
                    </span>
                    {db.description && (
                      <p className="mt-1 text-xs text-muted-foreground">{db.description}</p>
                    )}
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
          {databases.length > 0 && (
            <p className="text-xs text-muted-foreground">
              點擊資料庫右側「→ 任務形成」可將此資料庫作為任務生成的結構化來源。
            </p>
          )}
        </>
      )}

      {!loaded && isPending && (
        <p className="text-sm text-muted-foreground">載入中…</p>
      )}
    </div>
  ) as React.ReactElement;
}
