/**
 * GenerateTemplateDTO — inbound command for template generation.
 */
export interface GenerateTemplateDTO {
  /** ID of the source Template to generate content from. */
  sourceTemplateId: string;
  /** Prompt or instructions to guide the generation model. */
  prompt: string;
}
