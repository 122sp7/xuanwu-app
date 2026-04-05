import type { File } from "../entities/File";

interface CompleteUploadFileInput {
  readonly file: File;
  readonly completedAtISO: string;
}

export function completeUploadFile(input: CompleteUploadFileInput): File {
  return {
    ...input.file,
    status: "active",
    updatedAtISO: input.completedAtISO,
    source: "file-upload-complete",
    detail: "File upload completed; status set to active and metadata timestamp finalized.",
  };
}
