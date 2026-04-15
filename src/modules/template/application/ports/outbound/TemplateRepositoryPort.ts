import type { TemplateRepository } from '../../../domain/repositories/TemplateRepository';

/**
 * Outbound port — application layer dependency on the repository contract.
 * Alias of the domain repository interface to keep adapter wiring explicit.
 */
export type TemplateRepositoryPort = TemplateRepository;
