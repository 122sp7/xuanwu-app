/**
 * notion/database domain/ports — driven port interfaces for the database subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { AutomationRepository } from "../repositories/AutomationRepository";
export type { DatabaseRecordRepository } from "../repositories/DatabaseRecordRepository";
export type { DatabaseRepository } from "../repositories/DatabaseRepository";
export type { ViewRepository } from "../repositories/ViewRepository";
