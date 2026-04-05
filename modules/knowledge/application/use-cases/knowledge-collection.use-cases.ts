/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: KnowledgeCollection use cases — create, rename, add/remove page, add column, archive, list.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { KnowledgeCollection } from "../../domain/entities/knowledge-collection.entity";
import type { KnowledgeCollectionRepository } from "../../domain/repositories/knowledge.repositories";
import {
  CreateKnowledgeCollectionSchema,
  type CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionSchema,
  type RenameKnowledgeCollectionDto,
  AddPageToCollectionSchema,
  type AddPageToCollectionDto,
  RemovePageFromCollectionSchema,
  type RemovePageFromCollectionDto,
  AddCollectionColumnSchema,
  type AddCollectionColumnDto,
  ArchiveKnowledgeCollectionSchema,
  type ArchiveKnowledgeCollectionDto,
} from "../dto/knowledge.dto";

export class CreateKnowledgeCollectionUseCase {
  constructor(private readonly repo: KnowledgeCollectionRepository) {}

  async execute(input: CreateKnowledgeCollectionDto): Promise<CommandResult> {
    const parsed = CreateKnowledgeCollectionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, workspaceId, name, description, columns, createdByUserId } = parsed.data;

    const collection = await this.repo.create({
      accountId,
      workspaceId,
      name: name.trim(),
      description,
      columns: columns?.map((c) => ({ name: c.name, type: c.type, options: c.options })),
      createdByUserId,
    });

    return commandSuccess(collection.id, Date.now());
  }
}

export class RenameKnowledgeCollectionUseCase {
  constructor(private readonly repo: KnowledgeCollectionRepository) {}

  async execute(input: RenameKnowledgeCollectionDto): Promise<CommandResult> {
    const parsed = RenameKnowledgeCollectionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, collectionId, name } = parsed.data;
    const result = await this.repo.rename({ accountId, collectionId, name: name.trim() });

    if (!result) {
      return commandFailureFrom("COLLECTION_NOT_FOUND", `Collection ${collectionId} not found`);
    }

    return commandSuccess(result.id, Date.now());
  }
}

export class AddPageToCollectionUseCase {
  constructor(private readonly repo: KnowledgeCollectionRepository) {}

  async execute(input: AddPageToCollectionDto): Promise<CommandResult> {
    const parsed = AddPageToCollectionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, collectionId, pageId } = parsed.data;
    const result = await this.repo.addPage({ accountId, collectionId, pageId });

    if (!result) {
      return commandFailureFrom("COLLECTION_NOT_FOUND", `Collection ${collectionId} not found`);
    }

    return commandSuccess(result.id, Date.now());
  }
}

export class RemovePageFromCollectionUseCase {
  constructor(private readonly repo: KnowledgeCollectionRepository) {}

  async execute(input: RemovePageFromCollectionDto): Promise<CommandResult> {
    const parsed = RemovePageFromCollectionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, collectionId, pageId } = parsed.data;
    const result = await this.repo.removePage({ accountId, collectionId, pageId });

    if (!result) {
      return commandFailureFrom("COLLECTION_NOT_FOUND", `Collection ${collectionId} not found`);
    }

    return commandSuccess(result.id, Date.now());
  }
}

export class AddCollectionColumnUseCase {
  constructor(private readonly repo: KnowledgeCollectionRepository) {}

  async execute(input: AddCollectionColumnDto): Promise<CommandResult> {
    const parsed = AddCollectionColumnSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, collectionId, column } = parsed.data;
    const result = await this.repo.addColumn({
      accountId,
      collectionId,
      column,
    });

    if (!result) {
      return commandFailureFrom("COLLECTION_NOT_FOUND", `Collection ${collectionId} not found`);
    }

    return commandSuccess(result.id, Date.now());
  }
}

export class ArchiveKnowledgeCollectionUseCase {
  constructor(private readonly repo: KnowledgeCollectionRepository) {}

  async execute(input: ArchiveKnowledgeCollectionDto): Promise<CommandResult> {
    const parsed = ArchiveKnowledgeCollectionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, collectionId } = parsed.data;
    const result = await this.repo.archive({ accountId, collectionId });

    if (!result) {
      return commandFailureFrom("COLLECTION_NOT_FOUND", `Collection ${collectionId} not found`);
    }

    return commandSuccess(result.id, Date.now());
  }
}

export class GetKnowledgeCollectionUseCase {
  constructor(private readonly repo: KnowledgeCollectionRepository) {}

  async execute(accountId: string, collectionId: string): Promise<KnowledgeCollection | null> {
    return this.repo.findById(accountId, collectionId);
  }
}

export class ListKnowledgeCollectionsByAccountUseCase {
  constructor(private readonly repo: KnowledgeCollectionRepository) {}

  async execute(accountId: string): Promise<KnowledgeCollection[]> {
    return this.repo.listByAccountId(accountId);
  }
}

export class ListKnowledgeCollectionsByWorkspaceUseCase {
  constructor(private readonly repo: KnowledgeCollectionRepository) {}

  async execute(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]> {
    return this.repo.listByWorkspaceId(accountId, workspaceId);
  }
}
