/**
 * modules/shared — public API barrel.
 * Re-exports all shared domain primitives for cross-module consumption.
 */

export type { BaseEntity, CreatedBy, QueryScope } from "../domain/types";
export { BaseEntitySchema } from "../domain/types";
export type { DomainEvent } from "../domain/events";
