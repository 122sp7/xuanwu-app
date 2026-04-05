/**
 * Module: knowledge
 * Layer: domain/barrel
 */

export type {
  ContentPage,
  ContentPageStatus,
  ContentPageTreeNode,
  CreateContentPageInput,
  RenameContentPageInput,
  MoveContentPageInput,
  ReorderContentPageBlocksInput,
  ArchiveContentPageInput,
} from "./entities/content-page.entity";

export { CONTENT_PAGE_STATUSES } from "./entities/content-page.entity";

export type {
  ContentBlock,
  AddContentBlockInput,
  UpdateContentBlockInput,
  DeleteContentBlockInput,
} from "./entities/content-block.entity";

export type {
  ContentVersion,
  ContentVersionBlock,
  CreateContentVersionInput,
} from "./entities/content-version.entity";

export type { BlockContent, BlockType } from "./value-objects/block-content";
export {
  BLOCK_TYPES,
  blockContentEquals,
  emptyTextBlockContent,
} from "./value-objects/block-content";

export type {
  ContentDomainEvent,
  ContentPageCreatedEvent,
  ContentPageRenamedEvent,
  ContentPageMovedEvent,
  ContentPageArchivedEvent,
  ContentBlockAddedEvent,
  ContentBlockUpdatedEvent,
  ContentBlockDeletedEvent,
  ContentVersionPublishedEvent,
} from "./events/content.events";

export type {
  ContentPageRepository,
  ContentBlockRepository,
  ContentVersionRepository,
} from "./repositories/content.repositories";
