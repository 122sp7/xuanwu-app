"use client";

import { useEffect, useState, useTransition } from "react";
import { History, Trash2 } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getVersions } from "../queries/knowledge-collaboration.queries";
import { deleteVersion } from "../_actions/knowledge-collaboration.actions";
import type { Version } from "../../domain/entities/version.entity";

interface VersionHistoryPanelProps {
  accountId: string;
  contentId: string;
  currentUserId: string;
}

export function VersionHistoryPanel({ accountId, contentId, currentUserId }: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let disposed = false;
    void Promise.resolve().then(async () => {
      if (disposed) return;
      setLoading(true);
      try {
        const data = await getVersions(accountId, contentId);
        if (!disposed) { setVersions(data); setLoading(false); }
      } catch {
        if (!disposed) setLoading(false);
      }
    });
    return () => { disposed = true; };
  }, [accountId, contentId]);

  function handleDelete(versionId: string) {
    startTransition(async () => {
      await deleteVersion({ id: versionId, accountId });
      setVersions((prev) => prev.filter((v) => v.id !== versionId));
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">版本歷史</span>
        {versions.length > 0 && (
          <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">{versions.length}</Badge>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
        </div>
      ) : versions.length === 0 ? (
        <p className="text-xs text-muted-foreground">尚無已儲存的版本快照。</p>
      ) : (
        <ol className="space-y-2">
          {versions.map((v, idx) => (
            <li key={v.id} className="flex items-start gap-3 rounded-md border border-border/60 bg-background px-3 py-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                {versions.length - idx}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{v.label || `版本 ${versions.length - idx}`}</p>
                {v.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{v.description}</p>
                )}
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {new Date(v.createdAtISO).toLocaleString("zh-TW", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {v.createdByUserId === currentUserId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  disabled={isPending}
                  onClick={() => handleDelete(v.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
