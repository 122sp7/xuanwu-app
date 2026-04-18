"use client";

/**
 * NotionDatabaseSection — notion.database tab — structured database list.
 *
 * Closed-loop design: databases hold structured workspace data (requirements,
 * milestones, personnel). Each database can be sent to workspace.task-formation.
 */

import { LayoutGrid, ListPlus } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@ui-shadcn/ui/button";
import type { DatabaseSnapshot } from "../../../subdomains/database/domain/entities/Database";
import { queryDatabasesAction } from "../server-actions/database-actions";

interface NotionDatabaseSectionProps {
  workspaceId: string;
  accountId: string;
}

function taskFormationHref(accountId: string, workspaceId: string) {
  return `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?tab=TaskFormation`;
}

export function NotionDatabaseSection({
  workspaceId,
  accountId,
}: NotionDatabaseSectionProps): React.ReactElement {
  const [databases, setDatabases] = useState<DatabaseSnapshot[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const load = () => {
    startTransition(async () => {
      const result = await queryDatabasesAction({ workspaceId, accountId });
      setDatabases(Array.isArray(result) ? result : []);
      setLoaded(true);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">資料庫</h2>
        </div>
        {!loaded && (
          <Button size="sm" variant="ghost" onClick={load} disabled={isPending}>
            {isPending ? "載入中…" : "載入資料庫"}
          </Button>
        )}
      </div>

      {loaded && (
        <>
          {databases.length === 0 ? (
            <p className="text-sm text-muted-foreground">尚無資料庫。</p>
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
    </div>
  ) as React.ReactElement;
}
