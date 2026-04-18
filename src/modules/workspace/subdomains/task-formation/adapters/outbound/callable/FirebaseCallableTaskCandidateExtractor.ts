import { getFirebaseFunctions, httpsCallable } from "@integration-firebase/functions";
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

interface ExtractTaskCandidatesCallableOutput {
  readonly candidates: Array<{
    readonly title: string;
    readonly description?: string;
    readonly due_date?: string;
    readonly source: string;
    readonly confidence: number;
    readonly source_block_id?: string;
    readonly source_snippet?: string;
  }>;
}

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
      const fn = httpsCallable<ExtractTaskCandidatesCallableInput, ExtractTaskCandidatesCallableOutput>(
        functions,
        "extract_task_candidates",
      );
      const result = await fn({
        workspace_id: input.workspaceId,
        source_type: input.sourceType,
        source_page_ids: input.sourcePageIds,
        source_text: input.sourceText,
      });
      return result.data.candidates.map((c) => ({
        title: c.title,
        description: c.description,
        dueDate: c.due_date,
        source: c.source as "rule" | "ai",
        confidence: c.confidence,
        sourceBlockId: c.source_block_id,
        sourceSnippet: c.source_snippet,
      }));
    } catch {
      // py_fn function not yet deployed — return stub data so UI pipeline is testable.
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
