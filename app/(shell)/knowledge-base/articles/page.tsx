"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, BookOpen, ChevronDown, ChevronRight, CircleDot, FileClock, FolderOpen, Layers, Plus } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { getArticles, getCategories, ArticleDialog } from "@/modules/knowledge-base/api";
import type { Article, ArticleStatus, VerificationState, Category } from "@/modules/knowledge-base/api";
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

// ── Category tree helpers ────────────────────────────────────────────────────

interface CategoryNode extends Category {
  children: CategoryNode[];
}

function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>();
  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }
  const roots: CategoryNode[] = [];
  for (const node of map.values()) {
    if (node.parentCategoryId) {
      map.get(node.parentCategoryId)?.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

// ── Category tree panel ──────────────────────────────────────────────────────

interface CategoryTreePanelProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function CategoryTreePanel({ categories, selectedId, onSelect }: CategoryTreePanelProps) {
  const roots = useMemo(() => buildCategoryTree(categories), [categories]);

  return (
    <aside className="w-52 shrink-0 space-y-1">
      <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        分類
      </p>
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
          selectedId === null
            ? "bg-primary/10 text-primary font-medium"
            : "text-foreground hover:bg-muted"
        }`}
      >
        <Layers className="size-3.5 shrink-0 text-muted-foreground" />
        全部文章
      </button>
      {roots.map((node) => (
        <CategoryNodeRow
          key={node.id}
          node={node}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
      {categories.length === 0 && (
        <p className="px-2 text-xs text-muted-foreground/60">尚無分類</p>
      )}
    </aside>
  );
}

interface CategoryNodeRowProps {
  node: CategoryNode;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function CategoryNodeRow({ node, selectedId, onSelect }: CategoryNodeRowProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="p-0.5 text-muted-foreground opacity-0 transition hover:opacity-100"
          style={{ visibility: hasChildren ? "visible" : "hidden" }}
          aria-label={expanded ? "折疊" : "展開"}
        >
          {expanded ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
        </button>
        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className={`flex flex-1 items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors ${
            isSelected
              ? "bg-primary/10 text-primary font-medium"
              : "text-foreground hover:bg-muted"
          }`}
        >
          <FolderOpen className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{node.name}</span>
          {node.articleIds.length > 0 && (
            <span className="ml-auto text-[10px] text-muted-foreground/60">
              {node.articleIds.length}
            </span>
          )}
        </button>
      </div>
      {hasChildren && expanded && (
        <div className="ml-4 space-y-0.5 border-l border-border/40 pl-1">
          {node.children.map((child) => (
            <CategoryNodeRow
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function KnowledgeBaseArticlesPage() {
  const router = useRouter();
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? "";
  const currentUserId = authState.user?.id ?? "";

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accountId || !workspaceId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [arts, cats] = await Promise.all([
        getArticles({ accountId, workspaceId }),
        getCategories(accountId, workspaceId),
      ]);
      setArticles(arts);
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  }, [accountId, workspaceId]);

  useEffect(() => { load(); }, [load]);

  const filteredArticles = useMemo(() => {
    if (!selectedCategoryId) return articles;
    const cat = categories.find((c) => c.id === selectedCategoryId);
    if (!cat) return articles;
    return articles.filter((a) => cat.articleIds.includes(a.id));
  }, [articles, categories, selectedCategoryId]);

  function handleSuccess(articleId?: string) {
    if (articleId) {
      router.push(`/knowledge-base/articles/${articleId}`);
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
          onClick={() => router.push("/knowledge")}
          className="inline-flex items-center rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          返回 Knowledge Hub
        </button>
        <Button
          size="sm"
          className="ml-auto"
          disabled={!accountId || !workspaceId}
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          新增文章
        </Button>
      </div>

      <ArticleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        accountId={accountId}
        workspaceId={workspaceId}
        currentUserId={currentUserId}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {!accountId || !workspaceId ? (
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
                      onClick={() => router.push(`/knowledge-base/articles/${article.id}`)}
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
