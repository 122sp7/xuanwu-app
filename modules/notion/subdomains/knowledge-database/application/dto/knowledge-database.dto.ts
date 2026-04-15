/**
 * Application-layer DTO re-exports for the knowledge-database subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { DatabaseSnapshot, Field, FieldType } from "../../domain/aggregates/Database";
export type { DatabaseRecordSnapshot } from "../../domain/aggregates/DatabaseRecord";
export type { ViewSnapshot } from "../../domain/aggregates/View";
export type { DatabaseAutomationSnapshot, AutomationTrigger, AutomationActionType } from "../../domain/aggregates/DatabaseAutomation";
export type { CreateAutomationInput, UpdateAutomationInput } from "../../domain/repositories/AutomationRepository";
