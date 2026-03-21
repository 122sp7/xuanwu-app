/**
 * Upstash infrastructure — unified public barrel.
 *
 * Provides a single import path for all Upstash services used in the project:
 *   - Redis     — low-latency key/value store and session cache
 *   - Vector    — semantic similarity search and RAG retrieval
 *   - Search    — AI-powered full-text + semantic search
 *   - QStash    — durable HTTP message queue and scheduler
 *   - Workflow  — multi-step durable serverless workflows
 *   - Box       — sandboxed AI coding agent runtime
 *
 * All exports are server-only.  Do not import from Client Components.
 *
 * Usage:
 *   import { redis, vectorIndex, search, qstash, workflowClient, createBox } from "@integration-upstash";
 */

// Redis
export { redis } from "./redis";

// Vector
export { vectorIndex } from "./vector";

// Search
export { search } from "./search";

// QStash
export { qstash, qstashReceiver } from "./qstash";

// Workflow
export { serve, WorkflowClient, workflowClient } from "./workflow";

// Box
export { Box, Agent, ClaudeCode, createBox } from "./box";
export type { BoxConfig } from "./box";

// Config
export { upstashConfig } from "./config";
