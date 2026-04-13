/**
 * workspace/workspace-workflow domain/ports — driven port interfaces for the workflow subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { InvoiceRepository } from "../repositories/InvoiceRepository";
export type { IssueRepository } from "../repositories/IssueRepository";
export type { TaskRepository } from "../repositories/TaskRepository";
export type {
	AIExtractedTaskCandidate,
	TaskCandidateExtractionAiPort,
} from "./TaskCandidateExtractionAiPort";
