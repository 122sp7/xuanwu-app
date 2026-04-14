import type { KnowledgePageSummary } from "../dto/knowledge.dto";
import type { KnowledgeSummaryPort } from "../../domain/ports/KnowledgeSummaryPort";
import type { ContentBlockRepository } from "../../domain/repositories/ContentBlockRepository";
import type { KnowledgePageRepository } from "../../domain/repositories/KnowledgePageRepository";
import { richTextToPlainText } from "../../domain/value-objects/BlockContent";

export class GenerateKnowledgePageSummaryQuery {
  constructor(
    private readonly pageRepo: KnowledgePageRepository,
    private readonly blockRepo: ContentBlockRepository,
    private readonly summaryPort: KnowledgeSummaryPort,
  ) {}

  async execute(accountId: string, pageId: string): Promise<KnowledgePageSummary | null> {
    if (!accountId.trim() || !pageId.trim()) return null;

    const page = await this.pageRepo.findSnapshotById(accountId, pageId);
    if (!page) return null;

    const blocks = await this.blockRepo.listByPageId(accountId, pageId);
    const plainText = blocks
      .map((block) => richTextToPlainText(block.content.richText).trim())
      .filter(Boolean)
      .join("\n\n");

    const resolvedTitle = page.title.trim() || "Untitled page";
    const { summary, model } = await this.summaryPort.summarizePage({
      title: resolvedTitle,
      plainText: plainText || resolvedTitle,
    });

    return {
      pageId: page.id,
      title: resolvedTitle,
      summary,
      model,
      blockCount: blocks.length,
    };
  }
}
