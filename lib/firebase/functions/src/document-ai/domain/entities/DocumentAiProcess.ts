export interface DocumentAiProcessCommand {
  contentBase64: string;
  mimeType: string;
  processorName?: string;
  actorUid: string;
  metadata?: Record<string, string>;
}

export interface DocumentAiEntity {
  type: string;
  mentionText: string;
  confidence: number;
}

export interface DocumentAiProcessResult {
  processorName: string;
  text: string;
  pageCount: number;
  entities: DocumentAiEntity[];
}

export interface DocumentAiProcessLogEntry {
  actorUid: string;
  processorName: string;
  mimeType: string;
  pageCount: number;
  entityCount: number;
  createdAt: Date;
  metadata?: Record<string, string>;
}
