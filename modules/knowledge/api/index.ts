/**
 * modules/knowledge — public API barrel.
 */

export type { Link, LinkType } from "../domain/entities/link";
export type { GraphNode, GraphNodeType } from "../domain/entities/graph-node";
export type { GraphRepository } from "../domain/repositories/GraphRepository";
export { InMemoryGraphRepository } from "../infrastructure/InMemoryGraphRepository";
export { LinkExtractorService } from "../application/link-extractor.service";
export { KnowledgeApi } from "./knowledge-api";
