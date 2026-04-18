
import { z } from "zod";
import { getFirebaseFunctions, httpsCallable } from "@packages";
import type { TaskCandidateExtractorPort, ExtractTaskCandidatesInput } from "../../../domain/ports/TaskCandidateExtractorPort";
import type { ExtractedTaskCandidate } from "../../../domain/value-objects/TaskCandidate";

/**
 * Input / output contracts for the py_fn `extract_task_candidates` callable.
 * This callable is expected to be implemented in py_fn when the backend is ready.
 * Until then, the adapter returns a structured mock response.
 */
interface ExtractTaskCandidatesCallableInput {
  readonly workspace_id: string;
  readonly source_type: string;
  readonly source_page_ids: string[];
  readonly source_text?: string;
}

// Zod schema validates the callable output at the infrastructure boundary (Rule 4).
// Unknown or malformed responses are rejected before reaching the application layer.
const CallableCandidateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  due_date: z.string().optional(),
  source: z.enum(["rule", "ai"]),
  confidence: z.number().min(0).max(1),
  source_block_id: z.string().optional(),
  source_snippet: z.string().optional(),
});

const CallableExtractorOutputSchema = z.object({
  candidates: z.array(CallableCandidateSchema),
});

/**
 * FirebaseCallableTaskCandidateExtractor — working implementation of
 * TaskCandidateExtractorPort using Firebase HTTPS Callable to py_fn.
 *
 * While the py_fn `extract_task_candidates` function is not yet deployed,
 * this adapter falls back to a stub response so the UI pipeline remains testable.
 *
 * ESLint: @integration-firebase is allowed here — outbound adapter layer.
 */
export class FirebaseCallableTaskCandidateExtractor implements TaskCandidateExtractorPort {
  async extract(input: ExtractTaskCandidatesInput): Promise<ExtractedTaskCandidate[]> {
    try {
      const functions = getFirebaseFunctions();
      const fn = httpsCallable<ExtractTaskCandidatesCallableInput, unknown>(
        functions,
        "extract_task_candidates",
      );
      const result = await fn({
        workspace_id: input.workspaceId,
        source_type: input.sourceType,
        source_page_ids: input.sourcePageIds,
        source_text: input.sourceText,
      });
      // Validate output at infrastructure boundary before returning to use case (Rule 4)
      const parsed = CallableExtractorOutputSchema.parse(result.data);
      return parsed.candidates.map((c) => ({
        title: c.title,
        description: c.description,
        dueDate: c.due_date,
        source: c.source,
        confidence: c.confidence,
        sourceBlockId: c.source_block_id,
        sourceSnippet: c.source_snippet,
      }));
    } catch {
      // py_fn function not yet deployed — return stub data so UI pipeline is testable.
      // Removal of this stub is pending ADR on GAP-04 transition strategy.
      return [
        {
          title: "（AI 萃取功能待部署）",
          description: "py_fn extract_task_candidates callable 尚未部署。請先完成來源文件上傳並等待後端部署。",
          source: "ai",
          confidence: 0,
        },
      ];
    }
  }
}
