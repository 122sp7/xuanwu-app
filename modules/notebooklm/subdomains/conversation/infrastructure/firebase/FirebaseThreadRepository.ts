/**
 * Module: notebooklm/conversation
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/threads/{threadId}
 *
 * Persists Thread (messages array) to Firestore so conversations survive page reload.
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import type { Thread } from "../../domain/entities/thread";
import type { Message } from "../../domain/entities/message";
import type { IThreadRepository } from "../../domain/repositories/IThreadRepository";

function threadPath(accountId: string, threadId: string): string {
  return `accounts/${accountId}/threads/${threadId}`;
}

function toMessage(m: Record<string, unknown>): Message {
  return {
    id: typeof m.id === "string" ? m.id : "",
    role: (m.role as Message["role"]) ?? "user",
    content: typeof m.content === "string" ? m.content : "",
    createdAt: typeof m.createdAt === "string" ? m.createdAt : new Date().toISOString(),
  };
}

function toThread(id: string, data: Record<string, unknown>): Thread {
  const messages = Array.isArray(data.messages)
    ? (data.messages as Record<string, unknown>[]).map(toMessage)
    : [];
  return {
    id,
    messages,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
  };
}

export class FirebaseThreadRepository implements IThreadRepository {
  async save(accountId: string, thread: Thread): Promise<void> {
    await firestoreInfrastructureApi.set(threadPath(accountId, thread.id), {
      id: thread.id,
      messages: thread.messages,
      createdAt: thread.createdAt,
      updatedAt: new Date().toISOString(),
    });
  }

  async getById(accountId: string, threadId: string): Promise<Thread | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      threadPath(accountId, threadId),
    );
    if (!data) return null;
    return toThread(threadId, data);
  }
}
