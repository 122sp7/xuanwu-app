import {
  createIdleExecutionSummary,
  type SourceProcessingExecutionSummary,
} from "../dto/source-processing.dto";
import type {
  ParseSourceDocumentUseCase,
  ReindexSourceDocumentUseCase,
} from "./source-pipeline.use-cases";
import type { ParsedDocumentPort } from "../../domain/ports/ParsedDocumentPort";
import type {
  ParsedKnowledgeTaskBlock,
  TaskMaterializationWorkflowPort,
} from "../../domain/ports/TaskMaterializationWorkflowPort";
import type { CreateKnowledgeDraftFromSourceUseCase } from "./create-knowledge-draft-from-source.use-case";

export interface ProcessSourceDocumentWorkflowInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly filename: string;
  readonly gcsUri: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly shouldRunRag: boolean;
  readonly shouldCreatePage: boolean;
  readonly shouldCreateTasks: boolean;
  readonly createdByUserId?: string | null;
}

interface ParsedDocumentStatusPort {
  waitForParsedDocument(
    accountId: string,
    documentId: string,
  ): Promise<{ pageCount: number; jsonGcsUri: string }>;
}

function toTaskBlocks(parsedText: string): ReadonlyArray<ParsedKnowledgeTaskBlock> {
  return parsedText
    .split(/\r?\n+/)
    .map((text, index) => ({
      blockId: `block-${index + 1}`,
      text: text.trim(),
      pageIndex: 1,
    }))
    .filter((block) => block.text.length > 0);
}

export class ProcessSourceDocumentWorkflowUseCase {
  constructor(
    private readonly parseUseCase: ParseSourceDocumentUseCase,
    private readonly reindexUseCase: ReindexSourceDocumentUseCase,
    private readonly createDraftUseCase: CreateKnowledgeDraftFromSourceUseCase,
    private readonly parsedStatusPort: ParsedDocumentStatusPort,
    private readonly parsedDocumentPort: ParsedDocumentPort,
    private readonly taskWorkflowPort: TaskMaterializationWorkflowPort,
  ) {}

