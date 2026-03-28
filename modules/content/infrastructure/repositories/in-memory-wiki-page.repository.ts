import type { WikiPageRepository } from "../../domain/repositories/WikiPageRepository";
import type { WikiPage } from "../../domain/entities/wiki-page.types";

function sortPages(pages: WikiPage[]): WikiPage[] {
  return [...pages].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.title.localeCompare(b.title, "zh-Hant");
  });
}

export class InMemoryWikiPageRepository implements WikiPageRepository {
  private readonly accountPages = new Map<string, Map<string, WikiPage>>();

  async listByAccountId(accountId: string): Promise<WikiPage[]> {
    const pages = this.accountPages.get(accountId);
    if (!pages) {
      return [];
    }
    return sortPages(Array.from(pages.values()));
  }

  async findById(accountId: string, pageId: string): Promise<WikiPage | null> {
    const pages = this.accountPages.get(accountId);
    if (!pages) {
      return null;
    }
    return pages.get(pageId) ?? null;
  }

  async create(page: WikiPage): Promise<void> {
    const pages = this.getOrCreateAccountMap(page.accountId);
    if (pages.has(page.id)) {
      throw new Error(`WikiPage with id ${page.id} already exists`);
    }
    pages.set(page.id, page);
  }

  async update(page: WikiPage): Promise<void> {
    const pages = this.getOrCreateAccountMap(page.accountId);
    if (!pages.has(page.id)) {
      throw new Error(`WikiPage with id ${page.id} not found`);
    }
    pages.set(page.id, page);
  }

  private getOrCreateAccountMap(accountId: string): Map<string, WikiPage> {
    const existing = this.accountPages.get(accountId);
    if (existing) {
      return existing;
    }

    const created = new Map<string, WikiPage>();
    this.accountPages.set(accountId, created);
    return created;
  }
}
