/**
 * Module: knowledge
 * Layer: domain/repositories
 * Purpose: Port interfaces for the knowledge graph persistence.
 *
 * The infrastructure layer implements these; the application layer depends only
 * on these ports (Dependency Inversion Principle).
 */

import type { GraphNode } from "../entities/graph-node";
import type { Link, LinkType } from "../entities/link";

export interface GraphRepository {
  /** Persist or update a node (upsert by id). */
  upsertNode(node: GraphNode): Promise<void>;

  /** Persist a new link between two nodes. */
  addLink(link: Link): Promise<void>;

  /** Return all links originating from a given node. */
  findLinksBySourceId(sourceId: string): Promise<Link[]>;

  /** Return all links pointing to a given node (backlinks). */
  findLinksByTargetId(targetId: string): Promise<Link[]>;

  /** Return all links with the given type. */
  findLinksByType(type: LinkType): Promise<Link[]>;

  /** Return all nodes in the graph. */
  listNodes(): Promise<GraphNode[]>;

  /** Return all links in the graph. */
  listLinks(): Promise<Link[]>;
}
