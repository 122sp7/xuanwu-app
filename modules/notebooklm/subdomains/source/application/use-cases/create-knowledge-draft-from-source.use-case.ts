/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: CreateKnowledgeDraftFromSourceUseCase — creates a knowledge page draft from a parsed source document.
 *
 * Actor: logged-in user
 * Goal: read parsed text from storage, create a knowledge page with a text block.
 * Main success: page created, returns aggregateId.
 * Failure: missing input, storage retrieval failure, or page creation failure.
 */

import type { CommandResult } from "@shared-types";
import { commandFailureFrom, commandSuccess } from "@shared-types";

import type { ParsedDocumentPort } from "../../domain/ports/ParsedDocumentPort";

export interface CreateKnowledgeDraftInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
  readonly filename: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
}

export interface KnowledgePageGateway {
  createPage(input: {
    accountId: string;
    workspaceId: string;
    title: string;
    parentPageId: null;
    createdByUserId: string;
  }): Promise<CommandResult>;
  addBlock(input: {
    accountId: string;
    pageId: string;
    index: number;
    content: {
      type: "text";
      richText: readonly { type: string; plainText: string }[];
      properties: Record<string, unknown>;
    };
  }): Promise<CommandResult>;
}

function trimFileExtension(filename: string): string {
  const trimmed = filename.trim();
  const idx = trimmed.lastIndexOf(".");
  return idx <= 0 ? trimmed : trimmed.slice(0, idx);
}

export class CreateKnowledgeDraftFromSourceUseCase {
  constructor(
    private readonly parsedDocumentPort: ParsedDocumentPort,
    private readonly knowledgeGateway: KnowledgePageGateway,
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
      const plainText = parsedText || `[${trimFileExtension(input.filename)}]`;
      const title = `${trimFileExtension(input.filename)}｜匯入草稿`;

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
          richText: [{ type: "text", plainText }],
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
