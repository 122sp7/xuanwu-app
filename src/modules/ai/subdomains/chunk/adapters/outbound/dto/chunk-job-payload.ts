/**
 * chunk-job-payload.ts
 *
 * Outbound DTO: QStash message payload for dispatching chunking jobs
 * to py_fn workers. This is an outbound contract (dispatcher → worker),
 * NOT a provider API contract.
 *
 * Discussion 08 — cross-runtime contract:
 * - TypeScript side (this file): Zod schema defining the payload shape
 * - Python side (py_fn/src/application/dto/chunk_job.py): Pydantic mirror
 *
 * Both sides must stay semantically aligned. Changes here require
 * corresponding updates to the py_fn Pydantic model.
 *
 * @see docs/structure/contexts/ai/cross-runtime-contracts.md
 */

import { z } from "zod";

export const ChunkJobPayloadSchema = z.object({
  /** Unique identifier for this job (used for idempotency) */
  jobId: z.string().uuid(),

  /** The raw document content to be chunked */
  documentId: z.string().min(1),

  /** Workspace scope for multi-tenant isolation */
  workspaceId: z.string().min(1),

  /** Source type (e.g. "notion-page", "uploaded-file") */
  sourceType: z.string().min(1),

  /** Optional hint for chunking strategy */
  strategyHint: z.enum(["fixed-size", "semantic", "markdown-section"]).optional(),

  /** Max token count per chunk; py_fn uses default if omitted */
  maxTokensPerChunk: z.number().int().positive().max(8192).optional(),

  /** ISO 8601 timestamp when the job was requested */
  requestedAt: z.string().datetime(),
});

export type ChunkJobPayload = z.infer<typeof ChunkJobPayloadSchema>;
