"use client";

/**
 * Module: notebooklm/subdomains/conversation
 * Component: ConversationScreen
 * Purpose: Full-page AI chat UI — wired to conversation server actions.
 *          Thread persistence via Firestore. Multi-turn context support.
 *
 * Props are injected by the app/ shim so this component has no provider dependencies.
 */

import Link from "next/link";
import { Bot, BookOpen, Brain, FileText, Lightbulb, Loader2, Plus, SendHorizonal } from "lucide-react";

import type { WorkspaceEntity } from "@/modules/workspace/api";
import { resolveWorkspaceFromMap, WorkspaceContextCard } from "@/modules/workspace/api";
import { cn } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

import { useAiChatThread } from "../hooks/useAiChatThread";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ConversationScreenProps {
  accountId: string;
  workspaces: Record<string, WorkspaceEntity>;
  requestedWorkspaceId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ConversationScreen({ accountId, workspaces, requestedWorkspaceId }: ConversationScreenProps) {
  const {
    messages,
    input,
    isPending,
    error,
    threadId,
    summaryItems,
    bottomRef,
    setInput,
    handleSubmit,
    handleNewThread,
    handleKeyDown,
  } = useAiChatThread({ accountId, requestedWorkspaceId });

  const currentWorkspace = resolveWorkspaceFromMap(workspaces, requestedWorkspaceId);
  const workspaceName = currentWorkspace?.name ?? null;
  const workspaceQuery = currentWorkspace ? `?workspaceId=${encodeURIComponent(currentWorkspace.id)}` : "";
  const workspaceRouteRoot = currentWorkspace
    ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(currentWorkspace.id)}`
    : `/${encodeURIComponent(accountId)}`;

  return (
    <div className="grid h-full min-h-0 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="border-b border-border/60 bg-muted/20 p-4 lg:border-b-0 lg:border-r">
        <div className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="size-4 text-primary" />
                Notebook / AI
              </CardTitle>
              <CardDescription>
                將工作區知識、知識頁面與查詢消費層收斂成單一 workspace-scoped notebook 介面，而不是獨立聊天產品。
              </CardDescription>
            </CardHeader>
          </Card>

          <WorkspaceContextCard workspace={currentWorkspace} />

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BookOpen className="size-4 text-primary" />
                Source context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <Link href={`${workspaceRouteRoot}?tab=Files`} className="flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 transition hover:bg-muted">
                <FileText className="size-3.5" />
                文件來源 / Documents
              </Link>
              <Link href={`${workspaceRouteRoot}?tab=Overview&panel=knowledge-pages`} className="flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 transition hover:bg-muted">
                <BookOpen className="size-3.5" />
                知識頁面 / Pages
              </Link>
              <Link href={workspaceQuery ? `${workspaceRouteRoot}/notebook/rag-query${workspaceQuery}` : `${workspaceRouteRoot}/notebook/rag-query`} className="flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 transition hover:bg-muted">
                <Bot className="size-3.5" />
                Ask / Cite / RAG Query
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Summary snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              {summaryItems.map((item) => (
                <p key={item} className="rounded-md border border-border/50 px-3 py-2">
                  {item}
                </p>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lightbulb className="size-4 text-primary" />
                Insight board
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p className="rounded-md border border-border/50 px-3 py-2">
                目前仍是 Notebook shell，摘要、洞察、引用整理會在後續 phase 持續補齊。
              </p>
              <p className="rounded-md border border-border/50 px-3 py-2">
                若你需要可追溯回答，優先改從 Ask / Cite 取得引用，再回到這裡整理觀點。
              </p>
            </CardContent>
          </Card>
        </div>
      </aside>

      <section className="flex min-h-0 flex-col">
        <div className="flex shrink-0 items-center gap-3 border-b border-border/60 px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
            <Bot className="size-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-none">Notebook / AI</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">工作區問答 · 摘要草稿 · 洞察整理</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {threadId && (
              <span className="text-[10px] text-muted-foreground/60">
                Thread · {messages.length} 則
              </span>
            )}
            <Button size="sm" variant="ghost" onClick={handleNewThread} disabled={messages.length === 0}>
              <Plus className="mr-1 size-3.5" />
              新對話
            </Button>
          </div>
        </div>

        {workspaceName && (
          <div className="shrink-0 border-b border-border/40 bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
            目前從工作區 <span className="font-medium text-foreground">{workspaceName}</span> 進入；Notebook 會把這裡視為主要知識上下文。
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && !isPending && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                <Bot className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">開始你的 notebook conversation</p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  先問工作區背景、文件摘要、會議筆記整理或知識問答，再逐步累積 summary 與 insight。
                </p>
              </div>
            </div>
          )}

          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {isPending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-2.5">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs text-destructive">
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="shrink-0 border-t border-border/60 bg-background/80 px-4 py-3 backdrop-blur"
        >
          <div className="mx-auto flex max-w-2xl items-end gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="輸入你的 notebook 問題… (Enter 送出，Shift+Enter 換行)"
              disabled={isPending}
              className="flex-1 resize-none rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ maxHeight: "120px" }}
            />
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !input.trim()}
              className="shrink-0 gap-1.5"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizonal className="size-4" />
              )}
              <span className="hidden sm:inline">送出</span>
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
