import type { TaskCandidateExtractorPort, ExtractTaskCandidatesInput } from "../../../domain/ports/TaskCandidateExtractorPort";
import type { ExtractedTaskCandidate } from "../../../domain/value-objects/TaskCandidate";

/**
 * GenkitTaskCandidateExtractor — Genkit flow implementation of TaskCandidateExtractorPort.
 *
 * Flow name: workspace.extract-task-candidates
 *
 * This adapter is a stub. To activate, replace the body with a real Genkit
 * flow invocation via `platform/ai` AIAPI:
 *
 *   import { genkit } from "genkit";
 *   import { googleAI } from "@genkit-ai/google-genai";
 *   const ai = genkit({ plugins: [googleAI()] });
 *
 *   const extractFlow = ai.defineFlow(
 *     {
 *       name: "workspace.extract-task-candidates",
 *       inputSchema: ExtractInputSchema,
 *       outputSchema: ExtractOutputSchema,
 *     },
 *     async (input) => { ... }
 *   );
 *
 * Until `platform/ai` AIAPI is wired, the FirebaseCallableTaskCandidateExtractor
 * in adapters/outbound/callable/ provides the working implementation.
 *
 * ESLint: Genkit imports are allowed here — outbound adapter layer.
 */
export class GenkitTaskCandidateExtractor implements TaskCandidateExtractorPort {
  async extract(_input: ExtractTaskCandidatesInput): Promise<ExtractedTaskCandidate[]> {
    // TODO: Replace with real Genkit flow invocation once platform/ai AIAPI is wired.
    // See class-level JSDoc for setup instructions.
    throw new Error(
      "GenkitTaskCandidateExtractor.extract not yet implemented. Use FirebaseCallableTaskCandidateExtractor instead.",
    );
  }
}
