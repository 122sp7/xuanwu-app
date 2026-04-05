"use client";

/**
 * Module: ai-chat page
 * Purpose: AI assistant chat hub — wired to generateNotebookResponse server action.
 */

import { Bot, Loader2, SendHorizonal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import { sendChatMessage } from "./_actions";
import { cn } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function generateMsgId() {
  return `msg_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export default function AiChatPage() {
  const searchParams = useSearchParams();
  const {
    state: { workspaces },
  } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() || "";
  const workspaceName =
    requestedWorkspaceId && workspaces && Object.hasOwn(workspaces, requestedWorkspaceId)
      ? workspaces[requestedWorkspaceId]?.name ?? "目前工作區"
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isPending) return;

    const userMsg: ChatMessage = { id: generateMsgId(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError(null);
    setIsPending(true);

    try {
      const result = await sendChatMessage({ prompt: text });
      if (result.ok) {
        const assistantMsg: ChatMessage = {
          id: generateMsgId(),
          role: "assistant",
          content: result.data.text,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setError(result.error.message);
      }
    } catch {
      setError("無法連接至 AI 服務，請稍後再試。");
    } finally {
      setIsPending(false);
      // Defer scroll to allow React to flush the new message into the DOM first.
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-border/60 px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
          <Bot className="size-4 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-none">AI 對話</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">智慧助理 · 知識問答 · 任務協助</p>
        </div>
      </div>

      {workspaceName && (
        <div className="shrink-0 border-b border-border/40 bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
          目前從工作區 <span className="font-medium text-foreground">{workspaceName}</span>{" "}
          進入；若需要帶引用來源的工作區查詢，可切換到 RAG Query。
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !isPending && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
              <Bot className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">有什麼我可以幫你的？</p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                詢問工作區任務、知識問答或文件摘要等。
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

      {/* Input */}
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
            placeholder="輸入訊息… (Enter 送出，Shift+Enter 換行)"
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
    </div>
  );
}
