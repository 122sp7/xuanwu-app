export interface DatabaseRecord {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;
  properties: Map<string, unknown>;
  order: number;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
