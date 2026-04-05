/**
 * modules/wiki — domain entity: Link
 *
 * Represents a directional relationship between two knowledge-graph nodes.
 */

import type { ID } from "@shared-types";

/** The nature of a link between two nodes */
export type LinkType =
  | "explicit"    // manually created by the user
  | "implicit"    // suggested / computed by AI
  | "hierarchy";  // parent → child page relationship

/** A directed edge in the knowledge graph */
export interface Link {
  /** Unique identifier of this link */
  readonly id: ID;
  /** Node (Page/Block) the link originates from */
  readonly sourceId: ID;
  /** Node (Page/Block) the link points to */
  readonly targetId: ID;
  /** Relationship type */
  readonly type: LinkType;
}
