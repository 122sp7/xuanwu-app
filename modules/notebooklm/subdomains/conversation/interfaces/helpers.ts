import type { Thread } from "@/modules/notebooklm/api";

// ── Domain types ──────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ── Storage key ───────────────────────────────────────────────────────────────

export const STORAGE_KEY = (accountId: string, workspaceId: string) =>
  `nb_thread_${accountId}_${workspaceId || "default"}`;

// ── Pure helpers ──────────────────────────────────────────────────────────────

export function buildContextPrompt(history: ChatMessage[]): string {
  if (history.length === 0) return "";
  const lines = history.map((m) => `[${m.role === "user" ? "User" : "Assistant"}]: ${m.content}`);
  return `Previous conversation context (for reference):\n${lines.join("\n")}\n\nPlease continue the conversation, taking the above context into account.`;
}

export function generateMsgId() {
  return `msg_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export function threadFromMessages(id: string, msgs: ChatMessage[], createdAt: string): Thread {
  return {
    id,
    messages: msgs.map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: new Date().toISOString() })),
    createdAt,
    updatedAt: new Date().toISOString(),
  };
}
