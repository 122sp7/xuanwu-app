/**
 * modules/ai — public API barrel.
 *
 * @deprecated All graph symbols have moved to modules/wiki.
 * This barrel is a temporary re-export bridge.
 * This module (knowledge) is being repurposed for Layer 2 Ingestion Pipeline.
 */
export { KnowledgeIngestionApi } from "./knowledge-ingestion-api";

export type {
	IngestionJob,
	IngestionStatus,
} from "../domain/entities/IngestionJob";

export type { Link, LinkType } from "../../wiki/api";
export type { GraphNode, GraphNodeType } from "../../wiki/api";
export type { GraphRepository } from "../../wiki/api";
export { InMemoryGraphRepository } from "../../wiki/api";
export { LinkExtractorService } from "../../wiki/api";
export { KnowledgeGraphApi as KnowledgeApi } from "../../wiki/api";
export type { GraphDataDTO } from "../../wiki/api";
