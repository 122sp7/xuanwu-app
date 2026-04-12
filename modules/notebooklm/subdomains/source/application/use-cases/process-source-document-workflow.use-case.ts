import {
  createIdleExecutionSummary,
  type SourceProcessingExecutionSummary,
} from "../dto/source-processing.dto";
import type {
  ParseSourceDocumentUseCase,
  ReindexSourceDocumentUseCase,
} from "./source-pipeline.use-cases";
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
  readonly createdByUserId?: string | null;
}

interface ParsedDocumentStatusPort {
  waitForParsedDocument(
    accountId: string,
    documentId: string,
  ): Promise<{ pageCount: number; jsonGcsUri: string }>;
}

export class ProcessSourceDocumentWorkflowUseCase {
  constructor(
    private readonly parseUseCase: ParseSourceDocumentUseCase,
    private readonly reindexUseCase: ReindexSourceDocumentUseCase,
    private readonly createDraftUseCase: CreateKnowledgeDraftFromSourceUseCase,
    private readonly parsedStatusPort: ParsedDocumentStatusPort,
  ) {}

  async execute(
    input: ProcessSourceDocumentWorkflowInput,
  ): Promise<SourceProcessingExecutionSummary> {
    let summary: SourceProcessingExecutionSummary = {
      ...createIdleExecutionSummary(),
      parse: { status: "running", detail: "正在呼叫 Document AI 解析文件" },
      rag: input.shouldRunRag
        ? { status: "idle", detail: "等待文件解析完成後建立索引" }
        : { status: "skipped", detail: "使用者未勾選 RAG 索引" },
      page: input.shouldCreatePage
        ? { status: "idle", detail: "等待文件解析完成後建立單頁草稿" }
        : { status: "skipped", detail: "使用者未勾選 Knowledge Page" },
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
          page: input.shouldCreatePage
            ? { status: "skipped", detail: "解析失敗，略過 Knowledge Page 建立。" }
            : summary.page,
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

      if (input.shouldCreatePage) {
        const createdByUserId = input.createdByUserId?.trim() ?? "";
        if (!createdByUserId) {
          summary = {
            ...summary,
            page: { status: "error", detail: "缺少登入使用者，無法建立 Knowledge Page 草稿" },
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
                detail: "已建立單頁 Draft，可直接進頁面補內容、調整結構，後續再迭代切頁策略。",
              },
            }
            : {
              ...summary,
              page: {
                status: "error",
                detail: draftResult.error.message || "建立 Knowledge Page 失敗",
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
        page: input.shouldCreatePage
          ? { status: "skipped", detail: "處理失敗，略過 Knowledge Page 建立。" }
          : summary.page,
      };
    }
  }
}