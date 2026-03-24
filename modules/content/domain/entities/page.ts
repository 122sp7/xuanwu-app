/**
 * modules/content — domain entity: Page
 *
 * A Page is the primary content container.  It holds an ordered list of
 * Block identifiers; the actual Block data lives in the Block entity.
 */

import type { ID } from "@shared-types";

/** Lightweight Page interface — establishes the shape without persistence. */
export interface Page {
  /** Unique identifier */
  readonly id: ID;
  /** Display title */
  readonly title: string;
  /** Ordered list of Block IDs that compose this page's content */
  readonly blockIds: ID[];
}
