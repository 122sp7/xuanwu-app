import type { CreateTemplateDTO } from '../../dto/CreateTemplateDTO';
import type { TemplateResponseDTO } from '../../dto/TemplateResponseDTO';

/**
 * Inbound port — the contract exposed to adapters that drive the application.
 */
export interface CreateTemplatePort {
  execute(input: CreateTemplateDTO): Promise<TemplateResponseDTO>;
}
