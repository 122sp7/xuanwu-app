"use client";

import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";

export type TaskStatus = "idle" | "running" | "success" | "error" | "skipped";

export interface TaskResult {
  readonly status: TaskStatus;
  readonly detail: string;
}

export interface ExecutionSummary {
  readonly pageCount: number;
  readonly jsonGcsUri: string;
  readonly pageHref: string;
  readonly parse: TaskResult;
  readonly rag: TaskResult;
  readonly page: TaskResult;
}

export function createIdleSummary(): ExecutionSummary {
  return {
    pageCount: 0,
    jsonGcsUri: "",
    pageHref: "",
    parse: { status: "idle", detail: "尚未開始解析" },
    rag: { status: "idle", detail: "尚未決定是否建立 RAG 索引" },
    page: { status: "idle", detail: "尚未決定是否建立 Knowledge Page" },
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function readCallableData(value: unknown): Record<string, unknown> {
  return asRecord(value);
}

export async function waitForParsedDocument(accountId: string, docId: string): Promise<{
  pageCount: number;
  jsonGcsUri: string;
}> {
  const db = getFirebaseFirestore();

  return new Promise((resolve, reject) => {
    const docRef = firestoreApi.doc(db, "accounts", accountId, "documents", docId);
    const unsubscribe = firestoreApi.onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }

      const data = asRecord(snapshot.data());
      const status = asString(data.status, "unknown");

      if (status === "completed") {
        const parsed = asRecord(data.parsed);
        unsubscribe();
        resolve({
          pageCount: asNumber(parsed.page_count, 0),
          jsonGcsUri: asString(parsed.json_gcs_uri),
        });
        return;
      }

      if (status === "error") {
        const error = asRecord(data.error);
        unsubscribe();
        reject(new Error(asString(error.message, "文件解析失敗")));
      }
    });
  });
}

export function readString(value: unknown, fallback = ""): string {
  return asString(value, fallback);
}

export function readNumber(value: unknown, fallback = 0): number {
  return asNumber(value, fallback);
}