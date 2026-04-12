/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/adapters
 * Adapter: NotionKnowledgePageGatewayAdapter — delegates to notion bounded context API.
 *
 * Implements the KnowledgePageGateway port defined in the application layer,
 * bridging the source subdomain to the notion bounded context through its public API.
 * 
 * ⚠️ MIGRATION NOTE (AGENTS.md violation fix):
 * Currently calls notion.api directly. Per AGENTS.md context map rule,
 * notion → notebooklm relationship should use published language tokens:
 *   - knowledge artifact reference
 *   - attachment reference
 *   - taxonomy hint
 * 
 * TODO: Extract published language contract; adapt through port boundary.
 * Status: PLANNED FOR NEXT PHASE (2-3h estimate)
 */

import type { CommandResult } from "@shared-types";

/**
 * DIRECT API CALL — violation of AGENTS.md cross-domain boundary rule.
 * TODO: Replace with published language token-based contract.
 */
import { addKnowledgeBlock, createKnowledgePage } from "@/modules/notion/api";

import type { KnowledgePageGateway } from "../../application/use-cases/create-knowledge-draft-from-source.use-case";

export class NotionKnowledgePageGatewayAdapter implements KnowledgePageGateway {
  async createPage(input: {
    accountId: string;
    workspaceId: string;
    title: string;
    parentPageId: null;
    createdByUserId: string;
  }): Promise<CommandResult> {
    return createKnowledgePage(input);
  }

  async addBlock(input: {
    accountId: string;
    pageId: string;
    index: number;
    content: {
      type: "text";
      richText: readonly { type: string; plainText: string }[];
      properties: Record<string, unknown>;
    };
  }): Promise<CommandResult> {
    return addKnowledgeBlock(input);
  }
}
