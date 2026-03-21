/**
 * @package integration-upstash
 * Upstash services integration — Redis, Vector, QStash, Workflow, Box.
 *
 * Provides a single import path for all Upstash cloud services:
 *   - Redis     — low-latency key/value store and session cache
 *   - Vector    — semantic similarity search and RAG retrieval
 *   - QStash    — durable HTTP message queue and scheduler
 *   - Workflow  — multi-step durable serverless workflows
 *   - Box       — sandboxed AI coding agent runtime
 *
 * All exports are server-only. Do not import from Client Components.
 *
 * Usage:
 *   import { redis, vectorIndex, qstash } from "@integration-upstash";
 */

// ── Redis ──────────────────────────────────────────────────────────────────
export { redis } from "@/libs/upstash/redis";

// ── Vector ─────────────────────────────────────────────────────────────────
export { vectorIndex } from "@/libs/upstash/vector";

// ── QStash ─────────────────────────────────────────────────────────────────
export { qstash, qstashReceiver } from "@/libs/upstash/qstash";

// ── Workflow ───────────────────────────────────────────────────────────────
export {
  serve,
  WorkflowClient,
  workflowClient,
} from "@/libs/upstash/workflow";

// ── Box ────────────────────────────────────────────────────────────────────
export {
  Box,
  Agent,
  ClaudeCode,
  createBox,
  type BoxConfig,
} from "@/libs/upstash/box";
