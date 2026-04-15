/**
 * Shared Genkit client for the ai bounded context.
 *
 * All Genkit adapters within modules/ai must import `aiClient` from this
 * module rather than creating their own `genkit()` instances. This ensures
 * that tool definitions and generation calls are bound to the same registry,
 * which is required for tool-calling to work correctly in Genkit.
 */

import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

const DEFAULT_MODEL = "googleai/gemini-2.5-flash";

const envModel = process.env.GENKIT_MODEL?.trim();

/** Resolved model name: env override or default. */
export const configuredModel: string =
  envModel && envModel.length > 0 ? envModel : DEFAULT_MODEL;

/** True when the Google Generative AI API key is present in the environment. */
export const hasApiKey: boolean =
  typeof process.env.GOOGLE_GENAI_API_KEY === "string" &&
  process.env.GOOGLE_GENAI_API_KEY.trim().length > 0;

/**
 * Shared Genkit instance for the ai bounded context.
 *
 * Do NOT call `genkit()` in subdomain infrastructure adapters.
 * Import this singleton instead so all adapters share one registry.
 */
export const aiClient = genkit({
  plugins: hasApiKey ? [googleAI()] : [],
  model: configuredModel,
});
