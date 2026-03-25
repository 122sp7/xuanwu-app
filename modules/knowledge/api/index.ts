/**
 * modules/knowledge — public API barrel.
 *
 * @deprecated All graph symbols have moved to modules/knowledge-graph.
 * This barrel is a temporary re-export bridge.
 * This module (knowledge) is being repurposed for Layer 2 Ingestion Pipeline.
 */
export type { Link, LinkType } from "../../knowledge-graph/domain/entities/link";
export type { GraphNode, GraphNodeType } from "../../knowledge-graph/domain/entities/graph-node";
export type { GraphRepository } from "../../knowledge-graph/domain/repositories/GraphRepository";
export { InMemoryGraphRepository } from "../../knowledge-graph/infrastructure/InMemoryGraphRepository";
export { LinkExtractorService } from "../../knowledge-graph/application/link-extractor.service";
export { KnowledgeGraphApi as KnowledgeApi } from "../../knowledge-graph/api/knowledge-graph-api";
export type { GraphDataDTO } from "../../knowledge-graph/api/knowledge-graph-api";
