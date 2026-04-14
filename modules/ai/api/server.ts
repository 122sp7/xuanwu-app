/**
 * ai — server-only API barrel.
 *
 * Exports that depend on server-only packages such as Genkit.
 * Must only be imported in Server Actions, route handlers, or server-side
 * infrastructure adapters.
 */

export { generateAiText, summarize } from "../subdomains/content-generation/api/server";
export { distillContent } from "../subdomains/content-distillation/api/server";
export {
  generateWithTools,
  listAvailableTools,
} from "../subdomains/tool-runtime/api/server";
