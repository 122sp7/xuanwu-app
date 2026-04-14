# Files

## File: modules/notebooklm/application/use-cases/index.ts
````typescript

````

## File: modules/notebooklm/domain/events/index.ts
````typescript

````

## File: modules/notebooklm/domain/events/NotebookLmDomainEvent.ts
````typescript
/**
 * Module: notebooklm
 * Layer: domain/events (context-wide)
 * Purpose: Base domain event interface for the notebooklm bounded context.
 *          All subdomain events should extend this interface.
 */
⋮----
export interface NotebookLmDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
````

## File: modules/notebooklm/domain/published-language/index.ts
````typescript
/**
 * Module: notebooklm
 * Layer: domain (context-wide published language)
 * Purpose: Reference types consumed by downstream or upstream modules.
 *
 * These types represent the notebooklm bounded context's public vocabulary.
 * Consumers receive opaque references — never raw aggregates.
 *
 * Context Map tokens:
 *   - NotebookReference: identifies a notebook container
 *   - SourceReference: identifies a source document
 *   - ConversationReference: identifies a conversation thread
 */
⋮----
/** Opaque reference to a Notebook aggregate (cross-module token) */
export interface NotebookReference {
  readonly notebookId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
}
⋮----
/** Opaque reference to a Source document (cross-module token) */
export interface SourceReference {
  readonly sourceId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly displayName: string;
  readonly mimeType: string;
}
⋮----
/** Opaque reference to a Conversation thread (cross-module token) */
export interface ConversationReference {
  readonly threadId: string;
  readonly accountId: string;
}
````

## File: modules/notebooklm/interfaces/conversation/_actions/thread.actions.ts
````typescript
import type { Thread } from "../../../subdomains/conversation/application/dto/conversation.dto";
import { makeConversationUseCases } from "../composition/use-cases";
⋮----
export async function saveThread(accountId: string, thread: Thread): Promise<void>
⋮----
export async function loadThread(accountId: string, threadId: string): Promise<Thread | null>
````

## File: modules/notebooklm/interfaces/conversation/composition/adapters.ts
````typescript
import { FirebaseThreadRepository } from "../../../infrastructure/conversation/firebase/FirebaseThreadRepository";
⋮----
export function makeThreadRepo()
````

