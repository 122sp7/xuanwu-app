/**
 * Template Module — aggregate export.
 * Cross-module consumers should only depend on symbols re-exported here.
 */

// domain
export { Template, TemplateId, TemplateName, TemplateCreatedEvent, TemplateUpdatedEvent, TemplateDomainService } from './domain';
export type { TemplateProps, TemplateRepository } from './domain';

// application
export { CreateTemplateUseCase, UpdateTemplateUseCase, DeleteTemplateUseCase } from './application';
export type { CreateTemplateDTO, UpdateTemplateDTO, TemplateResponseDTO, CreateTemplatePort, TemplateRepositoryPort, CachePort, ExternalApiPort } from './application';
