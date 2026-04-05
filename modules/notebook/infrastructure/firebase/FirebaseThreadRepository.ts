/**
 * Module: notebook
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/threads/{threadId}
 *
 * Persists Thread (messages array) to Firestore so conversations survive page reload.
 */

import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { Thread } from "../../domain/entities/thread";
import type { Message } from "../../domain/entities/message";
import type { IThreadRepository } from "../../domain/repositories/IThreadRepository";

function threadDoc(
  db: ReturnType<typeof getFirestore>,
  accountId: string,
  threadId: string,
) {
  return doc(db, "accounts", accountId, "threads", threadId);
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
  private db() {
    return getFirestore(firebaseClientApp);
  }

  async save(accountId: string, thread: Thread): Promise<void> {
    const db = this.db();
    const ref = threadDoc(db, accountId, thread.id);
    await setDoc(ref, {
      id: thread.id,
      messages: thread.messages,
      createdAt: thread.createdAt,
      updatedAt: new Date().toISOString(),
      _savedAt: serverTimestamp(),
    });
  }

  async getById(accountId: string, threadId: string): Promise<Thread | null> {
    const db = this.db();
    const snap = await getDoc(threadDoc(db, accountId, threadId));
    if (!snap.exists()) return null;
    return toThread(snap.id, snap.data() as Record<string, unknown>);
  }
}
