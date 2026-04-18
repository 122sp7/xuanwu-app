/**
 * embedding-job-payload.ts
 *
 * Outbound DTO: QStash message payload for dispatching embedding generation
 * jobs to py_fn workers. This is an outbound contract (dispatcher → worker),
 * NOT a provider API contract.
 *
 * Discussion 08 — cross-runtime contract:
 * - TypeScript side (this file): Zod schema defining the payload shape
 * - Python side (py_fn/src/application/dto/embedding_job.py): Pydantic mirror
 *
 * Both sides must stay semantically aligned. Changes here require
 * corresponding updates to the py_fn Pydantic model.
 *
 * @see docs/structure/contexts/ai/cross-runtime-contracts.md
 */

import { z } from "zod";

export const EmbeddingJobPayloadSchema = z.object({
  /** Unique identifier for this job (used for idempotency) */
  jobId: z.string().uuid(),

  /** The document/artifact that sourced these chunks */
  documentId: z.string().min(1),

  /** Workspace scope for multi-tenant isolation */
  workspaceId: z.string().min(1),

  /** Chunk IDs to generate embeddings for (at least one required) */
  chunkIds: z.array(z.string().min(1)).min(1),

  /** Optional model hint; py_fn selects default if omitted */
  modelHint: z.string().optional(),

  /** ISO 8601 timestamp when the job was requested */
  requestedAt: z.string().datetime(),
});

export type EmbeddingJobPayload = z.infer<typeof EmbeddingJobPayloadSchema>;
