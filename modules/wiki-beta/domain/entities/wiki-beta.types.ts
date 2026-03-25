// RAG types moved to modules/retrieval. Re-exported for internal wiki-beta backward compatibility.
export type {
  WikiBetaCitation,
  WikiBetaRagQueryResult,
  WikiBetaParsedDocument,
  WikiBetaReindexInput,
} from "@/modules/retrieval/api";

// Content-tree types moved to modules/workspace. Re-exported for internal wiki-beta backward compatibility.
export type {
  WikiBetaAccountType,
  WikiBetaWorkspaceRef,
  WikiBetaContentItemNode,
  WikiBetaWorkspaceContentNode,
  WikiBetaAccountContentNode,
  WikiBetaAccountSeed,
} from "@/modules/workspace/api";
