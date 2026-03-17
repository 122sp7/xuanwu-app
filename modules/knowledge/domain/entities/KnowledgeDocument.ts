export interface KnowledgeDocumentEntity {
  id: string;
  orgId: string;
  title: string;
  content: string;
  version: number;
  taxonomyRef?: string;
  visibility: "org" | "workspace" | "private";
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeChunkEntity {
  documentId: string;
  orgId: string;
  order: number;
  content: string;
}
