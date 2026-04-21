import { GenkitTaskCandidateExtractor } from "../../subdomains/task-formation/adapters/outbound/genkit/GenkitTaskCandidateExtractor";
import type { ExtractTaskCandidatesDTO } from "../../subdomains/task-formation/application/dto/TaskFormationDTO";
import type { ExtractedTaskCandidate } from "../../subdomains/task-formation/domain/value-objects/TaskCandidate";

export async function extractTaskCandidatesWithGenkit(
  input: ExtractTaskCandidatesDTO,
): Promise<readonly ExtractedTaskCandidate[]> {
  const extractor = new GenkitTaskCandidateExtractor();
  return extractor.extract({
    workspaceId: input.workspaceId,
    sourceType: input.sourceType,
    sourcePageIds: input.sourcePageIds,
    sourceText: input.sourceText,
  });
}
