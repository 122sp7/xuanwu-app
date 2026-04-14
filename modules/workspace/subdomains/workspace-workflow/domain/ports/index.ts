/**
 * workspace/workspace-workflow domain/ports — driven port interfaces for the workflow subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 *
 * Application-layer ports (contracts whose method signatures depend on application/dto/ types)
 * live in ../application/ports/:
 *   - IssueService   — Issue operations (uses OpenIssueDto, IssueQueryDto)
 *   - InvoiceService — Invoice operations (uses AddInvoiceItemDto, InvoiceQueryDto)
 *   - TaskService    — Task operations (uses CreateTaskDto, TaskQueryDto)
 * These must not be moved here; see ADR-1102 §3.
 */
export type { InvoiceRepository } from "../repositories/InvoiceRepository";
export type { IssueRepository } from "../repositories/IssueRepository";
export type { TaskRepository } from "../repositories/TaskRepository";
export type {
	AIExtractedTaskCandidate,
	TaskCandidateExtractionAiPort,
} from "./TaskCandidateExtractionAiPort";
