import { describe, expect, it } from "vitest";

import { ContentBlock } from "../../domain/aggregates/ContentBlock";
import type { ContentBlockRepository } from "../../domain/repositories/ContentBlockRepository";
import type { KnowledgePageRepository } from "../../domain/repositories/KnowledgePageRepository";
import { plainTextBlockContent } from "../../domain/value-objects/BlockContent";
import type {
  KnowledgeSummaryPort,
  KnowledgeSummaryResult,
} from "../../domain/ports/KnowledgeSummaryPort";
import { GenerateKnowledgePageSummaryQuery } from "./knowledge-summary.queries";

function createPageRepoStub(): KnowledgePageRepository {
  return {
    async save() {
      return;
    },
    async findById() {
      return null;
    },
    async listByAccountId() {
      return [];
    },
    async listByWorkspaceId() {
      return [];
    },
    async countByParent() {
      return 0;
    },
    async findSnapshotById() {
      return {
        id: "page-1",
        accountId: "account-1",
        workspaceId: "workspace-1",
        title: "Project Guide",
        slug: "project-guide",
        parentPageId: null,
        order: 0,
        blockIds: ["block-1", "block-2"],
        status: "active",
        createdByUserId: "user-1",
        createdAtISO: new Date().toISOString(),
        updatedAtISO: new Date().toISOString(),
      };
    },
    async listSnapshotsByAccountId() {
      return [];
    },
    async listSnapshotsByWorkspaceId() {
      return [];
    },
  };
}

function createBlockRepoStub(): ContentBlockRepository {
  return {
    async save() {
      return;
    },
    async findById() {
      return null;
    },
    async listByPageId() {
      return [
        ContentBlock.create("block-1", {
          pageId: "page-1",
          accountId: "account-1",
          content: plainTextBlockContent("First paragraph"),
          order: 0,
        }),
        ContentBlock.create("block-2", {
          pageId: "page-1",
          accountId: "account-1",
          content: plainTextBlockContent("Second paragraph"),
          order: 1,
        }),
      ];
    },
    async delete() {
      return;
    },
    async countByPageId() {
      return 2;
    },
  };
}

class SummaryPortStub implements KnowledgeSummaryPort {
  public lastPrompt = "";

  async summarizePage(input: { title: string; plainText: string }): Promise<KnowledgeSummaryResult> {
    this.lastPrompt = `${input.title}\n${input.plainText}`;
    return {
      summary: "Condensed overview",
      model: "stub-model",
    };
  }
}

describe("GenerateKnowledgePageSummaryQuery", () => {
  it("builds a summary from page and block content through the AI port", async () => {
    const summaryPort = new SummaryPortStub();
    const query = new GenerateKnowledgePageSummaryQuery(
      createPageRepoStub(),
      createBlockRepoStub(),
      summaryPort,
    );

    const result = await query.execute("account-1", "page-1");

    expect(result).not.toBeNull();
    expect(result?.summary).toBe("Condensed overview");
    expect(result?.blockCount).toBe(2);
    expect(summaryPort.lastPrompt).toContain("Project Guide");
    expect(summaryPort.lastPrompt).toContain("First paragraph");
    expect(summaryPort.lastPrompt).toContain("Second paragraph");
  });

  it("returns null when the page does not exist", async () => {
    const summaryPort = new SummaryPortStub();
    const pageRepo = createPageRepoStub();
    pageRepo.findSnapshotById = async () => null;

    const query = new GenerateKnowledgePageSummaryQuery(
      pageRepo,
      createBlockRepoStub(),
      summaryPort,
    );

    const result = await query.execute("account-1", "missing-page");

    expect(result).toBeNull();
  });
});
