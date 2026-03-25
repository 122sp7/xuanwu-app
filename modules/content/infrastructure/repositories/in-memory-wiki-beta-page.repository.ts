import type { WikiBetaPageRepository } from "../../domain/repositories/WikiBetaPageRepository";
import type { WikiBetaPage } from "../../domain/entities/wiki-beta-page.types";

function sortPages(pages: WikiBetaPage[]): WikiBetaPage[] {
  return [...pages].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.title.localeCompare(b.title, "zh-Hant");
  });
}

export class InMemoryWikiBetaPageRepository implements WikiBetaPageRepository {
  private readonly accountPages = new Map<string, Map<string, WikiBetaPage>>();

  async listByAccountId(accountId: string): Promise<WikiBetaPage[]> {
    const pages = this.accountPages.get(accountId);
    if (!pages) {
      return [];
    }
    return sortPages(Array.from(pages.values()));
  }

  async findById(accountId: string, pageId: string): Promise<WikiBetaPage | null> {
    const pages = this.accountPages.get(accountId);
    if (!pages) {
      return null;
    }
    return pages.get(pageId) ?? null;
  }

  async create(page: WikiBetaPage): Promise<void> {
    const pages = this.getOrCreateAccountMap(page.accountId);
    if (pages.has(page.id)) {
      throw new Error(`WikiBetaPage with id ${page.id} already exists`);
    }
    pages.set(page.id, page);
  }

  async update(page: WikiBetaPage): Promise<void> {
    const pages = this.getOrCreateAccountMap(page.accountId);
    if (!pages.has(page.id)) {
      throw new Error(`WikiBetaPage with id ${page.id} not found`);
    }
    pages.set(page.id, page);
  }

  private getOrCreateAccountMap(accountId: string): Map<string, WikiBetaPage> {
    const existing = this.accountPages.get(accountId);
    if (existing) {
      return existing;
    }

    const created = new Map<string, WikiBetaPage>();
    this.accountPages.set(accountId, created);
    return created;
  }
}
