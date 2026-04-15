import type { SemanticSearchPort, SemanticSearchInput, VectorSearchResult } from "../../domain/ports/RetrievalPorts";

export class SemanticSearchUseCase {
  constructor(private readonly port: SemanticSearchPort) {}

  async execute(input: SemanticSearchInput): Promise<VectorSearchResult[]> {
    return this.port.semanticSearch(input);
  }
}
