/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/adapters
 * Adapter: NotionKnowledgePageGatewayAdapter — delegates to notion bounded context API.
 *
 * Implements the KnowledgePageGateway port defined in the application layer,
 * bridging the source subdomain to the notion bounded context through its
 * top-level public API and published-language tokens.
 */

import type { CommandResult } from "@shared-types";

import type { KnowledgePageGateway } from "../../application/use-cases/create-knowledge-draft-from-source.use-case";

interface KnowledgeArtifactReferenceToken {
  readonly artifactId: string;
  readonly artifactType: "page" | "article";
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly slug: string;
}

function slugifyTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-\u4e00-\u9fff]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toKnowledgeArtifactReference(input: {
  accountId: string;
  workspaceId: string;
  title: string;
  artifactId: string;
}): KnowledgeArtifactReferenceToken {
  return {
    artifactId: input.artifactId,
    artifactType: "page",
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    title: input.title,
    slug: slugifyTitle(input.title),
  };
}

export class NotionKnowledgePageGatewayAdapter implements KnowledgePageGateway {
  constructor(
    private readonly deps: {
      createKnowledgePage: (input: {
        accountId: string;
        workspaceId: string;
        title: string;
        parentPageId: null;
        createdByUserId: string;
      }) => Promise<CommandResult>;
      addKnowledgeBlock: (input: {
        accountId: string;
        pageId: string;
        index: number;
        content: {
          type: "text";
          richText: readonly { type: string; plainText: string }[];
          properties: Record<string, unknown>;
        };
      }) => Promise<CommandResult>;
    },
  ) {}

  async createPage(input: {
    accountId: string;
    workspaceId: string;
    title: string;
    parentPageId: null;
    createdByUserId: string;
  }): Promise<CommandResult> {
    const result = await this.deps.createKnowledgePage(input);
    if (!result.success) return result;

    // Normalize cross-context return as notion published-language token.
    const reference = toKnowledgeArtifactReference({
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      title: input.title,
      artifactId: result.aggregateId,
    });

    return {
      ...result,
      aggregateId: reference.artifactId,
    };
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
    return this.deps.addKnowledgeBlock(input);
  }
}
