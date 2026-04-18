import { ai } from "@/packages/integration-ai/genkit";
import { z } from "genkit";

import { PROMPT_KEYS } from "../../../prompts/versions";

const GenerateTextPromptInputSchema = z.object({
  prompt: z.string().min(1),
  systemPrompt: z.string().optional(),
});

const GenerateTextPromptOutputSchema = z.object({
  text: z.string(),
});

let isRegistered = false;

export const registerGenerationPrompts = (): void => {
  if (isRegistered) {
    return;
  }

  ai.definePrompt(
    {
      name: PROMPT_KEYS.GENERATION_GENERATE_TEXT,
      input: { schema: GenerateTextPromptInputSchema },
      output: {
        format: "json",
        schema: GenerateTextPromptOutputSchema,
      },
    },
    `{{#if systemPrompt}}
{{{systemPrompt}}}
{{/if}}
{{prompt}}`,
  );

  isRegistered = true;
};
