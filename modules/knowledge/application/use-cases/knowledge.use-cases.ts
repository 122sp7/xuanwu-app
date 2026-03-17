import { commandFailureFrom, commandSuccess } from "@/shared/types";
import type { CommandResult } from "@/shared/types";
import type {
  KnowledgeChunkEntity,
  KnowledgeDocumentEntity,
} from "../../domain/entities/KnowledgeDocument";
import type { KnowledgeRepository } from "../../domain/repositories/KnowledgeRepository";

function splitIntoChunks(
  documentId: string,
  orgId: string,
  content: string,
): KnowledgeChunkEntity[] {
  const sections = content
    .split(/\n\s*\n/g)
    .map((section) => section.trim())
    .filter(Boolean);

  if (sections.length === 0) {
    return [{ documentId, orgId, order: 0, content: "" }];
  }

  return sections.map((section, index) => ({
    documentId,
    orgId,
    order: index,
    content: section,
  }));
}

export class UpsertKnowledgeDocumentUseCase {
  constructor(
    private readonly knowledgeRepository: KnowledgeRepository,
    private readonly idGenerator: () => string = () => crypto.randomUUID(),
  ) {}

  async execute(input: {
    orgId: string;
    title: string;
    content: string;
    documentId?: string;
    taxonomyRef?: string;
    visibility?: KnowledgeDocumentEntity["visibility"];
  }): Promise<CommandResult> {
    try {
      if (!input.orgId.trim()) {
        return commandFailureFrom("KNOWLEDGE_ORG_REQUIRED", "orgId is required");
      }

      const existing = input.documentId
        ? await this.knowledgeRepository.findDocumentById(input.documentId, input.orgId)
        : null;

      const now = new Date();
      const documentId = existing?.id ?? input.documentId ?? this.idGenerator();
      const version = existing ? existing.version + 1 : 1;

      const document: KnowledgeDocumentEntity = {
        id: documentId,
        orgId: input.orgId,
        title: input.title,
        content: input.content,
        version,
        taxonomyRef: input.taxonomyRef,
        visibility: input.visibility ?? "org",
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };

      await this.knowledgeRepository.saveDocument(document);
      await this.knowledgeRepository.replaceChunks(
        document.id,
        document.orgId,
        splitIntoChunks(document.id, document.orgId, document.content),
      );

      return commandSuccess(document.id, document.version);
    } catch (err) {
      return commandFailureFrom(
        "KNOWLEDGE_UPSERT_FAILED",
        err instanceof Error ? err.message : "Failed to upsert knowledge document",
      );
    }
  }
}

export class ListKnowledgeDocumentsUseCase {
  constructor(private readonly knowledgeRepository: KnowledgeRepository) {}

  async execute(orgId: string): Promise<KnowledgeDocumentEntity[]> {
    if (!orgId.trim()) {
      return [];
    }

    try {
      return this.knowledgeRepository.listDocumentsByOrg(orgId);
    } catch {
      return [];
    }
  }
}