  async execute(
    input: ProcessSourceDocumentWorkflowInput,
  ): Promise<SourceProcessingExecutionSummary> {
    const shouldPreparePage = input.shouldCreatePage || input.shouldCreateTasks;
    const workflowHref = `/${encodeURIComponent(input.accountId)}/${encodeURIComponent(input.workspaceId)}?tab=Tasks`;

    let summary: SourceProcessingExecutionSummary = {
      ...createIdleExecutionSummary(),
      parse: { status: "running", detail: "正在呼叫 Document AI 解析文件" },
      rag: input.shouldRunRag
        ? { status: "idle", detail: "等待文件解析完成後建立索引" }
        : { status: "skipped", detail: "使用者未勾選 RAG 索引" },
      page: shouldPreparePage
        ? {
          status: "idle",
          detail: input.shouldCreateTasks
            ? "等待建立 Knowledge Page 以承接任務流程"
            : "等待文件解析完成後建立單頁草稿",
        }
        : { status: "skipped", detail: "使用者未勾選 Knowledge Page" },
      task: input.shouldCreateTasks
        ? { status: "idle", detail: "等待 AI 抽取候選任務並送入 Workspace Flow" }
        : { status: "skipped", detail: "使用者未勾選任務流程" },
    };

    try {
      const parseResult = await this.parseUseCase.execute({
        accountId: input.accountId,
        workspaceId: input.workspaceId,
        documentId: input.sourceFileId,
        gcsUri: input.gcsUri,
        filename: input.filename,
        mimeType: input.mimeType || "application/octet-stream",
        sizeBytes: input.sizeBytes,
      });

      if (!parseResult.ok) {
        return {
          ...summary,
          parse: { status: "error", detail: parseResult.error.message },
          rag: input.shouldRunRag
            ? { status: "skipped", detail: "解析失敗，略過 RAG 索引。" }
            : summary.rag,
          page: shouldPreparePage
            ? { status: "skipped", detail: "解析失敗，略過 Knowledge Page 建立。" }
            : summary.page,
          task: input.shouldCreateTasks
            ? { status: "skipped", detail: "解析失敗，略過任務流程。" }
            : summary.task,
        };
      }

      const documentId = parseResult.data.documentId;
      const parsedDocument = await this.parsedStatusPort.waitForParsedDocument(
        input.accountId,
        documentId,
      );

      summary = {
        ...summary,
        pageCount: parsedDocument.pageCount,
        jsonGcsUri: parsedDocument.jsonGcsUri,
        parse: { status: "success", detail: `解析完成，共 ${parsedDocument.pageCount} 頁。` },
      };

      if (input.shouldRunRag) {
        const ragResult = await this.reindexUseCase.execute({
          accountId: input.accountId,
          workspaceId: input.workspaceId,
          documentId,
          jsonGcsUri: parsedDocument.jsonGcsUri,
          sourceGcsUri: input.gcsUri,
          filename: input.filename,
          pageCount: parsedDocument.pageCount,
        });

        summary = ragResult.ok
          ? {
            ...summary,
            rag: {
              status: "success",
              detail: `索引完成，${ragResult.data.chunkCount} 個 chunks / ${ragResult.data.vectorCount} 個 vectors。`,
            },
          }
          : {
            ...summary,
            rag: { status: "error", detail: ragResult.error.message },
          };
      }

      let createdPageId = "";
      const createdByUserId = input.createdByUserId?.trim() ?? "";

      if (shouldPreparePage) {
        if (!createdByUserId) {
          summary = {
            ...summary,
            page: { status: "error", detail: "缺少登入使用者，無法建立 Knowledge Page" },
            task: input.shouldCreateTasks
              ? { status: "skipped", detail: "缺少登入使用者，略過任務流程。" }
              : summary.task,
          };
        } else {
          const draftResult = await this.createDraftUseCase.execute({
            accountId: input.accountId,
            workspaceId: input.workspaceId,
            createdByUserId,
            filename: input.filename,
            sourceGcsUri: input.gcsUri,
            jsonGcsUri: parsedDocument.jsonGcsUri,
            pageCount: parsedDocument.pageCount,
          });

          summary = draftResult.success
            ? {
              ...summary,
              pageHref: `/knowledge/pages/${draftResult.aggregateId}`,
              page: {
                status: "success",
                detail: input.shouldCreateTasks
                  ? "已建立 Knowledge Page，接著送入任務流程。"
                  : "已建立單頁 Draft，可直接進頁面補內容、調整結構，後續再迭代切頁策略。",
              },
            }
            : {
              ...summary,
              page: {
                status: "error",
                detail: draftResult.error.message || "建立 Knowledge Page 失敗",
              },
              task: input.shouldCreateTasks
                ? { status: "skipped", detail: "Knowledge Page 建立失敗，略過任務流程。" }
                : summary.task,
            };

          if (draftResult.success) {
            createdPageId = draftResult.aggregateId;
          }
        }
      }

      if (input.shouldCreateTasks) {
        if (!createdPageId) {
          return summary;
        }

        const parsedText = await this.parsedDocumentPort.loadParsedDocumentText(
          parsedDocument.jsonGcsUri,
        );
        const blocks = toTaskBlocks(parsedText);
        const extraction = await this.taskWorkflowPort.extractTaskCandidates({
          knowledgePageId: createdPageId,
          blocks,
          enableAiFallback: true,
          sourceContext: {
            filename: input.filename,
            mimeType: input.mimeType,
            pageCount: parsedDocument.pageCount,
            sourceGcsUri: input.gcsUri,
            jsonGcsUri: parsedDocument.jsonGcsUri,
          },
        });

        if (extraction.candidates.length === 0) {
          summary = {
            ...summary,
            workflowHref,
            taskCount: 0,
            task: {
              status: "success",
              detail: extraction.usedAiFallback
                ? "已完成任務掃描，但未找到可建立的任務。"
                : "已完成任務掃描，未偵測到待辦任務。",
            },
          };
        } else {
          const materializeResult = await this.taskWorkflowPort.materializeKnowledgeTasks({
            accountId: input.accountId,
            workspaceId: input.workspaceId,
            pageId: createdPageId,
            actorId: createdByUserId,
            extractedTasks: extraction.candidates,
          });

          summary = materializeResult.success
            ? {
              ...summary,
              workflowHref,
              taskCount: extraction.candidates.length,
              task: {
                status: "success",
                detail: `已送出 ${extraction.candidates.length} 項任務到 Workspace Flow${extraction.usedAiFallback ? "（含 AI 補強）" : ""}。`,
              },
            }
            : {
              ...summary,
              task: {
                status: "error",
                detail: materializeResult.error.message || "送入任務流程失敗",
              },
            };
        }
      }

      return summary;
    } catch (error) {
      const message = error instanceof Error ? error.message : "文件處理失敗";
      return {
        ...summary,
        parse: { status: "error", detail: message },
        rag: input.shouldRunRag
          ? { status: "skipped", detail: "處理失敗，略過 RAG 索引。" }
          : summary.rag,
        page: shouldPreparePage
          ? { status: "skipped", detail: "處理失敗，略過 Knowledge Page 建立。" }
          : summary.page,
        task: input.shouldCreateTasks
          ? { status: "skipped", detail: "處理失敗，略過任務流程。" }
          : summary.task,
      };
    }
  }
}