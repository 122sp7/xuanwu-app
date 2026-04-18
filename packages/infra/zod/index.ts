/**
 * @module infra/zod
 * Shared Zod primitives and utility helpers.
 */

import { z, type ZodError, type ZodTypeAny, type ZodSchema } from "zod";

export { z };

export const UuidSchema = z.string().uuid();
export const IsoDateTimeSchema = z.string().datetime();

export const createBrandedUuidSchema = <Brand extends string>(brand: Brand) =>
  UuidSchema.brand<Brand>().describe(`${brand} UUID`);

export const zodErrorToFieldMap = (error: ZodError): Record<string, string[]> => {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".") || "root";

    if (!fieldErrors[key]) {
      fieldErrors[key] = [];
    }

    fieldErrors[key].push(issue.message);
  }

  return fieldErrors;
};

/**
 * Parse and throw with a meaningful error message, or return typed value.
 * Use at Server Action / tRPC procedure input boundaries.
 */
export const zodParseOrThrow = <T extends ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const summary = result.error.issues
      .map((i) => `[${i.path.join(".")}] ${i.message}`)
      .join("; ");
    throw new Error(`Validation failed: ${summary}`);
  }

  return result.data;
};

/**
 * Safely parse without throwing; returns `{ success, data, error }`.
 * Mirrors `z.safeParse` but re-exported for consistent import.
 */
export const zodSafeParse = <S extends ZodSchema>(
  schema: S,
  data: unknown,
): ReturnType<S["safeParse"]> => schema.safeParse(data) as ReturnType<S["safeParse"]>;
