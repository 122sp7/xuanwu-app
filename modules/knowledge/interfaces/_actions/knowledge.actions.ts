/**
 * Module: knowledge
 * Layer: interfaces/_actions
 * Purpose: Re-export barrel for all knowledge Server Actions.
 *          Implementations are split by subdomain for IDDD layer-purity.
 *          Each sub-file carries its own "use server" directive; this barrel
 *          must NOT repeat it — Turbopack cannot resolve re-exports from a
 *          "use server" barrel that itself re-exports other "use server" files.
 */

export {
  createKnowledgePage,
  renameKnowledgePage,
  moveKnowledgePage,
  archiveKnowledgePage,
  reorderKnowledgePageBlocks,
  publishKnowledgeVersion,
  approveKnowledgePage,
  verifyKnowledgePage,
  requestKnowledgePageReview,
  assignKnowledgePageOwner,
  updateKnowledgePageIcon,
  updateKnowledgePageCover,
} from "./knowledge-page.actions";

export {
  addKnowledgeBlock,
  updateKnowledgeBlock,
  deleteKnowledgeBlock,
} from "./knowledge-block.actions";

export {
  createKnowledgeCollection,
  renameKnowledgeCollection,
  addPageToCollection,
  removePageFromCollection,
  addCollectionColumn,
  archiveKnowledgeCollection,
} from "./knowledge-collection.actions";
