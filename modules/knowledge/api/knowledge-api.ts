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

/** Shape of the graph payload defined in APIContract.md */
export interface GraphDataDTO {
  nodes: Array<{ id: string; label: string; group: string }>;
  edges: Array<{ from: string; to: string; type: string }>;
}

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

  /**
   * Return a GraphDataDTO summarising the full in-memory graph.
   * Shape matches the APIContract: `{ nodes: [...], edges: [...] }`.
   */
  async getGraphData(): Promise<GraphDataDTO> {
    const [nodes, links] = await Promise.all([
      this.graphRepo.listNodes(),
      this.graphRepo.listLinks(),
    ]);
    return {
      nodes: nodes.map((n) => ({ id: n.id, label: n.label, group: n.type })),
      edges: links.map((l) => ({ from: l.sourceId, to: l.targetId, type: l.type })),
    };
  }
}
