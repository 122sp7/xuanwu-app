/**
 * workspace — orchestration layer
 * Cross-subdomain coordination and facade composition.
 */
export { TaskMaterializationJob, JOB_STATUSES } from "../subdomains/orchestration/domain/entities/TaskMaterializationJob";
export type { TaskMaterializationJobSnapshot, CreateJobInput, JobStatus } from "../subdomains/orchestration/domain/entities/TaskMaterializationJob";
export type { TaskMaterializationJobRepository } from "../subdomains/orchestration/domain/repositories/TaskMaterializationJobRepository";
export { CreateMaterializationJobUseCase, StartMaterializationJobUseCase } from "../subdomains/orchestration/application/use-cases/OrchestrationUseCases";
