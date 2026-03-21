/**
 * @package integration-upstash
 * Upstash services integration — Redis, Vector, QStash, Workflow, Box.
 *
 * This package IS the source of truth for all Upstash client wiring.
 * All client initialization lives in the sub-files alongside this index.
 * No re-exports from external libs/ paths.
 *
 * All exports are server-only. Do not import from Client Components.
 *
 * Usage:
 *   import { redis, vectorIndex, qstash } from "@integration-upstash";
 */

// ── Redis ──────────────────────────────────────────────────────────────────
export { redis } from "./redis";

// ── Vector ─────────────────────────────────────────────────────────────────
export { vectorIndex } from "./vector";

// ── QStash ─────────────────────────────────────────────────────────────────
export { qstash, qstashReceiver } from "./qstash";

// ── Workflow ───────────────────────────────────────────────────────────────
export {
  serve,
  WorkflowClient,
  workflowClient,
} from "./workflow";

// ── Box ────────────────────────────────────────────────────────────────────
export {
  Box,
  Agent,
  ClaudeCode,
  createBox,
  type BoxConfig,
} from "./box";
