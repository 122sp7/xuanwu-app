export type ArticleStatus = "draft" | "published" | "archived";
export type VerificationState = "verified" | "needs_review" | "unverified";

export interface Article {
  id: string;
  accountId: string;
  workspaceId: string;
  categoryId: string | null;
  title: string;
  content: string;
  tags: string[];
  status: ArticleStatus;
  version: number;
  verificationState: VerificationState;
  ownerId: string | null;
  verifiedByUserId: string | null;
  verifiedAtISO: string | null;
  verificationExpiresAtISO: string | null;
  linkedArticleIds: string[];
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
