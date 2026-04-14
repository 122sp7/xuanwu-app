import { v4 as uuid } from "@lib-uuid";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

import type {
  ToolDescriptor,
  ToolEnabledGenerationInput,
  ToolEnabledGenerationOutput,
  ToolRuntimePort,
} from "../../domain/ports/ToolRuntimePort";

const DEFAULT_MODEL = "googleai/gemini-2.5-flash";

const envModel = process.env.GENKIT_MODEL?.trim();
const configuredModel =
  envModel && envModel.length > 0 ? envModel : DEFAULT_MODEL;
const hasApiKey =
  typeof process.env.GOOGLE_GENAI_API_KEY === "string" &&
  process.env.GOOGLE_GENAI_API_KEY.trim().length > 0;

const aiClient = genkit({
  plugins: hasApiKey ? [googleAI()] : [],
  model: configuredModel,
});

// ── Built-in tools ────────────────────────────────────────────────────────────

/**
 * Tool: ai.getCurrentDatetime
 *
 * Returns the current date and time in ISO 8601 format together with the
 * server IANA timezone identifier. Use this whenever the prompt involves
 * "today", "now", or any relative date/time calculation.
 */
const getCurrentDatetimeTool = aiClient.defineTool(
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
const evaluateMathExpressionTool = aiClient.defineTool(
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
        .describe(
          "Arithmetic expression to evaluate, e.g. '(10 + 5) * 2'",
        ),
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

// ── Tool registry ─────────────────────────────────────────────────────────────

interface RegisteredTool {
  readonly descriptor: ToolDescriptor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly instance: any;
}

const REGISTERED_TOOLS: ReadonlyArray<RegisteredTool> = [
  {
    descriptor: {
      name: "ai.getCurrentDatetime",
      description:
        "Returns the current date and time in ISO 8601 format.",
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

// ── Adapter ───────────────────────────────────────────────────────────────────

export class GenkitToolRuntimeAdapter implements ToolRuntimePort {
  listAvailableTools(): ReadonlyArray<ToolDescriptor> {
    return REGISTERED_TOOLS.map(({ descriptor }) => descriptor);
  }

  async generateWithTools(
    input: ToolEnabledGenerationInput,
  ): Promise<ToolEnabledGenerationOutput> {
    const traceId = uuid();
    const completedAt = new Date().toISOString();

    const selectedTools = REGISTERED_TOOLS.filter(({ descriptor }) =>
      input.toolNames.includes(descriptor.name),
    ).map(({ instance }) => instance);

    const response = await aiClient.generate({
      prompt: input.prompt,
      ...(input.system ? { system: input.system } : {}),
      ...(input.model ? { model: input.model } : {}),
      tools: selectedTools,
    });

    // Count tool invocations by inspecting conversation messages.
    // Each message with a toolRequest part represents one model-initiated call.
    const toolCallsCount = Array.isArray(response.messages)
      ? response.messages.reduce((count: number, msg: { content: unknown[] }) => {
          return (
            count +
            msg.content.filter(
              (part: unknown) =>
                typeof part === "object" &&
                part !== null &&
                "toolRequest" in part,
            ).length
          );
        }, 0)
      : 0;

    return {
      text: response.text,
      toolCallsCount,
      model: input.model ?? configuredModel,
      traceId,
      completedAt,
    };
  }
}
