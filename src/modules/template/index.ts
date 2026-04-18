/**
 * Template Module — aggregate export.
 * Cross-module consumers should only depend on symbols re-exported here.
 *
 * Source of truth: subdomains/document
 * Orchestration:   orchestration/TemplateFacade (composition root)
 * Shared types:    shared/types, shared/errors, shared/events
 */

// ── document subdomain: domain ────────────────────────────────────────────────
export {
  Template,
  TemplateId,
  TemplateName,
  TemplateCreatedEvent,
  TemplateUpdatedEvent,
  TemplateDomainService,
} from './subdomains/document/domain';
export type {
  TemplateProps,
  TemplateRepository,
} from './subdomains/document/domain';

// ── document subdomain: application ──────────────────────────────────────────
export {
  CreateTemplateUseCase,
  UpdateTemplateUseCase,
  DeleteTemplateUseCase,
} from './subdomains/document/application';
export type {
  CreateTemplateDTO,
  UpdateTemplateDTO,
  TemplateResponseDTO,
  CreateTemplatePort,
  TemplateRepositoryPort,
  CachePort,
  ExternalApiPort,
} from './subdomains/document/application';

export { TemplateFacade } from './orchestration/TemplateFacade';
export { TemplateCoordinator } from './orchestration/TemplateCoordinator';

// ── shared ────────────────────────────────────────────────────────────────────
export type { TemplateSummary, PaginatedResult } from './shared/types';
export {
  TemplateModuleError,
  TemplateNotFoundError,
  TemplateDuplicateNameError,
} from './shared/errors';
export type { TemplateModuleEvent, TemplateModuleEventType } from './shared/events';
export {
  TEMPLATE_COLLECTION,
  TEMPLATE_MAX_NAME_LENGTH,
  TEMPLATE_MIN_NAME_LENGTH,
  TEMPLATE_CACHE_TTL_SECONDS,
} from './shared/constants';
export type { TemplateModuleConfig } from './shared/config';
export { defaultTemplateModuleConfig } from './shared/config';

// ── generation subdomain ──────────────────────────────────────────────────────
export {
  GeneratedTemplate,
  GenerationId,
  GenerationDomainService,
  GenerationCompletedEvent,
} from './subdomains/generation/domain';
export type { GenerationRepository } from './subdomains/generation/domain';
export { GenerateTemplateUseCase } from './subdomains/generation/application';
export type {
  GenerateTemplateDTO,
  GenerationResultDTO,
  GenerateTemplatePort,
  GenerationRepositoryPort,
  AiGenerationPort,
} from './subdomains/generation/application';

// ── ingestion subdomain ───────────────────────────────────────────────────────
export {
  IngestionJob,
  IngestionId,
  IngestionDomainService,
  IngestionJobStartedEvent,
  IngestionJobCompletedEvent,
  IngestionJobFailedEvent,
} from './subdomains/ingestion/domain';
export type { IngestionJobRepository, IngestionStatus } from './subdomains/ingestion/domain';
export { StartIngestionUseCase } from './subdomains/ingestion/application';
export type {
  StartIngestionDTO,
  IngestionJobResponseDTO,
  StartIngestionPort,
  IngestionRepositoryPort,
  StoragePort,
} from './subdomains/ingestion/application';

// ── workflow subdomain ────────────────────────────────────────────────────────
export {
  TemplateWorkflow,
  WorkflowId,
  WorkflowDomainService,
  WorkflowInitiatedEvent,
  WorkflowCompletedEvent,
  WorkflowCancelledEvent,
} from './subdomains/workflow/domain';
export type { TemplateWorkflowRepository, WorkflowStatus } from './subdomains/workflow/domain';
export { InitiateWorkflowUseCase } from './subdomains/workflow/application';
export type {
  InitiateWorkflowDTO,
  WorkflowResponseDTO,
  InitiateWorkflowPort,
  WorkflowRepositoryPort,
} from './subdomains/workflow/application';
