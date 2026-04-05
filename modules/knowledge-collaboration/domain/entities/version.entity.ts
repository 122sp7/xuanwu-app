export interface Version {
  id: string;
  contentId: string;
  contentType: "page" | "article";
  workspaceId: string;
  accountId: string;
  snapshotBlocks: unknown[];
  label: string | null;
  description: string | null;
  createdByUserId: string;
  createdAtISO: string;
}
