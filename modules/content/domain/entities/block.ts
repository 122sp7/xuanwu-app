/**
 * modules/content — domain entity: Block
 *
 * A Block is the atomic unit of content.  The `Block` type is a discriminated
 * union so consumers can narrow on `type` with exhaustive checks.
 */

import type { ID } from "@shared-types";

/** Plain-text paragraph */
export interface TextBlock {
  readonly id: ID;
  readonly type: "text";
  readonly content: string;
}

/** Heading (h1 / h2 / h3) */
export interface HeadingBlock {
  readonly id: ID;
  readonly type: "heading";
  readonly content: string;
  readonly level: 1 | 2 | 3;
}

/** Fenced code block with optional language hint */
export interface CodeBlock {
  readonly id: ID;
  readonly type: "code";
  readonly content: string;
  readonly language?: string;
}

/** Discriminated union of all supported block variants */
export type Block = TextBlock | HeadingBlock | CodeBlock;
