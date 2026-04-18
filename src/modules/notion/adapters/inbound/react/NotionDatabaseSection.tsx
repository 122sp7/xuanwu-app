"use client";

/**
 * NotionDatabaseSection — notion.database tab — structured database list.
 */

import { LayoutGrid } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@ui-shadcn/ui/button";
import type { DatabaseSnapshot } from "../../../subdomains/database/domain/entities/Database";
import { queryDatabasesAction } from "../server-actions/database-actions";

interface NotionDatabaseSectionProps {
  workspaceId: string;
  accountId: string;
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
                  className="rounded-lg border border-border/40 px-3 py-2 text-sm"
                >
                  <span className="font-medium">{db.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {db.properties.length} 個欄位
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  ) as React.ReactElement;
}
