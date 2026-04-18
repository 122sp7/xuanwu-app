/**
 * @module infra/zod
 * Shared Zod primitives and utility helpers.
 */

import { z, type ZodError } from "zod";

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
