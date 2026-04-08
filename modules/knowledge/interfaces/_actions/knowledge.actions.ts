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
} from "./knowledge-page-lifecycle.actions";

export {
  approveKnowledgePage,
  verifyKnowledgePage,
  requestKnowledgePageReview,
  assignKnowledgePageOwner,
} from "./knowledge-page-review.actions";

export {
  updateKnowledgePageIcon,
  updateKnowledgePageCover,
} from "./knowledge-page-appearance.actions";

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
