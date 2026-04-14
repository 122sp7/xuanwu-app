/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/ports
 * Purpose: External capability contract for structured knowledge-page distillation.
 */

export interface KnowledgeDistillationInput {
  readonly title: string;
  readonly plainText: string;
  readonly model?: string;
}

export interface KnowledgeDistillationHighlight {
  readonly title: string;
  readonly summary: string;
}

export interface KnowledgeDistillationResult {
  readonly overview: string;
  readonly highlights: readonly KnowledgeDistillationHighlight[];
  readonly model: string;
  readonly traceId: string;
  readonly completedAt: string;
}

export interface KnowledgeDistillationPort {
  distillPage(input: KnowledgeDistillationInput): Promise<KnowledgeDistillationResult>;
}
