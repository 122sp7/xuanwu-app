import { useEffect, useMemo, useRef, useState } from "react";
import { v7 as uuid } from "@lib-uuid";

import { sendChatMessage, saveThread, loadThread } from "../_actions/chat.actions";
import {
  type ChatMessage,
  STORAGE_KEY,
  buildContextPrompt,
  generateMsgId,
  threadFromMessages,
} from "../helpers";

export interface UseAiChatThreadParams {
  accountId: string;
  requestedWorkspaceId: string;
}

export interface UseAiChatThreadResult {
  messages: ChatMessage[];
  input: string;
  isPending: boolean;
  error: string | null;
  threadId: string | null;
  summaryItems: string[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
  setInput: (value: string) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleNewThread: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export function useAiChatThread({
  accountId,
  requestedWorkspaceId,
}: UseAiChatThreadParams): UseAiChatThreadResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [threadCreatedAt, setThreadCreatedAt] = useState<string>(new Date().toISOString());
  const bottomRef = useRef<HTMLDivElement>(null);

  const latestUserPrompt = [...messages].reverse().find((m) => m.role === "user")?.content ?? null;

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
  }, [accountId, requestedWorkspaceId]);

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

  async function handleSubmit(e?: React.FormEvent): Promise<void> {
    e?.preventDefault();
    const text = input.trim();
    if (isBlank(text) || isPending) return;

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

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

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
    } catch {
      setError("無法連接至 AI 服務，請稍後再試。");
    } finally {
      setIsPending(false);
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  }

  function handleNewThread(): void {
    if (!accountId) return;
    const storageKey = STORAGE_KEY(accountId, requestedWorkspaceId);
    localStorage.removeItem(storageKey);

    setThreadId(null);
    setMessages([]);
    setThreadCreatedAt(new Date().toISOString());
    setError(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  }

  return {
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
  };
}
