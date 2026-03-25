/**
 * modules/knowledge — public API barrel.
 *
 * @deprecated All graph symbols have moved to modules/knowledge-graph.
 * This barrel is a temporary re-export bridge.
 * This module (knowledge) is being repurposed for Layer 2 Ingestion Pipeline.
 */
export { KnowledgeIngestionApi } from "./knowledge-ingestion-api";

export type {
	IngestionJob,
	IngestionStatus,
} from "../domain/entities/IngestionJob";

export type { Link, LinkType } from "../../knowledge-graph/api";
export type { GraphNode, GraphNodeType } from "../../knowledge-graph/api";
export type { GraphRepository } from "../../knowledge-graph/api";
export { InMemoryGraphRepository } from "../../knowledge-graph/api";
export { LinkExtractorService } from "../../knowledge-graph/api";
export { KnowledgeGraphApi as KnowledgeApi } from "../../knowledge-graph/api";
export type { GraphDataDTO } from "../../knowledge-graph/api";
