/**
 * Output DTO returned to callers outside the application layer.
 */
export interface TemplateResponseDTO {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
