import {
  InMemoryEventStoreRepository,
  NoopEventBusRepository,
  PublishDomainEventUseCase,
} from "@/modules/event";
import { deriveSlugCandidate, isValidSlug } from "@/modules/namespace";

import type {
  CreateWikiBetaPageInput,
  MoveWikiBetaPageInput,
  RenameWikiBetaPageInput,
  WikiBetaPage,
  WikiBetaPageTreeNode,
} from "../../domain/entities/wiki-beta-page.types";
import type { WikiBetaPageRepository } from "../../domain/repositories/wiki-beta.repositories";
import { InMemoryWikiBetaPageRepository } from "../../infrastructure";

const defaultPageRepository: WikiBetaPageRepository = new InMemoryWikiBetaPageRepository();
const defaultEventPublisher = new PublishDomainEventUseCase(
  new InMemoryEventStoreRepository(),
  new NoopEventBusRepository(),
);

function generateId(): string {
  const randomUUID = globalThis.crypto?.randomUUID;
  if (typeof randomUUID === "function") {
    return randomUUID.call(globalThis.crypto);
  }
  return `wbp_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

function normalizeTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("title is required");
  }
  return trimmed.slice(0, 120);
}

function sameParent(a: WikiBetaPage, parentPageId: string | null): boolean {
  return (a.parentPageId ?? null) === parentPageId;
}

function ensureUniqueSlug(baseSlug: string, siblingPages: WikiBetaPage[]): string {
  const normalizedBase = isValidSlug(baseSlug) ? baseSlug : "page-node";
  const existing = new Set(siblingPages.map((page) => page.slug));

  if (!existing.has(normalizedBase)) {
    return normalizedBase;
  }

  let index = 2;
  while (index < 5000) {
    const candidate = `${normalizedBase}-${index}`;
    if (!existing.has(candidate) && isValidSlug(candidate)) {
      return candidate;
    }
    index += 1;
  }

  throw new Error("cannot allocate a unique slug for this page title");
}

function toTree(pages: WikiBetaPage[]): WikiBetaPageTreeNode[] {
  const nodeById = new Map<string, WikiBetaPageTreeNode>();
  for (const page of pages) {
    nodeById.set(page.id, { ...page, children: [] });
  }

  const roots: WikiBetaPageTreeNode[] = [];
  for (const page of pages) {
    const node = nodeById.get(page.id);
    if (!node) continue;

    if (!page.parentPageId) {
      roots.push(node);
      continue;
    }

    const parent = nodeById.get(page.parentPageId);
    if (!parent) {
      roots.push(node);
      continue;
    }
    parent.children.push(node);
  }

  const sortRecursively = (nodes: WikiBetaPageTreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.title.localeCompare(b.title, "zh-Hant");
    });
    for (const node of nodes) {
      sortRecursively(node.children);
    }
  };

  sortRecursively(roots);
  return roots;
}

function assertNoCycle(pages: WikiBetaPage[], pageId: string, targetParentPageId: string | null): void {
  if (!targetParentPageId) {
    return;
  }
  if (pageId === targetParentPageId) {
    throw new Error("page cannot be moved under itself");
  }

  const byId = new Map(pages.map((page) => [page.id, page]));
  let current: string | null = targetParentPageId;
  while (current) {
    if (current === pageId) {
      throw new Error("invalid move: target parent is a descendant of page");
    }
    current = byId.get(current)?.parentPageId ?? null;
  }
}

export async function listWikiBetaPagesTree(
  accountId: string,
  workspaceId?: string,
  pageRepository: WikiBetaPageRepository = defaultPageRepository,
): Promise<WikiBetaPageTreeNode[]> {
  if (!accountId) {
    throw new Error("accountId is required");
  }

  const allPages = await pageRepository.listByAccountId(accountId);
  const pages = workspaceId ? allPages.filter((page) => page.workspaceId === workspaceId) : allPages;
  return toTree(pages.filter((page) => page.status === "active"));
}

export async function createWikiBetaPage(
  input: CreateWikiBetaPageInput,
  pageRepository: WikiBetaPageRepository = defaultPageRepository,
): Promise<WikiBetaPage> {
  if (!input.accountId) {
    throw new Error("accountId is required");
  }

  const title = normalizeTitle(input.title);
  const pages = await pageRepository.listByAccountId(input.accountId);
  const parentPageId = input.parentPageId ?? null;

  if (parentPageId) {
    const parent = pages.find((page) => page.id === parentPageId);
    if (!parent) {
      throw new Error("parent page not found");
    }
  }

  const siblingPages = pages.filter((page) => sameParent(page, parentPageId));
  const rawSlug = deriveSlugCandidate(title);
  const slug = ensureUniqueSlug(rawSlug, siblingPages);
  const order = siblingPages.reduce((max, page) => Math.max(max, page.order), -1) + 1;

  const now = new Date();
  const created: WikiBetaPage = {
    id: generateId(),
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    title,
    slug,
    parentPageId,
    order,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  await pageRepository.create(created);

  await defaultEventPublisher.execute({
    id: generateId(),
    eventName: "wiki_beta.page.created",
    aggregateType: "wiki-page",
    aggregateId: created.id,
    payload: {
      accountId: created.accountId,
      workspaceId: created.workspaceId,
      parentPageId: created.parentPageId,
      slug: created.slug,
    },
  });

  return created;
}

export async function renameWikiBetaPage(
  input: RenameWikiBetaPageInput,
  pageRepository: WikiBetaPageRepository = defaultPageRepository,
): Promise<WikiBetaPage> {
  const title = normalizeTitle(input.title);
  const existing = await pageRepository.findById(input.accountId, input.pageId);
  if (!existing) {
    throw new Error("page not found");
  }

  const pages = await pageRepository.listByAccountId(input.accountId);
  const siblingPages = pages.filter((page) => page.id !== existing.id && sameParent(page, existing.parentPageId));
  const slug = ensureUniqueSlug(deriveSlugCandidate(title), siblingPages);

  const updated: WikiBetaPage = {
    ...existing,
    title,
    slug,
    updatedAt: new Date(),
  };

  await pageRepository.update(updated);

  await defaultEventPublisher.execute({
    id: generateId(),
    eventName: "wiki_beta.page.renamed",
    aggregateType: "wiki-page",
    aggregateId: updated.id,
    payload: {
      accountId: updated.accountId,
      title: updated.title,
      slug: updated.slug,
    },
  });

  return updated;
}

export async function moveWikiBetaPage(
  input: MoveWikiBetaPageInput,
  pageRepository: WikiBetaPageRepository = defaultPageRepository,
): Promise<WikiBetaPage> {
  const existing = await pageRepository.findById(input.accountId, input.pageId);
  if (!existing) {
    throw new Error("page not found");
  }

  const pages = await pageRepository.listByAccountId(input.accountId);
  const targetParentPageId = input.targetParentPageId ?? null;
  assertNoCycle(pages, existing.id, targetParentPageId);

  if (targetParentPageId) {
    const targetParent = pages.find((page) => page.id === targetParentPageId);
    if (!targetParent) {
      throw new Error("target parent page not found");
    }
  }

  const siblingPages = pages.filter((page) => page.id !== existing.id && sameParent(page, targetParentPageId));
  const order = siblingPages.reduce((max, page) => Math.max(max, page.order), -1) + 1;

  const moved: WikiBetaPage = {
    ...existing,
    parentPageId: targetParentPageId,
    order,
    updatedAt: new Date(),
  };

  await pageRepository.update(moved);

  await defaultEventPublisher.execute({
    id: generateId(),
    eventName: "wiki_beta.page.moved",
    aggregateType: "wiki-page",
    aggregateId: moved.id,
    payload: {
      accountId: moved.accountId,
      fromParentPageId: existing.parentPageId,
      toParentPageId: moved.parentPageId,
    },
  });

  return moved;
}