/**
 * Module: notebooklm/subdomains/ai/synthesis
 * Layer: infrastructure/genkit
 * Purpose: Genkit AI client singleton — server-side only.
 *
 * Design notes:
 * - Reads GOOGLE_GENAI_API_KEY and GENKIT_MODEL from environment.
 * - If no API key is present (e.g. test environment) the googleAI plugin is
 *   skipped so the server still starts without credentials.
 * - This file must not be imported by any client (browser) bundle.
 */

import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

const DEFAULT_SYNTHESIS_MODEL = "googleai/gemini-2.0-flash";

const envModel = process.env.GENKIT_MODEL?.trim();
const configuredModel =
  envModel && envModel.length > 0 ? envModel : DEFAULT_SYNTHESIS_MODEL;

const hasApiKey =
  typeof process.env.GOOGLE_GENAI_API_KEY === "string" &&
  process.env.GOOGLE_GENAI_API_KEY.trim().length > 0;

export const synthesisAiClient = genkit({
  plugins: hasApiKey ? [googleAI()] : [],
  model: configuredModel,
});

export function resolveGenerationModel(modelOverride?: string): string {
  const normalized = modelOverride?.trim();
  return normalized && normalized.length > 0 ? normalized : configuredModel;
}
