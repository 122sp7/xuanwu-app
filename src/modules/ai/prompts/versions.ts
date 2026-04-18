import type { PromptKey } from "./registry/prompt-types";

export const PROMPT_KEYS = {
  GENERATION_GENERATE_TEXT: "generation.generate-text",
  RETRIEVAL_QUERY_EXPANSION: "retrieval.query-expansion",
} as const satisfies Record<string, PromptKey>;
