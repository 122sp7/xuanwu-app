import { resolve } from "node:path";

import { googleAI } from "@genkit-ai/google-genai";
import { genkit } from "genkit";

const DEFAULT_MODEL = googleAI.model("gemini-2.5-flash");
const PROMPT_DIR = resolve(process.cwd(), "src/modules/ai/subdomains/pipeline/infrastructure/prompts");

const googleAiConfig = process.env.GOOGLE_AI_API_KEY ? { apiKey: process.env.GOOGLE_AI_API_KEY } : undefined;

export const ai = genkit({
  plugins: [googleAI(googleAiConfig)],
  model: DEFAULT_MODEL,
  promptDir: PROMPT_DIR,
});

export const GENKIT_DEFAULT_MODEL_ID = "googleai/gemini-2.5-flash";

const composePrompt = (input: { prompt: string; systemPrompt?: string }): string => {
  if (!input.systemPrompt) {
    return input.prompt;
  }

  return `System:\n${input.systemPrompt}\n\nUser:\n${input.prompt}`;
};

export const generateTextWithGenkit = async (input: { prompt: string; systemPrompt?: string; model?: string }) => {
  const response = await ai.generate({
    prompt: composePrompt(input),
    ...(input.model ? { model: input.model } : {}),
  });

  return response;
};
