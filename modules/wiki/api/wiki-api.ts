/**
 * modules/wiki — api/knowledge-graph-api
 * Layer: api (cross-module facade)
 * Purpose: WikiApi — lightweight facade that wires in-memory
 *          adapters and exposes the knowledge-graph surface needed by
 *          consumers (e.g. system.ts composition root, debug pages).
 *
 * Bootstraps the AutoLinkUseCase and registers it on the shared event
 * bus so the knowledge-graph module reacts to content changes automatically:
 *   - content.page_created → upserts GraphNode (+ hierarchy GraphEdge if parented)
 *   - content.block-updated → extracts [[WikiLink]] → explicit GraphEdges
 */

import type { SimpleEventBus } from "../../shared/infrastructure/SimpleEventBus";

import type { GraphNode } from "../domain/entities/graph-node";
import type { GraphEdge } from "../domain/entities/graph-edge";
import { AutoLinkUseCase } from "../application/use-cases/auto-link.use-case";
import { InMemoryGraphRepository } from "../infrastructure/InMemoryGraphRepository";

/** Shape of the graph payload returned to consumers */
export interface GraphDataDTO {
  nodes: Array<{ id: string; label: string; group: string }>;
  edges: Array<{ from: string; to: string; type: string }>;
}

export class WikiApi {
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

  /** Return all edges currently in the graph. */
  async listEdges(): Promise<GraphEdge[]> {
    return this.graphRepo.listEdges();
  }

  /** Return outgoing explicit edges from a given source page. */
  async getOutgoingEdges(pageId: string): Promise<GraphEdge[]> {
    return this.graphRepo.findEdgesBySourceId(pageId);
  }

  /**
   * Return a GraphDataDTO summarising the full in-memory graph.
   * Shape: `{ nodes: [...], edges: [...] }`.
   */
  async getGraphData(): Promise<GraphDataDTO> {
    const [nodes, edges] = await Promise.all([
      this.graphRepo.listNodes(),
      this.graphRepo.listEdges(),
    ]);
    return {
      nodes: nodes.map((n) => ({ id: n.id, label: n.label, group: n.type })),
      edges: edges.map((e) => ({ from: e.sourceNodeId, to: e.targetNodeId, type: e.edgeType })),
    };
  }
}

