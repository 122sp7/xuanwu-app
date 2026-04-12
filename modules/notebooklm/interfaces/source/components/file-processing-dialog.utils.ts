"use client";

import {
  createIdleExecutionSummary,
  type SourceProcessingExecutionSummary,
  type SourceProcessingTaskResult,
  type SourceProcessingTaskStatus,
} from "../../../subdomains/source/application/dto/source-processing.dto";

export type TaskStatus = SourceProcessingTaskStatus;

export type TaskResult = SourceProcessingTaskResult;

export type ExecutionSummary = SourceProcessingExecutionSummary;

export function createIdleSummary(): ExecutionSummary {
  return createIdleExecutionSummary();
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
