"use server";

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";

import { addKnowledgeBlock, createKnowledgePage } from "@/modules/knowledge/api";

interface CreateKnowledgeDraftFromSourceDocumentInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
  readonly filename: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function trimFileExtension(filename: string): string {
  const trimmed = filename.trim();
  const extensionIndex = trimmed.lastIndexOf(".");
  if (extensionIndex <= 0) {
    return trimmed;
  }

  return trimmed.slice(0, extensionIndex);
}

async function loadParsedDocumentText(jsonGcsUri: string): Promise<string> {
  if (!jsonGcsUri) {
    return "";
  }

  const storage = getFirebaseStorage();
  const jsonRef = storageApi.ref(storage, jsonGcsUri);
  const url = await storageApi.getDownloadURL(jsonRef);
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`無法讀取解析 JSON (${response.status})`);
  }

  const payload = asRecord(await response.json());
  return asString(payload.text);
}

function buildDraftBlockText(input: {
  readonly filename: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
  readonly parsedText: string;
}): string {
  const normalized = normalizeWhitespace(input.parsedText);
  const excerpt = normalized.length > 1200 ? `${normalized.slice(0, 1200)}…` : normalized;

  return [
    `來源文件：${input.filename}`,
    `原始檔案：${input.sourceGcsUri}`,
    `解析 JSON：${input.jsonGcsUri}`,
    `頁數：${input.pageCount}`,
    "",
    excerpt ? `節錄：${excerpt}` : "這份文件已完成解析，後續可再補充分頁、摘要與結構化內容。",
  ].join("\n");
}

export async function createKnowledgeDraftFromSourceDocument(
  input: CreateKnowledgeDraftFromSourceDocumentInput,
): Promise<CommandResult> {
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
    const titleBase = trimFileExtension(input.filename) || input.filename;
    const pageResult = await createKnowledgePage({
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      title: `${titleBase}｜匯入草稿`,
      parentPageId: null,
      createdByUserId: input.createdByUserId,
    });

    if (!pageResult.success) {
      return pageResult;
    }

    const parsedText = await loadParsedDocumentText(input.jsonGcsUri);
    const blockResult = await addKnowledgeBlock({
      accountId: input.accountId,
      pageId: pageResult.aggregateId,
      index: 0,
      content: {
        type: "text",
        richText: [
          {
            type: "text",
            plainText: buildDraftBlockText({
              filename: input.filename,
              sourceGcsUri: input.sourceGcsUri,
              jsonGcsUri: input.jsonGcsUri,
              pageCount: input.pageCount,
              parsedText,
            }),
          },
        ],
      },
    });

    if (!blockResult.success) {
      return blockResult;
    }

    return commandSuccess(pageResult.aggregateId, blockResult.version);
  } catch (error) {
    return commandFailureFrom(
      "SOURCE_KNOWLEDGE_DRAFT_CREATE_FAILED",
      error instanceof Error ? error.message : "建立 Knowledge Page Draft 失敗。",
    );
  }
}