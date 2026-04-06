/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: BacklinkIndex use cases — update and query the backlink read model.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { BacklinkIndex } from "../../domain/entities/backlink-index.entity";
import type { IBacklinkIndexRepository } from "../../domain/repositories/IBacklinkIndexRepository";

export class UpdatePageBacklinksUseCase {
  constructor(private readonly repo: IBacklinkIndexRepository) {}

  async execute(input: {
    readonly accountId: string;
    readonly sourcePageId: string;
    readonly sourcePageTitle: string;
    readonly mentionsByTarget: ReadonlyMap<string, ReadonlyArray<{ blockId: string; lastSeenAtISO: string }>>;
  }): Promise<CommandResult> {
    const { accountId, sourcePageId, sourcePageTitle, mentionsByTarget } = input;

    if (!accountId || !sourcePageId) {
      return commandFailureFrom("BACKLINK_INVALID_INPUT", "accountId and sourcePageId are required.");
    }

    for (const [targetPageId, mentions] of mentionsByTarget) {
      await this.repo.upsertFromSource({
        accountId,
        targetPageId,
        sourcePageId,
        entries: mentions.map((m) => ({
          sourcePageTitle,
          blockId: m.blockId,
          lastSeenAtISO: m.lastSeenAtISO,
        })),
      });
    }

    const currentTargets = await this.repo.listOutboundTargets(accountId, sourcePageId);
    const newTargetSet = new Set(mentionsByTarget.keys());
    for (const oldTarget of currentTargets) {
      if (!newTargetSet.has(oldTarget)) {
        await this.repo.upsertFromSource({
          accountId,
          targetPageId: oldTarget,
          sourcePageId,
          entries: [],
        });
      }
    }

    return commandSuccess(sourcePageId, Date.now());
  }
}

export class RemovePageBacklinksUseCase {
  constructor(private readonly repo: IBacklinkIndexRepository) {}

  async execute(accountId: string, sourcePageId: string): Promise<CommandResult> {
    await this.repo.removeFromSource({ accountId, sourcePageId });
    return commandSuccess(sourcePageId, Date.now());
  }
}

export class GetPageBacklinksUseCase {
  constructor(private readonly repo: IBacklinkIndexRepository) {}

  async execute(accountId: string, targetPageId: string): Promise<BacklinkIndex | null> {
    return this.repo.findByTargetPage(accountId, targetPageId);
  }
}
