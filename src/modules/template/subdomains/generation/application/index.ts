// generation subdomain — application stub
// Add use-cases, DTOs, and ports for AI/rule-based template generation here.
// Expand only when this subdomain has real business behavior.

export { GenerateTemplateUseCase } from './use-cases/GenerateTemplateUseCase';

export type { GenerateTemplateDTO } from './dto/GenerateTemplateDTO';
export type { GenerationResultDTO } from './dto/GenerationResultDTO';

export type { GenerateTemplatePort } from './ports/inbound/GenerateTemplatePort';
export type { GenerationRepositoryPort } from './ports/outbound/GenerationRepositoryPort';
export type { AiGenerationPort } from './ports/outbound/AiGenerationPort';
