/**
 * modules/wiki — public API barrel.
 */

export type { Link, LinkType } from "../domain/entities/link";
export type { GraphNode, GraphNodeType } from "../domain/entities/graph-node";
export type { GraphRepository } from "../domain/repositories/GraphRepository";
export { InMemoryGraphRepository } from "../infrastructure/InMemoryGraphRepository";
export { LinkExtractorService } from "../application/link-extractor.service";
export { AutoLinkUseCase } from "../application/use-cases/auto-link.use-case";
export { WikiApi } from "./wiki-api";
export type { GraphDataDTO } from "./wiki-api";
export type { GraphViewConfig, GraphLayout } from "../domain/entities/view-config";
