export interface CitationSource {
  readonly id: string;
  readonly sourceId: string;
  readonly chunkId: string;
  readonly title?: string;
  readonly excerpt: string;
  readonly score: number;
  readonly url?: string;
}

export interface Citation {
  readonly id: string;
  readonly responseId: string;
  readonly sources: CitationSource[];
  readonly createdAtISO: string;
}

export interface CitationRepository {
  save(citation: Citation): Promise<void>;
  findById(id: string): Promise<Citation | null>;
  findByResponseId(responseId: string): Promise<Citation | null>;
}
