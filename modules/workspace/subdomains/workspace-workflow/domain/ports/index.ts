/**
 * workspace/workspace-workflow domain/ports — driven port interfaces for the workflow subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { InvoiceRepository as IInvoicePort } from "../repositories/InvoiceRepository";
export type { IssueRepository as IIssuePort } from "../repositories/IssueRepository";
export type { TaskRepository as ITaskPort } from "../repositories/TaskRepository";
