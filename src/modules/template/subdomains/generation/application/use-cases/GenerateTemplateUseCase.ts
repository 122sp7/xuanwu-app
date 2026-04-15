import type { GenerateTemplatePort } from '../ports/inbound/GenerateTemplatePort';
import type { GenerationRepositoryPort } from '../ports/outbound/GenerationRepositoryPort';
import type { AiGenerationPort } from '../ports/outbound/AiGenerationPort';
import type { GenerateTemplateDTO } from '../dto/GenerateTemplateDTO';
import type { GenerationResultDTO } from '../dto/GenerationResultDTO';
import { GeneratedTemplate } from '../../domain/entities/GeneratedTemplate';
import { GenerationId } from '../../domain/value-objects/GenerationId';
import { GenerationDomainService } from '../../domain/services/GenerationDomainService';

/**
 * GenerateTemplateUseCase
 * Orchestrates AI-driven generation of a new template artifact.
 */
export class GenerateTemplateUseCase implements GenerateTemplatePort {
  private readonly domainService = new GenerationDomainService();

  constructor(
    private readonly generationRepository: GenerationRepositoryPort,
    private readonly aiGeneration: AiGenerationPort,
  ) {}

  async execute(input: GenerateTemplateDTO): Promise<GenerationResultDTO> {
    this.domainService.validateGenerationRequest(
      input.sourceTemplateId,
      input.prompt,
    );

    const content = await this.aiGeneration.generate(
      input.sourceTemplateId,
      input.prompt,
    );

    const generated = GeneratedTemplate.create({
      id: GenerationId.generate(),
      sourceTemplateId: input.sourceTemplateId,
      content,
    });

    await this.generationRepository.save(generated);

    return {
      generationId: generated.id.toString(),
      sourceTemplateId: generated.sourceTemplateId,
      content: generated.content,
      generatedAt: generated.createdAt.toISOString(),
    };
  }
}
