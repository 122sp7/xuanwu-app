"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, BookOpen, CircleDot, FileClock, Plus } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { getArticles } from "@/modules/knowledge-base/api";
import type { Article, ArticleStatus, VerificationState } from "@/modules/knowledge-base/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

const STATUS_CONFIG: Record<ArticleStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "草稿", variant: "outline" },
  published: { label: "已發佈", variant: "default" },
  archived: { label: "已封存", variant: "secondary" },
};

const VERIFICATION_CONFIG: Record<VerificationState, { label: string; icon: React.ElementType }> = {
  verified: { label: "已驗證", icon: BadgeCheck },
  needs_review: { label: "待審查", icon: FileClock },
  unverified: { label: "未驗證", icon: CircleDot },
};

export default function WikiArticlesPage() {
  const router = useRouter();
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? "";

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId || !workspaceId) {
      setLoading(false);
      return;
    }

    let disposed = false;

    async function load() {
      setLoading(true);
      try {
        const data = await getArticles({ accountId, workspaceId });
        if (!disposed) setArticles(data);
      } catch {
        // error loading articles
      } finally {
        if (!disposed) setLoading(false);
      }
    }

    load();
    return () => { disposed = true; };
  }, [accountId, workspaceId]);

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge Base</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">文章</h1>
        <p className="text-sm text-muted-foreground">
          組織知識庫的 SOP 文章、通用文件與驗證管治。
        </p>
      </header>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/wiki")}
          className="inline-flex items-center rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          返回 Account Wiki
        </button>
        <Button size="sm" className="ml-auto" disabled>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          新增文章
        </Button>
      </div>

      {!accountId || !workspaceId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          尚未取得帳號/工作區情境，請先登入或切換帳號。
        </p>
      ) : loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/10 p-10 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">尚無文章。點擊「新增文章」開始建立。</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const status = STATUS_CONFIG[article.status];
            const veri = VERIFICATION_CONFIG[article.verificationState];
            const VeriIcon = veri.icon;
            return (
              <Card key={article.id} className="hover:bg-muted/10 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-sm font-medium">{article.title}</CardTitle>
                    <Badge variant={status.variant} className="shrink-0 text-[10px]">{status.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <VeriIcon className="h-3 w-3" />
                    <span>{veri.label}</span>
                  </div>
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground/70">
                    v{article.version} · {new Date(article.updatedAtISO).toLocaleDateString("zh-TW")}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
