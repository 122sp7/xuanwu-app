export interface JobDocument {
  readonly id: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly title: string;
  readonly mimeType: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
