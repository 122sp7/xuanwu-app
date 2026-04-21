import type { SynthesisInput, SynthesisResultSnapshot } from "../entities/SynthesisResult";

/** Outbound port — implemented by infrastructure/ai/synthesis.flow adapter. */
export interface SynthesisPort {
  synthesize(input: SynthesisInput): Promise<SynthesisResultSnapshot>;
}
