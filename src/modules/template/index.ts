/**
 * Template Module — aggregate export.
 * Cross-module consumers should only depend on symbols re-exported here.
 */

// domain — entities
export { Template } from './domain/entities';
export type { TemplateProps } from './domain/entities';

// domain — value-objects
export { TemplateId } from './domain/value-objects';
export { TemplateName } from './domain/value-objects';

// domain — events
export { TemplateCreatedEvent } from './domain/events';
export { TemplateUpdatedEvent } from './domain/events';

// domain — services
export { TemplateDomainService } from './domain/services';

// domain — repositories
export type { TemplateRepository } from './domain/repositories';

// application — use-cases
export { CreateTemplateUseCase } from './application/use-cases';
export { UpdateTemplateUseCase } from './application/use-cases';
export { DeleteTemplateUseCase } from './application/use-cases';

// application — dto
export type { CreateTemplateDTO } from './application/dto';
export type { UpdateTemplateDTO } from './application/dto';
export type { TemplateResponseDTO } from './application/dto';

// application — ports inbound
export type { CreateTemplatePort } from './application/ports/inbound';

// application — ports outbound
export type { TemplateRepositoryPort } from './application/ports/outbound';
export type { CachePort } from './application/ports/outbound';
export type { ExternalApiPort } from './application/ports/outbound';
