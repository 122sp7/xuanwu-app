/**
 * Module: knowledge
 * Layer: infrastructure/in-memory
 * Purpose: In-memory adapter for GraphRepository.
 *          Uses plain Map — no external database required.
 *          Designed for local demos and unit tests (Occam's Razor).
 */

import type { GraphNode } from "../domain/entities/graph-node";
import type { Link, LinkType } from "../domain/entities/link";
import type { GraphRepository } from "../domain/repositories/GraphRepository";

export class InMemoryGraphRepository implements GraphRepository {
  private readonly nodes = new Map<string, GraphNode>();
  private readonly links = new Map<string, Link>();

  async upsertNode(node: GraphNode): Promise<void> {
    this.nodes.set(node.id, node);
  }

  async addLink(link: Link): Promise<void> {
    this.links.set(link.id, link);
  }

  async findLinksBySourceId(sourceId: string): Promise<Link[]> {
    return [...this.links.values()].filter((l) => l.sourceId === sourceId);
  }

  async findLinksByTargetId(targetId: string): Promise<Link[]> {
    return [...this.links.values()].filter((l) => l.targetId === targetId);
  }

  async findLinksByType(type: LinkType): Promise<Link[]> {
    return [...this.links.values()].filter((l) => l.type === type);
  }

  async listNodes(): Promise<GraphNode[]> {
    return [...this.nodes.values()];
  }

  async listLinks(): Promise<Link[]> {
    return [...this.links.values()];
  }
}
