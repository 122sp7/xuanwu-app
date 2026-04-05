import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

const DEFAULT_GENKIT_MODEL = "googleai/gemini-2.0-flash";
const genkitModelFromEnv = process.env.GENKIT_MODEL?.trim();
const configuredGenkitModel =
  genkitModelFromEnv && genkitModelFromEnv.length > 0 ? genkitModelFromEnv : DEFAULT_GENKIT_MODEL;

const hasGoogleAiApiKey =
  typeof process.env.GOOGLE_GENAI_API_KEY === "string" &&
  process.env.GOOGLE_GENAI_API_KEY.trim().length > 0;

const plugins = hasGoogleAiApiKey ? [googleAI()] : [];

export const aiClient = genkit({
  plugins,
  model: configuredGenkitModel,
});

export function getConfiguredGenkitModel(model?: string): string {
  const normalized = model?.trim();
  return normalized && normalized.length > 0 ? normalized : configuredGenkitModel;
}
