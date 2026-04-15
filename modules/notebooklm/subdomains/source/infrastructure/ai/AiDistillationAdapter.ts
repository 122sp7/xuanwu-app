import "server-only";

import { distillContent } from "@/modules/ai/api/server";
import type {
  ContentDistillationPort,
  DistillSourcesInput,
  DistilledContent,
} from "../../domain/ports/ContentDistillationPort";

/**
 * notebooklm source adapter — implements ContentDistillationPort via the
 * ai bounded-context's public server API.
 * Must only be instantiated in server-side composition (Server Actions, route handlers).
 */
export class AiDistillationAdapter implements ContentDistillationPort {
  async distill(input: DistillSourcesInput): Promise<DistilledContent> {
    const result = await distillContent({
      sources: input.sources,
      objective: input.objective,
    });
    return {
      overview: result.overview,
      distilledItems: result.distilledItems,
    };
  }
}
