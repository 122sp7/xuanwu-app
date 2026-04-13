/**
 * notion/database domain/ports — driven port interfaces for the database subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { AutomationRepository as IAutomationPort } from "../repositories/AutomationRepository";
export type { DatabaseRecordRepository as IDatabaseRecordPort } from "../repositories/DatabaseRecordRepository";
export type { DatabaseRepository as IDatabasePort } from "../repositories/DatabaseRepository";
export type { ViewRepository as IViewPort } from "../repositories/ViewRepository";
