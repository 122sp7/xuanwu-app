/**
 * orchestration domain/ports — driven port interfaces for the orchestration subdomain.
 *
 * Cross-subdomain repository types are re-exported from their owning subdomains.
 * Only orchestration-owned ports live here.
 */
export type { InvoiceRepository } from "../../../settlement/domain/repositories/InvoiceRepository";
export type { TaskRepository } from "../../../task/domain/repositories/TaskRepository";
export type {
AIExtractedTaskCandidate,
TaskCandidateExtractionAiPort,
} from "./TaskCandidateExtractionAiPort";
