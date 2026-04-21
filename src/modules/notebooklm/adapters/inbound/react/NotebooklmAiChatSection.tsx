"use client";

/**
 * NotebooklmAiChatSection — notebooklm.ai-chat tab — RAG Q&A interface.
 * Calls fn rag_query callable via ragQueryAction server action.
 */

import { Button, Input } from "@packages";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";

import type { RagQueryOutput } from "../../../adapters/outbound/callable/FirebaseCallableAdapter";
import { ragQueryAction } from "../server-actions/notebook-actions";

interface NotebooklmAiChatSectionProps {
  workspaceId: string;
  accountId: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: RagQueryOutput["citations"];
}

export function NotebooklmAiChatSection({
  workspaceId,
  accountId,
}: NotebooklmAiChatSectionProps): React.ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");

    startTransition(async () => {
      try {
        const result = await ragQueryAction({
          accountId,
          workspaceId,
          query: trimmed,
        }) as RagQueryOutput;

        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.answer,
          citations: result.citations,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "查詢失敗，請稍後再試。",
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">AI Chat（RAG）</h2>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          以對話方式查詢已索引資料；若查詢失敗，通常是來源尚未完成向量索引。
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] text-primary">
          <Sparkles className="size-3" />
          AiChat 基礎對話模式
        </div>
      </div>

      <div className="flex min-h-48 flex-col gap-3 rounded-xl border border-border/50 bg-background p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">輸入問題，AI 將從已索引的文件中搜尋答案。</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-lg px-3 py-2 text-sm ${
              msg.role === "user"
                ? "ml-auto max-w-[80%] bg-primary/10 text-foreground"
                : "max-w-[80%] border border-border/40 bg-muted/30"
            }`}
          >
            <p>{msg.content}</p>
            {msg.citations && msg.citations.length > 0 && (
              <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                {msg.citations.map((c) => (
                  <li key={c.chunk_id}>
                    📎 {c.filename} (相關度 {(c.score * 100).toFixed(0)}%)
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {isPending && (
          <p className="text-xs text-muted-foreground animate-pulse">AI 思考中…</p>
        )}
      </div>

      <div className="flex gap-2 rounded-xl border border-border/50 bg-background p-3">
        <Input
          placeholder="輸入問題…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
          disabled={isPending}
          className="text-sm"
        />
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isPending || !query.trim()}
        >
          <Send className="size-3.5" />
        </Button>
      </div>
    </div>
  ) as React.ReactElement;
}
