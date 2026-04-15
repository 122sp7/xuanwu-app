/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: CreateKnowledgeDraftFromSourceUseCase — creates a knowledge page draft from a parsed source document.
 *
 * Actor: logged-in user
 * Goal: distil parsed document via Genkit to produce a structured knowledge page draft.
 * Main success: page created with AI-distilled overview + key points, returns aggregateId.
 * Failure: missing input, storage retrieval failure, or page creation failure.
 */

import type { CommandResult } from "@shared-types";
import { commandFailureFrom, commandSuccess } from "@shared-types";

import type { ContentDistillationPort } from "../../domain/ports/ContentDistillationPort";
import type { ParsedDocumentPort } from "../../domain/ports/ParsedDocumentPort";
import type { KnowledgePageGateway } from "../../domain/ports/KnowledgePageGatewayPort";

export type { KnowledgePageGateway } from "../../domain/ports/KnowledgePageGatewayPort";

export interface CreateKnowledgeDraftInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
  readonly filename: string;
  readonly mimeType?: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
}

function trimFileExtension(filename: string): string {
  const trimmed = filename.trim();
  const idx = trimmed.lastIndexOf(".");
  return idx <= 0 ? trimmed : trimmed.slice(0, idx);
}

function buildPageBodyFromDistillation(
  overview: string,
  items: readonly { title: string; summary: string }[],
): string {
  const sections = [overview];
  for (const item of items) {
    sections.push(`## ${item.title}\n\n${item.summary}`);
  }
  return sections.filter(Boolean).join("\n\n");
}

export class CreateKnowledgeDraftFromSourceUseCase {
  constructor(
    private readonly parsedDocumentPort: ParsedDocumentPort,
    private readonly knowledgeGateway: KnowledgePageGateway,
    private readonly distillationPort?: ContentDistillationPort,
  ) {}

  async execute(input: CreateKnowledgeDraftInput): Promise<CommandResult> {
    if (!input.accountId.trim() || !input.workspaceId.trim() || !input.createdByUserId.trim()) {
      return commandFailureFrom(
        "SOURCE_KNOWLEDGE_DRAFT_INVALID_SCOPE",
        "accountId、workspaceId、createdByUserId 為必填。",
      );
    }

    if (!input.filename.trim() || !input.sourceGcsUri.trim() || !input.jsonGcsUri.trim()) {
      return commandFailureFrom(
        "SOURCE_KNOWLEDGE_DRAFT_INVALID_SOURCE",
        "filename、sourceGcsUri、jsonGcsUri 為必填。",
      );
    }

    try {
      const parsedText = await this.parsedDocumentPort.loadParsedDocumentText(input.jsonGcsUri);
      const fallbackText = `[${trimFileExtension(input.filename)}]`;
      const title = `${trimFileExtension(input.filename)}｜匯入草稿`;

      let pageBodyText: string;

      if (this.distillationPort && parsedText) {
        const distilled = await this.distillationPort.distill({
          sources: [{ title: trimFileExtension(input.filename), text: parsedText }],
          objective: "建立可供編輯的知識頁面草稿，提取重點並整理成結構化段落",
        });
        pageBodyText = buildPageBodyFromDistillation(
          distilled.overview,
          distilled.distilledItems,
        );
      } else {
        pageBodyText = parsedText || fallbackText;
      }

      const TIPTAP_PROPERTY_KEY = "tiptapJson";

      const pageResult = await this.knowledgeGateway.createPage({
        accountId: input.accountId,
        workspaceId: input.workspaceId,
        title,
        parentPageId: null,
        createdByUserId: input.createdByUserId,
      });

      if (!pageResult.success) return pageResult;

      const blockResult = await this.knowledgeGateway.addBlock({
        accountId: input.accountId,
        pageId: pageResult.aggregateId,
        index: 0,
        content: {
          type: "text",
          richText: [{ type: "text", plainText: pageBodyText }],
          properties: { [TIPTAP_PROPERTY_KEY]: null },
        },
      });

      if (!blockResult.success) return blockResult;

      return commandSuccess(pageResult.aggregateId, blockResult.version);
    } catch (error) {
      return commandFailureFrom(
        "SOURCE_KNOWLEDGE_DRAFT_CREATE_FAILED",
        error instanceof Error ? error.message : "建立 Knowledge Page Draft 失敗。",
      );
    }
  }
}
