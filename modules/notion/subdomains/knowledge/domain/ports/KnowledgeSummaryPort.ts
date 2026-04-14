/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/ports
 * Purpose: External capability contract for knowledge-page summarization.
 */

export interface KnowledgeSummaryInput {
  readonly title: string;
  readonly plainText: string;
  readonly model?: string;
}

export interface KnowledgeSummaryResult {
  readonly summary: string;
  readonly model: string;
}

export interface KnowledgeSummaryPort {
  summarizePage(input: KnowledgeSummaryInput): Promise<KnowledgeSummaryResult>;
}
