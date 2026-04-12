"use client";

/**
 * Module: notebooklm/subdomains/conversation
 * Component: AiChatPage
 * Purpose: Full-page AI chat UI — wired to conversation server actions.
 *          Thread persistence via Firestore. Multi-turn context support.
 *
 * Props are injected by the app/ shim so this component has no provider dependencies.
 */

import Link from "next/link";
import { Bot, BookOpen, Brain, FileText, Lightbulb, Loader2, Plus, SendHorizonal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { v7 as uuid } from "@lib-uuid";

import type { WorkspaceEntity } from "@/modules/workspace/api";
import { resolveWorkspaceFromMap, WorkspaceContextCard } from "@/modules/workspace/api";
import { cn } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

import { sendChatMessage, saveThread, loadThread } from "../_actions/chat.actions";
import {
  type ChatMessage,
  STORAGE_KEY,
  buildContextPrompt,
  generateMsgId,
  threadFromMessages,
} from "../helpers";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface AiChatPageProps {
  accountId: string;
  workspaces: Record<string, WorkspaceEntity>;
  requestedWorkspaceId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AiChatPage({ accountId, workspaces, requestedWorkspaceId }: AiChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [threadCreatedAt, setThreadCreatedAt] = useState<string>(new Date().toISOString());
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentWorkspace = resolveWorkspaceFromMap(workspaces, requestedWorkspaceId);
  const workspaceName = currentWorkspace?.name ?? null;
  const workspaceQuery = currentWorkspace ? `?workspaceId=${encodeURIComponent(currentWorkspace.id)}` : "";
  const workspaceRouteRoot = currentWorkspace
    ? `/${encodeURIComponent(accountId)}/${encodeURIComponent(currentWorkspace.id)}`
    : `/${encodeURIComponent(accountId)}`;
  const latestUserPrompt = [...messages].reverse().find((m) => m.role === "user")?.content ?? null;

  // Load persisted thread on mount
  useEffect(() => {
    if (!accountId) return;
    const storageKey = STORAGE_KEY(accountId, requestedWorkspaceId);
    const storedId = localStorage.getItem(storageKey);
    if (!storedId) return;
    setThreadId(storedId);
    void loadThread(accountId, storedId).then((thread) => {
      if (!thread || thread.messages.length === 0) return;
      setThreadCreatedAt(thread.createdAt);
      setMessages(
        thread.messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content })),
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const summaryItems = useMemo(() => {
    if (messages.length === 0) {
      return [
        "先整理來源文件與工作區脈絡，再開始對話。",
        "需要帶引用的回答時，可搭配 Ask / Cite 使用。",
      ];
    }
    return [
      `目前已有 ${messages.length} 則訊息，包含 ${messages.filter((m) => m.role === "assistant").length} 次模型回覆。`,
      latestUserPrompt ? `最近一次提問：${latestUserPrompt}` : "最近一次提問尚未建立。",
    ];
  }, [latestUserPrompt, messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isPending) return;

    const userMsg: ChatMessage = { id: generateMsgId(), role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsPending(true);

    const contextPrompt = buildContextPrompt(messages);

    try {
      const result = await sendChatMessage({
        prompt: text,
        ...(contextPrompt ? { system: contextPrompt } : {}),
      });
      if (result.ok) {
        const assistantMsg: ChatMessage = {
          id: generateMsgId(),
          role: "assistant",
          content: result.data.text,
        };
        const finalMessages = [...nextMessages, assistantMsg];
        setMessages(finalMessages);

        if (accountId) {
          const storageKey = STORAGE_KEY(accountId, requestedWorkspaceId);
          let currentThreadId = threadId;
          if (!currentThreadId) {
            currentThreadId = uuid();
            setThreadId(currentThreadId);
            localStorage.setItem(storageKey, currentThreadId);
          }
          const thread = threadFromMessages(currentThreadId, finalMessages, threadCreatedAt);
          void saveThread(accountId, thread);
        }
      } else {
        setError(result.error.message);
      }
    } catch {
      setError("無法連接至 AI 服務，請稍後再試。");
    } finally {
      setIsPending(false);
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  }

  function handleNewThread() {
    if (!accountId) return;
    const storageKey = STORAGE_KEY(accountId, requestedWorkspaceId);
    localStorage.removeItem(storageKey);
    setThreadId(null);
    setMessages([]);
    setThreadCreatedAt(new Date().toISOString());
    setError(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e as unknown as React.FormEvent);
    }
  }

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
