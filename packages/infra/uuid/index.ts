/**
 * @module infra/uuid
 * Canonical UUID primitive for package and module consumers.
 */

import { validate as validateUuid, v4 as uuidv4 } from "uuid";

export type UUID = string & { readonly __brand: "UUID" };

export const generateId = (): UUID => uuidv4() as UUID;

export const isValidUUID = (value: string): value is UUID => validateUuid(value);

export const asUUID = (value: string): UUID => {
  if (!isValidUUID(value)) {
    throw new Error("Invalid UUID format");
  }

  return value;
};
