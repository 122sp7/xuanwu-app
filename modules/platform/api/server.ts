/**
 * platform — server-only API barrel.
 *
 * Exports that depend on server-only packages (genkit, Firebase Admin, etc.).
 * Must only be imported in Server Actions, route handlers, or server-side
 * infrastructure adapters.
 */

export { generateAiText, summarize } from "../subdomains/ai/api/server";
