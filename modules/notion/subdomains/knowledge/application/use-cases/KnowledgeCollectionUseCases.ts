import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import { KnowledgeCollection } from "../../domain/aggregates/KnowledgeCollection";
import type { KnowledgeCollectionSnapshot, CollectionColumn } from "../../domain/aggregates/KnowledgeCollection";
import type { IKnowledgeCollectionRepository } from "../../domain/repositories/IKnowledgeCollectionRepository";
import {
  CreateKnowledgeCollectionSchema, type CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionSchema, type RenameKnowledgeCollectionDto,
  AddPageToCollectionSchema, type AddPageToCollectionDto,
  RemovePageFromCollectionSchema, type RemovePageFromCollectionDto,
  AddCollectionColumnSchema, type AddCollectionColumnDto,
  ArchiveKnowledgeCollectionSchema, type ArchiveKnowledgeCollectionDto,
} from "../dto/KnowledgeCollectionDto";

export class CreateKnowledgeCollectionUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(input: CreateKnowledgeCollectionDto): Promise<CommandResult> {
    const parsed = CreateKnowledgeCollectionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    const { accountId, workspaceId, name, description, columns, createdByUserId } = parsed.data;
    const columnIds = (columns ?? []).map(() => generateId());
    const id = generateId();
    const collection = KnowledgeCollection.create(id, columnIds, {
      accountId, workspaceId, name: name.trim(), description,
      columns: columns?.map(c => ({ name: c.name, type: c.type as CollectionColumn["type"], options: c.options })),
      createdByUserId,
    });
    await this.repo.save(collection);
    return commandSuccess(collection.id, Date.now());
  }
}

export class RenameKnowledgeCollectionUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(input: RenameKnowledgeCollectionDto): Promise<CommandResult> {
    const parsed = RenameKnowledgeCollectionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    const { accountId, collectionId, name } = parsed.data;
    const collection = await this.repo.findById(accountId, collectionId);
    if (!collection) return commandFailureFrom("COLLECTION_NOT_FOUND", "Collection not found.");
    collection.rename(name.trim());
    await this.repo.save(collection);
    return commandSuccess(collection.id, Date.now());
  }
}

export class AddPageToCollectionUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(input: AddPageToCollectionDto): Promise<CommandResult> {
    const parsed = AddPageToCollectionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    const { accountId, collectionId, pageId } = parsed.data;
    const collection = await this.repo.findById(accountId, collectionId);
    if (!collection) return commandFailureFrom("COLLECTION_NOT_FOUND", "Collection not found.");
    collection.addPage(pageId);
    await this.repo.save(collection);
    return commandSuccess(collection.id, Date.now());
  }
}

export class RemovePageFromCollectionUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(input: RemovePageFromCollectionDto): Promise<CommandResult> {
    const parsed = RemovePageFromCollectionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    const { accountId, collectionId, pageId } = parsed.data;
    const collection = await this.repo.findById(accountId, collectionId);
    if (!collection) return commandFailureFrom("COLLECTION_NOT_FOUND", "Collection not found.");
    collection.removePage(pageId);
    await this.repo.save(collection);
    return commandSuccess(collection.id, Date.now());
  }
}

export class AddCollectionColumnUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(input: AddCollectionColumnDto): Promise<CommandResult> {
    const parsed = AddCollectionColumnSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    const { accountId, collectionId, column } = parsed.data;
    const collection = await this.repo.findById(accountId, collectionId);
    if (!collection) return commandFailureFrom("COLLECTION_NOT_FOUND", "Collection not found.");
    collection.addColumn({ id: generateId(), name: column.name, type: column.type as CollectionColumn["type"], options: column.options });
    await this.repo.save(collection);
    return commandSuccess(collection.id, Date.now());
  }
}

export class ArchiveKnowledgeCollectionUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(input: ArchiveKnowledgeCollectionDto): Promise<CommandResult> {
    const parsed = ArchiveKnowledgeCollectionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COLLECTION_INVALID_INPUT", parsed.error.message);
    const { accountId, collectionId } = parsed.data;
    const collection = await this.repo.findById(accountId, collectionId);
    if (!collection) return commandFailureFrom("COLLECTION_NOT_FOUND", "Collection not found.");
    collection.archive();
    await this.repo.save(collection);
    return commandSuccess(collection.id, Date.now());
  }
}

export class GetKnowledgeCollectionUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(accountId: string, collectionId: string): Promise<KnowledgeCollectionSnapshot | null> {
    const c = await this.repo.findById(accountId, collectionId);
    return c ? c.getSnapshot() : null;
  }
}

export class ListKnowledgeCollectionsUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(accountId: string): Promise<KnowledgeCollectionSnapshot[]> {
    const cs = await this.repo.listByAccountId(accountId);
    return cs.map(c => c.getSnapshot());
  }
}

export class ListKnowledgeCollectionsByWorkspaceUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(accountId: string, workspaceId: string): Promise<KnowledgeCollectionSnapshot[]> {
    const cs = await this.repo.listByWorkspaceId(accountId, workspaceId);
    return cs.map(c => c.getSnapshot());
  }
}