## File: modules/notebooklm/interfaces/conversation/hooks/useAiChatThread.ts
````typescript
import { useEffect, useMemo, useRef, useState } from "react";
import { v7 as uuid } from "@lib-uuid";
⋮----
import { sendChatMessage, saveThread, loadThread } from "../_actions/chat.actions";
import {
  type ChatMessage,
  STORAGE_KEY,
  buildContextPrompt,
  generateMsgId,
  threadFromMessages,
} from "../helpers";
⋮----
export interface UseAiChatThreadParams {
  accountId: string;
  requestedWorkspaceId: string;
}
⋮----
export interface UseAiChatThreadResult {
  messages: ChatMessage[];
  input: string;
  isPending: boolean;
  error: string | null;
  threadId: string | null;
  summaryItems: string[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
  setInput: (value: string) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleNewThread: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}
⋮----
function isBlank(value: string): boolean
⋮----
export function useAiChatThread({
  accountId,
  requestedWorkspaceId,
}: UseAiChatThreadParams): UseAiChatThreadResult
⋮----
async function handleSubmit(e?: React.FormEvent): Promise<void>
⋮----
function handleNewThread(): void
⋮----
function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void
````

## File: modules/notebooklm/interfaces/notebook/_actions/generate-notebook-response.actions.ts
````typescript
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../../subdomains/notebook/application/dto/notebook.dto";
import { GenerateNotebookResponseUseCase } from "../../../subdomains/notebook/application/use-cases/generate-notebook-response.use-case";
import { makeNotebookRepo } from "../composition/adapters";
⋮----
export async function generateNotebookResponse(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult>
````

## File: modules/notebooklm/interfaces/source/_actions/source-pipeline.actions.ts
````typescript
import { makeSourcePipelineAdapter } from "../composition/adapters";
import type {
  ParseSourceDocumentInputDto,
  ParseSourceDocumentOutputDto,
  ReindexSourceDocumentInputDto,
  ReindexSourceDocumentOutputDto,
  SourcePipelineResult,
} from "../../../subdomains/source/application/dto/source-pipeline.dto";
import {
  ParseSourceDocumentUseCase,
  ReindexSourceDocumentUseCase,
} from "../../../subdomains/source/application/use-cases/source-pipeline.use-cases";
⋮----
export async function parseSourceDocument(
  input: ParseSourceDocumentInputDto,
): Promise<SourcePipelineResult<ParseSourceDocumentOutputDto>>
⋮----
export async function reindexSourceDocument(
  input: ReindexSourceDocumentInputDto,
): Promise<SourcePipelineResult<ReindexSourceDocumentOutputDto>>
````

## File: modules/notebooklm/interfaces/source/components/file-processing-dialog.parts.tsx
````typescript
import { CheckCircle2, FileText, Loader2, XCircle } from "lucide-react";
⋮----
import { cn } from "@ui-shadcn";
import { Badge } from "@ui-shadcn/ui/badge";
⋮----
import type { TaskResult } from "./file-processing-dialog.utils";
⋮----
function formatFileSize(sizeBytes: number): string | null
⋮----
export function FileProcessingPathValue(
⋮----
export function FileProcessingSourceCard({
  filename,
  mimeType,
  gcsUri,
  sizeBytes,
}: {
  readonly filename: string;
  readonly mimeType: string;
  readonly gcsUri: string;
  readonly sizeBytes: number;
})
⋮----
export function FileProcessingResultRow({
  label,
  result,
}: {
  readonly label: string;
  readonly result: TaskResult;
})
⋮----
<div className=
````

## File: modules/notebooklm/interfaces/source/components/file-processing-dialog.surface.tsx
````typescript
import type { ReactNode } from "react";
⋮----
import { useIsMobile } from "@ui-shadcn";
import { Badge } from "@ui-shadcn/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@ui-shadcn/ui/sheet";
⋮----
interface FileProcessingDialogSurfaceProps {
  readonly open: boolean;
  readonly canDismiss: boolean;
  readonly onOpenChange: (nextOpen: boolean) => void;
  readonly footer: ReactNode;
  readonly children: ReactNode;
}
````

## File: modules/notebooklm/interfaces/source/components/file-processing-dialog.utils.ts
````typescript
import {
  createIdleExecutionSummary,
  type SourceProcessingExecutionSummary,
  type SourceProcessingTaskResult,
  type SourceProcessingTaskStatus,
} from "../../../subdomains/source/application/dto/source-processing.dto";
⋮----
export type TaskStatus = SourceProcessingTaskStatus;
⋮----
export type TaskResult = SourceProcessingTaskResult;
⋮----
export type ExecutionSummary = SourceProcessingExecutionSummary;
⋮----
export function createIdleSummary(): ExecutionSummary
⋮----
export function readCallableData(value: unknown): Record<string, unknown>
⋮----
export function readString(value: unknown, fallback = ""): string
⋮----
export function readNumber(value: unknown, fallback = 0): number
````

## File: modules/notebooklm/interfaces/source/components/LibrariesPanel.tsx
````typescript
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
⋮----
import {
  addWikiLibraryField,
  createWikiLibrary,
  createWikiLibraryRow,
  getWikiLibrarySnapshot,
  listWikiLibraries,
  type WikiLibrary,
  type WikiLibraryFieldType,
  type WikiLibraryRow,
} from "../../../subdomains/source/api";
⋮----
interface LibrariesPanelProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}
⋮----
function isRecord(value: unknown): value is Record<string, unknown>
⋮----
function parseFieldType(value: string): WikiLibraryFieldType
⋮----
onChange=
⋮----
<input type="text" value=
````

## File: modules/notebooklm/interfaces/source/components/WorkspaceFilesTab.tsx
````typescript
import { useCallback, useEffect, useMemo, useState } from "react";
⋮----
import type { WorkspaceEntity } from "@/modules/workspace/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
⋮----
import type { WorkspaceFileListItemDto } from "../../../subdomains/source/application/dto/source-file.dto";
import { resolveSourceOrganizationId } from "../../../subdomains/source/application/dto/source.dto";
import { getWorkspaceFiles } from "../queries/source-file.queries";
import { uploadCompleteFile, uploadInitFile } from "../_actions/source-file.actions";
import { makeSourceStorageAdapter } from "../composition/adapters";
import { FileProcessingDialog } from "./FileProcessingDialog";
⋮----
interface WorkspaceFilesTabProps {
  readonly workspace: WorkspaceEntity;
}
⋮----
interface PendingUploadProcessing {
  readonly sourceFileId: string;
  readonly filename: string;
  readonly gcsUri: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}
⋮----
async function handleUploadFile(file: File)
⋮----
onClose=
````

## File: modules/notebooklm/interfaces/source/contracts/source-command-result.ts
````typescript
import type { SourceFileCommandErrorCode } from "../../../subdomains/source/application/dto/source-file.dto";
⋮----
export type SourceFileCommandResult<TData> =
  | {
      readonly ok: true;
      readonly data: TData;
      readonly commandId: string;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: SourceFileCommandErrorCode;
        readonly message: string;
      };
      readonly commandId: string;
    };
````

## File: modules/notebooklm/interfaces/source/hooks/useSourceDocumentsSnapshot.ts
````typescript
import { useCallback, useEffect, useRef, useState } from "react";
⋮----
import { makeSourceDocumentWatchAdapter } from "../composition/adapters";
⋮----
import type {
  SourceLiveDocument,
} from "../../../subdomains/source/application/dto/source-live-document.dto";
import {
  mapToSourceLiveDocument,
} from "../../../subdomains/source/application/dto/source-live-document.dto";
⋮----
// Re-export types for backward compatibility
⋮----
// ── Helpers ───────────────────────────────────────────────────────────────────
⋮----
function isRecord(value: unknown): value is Record<string, unknown>
⋮----
function objectOrEmpty(value: unknown): Record<string, unknown>
⋮----
// ── Hook ──────────────────────────────────────────────────────────────────────
⋮----
export interface UseSourceDocumentsSnapshotResult {
  readonly docs: SourceLiveDocument[];
  readonly loading: boolean;
  readonly pendingDocs: SourceLiveDocument[];
  readonly addPending: (doc: SourceLiveDocument) => void;
  readonly removePending: (id: string) => void;
}
⋮----
/** Subscribes to Firestore `accounts/{accountId}/documents` in real time via onSnapshot. */
export function useSourceDocumentsSnapshot(
  accountId: string,
  workspaceId?: string,
): UseSourceDocumentsSnapshotResult
````

## File: modules/notebooklm/subdomains/conversation/api/server.ts
````typescript
/**
 * Module: notebooklm/subdomains/conversation
 * Layer: api/server
 *
 * Server-only boundary for the conversation subdomain.
 * Import this path only from Server Components, Server Actions, or route handlers.
 * Do NOT import in client components or public api/index.ts.
 */
````

## File: modules/notebooklm/subdomains/conversation/application/dto/conversation.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the conversation subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
````

## File: modules/notebooklm/subdomains/conversation/domain/entities/message.ts
````typescript
/**
 * modules/notebook — domain entity: Message
 */
⋮----
import type { ID } from "@shared-types";
⋮----
export type MessageRole = "user" | "assistant" | "system";
⋮----
export interface Message {
  readonly id: ID;
  readonly role: MessageRole;
  readonly content: string;
  readonly createdAt: string;
}
````

## File: modules/notebooklm/subdomains/conversation/domain/entities/thread.ts
````typescript
/**
 * modules/notebook — domain entity: Thread
 */
⋮----
import type { ID } from "@shared-types";
import type { Message } from "./message";
⋮----
export interface Thread {
  readonly id: ID;
  readonly messages: Message[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
````

## File: modules/notebooklm/subdomains/conversation/README.md
````markdown
# Conversation

Conversation threads and message management.

## Ownership

- **Bounded Context**: notebooklm
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/subdomains/notebook/api/index.ts
````typescript

````

## File: modules/notebooklm/subdomains/notebook/application/dto/notebook.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the notebook subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
````

## File: modules/notebooklm/subdomains/notebook/application/index.ts
````typescript

````

## File: modules/notebooklm/subdomains/notebook/application/use-cases/generate-notebook-response.use-case.ts
````typescript
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { NotebookRepository } from "../../domain/repositories/NotebookRepository";
⋮----
export class GenerateNotebookResponseUseCase {
⋮----
constructor(private readonly agentRepository: NotebookRepository)
⋮----
async execute(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult>
````

## File: modules/notebooklm/subdomains/notebook/domain/entities/AgentGeneration.ts
````typescript
import type { DomainError } from "@shared-types";
⋮----
export interface GenerateNotebookResponseInput {
  readonly prompt: string;
  readonly model?: string;
  readonly system?: string;
}
⋮----
export interface NotebookResponse {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
}
⋮----
export type GenerateNotebookResponseResult =
  | { ok: true; data: NotebookResponse }
  | { ok: false; error: DomainError };
````

## File: modules/notebooklm/subdomains/notebook/domain/index.ts
````typescript
/**
 * notebooklm/notebook domain — public exports.
 */
````

## File: modules/notebooklm/subdomains/notebook/domain/repositories/NotebookRepository.ts
````typescript
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../entities/AgentGeneration";
⋮----
export interface NotebookRepository {
  generateResponse(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult>;
}
⋮----
generateResponse(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult>;
````

## File: modules/notebooklm/subdomains/source/api/server.ts
````typescript
/**
 * source subdomain — server-only API.
 *
 * Exports composition factories for server-side wiring.
 * Server Actions, route handlers, and other server-side entry points should
 * use these factories instead of importing infrastructure adapters directly.
 */
````

## File: modules/notebooklm/subdomains/source/application/dto/source-file.dto.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/dto
 * Purpose: DTOs and error codes for SourceFile use-case I/O.
 */
⋮----
import type { SourceFile } from "../../domain/entities/SourceFile";
import type { RagDocumentStatus } from "../../domain/entities/RagDocument";
⋮----
export interface WorkspaceFileListItemDto {
  readonly id: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly name: string;
  readonly status: SourceFile["status"];
  readonly kind: SourceFile["classification"];
  readonly source: string;
  readonly detail: string;
  readonly href?: string;
}
⋮----
export interface UploadInitFileInputDto {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly idempotencyKey?: string;
}
⋮----
export interface UploadInitFileOutputDto {
  readonly fileId: string;
  readonly versionId: string;
  readonly uploadPath: string;
  readonly uploadToken: string;
  readonly expiresAtISO: string;
}
⋮----
export interface UploadCompleteFileInputDto {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
  readonly fileId: string;
  readonly versionId: string;
}
⋮----
export interface UploadCompleteFileOutputDto {
  readonly fileId: string;
  readonly versionId: string;
  readonly status: "active";
  readonly ragDocumentId: string;
  readonly ragDocumentStatus: RagDocumentStatus;
}
⋮----
export type SourceFileCommandErrorCode =
  | "FILE_WORKSPACE_REQUIRED"
  | "FILE_ORGANIZATION_REQUIRED"
  | "FILE_ACTOR_REQUIRED"
  | "FILE_NAME_REQUIRED"
  | "FILE_ID_REQUIRED"
  | "FILE_VERSION_REQUIRED"
  | "FILE_VERSION_NOT_FOUND"
  | "FILE_INVALID_SIZE"
  | "FILE_NOT_FOUND"
  | "FILE_SCOPE_MISMATCH"
  | "FILE_STATUS_CONFLICT"
  | "FILE_RAG_REGISTRATION_FAILED"
  | "FILE_INVALID_INPUT"
  | "FILE_DELETE_FAILED"
  | "FILE_RENAME_FAILED";
````

## File: modules/notebooklm/subdomains/source/application/dto/source-live-document.dto.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/dto
 * Purpose: DTO types and mapping logic for live source documents.
 *
 * Extracted from interfaces/hooks to keep data transformation in the application layer.
 * Interfaces should import these types and mappers from here.
 */
⋮----
export interface SourceDocument {
  readonly id: string;
  readonly filename: string;
  readonly workspaceId: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
  readonly status: string;
  readonly ragStatus: string;
  readonly uploadedAt: Date | null;
}
⋮----
export interface SourceLiveDocument extends SourceDocument {
  readonly errorMessage: string;
  readonly ragError: string;
  readonly isClientPending?: boolean;
}
⋮----
export type AssetDocument = SourceDocument;
export type AssetLiveDocument = SourceLiveDocument;
⋮----
// ── Helpers ───────────────────────────────────────────────────────────────────
⋮----
function isRecord(value: unknown): value is Record<string, unknown>
⋮----
function objectOrEmpty(value: unknown): Record<string, unknown>
⋮----
function toDateOrNull(value: unknown): Date | null
⋮----
// fall through
⋮----
// fall through
⋮----
function resolveFilename(data: Record<string, unknown>): string
⋮----
export function mapToSourceLiveDocument(
  id: string,
  data: Record<string, unknown>,
): SourceLiveDocument
⋮----
const n = (v: unknown)
````

## File: modules/notebooklm/subdomains/source/application/index.ts
````typescript

````

## File: modules/notebooklm/subdomains/source/application/use-cases/wiki-library.helpers.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Purpose: Private helpers for wiki-library use cases.
 *
 * Extracted from use-cases file to keep business workflow readable.
 * Depends on local slug-utils for slug derivation and validation.
 */
⋮----
import { deriveSlugCandidate, isValidSlug } from "../utils/slug-utils";
import type { WikiLibrary } from "../../domain/entities/WikiLibrary";
⋮----
export function generateSourceId(): string
⋮----
export function normalizeLibraryName(name: string): string
⋮----
export function normalizeFieldKey(key: string): string
⋮----
export function ensureUniqueLibrarySlug(baseSlug: string, libraries: WikiLibrary[]): string
````

## File: modules/notebooklm/subdomains/source/application/utils/slug-utils.ts
````typescript
/**
 * notebooklm/subdomains/source — slug utilities
 * Pure slug derivation and validation helpers for wiki library names.
 */
⋮----
/**
 * Converts a human-readable display name into a slug candidate.
 * Pure function — no side effects.
 */
export function deriveSlugCandidate(displayName: string): string
⋮----
/**
 * Returns true when the slug string passes namespace slug rules.
 * Pure function — no side effects.
 */
export function isValidSlug(slug: string): boolean
````

## File: modules/notebooklm/subdomains/source/domain/entities/SourceFile.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Aggregate: SourceFile — workspace-scoped file with lifecycle status.
 */
⋮----
export type SourceFileStatus = "active" | "archived" | "deleted";
⋮----
export type SourceFileClassification = "image" | "manifest" | "record" | "other";
⋮----
export interface SourceFile {
  readonly id: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly accountId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly classification: SourceFileClassification;
  readonly tags: readonly string[];
  readonly currentVersionId: string;
  readonly retentionPolicyId?: string;
  readonly status: SourceFileStatus;
  readonly source?: string;
  readonly detail?: string;
  readonly href?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
  readonly deletedAtISO?: string;
}
⋮----
export function canArchiveSourceFile(file: SourceFile): boolean
⋮----
export function canRestoreSourceFile(file: SourceFile): boolean
````

## File: modules/notebooklm/subdomains/source/domain/entities/SourceFileVersion.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Entity: SourceFileVersion — immutable version snapshot of a source file.
 */
⋮----
export type SourceFileVersionStatus = "pending" | "stored" | "active" | "superseded";
⋮----
export interface SourceFileVersion {
  readonly id: string;
  readonly fileId: string;
  readonly versionNumber: number;
  readonly status: SourceFileVersionStatus;
  readonly storagePath: string;
  readonly checksum?: string;
  readonly createdAtISO: string;
}
⋮----
export function isVersionImmutable(version: SourceFileVersion): boolean
````

## File: modules/notebooklm/subdomains/source/domain/entities/SourceRetentionPolicy.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Value Object: SourceRetentionPolicy — governs how long files are retained.
 */
⋮----
export interface SourceRetentionPolicy {
  readonly id: string;
  readonly organizationId: string;
  readonly retentionDays: number;
  readonly legalHold: boolean;
  readonly purgeMode: "soft-delete" | "hard-delete";
  readonly updatedAtISO: string;
}
````

## File: modules/notebooklm/subdomains/source/domain/entities/WikiLibrary.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Entity: WikiLibrary — structured database entity used by wiki-style views.
 */
⋮----
export type WikiLibraryStatus = "active" | "archived";
export type WikiLibraryFieldType = "title" | "text" | "number" | "select" | "relation";
⋮----
export interface WikiLibrary {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly slug: string;
  readonly status: WikiLibraryStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
⋮----
export interface WikiLibraryField {
  readonly id: string;
  readonly libraryId: string;
  readonly key: string;
  readonly label: string;
  readonly type: WikiLibraryFieldType;
  readonly required: boolean;
  readonly options?: readonly string[];
  readonly createdAt: Date;
}
⋮----
export interface WikiLibraryRow {
  readonly id: string;
  readonly libraryId: string;
  readonly values: Record<string, unknown>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
⋮----
export interface CreateWikiLibraryInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
}
⋮----
export interface AddWikiLibraryFieldInput {
  readonly accountId: string;
  readonly libraryId: string;
  readonly key: string;
  readonly label: string;
  readonly type: WikiLibraryFieldType;
  readonly required?: boolean;
  readonly options?: readonly string[];
}
⋮----
export interface CreateWikiLibraryRowInput {
  readonly accountId: string;
  readonly libraryId: string;
  readonly values: Record<string, unknown>;
}
````

## File: modules/notebooklm/subdomains/source/domain/services/complete-upload-source-file.service.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/services
 * Service: completeUploadSourceFile — transitions a file to active after upload.
 *
 * Pure domain function: no I/O, no side effects.
 */
⋮----
import type { SourceFile } from "../entities/SourceFile";
⋮----
export interface CompleteUploadSourceFileInput {
  readonly file: SourceFile;
  readonly completedAtISO: string;
}
⋮----
export function completeUploadSourceFile(input: CompleteUploadSourceFileInput): SourceFile
````

## File: modules/notebooklm/subdomains/source/domain/services/resolve-source-organization-id.service.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/services
 * Service: resolveSourceOrganizationId — maps an account to its organization scope.
 *
 * Personal accounts get a synthetic org ID prefixed with "personal:" so they
 * can participate in the same org-scoped permission checks as org accounts
 * without sharing an org namespace.
 */
⋮----
export function resolveSourceOrganizationId(
  accountType: "user" | "organization",
  accountId: string,
): string
````

## File: modules/notebooklm/subdomains/synthesis/application/index.ts
````typescript
/**
 * Application layer for notebooklm subdomain 'synthesis'.
 * Contains RAG pipeline use cases for answer generation and feedback.
 */
````

## File: modules/notebooklm/subdomains/synthesis/domain/entities/generation.entities.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/entities
 * Purpose: Generation result types for the synthesis layer.
 *
 * Design notes:
 * - These types bridge grounding chunks → natural-language answer.
 * - RagRetrievedChunk is re-exported from retrieval entities for convenience;
 *   callers should use these types when working with generation output.
 */
⋮----
import type { DomainError } from "@shared-types";
⋮----
import type { RagRetrievedChunk } from "./retrieval.entities";
⋮----
/** Attribution claim within a generated answer */
export interface GenerationCitation {
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly reason: string;
}
⋮----
/** Input to the generation port */
export interface GenerateRagAnswerInput {
  readonly traceId: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly userQuery: string;
  readonly chunks: readonly RagRetrievedChunk[];
  /** Optional model override (e.g. "googleai/gemini-2.5-pro"). Fall back to env default. */
  readonly model?: string;
}
⋮----
/** Optional model override (e.g. "googleai/gemini-2.5-pro"). Fall back to env default. */
⋮----
/** Successful generation output */
export interface GenerateRagAnswerOutput {
  readonly answer: string;
  readonly citations: readonly GenerationCitation[];
  readonly model: string;
}
⋮----
/** Discriminated union result (compatible with CommandResult pattern) */
export type GenerateRagAnswerResult =
  | { ok: true; data: GenerateRagAnswerOutput }
  | { ok: false; error: DomainError };
````

## File: modules/notebooklm/subdomains/synthesis/domain/entities/GroundingEvidence.ts
````typescript
/**
 * Module: notebooklm/subdomains/grounding
 * Layer: domain/entities
 * Purpose: GroundingEvidence — attribution record tying an answer claim to its source.
 *
 * Migration source: ai/domain/entities/retrieval.entities.ts → RagCitation
 * Migration source: ai/domain/services/RagCitationBuilder.ts
 */
⋮----
/** Attribution record that ties an answer claim to its source chunk */
export interface Citation {
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly reason: string;
}
⋮----
/** Grounding evidence aggregating citations with source metadata */
export interface GroundingEvidence {
  readonly traceId: string;
  readonly citations: readonly Citation[];
  readonly totalChunksConsidered: number;
  readonly groundedAt: string;
}
````

## File: modules/notebooklm/subdomains/synthesis/domain/entities/QualityFeedback.ts
````typescript
/**
 * Module: notebooklm/subdomains/evaluation
 * Layer: domain/entities
 * Purpose: QualityFeedback — user-quality signal on generated answers.
 *
 * Migration source: ai/domain/entities/rag-feedback.entities.ts
 */
⋮----
export type FeedbackRating = "helpful" | "not_helpful" | "partially_helpful";
⋮----
export interface QualityFeedback {
  readonly id: string;
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: FeedbackRating;
  readonly comment?: string;
  readonly submittedByUserId: string;
  readonly submittedAtISO: string;
}
⋮----
export interface SubmitFeedbackInput {
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: FeedbackRating;
  readonly comment?: string;
  readonly submittedByUserId: string;
}
````

## File: modules/notebooklm/subdomains/synthesis/domain/entities/rag-feedback.entities.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/entities
 * Purpose: RagQueryFeedback — captures user-quality signal on generated answers.
 */
⋮----
export type RagFeedbackRating = "helpful" | "not_helpful" | "partially_helpful";
⋮----
export interface RagQueryFeedback {
  readonly id: string;
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: RagFeedbackRating;
  readonly comment?: string;
  readonly submittedByUserId: string;
  readonly submittedAtISO: string;
}
⋮----
export interface SubmitRagQueryFeedbackInput {
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: RagFeedbackRating;
  readonly comment?: string;
  readonly submittedByUserId: string;
}
````

## File: modules/notebooklm/subdomains/synthesis/domain/entities/rag-query.entities.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/entities
 * Purpose: RAG Q&A domain types — inputs, outputs, streaming events.
 *
 * Design notes:
 * - AnswerRagQueryInput / Output represent the public contract for the Q&A use case.
 * - RagStreamEvent models the streaming surface (for future streaming support).
 * - RagCitation re-exported from grounding for Q&A consumer convenience.
 */
⋮----
import type { DomainError } from "@shared-types";
⋮----
import type { RagCitation, RagRetrievalSummary } from "./retrieval.entities";
⋮----
export interface AnswerRagQueryInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly userQuery: string;
  readonly taxonomy?: string;
  readonly topK?: number;
  readonly model?: string;
}
⋮----
export interface AnswerRagQueryOutput {
  readonly answer: string;
  readonly citations: readonly RagCitation[];
  readonly retrievalSummary: RagRetrievalSummary;
  readonly model: string;
  readonly traceId: string;
  readonly events: readonly RagStreamEvent[];
}
⋮----
export type AnswerRagQueryResult =
  | { ok: true; data: AnswerRagQueryOutput }
  | { ok: false; error: DomainError };
⋮----
/** Streaming event for progressive answer delivery (extensibility hook) */
export interface RagStreamEvent {
  readonly type: "token" | "citation" | "done" | "error";
  readonly traceId: string;
  readonly payload: string | RagCitation | RagRetrievalSummary | DomainError;
}
````

## File: modules/notebooklm/subdomains/synthesis/domain/entities/retrieval.entities.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/entities
 * Purpose: Core retrieval result types — the factual anchors used to ground
 *          AI-generated answers. These types flow from retrieval → synthesis.
 *
 * Design notes:
 * - RagRetrievedChunk is the atomic unit of grounding evidence.
 * - RagCitation links an answer claim back to its source chunk.
 * - RagRetrievalSummary reports the bibliographic scope of the retrieval pass.
 * - All fields are readonly; entities are value objects (compared by identity in the flow).
 */
⋮----
/** A single text chunk fetched from the vector + sparse retrieval pass */
export interface RagRetrievedChunk {
  readonly chunkId: string;
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  /** Semantic / organisational taxonomy label (e.g. "規章制度") */
  readonly taxonomy: string;
  readonly text: string;
  /** Similarity score in [0, 1]; higher is more relevant */
  readonly score: number;
}
⋮----
/** Semantic / organisational taxonomy label (e.g. "規章制度") */
⋮----
/** Similarity score in [0, 1]; higher is more relevant */
⋮----
/** Attribution record that ties an answer claim to its source chunk */
export interface RagCitation {
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly reason: string;
}
⋮----
/** Summary of the retrieval execution scope for observability / UX */
export interface RagRetrievalSummary {
  readonly mode: "skeleton-metadata-filter";
  readonly scope: "organization" | "workspace";
  readonly retrievedChunkCount: number;
  readonly topK: number;
  readonly taxonomy?: string;
}
````

## File: modules/notebooklm/subdomains/synthesis/domain/entities/RetrievedChunk.ts
````typescript
/**
 * Module: notebooklm/subdomains/retrieval
 * Layer: domain/entities
 * Purpose: RetrievedChunk — atomic unit of grounding evidence from vector/sparse retrieval.
 *
 * Migration source: ai/domain/entities/retrieval.entities.ts → RagRetrievedChunk
 * This is the target canonical location after Strangler Pattern convergence.
 */
⋮----
/** A single text chunk fetched from the vector + sparse retrieval pass */
export interface RetrievedChunk {
  readonly chunkId: string;
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  /** Semantic / organisational taxonomy label */
  readonly taxonomy: string;
  readonly text: string;
  /** Similarity score in [0, 1]; higher is more relevant */
  readonly score: number;
}
⋮----
/** Semantic / organisational taxonomy label */
⋮----
/** Similarity score in [0, 1]; higher is more relevant */
⋮----
/** Summary of the retrieval execution scope for observability / UX */
export interface RetrievalSummary {
  readonly mode: string;
  readonly scope: "organization" | "workspace";
  readonly retrievedChunkCount: number;
  readonly topK: number;
  readonly taxonomy?: string;
}
````

## File: modules/notebooklm/subdomains/synthesis/domain/entities/SynthesisResult.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/entities
 * Purpose: SynthesisResult — the generated answer with attribution.
 *
 * Migration source: ai/domain/entities/generation.entities.ts
 */
⋮----
import type { DomainError } from "@shared-types";
⋮----
/** Attribution claim within a generated answer */
export interface GenerationCitation {
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly reason: string;
}
⋮----
/** Input to the generation port */
export interface GenerateAnswerInput {
  readonly traceId: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly userQuery: string;
  readonly chunks: readonly {
    readonly chunkId: string;
    readonly docId: string;
    readonly chunkIndex: number;
    readonly text: string;
    readonly score: number;
  }[];
  readonly model?: string;
}
⋮----
/** Successful generation output */
export interface GenerateAnswerOutput {
  readonly answer: string;
  readonly citations: readonly GenerationCitation[];
  readonly model: string;
}
⋮----
/** Discriminated union result */
export type GenerateAnswerResult =
  | { ok: true; data: GenerateAnswerOutput }
  | { ok: false; error: DomainError };
````

## File: modules/notebooklm/subdomains/synthesis/domain/events/GroundingEvents.ts
````typescript
/**
 * Module: notebooklm/subdomains/grounding
 * Layer: domain/events
 * Purpose: Domain events for grounding operations.
 */
⋮----
import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";
⋮----
export interface GroundingCompletedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.grounding.completed";
  readonly payload: {
    readonly traceId: string;
    readonly citationCount: number;
    readonly chunksConsidered: number;
  };
}
````

## File: modules/notebooklm/subdomains/synthesis/domain/events/RetrievalEvents.ts
````typescript
/**
 * Module: notebooklm/subdomains/retrieval
 * Layer: domain/events
 * Purpose: Domain events for retrieval operations.
 */
⋮----
import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";
⋮----
export interface RetrievalCompletedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.retrieval.completed";
  readonly payload: {
    readonly traceId: string;
    readonly chunkCount: number;
    readonly scope: "organization" | "workspace";
    readonly topK: number;
  };
}
⋮----
export interface RetrievalFailedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.retrieval.failed";
  readonly payload: {
    readonly traceId: string;
    readonly errorCode: string;
    readonly errorMessage: string;
  };
}
````

## File: modules/notebooklm/subdomains/synthesis/domain/events/SynthesisEvents.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/events
 * Purpose: Domain events for synthesis operations.
 */
⋮----
import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";
⋮----
export interface SynthesisCompletedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.synthesis.completed";
  readonly payload: {
    readonly traceId: string;
    readonly model: string;
    readonly citationCount: number;
    readonly answerLengthChars: number;
  };
}
⋮----
export interface SynthesisFailedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.synthesis.failed";
  readonly payload: {
    readonly traceId: string;
    readonly errorCode: string;
    readonly errorMessage: string;
  };
}
````

## File: modules/notebooklm/subdomains/synthesis/domain/services/RagCitationBuilder.ts
````typescript
import type { GenerationCitation } from "../entities/generation.entities";
import type { RagRetrievedChunk } from "../entities/retrieval.entities";
⋮----
export class RagCitationBuilder {
⋮----
/**
   * Derive citations from the chunks used for generation.
   * Citations are taken directly from input chunks to avoid model hallucination.
   */
buildCitations(chunks: readonly RagRetrievedChunk[]): GenerationCitation[]
````

## File: modules/notebooklm/subdomains/synthesis/domain/services/RagPromptBuilder.ts
````typescript
import type { RagRetrievedChunk } from "../entities/retrieval.entities";
import type { RagPrompt } from "../value-objects/RagPrompt";
⋮----
export class RagPromptBuilder {
⋮----
/**
   * Format a single chunk for inclusion in the generation prompt.
   */
formatChunkForPrompt(chunk: RagRetrievedChunk): string
⋮----
/**
   * Build the complete RAG generation prompt from retrieved chunks.
   */
buildGenerationPrompt(userQuery: string, chunks: readonly RagRetrievedChunk[]): RagPrompt
````

## File: modules/notebooklm/subdomains/synthesis/domain/services/RagScoringService.ts
````typescript
import type { RagRetrievedChunk } from "../entities/retrieval.entities";
⋮----
export class RagScoringService {
⋮----
/**
   * Tokenize text into searchable tokens (CJK-aware).
   * CJK characters are treated as individual tokens; Latin words split by whitespace/punctuation.
   */
tokenize(text: string): readonly string[]
⋮----
/**
   * Compute token-overlap score between query tokens and chunk text.
   * Returns score in [0, 1] = matchedTokens / queryTokens.length
   */
computeTokenOverlapScore(queryTokens: readonly string[], chunkText: string): number
⋮----
/**
   * Rank chunks by relevance score, returning top-K.
   */
rankChunks(
    chunks: readonly RagRetrievedChunk[],
    queryTokens: readonly string[],
    topK: number,
): RagRetrievedChunk[]
````

## File: modules/notebooklm/subdomains/synthesis/domain/value-objects/index.ts
````typescript

````

## File: modules/notebooklm/subdomains/synthesis/domain/value-objects/OrganizationScope.ts
````typescript
export interface OrganizationScope {
  readonly organizationId: string;
  readonly workspaceId?: string;
}
⋮----
export function isWorkspaceScoped(scope: OrganizationScope): boolean
````

## File: modules/notebooklm/subdomains/synthesis/domain/value-objects/RagPrompt.ts
````typescript
export interface RagPrompt {
  readonly systemInstruction: string;
  readonly formattedContext: string;
  readonly userQuery: string;
}
````

## File: modules/notebooklm/subdomains/synthesis/domain/value-objects/RelevanceScore.ts
````typescript
import { z } from "@lib-zod";
⋮----
export type RelevanceScore = z.infer<typeof RelevanceScoreSchema>;
⋮----
export function createRelevanceScore(raw: number): RelevanceScore
````

## File: modules/notebooklm/subdomains/synthesis/domain/value-objects/TopK.ts
````typescript
import { z } from "@lib-zod";
⋮----
export type TopK = z.infer<typeof TopKSchema>;
⋮----
export function createTopK(raw: number): TopK
````

## File: modules/notebooklm/subdomains/synthesis/README.md
````markdown
# Synthesis

完整 RAG pipeline：retrieval → grounding → answer generation → evaluation/feedback。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain**: synthesis (Active)
- **Status**: Consolidated — all RAG pipeline responsibilities

## Internal Facets

The RAG pipeline is organized as internal domain facets within this single subdomain:

| Facet | Responsibility | Key Types |
|-------|---------------|-----------|
| retrieval | 查詢召回與排序策略、向量搜尋 | RetrievedChunk, IChunkRetrievalPort, RagScoringService |
| grounding | 引用對齊與可追溯證據 | Citation, GroundingEvidence, ICitationBuilder, RagCitationBuilder |
| generation | RAG 合成、摘要與洞察生成 | GenerateAnswerInput/Output, IGenerationPort, RagPromptBuilder |
| evaluation | 品質評估、feedback 收集 | QualityFeedback, IFeedbackPort, SubmitRagQueryFeedbackUseCase |

## Key Components

| Component | Layer | Purpose |
|-----------|-------|---------|
| AnswerRagQueryUseCase | application | 完整 RAG Q&A 流程 orchestration |
| SubmitRagQueryFeedbackUseCase | application | 用戶品質 feedback 收集 |
| FirebaseRagRetrievalAdapter | infrastructure | Firestore 向量/稀疏檢索 |
| GenkitRagGenerationAdapter | infrastructure | Genkit AI answer generation |
| FirebaseRagQueryFeedbackAdapter | infrastructure | Firestore feedback 持久化 |
| FirebaseKnowledgeContentAdapter | infrastructure | Knowledge 文件查詢與 reindex |
| RagQueryView | interfaces | 最小化 RAG 查詢 UI |

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/api/server.ts
````typescript
/**
 * modules/notebooklm — server-only API barrel.
 *
 * Exports concrete notebook implementations that depend on server-only
 * packages or infrastructure wiring. Must only be imported in Server Actions,
 * route handlers, or server-side infrastructure.
 * This surface exists for server-side orchestrators; browser-facing
 * composition still goes through workspace/api when workspace owns the flow.
 */
⋮----
// Q&A subdomain — AnswerRagQueryUseCase factory (now in synthesis subdomain)
````

## File: modules/notebooklm/api/ui.ts
````typescript
/**
 * notebooklm/api/ui.ts
 *
 * UI-only surface for notebooklm bounded-context components and hooks.
 * Semantic capabilities remain in notebooklm/api/index.ts.
 */
⋮----
// ConversationPanel remains on the direct subdomain ui path to avoid the
// synchronous evaluation cycle documented in notebooklm/api/index.ts.
````

## File: modules/notebooklm/application/dto/index.ts
````typescript

````

## File: modules/notebooklm/index.ts
````typescript
/**
 * platform — Public module entry point.
 * All cross-module consumers must import through this file or modules/platform/api/.
 */
````

## File: modules/notebooklm/infrastructure/notebook/ai/AiTextGenerationAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/notebook
 * Layer: infrastructure/ai
 * Purpose: Delegates shared text generation to the AI bounded-context API.
 */
⋮----
import { generateAiText } from "@/modules/ai/api/server";
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../../subdomains/notebook/domain/entities/AgentGeneration";
import type { NotebookRepository } from "../../../subdomains/notebook/domain/repositories/NotebookRepository";
⋮----
export class AiTextGenerationAdapter implements NotebookRepository {
⋮----
async generateResponse(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult>
````

## File: modules/notebooklm/infrastructure/source/adapters/NotionKnowledgePageGatewayAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/adapters
 * Adapter: NotionKnowledgePageGatewayAdapter — delegates to notion bounded context API.
 *
 * Implements the KnowledgePageGateway port defined in the domain layer,
 * bridging the source subdomain to the notion bounded context through its
 * top-level public API and published-language tokens.
 */
⋮----
import type { CommandResult } from "@shared-types";
⋮----
import type { KnowledgePageGateway } from "../../../subdomains/source/domain/ports/KnowledgePageGatewayPort";
⋮----
interface KnowledgeArtifactReferenceToken {
  readonly artifactId: string;
  readonly artifactType: "page" | "article";
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly slug: string;
}
⋮----
function slugifyTitle(title: string): string
⋮----
function toKnowledgeArtifactReference(input: {
  accountId: string;
  workspaceId: string;
  title: string;
  artifactId: string;
}): KnowledgeArtifactReferenceToken
⋮----
export class NotionKnowledgePageGatewayAdapter implements KnowledgePageGateway {
⋮----
constructor(
    private readonly deps: {
      createKnowledgePage: (input: {
        accountId: string;
        workspaceId: string;
        title: string;
        parentPageId: null;
        createdByUserId: string;
})
⋮----
async createPage(input: {
    accountId: string;
    workspaceId: string;
    title: string;
    parentPageId: null;
    createdByUserId: string;
}): Promise<CommandResult>
⋮----
// Normalize cross-context return as notion published-language token.
⋮----
async addBlock(input: {
    accountId: string;
    pageId: string;
    index: number;
    content: {
      type: "text";
      richText: readonly { type: string; plainText: string }[];
      properties: Record<string, unknown>;
    };
}): Promise<CommandResult>
````

## File: modules/notebooklm/infrastructure/source/adapters/TaskMaterializationWorkflowAdapter.ts
````typescript
import type { CommandResult } from "@shared-types";
⋮----
import type {
  ExtractTaskCandidatesInput,
  ExtractTaskCandidatesOutput,
  MaterializeKnowledgeTasksInput,
  TaskMaterializationWorkflowPort,
} from "../../../subdomains/source/domain/ports/TaskMaterializationWorkflowPort";
⋮----
export class TaskMaterializationWorkflowAdapter implements TaskMaterializationWorkflowPort {
⋮----
constructor(
    private readonly deps: {
      extractTaskCandidates: (input: {
        knowledgePageId: string;
        blocks: ReadonlyArray<{
          blockId: string;
          text: string;
          pageIndex?: number;
        }>;
        enableAiFallback?: boolean;
}) => Promise<
⋮----
async extractTaskCandidates(
    input: ExtractTaskCandidatesInput,
): Promise<ExtractTaskCandidatesOutput>
⋮----
async materializeKnowledgeTasks(
    input: MaterializeKnowledgeTasksInput,
): Promise<CommandResult>
````

## File: modules/notebooklm/infrastructure/source/firebase/FirebaseDocumentStatusAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseDocumentStatusAdapter — watches Firestore document status via onSnapshot.
 *
 * Extracted from interfaces/components to keep Firestore access in infrastructure layer.
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
⋮----
function asRecord(value: unknown): Record<string, unknown>
⋮----
function asString(value: unknown, fallback = ""): string
⋮----
function asNumber(value: unknown, fallback = 0): number
⋮----
export async function waitForParsedDocument(
  accountId: string,
  docId: string,
): Promise<
````

## File: modules/notebooklm/infrastructure/source/memory/InMemoryWikiLibraryAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/memory
 * Adapter: InMemoryWikiLibraryAdapter — in-memory implementation of WikiLibraryRepository.
 * Use case: local dev, tests, and no-firebase environments.
 */
⋮----
import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
} from "../../../subdomains/source/domain/entities/WikiLibrary";
import type { WikiLibraryRepository } from "../../../subdomains/source/domain/repositories/WikiLibraryRepository";
⋮----
export class InMemoryWikiLibraryAdapter implements WikiLibraryRepository {
⋮----
async listByAccountId(accountId: string): Promise<WikiLibrary[]>
⋮----
async findById(accountId: string, libraryId: string): Promise<WikiLibrary | null>
⋮----
async create(library: WikiLibrary): Promise<void>
⋮----
async createField(accountId: string, field: WikiLibraryField): Promise<void>
⋮----
async listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]>
⋮----
async createRow(accountId: string, row: WikiLibraryRow): Promise<void>
⋮----
async listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]>
````

## File: modules/notebooklm/infrastructure/synthesis/ai/AiRagGenerationAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: infrastructure/ai
 * Purpose: Implements RagGenerationRepository by delegating shared model invocation
 *          to the AI bounded-context API. Prompt construction and citation building stay
 *          local to NotebookLM synthesis semantics.
 */
⋮----
import { generateAiText } from "@/modules/ai/api/server";
import type { RagGenerationRepository } from "../../../subdomains/synthesis/domain/repositories/RagGenerationRepository";
import type {
  GenerateRagAnswerInput,
  GenerateRagAnswerResult,
  GenerateRagAnswerOutput,
  GenerationCitation,
} from "../../../subdomains/synthesis/domain/entities/generation.entities";
⋮----
function formatChunkForPrompt(chunk: GenerateRagAnswerInput["chunks"][number]): string
⋮----
function buildGenerationPrompt(input: GenerateRagAnswerInput): string
⋮----
function buildCitations(input: GenerateRagAnswerInput): readonly GenerationCitation[]
⋮----
export class AiRagGenerationAdapter implements RagGenerationRepository {
⋮----
async generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult>
````

## File: modules/notebooklm/infrastructure/synthesis/index.ts
````typescript
/**
 * Infrastructure layer for notebooklm subdomain 'synthesis'.
 * Contains Firebase adapters and platform-delegating adapters for the RAG pipeline.
 */
````

## File: modules/notebooklm/interfaces/conversation/components/ConversationPanel.tsx
````typescript
/**
 * Module: notebooklm/subdomains/conversation
 * Component: ConversationPanel
 * Purpose: Full-page AI chat UI — wired to conversation server actions.
 *          Thread persistence via Firestore. Multi-turn context support.
 *
 * Props are injected by the app/ shim so this component has no provider dependencies.
 */
⋮----
import Link from "next/link";
import { Bot, BookOpen, Brain, FileText, Lightbulb, Loader2, Plus, SendHorizonal } from "lucide-react";
⋮----
import type { WorkspaceEntity } from "@/modules/workspace/api";
import { resolveWorkspaceFromMap, WorkspaceContextCard } from "@/modules/workspace/api/ui";
import { cn } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
⋮----
import { useAiChatThread } from "../hooks/useAiChatThread";
⋮----
// ── Props ─────────────────────────────────────────────────────────────────────
⋮----
export interface ConversationPanelProps {
  accountId: string;
  workspaces: Record<string, WorkspaceEntity>;
  requestedWorkspaceId: string;
}
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
export function ConversationPanel(
⋮----
onSubmit=
⋮----
onChange=
````

## File: modules/notebooklm/interfaces/conversation/composition/use-cases.ts
````typescript
/**
 * Module: notebooklm/interfaces/conversation/composition
 * Layer: interfaces/composition
 *
 * Conversation use-case composition factory.
 * Wires SaveThreadUseCase and LoadThreadUseCase with their Firestore adapter.
 * Default arguments make this self-wiring for production use.
 */
⋮----
import type { ThreadRepository } from "../../../subdomains/conversation/domain/repositories/ThreadRepository";
import { SaveThreadUseCase } from "../../../subdomains/conversation/application/use-cases/save-thread.use-case";
import { LoadThreadUseCase } from "../../../subdomains/conversation/application/use-cases/load-thread.use-case";
import { makeThreadRepo } from "./adapters";
⋮----
export interface ConversationUseCases {
  saveThread: SaveThreadUseCase;
  loadThread: LoadThreadUseCase;
}
⋮----
export function makeConversationUseCases(
  repo: ThreadRepository = makeThreadRepo(),
): ConversationUseCases
````

## File: modules/notebooklm/interfaces/conversation/helpers.ts
````typescript
import type { Thread } from "../../subdomains/conversation/domain/entities/thread";
⋮----
// ── Domain types ──────────────────────────────────────────────────────────────
⋮----
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
⋮----
// ── Storage key ───────────────────────────────────────────────────────────────
⋮----
export const STORAGE_KEY = (accountId: string, workspaceId: string)
⋮----
// ── Pure helpers ──────────────────────────────────────────────────────────────
⋮----
export function buildContextPrompt(history: ChatMessage[]): string
⋮----
export function generateMsgId()
⋮----
export function threadFromMessages(id: string, msgs: ChatMessage[], createdAt: string): Thread
````

## File: modules/notebooklm/interfaces/notebook/composition/adapters.ts
````typescript
import { AiTextGenerationAdapter } from "../../../infrastructure/notebook/ai/AiTextGenerationAdapter";
⋮----
export function makeNotebookRepo()
````

## File: modules/notebooklm/interfaces/source/_actions/source-file.actions.ts
````typescript
import { v4 as uuid } from "@lib-uuid";
import type {
  UploadCompleteFileInputDto,
  UploadCompleteFileOutputDto,
  UploadInitFileInputDto,
  UploadInitFileOutputDto,
} from "../../../subdomains/source/application/dto/source-file.dto";
import type {
  RegisterUploadedRagDocumentInputDto,
  RegisterUploadedRagDocumentResult,
} from "../../../subdomains/source/application/dto/rag-document.dto";
import { makeRagDocumentAdapter, makeSourceDocumentCommandAdapter, makeSourceFileAdapter } from "../composition/adapters";
import { UploadInitSourceFileUseCase } from "../../../subdomains/source/application/use-cases/upload-init-source-file.use-case";
import { UploadCompleteSourceFileUseCase } from "../../../subdomains/source/application/use-cases/upload-complete-source-file.use-case";
import { RegisterUploadedRagDocumentUseCase } from "../../../subdomains/source/application/use-cases/register-rag-document.use-case";
import { DeleteSourceDocumentUseCase } from "../../../subdomains/source/application/use-cases/delete-source-document.use-case";
import { RenameSourceDocumentUseCase } from "../../../subdomains/source/application/use-cases/rename-source-document.use-case";
import type { SourceFileCommandResult } from "../contracts/source-command-result";
⋮----
function createCommandId(idempotencyKey?: string): string
⋮----
export async function uploadInitFile(
  input: UploadInitFileInputDto,
): Promise<SourceFileCommandResult<UploadInitFileOutputDto>>
⋮----
export async function uploadCompleteFile(
  input: UploadCompleteFileInputDto,
): Promise<SourceFileCommandResult<UploadCompleteFileOutputDto>>
⋮----
export async function registerUploadedRagDocument(
  input: RegisterUploadedRagDocumentInputDto,
): Promise<RegisterUploadedRagDocumentResult>
⋮----
export async function deleteSourceDocument(
  accountId: string,
  documentId: string,
): Promise<SourceFileCommandResult<
⋮----
export async function renameSourceDocument(
  accountId: string,
  documentId: string,
  newName: string,
): Promise<SourceFileCommandResult<
````

## File: modules/notebooklm/interfaces/source/components/file-processing-dialog.body.tsx
````typescript
import { ClipboardList, ScanSearch, Sparkles } from "lucide-react";
⋮----
import { Badge } from "@ui-shadcn/ui/badge";
import { Checkbox } from "@ui-shadcn/ui/checkbox";
import { Label } from "@ui-shadcn/ui/label";
⋮----
import type { ExecutionSummary } from "./file-processing-dialog.utils";
import { FileProcessingPathValue, FileProcessingResultRow, FileProcessingSourceCard } from "./file-processing-dialog.parts";
⋮----
interface FileProcessingDialogBodyProps {
  readonly step: "decide" | "select" | "executing" | "done";
  readonly filename: string;
  readonly mimeType: string;
  readonly gcsUri: string;
  readonly sizeBytes: number;
  readonly shouldRunRag: boolean;
  readonly shouldCreatePage: boolean;
  readonly shouldCreateTasks: boolean;
  readonly onShouldRunRagChange: (checked: boolean) => void;
  readonly onShouldCreatePageChange: (checked: boolean) => void;
  readonly onShouldCreateTasksChange: (checked: boolean) => void;
  readonly summary: ExecutionSummary;
}
````

## File: modules/notebooklm/interfaces/source/components/LibraryTablePanel.tsx
````typescript
import { useEffect, useMemo, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
⋮----
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@lib-tanstack";
import { draggable, dropTargetForElements, monitorForElements } from "@lib-dragdrop";
⋮----
import { getWikiLibrarySnapshot, listWikiLibraries } from "../composition/wiki-library-facade";
import type { WikiLibraryRow } from "../../../subdomains/source/domain/entities/WikiLibrary";
⋮----
interface LibraryTablePanelProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}
⋮----
type RowData = WikiLibraryRow & { _values: Record<string, unknown> };
⋮----
/**
 * LibraryTablePanel
 *
 * TanStack Table rendering library rows with:
 * - Column-level text filter (global filter input)
 * - Drag-to-reorder rows via pragmatic-drag-and-drop
 */
⋮----
// Load library list
⋮----
// Load rows when selection changes
⋮----
// DnD row reorder
⋮----
onDrop(
````

## File: modules/notebooklm/interfaces/source/queries/source-file.queries.ts
````typescript
import type { WorkspaceEntity } from "@/modules/workspace/api";
⋮----
import type { WorkspaceFileListItemDto } from "../../../subdomains/source/application/dto/source-file.dto";
import { resolveSourceOrganizationId } from "../../../subdomains/source/application/dto/source.dto";
import type { RagDocumentRecord } from "../../../subdomains/source/application/dto/source.dto";
import type { SourceFileVersion } from "../../../subdomains/source/domain/entities/SourceFileVersion";
import { makeRagDocumentAdapter, makeSourceFileAdapter } from "../composition/adapters";
import { ListSourceFilesUseCase } from "../../../subdomains/source/application/queries/source-file.queries";
⋮----
export async function getWorkspaceFiles(
  workspace: WorkspaceEntity,
): Promise<WorkspaceFileListItemDto[]>
⋮----
export async function getWorkspaceRagDocuments(
  workspace: WorkspaceEntity,
): Promise<readonly RagDocumentRecord[]>
⋮----
export async function getSourceFileVersions(fileId: string): Promise<readonly SourceFileVersion[]>
````

## File: modules/notebooklm/notebooklm.instructions.md
````markdown

````

## File: modules/notebooklm/subdomains/conversation/application/use-cases/load-thread.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/conversation
 * Layer: application/use-cases
 *
 * LoadThreadUseCase — retrieves a conversation thread by ID (query handler).
 * Returns null if the thread does not exist.
 */
⋮----
import type { Thread } from "../../domain/entities/thread";
import type { ThreadRepository } from "../../domain/repositories/ThreadRepository";
⋮----
export class LoadThreadUseCase {
⋮----
constructor(private readonly threadRepository: ThreadRepository)
⋮----
async execute(accountId: string, threadId: string): Promise<Thread | null>
````

## File: modules/notebooklm/subdomains/conversation/application/use-cases/save-thread.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/conversation
 * Layer: application/use-cases
 *
 * SaveThreadUseCase — persists a conversation thread via the repository port.
 * Validates required fields before delegating to infrastructure.
 */
⋮----
import type { Thread } from "../../domain/entities/thread";
import type { ThreadRepository } from "../../domain/repositories/ThreadRepository";
⋮----
export class SaveThreadUseCase {
⋮----
constructor(private readonly threadRepository: ThreadRepository)
⋮----
async execute(accountId: string, thread: Thread): Promise<void>
````

## File: modules/notebooklm/subdomains/conversation/domain/events/ConversationEvents.ts
````typescript
/**
 * Module: notebooklm/subdomains/conversation
 * Layer: domain/events
 * Purpose: Domain events for conversation operations.
 */
⋮----
import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";
⋮----
export interface ThreadCreatedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.conversation.thread-created";
  readonly payload: {
    readonly threadId: string;
    readonly accountId: string;
  };
}
⋮----
export interface MessageAddedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.conversation.message-added";
  readonly payload: {
    readonly threadId: string;
    readonly messageId: string;
    readonly role: "user" | "assistant" | "system";
    readonly accountId: string;
  };
}
⋮----
export interface ThreadArchivedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.conversation.thread-archived";
  readonly payload: {
    readonly threadId: string;
    readonly accountId: string;
  };
}
````

## File: modules/notebooklm/subdomains/conversation/domain/index.ts
````typescript
/**
 * notebooklm/conversation domain — public exports.
 */
````

## File: modules/notebooklm/subdomains/conversation/domain/repositories/ThreadRepository.ts
````typescript
/**
 * modules/notebook — domain repository interface: ThreadRepository
 */
⋮----
import type { Thread } from "../entities/thread";
⋮----
export interface ThreadRepository {
  save(accountId: string, thread: Thread): Promise<void>;
  getById(accountId: string, threadId: string): Promise<Thread | null>;
}
⋮----
save(accountId: string, thread: Thread): Promise<void>;
getById(accountId: string, threadId: string): Promise<Thread | null>;
````

## File: modules/notebooklm/subdomains/notebook/api/server.ts
````typescript
/**
 * notebook subdomain — server-only API.
 *
 * Exports infrastructure implementations that depend on server-only packages.
 * Must only be imported in Server Actions, route handlers, or server-side infrastructure.
 */
````

## File: modules/notebooklm/subdomains/notebook/domain/events/NotebookEvents.ts
````typescript
/**
 * Module: notebooklm/subdomains/notebook
 * Layer: domain/events
 * Purpose: Domain events for notebook AI generation operations.
 */
⋮----
import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";
⋮----
export interface NotebookResponseGeneratedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.notebook.response-generated";
  readonly payload: {
    readonly model: string;
    readonly finishReason?: string;
  };
}
⋮----
export interface NotebookResponseFailedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.notebook.response-failed";
  readonly payload: {
    readonly errorCode: string;
    readonly errorMessage: string;
  };
}
````

## File: modules/notebooklm/subdomains/notebook/domain/ports/index.ts
````typescript
/**
 * notebooklm/notebook domain/ports — driven port interfaces for the notebook subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
````

## File: modules/notebooklm/subdomains/notebook/README.md
````markdown
# Notebook

Notebook container and organization.

## Ownership

- **Bounded Context**: notebooklm
- **Status**: Active — GenerateNotebookResponseUseCase + AiTextGenerationAdapter + Server Actions wired

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/subdomains/source/api/ui.ts
````typescript
/**
 * notebooklm/source UI surface.
 * UI consumers should import from this file instead of the semantic api barrel.
 */
````

## File: modules/notebooklm/subdomains/source/application/dto/rag-document.dto.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/dto
 * Purpose: DTOs for RagDocument registration use-case I/O.
 */
⋮----
import type { RagDocumentStatus } from "../../domain/entities/RagDocument";
⋮----
export interface RegisterUploadedRagDocumentInputDto {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly sourceFileId?: string;
  readonly title: string;
  readonly sourceFileName: string;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly sizeBytes?: number;
  readonly checksum?: string;
  readonly taxonomy?: string;
  readonly category?: string;
  readonly department?: string;
  readonly tags?: readonly string[];
  readonly language?: string;
  readonly accessControl?: readonly string[];
  readonly versionGroupId?: string;
  readonly versionNumber?: number;
  readonly updateLog?: string;
  readonly expiresAtISO?: string;
}
⋮----
export interface RegisterUploadedRagDocumentOutputDto {
  readonly documentId: string;
  readonly status: "uploaded";
  readonly registeredAtISO: string;
}
⋮----
export type RegisterUploadedRagDocumentErrorCode =
  | "RAG_ORGANIZATION_REQUIRED"
  | "RAG_WORKSPACE_REQUIRED"
  | "RAG_ACCOUNT_ID_REQUIRED"
  | "RAG_TITLE_REQUIRED"
  | "RAG_FILE_NAME_REQUIRED"
  | "RAG_MIME_TYPE_REQUIRED"
  | "RAG_STORAGE_PATH_REQUIRED";
⋮----
export type RegisterUploadedRagDocumentResult =
  | { ok: true; data: RegisterUploadedRagDocumentOutputDto; commandId: string }
  | {
      ok: false;
      error: { code: RegisterUploadedRagDocumentErrorCode; message: string };
      commandId: string;
    };
⋮----
export interface ListSourceDocumentsInputDto {
  readonly organizationId: string;
  readonly workspaceId: string;
}
⋮----
export interface SourceDocumentListItemDto {
  readonly id: string;
  readonly displayName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly status: RagDocumentStatus;
  readonly statusMessage?: string;
  readonly taxonomy?: string;
  readonly language?: string;
  readonly versionNumber: number;
  readonly isLatest: boolean;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: modules/notebooklm/subdomains/source/application/dto/source-pipeline.dto.ts
````typescript
import type {
  ParseSourceDocumentInput,
  ParseSourceDocumentOutput,
  ReindexSourceDocumentInput,
  ReindexSourceDocumentOutput,
} from "../../domain/ports/SourcePipelinePort";
⋮----
export interface SourcePipelineError {
  readonly code: "SOURCE_PIPELINE_INVALID_INPUT" | "SOURCE_PIPELINE_EXECUTION_FAILED";
  readonly message: string;
}
⋮----
export type SourcePipelineResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: SourcePipelineError };
⋮----
export type ParseSourceDocumentInputDto = ParseSourceDocumentInput;
export type ParseSourceDocumentOutputDto = ParseSourceDocumentOutput;
export type ReindexSourceDocumentInputDto = ReindexSourceDocumentInput;
export type ReindexSourceDocumentOutputDto = ReindexSourceDocumentOutput;
````

## File: modules/notebooklm/subdomains/source/application/dto/source-processing.dto.ts
````typescript
export type SourceProcessingTaskStatus = "idle" | "running" | "success" | "error" | "skipped";
⋮----
export interface SourceProcessingTaskResult {
  readonly status: SourceProcessingTaskStatus;
  readonly detail: string;
}
⋮----
export interface SourceProcessingExecutionSummary {
  readonly pageCount: number;
  readonly jsonGcsUri: string;
  readonly pageHref: string;
  readonly workflowHref: string;
  readonly taskCount: number;
  readonly parse: SourceProcessingTaskResult;
  readonly rag: SourceProcessingTaskResult;
  readonly page: SourceProcessingTaskResult;
  readonly task: SourceProcessingTaskResult;
}
⋮----
export function createIdleExecutionSummary(): SourceProcessingExecutionSummary
````

## File: modules/notebooklm/subdomains/source/application/queries/source-file.queries.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: ListSourceFilesUseCase — lists workspace files as view-model DTOs.
 */
⋮----
import type { ListSourceFilesScope } from "../../domain/repositories/SourceFileRepository";
import type { SourceFileRepository } from "../../domain/repositories/SourceFileRepository";
import type { WorkspaceFileListItemDto } from "../dto/source-file.dto";
⋮----
export class ListSourceFilesUseCase {
⋮----
constructor(private readonly fileRepository: SourceFileRepository)
⋮----
async execute(scope: ListSourceFilesScope): Promise<WorkspaceFileListItemDto[]>
````

## File: modules/notebooklm/subdomains/source/application/use-cases/delete-source-document.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: DeleteSourceDocumentUseCase — deletes a legacy source document.
 *
 * Actor: account owner
 * Goal: remove a source document from the accounts/{accountId}/documents collection.
 * Main success: document deleted, returns ok with documentId.
 * Failure: invalid input or persistence failure.
 */
⋮----
import type { SourceDocumentCommandPort } from "../../domain/ports/SourceDocumentPort";
import type { SourceFileCommandErrorCode } from "../dto/source-file.dto";
⋮----
export interface DeleteSourceDocumentInput {
  readonly accountId: string;
  readonly documentId: string;
}
⋮----
type DeleteSourceDocumentResult =
  | { ok: true; data: { documentId: string } }
  | { ok: false; error: { code: SourceFileCommandErrorCode; message: string } };
⋮----
export class DeleteSourceDocumentUseCase {
⋮----
constructor(
⋮----
async execute(input: DeleteSourceDocumentInput): Promise<DeleteSourceDocumentResult>
````

## File: modules/notebooklm/subdomains/source/application/use-cases/process-source-document-workflow.use-case.ts
````typescript
import {
  createIdleExecutionSummary,
  type SourceProcessingExecutionSummary,
} from "../dto/source-processing.dto";
import type {
  ParseSourceDocumentUseCase,
  ReindexSourceDocumentUseCase,
} from "./source-pipeline.use-cases";
import type { ParsedDocumentPort } from "../../domain/ports/ParsedDocumentPort";
import type {
  ParsedKnowledgeTaskBlock,
  TaskMaterializationWorkflowPort,
} from "../../domain/ports/TaskMaterializationWorkflowPort";
import type { CreateKnowledgeDraftFromSourceUseCase } from "./create-knowledge-draft-from-source.use-case";
⋮----
export interface ProcessSourceDocumentWorkflowInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly filename: string;
  readonly gcsUri: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly shouldRunRag: boolean;
  readonly shouldCreatePage: boolean;
  readonly shouldCreateTasks: boolean;
  readonly createdByUserId?: string | null;
}
⋮----
interface ParsedDocumentStatusPort {
  waitForParsedDocument(
    accountId: string,
    documentId: string,
  ): Promise<{ pageCount: number; jsonGcsUri: string }>;
}
⋮----
waitForParsedDocument(
    accountId: string,
    documentId: string,
): Promise<
⋮----
function toTaskBlocks(parsedText: string): ReadonlyArray<ParsedKnowledgeTaskBlock>
⋮----
export class ProcessSourceDocumentWorkflowUseCase {
⋮----
constructor(
⋮----
async execute(
    input: ProcessSourceDocumentWorkflowInput,
): Promise<SourceProcessingExecutionSummary>
````

## File: modules/notebooklm/subdomains/source/application/use-cases/rename-source-document.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: RenameSourceDocumentUseCase — renames a legacy source document.
 *
 * Actor: account owner
 * Goal: update the display name of a source document in accounts/{accountId}/documents.
 * Main success: document renamed, returns ok with documentId.
 * Failure: invalid input or persistence failure.
 */
⋮----
import type { SourceDocumentCommandPort } from "../../domain/ports/SourceDocumentPort";
import type { SourceFileCommandErrorCode } from "../dto/source-file.dto";
⋮----
export interface RenameSourceDocumentInput {
  readonly accountId: string;
  readonly documentId: string;
  readonly newName: string;
}
⋮----
type RenameSourceDocumentResult =
  | { ok: true; data: { documentId: string } }
  | { ok: false; error: { code: SourceFileCommandErrorCode; message: string } };
⋮----
export class RenameSourceDocumentUseCase {
⋮----
constructor(
⋮----
async execute(input: RenameSourceDocumentInput): Promise<RenameSourceDocumentResult>
````

## File: modules/notebooklm/subdomains/source/application/use-cases/source-pipeline.use-cases.ts
````typescript
import type { SourcePipelinePort } from "../../domain/ports/SourcePipelinePort";
import type {
  ParseSourceDocumentInputDto,
  ParseSourceDocumentOutputDto,
  ReindexSourceDocumentInputDto,
  ReindexSourceDocumentOutputDto,
  SourcePipelineResult,
} from "../dto/source-pipeline.dto";
⋮----
function isBlank(value: string): boolean
⋮----
export class ParseSourceDocumentUseCase {
⋮----
constructor(private readonly pipelinePort: SourcePipelinePort)
⋮----
async execute(
    input: ParseSourceDocumentInputDto,
): Promise<SourcePipelineResult<ParseSourceDocumentOutputDto>>
⋮----
export class ReindexSourceDocumentUseCase {
⋮----
async execute(
    input: ReindexSourceDocumentInputDto,
): Promise<SourcePipelineResult<ReindexSourceDocumentOutputDto>>
````

## File: modules/notebooklm/subdomains/source/domain/entities/RagDocument.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Aggregate: RagDocument — tracks the ingestion lifecycle of a document for RAG.
 *
 * Status transitions are strictly controlled to prevent invalid state changes
 * and ensure idempotent ingestion worker behaviour.
 */
⋮----
export type RagDocumentStatus = "uploaded" | "processing" | "ready" | "failed" | "archived";
⋮----
export function canTransitionRagDocumentStatus(
  fromStatus: RagDocumentStatus,
  toStatus: RagDocumentStatus,
): boolean
⋮----
/**
 * RAG document record stored in Firestore at:
 * /knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}
 */
export interface RagDocumentRecord {
  readonly id: string;
  readonly sourceFileId?: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly displayName: string;
  readonly title: string;
  readonly sourceFileName: string;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly sizeBytes: number;
  readonly status: RagDocumentStatus;
  readonly statusMessage?: string;
  readonly checksum?: string;
  readonly taxonomy?: string;
  readonly category?: string;
  readonly department?: string;
  readonly tags?: readonly string[];
  readonly language?: string;
  readonly accessControl?: readonly string[];
  readonly versionGroupId: string;
  readonly versionNumber: number;
  readonly isLatest: boolean;
  readonly updateLog?: string;
  readonly accountId: string;
  readonly chunkCount?: number;
  readonly indexedAtISO?: string;
  readonly expiresAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: modules/notebooklm/subdomains/source/domain/events/SourceEvents.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/events
 * Purpose: Domain events for source document lifecycle operations.
 */
⋮----
import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";
⋮----
export interface SourceFileUploadedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.source.file-uploaded";
  readonly payload: {
    readonly fileId: string;
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly accountId: string;
    readonly mimeType: string;
    readonly sizeBytes: number;
  };
}
⋮----
export interface SourceDocumentProcessedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.source.document-processed";
  readonly payload: {
    readonly fileId: string;
    readonly organizationId: string;
    readonly chunkCount: number;
  };
}
⋮----
export interface SourceDocumentDeletedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.source.document-deleted";
  readonly payload: {
    readonly fileId: string;
    readonly organizationId: string;
    readonly accountId: string;
  };
}
⋮----
export interface SourceDocumentRenamedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.source.document-renamed";
  readonly payload: {
    readonly fileId: string;
    readonly organizationId: string;
    readonly previousName: string;
    readonly newName: string;
  };
}
````

## File: modules/notebooklm/subdomains/source/domain/index.ts
````typescript
/**
 * notebooklm/source domain — public exports.
 */
````

## File: modules/notebooklm/subdomains/source/domain/ports/KnowledgePageGatewayPort.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: KnowledgePageGateway — anti-corruption layer for creating knowledge pages
 *       in the notion bounded context.
 *
 * This port isolates cross-context collaboration. Infrastructure provides
 * the adapter that delegates to notion/api; application consumes via use cases.
 */
⋮----
import type { CommandResult } from "@shared-types";
⋮----
export interface KnowledgePageGateway {
  createPage(input: {
    accountId: string;
    workspaceId: string;
    title: string;
    parentPageId: null;
    createdByUserId: string;
  }): Promise<CommandResult>;
  addBlock(input: {
    accountId: string;
    pageId: string;
    index: number;
    content: {
      type: "text";
      richText: readonly { type: string; plainText: string }[];
      properties: Record<string, unknown>;
    };
  }): Promise<CommandResult>;
}
⋮----
createPage(input: {
    accountId: string;
    workspaceId: string;
    title: string;
    parentPageId: null;
    createdByUserId: string;
  }): Promise<CommandResult>;
addBlock(input: {
    accountId: string;
    pageId: string;
    index: number;
    content: {
      type: "text";
      richText: readonly { type: string; plainText: string }[];
      properties: Record<string, unknown>;
    };
  }): Promise<CommandResult>;
````

## File: modules/notebooklm/subdomains/source/domain/ports/ParsedDocumentPort.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: ParsedDocumentPort — retrieves parsed document text from storage.
 *
 * This port isolates Firebase Storage access from interfaces.
 * Infrastructure provides the adapter; application consumes via use cases.
 */
⋮----
export interface ParsedDocumentPort {
  loadParsedDocumentText(jsonGcsUri: string): Promise<string>;
}
⋮----
loadParsedDocumentText(jsonGcsUri: string): Promise<string>;
````

## File: modules/notebooklm/subdomains/source/domain/ports/SourceDocumentWatchPort.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: SourceDocumentWatchPort — real-time document collection watching contract.
 *
 * Used by the useSourceDocumentsSnapshot hook to subscribe to document changes
 * without depending on platform infrastructure APIs directly.
 */
⋮----
export interface WatchedDocument<T> {
  readonly id: string;
  readonly path: string;
  readonly data: T;
}
⋮----
export interface SourceDocumentWatchPort {
  /** Subscribe to a Firestore collection and receive real-time updates. Returns an unsubscribe function. */
  watchCollection<T>(
    collectionPath: string,
    handlers: {
      onNext: (documents: readonly WatchedDocument<T>[]) => void;
      onError?: (error: unknown) => void;
    },
  ): () => void;
}
⋮----
/** Subscribe to a Firestore collection and receive real-time updates. Returns an unsubscribe function. */
watchCollection<T>(
    collectionPath: string,
    handlers: {
onNext: (documents: readonly WatchedDocument<T>[])
````

## File: modules/notebooklm/subdomains/source/domain/ports/SourcePipelinePort.ts
````typescript
export interface ParseSourceDocumentInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly documentId: string;
  readonly gcsUri: string;
  readonly filename: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}
⋮----
export interface ParseSourceDocumentOutput {
  readonly documentId: string;
}
⋮----
export interface ReindexSourceDocumentInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly documentId: string;
  readonly jsonGcsUri: string;
  readonly sourceGcsUri: string;
  readonly filename: string;
  readonly pageCount: number;
}
⋮----
export interface ReindexSourceDocumentOutput {
  readonly chunkCount: number;
  readonly vectorCount: number;
}
⋮----
export interface SourcePipelinePort {
  parseDocument(input: ParseSourceDocumentInput): Promise<ParseSourceDocumentOutput>;
  reindexDocument(input: ReindexSourceDocumentInput): Promise<ReindexSourceDocumentOutput>;
}
⋮----
parseDocument(input: ParseSourceDocumentInput): Promise<ParseSourceDocumentOutput>;
reindexDocument(input: ReindexSourceDocumentInput): Promise<ReindexSourceDocumentOutput>;
````

## File: modules/notebooklm/subdomains/source/domain/ports/SourceStoragePort.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: SourceStoragePort — file upload and GCS URI resolution contract.
 *
 * UI components and application services use this port instead of importing
 * platform infrastructure APIs directly, keeping the hexagonal boundary clean.
 */
⋮----
export interface SourceStorageUploadOptions {
  readonly contentType?: string;
  readonly customMetadata?: Record<string, string>;
}
⋮----
export interface SourceStoragePort {
  /** Upload a file blob to the given storage path. Returns the download URL. */
  upload(file: Blob, path: string, options?: SourceStorageUploadOptions): Promise<string>;
  /** Convert a relative storage path to a gs:// URI. */
  toGsUri(path: string): string;
}
⋮----
/** Upload a file blob to the given storage path. Returns the download URL. */
upload(file: Blob, path: string, options?: SourceStorageUploadOptions): Promise<string>;
/** Convert a relative storage path to a gs:// URI. */
toGsUri(path: string): string;
````

## File: modules/notebooklm/subdomains/source/domain/ports/TaskMaterializationWorkflowPort.ts
````typescript
import type { CommandResult } from "@shared-types";
⋮----
export interface ParsedKnowledgeTaskBlock {
  readonly blockId: string;
  readonly text: string;
  readonly pageIndex?: number;
}
⋮----
export interface ExtractedKnowledgeTask {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
}
⋮----
export interface ExtractTaskCandidatesInput {
  readonly knowledgePageId: string;
  readonly blocks: ReadonlyArray<ParsedKnowledgeTaskBlock>;
  readonly enableAiFallback?: boolean;
}
⋮----
export interface ExtractTaskCandidatesOutput {
  readonly candidates: ReadonlyArray<ExtractedKnowledgeTask>;
  readonly usedAiFallback: boolean;
}
⋮----
export interface MaterializeKnowledgeTasksInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly pageId: string;
  readonly actorId: string;
  readonly extractedTasks: ReadonlyArray<ExtractedKnowledgeTask>;
}
⋮----
export interface TaskMaterializationWorkflowPort {
  extractTaskCandidates(
    input: ExtractTaskCandidatesInput,
  ): Promise<ExtractTaskCandidatesOutput>;

  materializeKnowledgeTasks(
    input: MaterializeKnowledgeTasksInput,
  ): Promise<CommandResult>;
}
⋮----
extractTaskCandidates(
    input: ExtractTaskCandidatesInput,
  ): Promise<ExtractTaskCandidatesOutput>;
⋮----
materializeKnowledgeTasks(
    input: MaterializeKnowledgeTasksInput,
  ): Promise<CommandResult>;
````

## File: modules/notebooklm/subdomains/source/domain/repositories/RagDocumentRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/repositories
 * Port: RagDocumentRepository — persistence contract for RagDocumentRecord.
 */
⋮----
import type { RagDocumentRecord } from "../entities/RagDocument";
⋮----
export interface RagDocumentRepository {
  findByStoragePath(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly storagePath: string;
  }): Promise<RagDocumentRecord | null>;
  findByWorkspace(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly RagDocumentRecord[]>;
  saveUploaded(record: RagDocumentRecord): Promise<void>;
}
⋮----
findByStoragePath(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly storagePath: string;
  }): Promise<RagDocumentRecord | null>;
findByWorkspace(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly RagDocumentRecord[]>;
saveUploaded(record: RagDocumentRecord): Promise<void>;
````

## File: modules/notebooklm/subdomains/source/domain/repositories/WikiLibraryRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/repositories
 * Port: WikiLibraryRepository — persistence contract for WikiLibrary aggregates.
 */
⋮----
import type { WikiLibrary, WikiLibraryField, WikiLibraryRow } from "../entities/WikiLibrary";
⋮----
export interface WikiLibraryRepository {
  listByAccountId(accountId: string): Promise<WikiLibrary[]>;
  findById(accountId: string, libraryId: string): Promise<WikiLibrary | null>;
  create(library: WikiLibrary): Promise<void>;
  createField(accountId: string, field: WikiLibraryField): Promise<void>;
  listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]>;
  createRow(accountId: string, row: WikiLibraryRow): Promise<void>;
  listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]>;
}
⋮----
listByAccountId(accountId: string): Promise<WikiLibrary[]>;
findById(accountId: string, libraryId: string): Promise<WikiLibrary | null>;
create(library: WikiLibrary): Promise<void>;
createField(accountId: string, field: WikiLibraryField): Promise<void>;
listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]>;
createRow(accountId: string, row: WikiLibraryRow): Promise<void>;
listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]>;
````

## File: modules/notebooklm/subdomains/source/README.md
````markdown
# Source

Source document ingestion and reference management.

## Ownership

- **Bounded Context**: notebooklm
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces

## Scope Mapping

- Source flows receive shell-derived scope as `accountId`, `workspaceId`, and `accountType = "user" | "organization"` from upstream workspace composition.
- This subdomain derives an internal `organizationId` for organization-scoped storage and retrieval after boundary translation; it must not be documented or consumed as a shell route param.
- Personal-account scope currently maps to a synthetic internal organization token prefixed with `personal:` so source storage can remain organization-scoped without sharing namespaces with organization accounts.
- `actorAccountId` tracks the calling account scope for source workflows and remains distinct from concrete user identifiers such as `createdByUserId`.
````

## File: modules/notebooklm/subdomains/synthesis/api/ui.ts
````typescript
/**
 * notebooklm/synthesis UI surface.
 * UI consumers should import from this file instead of the semantic api barrel.
 */
````

## File: modules/notebooklm/subdomains/synthesis/application/use-cases/submit-rag-feedback.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: application/use-cases
 * Purpose: SubmitRagQueryFeedbackUseCase — persists user quality signal on
 *          a RAG answer and returns a CommandResult.
 */
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
⋮----
import type { RagQueryFeedbackRepository } from "../../domain/repositories/RagQueryFeedbackRepository";
import type { RagFeedbackRating, SubmitRagQueryFeedbackInput } from "../../domain/entities/rag-feedback.entities";
⋮----
export class SubmitRagQueryFeedbackUseCase {
⋮----
constructor(private readonly feedbackRepository: RagQueryFeedbackRepository)
⋮----
async execute(input: SubmitRagQueryFeedbackInput): Promise<CommandResult>
````

## File: modules/notebooklm/subdomains/synthesis/domain/events/EvaluationEvents.ts
````typescript
/**
 * Module: notebooklm/subdomains/evaluation
 * Layer: domain/events
 * Purpose: Domain events for evaluation/feedback operations.
 */
⋮----
import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";
import type { FeedbackRating } from "../entities/QualityFeedback";
⋮----
export interface FeedbackSubmittedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.evaluation.feedback-submitted";
  readonly payload: {
    readonly feedbackId: string;
    readonly traceId: string;
    readonly rating: FeedbackRating;
    readonly organizationId: string;
  };
}
````

## File: modules/notebooklm/subdomains/synthesis/domain/events/SynthesisPipelineDomainEvent.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/events
 * Purpose: Pipeline-level domain events for the synthesis subdomain.
 *
 * Migrated from ai/domain/events/AiDomainEvent.ts.
 * Event discriminants updated: notebooklm.ai.* → notebooklm.synthesis.*
 */
⋮----
import type { RagFeedbackRating } from "../entities/rag-feedback.entities";
import type { OrganizationScope } from "../value-objects/OrganizationScope";
import type { TopK } from "../value-objects/TopK";
⋮----
export interface SynthesisPipelineDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface RagQuerySubmittedEvent extends SynthesisPipelineDomainEvent {
  readonly type: "notebooklm.synthesis.query-submitted";
  readonly payload: {
    readonly traceId: string;
    readonly organizationId: string;
    readonly workspaceId?: string;
    readonly userQuery: string;
    readonly topK: TopK;
  };
}
⋮----
export interface RagRetrievalCompletedEvent extends SynthesisPipelineDomainEvent {
  readonly type: "notebooklm.synthesis.retrieval-completed";
  readonly payload: {
    readonly traceId: string;
    readonly chunkCount: number;
    readonly scope: OrganizationScope;
  };
}
⋮----
export interface RagAnswerGeneratedEvent extends SynthesisPipelineDomainEvent {
  readonly type: "notebooklm.synthesis.answer-generated";
  readonly payload: {
    readonly traceId: string;
    readonly model: string;
    readonly citationCount: number;
  };
}
⋮----
export interface RagFeedbackSubmittedEvent extends SynthesisPipelineDomainEvent {
  readonly type: "notebooklm.synthesis.feedback-submitted";
  readonly payload: {
    readonly traceId: string;
    readonly rating: RagFeedbackRating;
    readonly organizationId: string;
  };
}
⋮----
export type SynthesisPipelineDomainEventType =
  | RagQuerySubmittedEvent
  | RagRetrievalCompletedEvent
  | RagAnswerGeneratedEvent
  | RagFeedbackSubmittedEvent;
````

## File: modules/notebooklm/subdomains/synthesis/domain/ports/ChunkRetrievalPort.ts
````typescript
/**
 * Module: notebooklm/subdomains/retrieval
 * Layer: domain/ports
 * Purpose: ChunkRetrievalPort — output port for chunk retrieval operations.
 *
 * Migration source: ai/domain/repositories/RagRetrievalRepository.ts
 * Infrastructure adapters (Firebase, Upstash, etc.) implement this port.
 */
⋮----
import type { RetrievedChunk } from "../entities/RetrievedChunk";
⋮----
export interface RetrieveChunksInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly normalizedQuery: string;
  readonly taxonomy?: string;
  readonly topK: number;
}
⋮----
export interface ChunkRetrievalPort {
  retrieve(input: RetrieveChunksInput): Promise<readonly RetrievedChunk[]>;
}
⋮----
retrieve(input: RetrieveChunksInput): Promise<readonly RetrievedChunk[]>;
````

## File: modules/notebooklm/subdomains/synthesis/domain/ports/FeedbackPort.ts
````typescript
/**
 * Module: notebooklm/subdomains/evaluation
 * Layer: domain/ports
 * Purpose: FeedbackPort — output port for persisting quality feedback.
 *
 * Migration source: ai/domain/repositories/RagQueryFeedbackRepository.ts
 */
⋮----
import type { QualityFeedback, SubmitFeedbackInput } from "../entities/QualityFeedback";
⋮----
export interface FeedbackPort {
  save(input: SubmitFeedbackInput): Promise<QualityFeedback>;
  listByOrganization(organizationId: string, limitCount: number): Promise<QualityFeedback[]>;
}
⋮----
save(input: SubmitFeedbackInput): Promise<QualityFeedback>;
listByOrganization(organizationId: string, limitCount: number): Promise<QualityFeedback[]>;
````

## File: modules/notebooklm/subdomains/synthesis/domain/ports/VectorStore.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/ports
 * Purpose: VectorStore — hexagonal output port for vector database operations.
 *
 * Design notes:
 * - Domain owns this interface; infrastructure implements it.
 * - No SDK-specific types leak through this boundary.
 * - Embedding computation is the adapter's responsibility, not the port's.
 */
⋮----
/** A document to index in the vector store */
export interface VectorDocument {
  readonly id: string;
  readonly content: string;
  readonly metadata?: Record<string, string | number | boolean>;
}
⋮----
/** A result from a similarity search */
export interface VectorSearchResult {
  readonly id: string;
  /** Similarity score in [0, 1]; higher is closer */
  readonly score: number;
  readonly metadata?: Record<string, string | number | boolean>;
}
⋮----
/** Similarity score in [0, 1]; higher is closer */
⋮----
/**
 * Output port for any vector-store adapter (Upstash Vector, Pinecone, etc.).
 * Domain and application layers depend only on this interface.
 */
export interface VectorStore {
  /** Insert or update documents; adapter handles embedding generation */
  upsert(documents: VectorDocument[]): Promise<void>;

  /**
   * Find the top-k documents most similar to the query.
   * @param query  - Natural-language query string
   * @param k      - Number of results to return
   * @param filter - Optional metadata predicate
   */
  search(
    query: string,
    k: number,
    filter?: Record<string, string | number | boolean>,
  ): Promise<VectorSearchResult[]>;

  /** Remove documents by ID */
  delete(ids: string[]): Promise<void>;
}
⋮----
/** Insert or update documents; adapter handles embedding generation */
upsert(documents: VectorDocument[]): Promise<void>;
⋮----
/**
   * Find the top-k documents most similar to the query.
   * @param query  - Natural-language query string
   * @param k      - Number of results to return
   * @param filter - Optional metadata predicate
   */
search(
    query: string,
    k: number,
    filter?: Record<string, string | number | boolean>,
  ): Promise<VectorSearchResult[]>;
⋮----
/** Remove documents by ID */
delete(ids: string[]): Promise<void>;
````

## File: modules/notebooklm/subdomains/synthesis/domain/repositories/KnowledgeContentRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/repositories
 * Purpose: KnowledgeContentRepository — output port for knowledge corpus RAG
 *          operations (run query, reindex, list parsed documents).
 *
 * Design notes:
 * - Knowledge content refers to the knowledge artifact corpus used for RAG retrieval.
 * - Firebase Functions back-end implements this port; the domain remains clean.
 */
⋮----
export interface KnowledgeCitation {
  provider?: "vector" | "search";
  chunk_id?: string;
  doc_id?: string;
  filename?: string;
  json_gcs_uri?: string;
  search_id?: string;
  score?: number;
  text?: string;
  account_id?: string;
  workspace_id?: string;
  taxonomy?: string;
  processing_status?: string;
  indexed_at?: string;
}
⋮----
export interface KnowledgeRagQueryResult {
  readonly answer: string;
  readonly citations: readonly KnowledgeCitation[];
  readonly cache: "hit" | "miss";
  readonly vectorHits: number;
  readonly searchHits: number;
  readonly accountScope: string;
  readonly workspaceScope?: string;
  readonly taxonomyFilters?: string[];
  readonly maxAgeDays?: number;
  readonly requireReady?: boolean;
}
⋮----
export interface KnowledgeParsedDocument {
  readonly id: string;
  readonly filename: string;
  readonly workspaceId: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
  readonly status: string;
  readonly ragStatus: string;
  readonly uploadedAt: Date | null;
}
⋮----
export interface KnowledgeReindexInput {
  readonly accountId: string;
  readonly docId: string;
  readonly jsonGcsUri: string;
  readonly sourceGcsUri: string;
  readonly filename: string;
  readonly pageCount: number;
}
⋮----
export interface KnowledgeContentRepository {
  runRagQuery(
    query: string,
    accountId: string,
    workspaceId: string,
    topK: number,
    options?: {
      taxonomyFilters?: string[];
      maxAgeDays?: number;
      requireReady?: boolean;
    },
  ): Promise<KnowledgeRagQueryResult>;
  reindexDocument(input: KnowledgeReindexInput): Promise<void>;
  listParsedDocuments(accountId: string, limitCount: number): Promise<KnowledgeParsedDocument[]>;
}
⋮----
runRagQuery(
    query: string,
    accountId: string,
    workspaceId: string,
    topK: number,
    options?: {
      taxonomyFilters?: string[];
      maxAgeDays?: number;
      requireReady?: boolean;
    },
  ): Promise<KnowledgeRagQueryResult>;
reindexDocument(input: KnowledgeReindexInput): Promise<void>;
listParsedDocuments(accountId: string, limitCount: number): Promise<KnowledgeParsedDocument[]>;
````

## File: modules/notebooklm/subdomains/synthesis/domain/repositories/RagGenerationRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/repositories
 * Purpose: RagGenerationRepository — output port for AI answer generation.
 *
 * Domain owns this contract; the platform-delegating adapter (infrastructure) implements it.
 */
⋮----
import type { GenerateRagAnswerInput, GenerateRagAnswerResult } from "../entities/generation.entities";
⋮----
export interface RagGenerationRepository {
  generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult>;
}
⋮----
generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult>;
````

## File: modules/notebooklm/subdomains/synthesis/domain/repositories/RagQueryFeedbackRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/repositories
 * Purpose: RagQueryFeedbackRepository — output port for persisting feedback.
 */
⋮----
import type { RagQueryFeedback, SubmitRagQueryFeedbackInput } from "../entities/rag-feedback.entities";
⋮----
export interface RagQueryFeedbackRepository {
  save(input: SubmitRagQueryFeedbackInput): Promise<RagQueryFeedback>;
  listByOrganization(organizationId: string, limitCount: number): Promise<RagQueryFeedback[]>;
}
⋮----
save(input: SubmitRagQueryFeedbackInput): Promise<RagQueryFeedback>;
listByOrganization(organizationId: string, limitCount: number): Promise<RagQueryFeedback[]>;
````

## File: modules/notebooklm/subdomains/synthesis/domain/repositories/RagRetrievalRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/repositories
 * Purpose: RagRetrievalRepository — output port for chunk retrieval.
 *
 * Design notes:
 * - The domain defines the contract; Firebase / Upstash / etc. implement it.
 * - Retrieval is scoped to organization or workspace to enforce tenancy isolation.
 */
⋮----
import type { RagRetrievedChunk } from "../entities/retrieval.entities";
⋮----
export interface RetrieveChunksInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly normalizedQuery: string;
  readonly taxonomy?: string;
  readonly topK: number;
}
⋮----
export interface RagRetrievalRepository {
  retrieve(input: RetrieveChunksInput): Promise<readonly RagRetrievedChunk[]>;
}
⋮----
retrieve(input: RetrieveChunksInput): Promise<readonly RagRetrievedChunk[]>;
````

## File: modules/notebooklm/subdomains/synthesis/domain/services/CitationBuilder.ts
````typescript
/**
 * Module: notebooklm/subdomains/grounding
 * Layer: domain/services
 * Purpose: CitationBuilder — domain service interface for constructing citations
 *          from retrieved chunks and generated answers.
 *
 * Migration source: ai/domain/services/RagCitationBuilder.ts
 */
⋮----
import type { Citation } from "../entities/GroundingEvidence";
⋮----
export interface CitationBuilderInput {
  readonly answer: string;
  readonly chunks: readonly {
    readonly docId: string;
    readonly chunkIndex: number;
    readonly page?: number;
    readonly text: string;
    readonly score: number;
  }[];
}
⋮----
export interface CitationBuilder {
  build(input: CitationBuilderInput): readonly Citation[];
}
⋮----
build(input: CitationBuilderInput): readonly Citation[];
````

## File: modules/notebooklm/AGENT.md
````markdown
# NotebookLM Agent

> Strategic agent documentation: [docs/contexts/notebooklm/AGENT.md](../../docs/contexts/notebooklm/AGENT.md)

## Mission

保護 notebooklm 主域作為對話、來源處理與推理輸出的邊界。notebooklm 擁有衍生推理流程，不擁有正典知識內容。任何變更都應維持 notebooklm 擁有對話生命週期、來源管理與 RAG pipeline 語言，而不是吸收平台治理或正典知識語言。

## Bounded Context Summary

| Aspect | Description |
|--------|-------------|
| Primary role | 對話、來源處理與推理輸出 |
| Upstream | platform（治理）、ai（shared AI capability）、workspace（scope）、notion（knowledge artifact reference） |
| Downstream | 無固定主域級下游；輸出可被其他主域吸收 |
| Core invariant | notebooklm 只能持有衍生推理輸出，不得直接修改 notion 的正典內容 |
| Published language | Notebook reference、Conversation reference、SourceReference、GroundedAnswer |

## Bounded Contexts

| Cluster | Subdomains | Responsibility |
|---------|------------|----------------|
| Interaction Core | notebook, conversation | 對話容器與互動生命週期 |
| Source & RAG Pipeline | source, synthesis | 來源管理與完整 RAG pipeline（retrieval → grounding → synthesis → evaluation） |

## Route Here When

- 問題核心是 notebook、conversation、source、synthesis（RAG pipeline）。
- 問題需要處理引用對齊、來源可追溯、模型輸出品質或衍生筆記。
- 問題要把知識來源（notion artifact、uploaded file）轉成可對話與可綜合的推理材料。
- 問題涉及 RAG 問答、向量檢索、chunks 召回、generation 品質。
- 問題涉及 evaluation、品質評估、回歸比較或 grounding 可信度。

## Route Elsewhere When

- 正典知識頁面、文章、分類、正式發布屬於 notion。
- 身份、授權、權益、憑證治理屬於 platform。
- 共享 AI provider、模型政策、配額與安全護欄屬於 ai。
- 工作區生命週期、成員管理、共享範圍屬於 workspace。
- browser-facing shell composition、tab orchestration、panel assembly 屬於 workspace；notebooklm 提供下游能力，不擁有外層 UI orchestration。

## Subdomains

| Subdomain | Purpose | Key Aggregates / Entities |
|-----------|---------|---------------------------|
| conversation | 對話 Thread 與 Message 生命週期管理 | Thread, Message |
| notebook | Notebook 容器組合與 GenKit 回應生成 | AgentGeneration, NotebookRepository |
| source | 來源文件匯入生命週期、RagDocument 狀態機、WikiLibrary、ingestion 編排 | SourceFile, SourceFileVersion, RagDocument, WikiLibrary, SourceRetentionPolicy |
| synthesis | 完整 RAG pipeline：retrieval、grounding、synthesis、evaluation | AnswerRagQueryUseCase, RagScoringService, RagCitationBuilder, RagPromptBuilder |

### Future Split Triggers

`synthesis` 子域將四個 RAG 關注點作為內部 facets 持有。只有當以下觸發條件成立時，才拆分為獨立子域：

| Facet | Split Trigger |
|-------|---------------|
| retrieval | 策略複雜到需要獨立領域模型（多重排序、hybrid search） |
| grounding | 引用追溯需要獨立聚合根（citation chains、evidence alignment） |
| generation | 生成策略需要獨立 use case 群（多模態、多來源融合） |
| evaluation | 品質語言需要獨立指標模型（回歸測試、benchmark suite） |

### Domain Invariants

- notebooklm 只擁有衍生推理流程，不擁有正典知識內容。
- shared AI capability 由 ai 提供；notebooklm 在 synthesis 擁有 retrieval、grounding、generation、evaluation 的本地語義。
- grounding 應能把輸出對齊到來源證據。
- retrieval 是 generation 的上游能力。
- evaluation 應描述品質，而不是單純使用量。
- 任何要成為正式知識內容的輸出，都必須交由 notion 吸收。

## Ubiquitous Language

| Term | Meaning | Owning Subdomain | Do Not Use |
|------|---------|------------------|------------|
| Notebook | 聚合對話、來源與衍生筆記的工作單位 | notebook | Project, Workspace |
| AgentGeneration | GenKit 代理回應生成 | notebook | - |
| Conversation | Notebook 內的對話執行邊界 | conversation | Chat, Session |
| Thread | 一段對話的容器 | conversation | - |
| Message | 一則輸入或輸出對話項 | conversation | Turn, Exchange |
| Source | 被引用與推理的來源材料 | source | File, Document (generic) |
| SourceFile | 使用者上傳的原始檔案 | source | - |
| RagDocument | 來源文件在 RAG pipeline 中的表示 | source | - |
| WikiLibrary | 結構化知識來源庫 | source | - |
| Ingestion | 來源匯入、正規化與前處理流程 | source | File Import, Upload |
| Retrieval | 從來源中召回候選片段的查詢能力 | synthesis | Search, Lookup |
| Grounding | 把輸出對齊到來源證據的能力 | synthesis | Verification, Factcheck |
| Citation | 輸出指回來源證據的引用關係 | synthesis | Reference, Link |
| Synthesis | 綜合多來源後生成的衍生輸出 | synthesis | Answer, Response (generic) |
| Evaluation | 對輸出品質、回歸結果與效果的評估 | synthesis | Analytics, Metrics (generic) |
| RelevanceScore | 檢索結果的相關性分數 | synthesis | - |

### Avoid

| Avoid | Use Instead |
|-------|-------------|
| Chat | Conversation |
| File Import | Ingestion |
| Search Step | Retrieval |
| Verified Answer | Grounded Synthesis |
| Knowledge / Wiki | Synthesis output（正典知識屬 notion） |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
api/ ← 唯一跨模組入口
```

## Scope And Identifier Contract

- Treat `accountId` as account scope and `workspaceId` as workspace scope supplied by workspace-owned composition; notebooklm does not own top-level shell routing.
- Canonical shell navigation remains `/{accountId}/{workspaceId}` when notebooklm panels are composed inside workspace flows.
- `organizationId` belongs to notebooklm source/synthesis internal organization-scoped storage and retrieval contracts; it is derived after boundary translation and must not be treated as a shell route param.
- `actorAccountId` or `createdByUserId` remain distinct from `organizationId`; do not collapse account scope, acting user, and internal org-scoped storage identity into one identifier.

## Development Order (Domain-First)

1. Define Domain (entities, value objects, aggregates, events)
2. Define Application (use cases, DTOs)
3. Define Ports (only if boundary isolation needed)
4. Implement Infrastructure (adapters, persistence)
5. Implement Interfaces (UI, actions, hooks)
````

## File: modules/notebooklm/docs/README.md
````markdown
# NotebookLM Documentation

Implementation-level documentation for the notebooklm bounded context.

## Strategic Documentation (Authority)

Strategic architecture documentation lives in `docs/contexts/notebooklm/`:

- [README.md](../../../docs/contexts/notebooklm/README.md) — Context overview
- [subdomains.md](../../../docs/contexts/notebooklm/subdomains.md) — Subdomain inventory
- [bounded-contexts.md](../../../docs/contexts/notebooklm/bounded-contexts.md) — Ownership map
- [context-map.md](../../../docs/contexts/notebooklm/context-map.md) — Relationships
- [ubiquitous-language.md](../../../docs/contexts/notebooklm/ubiquitous-language.md) — Terminology

## Architecture Reference

- [Bounded Context Template](../../../docs/bounded-context-subdomain-template.md) — Standard structure
- [Architecture Overview](../../../docs/architecture-overview.md) — System-wide architecture
- [Integration Guidelines](../../../docs/integration-guidelines.md) — Cross-context rules

## Current Sync Points

- Workspace route authority stays outside notebooklm: when local implementation docs mention shell-facing navigation, point to the canonical workspace route `/{accountId}/{workspaceId}` owned by workspace composition.
- Identifier authority must remain explicit: `accountId` is account scope, `workspaceId` is workspace scope, `organizationId` is an internal organization-scoped token for source/synthesis flows, and it must not be documented as a shell route param.
- If notebooklm implementation notes mention AI, keep ownership aligned with the root baseline: the AI context owns shared AI capability; notebooklm owns local retrieval, grounding, synthesis, and evaluation language.
- System-wide baseline remains the root architecture set: Hexagonal + DDD, Firebase serverless backend, Genkit orchestration, Zustand/XState frontend state, and Zod runtime validation.

## Conflict Resolution

- Strategic docs in `docs/contexts/notebooklm/` are the authority for naming, ownership, and boundaries.
- This `docs/` folder is for implementation-aligned detail only.
````

## File: modules/notebooklm/infrastructure/conversation/firebase/FirebaseThreadRepository.ts
````typescript
/**
 * Module: notebooklm/conversation
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/threads/{threadId}
 *
 * Persists Thread (messages array) to Firestore so conversations survive page reload.
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import type { Thread } from "../../../subdomains/conversation/domain/entities/thread";
import type { Message } from "../../../subdomains/conversation/domain/entities/message";
import type { ThreadRepository } from "../../../subdomains/conversation/domain/repositories/ThreadRepository";
⋮----
function threadPath(accountId: string, threadId: string): string
⋮----
function toMessage(m: Record<string, unknown>): Message
⋮----
function toThread(id: string, data: Record<string, unknown>): Thread
⋮----
export class FirebaseThreadRepository implements ThreadRepository {
⋮----
async save(accountId: string, thread: Thread): Promise<void>
⋮----
async getById(accountId: string, threadId: string): Promise<Thread | null>
````

## File: modules/notebooklm/infrastructure/source/firebase/FirebaseParsedDocumentAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseParsedDocumentAdapter — Firebase Storage implementation of ParsedDocumentPort.
 *
 * Reads parsed JSON from a GCS URI and extracts the text content.
 */
⋮----
import { storageInfrastructureApi } from "@/modules/platform/api/infrastructure";
⋮----
import type { ParsedDocumentPort } from "../../../subdomains/source/domain/ports/ParsedDocumentPort";
⋮----
function asRecord(value: unknown): Record<string, unknown>
⋮----
function asString(value: unknown, fallback = ""): string
⋮----
function resolveStoragePathFromGsUri(input: string): string
⋮----
export class FirebaseParsedDocumentAdapter implements ParsedDocumentPort {
⋮----
async loadParsedDocumentText(jsonGcsUri: string): Promise<string>
````

## File: modules/notebooklm/infrastructure/source/firebase/FirebaseSourceDocumentCommandAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseSourceDocumentCommandAdapter — Firestore implementation of SourceDocumentCommandPort.
 *
 * Collection path: accounts/{accountId}/documents/{documentId}
 * This is a legacy collection; new data should use the workspaceFiles collection.
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
⋮----
import type { SourceDocumentCommandPort } from "../../../subdomains/source/domain/ports/SourceDocumentPort";
⋮----
export class FirebaseSourceDocumentCommandAdapter implements SourceDocumentCommandPort {
⋮----
async deleteDocument(accountId: string, documentId: string): Promise<void>
⋮----
async renameDocument(accountId: string, documentId: string, newName: string): Promise<void>
````

## File: modules/notebooklm/infrastructure/source/firebase/FirebaseWikiLibraryAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseWikiLibraryAdapter — Firestore implementation of WikiLibraryRepository.
 *
 * Paths:
 *   accounts/{accountId}/wikiLibraries/{libraryId}
 *   accounts/{accountId}/wikiLibraries/{libraryId}/fields/{fieldId}
 *   accounts/{accountId}/wikiLibraries/{libraryId}/rows/{rowId}
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
⋮----
import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryFieldType,
  WikiLibraryRow,
  WikiLibraryStatus,
} from "../../../subdomains/source/domain/entities/WikiLibrary";
import type { WikiLibraryRepository } from "../../../subdomains/source/domain/repositories/WikiLibraryRepository";
⋮----
// ── Firestore shapes (ISO strings; no Timestamp to avoid serialisation issues)
⋮----
interface FsLibrary {
  accountId: string;
  workspaceId?: string;
  name: string;
  slug: string;
  status: WikiLibraryStatus;
  createdAtISO: string;
  updatedAtISO: string;
}
⋮----
interface FsField {
  libraryId: string;
  key: string;
  label: string;
  type: WikiLibraryFieldType;
  required: boolean;
  options?: string[];
  createdAtISO: string;
}
⋮----
interface FsRow {
  libraryId: string;
  values: Record<string, unknown>;
  createdAtISO: string;
  updatedAtISO: string;
}
⋮----
function libraryCollectionPath(accountId: string): string
⋮----
function libraryDocumentPath(accountId: string, libraryId: string): string
⋮----
function fieldCollectionPath(accountId: string, libraryId: string): string
⋮----
function fieldDocumentPath(accountId: string, libraryId: string, fieldId: string): string
⋮----
function rowCollectionPath(accountId: string, libraryId: string): string
⋮----
function rowDocumentPath(accountId: string, libraryId: string, rowId: string): string
⋮----
// ── Mappers ───────────────────────────────────────────────────────────────────
⋮----
function toLibrary(id: string, data: FsLibrary): WikiLibrary
⋮----
function toField(id: string, data: FsField): WikiLibraryField
⋮----
function toRow(id: string, data: FsRow): WikiLibraryRow
⋮----
// ── Implementation ────────────────────────────────────────────────────────────
⋮----
export class FirebaseWikiLibraryAdapter implements WikiLibraryRepository {
⋮----
async listByAccountId(accountId: string): Promise<WikiLibrary[]>
⋮----
async findById(accountId: string, libraryId: string): Promise<WikiLibrary | null>
⋮----
async create(library: WikiLibrary): Promise<void>
⋮----
async createField(accountId: string, field: WikiLibraryField): Promise<void>
⋮----
async listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]>
⋮----
async createRow(accountId: string, row: WikiLibraryRow): Promise<void>
⋮----
async listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]>
````

## File: modules/notebooklm/infrastructure/source/platform/PlatformSourceDocumentWatchAdapter.ts
````typescript
/**
 * Module: notebooklm
 * Layer: infrastructure/source/platform
 * Adapter: PlatformSourceDocumentWatchAdapter — delegates to platform FirestoreAPI.
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
⋮----
import type {
  SourceDocumentWatchPort,
  WatchedDocument,
} from "../../../subdomains/source/domain/ports/SourceDocumentWatchPort";
⋮----
export class PlatformSourceDocumentWatchAdapter implements SourceDocumentWatchPort {
⋮----
watchCollection<T>(
    collectionPath: string,
    handlers: {
onNext: (documents: readonly WatchedDocument<T>[])
````

## File: modules/notebooklm/infrastructure/source/platform/PlatformSourcePipelineAdapter.ts
````typescript
import { functionsInfrastructureApi } from "@/modules/platform/api/infrastructure";
⋮----
import type {
  SourcePipelinePort,
  ParseSourceDocumentInput,
  ParseSourceDocumentOutput,
  ReindexSourceDocumentInput,
  ReindexSourceDocumentOutput,
} from "../../../subdomains/source/domain/ports/SourcePipelinePort";
⋮----
function asRecord(value: unknown): Record<string, unknown>
⋮----
function asString(value: unknown, fallback = ""): string
⋮----
function asNumber(value: unknown, fallback = 0): number
⋮----
export class PlatformSourcePipelineAdapter implements SourcePipelinePort {
⋮----
async parseDocument(input: ParseSourceDocumentInput): Promise<ParseSourceDocumentOutput>
⋮----
async reindexDocument(input: ReindexSourceDocumentInput): Promise<ReindexSourceDocumentOutput>
````

## File: modules/notebooklm/infrastructure/source/platform/PlatformSourceStorageAdapter.ts
````typescript
/**
 * Module: notebooklm
 * Layer: infrastructure/source/platform
 * Adapter: PlatformSourceStorageAdapter — delegates to platform StorageAPI.
 */
⋮----
import { storageInfrastructureApi } from "@/modules/platform/api/infrastructure";
⋮----
import type {
  SourceStoragePort,
  SourceStorageUploadOptions,
} from "../../../subdomains/source/domain/ports/SourceStoragePort";
⋮----
export class PlatformSourceStorageAdapter implements SourceStoragePort {
⋮----
async upload(
    file: Blob,
    path: string,
    options?: SourceStorageUploadOptions,
): Promise<string>
⋮----
toGsUri(path: string): string
````

## File: modules/notebooklm/infrastructure/synthesis/firebase/FirebaseKnowledgeContentAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: infrastructure/firebase
 * Purpose: FirebaseKnowledgeContentAdapter — implements KnowledgeContentRepository via
 *          Firebase Functions calls (RAG query, reindex) and Firestore reads
 *          (list parsed documents).
 *
 * Design notes:
 * - All external shape normalisation happens here; domain types stay clean.
 * - Functions region is configured as a constant; change here only if region changes.
 */
⋮----
import {
  firestoreInfrastructureApi,
  functionsInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
⋮----
import type {
  KnowledgeContentRepository,
  KnowledgeCitation,
  KnowledgeParsedDocument,
  KnowledgeRagQueryResult,
  KnowledgeReindexInput,
} from "../../../subdomains/synthesis/domain/repositories/KnowledgeContentRepository";
⋮----
// --- Firestore / Functions response normalisation helpers ---------------------
⋮----
function isRecord(value: unknown): value is Record<string, unknown>
⋮----
function objectOrEmpty(value: unknown): Record<string, unknown>
⋮----
function toNumberOrDefault(value: unknown, fallback = 0): number
⋮----
function toDateOrNull(value: unknown): Date | null
⋮----
function normaliseCitations(raw: unknown): KnowledgeCitation[]
⋮----
function resolveFilename(data: Record<string, unknown>): string
⋮----
function mapToParsedDocument(id: string, data: Record<string, unknown>): KnowledgeParsedDocument
⋮----
// --- Adapter ------------------------------------------------------------------
⋮----
export class FirebaseKnowledgeContentAdapter implements KnowledgeContentRepository {
⋮----
async runRagQuery(
    query: string,
    accountId: string,
    workspaceId: string,
    topK: number,
    options: {
      taxonomyFilters?: string[];
      maxAgeDays?: number;
      requireReady?: boolean;
    } = {},
): Promise<KnowledgeRagQueryResult>
⋮----
async reindexDocument(input: KnowledgeReindexInput): Promise<void>
⋮----
async listParsedDocuments(accountId: string, limitCount: number): Promise<KnowledgeParsedDocument[]>
````

## File: modules/notebooklm/infrastructure/synthesis/firebase/FirebaseRagQueryFeedbackAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: infrastructure/firebase
 * Purpose: FirebaseRagQueryFeedbackAdapter — implements RagQueryFeedbackRepository
 *          using Firestore (client SDK) for feedback persistence.
 *
 * Firestore collection: ragQueryFeedback/{autoId}
 */
⋮----
import { v7 as generateId } from "@lib-uuid";
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
⋮----
import type { RagQueryFeedbackRepository } from "../../../subdomains/synthesis/domain/repositories/RagQueryFeedbackRepository";
import type {
  RagQueryFeedback,
  SubmitRagQueryFeedbackInput,
} from "../../../subdomains/synthesis/domain/entities/rag-feedback.entities";
⋮----
interface FirestoreFeedbackDoc {
  readonly id: string;
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: string;
  readonly comment?: string;
  readonly submittedByUserId: string;
  readonly submittedAtISO: string;
}
⋮----
export class FirebaseRagQueryFeedbackAdapter implements RagQueryFeedbackRepository {
⋮----
async save(input: SubmitRagQueryFeedbackInput): Promise<RagQueryFeedback>
⋮----
async listByOrganization(organizationId: string, limitCount: number): Promise<RagQueryFeedback[]>
````

## File: modules/notebooklm/infrastructure/synthesis/firebase/FirebaseRagRetrievalAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: infrastructure/firebase
 * Purpose: FirebaseRagRetrievalAdapter — implements RagRetrievalRepository
 *          using Firestore collectionGroup queries for document-scoped chunks.
 *
 * Retrieval strategy:
 *  1. Over-fetch candidate documents (filtered by org / workspace / taxonomy / status=ready).
 *  2. Over-fetch candidate chunks in the same scope.
 *  3. Compute a token-overlap relevance score (CJK-aware tokeniser).
 *  4. Filter to chunks whose parent doc is in the ready-document set.
 *  5. Sort descending by score, return top-K.
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
⋮----
import type { RagRetrievedChunk } from "../../../subdomains/synthesis/domain/entities/retrieval.entities";
import type { RagRetrievalRepository, RetrieveChunksInput } from "../../../subdomains/synthesis/domain/repositories/RagRetrievalRepository";
⋮----
// --- Firestore document shapes -----------------------------------------------
⋮----
interface FirestoreRagDocument {
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly status?: string;
  readonly taxonomy?: string;
}
⋮----
interface FirestoreRagChunk {
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly docId?: string;
  readonly text?: string;
  readonly taxonomy?: string;
  readonly page?: number;
  readonly chunkIndex?: number;
}
⋮----
// --- Retrieval tuning constants -----------------------------------------------
⋮----
// --- Scoring helpers (pure functions, no state) --------------------------------
⋮----
/** CJK-aware whitespace / punctuation tokeniser */
function tokenize(value: string): readonly string[]
⋮----
/**
 * Token-overlap score between query and chunk text.
 * Returns a value in [0, 1] — fraction of query tokens found in the chunk.
 */
function computeTokenOverlapScore(queryTokens: readonly string[], chunkText: string): number
⋮----
// --- Adapter ------------------------------------------------------------------
⋮----
export class FirebaseRagRetrievalAdapter implements RagRetrievalRepository {
⋮----
async retrieve(input: RetrieveChunksInput): Promise<readonly RagRetrievedChunk[]>
⋮----
// Step 1 — resolve ready document IDs in scope
⋮----
// Step 2 — over-fetch candidate chunks
⋮----
// Step 3 — score, filter, sort, slice
````

## File: modules/notebooklm/interfaces/conversation/_actions/chat.actions.ts
````typescript
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../../subdomains/notebook/api";
import {
  GenerateNotebookResponseUseCase,
  AiTextGenerationAdapter,
} from "../../../subdomains/notebook/api/server";
import { saveThread, loadThread } from "./thread.actions";
⋮----
export async function sendChatMessage(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult>
````

## File: modules/notebooklm/interfaces/source/_actions/source-processing.actions.ts
````typescript
import type { CommandResult } from "@shared-types";
⋮----
import { makeSourceUseCases } from "../composition/use-cases";
import type { SourceProcessingExecutionSummary } from "../../../subdomains/source/application/dto/source-processing.dto";
⋮----
interface CreateKnowledgeDraftFromSourceDocumentInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
  readonly filename: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
}
⋮----
interface ProcessSourceDocumentWorkflowActionInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly filename: string;
  readonly gcsUri: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly shouldRunRag: boolean;
  readonly shouldCreatePage: boolean;
  readonly shouldCreateTasks: boolean;
  readonly createdByUserId?: string | null;
}
⋮----
export async function createKnowledgeDraftFromSourceDocument(
  input: CreateKnowledgeDraftFromSourceDocumentInput,
): Promise<CommandResult>
⋮----
export async function processSourceDocumentWorkflow(
  input: ProcessSourceDocumentWorkflowActionInput,
): Promise<SourceProcessingExecutionSummary>
````

## File: modules/notebooklm/interfaces/source/components/FileProcessingDialog.tsx
````typescript
import { useState } from "react";
import Link from "next/link";
⋮----
import { useAuth } from "@/modules/iam/api";
import { Button } from "@ui-shadcn/ui/button";
⋮----
import { processSourceDocumentWorkflow } from "../_actions/source-processing.actions";
import { FileProcessingDialogBody } from "./file-processing-dialog.body";
import { FileProcessingDialogSurface } from "./file-processing-dialog.surface";
import {
  createIdleSummary,
  type ExecutionSummary,
} from "./file-processing-dialog.utils";
⋮----
interface FileProcessingDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly accountId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly filename: string;
  readonly gcsUri: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}
⋮----
type DialogStep = "decide" | "select" | "executing" | "done";
⋮----
function handleOpenChange(nextOpen: boolean)
⋮----
function handleShouldCreatePageChange(nextChecked: boolean)
⋮----
function handleShouldCreateTasksChange(nextChecked: boolean)
⋮----
async function handleExecute()
⋮----
<Button onClick=
````

## File: modules/notebooklm/interfaces/source/components/SourceDocumentsPanel.tsx
````typescript
import { v4 as uuid } from "@lib-uuid";
import { useRef, useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
⋮----
import { useApp } from "@/modules/platform/api/ui";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
⋮----
import type { SourceLiveDocument } from "../hooks/useSourceDocumentsSnapshot";
import { useSourceDocumentsSnapshot } from "../hooks/useSourceDocumentsSnapshot";
import { deleteSourceDocument, renameSourceDocument } from "../_actions/source-file.actions";
import { makeSourceStorageAdapter } from "../composition/adapters";
⋮----
interface SourceDocumentsPanelProps {
  readonly workspaceId?: string;
}
⋮----
/** Upload dropzone + real-time document list backed by Firebase onSnapshot. */
⋮----
function handleFileChange(file: File | null)
⋮----
async function handleUpload()
⋮----
async function handleDelete(doc: SourceLiveDocument)
⋮----
async function handleRename(doc: SourceLiveDocument, newName: string)
````

## File: modules/notebooklm/interfaces/source/composition/wiki-library-facade.ts
````typescript
/**
 * Composition: wiki-library-facade
 *
 * Pre-wired facade functions for wiki library use cases.
 * Encapsulates the lazy singleton repository pattern so the subdomain
 * api/index.ts can re-export clean function signatures without importing
 * infrastructure directly.
 */
⋮----
import type { WikiLibraryRepository } from "../../../subdomains/source/domain/repositories/WikiLibraryRepository";
import {
  listWikiLibraries as _listWikiLibraries,
  createWikiLibrary as _createWikiLibrary,
  addWikiLibraryField as _addWikiLibraryField,
  createWikiLibraryRow as _createWikiLibraryRow,
  getWikiLibrarySnapshot as _getWikiLibrarySnapshot,
} from "../../../subdomains/source/application/use-cases/wiki-library.use-cases";
import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
  CreateWikiLibraryInput,
  AddWikiLibraryFieldInput,
  CreateWikiLibraryRowInput,
} from "../../../subdomains/source/application/dto/source.dto";
import { makeWikiLibraryAdapter } from "./adapters";
⋮----
// Lazy singleton — no module-scope side effects.
⋮----
function getLibraryRepo(): WikiLibraryRepository
⋮----
export function listWikiLibraries(accountId: string, workspaceId?: string): Promise<WikiLibrary[]>
⋮----
export function createWikiLibrary(input: CreateWikiLibraryInput): Promise<WikiLibrary>
⋮----
export function addWikiLibraryField(input: AddWikiLibraryFieldInput): Promise<WikiLibraryField>
⋮----
export function createWikiLibraryRow(input: CreateWikiLibraryRowInput): Promise<WikiLibraryRow>
⋮----
export function getWikiLibrarySnapshot(
  accountId: string,
  libraryId: string,
): ReturnType<typeof _getWikiLibrarySnapshot>
````

## File: modules/notebooklm/interfaces/source/composition/workspace-files.facade.ts
````typescript
import { uploadCompleteFile, uploadInitFile } from "../_actions/source-file.actions";
import { makeSourceStorageAdapter } from "./adapters";
import { resolveSourceOrganizationId } from "../../../subdomains/source/application/dto/source.dto";
⋮----
export interface UploadWorkspaceSourceFileInput {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly accountType: "user" | "organization";
  readonly file: File;
  readonly displayName?: string;
}
⋮----
export interface UploadWorkspaceSourceFileResult {
  readonly success: boolean;
  readonly sourceFileId?: string;
  readonly filename?: string;
  readonly gcsUri?: string;
  readonly mimeType?: string;
  readonly sizeBytes?: number;
  readonly error?: { readonly message: string };
}
⋮----
export async function uploadWorkspaceSourceFile(
  input: UploadWorkspaceSourceFileInput,
): Promise<UploadWorkspaceSourceFileResult>
````

## File: modules/notebooklm/interfaces/synthesis/components/RagQueryPanel.tsx
````typescript
import { useState } from "react";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
⋮----
import { useApp } from "@/modules/platform/api/ui";
import { useAuth } from "@/modules/iam/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui-shadcn/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@ui-shadcn/ui/alert";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Textarea } from "@ui-shadcn/ui/textarea";
⋮----
import type { KnowledgeCitation } from "../../../subdomains/synthesis/api";
import { runKnowledgeRagQueryAction } from "../_actions/rag-query.actions";
⋮----
interface RagQueryPanelProps {
  readonly workspaceId?: string;
}
⋮----
/** Minimal RAG query chat interface. Uses local useState only — no streaming, no global state. */
⋮----
async function handleSubmit()
⋮----
// Compatibility fallback for older vectors without ready status.
⋮----
{/* Auth warning — shown upfront when user cannot execute RAG queries */}
⋮----
{/* Query input */}
⋮----
onClick=
````

## File: modules/notebooklm/README.md
````markdown
# NotebookLM

對話、來源處理與推理主域

## Bounded Context

| Aspect | Description |
|--------|-------------|
| Primary role | 對話、來源處理、檢索與推理輸出 |
| Upstream | platform（治理）、ai（shared AI capability）、workspace（scope）、notion（knowledge artifact, attachment reference） |
| Downstream | 無固定主域級下游；GroundedAnswer 可被其他主域消費 |
| Core principle | notebooklm 擁有衍生推理流程，不擁有正典知識內容 |
| Cross-module boundary | `api/` only — no direct import of notion/platform/workspace internals |

## Ubiquitous Language

| Term | Meaning |
|------|---------|
| Notebook | 聚合對話、來源與衍生筆記的工作單位 |
| Conversation | Notebook 內的對話執行邊界（Thread + Messages） |
| Message | 一則輸入或輸出對話項 |
| Source | 被引用與推理的來源材料 |
| Ingestion | 來源匯入、正規化與前處理流程（TypeScript 側協調 py_fn） |
| Retrieval | 從來源中召回候選 Chunk 的查詢能力（向量搜尋） |
| Grounding | 把輸出對齊到來源證據、建立 Citation 的能力 |
| Citation | 輸出指回來源證據的引用關係 |
| Synthesis | 綜合多來源後生成的衍生輸出（RAG generation） |
| Evaluation | 對輸出品質、feedback 與回歸結果的評估 |

## Implementation Structure

```text
modules/notebooklm/
├── api/              # Public API boundary — cross-module entry point only
├── application/      # Context-wide orchestration
├── domain/           # Context-wide domain concepts (events, published-language)
├── infrastructure/   # Context-wide driven adapters, grouped by subdomain when needed
├── interfaces/       # Context-wide driving adapters, grouped by subdomain when needed
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── conversation/  # Tier 1 — 對話 Thread 與 Message
    ├── notebook/      # Tier 1 — Notebook 容器與 GenKit 生成
    ├── source/        # Tier 1 — 來源文件與 ingestion 編排
    └── synthesis/     # Tier 1 — 完整 RAG pipeline（retrieval → grounding → synthesis → evaluation）
```

## Subdomains

| Subdomain | Purpose | Key Aggregates / Entities |
|-----------|---------|--------------------------|
| conversation | 對話 Thread 與 Message 生命週期管理 | Thread, Message |
| notebook | Notebook 容器組合與 GenKit 回應生成 | AgentGeneration |
| source | 來源文件匯入生命週期、RagDocument 狀態機、WikiLibrary、ingestion 編排 | SourceFile, SourceFileVersion, RagDocument, WikiLibrary |
| synthesis | 完整 RAG pipeline：retrieval、grounding、answer generation、evaluation/feedback | AnswerRagQueryUseCase, SubmitRagQueryFeedbackUseCase, RagScoringService, RagCitationBuilder, RagPromptBuilder |

### Future Split Triggers

`synthesis` 子域將四個 RAG 關注點作為內部 facets 持有。只有當以下觸發條件成立時，才拆分為獨立子域：

| Facet | Split Trigger |
|-------|---------------|
| retrieval | 策略複雜到需要獨立領域模型（多重排序、hybrid search） |
| grounding | 引用追溯需要獨立聚合根（citation chains、evidence alignment） |
| generation | 生成策略需要獨立 use case 群（多模態、多來源融合） |
| evaluation | 品質語言需要獨立指標模型（回歸測試、benchmark suite） |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- `domain/` must not import infrastructure, interfaces, React, Firebase SDK, or any runtime framework.
- Cross-module collaboration goes through `api/` only.

## Current Contract Alignment

- NotebookLM consumes `accountId` and `workspaceId` from workspace-owned shell composition; it does not own top-level shell routes and any browser-facing links should remain anchored to canonical `/{accountId}/{workspaceId}` workspace navigation.
- Source and synthesis internals may derive an `organizationId` for organization-scoped storage and retrieval, but that identifier is an internal domain/infrastructure scope token, not a shell route param.
- For personal-account scope, source workflows currently derive a synthetic internal organization scope token from `accountId`; this is an implementation detail for org-scoped storage isolation, not an alternate accountType contract.
- This bounded context follows the repo baseline: Hexagonal Architecture + DDD, Firebase adapters outside the core, shared AI capability consumed through upstream ai boundaries, Zustand/XState only in interface workflows, and Zod at runtime validation boundaries.

## Strategic Documentation

- [Context README](../../docs/contexts/notebooklm/README.md)
- [Subdomains](../../docs/contexts/notebooklm/subdomains.md)
- [Bounded Context](../../docs/contexts/notebooklm/bounded-contexts.md)
- [Context Map](../../docs/contexts/notebooklm/context-map.md)
- [Ubiquitous Language](../../docs/contexts/notebooklm/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
````

## File: modules/notebooklm/subdomains/conversation/api/index.ts
````typescript
/**
 * Public API boundary for the conversation subdomain.
 *
 * Cross-module consumers MUST import through this entry point for
 * data, types, and helpers.
 *
 * UI components (ConversationPanel) are in a separate `./ui` entry
 * to avoid synchronous module-evaluation cycles with workspace/api.
 * Import ConversationPanel from `conversation/api/ui` or use
 * `next/dynamic` for lazy loading.
 */
⋮----
// Domain types
⋮----
// Thread persistence actions
````

## File: modules/notebooklm/subdomains/conversation/api/ui.ts
````typescript
/**
 * Conversation subdomain — UI component surface.
 *
 * Separated from the main barrel (index.ts) because ConversationPanel imports
 * workspace/api at runtime, creating a synchronous evaluation cycle when the
 * full barrel is loaded by workspace interfaces.
 *
 * Consumers that need ConversationPanel should either:
 *  - import from this file directly, or
 *  - use `next/dynamic` to lazy-load from this path.
 */
````

## File: modules/notebooklm/subdomains/conversation/domain/ports/index.ts
````typescript
/**
 * notebooklm/conversation domain/ports — driven port interfaces for the conversation subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
````

## File: modules/notebooklm/subdomains/source/application/dto/source.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the source subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
⋮----
/**
 * resolveSourceOrganizationId — maps an account to its organization scope.
 *
 * Delegates to the domain service. Personal accounts get a synthetic org ID
 * prefixed with "personal:" so they can participate in the same org-scoped
 * permission checks as org accounts.
 */
⋮----
// ── Wiki library entity types (used by composition facades) ──────────────
````

## File: modules/notebooklm/subdomains/source/application/use-cases/create-knowledge-draft-from-source.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: CreateKnowledgeDraftFromSourceUseCase — creates a knowledge page draft from a parsed source document.
 *
 * Actor: logged-in user
 * Goal: read parsed text from storage, create a knowledge page with a text block.
 * Main success: page created, returns aggregateId.
 * Failure: missing input, storage retrieval failure, or page creation failure.
 */
⋮----
import type { CommandResult } from "@shared-types";
import { commandFailureFrom, commandSuccess } from "@shared-types";
⋮----
import type { ParsedDocumentPort } from "../../domain/ports/ParsedDocumentPort";
import type { KnowledgePageGateway } from "../../domain/ports/KnowledgePageGatewayPort";
⋮----
export interface CreateKnowledgeDraftInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
  readonly filename: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
}
⋮----
function trimFileExtension(filename: string): string
⋮----
export class CreateKnowledgeDraftFromSourceUseCase {
⋮----
constructor(
⋮----
async execute(input: CreateKnowledgeDraftInput): Promise<CommandResult>
````

## File: modules/notebooklm/subdomains/source/application/use-cases/upload-init-source-file.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: UploadInitSourceFileUseCase — creates file metadata and returns an upload token.
 *
 * This is the first step of a two-step upload flow:
 *   1. init  → creates File + FileVersion records, returns an upload URL token
 *   2. complete → marks the version as active, registers a RagDocumentRecord
 */
⋮----
import { randomBytes } from "node:crypto";
import { v4 as randomUUID } from "@lib-uuid";
⋮----
import type { SourceFile } from "../../domain/entities/SourceFile";
import type { SourceFileVersion } from "../../domain/entities/SourceFileVersion";
import type { SourceFileRepository } from "../../domain/repositories/SourceFileRepository";
import type {
  SourceFileCommandErrorCode,
  UploadInitFileInputDto,
  UploadInitFileOutputDto,
} from "../dto/source-file.dto";
⋮----
type UploadInitSourceFileResult =
  | { ok: true; data: UploadInitFileOutputDto }
  | { ok: false; error: { code: SourceFileCommandErrorCode; message: string } };
⋮----
function inferClassification(mimeType: string): SourceFile["classification"]
⋮----
function buildUploadPath(
  organizationId: string,
  workspaceId: string,
  fileId: string,
  fileName: string,
): string
⋮----
export class UploadInitSourceFileUseCase {
⋮----
constructor(private readonly fileRepository: SourceFileRepository)
⋮----
async execute(input: UploadInitFileInputDto): Promise<UploadInitSourceFileResult>
````

## File: modules/notebooklm/subdomains/source/application/use-cases/wiki-library.use-cases.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Cases: Wiki library management — create, add fields, add rows, list.
 *
 * Design notes:
 * - All functions take explicit repository injection (no module-scope singletons).
 * - Event publisher is created lazily to avoid import-time side effects.
 * - Event publishing uses @shared-events public boundary only.
 */
⋮----
import {
  InMemoryEventStoreRepository,
  NoopEventBusRepository,
  PublishDomainEventUseCase,
} from "@shared-events";
⋮----
import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
  CreateWikiLibraryInput,
  AddWikiLibraryFieldInput,
  CreateWikiLibraryRowInput,
} from "../../domain/entities/WikiLibrary";
import type { WikiLibraryRepository } from "../../domain/repositories/WikiLibraryRepository";
import {
  generateSourceId,
  normalizeLibraryName,
  normalizeFieldKey,
  ensureUniqueLibrarySlug,
  deriveSlugCandidate,
} from "./wiki-library.helpers";
⋮----
// Lazy event publisher — only instantiated on first event emit.
⋮----
function getEventPublisher(): PublishDomainEventUseCase
⋮----
// ────────────────────────────────────────────────────────────────────────────
⋮----
export async function listWikiLibraries(
  accountId: string,
  workspaceId: string | undefined,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibrary[]>
⋮----
export async function createWikiLibrary(
  input: CreateWikiLibraryInput,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibrary>
⋮----
export async function addWikiLibraryField(
  input: AddWikiLibraryFieldInput,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibraryField>
⋮----
export async function createWikiLibraryRow(
  input: CreateWikiLibraryRowInput,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibraryRow>
⋮----
export interface WikiLibrarySnapshot {
  readonly library: WikiLibrary;
  readonly fields: WikiLibraryField[];
  readonly rows: WikiLibraryRow[];
}
⋮----
export async function getWikiLibrarySnapshot(
  accountId: string,
  libraryId: string,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibrarySnapshot>
````

## File: modules/notebooklm/subdomains/source/domain/ports/SourceDocumentPort.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: SourceDocumentCommandPort — commands for legacy source documents stored in accounts/{accountId}/documents.
 *
 * This port isolates the legacy Firestore collection from interfaces.
 * Infrastructure provides the Firebase adapter; interfaces consume via use cases.
 */
⋮----
export interface SourceDocumentCommandPort {
  deleteDocument(accountId: string, documentId: string): Promise<void>;
  renameDocument(accountId: string, documentId: string, newName: string): Promise<void>;
}
⋮----
deleteDocument(accountId: string, documentId: string): Promise<void>;
renameDocument(accountId: string, documentId: string, newName: string): Promise<void>;
````

## File: modules/notebooklm/subdomains/source/domain/repositories/SourceFileRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/repositories
 * Port: SourceFileRepository — persistence contract for SourceFile aggregates.
 */
⋮----
import type { SourceFile } from "../entities/SourceFile";
import type { SourceFileVersion } from "../entities/SourceFileVersion";
⋮----
export interface ListSourceFilesScope {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
}
⋮----
export interface SourceFileRepository {
  findById(fileId: string): Promise<SourceFile | null>;
  findVersion(fileId: string, versionId: string): Promise<SourceFileVersion | null>;
  listVersions(fileId: string): Promise<readonly SourceFileVersion[]>;
  listByWorkspace(scope: ListSourceFilesScope): Promise<readonly SourceFile[]>;
  save(file: SourceFile, versions?: readonly SourceFileVersion[]): Promise<void>;
}
⋮----
findById(fileId: string): Promise<SourceFile | null>;
findVersion(fileId: string, versionId: string): Promise<SourceFileVersion | null>;
listVersions(fileId: string): Promise<readonly SourceFileVersion[]>;
listByWorkspace(scope: ListSourceFilesScope): Promise<readonly SourceFile[]>;
save(file: SourceFile, versions?: readonly SourceFileVersion[]): Promise<void>;
````

## File: modules/notebooklm/subdomains/synthesis/api/server.ts
````typescript
/**
 * synthesis subdomain — server-only API.
 *
 * Factory functions and infrastructure adapters that depend on server-only
 * packages. Must only be imported in Server Actions, route handlers, or
 * server-side infrastructure.
 */
⋮----
import { FirebaseRagRetrievalAdapter } from "../../../infrastructure/synthesis/firebase/FirebaseRagRetrievalAdapter";
import { FirebaseKnowledgeContentAdapter } from "../../../infrastructure/synthesis/firebase/FirebaseKnowledgeContentAdapter";
import { AiRagGenerationAdapter } from "../../../infrastructure/synthesis/ai/AiRagGenerationAdapter";
import { AnswerRagQueryUseCase } from "../application/use-cases/answer-rag-query.use-case";
import type {
  KnowledgeParsedDocument,
  KnowledgeRagQueryResult,
  KnowledgeReindexInput,
} from "../domain/repositories/KnowledgeContentRepository";
⋮----
function getKnowledgeContentRepository(): FirebaseKnowledgeContentAdapter
⋮----
export function createAnswerRagQueryUseCase(): AnswerRagQueryUseCase
⋮----
export function runKnowledgeRagQuery(
  query: string,
  accountId: string,
  workspaceId: string,
  topK = 4,
  options: { taxonomyFilters?: string[]; maxAgeDays?: number; requireReady?: boolean } = {},
): Promise<KnowledgeRagQueryResult>
⋮----
export function reindexKnowledgeDocument(input: KnowledgeReindexInput): Promise<void>
⋮----
export function listKnowledgeParsedDocuments(accountId: string, limitCount = 20): Promise<KnowledgeParsedDocument[]>
````

## File: modules/notebooklm/subdomains/synthesis/application/use-cases/answer-rag-query.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: application/use-cases
 * Purpose: AnswerRagQueryUseCase — orchestrates grounding + synthesis to
 *          produce a cited answer for a user question.
 *
 * Design improvements over legacy answer-rag-query.use-case.ts:
 * - TopK limit is configurable via constructor injection (no hard-coded MAX_TOP_K=10).
 * - Error codes are prefixed with QA_ for namespace clarity.
 * - Dependencies typed against interfaces, not concrete classes.
 */
⋮----
import { v4 as randomUUID } from "@lib-uuid";
⋮----
import type { RagRetrievalRepository } from "../../domain/repositories/RagRetrievalRepository";
import type {
  AnswerRagQueryInput,
  AnswerRagQueryOutput,
  AnswerRagQueryResult,
  RagRetrievalSummary,
} from "../../domain/entities/rag-query.entities";
import type { RagGenerationRepository } from "../../domain/repositories/RagGenerationRepository";
⋮----
const DEFAULT_MAX_TOP_K = 20; // Raise from the legacy hard-coded 10
⋮----
function clampTopK(value: number | undefined, maxTopK: number): number
⋮----
export class AnswerRagQueryUseCase {
⋮----
constructor(
⋮----
/** Maximum topK accepted from callers. Override at composition root for environment-specific limits. */
⋮----
async execute(input: AnswerRagQueryInput): Promise<AnswerRagQueryResult>
````

## File: modules/notebooklm/subdomains/synthesis/domain/ports/GenerationPort.ts
````typescript
/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/ports
 * Purpose: GenerationPort — output port for AI answer generation.
 *
 * The AI bounded-context adapter (infrastructure) implements this port.
 */
⋮----
import type { GenerateAnswerInput, GenerateAnswerResult } from "../entities/SynthesisResult";
⋮----
export interface GenerationPort {
  generate(input: GenerateAnswerInput): Promise<GenerateAnswerResult>;
}
⋮----
generate(input: GenerateAnswerInput): Promise<GenerateAnswerResult>;
````

## File: modules/notebooklm/infrastructure/source/firebase/FirebaseRagDocumentAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseRagDocumentAdapter — Firestore implementation of RagDocumentRepository.
 *
 * Collection path:
 *   knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
⋮----
import type { RagDocumentRecord, RagDocumentStatus } from "../../../subdomains/source/domain/entities/RagDocument";
import type { RagDocumentRepository } from "../../../subdomains/source/domain/repositories/RagDocumentRepository";
⋮----
function buildDocPath(input: {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly documentId: string;
}): string
⋮----
function buildDocCollectionPath(input:
⋮----
function toStringArray(value: unknown): readonly string[]
⋮----
function isRagDocumentStatus(value: unknown): value is RagDocumentStatus
⋮----
function toRagDocumentRecord(
  documentId: string,
  data: Record<string, unknown>,
  fallback: { organizationId: string; workspaceId: string },
): RagDocumentRecord
⋮----
export class FirebaseRagDocumentAdapter implements RagDocumentRepository {
⋮----
async findByStoragePath(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly storagePath: string;
}): Promise<RagDocumentRecord | null>
⋮----
async findByWorkspace(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
}): Promise<readonly RagDocumentRecord[]>
⋮----
async saveUploaded(record: RagDocumentRecord): Promise<void>
````

## File: modules/notebooklm/infrastructure/source/firebase/FirebaseSourceFileAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseSourceFileAdapter — Firestore implementation of SourceFileRepository.
 *
 * Collections:
 *   workspaceFiles/{fileId}
 *   workspaceFiles/{fileId}/versions/{versionId}
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
⋮----
import type { SourceFile } from "../../../subdomains/source/domain/entities/SourceFile";
import type { SourceFileVersion } from "../../../subdomains/source/domain/entities/SourceFileVersion";
import type { SourceFileRepository, ListSourceFilesScope } from "../../../subdomains/source/domain/repositories/SourceFileRepository";
⋮----
function isSourceFileStatus(value: unknown): value is SourceFile["status"]
⋮----
function isSourceFileClassification(value: unknown): value is SourceFile["classification"]
⋮----
function toStringArray(value: unknown): readonly string[]
⋮----
function toSourceFileEntity(fileId: string, data: Record<string, unknown>): SourceFile
⋮----
function isVersionStatus(value: unknown): value is SourceFileVersion["status"]
⋮----
function toSourceFileVersionEntity(versionId: string, data: Record<string, unknown>): SourceFileVersion
⋮----
export class FirebaseSourceFileAdapter implements SourceFileRepository {
⋮----
async findById(fileId: string): Promise<SourceFile | null>
⋮----
async findVersion(fileId: string, versionId: string): Promise<SourceFileVersion | null>
⋮----
async listVersions(fileId: string): Promise<readonly SourceFileVersion[]>
⋮----
async listByWorkspace(scope: ListSourceFilesScope): Promise<readonly SourceFile[]>
⋮----
async save(file: SourceFile, versions: readonly SourceFileVersion[] = []): Promise<void>
````

## File: modules/notebooklm/interfaces/source/composition/adapters.ts
````typescript
import { FirebaseParsedDocumentAdapter } from "../../../infrastructure/source/firebase/FirebaseParsedDocumentAdapter";
import { FirebaseRagDocumentAdapter } from "../../../infrastructure/source/firebase/FirebaseRagDocumentAdapter";
import { FirebaseSourceDocumentCommandAdapter } from "../../../infrastructure/source/firebase/FirebaseSourceDocumentCommandAdapter";
import { FirebaseSourceFileAdapter } from "../../../infrastructure/source/firebase/FirebaseSourceFileAdapter";
import { FirebaseWikiLibraryAdapter } from "../../../infrastructure/source/firebase/FirebaseWikiLibraryAdapter";
import { NotionKnowledgePageGatewayAdapter } from "../../../infrastructure/source/adapters/NotionKnowledgePageGatewayAdapter";
import { waitForParsedDocument as _waitForParsedDocument } from "../../../infrastructure/source/firebase/FirebaseDocumentStatusAdapter";
import { PlatformSourcePipelineAdapter } from "../../../infrastructure/source/platform/PlatformSourcePipelineAdapter";
import { PlatformSourceStorageAdapter } from "../../../infrastructure/source/platform/PlatformSourceStorageAdapter";
import { PlatformSourceDocumentWatchAdapter } from "../../../infrastructure/source/platform/PlatformSourceDocumentWatchAdapter";
import {
  addKnowledgeBlock,
  approveKnowledgePage,
  createKnowledgePage,
} from "@/modules/notion/api";
import {
  extractTaskCandidatesFromKnowledge,
} from "@/modules/workspace/api";
import type { WikiLibraryRepository } from "../../../subdomains/source/domain/repositories/WikiLibraryRepository";
import type { SourceStoragePort } from "../../../subdomains/source/domain/ports/SourceStoragePort";
import type { SourceDocumentWatchPort } from "../../../subdomains/source/domain/ports/SourceDocumentWatchPort";
import type { TaskMaterializationWorkflowPort } from "../../../subdomains/source/domain/ports/TaskMaterializationWorkflowPort";
import { TaskMaterializationWorkflowAdapter } from "../../../infrastructure/source/adapters/TaskMaterializationWorkflowAdapter";
⋮----
export function makeSourceFileAdapter()
⋮----
export function makeRagDocumentAdapter()
⋮----
export function makeSourceDocumentCommandAdapter()
⋮----
export function makeParsedDocumentAdapter()
⋮----
export function makeSourcePipelineAdapter()
⋮----
export function makeKnowledgePageGateway()
⋮----
export function makeWikiLibraryAdapter(): WikiLibraryRepository
⋮----
export function makeTaskMaterializationWorkflowAdapter(): TaskMaterializationWorkflowPort
⋮----
export function makeSourceStorageAdapter(): SourceStoragePort
⋮----
export function makeSourceDocumentWatchAdapter(): SourceDocumentWatchPort
⋮----
export function waitForParsedDocument(
  accountId: string,
  docId: string,
): Promise<
````

## File: modules/notebooklm/interfaces/source/composition/use-cases.ts
````typescript
import { UploadInitSourceFileUseCase } from "../../../subdomains/source/application/use-cases/upload-init-source-file.use-case";
import { UploadCompleteSourceFileUseCase } from "../../../subdomains/source/application/use-cases/upload-complete-source-file.use-case";
import { ParseSourceDocumentUseCase, ReindexSourceDocumentUseCase } from "../../../subdomains/source/application/use-cases/source-pipeline.use-cases";
import { ProcessSourceDocumentWorkflowUseCase } from "../../../subdomains/source/application/use-cases/process-source-document-workflow.use-case";
import { RegisterUploadedRagDocumentUseCase } from "../../../subdomains/source/application/use-cases/register-rag-document.use-case";
import { RenameSourceDocumentUseCase } from "../../../subdomains/source/application/use-cases/rename-source-document.use-case";
import { DeleteSourceDocumentUseCase } from "../../../subdomains/source/application/use-cases/delete-source-document.use-case";
import { CreateKnowledgeDraftFromSourceUseCase, type KnowledgePageGateway } from "../../../subdomains/source/application/use-cases/create-knowledge-draft-from-source.use-case";
import type { SourceFileRepository } from "../../../subdomains/source/domain/repositories/SourceFileRepository";
import type { RagDocumentRepository } from "../../../subdomains/source/domain/repositories/RagDocumentRepository";
import type { SourceDocumentCommandPort } from "../../../subdomains/source/domain/ports/SourceDocumentPort";
import type { SourcePipelinePort } from "../../../subdomains/source/domain/ports/SourcePipelinePort";
import type { ParsedDocumentPort } from "../../../subdomains/source/domain/ports/ParsedDocumentPort";
import type { TaskMaterializationWorkflowPort } from "../../../subdomains/source/domain/ports/TaskMaterializationWorkflowPort";
import {
  makeSourceFileAdapter,
  makeRagDocumentAdapter,
  makeSourceDocumentCommandAdapter,
  makeSourcePipelineAdapter,
  makeParsedDocumentAdapter,
  makeKnowledgePageGateway,
  makeTaskMaterializationWorkflowAdapter,
  waitForParsedDocument,
} from "./adapters";
⋮----
export interface SourceUseCases {
  readonly uploadInitSourceFile: UploadInitSourceFileUseCase;
  readonly uploadCompleteSourceFile: UploadCompleteSourceFileUseCase;
  readonly parseSourceDocument: ParseSourceDocumentUseCase;
  readonly reindexSourceDocument: ReindexSourceDocumentUseCase;
  readonly processSourceDocumentWorkflow: ProcessSourceDocumentWorkflowUseCase;
  readonly registerUploadedRagDocument: RegisterUploadedRagDocumentUseCase;
  readonly renameSourceDocument: RenameSourceDocumentUseCase;
  readonly deleteSourceDocument: DeleteSourceDocumentUseCase;
  readonly createKnowledgeDraftFromSource: CreateKnowledgeDraftFromSourceUseCase;
}
⋮----
interface ParsedDocumentStatusPort {
  waitForParsedDocument(
    accountId: string,
    documentId: string,
  ): Promise<{ pageCount: number; jsonGcsUri: string }>;
}
⋮----
waitForParsedDocument(
    accountId: string,
    documentId: string,
): Promise<
⋮----
function makeParsedDocumentStatusPort(): ParsedDocumentStatusPort
⋮----
export function makeSourceUseCases(
  fileRepository: SourceFileRepository = makeSourceFileAdapter(),
  ragDocumentRepository: RagDocumentRepository = makeRagDocumentAdapter(),
  documentCommandPort: SourceDocumentCommandPort = makeSourceDocumentCommandAdapter(),
  pipelinePort: SourcePipelinePort = makeSourcePipelineAdapter(),
  parsedDocumentPort: ParsedDocumentPort = makeParsedDocumentAdapter(),
  knowledgePageGateway: KnowledgePageGateway = makeKnowledgePageGateway(),
  taskWorkflowPort: TaskMaterializationWorkflowPort = makeTaskMaterializationWorkflowAdapter(),
): SourceUseCases
````

## File: modules/notebooklm/interfaces/synthesis/_actions/rag-query.actions.ts
````typescript
import { runKnowledgeRagQuery } from "../../../subdomains/synthesis/api/server";
import type { KnowledgeRagQueryResult } from "../../../subdomains/synthesis/domain/repositories/KnowledgeContentRepository";
⋮----
function isBlank(value: string): boolean
⋮----
export interface RunKnowledgeRagQueryInput {
  query: string;
  accountId: string;
  workspaceId: string;
  topK?: number;
  requireReady?: boolean;
  maxAgeDays?: number;
}
⋮----
export async function runKnowledgeRagQueryAction(
  input: RunKnowledgeRagQueryInput,
): Promise<KnowledgeRagQueryResult>
````

## File: modules/notebooklm/subdomains/source/api/index.ts
````typescript
/**
 * Public API boundary for the source subdomain.
 *
 * Cross-module consumers MUST import through this entry point.
 * Internal consumers within the subdomain import from their own layer.
 */
⋮----
// ---------------------------------------------------------------------------
// Domain entity types
// ---------------------------------------------------------------------------
⋮----
// ---------------------------------------------------------------------------
// Wiki library use cases (pre-wired facade from composition layer)
// ---------------------------------------------------------------------------
⋮----
// ---------------------------------------------------------------------------
// Live document DTOs
// ---------------------------------------------------------------------------
⋮----
// Hooks and UI components are exported from ./ui to keep this barrel semantic-only.
⋮----
// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
⋮----
// ---------------------------------------------------------------------------
// Server actions
// ---------------------------------------------------------------------------
````

## File: modules/notebooklm/subdomains/source/application/use-cases/register-rag-document.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: RegisterUploadedRagDocumentUseCase — registers a RAG document record after upload.
 *
 * Called internally by UploadCompleteSourceFileUseCase;
 * also callable directly when a document is registered without the upload-init flow.
 */
⋮----
import { v4 as randomUUID } from "@lib-uuid";
⋮----
import type { RagDocumentRepository } from "../../domain/repositories/RagDocumentRepository";
import type {
  RegisterUploadedRagDocumentInputDto,
  RegisterUploadedRagDocumentOutputDto,
  RegisterUploadedRagDocumentErrorCode,
} from "../dto/rag-document.dto";
⋮----
type RegisterUploadedRagDocumentResult =
  | { ok: true; data: RegisterUploadedRagDocumentOutputDto }
  | { ok: false; error: { code: RegisterUploadedRagDocumentErrorCode; message: string } };
⋮----
export class RegisterUploadedRagDocumentUseCase {
⋮----
constructor(private readonly ragDocumentRepository: RagDocumentRepository)
⋮----
async execute(
    input: RegisterUploadedRagDocumentInputDto,
): Promise<RegisterUploadedRagDocumentResult>
````

## File: modules/notebooklm/subdomains/source/application/use-cases/upload-complete-source-file.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: UploadCompleteSourceFileUseCase — activates a file after binary upload completes.
 *
 * This is the second step of a two-step upload flow:
 *   1. init  → creates File + FileVersion records
 *   2. complete (this) → activates the version and registers a RagDocumentRecord
 *
 * Idempotent: calling complete on an already-completed file returns the existing
 * RagDocument without creating a duplicate.
 */
⋮----
import { v4 as randomUUID } from "@lib-uuid";
⋮----
import type { SourceFileRepository } from "../../domain/repositories/SourceFileRepository";
import type { RagDocumentRepository } from "../../domain/repositories/RagDocumentRepository";
import { completeUploadSourceFile } from "../../domain/services/complete-upload-source-file.service";
import type {
  SourceFileCommandErrorCode,
  UploadCompleteFileInputDto,
  UploadCompleteFileOutputDto,
} from "../dto/source-file.dto";
import type { SourceFile } from "../../domain/entities/SourceFile";
⋮----
type UploadCompleteSourceFileResult =
  | { ok: true; data: UploadCompleteFileOutputDto }
  | { ok: false; error: { code: SourceFileCommandErrorCode; message: string } };
⋮----
function isFileScopeMatch(params: {
  file: SourceFile;
  workspaceId: string;
  organizationId: string;
  actorAccountId: string;
  versionId: string;
}): boolean
⋮----
function isFileAlreadyCompleted(file: SourceFile): boolean
⋮----
export class UploadCompleteSourceFileUseCase {
⋮----
constructor(
⋮----
async execute(input: UploadCompleteFileInputDto): Promise<UploadCompleteSourceFileResult>
````

## File: modules/notebooklm/subdomains/subdomains.instructions.md
````markdown
---
description: 'NotebookLM subdomains structural rules: hexagonal shape per subdomain, derived-output ownership, RAG pipeline boundaries, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/notebooklm/subdomains/**/*.{ts,tsx}'
---

# NotebookLM Subdomains Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notebooklm/subdomains.md`.

## Core Rules

- Every subdomain must maintain the core-first default shape: `api/`, `domain/`, `application/`, optional `ports/`, and `README.md`.
- `infrastructure/` and `interfaces/` belong at the bounded-context root by default and should be grouped by subdomain there unless the mini-module gate is explicitly justified.
- Stub subdomains (`domain/index.ts` only) must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within notebooklm goes through the **subdomain's own `api/`** — never import a sibling subdomain's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Each subdomain owns its Firestore collection(s); no subdomain reads or writes another subdomain's data directly.
- Domain events emitted by a subdomain must use the discriminant format `notebooklm.<subdomain>.<action>` (e.g. `notebooklm.conversation.thread-created`, `notebooklm.source.ingestion-completed`, `notebooklm.synthesis.answer-generated`).
- Dependency direction inside each subdomain mirrors the module-level rule: `interfaces → application → domain ← infrastructure`.
- notebooklm only owns **derived reasoning outputs** — it must never directly modify canonical content belonging to `notion`.
- `conversation` owns Thread and Message lifecycle; it must not own source ingestion or RAG pipeline logic.
- `notebook` owns the aggregate container combining conversation, source, and derived notes; GenKit response generation is scoped here.
- `source` owns the ingestion lifecycle, RagDocument state machine, WikiLibrary, and SourceRetentionPolicy — it must not own retrieval ranking or generation.
- `synthesis` owns the complete RAG pipeline (retrieval → grounding → generation → evaluation) as internal facets; do not split these facets into separate subdomains unless an explicit split trigger is documented in an ADR.
- Retrieval is upstream of generation; grounding aligns output to source evidence — do not reverse this dependency.
- `evaluation` describes output quality and grounding confidence; it must not emit billing signals or usage metrics.
- Shared AI provider capability (model routing, quota, safety) is supplied by the `ai` bounded context — do not replicate provider policy inside notebooklm subdomains.
- Use `organizationId` only as an internal storage scope identifier derived after boundary translation; do not treat it as a shell route parameter.
- Use `Conversation` (not `Chat` or `Session`) and `Ingestion` (not `File Import` or `Upload`) in all subdomain published language.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/notebooklm/subdomains/synthesis/domain/index.ts
````typescript
// ── Canonical domain types ────────────────────────────────────────────────────
⋮----
// ── Active pipeline types (legacy naming, used by use cases & adapters) ──────
⋮----
// ── Events ───────────────────────────────────────────────────────────────────
⋮----
// ── Ports ────────────────────────────────────────────────────────────────────
⋮----
// ── Repositories (output port interfaces) ────────────────────────────────────
⋮----
// ── Domain services ──────────────────────────────────────────────────────────
⋮----
// ── Value objects ────────────────────────────────────────────────────────────
````

## File: modules/notebooklm/subdomains/source/domain/ports/index.ts
````typescript
/**
 * notebooklm/source domain/ports — driven port interfaces for the source subdomain.
 *
 * SourceDocumentCommandPort and ParsedDocumentPort are the primary driven ports.
 * Repository contracts are re-exported from domain/repositories/.
 */
````

## File: modules/notebooklm/subdomains/synthesis/api/index.ts
````typescript
/**
 * Public API boundary for the synthesis subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * This subdomain owns the complete RAG pipeline:
 *   retrieval → grounding → synthesis → evaluation
 *
 * Migrated from: ai subdomain (AGENTS.md violation fix)
 * Absorbed from: retrieval, grounding, evaluation stubs (Occam consolidation)
 */
⋮----
// ── Canonical domain types (retrieval facet) ─────────────────────────────────
⋮----
// ── Canonical domain types (grounding facet) ─────────────────────────────────
⋮----
// ── Canonical domain types (synthesis facet) ─────────────────────────────────
⋮----
// ── Canonical domain types (evaluation facet) ────────────────────────────────
⋮----
// ── Active pipeline types (used by use cases & infrastructure) ───────────────
⋮----
// ── Use-case classes (for DI composition within synthesis subdomain) ──────────
⋮----
// UI components are exported from ./ui to keep this barrel semantic-only.
````

## File: modules/notebooklm/api/index.ts
````typescript
/**
 * modules/notebooklm — public API barrel.
 *
 * Stable cross-module semantic surface for notebooklm.
 * Browser-facing route composition should prefer workspace/api when workspace
 * is the orchestration owner.
 */
⋮----
// UI components and hooks are exported from notebooklm/api/ui.ts.
⋮----
// ---------------------------------------------------------------------------
// Source subdomain — semantic downstream capability surface
// ---------------------------------------------------------------------------
⋮----
// ---------------------------------------------------------------------------
// conversation subdomain — AI chat helpers and types
//
// NOTE: ConversationPanel is NOT re-exported here to avoid a synchronous
// module-evaluation cycle: workspace/api → workspace interfaces →
// notebooklm/api → ConversationPanel → workspace/api.
// Import ConversationPanel from "@/modules/notebooklm/subdomains/conversation/api/ui"
// or use next/dynamic for lazy loading.
// ---------------------------------------------------------------------------
⋮----
// ---------------------------------------------------------------------------
// Context-wide published language (cross-module reference types)
// ---------------------------------------------------------------------------
⋮----
// ---------------------------------------------------------------------------
// Synthesis subdomain — complete RAG pipeline
// (retrieval → grounding → synthesis → evaluation)
// ---------------------------------------------------------------------------
````