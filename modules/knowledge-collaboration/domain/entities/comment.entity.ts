export interface Comment {
  id: string;
  contentId: string;
  contentType: "page" | "article";
  workspaceId: string;
  accountId: string;
  authorId: string;
  body: string;
  parentCommentId: string | null;
  resolvedAt: string | null;
  resolvedByUserId: string | null;
  createdAtISO: string;
  updatedAtISO: string;
}
