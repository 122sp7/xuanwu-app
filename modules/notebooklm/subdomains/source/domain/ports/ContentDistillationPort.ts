/**
 * ContentDistillationPort — notebooklm source subdomain's local abstraction
 * for AI-powered content distillation.
 *
 * Domain only expresses what it needs; the infrastructure adapter
 * (AiDistillationAdapter) implements this port using ai/api/server.
 */

export interface DistillSourcesInput {
  readonly sources: readonly { readonly title: string; readonly text: string }[];
  readonly objective: string;
}

export interface DistilledItem {
  readonly title: string;
  readonly summary: string;
}

export interface DistilledContent {
  readonly overview: string;
  readonly distilledItems: readonly DistilledItem[];
}

export interface ContentDistillationPort {
  distill(input: DistillSourcesInput): Promise<DistilledContent>;
}
