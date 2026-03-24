/**
 * Module: knowledge
 * Layer: api (cross-module facade)
 * Purpose: KnowledgeApi — lightweight facade that wires in-memory adapters
 *          and exposes the minimal surface needed by the demo-flow script.
 *
 * Bootstraps the LinkExtractorService and registers it on the shared event bus
 * so the knowledge module reacts to content changes automatically.
 */

import type { SimpleEventBus } from "../../shared/infrastructure/SimpleEventBus";

import type { GraphNode } from "../domain/entities/graph-node";
import type { Link } from "../domain/entities/link";
import { LinkExtractorService } from "../application/link-extractor.service";
import { InMemoryGraphRepository } from "../infrastructure/InMemoryGraphRepository";

export class KnowledgeApi {
  private readonly graphRepo: InMemoryGraphRepository;
  readonly linkExtractor: LinkExtractorService;

  constructor(eventBus: SimpleEventBus) {
    this.graphRepo = new InMemoryGraphRepository();
    this.linkExtractor = new LinkExtractorService(this.graphRepo);
    this.linkExtractor.registerOn(eventBus);
  }

  /** Return all nodes currently in the graph. */
  async listNodes(): Promise<GraphNode[]> {
    return this.graphRepo.listNodes();
  }

  /** Return all links currently in the graph. */
  async listLinks(): Promise<Link[]> {
    return this.graphRepo.listLinks();
  }

  /** Return outgoing explicit links from a given source page. */
  async getOutgoingLinks(pageId: string): Promise<Link[]> {
    return this.graphRepo.findLinksBySourceId(pageId);
  }
}
