/**
 * GenerationResultDTO — outbound read model returned after a successful generation run.
 */
export interface GenerationResultDTO {
  generationId: string;
  sourceTemplateId: string;
  content: string;
  generatedAt: string;
}
