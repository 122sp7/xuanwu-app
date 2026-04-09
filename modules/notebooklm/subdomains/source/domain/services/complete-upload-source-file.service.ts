/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/services
 * Service: completeUploadSourceFile — transitions a file to active after upload.
 *
 * Pure domain function: no I/O, no side effects.
 */

import type { SourceFile } from "../entities/SourceFile";

export interface CompleteUploadSourceFileInput {
  readonly file: SourceFile;
  readonly completedAtISO: string;
}

export function completeUploadSourceFile(input: CompleteUploadSourceFileInput): SourceFile {
  return {
    ...input.file,
    status: "active",
    updatedAtISO: input.completedAtISO,
    source: "file-upload-complete",
    detail: "File upload completed; status set to active and metadata timestamp finalized.",
  };
}
