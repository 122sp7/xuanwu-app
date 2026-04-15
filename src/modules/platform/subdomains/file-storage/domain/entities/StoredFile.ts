export interface StoredFile {
  readonly fileId: string;
  readonly ownerId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly url: string;
  readonly createdAtISO: string;
  readonly deletedAtISO: string | null;
}
