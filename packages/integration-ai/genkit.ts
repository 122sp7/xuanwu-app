/**
 * Genkit singleton.
 *
 * Initialises one shared `genkit` instance with the Google AI plugin.
 * Import this only in infrastructure AI adapter files — never in
 * domain or application layers.
 *
 * Required env var: GOOGLE_GENAI_API_KEY (or GOOGLE_API_KEY)
 */

import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { DEFAULT_AI_MODEL } from "./index";

/** Re-export z for infrastructure adapters — avoids separate zod import. */
export { z };

/**
 * Shared Genkit AI instance.
 *
 * @example
 * ```ts
 * import { ai } from '@integration-ai/genkit';
 *
 * export const myFlow = ai.defineFlow(
 *   {
 *     name: 'notebooklm.synthesis',
 *     inputSchema: z.object({ query: z.string() }),
 *     outputSchema: z.object({ answer: z.string() }),
 *   },
 *   async ({ query }) => {
 *     const { text } = await ai.generate({
 *       model: googleAI.model('gemini-2.5-flash'),
 *       prompt: query,
 *     });
 *     return { answer: text };
 *   },
 * );
 * ```
 */
export const ai = genkit({
  plugins: [googleAI()],
  /** Default model — use googleAI.model() helper (Context7-preferred over string ID). */
  model: googleAI.model(DEFAULT_AI_MODEL),
});
