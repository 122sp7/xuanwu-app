"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  BadgeCheck,
  Edit,
  FileClock,
  MessageSquare,
  History,
  Globe,
  Link2,
} from "lucide-react";

import { getArticle, getCategories, getBacklinks } from "../queries";
import {
  publishArticle,
  archiveArticle,
  verifyArticle,
  requestArticleReview,
} from "../_actions/article.actions";
import { ArticleDialog } from "./ArticleDialog";
import type { ArticleSnapshot as Article } from "../../../subdomains/authoring/application/dto/authoring.dto";
import type { CategorySnapshot as Category } from "../../../subdomains/authoring/application/dto/authoring.dto";
import { CommentPanel, VersionHistoryPanel } from "@/modules/notion/api";
import { ReactMarkdown } from "@lib-react-markdown";
import { remarkGfm } from "@lib-remark-gfm";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-shadcn/ui/tabs";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ArticleDetailPanelProps {
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ArticleDetailPanel({
  accountId,
  workspaceId,
  currentUserId,
}: ArticleDetailPanelProps) {
  const params = useParams();
  const router = useRouter();
  const articleId = params.articleId as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [backlinks, setBacklinks] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const articleDetailBasePath =
    accountId && workspaceId
      ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}/knowledge-base/articles`
      : "/knowledge-base/articles";
  const articleListHref =
    accountId && workspaceId
      ? articleDetailBasePath
      : "/knowledge-base/articles";

  function buildArticleDetailHref(targetArticleId: string): string {
    return `${articleDetailBasePath}/${encodeURIComponent(targetArticleId)}`;
  }

  const load = useCallback(async () => {
    if (!accountId || !articleId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [art, cats, bls] = await Promise.all([
        getArticle(accountId, articleId),
        getCategories(accountId, workspaceId),
        getBacklinks(accountId, articleId),
      ]);
      setArticle(art);
      setCategories(cats);
      setBacklinks(bls);
    } finally {
      setLoading(false);
    }
  }, [accountId, workspaceId, articleId]);

  useEffect(() => { void load(); }, [load]);

  function handlePublish() {
    startTransition(async () => {
      await publishArticle({ id: articleId, accountId });
      await load();
    });
  }

  function handleArchive() {
    startTransition(async () => {
      await archiveArticle({ id: articleId, accountId });
      await load();
    });
  }

  function handleVerify() {
    startTransition(async () => {
      await verifyArticle({ id: articleId, accountId, verifiedByUserId: currentUserId });
      await load();
    });
  }

  function handleRequestReview() {
    startTransition(async () => {
      await requestArticleReview({ id: articleId, accountId });
      await load();
    });
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(articleListHref)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> 返回
        </Button>
        <p className="text-sm text-muted-foreground">找不到文章。</p>
      </div>
    );
  }

  const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
    draft: "outline",
    published: "default",
    archived: "secondary",
  };
  const statusLabel: Record<string, string> = {
    draft: "草稿",
    published: "已發佈",
    archived: "已封存",
  };
  const veriLabel: Record<string, string> = {
    verified: "已驗證",
    needs_review: "待審查",
    unverified: "未驗證",
  };

  return (
    <div className="space-y-4">
      {/* Back + actions bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push(articleListHref)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> 文章列表
        </Button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {article.status === "draft" && (
            <Button size="sm" variant="outline" onClick={handlePublish} disabled={isPending}>
              <Globe className="mr-1.5 h-3.5 w-3.5" /> 發佈
            </Button>
          )}
          {article.status !== "archived" && (
            <Button size="sm" variant="outline" onClick={handleArchive} disabled={isPending}>
              <Archive className="mr-1.5 h-3.5 w-3.5" /> 封存
            </Button>
          )}
          {article.verificationState !== "verified" && (
            <Button size="sm" variant="outline" onClick={handleVerify} disabled={isPending}>
              <BadgeCheck className="mr-1.5 h-3.5 w-3.5" /> 標記已驗證
            </Button>
          )}
          {article.verificationState === "verified" && (
            <Button size="sm" variant="outline" onClick={handleRequestReview} disabled={isPending}>
              <FileClock className="mr-1.5 h-3.5 w-3.5" /> 請求審查
            </Button>
          )}
          <Button size="sm" onClick={() => setEditOpen(true)}>
            <Edit className="mr-1.5 h-3.5 w-3.5" /> 編輯
          </Button>
        </div>
      </div>

      {/* Header */}
      <header className="space-y-2 border-b border-border/60 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant[article.status] ?? "outline"}>
            {statusLabel[article.status] ?? article.status}
          </Badge>
          {article.verificationState && (
            <Badge variant="outline" className="text-xs">
              {veriLabel[article.verificationState] ?? article.verificationState}
            </Badge>
          )}
          {article.tags.map((tag) => (
            <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{article.title}</h1>
        <p className="text-xs text-muted-foreground">
          v{article.version} · 更新於 {new Date(article.updatedAtISO).toLocaleDateString("zh-TW")}
        </p>
      </header>

      {/* Body tabs */}
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">內容</TabsTrigger>
          <TabsTrigger value="backlinks">
            <Link2 className="mr-1 h-3.5 w-3.5" /> 反向連結
            {backlinks.length > 0 && (
              <span className="ml-1 rounded bg-muted px-1 text-[10px] text-muted-foreground">
                {backlinks.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="mr-1 h-3.5 w-3.5" /> 留言
          </TabsTrigger>
          <TabsTrigger value="versions">
            <History className="mr-1 h-3.5 w-3.5" /> 版本
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <div className="prose prose-sm dark:prose-invert min-h-[200px] max-w-none rounded-lg border border-border/60 bg-muted/10 p-4">
            {article.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            ) : (
              <p className="text-sm text-muted-foreground">此文章尚無內容。</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="backlinks">
          {backlinks.length === 0 ? (
            <p className="rounded-lg border border-border/60 bg-muted/10 p-4 text-sm text-muted-foreground">
              尚無其他文章引用此文章。
            </p>
          ) : (
            <ul className="space-y-2 rounded-lg border border-border/60 bg-muted/10 p-4">
              {backlinks.map((bl) => (
                <li key={bl.id}>
                  <button
                    type="button"
                    onClick={() => router.push(buildArticleDetailHref(bl.id))}
                    className="text-sm text-primary hover:underline text-left"
                  >
                    {bl.title}
                  </button>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(bl.updatedAtISO).toLocaleDateString("zh-TW")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="comments">
          {currentUserId ? (
            <CommentPanel
              accountId={accountId}
              workspaceId={workspaceId}
              contentId={articleId}
              contentType="article"
              currentUserId={currentUserId}
            />
          ) : (
            <p className="text-sm text-muted-foreground">請先登入以查看留言。</p>
          )}
        </TabsContent>

        <TabsContent value="versions">
          {currentUserId ? (
            <VersionHistoryPanel
              accountId={accountId}
              contentId={articleId}
              currentUserId={currentUserId}
            />
          ) : (
            <p className="text-sm text-muted-foreground">請先登入以查看版本歷程。</p>
          )}
        </TabsContent>
      </Tabs>

      <ArticleDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        accountId={accountId}
        workspaceId={workspaceId}
        currentUserId={currentUserId}
        categories={categories}
        article={article}
        onSuccess={() => void load()}
      />
    </div>
  );
}
