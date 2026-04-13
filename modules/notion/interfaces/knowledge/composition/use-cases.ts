import {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  ReorderKnowledgePageBlocksUseCase,
  VerifyKnowledgePageUseCase,
  ApproveKnowledgePageUseCase,
  RequestPageReviewUseCase,
  AssignPageOwnerUseCase,
  UpdatePageIconUseCase,
  UpdatePageCoverUseCase,
  CreateKnowledgeCollectionUseCase,
  RenameKnowledgeCollectionUseCase,
  AddPageToCollectionUseCase,
  RemovePageFromCollectionUseCase,
  ArchiveKnowledgeCollectionUseCase,
} from "../../../subdomains/knowledge/application/use-cases";
import type { KnowledgePageRepository } from "../../../subdomains/knowledge/domain/repositories/KnowledgePageRepository";
import type { KnowledgeCollectionRepository } from "../../../subdomains/knowledge/domain/repositories/KnowledgeCollectionRepository";
import type { IEventStoreRepository, IEventBusRepository } from "@shared-events";
import { makePageRepo, makeCollectionRepo } from "./repositories";

/** Stub event store — persists nothing. Replace with a real impl once infrastructure is wired. */
function makeEventStore(): IEventStoreRepository {
  return {
    save: async () => {},
    findById: async () => null,
    findByAggregate: async () => [],
    findUndispatched: async () => [],
    markDispatched: async () => {},
  };
}

/** Stub event bus — publishes nothing. Replace with QStash/Firestore publish once infrastructure is wired. */
function makeEventBus(): IEventBusRepository {
  return {
    publish: async () => {},
  };
}

export interface KnowledgeUseCases {
  readonly createKnowledgePage: CreateKnowledgePageUseCase;
  readonly renameKnowledgePage: RenameKnowledgePageUseCase;
  readonly moveKnowledgePage: MoveKnowledgePageUseCase;
  readonly archiveKnowledgePage: ArchiveKnowledgePageUseCase;
  readonly reorderKnowledgePageBlocks: ReorderKnowledgePageBlocksUseCase;
  readonly verifyKnowledgePage: VerifyKnowledgePageUseCase;
  readonly approveKnowledgePage: ApproveKnowledgePageUseCase;
  readonly requestPageReview: RequestPageReviewUseCase;
  readonly assignPageOwner: AssignPageOwnerUseCase;
  readonly updatePageIcon: UpdatePageIconUseCase;
  readonly updatePageCover: UpdatePageCoverUseCase;
  readonly createKnowledgeCollection: CreateKnowledgeCollectionUseCase;
  readonly renameKnowledgeCollection: RenameKnowledgeCollectionUseCase;
  readonly addPageToCollection: AddPageToCollectionUseCase;
  readonly removePageFromCollection: RemovePageFromCollectionUseCase;
  readonly archiveKnowledgeCollection: ArchiveKnowledgeCollectionUseCase;
}

export function makeKnowledgeUseCases(
  pageRepo: KnowledgePageRepository = makePageRepo(),
  collectionRepo: KnowledgeCollectionRepository = makeCollectionRepo(),
  eventStore: IEventStoreRepository = makeEventStore(),
  eventBus: IEventBusRepository = makeEventBus(),
): KnowledgeUseCases {
  return {
    createKnowledgePage: new CreateKnowledgePageUseCase(pageRepo),
    renameKnowledgePage: new RenameKnowledgePageUseCase(pageRepo),
    moveKnowledgePage: new MoveKnowledgePageUseCase(pageRepo),
    archiveKnowledgePage: new ArchiveKnowledgePageUseCase(pageRepo),
    reorderKnowledgePageBlocks: new ReorderKnowledgePageBlocksUseCase(pageRepo),
    verifyKnowledgePage: new VerifyKnowledgePageUseCase(pageRepo),
    approveKnowledgePage: new ApproveKnowledgePageUseCase(pageRepo, eventStore, eventBus),
    requestPageReview: new RequestPageReviewUseCase(pageRepo),
    assignPageOwner: new AssignPageOwnerUseCase(pageRepo),
    updatePageIcon: new UpdatePageIconUseCase(pageRepo),
    updatePageCover: new UpdatePageCoverUseCase(pageRepo),
    createKnowledgeCollection: new CreateKnowledgeCollectionUseCase(collectionRepo),
    renameKnowledgeCollection: new RenameKnowledgeCollectionUseCase(collectionRepo),
    addPageToCollection: new AddPageToCollectionUseCase(collectionRepo),
    removePageFromCollection: new RemovePageFromCollectionUseCase(collectionRepo),
    archiveKnowledgeCollection: new ArchiveKnowledgeCollectionUseCase(collectionRepo),
  };
}
