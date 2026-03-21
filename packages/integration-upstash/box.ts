/**
 * Upstash Box — sandboxed AI coding agent runtime.
 *
 * Creates and manages ephemeral sandboxed environments (Node, Python, etc.)
 * with AI agent capabilities: streaming output, structured Zod-typed results,
 * file I/O, git operations, and snapshots.
 *
 * Environment requirements:
 *   UPSTASH_BOX_API_KEY — Upstash Box API key
 */

import "server-only";

import { Box, Agent, ClaudeCode, type BoxConfig } from "@upstash/box";

export { Box, Agent, ClaudeCode } from "@upstash/box";
export type { BoxConfig } from "@upstash/box";

/**
 * Convenience factory that creates an Upstash Box with the project API key
 * injected from the environment.
 */
export async function createBox(
  config: Omit<BoxConfig, "apiKey"> & { apiKey?: string },
): Promise<InstanceType<typeof Box>> {
  const apiKey = config.apiKey ?? process.env.UPSTASH_BOX_API_KEY;
  if (!apiKey) {
    throw new Error("Missing required environment variable: UPSTASH_BOX_API_KEY must be set.");
  }

  return Box.create({
    apiKey,
    agent: config.agent ?? {
      provider: Agent.ClaudeCode,
      model: ClaudeCode.Sonnet_4_5,
    },
    ...config,
  });
}
