import type {
  KnowledgeChunkEntity,
  KnowledgeDocumentEntity,
} from "../domain/entities/KnowledgeDocument";
import type { KnowledgeRepository } from "../domain/repositories/KnowledgeRepository";

export class KnowledgeRepoImpl implements KnowledgeRepository {
  private readonly documents = new Map<string, KnowledgeDocumentEntity>();
  private readonly chunks = new Map<string, KnowledgeChunkEntity[]>();

  private documentKey(id: string, orgId: string): string {
    return `${orgId}:${id}`;
  }

  private toDate(value: Date | string | number): Date {
    return value instanceof Date ? new Date(value.getTime()) : new Date(value);
  }

  private cloneDocument(document: KnowledgeDocumentEntity): KnowledgeDocumentEntity {
    return {
      ...document,
      createdAt: this.toDate(document.createdAt),
      updatedAt: this.toDate(document.updatedAt),
    };
  }

  private cloneChunk(chunk: KnowledgeChunkEntity): KnowledgeChunkEntity {
    return { ...chunk };
  }

  async findDocumentById(id: string, orgId: string): Promise<KnowledgeDocumentEntity | null> {
    const document = this.documents.get(this.documentKey(id, orgId));
    return document ? this.cloneDocument(document) : null;
  }

  async listDocumentsByOrg(orgId: string): Promise<KnowledgeDocumentEntity[]> {
    return Array.from(this.documents.values())
      .filter((document) => document.orgId === orgId)
      .map((document) => this.cloneDocument(document));
  }

  async saveDocument(document: KnowledgeDocumentEntity): Promise<void> {
    this.documents.set(
      this.documentKey(document.id, document.orgId),
      this.cloneDocument(document),
    );
  }

  async replaceChunks(
    documentId: string,
    orgId: string,
    chunks: KnowledgeChunkEntity[],
  ): Promise<void> {
    const key = this.documentKey(documentId, orgId);
    this.chunks.set(
      key,
      chunks
        .filter((chunk) => chunk.documentId === documentId && chunk.orgId === orgId)
        .sort((a, b) => a.order - b.order)
        .map((chunk) => this.cloneChunk(chunk)),
    );
  }

  async findChunksByDocument(documentId: string, orgId: string): Promise<KnowledgeChunkEntity[]> {
    const chunks = this.chunks.get(this.documentKey(documentId, orgId)) ?? [];
    return chunks.map((chunk) => this.cloneChunk(chunk));
  }
}
