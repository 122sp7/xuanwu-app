import type { GenerateTemplateDTO } from '../../dto/GenerateTemplateDTO';
import type { GenerationResultDTO } from '../../dto/GenerationResultDTO';

/**
 * GenerateTemplatePort — Inbound Port
 * Contract for the GenerateTemplateUseCase public entry point.
 */
export interface GenerateTemplatePort {
  execute(input: GenerateTemplateDTO): Promise<GenerationResultDTO>;
}
