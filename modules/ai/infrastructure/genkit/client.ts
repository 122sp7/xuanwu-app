/**
 * @module modules/ai/infrastructure/genkit/client
 */

import { googleAI } from "@genkit-ai/google-genai";
import { genkit } from "genkit";

const DEFAULT_MODEL = "googleai/gemini-2.5-flash";

export type GenkitClientOptions = {
  model?: string;
};

export function createGenkitClient(options?: GenkitClientOptions) {
  return genkit({
    plugins: [googleAI()],
    model: options?.model ?? process.env.GENKIT_MODEL ?? DEFAULT_MODEL,
  });
}

export const aiClient = createGenkitClient();
