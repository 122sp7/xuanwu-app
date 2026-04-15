import type { GenerationRepository } from '../../../domain/repositories/GenerationRepository';

/**
 * GenerationRepositoryPort — Outbound Port
 * Type alias that exposes the domain repository contract to the application layer.
 */
export type GenerationRepositoryPort = GenerationRepository;
