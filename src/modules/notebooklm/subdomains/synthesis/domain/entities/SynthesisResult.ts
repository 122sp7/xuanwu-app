/**
 * SynthesisResult — value object produced by a RAG synthesis operation.
 *
 * Owned by notebooklm/synthesis subdomain.
 * The synthesis port (SynthesisPort) is the primary contract for calling AI.
 * The Genkit flow (infrastructure/ai/synthesis.flow.ts) implements the port.
 */

export interface SynthesisCitation {
  readonly index: number;
  /** Raw citation identifier returned by the synthesis flow. */
  readonly ref: string;
}

export interface SynthesisResultSnapshot {
  readonly id: string;
  readonly notebookId?: string;
  readonly question: string;
  readonly answer: string;
  readonly citations: readonly SynthesisCitation[];
  readonly model?: string;
  readonly completedAtISO: string;
}

export interface SynthesisInput {
  readonly notebookId?: string;
  readonly question: string;
  readonly contextChunks: readonly string[];
  readonly maxCitations?: number;
  readonly model?: string;
}
