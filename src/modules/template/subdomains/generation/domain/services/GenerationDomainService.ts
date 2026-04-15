/**
 * GenerationDomainService — Domain Service (stub)
 *
 * Handles business rules that span multiple GeneratedTemplate instances
 * or require coordination beyond a single aggregate.
 * Expand when generation subdomain is activated.
 */
export class GenerationDomainService {
  /**
   * Validate that a generation request is well-formed before the
   * AI generation port is invoked.
   */
  validateGenerationRequest(sourceTemplateId: string, prompt: string): void {
    if (!sourceTemplateId || sourceTemplateId.trim().length === 0) {
      throw new Error('sourceTemplateId is required for generation');
    }
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('prompt is required for generation');
    }
  }
}
