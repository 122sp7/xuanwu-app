import type {
  KnowledgeChunkEntity,
  KnowledgeDocumentEntity,
} from "../entities/KnowledgeDocument";

export interface KnowledgeRepository {
  findDocumentById(id: string, orgId: string): Promise<KnowledgeDocumentEntity | null>;
  listDocumentsByOrg(orgId: string): Promise<KnowledgeDocumentEntity[]>;
  saveDocument(document: KnowledgeDocumentEntity): Promise<void>;
  replaceChunks(documentId: string, orgId: string, chunks: KnowledgeChunkEntity[]): Promise<void>;
  findChunksByDocument(documentId: string, orgId: string): Promise<KnowledgeChunkEntity[]>;
}
