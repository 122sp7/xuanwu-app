/**
 * mapHttpRequestToPlatformCommand — HTTP Request Parser
 *
 * Parses and validates an incoming HTTP request body/params into
 * a typed PlatformCommand payload.
 *
 * Rules:
 *   - Request validation (schema, types) is the driving adapter's responsibility
 *   - Unknown or malformed requests must return a typed parse error (HTTP 400 semantics)
 *   - Must not contain business logic
 *   - Uses Zod or equivalent schema validation
 *
 * @see adapters/web/handlePlatformCommandHttp.ts — calls this mapper
 * @see ports/input/index.ts — PlatformCommandPort
 */

// TODO: implement mapHttpRequestToPlatformCommand parser using Zod validation
