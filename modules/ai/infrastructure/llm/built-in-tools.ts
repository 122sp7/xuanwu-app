/**
 * Built-in Genkit tool definitions for the ai bounded context.
 *
 * All tools are registered on the shared `aiClient` from `genkit-shared.ts`.
 * Adapters that need to use these tools in `aiClient.generate({ tools: [...] })`
 * must import the instances from here — do NOT re-define tools on a separate instance.
 */

import { z } from "genkit";

import type { ToolDescriptor } from "../../domain/ports/ToolRuntimePort";

import { aiClient } from "./genkit-shared";

// ── Tool definitions ──────────────────────────────────────────────────────────

/**
 * Tool: ai.getCurrentDatetime
 *
 * Returns the current date and time in ISO 8601 format together with the
 * server IANA timezone identifier.  Use whenever the prompt involves
 * "today", "now", or any relative date/time calculation.
 */
export const getCurrentDatetimeTool = aiClient.defineTool(
  {
    name: "ai.getCurrentDatetime",
    description:
      "Returns the current date and time in ISO 8601 format together with " +
      "the server IANA timezone. Use this when the prompt involves the " +
      "current time, today's date, or relative date calculations.",
    inputSchema: z.object({}),
    outputSchema: z.object({
      datetime: z.string().describe("Current datetime in ISO 8601 format"),
      timezone: z.string().describe("Server IANA timezone identifier"),
    }),
  },
  async () => ({
    datetime: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }),
);

/**
 * Tool: ai.evaluateMathExpression
 *
 * Safely evaluates an arithmetic expression that contains only digits, spaces,
 * and the operators +, -, *, /, and parentheses. The inputSchema regex
 * enforces this constraint so arbitrary code execution is not possible.
 */
export const evaluateMathExpressionTool = aiClient.defineTool(
  {
    name: "ai.evaluateMathExpression",
    description:
      "Evaluates a safe arithmetic expression and returns the numeric result. " +
      "Use this for calculations involving addition, subtraction, multiplication, " +
      "division, and parentheses. Do not use for code execution or non-arithmetic input.",
    inputSchema: z.object({
      expression: z
        .string()
        .regex(
          /^[\d\s+\-*/().]+$/,
          "Expression must contain only digits, spaces, and arithmetic operators",
        )
        .describe("Arithmetic expression to evaluate, e.g. '(10 + 5) * 2'"),
    }),
    outputSchema: z.object({
      result: z.number().describe("Numeric result of the expression"),
      expression: z.string().describe("The evaluated expression"),
    }),
  },
  async ({ expression }) => {
    try {
      // Safe: expression is validated by inputSchema regex to contain only
      // digits, spaces, and arithmetic operators (+, -, *, /, ., ())
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const result = Function(`"use strict"; return (${expression})`)() as number;
      if (typeof result !== "number" || !isFinite(result)) {
        throw new Error("Expression did not evaluate to a finite number.");
      }
      return { result, expression };
    } catch {
      throw new Error(`Failed to evaluate expression: ${expression}`);
    }
  },
);

// ── Registry ──────────────────────────────────────────────────────────────────

export interface RegisteredBuiltInTool {
  readonly descriptor: ToolDescriptor;
  // Tool instance type varies across Genkit versions; typed as unknown to avoid
  // coupling to Genkit internals while remaining compatible.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly instance: any;
}

/**
 * Complete list of built-in tools registered on the shared aiClient.
 * Use `BUILT_IN_TOOLS` to look up tool instances by descriptor name when
 * passing tools to `aiClient.generate()`.
 */
export const BUILT_IN_TOOLS: ReadonlyArray<RegisteredBuiltInTool> = [
  {
    descriptor: {
      name: "ai.getCurrentDatetime",
      description: "Returns the current date and time in ISO 8601 format.",
    },
    instance: getCurrentDatetimeTool,
  },
  {
    descriptor: {
      name: "ai.evaluateMathExpression",
      description: "Evaluates a safe arithmetic expression.",
    },
    instance: evaluateMathExpressionTool,
  },
];
