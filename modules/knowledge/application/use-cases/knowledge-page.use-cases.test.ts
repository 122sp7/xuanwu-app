import { describe, expect, it, vi } from "vitest";

import type { KnowledgePage } from "../../domain/entities/knowledge-page.entity";
import type { KnowledgePageRepository } from "../../domain/repositories/knowledge.repositories";
import {
  CreateKnowledgePageUseCase,
  GetKnowledgePageTreeByWorkspaceUseCase,
  ListKnowledgePagesByWorkspaceUseCase,
} from "./knowledge-page.use-cases";

function createPage(overrides: Partial<KnowledgePage>): KnowledgePage {
  return {
    id: overrides.id ?? "page-1",
    accountId: overrides.accountId ?? "account-1",
    workspaceId: overrides.workspaceId ?? "workspace-1",
    title: overrides.title ?? "Page",
    slug: overrides.slug ?? "page",
    parentPageId: overrides.parentPageId ?? null,
    order: overrides.order ?? 0,
    blockIds: overrides.blockIds ?? [],
    status: overrides.status ?? "active",
    createdByUserId: overrides.createdByUserId ?? "user-1",
    createdAtISO: overrides.createdAtISO ?? "2026-04-08T00:00:00.000Z",
    updatedAtISO: overrides.updatedAtISO ?? "2026-04-08T00:00:00.000Z",
    approvalState: overrides.approvalState,
    approvedByUserId: overrides.approvedByUserId,
    approvedAtISO: overrides.approvedAtISO,
    verificationState: overrides.verificationState,
    ownerId: overrides.ownerId,
    verifiedByUserId: overrides.verifiedByUserId,
    verifiedAtISO: overrides.verifiedAtISO,
    verificationExpiresAtISO: overrides.verificationExpiresAtISO,
    iconUrl: overrides.iconUrl,
    coverUrl: overrides.coverUrl,
  };
}

function createRepoMock(): KnowledgePageRepository {
  return {
    create: vi.fn(),
    rename: vi.fn(),
    move: vi.fn(),
    reorderBlocks: vi.fn(),
    archive: vi.fn(),
    approve: vi.fn(),
    verify: vi.fn(),
    requestReview: vi.fn(),
    assignOwner: vi.fn(),
    updateIcon: vi.fn(),
    updateCover: vi.fn(),
    findById: vi.fn(),
    listByAccountId: vi.fn(),
    listByWorkspaceId: vi.fn(),
  };
}

describe("knowledge-page.use-cases", () => {
  it("rejects page creation without a workspace scope", async () => {
    const repo = createRepoMock();

    const result = await new CreateKnowledgePageUseCase(repo).execute({
      accountId: "account-1",
      title: "Workspace required",
      parentPageId: null,
      createdByUserId: "user-1",
    } as never);

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("CONTENT_PAGE_INVALID_INPUT");
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("lists pages by workspace through the workspace repository contract", async () => {
    const repo = createRepoMock();
    const pages = [createPage({ id: "page-1", title: "Workspace page" })];
    vi.mocked(repo.listByWorkspaceId).mockResolvedValue(pages);

    const result = await new ListKnowledgePagesByWorkspaceUseCase(repo).execute("account-1", "workspace-1");

    expect(repo.listByWorkspaceId).toHaveBeenCalledWith("account-1", "workspace-1");
    expect(result).toEqual(pages);
  });

  it("builds a workspace-scoped tree from workspace pages only", async () => {
    const repo = createRepoMock();
    vi.mocked(repo.listByWorkspaceId).mockResolvedValue([
      createPage({ id: "root", title: "Root", slug: "root", order: 2 }),
      createPage({ id: "child", title: "Child", slug: "child", parentPageId: "root", order: 1 }),
      createPage({ id: "earlier-root", title: "Earlier Root", slug: "earlier-root", order: 1 }),
    ]);

    const result = await new GetKnowledgePageTreeByWorkspaceUseCase(repo).execute("account-1", "workspace-1");

    expect(repo.listByWorkspaceId).toHaveBeenCalledWith("account-1", "workspace-1");
    expect(result.map((node) => node.id)).toEqual(["earlier-root", "root"]);
    expect(result[1]?.children.map((node) => node.id)).toEqual(["child"]);
  });
});