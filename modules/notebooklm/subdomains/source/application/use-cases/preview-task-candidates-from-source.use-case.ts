import type {
  ExtractedKnowledgeTask,
  ParsedKnowledgeTaskBlock,
  TaskMaterializationWorkflowPort,
} from "../../domain/ports/TaskMaterializationWorkflowPort";
import type { ParsedDocumentPort } from "../../domain/ports/ParsedDocumentPort";

export interface PreviewTaskCandidatesFromSourceInput {
  readonly knowledgePageId: string;
  readonly jsonGcsUri: string;
  readonly filename?: string;
  readonly mimeType?: string;
  readonly pageCount?: number;
}

export interface PreviewTaskCandidatesFromSourceResult {
  readonly candidates: ReadonlyArray<ExtractedKnowledgeTask>;
  readonly usedAiFallback: boolean;
  readonly errorMessage?: string;
}

function toTaskBlocks(parsedText: string): ReadonlyArray<ParsedKnowledgeTaskBlock> {
  return parsedText
    .split(/\r?\n+/)
    .map((text, index) => ({
      blockId: `preview-block-${index + 1}`,
      text: text.trim(),
      pageIndex: 1,
    }))
    .filter((block) => block.text.length > 0);
}

export class PreviewTaskCandidatesFromSourceUseCase {
  constructor(
    private readonly parsedDocumentPort: ParsedDocumentPort,
    private readonly taskWorkflowPort: TaskMaterializationWorkflowPort,
  ) {}

  async execute(
    input: PreviewTaskCandidatesFromSourceInput,
  ): Promise<PreviewTaskCandidatesFromSourceResult> {
    if (!input.jsonGcsUri.trim()) {
      return {
        candidates: [],
        usedAiFallback: false,
        errorMessage: "需要先完成 OCR 解析，才能預覽任務候選。",
      };
    }

    try {
      const parsedText = await this.parsedDocumentPort.loadParsedDocumentText(input.jsonGcsUri);
      const blocks = toTaskBlocks(parsedText);

      if (blocks.length === 0) {
        return {
          candidates: [],
          usedAiFallback: false,
          errorMessage: "解析結果為空，沒有可確認的任務。",
        };
      }

      const result = await this.taskWorkflowPort.extractTaskCandidates({
        knowledgePageId: input.knowledgePageId.trim() || "task-preview",
        blocks,
        enableAiFallback: true,
        sourceContext: {
          filename: input.filename,
          mimeType: input.mimeType,
          pageCount: input.pageCount,
          jsonGcsUri: input.jsonGcsUri,
        },
      });

      return {
        candidates: result.candidates,
        usedAiFallback: result.usedAiFallback,
      };
    } catch (error) {
      return {
        candidates: [],
        usedAiFallback: false,
        errorMessage: error instanceof Error ? error.message : "預覽任務候選失敗。",
      };
    }
  }
}
