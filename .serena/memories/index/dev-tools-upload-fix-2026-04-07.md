## Dev-tools Upload Contract Fix
## Date: 2026-04-07

### Problem
Two bugs in `app/(shell)/dev-tools` broke the upload → Document AI pipeline:
1. `ACCEPTED_MIME` in `dev-tools-helpers.ts` had keys as MIME types and values as extensions (reversed).
   `page.tsx` queries by extension key → always got undefined → `contentType` fell back to `application/octet-stream`.
2. `storageApi.uploadBytes` had no `customMetadata`, so py_fn `handle_object_finalized` could not extract
   `workspace_id` from `data.metadata` → early-exit with `logger.error("missing workspace_id")`.

### Fix
- `dev-tools-helpers.ts`: Flipped `ACCEPTED_MIME` to `{ pdf: "application/pdf", tif: "image/tiff", ... }`.
  Changed `ACCEPTED_EXTS` from `Object.values(ACCEPTED_MIME).join(", ")` to a static display string.
- `page.tsx`: Added `activeWorkspaceId = appState.activeWorkspaceId ?? ""` extraction.
  Added `customMetadata: { account_id: activeAccountId, workspace_id: activeWorkspaceId, filename: selectedFile.name }` to `uploadBytes`.

### py_fn Contract (unchanged — correct)
- `handle_object_finalized`: extracts `account_id` from path convention `uploads/{accountId}/...`, `workspace_id` from `data.metadata`.
- `parse_document` / `rag_reindex_document` callables: both read from `req.data` directly (unaffected).

### Validation
- npm run lint: exit 0, 0 errors