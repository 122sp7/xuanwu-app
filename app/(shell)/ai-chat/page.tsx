"use client";

/**
 * Module: ai-chat page
 * Purpose: AI assistant chat hub stub.
 * Constraints: UI-only stub; real AI chat will be wired in a future iteration.
 */

import { Bot, SendHorizonal, Sparkles } from "lucide-react";

import { Button } from "@/ui/shadcn/ui/button";

export default function AiChatPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      {/* Empty-state illustration */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <Bot className="size-7 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">AI Chat</h1>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            在此與 AI 助理對話，協助你處理工作區任務、知識問答、文件摘要等。
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          <span>即將推出</span>
        </div>
      </div>

      {/* Stub input bar */}
      <div className="flex w-full max-w-lg items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-4 py-2.5 shadow-sm">
        <input
          type="text"
          placeholder="輸入訊息…"
          disabled
          className="flex-1 bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/60 disabled:cursor-not-allowed"
        />
        <Button size="sm" disabled className="gap-1.5 shrink-0">
          <SendHorizonal className="size-4" />
          送出
        </Button>
      </div>
    </div>
  );
}
