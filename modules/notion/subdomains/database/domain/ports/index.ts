/**
 * notion/database domain/ports — driven port interfaces for the database subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { IAutomationRepository as IAutomationPort } from "../repositories/IAutomationRepository";
export type { IDatabaseRecordRepository as IDatabaseRecordPort } from "../repositories/IDatabaseRecordRepository";
export type { IDatabaseRepository as IDatabasePort } from "../repositories/IDatabaseRepository";
export type { IViewRepository as IViewPort } from "../repositories/IViewRepository";
