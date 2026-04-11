"use client";

import { waitForParsedDocument } from "../../api/factories";

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

export function readCallableData(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export { waitForParsedDocument };
