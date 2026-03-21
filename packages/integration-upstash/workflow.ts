/**
 * Upstash Workflow — durable serverless workflow helper for Next.js.
 *
 * Re-exports serve from @upstash/workflow/nextjs so Route Handlers can
 * declare multi-step durable workflows that survive cold-starts, retries,
 * and failures without managing any infrastructure.
 *
 * Environment requirements:
 *   QSTASH_TOKEN — required by the Workflow SDK for internal step delivery
 */

import "server-only";

export { serve } from "@upstash/workflow/nextjs";
export { Client as WorkflowClient } from "@upstash/workflow";

import { Client as _WorkflowClient } from "@upstash/workflow";

const token = process.env.QSTASH_TOKEN;
if (!token) {
  throw new Error(
    "Missing required environment variable: QSTASH_TOKEN must be set.",
  );
}

/** Singleton Workflow management client for triggering / cancelling workflows. */
export const workflowClient = new _WorkflowClient({ token });
