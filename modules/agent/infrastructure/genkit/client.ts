/**
 * @module modules/agent/infrastructure/genkit/client
 */

import { googleAI } from "@genkit-ai/google-genai";
import { genkit } from "genkit";

const DEFAULT_MODEL = "googleai/gemini-2.5-flash";

export type GenkitClientOptions = {
  model?: string;
};

export function getConfiguredGenkitModel(model?: string) {
  return model ?? process.env.GENKIT_MODEL ?? DEFAULT_MODEL;
}

export function createGenkitClient(options?: GenkitClientOptions) {
  return genkit({
    plugins: [googleAI()],
    model: getConfiguredGenkitModel(options?.model),
  });
}

export const agentClient = createGenkitClient();
