"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, BookOpen, CircleDot, FileClock, Plus } from "lucide-react";

import { useAuth } from "@/modules/platform/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import type { ArticleSnapshot as Article, ArticleStatus, ArticleVerificationState as VerificationState } from "../../../subdomains/authoring/application/dto/authoring.dto";
import type { CategorySnapshot as Category } from "../../../subdomains/authoring/application/dto/authoring.dto";
import { getArticles, getCategories } from "../queries";
import { ArticleDialog } from "./ArticleDialog";
import { CategoryTreePanel } from "./CategoryTreePanel";

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

/**
 * KnowledgeBaseArticlesRouteScreen
 * Route-level screen component for /knowledge-base/articles.
 * Encapsulates data-loading, filtering and layout so the Next.js route
 * file stays thin (params/context wiring only).
 */
export interface KnowledgeBaseArticlesPanelProps {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly currentUserId?: string | null;
}

export function KnowledgeBaseArticlesPanel({
  accountId,
  workspaceId,
  currentUserId,
}: KnowledgeBaseArticlesPanelProps) {
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
    ? `${workspaceBasePath}?tab=Overview&panel=knowledge-base-articles`
    : resolvedAccountId
      ? `/${encodeURIComponent(resolvedAccountId)}`
      : "/";

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!resolvedAccountId || !resolvedWorkspaceId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [arts, cats] = await Promise.all([
        getArticles({ accountId: resolvedAccountId, workspaceId: resolvedWorkspaceId }),
        getCategories(resolvedAccountId, resolvedWorkspaceId),
      ]);
      setArticles(arts);
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  }, [resolvedAccountId, resolvedWorkspaceId]);

  useEffect(() => { load(); }, [load]);

  const filteredArticles = useMemo(() => {
    if (!selectedCategoryId) return articles;
    const cat = categories.find((c) => c.id === selectedCategoryId);
    if (!cat) return articles;
    return articles.filter((a) => cat.articleIds.includes(a.id));
  }, [articles, categories, selectedCategoryId]);

  function handleSuccess(articleId?: string) {
    if (articleId) {
      if (resolvedAccountId && resolvedWorkspaceId) {
        router.push(
          `${workspaceBasePath}/knowledge-base/articles/${encodeURIComponent(articleId)}`,
        );
      } else {
        router.push(`/knowledge-base/articles/${encodeURIComponent(articleId)}`);
      }
    } else {
      load();
    }
  }

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
          新增文章
        </Button>
      </div>

      <ArticleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        accountId={resolvedAccountId}
        workspaceId={resolvedWorkspaceId}
        currentUserId={resolvedCurrentUserId}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {!resolvedAccountId || !resolvedWorkspaceId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          尚未取得帳號/工作區情境，請先登入或切換帳號。
        </p>
      ) : loading ? (
        <div className="flex gap-4">
          <Skeleton className="h-48 w-52 shrink-0 rounded-lg" />
          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <CategoryTreePanel
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />

          <div className="flex-1">
            {filteredArticles.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/10 p-10 text-center">
                <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {selectedCategoryId ? "此分類尚無文章。" : "尚無文章。點擊「新增文章」開始建立。"}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredArticles.map((article) => {
                  const status = STATUS_CONFIG[article.status];
                  const veri = VERIFICATION_CONFIG[article.verificationState];
                  const VeriIcon = veri.icon;
                  return (
                    <Card
                      key={article.id}
                      className="cursor-pointer hover:bg-muted/10 transition-colors"
                      onClick={() => handleSuccess(article.id)}
                    >
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
        </div>
      )}
    </div>
  );
}
