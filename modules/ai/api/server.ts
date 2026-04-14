/**
 * ai — server-only API barrel.
 *
 * Exports that depend on server-only packages such as Genkit.
 * Must only be imported in Server Actions, route handlers, or server-side
 * infrastructure adapters.
 */

export { generateAiText, summarize } from "../subdomains/generation/api/server";
export { distillContent } from "../subdomains/distillation/api/server";
