/**
 * @module libs/zod
 * Thin wrapper for Zod v4 schema validation.
 *
 * Provides a single import path for schema definition, validation, and error
 * handling.  Safe to import from Server Components, Client Components,
 * utilities, and domain layers.
 *
 * Usage:
 *   import { z } from "@/libs/zod";
 *
 *   const UserSchema = z.object({
 *     id:    z.string().uuid(),
 *     email: z.email(),
 *     age:   z.number().int().min(0),
 *   });
 *
 *   type User = z.infer<typeof UserSchema>;
 *
 * Coercion (e.g. query-string params):
 *   import { z, coerce } from "@/libs/zod";
 *   const schema = z.object({ page: coerce.number().default(1) });
 */

// ── Primary namespace (covers ~95 % of usage) ──────────────────────────────
export { z } from "zod";

// ── Coercion namespace ─────────────────────────────────────────────────────
export { coerce } from "zod";

// ── Error helpers ──────────────────────────────────────────────────────────
export { ZodError, treeifyError, prettifyError, formatError, flattenError } from "zod";

// ── Base class (for `instanceof` checks and custom refinements) ────────────
export { ZodType } from "zod";

// ── JSON Schema interop ────────────────────────────────────────────────────
export { toJSONSchema, fromJSONSchema } from "zod";

// ── Types ──────────────────────────────────────────────────────────────────
export type {
  infer as ZodInfer,
  output as ZodOutput,
  input as ZodInput,
} from "zod";
