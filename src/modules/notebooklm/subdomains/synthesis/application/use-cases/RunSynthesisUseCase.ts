import { v4 as uuid } from "uuid";
import type { SynthesisPort } from "../../domain/ports/SynthesisPort";
import type { SynthesisInput, SynthesisResultSnapshot } from "../../domain/entities/SynthesisResult";

export interface RunSynthesisResult {
  readonly ok: boolean;
  readonly result?: SynthesisResultSnapshot;
  readonly error?: string;
}

export class RunSynthesisUseCase {
  constructor(private readonly synthesisPort: SynthesisPort) {}

  async execute(input: SynthesisInput): Promise<RunSynthesisResult> {
    try {
      const raw = await this.synthesisPort.synthesize(input);
      const result: SynthesisResultSnapshot = {
        ...raw,
        id: raw.id ?? uuid(),
        completedAtISO: raw.completedAtISO ?? new Date().toISOString(),
      };
      return { ok: true, result };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Synthesis failed",
      };
    }
  }
}
