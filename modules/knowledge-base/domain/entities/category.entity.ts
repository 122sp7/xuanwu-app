export interface Category {
  id: string;
  accountId: string;
  workspaceId: string;
  name: string;
  slug: string;
  parentCategoryId: string | null;
  depth: number;
  articleIds: string[];
  description: string | null;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
