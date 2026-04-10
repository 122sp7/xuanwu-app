/**
 * ai subdomain — server-only API.
 *
 * Factory functions for server-side use-case composition.
 * Must only be imported in Server Actions, route handlers, or server-side infrastructure.
 */

export { createAnswerRagQueryUseCase } from "../qa/server";
