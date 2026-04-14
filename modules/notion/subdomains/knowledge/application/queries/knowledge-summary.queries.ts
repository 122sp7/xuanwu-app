import type { ContentBlock } from "../../domain/aggregates/ContentBlock";
import type { KnowledgeDistillationPort } from "../../domain/ports/KnowledgeDistillationPort";
import type { KnowledgeSummaryPort } from "../../domain/ports/KnowledgeSummaryPort";
import type { ContentBlockRepository } from "../../domain/repositories/ContentBlockRepository";
import type { KnowledgePageRepository } from "../../domain/repositories/KnowledgePageRepository";
import { richTextToPlainText } from "../../domain/value-objects/BlockContent";
import type { KnowledgePageDistillation, KnowledgePageSummary } from "../dto/knowledge.dto";

function buildPagePlainText(blocks: readonly ContentBlock[], resolvedTitle: string): string {
  const plainText = blocks
    .map((block) => richTextToPlainText(block.content.richText).trim())
    .filter(Boolean)
    .join("\n\n");

  return plainText || resolvedTitle;
}

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
    const resolvedTitle = page.title.trim() || "Untitled page";
    const { summary, model } = await this.summaryPort.summarizePage({
      title: resolvedTitle,
      plainText: buildPagePlainText(blocks, resolvedTitle),
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

export class GenerateKnowledgePageDistillationQuery {
  constructor(
    private readonly pageRepo: KnowledgePageRepository,
    private readonly blockRepo: ContentBlockRepository,
    private readonly distillationPort: KnowledgeDistillationPort,
  ) {}

  async execute(accountId: string, pageId: string): Promise<KnowledgePageDistillation | null> {
    if (!accountId.trim() || !pageId.trim()) return null;

    const page = await this.pageRepo.findSnapshotById(accountId, pageId);
    if (!page) return null;

    const blocks = await this.blockRepo.listByPageId(accountId, pageId);
    const resolvedTitle = page.title.trim() || "Untitled page";
    const { overview, highlights, model, traceId, completedAt } = await this.distillationPort.distillPage({
      title: resolvedTitle,
      plainText: buildPagePlainText(blocks, resolvedTitle),
    });

    return {
      pageId: page.id,
      title: resolvedTitle,
      overview,
      highlights,
      model,
      traceId,
      completedAt,
      blockCount: blocks.length,
    };
  }
}
