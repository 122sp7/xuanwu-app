/**
 * modules/wiki — api/knowledge-graph-api
 * Layer: api (cross-module facade)
 * Purpose: KnowledgeGraphApi — lightweight facade that wires in-memory
 *          adapters and exposes the knowledge-graph surface needed by
 *          consumers (e.g. system.ts composition root, debug pages).
 *
 * Bootstraps the AutoLinkUseCase and registers it on the shared event
 * bus so the knowledge-graph module reacts to content changes automatically:
 *   - content.page_created → upserts GraphNode (+ hierarchy Link if parented)
 *   - content.block-updated → extracts [[WikiLink]] → explicit Links
 */

import type { SimpleEventBus } from "../../shared/infrastructure/SimpleEventBus";

import type { GraphNode } from "../domain/entities/graph-node";
import type { Link } from "../domain/entities/link";
import { AutoLinkUseCase } from "../application/use-cases/auto-link.use-case";
import { InMemoryGraphRepository } from "../infrastructure/InMemoryGraphRepository";

/** Shape of the graph payload returned to consumers */
export interface GraphDataDTO {
  nodes: Array<{ id: string; label: string; group: string }>;
  edges: Array<{ from: string; to: string; type: string }>;
}

export class KnowledgeGraphApi {
  private readonly graphRepo: InMemoryGraphRepository;
  readonly autoLink: AutoLinkUseCase;

  constructor(eventBus: SimpleEventBus) {
    this.graphRepo = new InMemoryGraphRepository();
    this.autoLink = new AutoLinkUseCase(this.graphRepo);
    this.autoLink.registerOn(eventBus);
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
   * Shape: `{ nodes: [...], edges: [...] }`.
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

