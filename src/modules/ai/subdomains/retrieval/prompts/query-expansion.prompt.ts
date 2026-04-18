import { ai } from "@/packages/integration-ai/genkit";
import { z } from "genkit";

import { PROMPT_KEYS } from "../../../prompts/versions";

const QueryExpansionPromptInputSchema = z.object({
  query: z.string().min(1),
});

const QueryExpansionPromptOutputSchema = z.object({
  queries: z.array(z.string()).min(1),
});

let isRegistered = false;

export const registerRetrievalPrompts = (): void => {
  if (isRegistered) {
    return;
  }

  ai.definePrompt(
    {
      name: PROMPT_KEYS.RETRIEVAL_QUERY_EXPANSION,
      input: { schema: QueryExpansionPromptInputSchema },
      output: {
        format: "json",
        schema: QueryExpansionPromptOutputSchema,
      },
    },
    `Expand this query into concise retrieval alternatives and return only structured output:
{{query}}`,
  );

  isRegistered = true;
};
