/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: KnowledgePageGateway — anti-corruption layer for creating knowledge pages
 *       in the notion bounded context.
 *
 * This port isolates cross-context collaboration. Infrastructure provides
 * the adapter that delegates to notion/api; application consumes via use cases.
 */

import type { CommandResult } from "@shared-types";

export interface KnowledgePageGateway {
  createPage(input: {
    accountId: string;
    workspaceId: string;
    title: string;
    parentPageId: null;
    createdByUserId: string;
  }): Promise<CommandResult>;
  addBlock(input: {
    accountId: string;
    pageId: string;
    index: number;
    content: {
      type: "text";
      richText: readonly { type: string; plainText: string }[];
      properties: Record<string, unknown>;
    };
  }): Promise<CommandResult>;
}
