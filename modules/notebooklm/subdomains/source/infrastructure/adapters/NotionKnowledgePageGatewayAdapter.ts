/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/adapters
 * Adapter: NotionKnowledgePageGatewayAdapter — delegates to notion bounded context API.
 *
 * Implements the KnowledgePageGateway port defined in the application layer,
 * bridging the source subdomain to the notion bounded context through its public API.
 */

import type { CommandResult } from "@shared-types";

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
