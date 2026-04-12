"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Table2 } from "lucide-react";

import { useAuth } from "@/modules/platform/api";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import type { DatabaseSnapshot as Database } from "../../../subdomains/database/application/dto/database.dto";
import { getDatabases } from "../queries";
import { DatabaseDialog } from "./DatabaseDialog";

/**
 * KnowledgeDatabasesRouteScreen
 * Route-level screen component for /knowledge-database/databases.
 * Encapsulates data-loading and layout so the Next.js route file stays thin.
 */
export interface KnowledgeDatabasesRouteScreenProps {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly currentUserId?: string | null;
}

export function KnowledgeDatabasesRouteScreen({
  accountId,
  workspaceId,
  currentUserId,
}: KnowledgeDatabasesRouteScreenProps) {
  const router = useRouter();
  const { state: authState } = useAuth();

  const resolvedAccountId = accountId.trim();
  const resolvedWorkspaceId = workspaceId.trim();
  const resolvedCurrentUserId = (currentUserId?.trim() || authState.user?.id) ?? "";
  const workspaceBasePath =
    resolvedAccountId && resolvedWorkspaceId
      ? `/${encodeURIComponent(resolvedAccountId)}/${encodeURIComponent(resolvedWorkspaceId)}`
      : resolvedAccountId
        ? `/${encodeURIComponent(resolvedAccountId)}`
        : "/";
  const overviewHref = resolvedWorkspaceId
    ? `${workspaceBasePath}?tab=Overview&panel=knowledge-databases`
    : resolvedAccountId
      ? `/${encodeURIComponent(resolvedAccountId)}`
      : "/";

  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    if (!resolvedAccountId || !resolvedWorkspaceId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getDatabases(resolvedAccountId, resolvedWorkspaceId);
      setDatabases(data);
    } finally {
      setLoading(false);
    }
  }, [resolvedAccountId, resolvedWorkspaceId]);

  useEffect(() => { load(); }, [load]);

  function handleSuccess(databaseId?: string) {
    if (databaseId) {
      if (resolvedAccountId && resolvedWorkspaceId) {
        router.push(
          `${workspaceBasePath}/knowledge-database/databases/${encodeURIComponent(databaseId)}`,
        );
      } else {
        router.push(resolvedAccountId ? `/${encodeURIComponent(resolvedAccountId)}` : "/");
      }
    } else {
      load();
    }
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge Database</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">資料庫</h1>
        <p className="text-sm text-muted-foreground">
          結構化資料表、看板、日曆與多視圖管理，對應 Notion Database 能力。
        </p>
      </header>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push(overviewHref)}
          className="inline-flex items-center rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          返回 Knowledge Hub
        </button>
        <Button
          size="sm"
          className="ml-auto"
          disabled={!resolvedAccountId || !resolvedWorkspaceId}
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          新增資料庫
        </Button>
      </div>

      <DatabaseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        accountId={resolvedAccountId}
        workspaceId={resolvedWorkspaceId}
        currentUserId={resolvedCurrentUserId}
        onSuccess={handleSuccess}
      />

      {!resolvedAccountId || !resolvedWorkspaceId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          尚未取得帳號/工作區情境，請先登入或切換帳號。
        </p>
      ) : loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      ) : databases.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/10 p-10 text-center">
          <Table2 className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">尚無資料庫。點擊「新增資料庫」開始建立。</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {databases.map((db) => (
            <Card
              key={db.id}
              className="cursor-pointer hover:bg-muted/10 transition-colors"
              onClick={() => handleSuccess(db.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                  {db.icon ? (
                    <span className="text-lg leading-none">{db.icon}</span>
                  ) : (
                    <Table2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <CardTitle className="line-clamp-1 text-sm font-medium">{db.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {db.description && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{db.description}</p>
                )}
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70">
                  <span>{db.fields.length} 個欄位</span>
                  <span>·</span>
                  <span>{db.viewIds.length} 個視圖</span>
                </div>
                <p className="text-[10px] text-muted-foreground/50">
                  {new Date(db.updatedAtISO).toLocaleDateString("zh-TW")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
