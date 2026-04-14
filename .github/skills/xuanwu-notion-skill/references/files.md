# Files

## File: modules/notion/api/index.ts
````typescript
/**
 * Module: notion
 * Layer: api (top-level public boundary)
 * Purpose: Unified public boundary for notion subdomains.
 *          External consumers (workspace, other modules) must only import from here.
 *          Browser-facing route composition should prefer workspace/api when
 *          workspace is the orchestration owner.
 *
 * Notes:
 * - This file exposes only stable cross-module semantic capabilities.
 * - Internal factory wiring remains private to notion subdomains/interfaces
 *   until a context-wide server-only contract is explicitly justified.
 */
⋮----
// ── Context-wide published language ───────────────────────────────────────────
⋮----
// ── knowledge subdomain ───────────────────────────────────────────────────────
⋮----
// ── authoring subdomain ───────────────────────────────────────────────────────
// Migration state: subdomain-owned composition remains private; root api only
// aggregates stable public capabilities during the knowledge-base convergence.
⋮----
// ── collaboration subdomain ───────────────────────────────────────────────────
// Migration state: subdomain-owned composition remains private; root api only
// aggregates stable public capabilities during the collaboration convergence.
⋮----
// ── database subdomain ────────────────────────────────────────────────────────
// Migration state: subdomain-owned composition remains private; root api only
// aggregates stable public capabilities during the database convergence.
⋮----
// ── taxonomy subdomain ────────────────────────────────────────────────────────
// Tier 2 — classification hierarchy and semantic organization
⋮----
// ── relations subdomain ───────────────────────────────────────────────────────
// Tier 2 — backlinks, forward links, and reference graphs
````

## File: modules/notion/application/use-cases/index.ts
````typescript
// relations/taxonomy are still placeholder-only at the application layer.
````

## File: modules/notion/domain/events/index.ts
````typescript

````

## File: modules/notion/domain/events/NotionDomainEvent.ts
````typescript
/**
 * Module: notion
 * Layer: domain/events (context-wide)
 * Purpose: Base domain event interface for the notion bounded context.
 *          All subdomain events (knowledge, authoring, collaboration, database, etc.)
 *          should extend this interface.
 *
 * NOTE: subdomains/knowledge/domain/events/NotionDomainEvent.ts carries the same shape.
 *       Future convergence should re-export this context-wide version.
 */
⋮----
export interface NotionDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
````

## File: modules/notion/domain/published-language/index.ts
````typescript
/**
 * Module: notion
 * Layer: domain (context-wide published language)
 * Purpose: Reference types exposed to downstream bounded contexts.
 *
 * These types represent notion's public vocabulary as defined in the context map.
 * Downstream consumers (notebooklm, workspace) receive opaque references — never
 * raw aggregates or internal domain models.
 *
 * Context Map tokens:
 *   - KnowledgeArtifactReference: opaque ref consumed by notebooklm for retrieval/grounding
 *   - AttachmentReference: traceable ref to an attachment asset
 *   - TaxonomyHint: classification hint forwarded as retrieval aid
 */
⋮----
/** Opaque reference to a KnowledgePage or Article (cross-module token) */
export interface KnowledgeArtifactReference {
  readonly artifactId: string;
  readonly artifactType: "page" | "article";
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly slug: string;
}
⋮----
/** Opaque reference to an attachment asset (cross-module token) */
export interface AttachmentReference {
  readonly attachmentId: string;
  readonly artifactId: string;
  readonly accountId: string;
  readonly displayName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}
⋮----
/**
 * Classification hint forwarded to downstream contexts as retrieval aid.
 * The downstream context (notebooklm) does not own taxonomy semantics —
 * it only consumes the hint for filtering and ranking.
 */
export interface TaxonomyHint {
  readonly taxonomyId: string;
  readonly label: string;
  readonly path: readonly string[];
}
````

## File: modules/notion/infrastructure/authoring/firebase/index.ts
````typescript
// TODO: export FirebaseArticleRepository, FirebaseCategoryRepository
````

## File: modules/notion/infrastructure/authoring/index.ts
````typescript

````

## File: modules/notion/infrastructure/collaboration/firebase/index.ts
````typescript

````

## File: modules/notion/infrastructure/collaboration/index.ts
````typescript

````

## File: modules/notion/infrastructure/database/firebase/index.ts
````typescript

````

## File: modules/notion/infrastructure/database/index.ts
````typescript

````

## File: modules/notion/infrastructure/knowledge/firebase/index.ts
````typescript

````

## File: modules/notion/infrastructure/relations/firebase/index.ts
````typescript

````

## File: modules/notion/infrastructure/relations/index.ts
````typescript

````

## File: modules/notion/infrastructure/taxonomy/firebase/index.ts
````typescript

````

## File: modules/notion/infrastructure/taxonomy/index.ts
````typescript

````

## File: modules/notion/interfaces/authoring/_actions/index.ts
````typescript
// TODO: export server actions: createArticle, updateArticle, publishArticle, archiveArticle
// TODO: export createCategory, moveCategory
````

## File: modules/notion/interfaces/authoring/components/ArticleDialog.tsx
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/components
 * Purpose: Dialog for creating and editing Knowledge Base articles.
 */
⋮----
import { useEffect, useState, useTransition } from "react";
import { X } from "lucide-react";
⋮----
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@ui-shadcn/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
⋮----
import { createArticle, updateArticle } from "../_actions/article.actions";
import type { ArticleSnapshot } from "../../../subdomains/authoring/application/dto/authoring.dto";
import type { CategorySnapshot } from "../../../subdomains/authoring/application/dto/authoring.dto";
⋮----
interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
  categories: CategorySnapshot[];
  /** Article to edit — omit for create mode */
  article?: ArticleSnapshot;
  onSuccess?: (articleId?: string) => void;
}
⋮----
/** Article to edit — omit for create mode */
⋮----
function handleSubmit()
⋮----
// eslint-disable-next-line jsx-a11y/no-autofocus
````

## File: modules/notion/interfaces/authoring/components/CategoryTreePanel.tsx
````typescript
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, FolderOpen, Layers } from "lucide-react";
⋮----
import type { CategorySnapshot as Category } from "../../../subdomains/authoring/application/dto/authoring.dto";
⋮----
// ── Category tree helpers ────────────────────────────────────────────────────
⋮----
export interface CategoryNode extends Category {
  children: CategoryNode[];
}
⋮----
export function buildCategoryTree(categories: Category[]): CategoryNode[]
⋮----
// ── Category tree panel ──────────────────────────────────────────────────────
⋮----
interface CategoryTreePanelProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}
⋮----
export function CategoryTreePanel(
````

## File: modules/notion/interfaces/authoring/components/index.ts
````typescript
// TODO: export ArticleEditorView, ArticleListView, CategoryTreeView
````

## File: modules/notion/interfaces/authoring/composition/repositories.ts
````typescript
import { FirebaseArticleRepository } from "../../../infrastructure/authoring/firebase/FirebaseArticleRepository";
import { FirebaseCategoryRepository } from "../../../infrastructure/authoring/firebase/FirebaseCategoryRepository";
⋮----
export function makeArticleRepo()
⋮----
export function makeCategoryRepo()
````

## File: modules/notion/interfaces/authoring/queries/index.ts
````typescript
// TODO: export getArticle, getArticlesByWorkspace, getCategoryTree
⋮----
/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/queries
 * Purpose: Direct-instantiation query functions (read-side).
 */
⋮----
import { makeArticleRepo, makeCategoryRepo } from "../composition/repositories";
import type { ArticleSnapshot, ArticleStatus } from "../../../subdomains/authoring/application/dto/authoring.dto";
import type { CategorySnapshot } from "../../../subdomains/authoring/application/dto/authoring.dto";
⋮----
export async function getArticles(params: {
  accountId: string;
  workspaceId: string;
  categoryId?: string;
  status?: ArticleStatus;
}): Promise<ArticleSnapshot[]>
⋮----
export async function getArticle(accountId: string, articleId: string): Promise<ArticleSnapshot | null>
⋮----
export async function getCategories(accountId: string, workspaceId: string): Promise<CategorySnapshot[]>
⋮----
export async function getBacklinks(accountId: string, articleId: string): Promise<ArticleSnapshot[]>
````

## File: modules/notion/interfaces/authoring/store/index.ts
````typescript
// TODO: export useArticleEditorStore
````

## File: modules/notion/interfaces/collaboration/_actions/index.ts
````typescript

````

## File: modules/notion/interfaces/collaboration/components/CommentPanel.tsx
````typescript
import { useEffect, useState, useTransition } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
⋮----
import { Button } from "@ui-shadcn/ui/button";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { Badge } from "@ui-shadcn/ui/badge";
import { Separator } from "@ui-shadcn/ui/separator";
⋮----
import { subscribeComments } from "../queries";
import { createComment, resolveComment, deleteComment } from "../_actions/comment.actions";
import type { CommentSnapshot } from "../../../subdomains/collaboration/application/dto/collaboration.dto";
⋮----
interface CommentPanelProps {
  accountId: string;
  workspaceId: string;
  contentId: string;
  contentType: "page" | "article";
  currentUserId: string;
}
⋮----
function handlePost()
⋮----
function handleResolve(commentId: string)
⋮----
function handleDelete(commentId: string)
````

## File: modules/notion/interfaces/collaboration/components/index.ts
````typescript

````

## File: modules/notion/interfaces/collaboration/components/VersionHistoryPanel.tsx
````typescript
import { useEffect, useState, useTransition } from "react";
import { History, Trash2 } from "lucide-react";
⋮----
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";
⋮----
import { getVersions } from "../queries";
import { deleteVersion } from "../_actions/version.actions";
import type { VersionSnapshot } from "../../../subdomains/collaboration/application/dto/collaboration.dto";
⋮----
interface VersionHistoryPanelProps {
  accountId: string;
  contentId: string;
  currentUserId: string;
}
⋮----
function handleDelete(versionId: string)
````

## File: modules/notion/interfaces/collaboration/composition/repositories.ts
````typescript
import { FirebaseCommentRepository } from "../../../infrastructure/collaboration/firebase/FirebaseCommentRepository";
import { FirebasePermissionRepository } from "../../../infrastructure/collaboration/firebase/FirebasePermissionRepository";
import { FirebaseVersionRepository } from "../../../infrastructure/collaboration/firebase/FirebaseVersionRepository";
⋮----
export function makeCommentRepo()
⋮----
export function makeVersionRepo()
⋮----
export function makePermissionRepo()
````

## File: modules/notion/interfaces/collaboration/queries/index.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/queries
 * Purpose: Read-side queries for comment, version, and permission data.
 */
⋮----
import { makeCommentRepo, makePermissionRepo, makeVersionRepo } from "../composition/repositories";
import type { CommentSnapshot, CommentUnsubscribe, VersionSnapshot, PermissionSnapshot } from "../../../subdomains/collaboration/application/dto/collaboration.dto";
⋮----
export async function getComments(accountId: string, contentId: string): Promise<CommentSnapshot[]>
⋮----
export async function getVersions(accountId: string, contentId: string): Promise<VersionSnapshot[]>
⋮----
export async function getPermissions(accountId: string, subjectId: string): Promise<PermissionSnapshot[]>
⋮----
export function subscribeComments(
  accountId: string,
  contentId: string,
  onUpdate: (comments: CommentSnapshot[]) => void,
): CommentUnsubscribe
````

## File: modules/notion/interfaces/collaboration/store/index.ts
````typescript
// TODO: export useCommentStore, usePermissionStore
````

## File: modules/notion/interfaces/database/_actions/database.actions.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: interfaces/_actions
 * Purpose: Database, Record, View, and Automation server actions.
 */
⋮----
import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  makeAutomationRepo,
  makeDatabaseRepo,
  makeRecordRepo,
  makeViewRepo,
} from "../composition/repositories";
import {
  CreateDatabaseUseCase,
  UpdateDatabaseUseCase,
  AddFieldUseCase,
  ArchiveDatabaseUseCase,
  CreateRecordUseCase,
  UpdateRecordUseCase,
  DeleteRecordUseCase,
  CreateViewUseCase,
  UpdateViewUseCase,
  DeleteViewUseCase,
  CreateAutomationUseCase,
  UpdateAutomationUseCase,
  DeleteAutomationUseCase,
} from "../../../subdomains/database/application/use-cases";
import type { CreateAutomationInput, UpdateAutomationInput } from "../../../subdomains/database/application/dto/database.dto";
import type {
  CreateDatabaseDto,
  UpdateDatabaseDto,
  AddFieldDto,
  ArchiveDatabaseDto,
  CreateRecordDto,
  UpdateRecordDto,
  CreateViewDto,
  UpdateViewDto,
  DeleteViewDto,
} from "../../../subdomains/database/application/dto/DatabaseDto";
⋮----
// — — — Database — — —
⋮----
export async function createDatabase(input: CreateDatabaseDto): Promise<CommandResult>
⋮----
export async function updateDatabase(input: UpdateDatabaseDto): Promise<CommandResult>
⋮----
export async function addDatabaseField(input: AddFieldDto): Promise<CommandResult>
⋮----
export async function archiveDatabase(input: ArchiveDatabaseDto): Promise<CommandResult>
⋮----
// — — — Record — — —
⋮----
export async function createRecord(input: CreateRecordDto): Promise<CommandResult>
⋮----
export async function updateRecord(input: UpdateRecordDto): Promise<CommandResult>
⋮----
export async function deleteRecord(accountId: string, id: string): Promise<CommandResult>
⋮----
// — — — View — — —
⋮----
export async function createView(input: CreateViewDto): Promise<CommandResult>
⋮----
export async function updateView(input: UpdateViewDto): Promise<CommandResult>
⋮----
export async function deleteView(input: DeleteViewDto): Promise<CommandResult>
⋮----
// — — — Automation — — —
⋮----
export async function createAutomation(input: CreateAutomationInput): Promise<CommandResult>
⋮----
export async function updateAutomation(input: UpdateAutomationInput): Promise<CommandResult>
⋮----
export async function deleteAutomation(id: string, accountId: string, databaseId: string): Promise<CommandResult>
````

## File: modules/notion/interfaces/database/_actions/index.ts
````typescript

````

## File: modules/notion/interfaces/database/components/DatabaseBoardPanel.tsx
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseBoardPanel ??Kanban board grouped by first select/multi_select field.
 */
⋮----
import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
⋮----
import { Button } from "@ui-shadcn/ui/button";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
⋮----
import { getRecords } from "../queries";
import { createRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../../subdomains/database/application/dto/database.dto";
⋮----
interface DatabaseBoardPanelProps {
  database: DatabaseSnapshot;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}
⋮----
function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown
⋮----
function getTitle(record: DatabaseRecordSnapshot): string
⋮----
function handleAdd(groupValue: string)
⋮----
function handleDelete(recordId: string)
````

## File: modules/notion/interfaces/database/components/DatabaseCalendarPanel.tsx
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseCalendarPanel ??month-grid calendar grouped by a date field.
 */
⋮----
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
⋮----
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";
⋮----
import { getRecords } from "../queries";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../../subdomains/database/application/dto/database.dto";
⋮----
interface DatabaseCalendarPanelProps {
  database: DatabaseSnapshot;
  accountId: string;
}
⋮----
function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown
⋮----
function prevMonth()
function nextMonth()
````

## File: modules/notion/interfaces/database/components/DatabaseDialog.tsx
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseDialog — modal for creating a new Database.
 */
⋮----
import { useState, useTransition } from "react";
⋮----
import { Button } from "@ui-shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";
⋮----
import { createDatabase } from "../_actions/database.actions";
⋮----
interface DatabaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
  onSuccess?: () => void;
}
⋮----
export function DatabaseDialog(
⋮----
function reset()
⋮----
function handleOpenChange(next: boolean)
⋮----
function handleSubmit(e: React.FormEvent)
⋮----
onChange=
````

## File: modules/notion/interfaces/database/components/DatabaseFormPanel.tsx
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseFormPanel ??public-facing form to collect one Record into a Database.
 */
⋮----
import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
⋮----
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";
⋮----
import { createRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, Field } from "../../../subdomains/database/application/dto/database.dto";
⋮----
interface DatabaseFormPanelProps {
  database: DatabaseSnapshot;
  accountId: string;
  workspaceId: string;
  /** The user submitting the form. Pass anonymous ID or guest token for public forms. */
  submitterId: string;
  /** Optional: restrict to a subset of fields. */
  fieldIds?: string[];
  title?: string;
  description?: string;
}
⋮----
/** The user submitting the form. Pass anonymous ID or guest token for public forms. */
⋮----
/** Optional: restrict to a subset of fields. */
⋮----
checked=
⋮----
onChange=
⋮----
function handleChange(fieldId: string, value: unknown)
⋮----
function handleSubmit(e: React.FormEvent)
⋮----
<Button variant="outline" size="sm" onClick=
````

## File: modules/notion/interfaces/database/components/DatabaseGalleryPanel.tsx
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseGalleryPanel ??card grid for database records.
 */
⋮----
import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
⋮----
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";
⋮----
import { getRecords } from "../queries";
import { createRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../../subdomains/database/application/dto/database.dto";
⋮----
interface DatabaseGalleryPanelProps {
  database: DatabaseSnapshot;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}
⋮----
function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown
⋮----
function handleAdd()
⋮----
function handleDelete(recordId: string)
⋮----
````

## File: modules/notion/interfaces/database/components/DatabaseListPanel.tsx
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseListPanel ??flat record list with fields as readable rows.
 */
⋮----
import { useCallback, useEffect, useState, useTransition } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
⋮----
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";
⋮----
import { getRecords } from "../queries";
import { createRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, DatabaseRecordSnapshot } from "../../../subdomains/database/application/dto/database.dto";
⋮----
interface DatabaseListPanelProps {
  database: DatabaseSnapshot;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}
⋮----
function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown
⋮----
function displayValue(val: unknown, type: string): string
⋮----
function toggleExpand(id: string)
⋮----
function handleAdd()
⋮----
function handleDelete(recordId: string)
````

## File: modules/notion/interfaces/database/components/DatabaseTablePanel.tsx
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseTablePanel ??spreadsheet-style table with inline cell editing.
 */
⋮----
import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
⋮----
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
⋮----
import { getRecords } from "../queries";
import { createRecord, updateRecord, deleteRecord } from "../_actions/database.actions";
import type { DatabaseSnapshot, Field, DatabaseRecordSnapshot } from "../../../subdomains/database/application/dto/database.dto";
⋮----
interface DatabaseTablePanelProps {
  database: DatabaseSnapshot;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}
⋮----
function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown
⋮----
function setProperty(record: DatabaseRecordSnapshot, fieldId: string, value: unknown): Record<string, unknown>
⋮----
function handleCellChange(recordId: string, fieldId: string, value: unknown)
⋮----
function handleCellBlur(record: DatabaseRecordSnapshot, fieldId: string)
⋮----
function handleAddRecord()
⋮----
function handleDeleteRecord(recordId: string)
````

## File: modules/notion/interfaces/database/components/index.ts
````typescript

````

## File: modules/notion/interfaces/database/composition/repositories.ts
````typescript
import { FirebaseAutomationRepository } from "../../../infrastructure/database/firebase/FirebaseAutomationRepository";
import { FirebaseDatabaseRecordRepository } from "../../../infrastructure/database/firebase/FirebaseDatabaseRecordRepository";
import { FirebaseDatabaseRepository } from "../../../infrastructure/database/firebase/FirebaseDatabaseRepository";
import { FirebaseViewRepository } from "../../../infrastructure/database/firebase/FirebaseViewRepository";
⋮----
export function makeDatabaseRepo()
⋮----
export function makeRecordRepo()
⋮----
export function makeViewRepo()
⋮----
export function makeAutomationRepo()
````

## File: modules/notion/interfaces/database/queries/index.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: interfaces/queries
 * Purpose: Read-side queries for database, record, view, and automation data.
 */
⋮----
import {
  makeAutomationRepo,
  makeDatabaseRepo,
  makeRecordRepo,
  makeViewRepo,
} from "../composition/repositories";
import type { DatabaseSnapshot, DatabaseRecordSnapshot, ViewSnapshot, DatabaseAutomationSnapshot } from "../../../subdomains/database/application/dto/database.dto";
⋮----
export async function getDatabases(accountId: string, workspaceId: string): Promise<DatabaseSnapshot[]>
⋮----
export async function getDatabase(accountId: string, databaseId: string): Promise<DatabaseSnapshot | null>
⋮----
export async function getRecords(accountId: string, databaseId: string): Promise<DatabaseRecordSnapshot[]>
⋮----
export async function getViews(accountId: string, databaseId: string): Promise<ViewSnapshot[]>
⋮----
export async function getAutomations(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]>
````

## File: modules/notion/interfaces/database/store/index.ts
````typescript
// TODO: export useDatabaseStore, useRecordStore
````

## File: modules/notion/interfaces/knowledge/_actions/index.ts
````typescript

````

## File: modules/notion/interfaces/knowledge/_actions/knowledge-block.actions.ts
````typescript
import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeBlockRepo } from "../composition/repositories";
import {
  AddContentBlockUseCase,
  UpdateContentBlockUseCase,
  DeleteContentBlockUseCase,
} from "../../../subdomains/knowledge/application/queries/content-block.queries";
import type { AddKnowledgeBlockDto as AddContentBlockDto, UpdateKnowledgeBlockDto as UpdateContentBlockDto, DeleteKnowledgeBlockDto as DeleteContentBlockDto } from "../../../subdomains/knowledge/application/dto/ContentBlockDto";
⋮----
export async function addKnowledgeBlock(input: AddContentBlockDto): Promise<CommandResult>
⋮----
export async function updateKnowledgeBlock(input: UpdateContentBlockDto): Promise<CommandResult>
⋮----
export async function deleteKnowledgeBlock(input: DeleteContentBlockDto): Promise<CommandResult>
````

## File: modules/notion/interfaces/knowledge/components/BlockEditorPanel.tsx
````typescript
import { useRef } from "react";
import { useBlockEditorStore } from "../store/block-editor.store";
import { richTextToPlainText } from "../../../subdomains/knowledge/application/dto/knowledge.dto";
⋮----
/**
 * Notion knowledge subdomain ??minimal block editor.
 * Full drag-and-drop and rich block types are in the extensions/ layer.
 */
⋮----
function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>, blockId: string)
⋮----
function handleInput(e: React.FormEvent<HTMLDivElement>, blockId: string)
````

## File: modules/notion/interfaces/knowledge/components/KnowledgePageHeaderWidgets.tsx
````typescript
import { useEffect, useRef, useState } from "react";
import { Check, ImageIcon, Pencil, Smile } from "lucide-react";
⋮----
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@ui-shadcn/ui/popover";
⋮----
// ── Title editor ──────────────────────────────────────────────────────────────
⋮----
export interface TitleEditorProps {
  initialTitle: string;
  onSave: (title: string) => void;
  isPending: boolean;
}
⋮----
export function TitleEditor(
⋮----
function startEdit()
⋮----
function commit()
⋮----
function handleKeyDown(e: React.KeyboardEvent)
⋮----
// ── Icon picker ───────────────────────────────────────────────────────────────
⋮----
export interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
  isPending: boolean;
}
⋮----
onClick=
⋮----
// ── Cover editor ──────────────────────────────────────────────────────────────
⋮----
<Popover open=
````

## File: modules/notion/interfaces/knowledge/components/PageDialog.tsx
````typescript
import { useState, useTransition } from "react";
import { Button } from "@ui-shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { createKnowledgePage } from "../_actions/knowledge-page.actions";
⋮----
interface PageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
  parentPageId?: string | null;
  onSuccess?: (pageId?: string) => void;
}
⋮----
export function PageDialog(
⋮----
function reset()
function handleOpenChange(next: boolean)
⋮----
function handleSubmit(e: React.FormEvent)
⋮----
<Input id="page-title" placeholder="頁面標題" value=
⋮----
<Button variant="outline" size="sm" onClick=
````

## File: modules/notion/interfaces/knowledge/components/PageEditorPanel.tsx
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/components
 * Purpose: PageEditorPanel ??renders the block editor for a knowledge page.
 *          Connects accountId/pageId context to BlockEditorPanel.
 */
⋮----
import { useEffect, useCallback } from "react";
import { useBlockEditorStore } from "../store/block-editor.store";
import { getKnowledgeBlocks } from "../queries";
import { BlockEditorPanel } from "./BlockEditorPanel";
⋮----
export interface PageEditorPanelProps {
  accountId: string;
  pageId: string;
}
⋮----
export function PageEditorPanel(
````

## File: modules/notion/interfaces/knowledge/components/PageTreePanel.tsx
````typescript
import { ChevronDown, ChevronRight, FilePlus, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@ui-shadcn/ui/button";
import type { KnowledgePageTreeNode } from "../../../subdomains/knowledge/application/dto/knowledge.dto";
import { PageDialog } from "./PageDialog";
⋮----
export interface PageTreePanelProps {
  nodes: KnowledgePageTreeNode[];
  accountId: string;
  workspaceId?: string;
  currentUserId: string;
  allowCreate?: boolean;
  emptyStateDescription?: string;
  onPageClick?: (pageId: string) => void;
  onCreated?: () => void;
}
⋮----
<button type="button" className="invisible shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground group-hover:visible" onClick=
````

## File: modules/notion/interfaces/knowledge/composition/repositories.ts
````typescript
import { FirebaseContentBlockRepository } from "../../../infrastructure/knowledge/firebase/FirebaseContentBlockRepository";
import { FirebaseKnowledgeCollectionRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgeCollectionRepository";
import { FirebaseKnowledgePageRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgePageRepository";
⋮----
export function makePageRepo()
⋮----
export function makeBlockRepo()
⋮----
export function makeCollectionRepo()
````

## File: modules/notion/interfaces/knowledge/queries/index.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/queries
 * Purpose: Server-side read helpers for the knowledge subdomain.
 */
⋮----
import { makeBlockRepo, makeCollectionRepo, makePageRepo } from "../composition/repositories";
import {
  GetKnowledgePageUseCase,
  ListKnowledgePagesUseCase,
  ListKnowledgePagesByWorkspaceUseCase,
  GetKnowledgePageTreeUseCase,
  GetKnowledgePageTreeByWorkspaceUseCase,
} from "../../../subdomains/knowledge/application/queries/knowledge-page.queries";
import { ListContentBlocksUseCase } from "../../../subdomains/knowledge/application/queries/content-block.queries";
import {
  GetKnowledgeCollectionUseCase,
  ListKnowledgeCollectionsUseCase,
} from "../../../subdomains/knowledge/application/queries/knowledge-collection.queries";
import type { KnowledgePageSnapshot, ContentBlockSnapshot, KnowledgeCollectionSnapshot } from "../../../subdomains/knowledge/application/dto/knowledge.dto";
⋮----
export async function getKnowledgePage(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null>
⋮----
export async function getKnowledgePages(accountId: string): Promise<KnowledgePageSnapshot[]>
⋮----
export async function getKnowledgePagesByWorkspace(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]>
⋮----
export async function getKnowledgePageTree(accountId: string)
⋮----
export async function getKnowledgePageTreeByWorkspace(accountId: string, workspaceId: string)
⋮----
export async function getKnowledgeBlocks(accountId: string, pageId: string): Promise<ContentBlockSnapshot[]>
⋮----
export async function getKnowledgeCollection(accountId: string, collectionId: string): Promise<KnowledgeCollectionSnapshot | null>
⋮----
export async function getKnowledgeCollections(accountId: string): Promise<KnowledgeCollectionSnapshot[]>
````

## File: modules/notion/interfaces/relations/composition/repositories.ts
````typescript
import { FirebaseRelationRepository } from "../../../infrastructure/relations/firebase/FirebaseRelationRepository";
⋮----
export function makeRelationRepo()
````

## File: modules/notion/interfaces/taxonomy/composition/repositories.ts
````typescript
import { FirebaseTaxonomyRepository } from "../../../infrastructure/taxonomy/firebase/FirebaseTaxonomyRepository";
⋮----
export function makeTaxonomyRepo()
````

## File: modules/notion/subdomains/authoring/api/server.ts
````typescript
/**
 * authoring subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */
````

## File: modules/notion/subdomains/authoring/application/dto/ArticleDto.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: application/dto
 * Purpose: Zod schemas for Article CQRS inputs.
 */
⋮----
import { z } from "@lib-zod";
````

## File: modules/notion/subdomains/authoring/application/dto/authoring.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the authoring subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
````

## File: modules/notion/subdomains/authoring/application/dto/CategoryDto.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: application/dto
 * Purpose: Zod schemas for Category CQRS inputs.
 */
⋮----
import { z } from "@lib-zod";
````

## File: modules/notion/subdomains/authoring/application/dto/index.ts
````typescript

````

## File: modules/notion/subdomains/authoring/domain/aggregates/Category.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: domain/aggregates
 * Purpose: Category aggregate root — hierarchical article organisation.
 */
⋮----
import type { NotionDomainEvent } from "../events/NotionDomainEvent";
⋮----
export interface CategorySnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly slug: string;
  readonly parentCategoryId: string | null;
  readonly depth: number;
  readonly articleIds: readonly string[];
  readonly description: string | null;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateCategoryInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly parentCategoryId: string | null;
  readonly depth: number;
  readonly description: string | null;
  readonly createdByUserId: string;
}
⋮----
export class Category {
⋮----
private constructor(private _props: CategorySnapshot)
⋮----
static create(id: string, input: CreateCategoryInput): Category
⋮----
static reconstitute(snapshot: CategorySnapshot): Category
⋮----
rename(newName: string): void
⋮----
move(newParentId: string | null, newDepth: number): void
⋮----
getSnapshot(): CategorySnapshot
⋮----
pullDomainEvents(): NotionDomainEvent[]
⋮----
get id(): string
get accountId(): string
````

## File: modules/notion/subdomains/authoring/domain/aggregates/index.ts
````typescript

````

## File: modules/notion/subdomains/authoring/domain/events/index.ts
````typescript
// Domain events are inlined in the Article aggregate as NotionDomainEvent payloads.
// Event types surfaced here for listener/consumer use.
````

## File: modules/notion/subdomains/authoring/domain/events/NotionDomainEvent.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: domain/events
 * Purpose: Base interface for Notion Authoring domain events.
 */
⋮----
export interface NotionDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string; // ISO 8601 string
  readonly type: string;
  readonly payload: object;
}
⋮----
readonly occurredAt: string; // ISO 8601 string
````

## File: modules/notion/subdomains/authoring/domain/services/index.ts
````typescript
// No domain services required for initial authoring subdomain scope.
````

## File: modules/notion/subdomains/authoring/domain/value-objects/index.ts
````typescript
// Value types are co-located in aggregates (Article.ts, Category.ts).
// Re-export for convenience:
````

## File: modules/notion/subdomains/authoring/README.md
````markdown
# Authoring

知識庫文章建立、驗證與分類。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
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

## File: modules/notion/subdomains/collaboration/api/server.ts
````typescript
/**
 * collaboration subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */
````

## File: modules/notion/subdomains/collaboration/application/dto/CollaborationDto.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: application/dto
 * Purpose: Zod schemas and DTO types for comment, version, and permission operations.
 */
⋮----
import { z } from "@lib-zod";
⋮----
// ── Comment ───────────────────────────────────────────────────────────────────
⋮----
export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;
⋮----
export type UpdateCommentDto = z.infer<typeof UpdateCommentSchema>;
⋮----
export type ResolveCommentDto = z.infer<typeof ResolveCommentSchema>;
⋮----
export type DeleteCommentDto = z.infer<typeof DeleteCommentSchema>;
⋮----
// ── Version ───────────────────────────────────────────────────────────────────
⋮----
export type CreateVersionDto = z.infer<typeof CreateVersionSchema>;
⋮----
export type DeleteVersionDto = z.infer<typeof DeleteVersionSchema>;
⋮----
// ── Permission ────────────────────────────────────────────────────────────────
⋮----
export type GrantPermissionDto = z.infer<typeof GrantPermissionSchema>;
⋮----
export type RevokePermissionDto = z.infer<typeof RevokePermissionSchema>;
````

## File: modules/notion/subdomains/collaboration/application/dto/index.ts
````typescript

````

## File: modules/notion/subdomains/collaboration/domain/aggregates/Comment.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/aggregates
 * Aggregate root: Comment
 *
 * Represents an inline or block-level comment on a knowledge page or article.
 * Supports threaded replies (parentCommentId) and rich-text selection anchors.
 */
⋮----
export type ContentType = "page" | "article";
⋮----
export interface SelectionRange {
  from: number;
  to: number;
}
⋮----
export interface CommentSnapshot {
  readonly id: string;
  readonly contentId: string;
  readonly contentType: ContentType;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly authorId: string;
  readonly body: string;
  readonly parentCommentId: string | null;
  readonly blockId: string | null;
  readonly selectionRange: SelectionRange | null;
  readonly resolvedAt: string | null;
  readonly resolvedByUserId: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export type CommentId = string;
````

## File: modules/notion/subdomains/collaboration/domain/aggregates/index.ts
````typescript

````

## File: modules/notion/subdomains/collaboration/domain/aggregates/Permission.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/aggregates
 * Aggregate root: Permission
 *
 * Governs access to a knowledge subject (page | article | database).
 * Supports link-based sharing via linkToken.
 */
⋮----
export type PermissionLevel = "view" | "comment" | "edit" | "full";
export type PrincipalType = "user" | "team" | "public" | "link";
⋮----
export interface PermissionSnapshot {
  readonly id: string;
  readonly subjectId: string;
  readonly subjectType: "page" | "article" | "database";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly principalId: string;
  readonly principalType: PrincipalType;
  readonly level: PermissionLevel;
  readonly grantedByUserId: string;
  readonly grantedAtISO: string;
  readonly expiresAtISO: string | null;
  readonly linkToken: string | null;
}
⋮----
export type PermissionId = string;
````

## File: modules/notion/subdomains/collaboration/domain/aggregates/Version.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/aggregates
 * Aggregate root: Version
 *
 * Represents a named snapshot of a knowledge page or article captured at a point in time.
 * Allows users to restore prior states of content.
 */
⋮----
export interface VersionSnapshot {
  readonly id: string;
  readonly contentId: string;
  readonly contentType: "page" | "article";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly snapshotBlocks: unknown[];
  readonly label: string | null;
  readonly description: string | null;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
}
⋮----
export type VersionId = string;
````

## File: modules/notion/subdomains/collaboration/domain/events/index.ts
````typescript

````

## File: modules/notion/subdomains/collaboration/domain/services/index.ts
````typescript
/**
 * Domain services for the collaboration subdomain.
 * Deferred: PermissionResolutionService and VersionRetentionService
 * will be defined when permission and versioning use cases are scoped.
 */
````

## File: modules/notion/subdomains/collaboration/domain/value-objects/index.ts
````typescript
/**
 * Value objects for the collaboration subdomain.
 * Deferred: CommentId, PermissionId, VersionId, ContentId, PermissionLevel
 * will be defined when collaboration use cases are scoped.
 */
````

## File: modules/notion/subdomains/collaboration/README.md
````markdown
# Collaboration

協作留言、細粒度權限與版本快照。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
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

## File: modules/notion/subdomains/database/api/server.ts
````typescript
/**
 * database subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */
````

## File: modules/notion/subdomains/database/application/dto/DatabaseDto.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: application/dto
 * Purpose: Zod validation schemas for all database, record, and view commands.
 */
⋮----
import { z } from "@lib-zod";
⋮----
// ----- Shared scope -----
⋮----
// ----- Database -----
⋮----
export type CreateDatabaseDto = z.infer<typeof CreateDatabaseSchema>;
⋮----
export type UpdateDatabaseDto = z.infer<typeof UpdateDatabaseSchema>;
⋮----
export type AddFieldDto = z.infer<typeof AddFieldSchema>;
⋮----
export type ArchiveDatabaseDto = z.infer<typeof ArchiveDatabaseSchema>;
⋮----
export type GetDatabaseDto = z.infer<typeof GetDatabaseSchema>;
⋮----
export type ListDatabasesDto = z.infer<typeof ListDatabasesSchema>;
⋮----
// ----- Record -----
⋮----
export type CreateRecordDto = z.infer<typeof CreateRecordSchema>;
⋮----
export type UpdateRecordDto = z.infer<typeof UpdateRecordSchema>;
⋮----
export type DeleteRecordDto = z.infer<typeof DeleteRecordSchema>;
⋮----
export type ListRecordsDto = z.infer<typeof ListRecordsSchema>;
⋮----
// ----- View -----
⋮----
export type CreateViewDto = z.infer<typeof CreateViewSchema>;
⋮----
export type UpdateViewDto = z.infer<typeof UpdateViewSchema>;
⋮----
export type DeleteViewDto = z.infer<typeof DeleteViewSchema>;
⋮----
export type ListViewsDto = z.infer<typeof ListViewsSchema>;
````

## File: modules/notion/subdomains/database/application/dto/index.ts
````typescript

````

## File: modules/notion/subdomains/database/domain/aggregates/Database.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/aggregates
 * Purpose: Database aggregate root — structured data container with named fields.
 */
⋮----
export type FieldType =
  | "text"
  | "number"
  | "select"
  | "multi_select"
  | "date"
  | "checkbox"
  | "url"
  | "email"
  | "relation"
  | "formula"
  | "rollup";
⋮----
export interface Field {
  id: string;
  name: string;
  type: FieldType;
  config: Record<string, unknown>;
  required: boolean;
  order: number;
}
⋮----
export interface DatabaseSnapshot {
  id: string;
  workspaceId: string;
  accountId: string;
  name: string;
  description: string | null;
  fields: Field[];
  viewIds: string[];
  icon: string | null;
  coverImageUrl: string | null;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
⋮----
export type DatabaseId = string;
export type FieldId = string;
````

## File: modules/notion/subdomains/database/domain/aggregates/DatabaseRecord.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/aggregates
 * Purpose: DatabaseRecord aggregate — a single row in a Database, optionally linked to a page.
 */
⋮----
export interface DatabaseRecordSnapshot {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;
  /** Links this record to a KnowledgePage (Article-Record identity pattern). */
  pageId: string | null;
  properties: Record<string, unknown>;
  order: number;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
⋮----
/** Links this record to a KnowledgePage (Article-Record identity pattern). */
⋮----
export type RecordId = string;
````

## File: modules/notion/subdomains/database/domain/aggregates/index.ts
````typescript

````

## File: modules/notion/subdomains/database/domain/aggregates/View.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/aggregates
 * Purpose: View aggregate — configures how records are displayed in a Database.
 */
⋮----
export type ViewType = "table" | "board" | "list" | "calendar" | "timeline" | "gallery";
⋮----
export interface FilterRule {
  fieldId: string;
  operator: "eq" | "neq" | "contains" | "not_contains" | "is_empty" | "is_not_empty" | "gt" | "lt";
  value: unknown;
}
⋮----
export interface SortRule {
  fieldId: string;
  direction: "asc" | "desc";
}
⋮----
export interface ViewSnapshot {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;
  name: string;
  type: ViewType;
  filters: FilterRule[];
  sorts: SortRule[];
  groupBy: { fieldId: string; direction: "asc" | "desc" } | null;
  visibleFieldIds: string[];
  hiddenFieldIds: string[];
  boardGroupFieldId: string | null;
  calendarDateFieldId: string | null;
  timelineStartFieldId: string | null;
  timelineEndFieldId: string | null;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
⋮----
export type ViewId = string;
````

## File: modules/notion/subdomains/database/domain/events/index.ts
````typescript

````

## File: modules/notion/subdomains/database/domain/services/index.ts
````typescript
/**
 * Domain services for the database subdomain.
 * Deferred: DatabaseQueryService, FormulaEvaluationService, RollupComputationService
 * will be defined when filter/sort/formula use cases are scoped.
 */
````

## File: modules/notion/subdomains/database/domain/value-objects/index.ts
````typescript
/**
 * Value objects for the database subdomain.
 * Deferred: DatabaseId, RecordId, ViewId, FieldId, FieldType, ViewType, FieldValue
 * will be defined when database record and view use cases are scoped.
 */
````

## File: modules/notion/subdomains/database/README.md
````markdown
# Database

結構化資料多視圖管理。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
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

## File: modules/notion/subdomains/knowledge/application/dto/ContentBlockDto.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for ContentBlock use cases.
 */
⋮----
import { z } from "@lib-zod";
import { BLOCK_TYPES } from "../../domain/value-objects/BlockContent";
⋮----
export type BlockContentDto = z.infer<typeof BlockContentSchema>;
⋮----
export type AddKnowledgeBlockDto = z.infer<typeof AddKnowledgeBlockSchema>;
⋮----
export type UpdateKnowledgeBlockDto = z.infer<typeof UpdateKnowledgeBlockSchema>;
⋮----
export type DeleteKnowledgeBlockDto = z.infer<typeof DeleteKnowledgeBlockSchema>;
⋮----
export type NestKnowledgeBlockDto = z.infer<typeof NestKnowledgeBlockSchema>;
⋮----
export type UnnestKnowledgeBlockDto = z.infer<typeof UnnestKnowledgeBlockSchema>;
````

## File: modules/notion/subdomains/knowledge/application/dto/index.ts
````typescript

````

## File: modules/notion/subdomains/knowledge/application/dto/KnowledgeCollectionDto.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for KnowledgeCollection use cases.
 */
⋮----
import { z } from "@lib-zod";
⋮----
export type CollectionColumnTypeDto = z.infer<typeof CollectionColumnTypeSchema>;
⋮----
export type CollectionColumnInputDto = z.infer<typeof CollectionColumnInputSchema>;
⋮----
export type CreateKnowledgeCollectionDto = z.infer<typeof CreateKnowledgeCollectionSchema>;
⋮----
export type RenameKnowledgeCollectionDto = z.infer<typeof RenameKnowledgeCollectionSchema>;
⋮----
export type AddPageToCollectionDto = z.infer<typeof AddPageToCollectionSchema>;
⋮----
export type RemovePageFromCollectionDto = z.infer<typeof RemovePageFromCollectionSchema>;
⋮----
export type AddCollectionColumnDto = z.infer<typeof AddCollectionColumnSchema>;
⋮----
export type ArchiveKnowledgeCollectionDto = z.infer<typeof ArchiveKnowledgeCollectionSchema>;
````

## File: modules/notion/subdomains/knowledge/application/dto/KnowledgePageDto.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for KnowledgePage use cases.
 */
⋮----
import { z } from "@lib-zod";
⋮----
export type CreateKnowledgePageDto = z.infer<typeof CreateKnowledgePageSchema>;
⋮----
export type RenameKnowledgePageDto = z.infer<typeof RenameKnowledgePageSchema>;
⋮----
export type MoveKnowledgePageDto = z.infer<typeof MoveKnowledgePageSchema>;
⋮----
export type ArchiveKnowledgePageDto = z.infer<typeof ArchiveKnowledgePageSchema>;
⋮----
export type ReorderKnowledgePageBlocksDto = z.infer<typeof ReorderKnowledgePageBlocksSchema>;
⋮----
export type ApproveKnowledgePageDto = z.infer<typeof ApproveKnowledgePageSchema>;
⋮----
export type CreateKnowledgeVersionDto = z.infer<typeof CreateKnowledgeVersionSchema>;
````

## File: modules/notion/subdomains/knowledge/application/dto/KnowledgePageLifecycleDto.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for knowledge page lifecycle use cases.
 */
⋮----
import { z } from "@lib-zod";
⋮----
export type VerifyKnowledgePageDto = z.infer<typeof VerifyKnowledgePageSchema>;
⋮----
export type RequestPageReviewDto = z.infer<typeof RequestPageReviewSchema>;
⋮----
export type AssignPageOwnerDto = z.infer<typeof AssignPageOwnerSchema>;
⋮----
export type UpdatePageIconDto = z.infer<typeof UpdatePageIconSchema>;
⋮----
export type UpdatePageCoverDto = z.infer<typeof UpdatePageCoverSchema>;
````

## File: modules/notion/subdomains/knowledge/application/queries/knowledge-version.queries.ts
````typescript
import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { CreateKnowledgeVersionDto } from "../dto/KnowledgePageDto";
import { CreateKnowledgeVersionSchema } from "../dto/KnowledgePageDto";
⋮----
export class PublishKnowledgeVersionUseCase {
⋮----
async execute(input: CreateKnowledgeVersionDto): Promise<CommandResult>
⋮----
export class ListKnowledgeVersionsUseCase {
⋮----
async execute(_accountId: string, _pageId: string): Promise<never[]>
````

## File: modules/notion/subdomains/knowledge/domain/aggregates/BacklinkIndex.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/aggregates
 * Purpose: BacklinkIndex — read model tracking which pages reference a given page.
 */
⋮----
export interface BacklinkEntry {
  readonly sourcePageId: string;
  readonly sourcePageTitle: string;
  readonly blockId: string;
  readonly lastSeenAtISO: string;
}
⋮----
export interface BacklinkIndexSnapshot {
  readonly targetPageId: string;
  readonly accountId: string;
  readonly entries: ReadonlyArray<BacklinkEntry>;
  readonly updatedAtISO: string;
}
⋮----
export class BacklinkIndex {
⋮----
private constructor(private readonly _props: BacklinkIndexSnapshot)
⋮----
static reconstitute(snapshot: BacklinkIndexSnapshot): BacklinkIndex
⋮----
get targetPageId(): string
get accountId(): string
get entries(): ReadonlyArray<BacklinkEntry>
get updatedAtISO(): string
⋮----
getSnapshot(): Readonly<BacklinkIndexSnapshot>
````

## File: modules/notion/subdomains/knowledge/domain/aggregates/index.ts
````typescript

````

## File: modules/notion/subdomains/knowledge/domain/events/index.ts
````typescript

````

## File: modules/notion/subdomains/knowledge/domain/events/NotionDomainEvent.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/events
 * Purpose: Base interface for Notion Knowledge domain events.
 */
⋮----
export interface NotionDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string; // ISO 8601 string
  readonly type: string;
  readonly payload: object;
}
⋮----
readonly occurredAt: string; // ISO 8601 string
````

## File: modules/notion/subdomains/knowledge/domain/services/BacklinkExtractorService.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/services
 * Purpose: BacklinkExtractorService — domain service that extracts page IDs mentioned in block content.
 */
⋮----
import type { ContentBlockSnapshot } from "../aggregates/ContentBlock";
import { extractMentionedPageIds } from "../value-objects/BlockContent";
⋮----
export interface BacklinkMention {
  readonly targetPageId: string;
  readonly blockId: string;
  readonly lastSeenAtISO: string;
}
⋮----
export class BacklinkExtractorService {
⋮----
/**
   * Extract all page mentions from a list of block snapshots.
   * Returns a map of targetPageId -> list of mentions.
   */
extractMentions(
    blocks: ReadonlyArray<ContentBlockSnapshot>,
): ReadonlyMap<string, ReadonlyArray<
````

## File: modules/notion/subdomains/knowledge/domain/services/index.ts
````typescript

````

## File: modules/notion/subdomains/knowledge/domain/value-objects/ApprovalState.ts
````typescript
import { z } from "@lib-zod";
⋮----
export type ApprovalState = z.infer<typeof ApprovalStateSchema>;
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/BlockContent.ts
````typescript
/**
 * Module: notion
 * Layer: domain/value-objects
 * Purpose: BlockContent value object — immutable typed content snapshot for a Block.
 *
 * Re-implementation of the original knowledge domain block-content.
 * This is a VALUE OBJECT: equality is determined by value, not identity.
 */
⋮----
// ── RichText Annotation Model ─────────────────────────────────────────────────
⋮----
export type RichTextSpanType = "text" | "mention_page" | "mention_user" | "link";
⋮----
export interface TextAnnotations {
  readonly bold?: boolean;
  readonly italic?: boolean;
  readonly underline?: boolean;
  readonly strikethrough?: boolean;
  readonly code?: boolean;
  readonly color?: string;
}
⋮----
interface BaseRichTextSpan {
  readonly annotations?: TextAnnotations;
}
⋮----
export interface TextSpan extends BaseRichTextSpan {
  readonly type: "text";
  readonly plainText: string;
}
⋮----
export interface MentionPageSpan extends BaseRichTextSpan {
  readonly type: "mention_page";
  readonly pageId: string;
  readonly label: string;
}
⋮----
export interface MentionUserSpan extends BaseRichTextSpan {
  readonly type: "mention_user";
  readonly userId: string;
  readonly displayName: string;
}
⋮----
export interface LinkSpan extends BaseRichTextSpan {
  readonly type: "link";
  readonly url: string;
  readonly label: string;
}
⋮----
export type RichTextSpan = TextSpan | MentionPageSpan | MentionUserSpan | LinkSpan;
⋮----
export function richTextToPlainText(spans: ReadonlyArray<RichTextSpan>): string
⋮----
export function extractMentionedPageIds(spans: ReadonlyArray<RichTextSpan>): ReadonlyArray<string>
⋮----
export function extractMentionedUserIds(spans: ReadonlyArray<RichTextSpan>): ReadonlyArray<string>
⋮----
// ── Block types ───────────────────────────────────────────────────────────────
⋮----
export type BlockType =
  | "text"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "image"
  | "code"
  | "bullet-list"
  | "numbered-list"
  | "divider"
  | "quote"
  | "callout"
  | "toggle"
  | "toc"
  | "synced";
⋮----
export interface BlockContent {
  readonly type: BlockType;
  readonly richText: ReadonlyArray<RichTextSpan>;
  readonly properties?: Readonly<Record<string, unknown>>;
}
⋮----
export function blockContentEquals(a: BlockContent, b: BlockContent): boolean
⋮----
const sortedKeys = (obj: Record<string, unknown>): string
⋮----
export function emptyTextBlockContent(): BlockContent
⋮----
export function plainTextBlockContent(text: string, type: BlockType = "text"): BlockContent
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/BlockId.ts
````typescript
import { z } from "@lib-zod";
⋮----
export type BlockId = z.infer<typeof BlockIdSchema>;
⋮----
export function createBlockId(id: string): BlockId
⋮----
export function unsafeBlockId(id: string): BlockId
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/CollectionId.ts
````typescript
import { z } from "@lib-zod";
⋮----
export type CollectionId = z.infer<typeof CollectionIdSchema>;
⋮----
export function createCollectionId(id: string): CollectionId
⋮----
export function unsafeCollectionId(id: string): CollectionId
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/index.ts
````typescript

````

## File: modules/notion/subdomains/knowledge/domain/value-objects/PageId.ts
````typescript
import { z } from "@lib-zod";
⋮----
export type PageId = z.infer<typeof PageIdSchema>;
⋮----
export function createPageId(id: string): PageId
⋮----
export function unsafePageId(id: string): PageId
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/PageStatus.ts
````typescript
import { z } from "@lib-zod";
⋮----
export type PageStatus = z.infer<typeof PageStatusSchema>;
````

## File: modules/notion/subdomains/knowledge/domain/value-objects/VerificationState.ts
````typescript
import { z } from "@lib-zod";
⋮----
export type VerificationState = z.infer<typeof VerificationStateSchema>;
````

## File: modules/notion/subdomains/knowledge/README.md
````markdown
# Knowledge

頁面建立、組織、版本化與交付。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
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

## File: modules/notion/subdomains/relations/api/server.ts
````typescript
/**
 * relations subdomain - server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */
````

## File: modules/notion/subdomains/relations/application/dto/RelationDto.ts
````typescript
/**
 * Module: notion/subdomains/relations
 * Layer: application/dto
 * Purpose: Input/output contracts for relation operations.
 */
⋮----
export interface CreateRelationDto {
  readonly sourceArtifactId: string;
  readonly targetArtifactId: string;
  readonly relationType: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
}
⋮----
export interface RelationDto {
  readonly relationId: string;
  readonly sourceArtifactId: string;
  readonly targetArtifactId: string;
  readonly relationType: string;
  readonly direction: "forward" | "backward";
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly createdAtISO: string;
}
````

## File: modules/notion/subdomains/relations/domain/entities/Relation.ts
````typescript
/**
 * Module: notion/subdomains/relations
 * Layer: domain/entities
 * Purpose: Relation — a typed link between two knowledge artifacts.
 *
 * Canonical boundary: relations own backlinks, forward links, and reference graphs.
 * knowledge subdomain already has BacklinkIndex — future convergence or delegation TBD.
 */
⋮----
export type RelationDirection = "forward" | "backward";
⋮----
export interface Relation {
  readonly relationId: string;
  readonly sourceArtifactId: string;
  readonly targetArtifactId: string;
  readonly relationType: string;
  readonly direction: RelationDirection;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly createdAtISO: string;
}
⋮----
export interface CreateRelationInput {
  readonly sourceArtifactId: string;
  readonly targetArtifactId: string;
  readonly relationType: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
}
````

## File: modules/notion/subdomains/relations/README.md
````markdown
# Relations

建立內容之間關聯與 backlink 的正典邊界。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Recommended Gap
- **Status**: Active — domain + application + infrastructure adapter + composition wired

## Layers

| Layer | Purpose |
|-------|----------|
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

## File: modules/notion/subdomains/taxonomy/api/server.ts
````typescript
/**
 * taxonomy subdomain - server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */
````

## File: modules/notion/subdomains/taxonomy/application/dto/TaxonomyDto.ts
````typescript
/**
 * Module: notion/subdomains/taxonomy
 * Layer: application/dto
 * Purpose: Input/output contracts for taxonomy operations.
 */
⋮----
export interface CreateTaxonomyNodeDto {
  readonly label: string;
  readonly parentNodeId: string | null;
  readonly organizationId: string;
  readonly workspaceId?: string;
}
⋮----
export interface TaxonomyNodeDto {
  readonly nodeId: string;
  readonly label: string;
  readonly parentNodeId: string | null;
  readonly path: readonly string[];
  readonly depth: number;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: modules/notion/subdomains/taxonomy/domain/entities/TaxonomyNode.ts
````typescript
/**
 * Module: notion/subdomains/taxonomy
 * Layer: domain/entities
 * Purpose: TaxonomyNode — a node in a hierarchical classification system.
 *
 * Canonical boundary: taxonomy owns classification hierarchy and semantic tags.
 * notion/knowledge may reference taxonomy via TaxonomyHint published language.
 */
⋮----
export interface TaxonomyNode {
  readonly nodeId: string;
  readonly label: string;
  readonly parentNodeId: string | null;
  readonly path: readonly string[];
  readonly depth: number;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateTaxonomyNodeInput {
  readonly label: string;
  readonly parentNodeId: string | null;
  readonly organizationId: string;
  readonly workspaceId?: string;
}
````

## File: modules/notion/subdomains/taxonomy/README.md
````markdown
# Taxonomy

建立分類法與語義組織的正典邊界。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Recommended Gap
- **Status**: Active — domain + application + infrastructure adapter + composition wired

## Layers

| Layer | Purpose |
|-------|----------|
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

## File: modules/notion/api/ui.ts
````typescript
/**
 * notion/api/ui.ts
 *
 * UI-only surface for notion bounded-context components.
 * Semantic capabilities remain in notion/api/index.ts.
 */
````

## File: modules/notion/application/dto/index.ts
````typescript
// relations and taxonomy currently expose no DTO barrel.
````

## File: modules/notion/index.ts
````typescript
/**
 * platform — Public module entry point.
 * All cross-module consumers must import through this file or modules/platform/api/.
 */
````

## File: modules/notion/infrastructure/knowledge/ai/index.ts
````typescript

````

## File: modules/notion/infrastructure/knowledge/index.ts
````typescript

````

## File: modules/notion/interfaces/authoring/_actions/article.actions.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/_actions
 * Purpose: Article Server Actions — thin adapter over article use cases.
 */
⋮----
import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeArticleRepo } from "../composition/repositories";
import {
  CreateArticleUseCase,
  UpdateArticleUseCase,
  ArchiveArticleUseCase,
  DeleteArticleUseCase,
} from "../../../subdomains/authoring/application/use-cases/manage-article-lifecycle.use-cases";
import { PublishArticleUseCase } from "../../../subdomains/authoring/application/use-cases/manage-article-publication.use-cases";
import {
  VerifyArticleUseCase,
  RequestArticleReviewUseCase,
} from "../../../subdomains/authoring/application/use-cases/verify-article.use-cases";
import type { z } from "@lib-zod";
import type {
  CreateArticleSchema,
  UpdateArticleSchema,
  PublishArticleSchema,
  ArchiveArticleSchema,
  VerifyArticleSchema,
  RequestArticleReviewSchema,
  DeleteArticleSchema,
} from "../../../subdomains/authoring/application/dto/ArticleDto";
⋮----
export async function createArticle(input: z.infer<typeof CreateArticleSchema>): Promise<CommandResult>
⋮----
export async function updateArticle(input: z.infer<typeof UpdateArticleSchema>): Promise<CommandResult>
⋮----
export async function publishArticle(input: z.infer<typeof PublishArticleSchema>): Promise<CommandResult>
⋮----
export async function archiveArticle(input: z.infer<typeof ArchiveArticleSchema>): Promise<CommandResult>
⋮----
export async function verifyArticle(input: z.infer<typeof VerifyArticleSchema>): Promise<CommandResult>
⋮----
export async function requestArticleReview(
  input: z.infer<typeof RequestArticleReviewSchema>,
): Promise<CommandResult>
⋮----
export async function deleteArticle(input: z.infer<typeof DeleteArticleSchema>): Promise<CommandResult>
````

## File: modules/notion/interfaces/authoring/_actions/category.actions.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/_actions
 * Purpose: Category Server Actions — thin adapter over category use cases.
 */
⋮----
import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeCategoryRepo } from "../composition/repositories";
import {
  CreateCategoryUseCase,
  RenameCategoryUseCase,
  MoveCategoryUseCase,
  DeleteCategoryUseCase,
} from "../../../subdomains/authoring/application/use-cases/manage-category.use-cases";
import type { z } from "@lib-zod";
import type {
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
  DeleteCategorySchema,
} from "../../../subdomains/authoring/application/dto/CategoryDto";
⋮----
export async function createCategory(input: z.infer<typeof CreateCategorySchema>): Promise<CommandResult>
⋮----
export async function renameCategory(input: z.infer<typeof RenameCategorySchema>): Promise<CommandResult>
⋮----
export async function moveCategory(input: z.infer<typeof MoveCategorySchema>): Promise<CommandResult>
⋮----
export async function deleteCategory(input: z.infer<typeof DeleteCategorySchema>): Promise<CommandResult>
````

## File: modules/notion/interfaces/authoring/composition/use-cases.ts
````typescript
import {
  CreateArticleUseCase,
  UpdateArticleUseCase,
  ArchiveArticleUseCase,
  DeleteArticleUseCase,
  PublishArticleUseCase,
  VerifyArticleUseCase,
  RequestArticleReviewUseCase,
  CreateCategoryUseCase,
  RenameCategoryUseCase,
  MoveCategoryUseCase,
  DeleteCategoryUseCase,
} from "../../../subdomains/authoring/application/use-cases";
import type { ArticleRepository } from "../../../subdomains/authoring/domain/repositories/ArticleRepository";
import type { CategoryRepository } from "../../../subdomains/authoring/domain/repositories/CategoryRepository";
import { makeArticleRepo, makeCategoryRepo } from "./repositories";
⋮----
export interface AuthoringUseCases {
  readonly createArticle: CreateArticleUseCase;
  readonly updateArticle: UpdateArticleUseCase;
  readonly archiveArticle: ArchiveArticleUseCase;
  readonly deleteArticle: DeleteArticleUseCase;
  readonly publishArticle: PublishArticleUseCase;
  readonly verifyArticle: VerifyArticleUseCase;
  readonly requestArticleReview: RequestArticleReviewUseCase;
  readonly createCategory: CreateCategoryUseCase;
  readonly renameCategory: RenameCategoryUseCase;
  readonly moveCategory: MoveCategoryUseCase;
  readonly deleteCategory: DeleteCategoryUseCase;
}
⋮----
export function makeAuthoringUseCases(
  articleRepo: ArticleRepository = makeArticleRepo(),
  categoryRepo: CategoryRepository = makeCategoryRepo(),
): AuthoringUseCases
````

## File: modules/notion/interfaces/collaboration/_actions/comment.actions.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/_actions
 * Purpose: Comment aggregate server actions — create, update, resolve, delete.
 */
⋮----
import { commandFailureFrom, type CommandResult } from "@shared-types";
import { dispatchNotification } from "@/modules/platform/api";
import { makeCommentRepo } from "../composition/repositories";
import {
  CreateCommentUseCase,
  UpdateCommentUseCase,
  ResolveCommentUseCase,
  DeleteCommentUseCase,
} from "../../../subdomains/collaboration/application/use-cases/manage-comment.use-cases";
import type {
  CreateCommentDto,
  UpdateCommentDto,
  ResolveCommentDto,
  DeleteCommentDto,
} from "../../../subdomains/collaboration/application/dto/CollaborationDto";
⋮----
export async function createComment(input: CreateCommentDto): Promise<CommandResult>
⋮----
export async function updateComment(input: UpdateCommentDto): Promise<CommandResult>
⋮----
export async function resolveComment(input: ResolveCommentDto): Promise<CommandResult>
⋮----
export async function deleteComment(input: DeleteCommentDto): Promise<CommandResult>
````

## File: modules/notion/interfaces/collaboration/_actions/permission.actions.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/_actions
 * Purpose: Permission aggregate server actions — grant, revoke.
 */
⋮----
import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makePermissionRepo } from "../composition/repositories";
import { GrantPermissionUseCase, RevokePermissionUseCase } from "../../../subdomains/collaboration/application/use-cases/manage-permission.use-cases";
import type { GrantPermissionDto, RevokePermissionDto } from "../../../subdomains/collaboration/application/dto/CollaborationDto";
⋮----
export async function grantPermission(input: GrantPermissionDto): Promise<CommandResult>
⋮----
export async function revokePermission(input: RevokePermissionDto): Promise<CommandResult>
````

## File: modules/notion/interfaces/collaboration/_actions/version.actions.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/_actions
 * Purpose: Version aggregate server actions — create, delete.
 */
⋮----
import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeVersionRepo } from "../composition/repositories";
import { CreateVersionUseCase, DeleteVersionUseCase } from "../../../subdomains/collaboration/application/use-cases/manage-version.use-cases";
import type { CreateVersionDto, DeleteVersionDto } from "../../../subdomains/collaboration/application/dto/CollaborationDto";
⋮----
export async function createVersion(input: CreateVersionDto): Promise<CommandResult>
⋮----
export async function deleteVersion(input: DeleteVersionDto): Promise<CommandResult>
````

## File: modules/notion/interfaces/collaboration/composition/use-cases.ts
````typescript
import {
  CreateCommentUseCase,
  UpdateCommentUseCase,
  ResolveCommentUseCase,
  DeleteCommentUseCase,
  ListCommentsUseCase,
  CreateVersionUseCase,
  DeleteVersionUseCase,
  GrantPermissionUseCase,
  RevokePermissionUseCase,
} from "../../../subdomains/collaboration/application/use-cases";
import type { CommentRepository } from "../../../subdomains/collaboration/domain/repositories/CommentRepository";
import type { VersionRepository } from "../../../subdomains/collaboration/domain/repositories/VersionRepository";
import type { PermissionRepository } from "../../../subdomains/collaboration/domain/repositories/PermissionRepository";
import { makeCommentRepo, makeVersionRepo, makePermissionRepo } from "./repositories";
⋮----
export interface CollaborationUseCases {
  readonly createComment: CreateCommentUseCase;
  readonly updateComment: UpdateCommentUseCase;
  readonly resolveComment: ResolveCommentUseCase;
  readonly deleteComment: DeleteCommentUseCase;
  readonly listComments: ListCommentsUseCase;
  readonly createVersion: CreateVersionUseCase;
  readonly deleteVersion: DeleteVersionUseCase;
  readonly grantPermission: GrantPermissionUseCase;
  readonly revokePermission: RevokePermissionUseCase;
}
⋮----
export function makeCollaborationUseCases(
  commentRepo: CommentRepository = makeCommentRepo(),
  versionRepo: VersionRepository = makeVersionRepo(),
  permissionRepo: PermissionRepository = makePermissionRepo(),
): CollaborationUseCases
````

## File: modules/notion/interfaces/database/components/DatabaseAddFieldDialog.tsx
````typescript
import { useState } from "react";
⋮----
import type { FieldType } from "../../../subdomains/database/application/dto/database.dto";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui-shadcn/ui/select";
⋮----
interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (name: string, type: FieldType, required: boolean) => void;
  isPending: boolean;
}
⋮----
export function AddFieldDialog(
⋮----
function reset()
⋮----
function handleOpenChange(v: boolean)
⋮----
function handleSubmit(e: React.FormEvent)
⋮----
<Select value=
````

## File: modules/notion/interfaces/database/components/DatabaseAutomationPanel.tsx
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: Manage automation rules for a database ??list/create/toggle/delete.
 */
⋮----
import { useEffect, useState, useTransition } from "react";
import type { DatabaseAutomationSnapshot, AutomationTrigger, AutomationActionType } from "../../../subdomains/database/application/dto/database.dto";
import { getAutomations } from "../queries";
import { createAutomation, updateAutomation, deleteAutomation } from "../_actions/database.actions";
⋮----
interface Props {
  databaseId: string;
  accountId: string;
  currentUserId: string;
}
⋮----
function handleCreate()
⋮----
function handleToggle(automation: DatabaseAutomationSnapshot)
⋮----
function handleDelete(automationId: string)
````

## File: modules/notion/interfaces/database/composition/use-cases.ts
````typescript
import {
  CreateDatabaseUseCase,
  UpdateDatabaseUseCase,
  AddFieldUseCase,
  ArchiveDatabaseUseCase,
  GetDatabaseUseCase,
  ListDatabasesUseCase,
  CreateRecordUseCase,
  UpdateRecordUseCase,
  DeleteRecordUseCase,
  ListRecordsUseCase,
  CreateViewUseCase,
  UpdateViewUseCase,
  DeleteViewUseCase,
  ListViewsUseCase,
  CreateAutomationUseCase,
  UpdateAutomationUseCase,
  DeleteAutomationUseCase,
  ListAutomationsUseCase,
} from "../../../subdomains/database/application/use-cases";
import type { DatabaseRepository } from "../../../subdomains/database/domain/repositories/DatabaseRepository";
import type { DatabaseRecordRepository } from "../../../subdomains/database/domain/repositories/DatabaseRecordRepository";
import type { ViewRepository } from "../../../subdomains/database/domain/repositories/ViewRepository";
import type { AutomationRepository } from "../../../subdomains/database/domain/repositories/AutomationRepository";
import { makeDatabaseRepo, makeRecordRepo, makeViewRepo, makeAutomationRepo } from "./repositories";
⋮----
export interface DatabaseUseCases {
  readonly createDatabase: CreateDatabaseUseCase;
  readonly updateDatabase: UpdateDatabaseUseCase;
  readonly addField: AddFieldUseCase;
  readonly archiveDatabase: ArchiveDatabaseUseCase;
  readonly getDatabase: GetDatabaseUseCase;
  readonly listDatabases: ListDatabasesUseCase;
  readonly createRecord: CreateRecordUseCase;
  readonly updateRecord: UpdateRecordUseCase;
  readonly deleteRecord: DeleteRecordUseCase;
  readonly listRecords: ListRecordsUseCase;
  readonly createView: CreateViewUseCase;
  readonly updateView: UpdateViewUseCase;
  readonly deleteView: DeleteViewUseCase;
  readonly listViews: ListViewsUseCase;
  readonly createAutomation: CreateAutomationUseCase;
  readonly updateAutomation: UpdateAutomationUseCase;
  readonly deleteAutomation: DeleteAutomationUseCase;
  readonly listAutomations: ListAutomationsUseCase;
}
⋮----
export function makeDatabaseUseCases(
  databaseRepo: DatabaseRepository = makeDatabaseRepo(),
  recordRepo: DatabaseRecordRepository = makeRecordRepo(),
  viewRepo: ViewRepository = makeViewRepo(),
  automationRepo: AutomationRepository = makeAutomationRepo(),
): DatabaseUseCases
````

## File: modules/notion/interfaces/knowledge/_actions/knowledge-collection.actions.ts
````typescript
import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeCollectionRepo } from "../composition/repositories";
import {
  CreateKnowledgeCollectionUseCase,
  RenameKnowledgeCollectionUseCase,
  AddPageToCollectionUseCase,
  RemovePageFromCollectionUseCase,
  AddCollectionColumnUseCase,
  ArchiveKnowledgeCollectionUseCase,
} from "../../../subdomains/knowledge/application/use-cases/manage-knowledge-collection.use-cases";
import type {
  CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionDto,
  AddPageToCollectionDto,
  RemovePageFromCollectionDto,
  AddCollectionColumnDto,
  ArchiveKnowledgeCollectionDto,
} from "../../../subdomains/knowledge/application/dto/KnowledgeCollectionDto";
⋮----
export async function createKnowledgeCollection(input: CreateKnowledgeCollectionDto): Promise<CommandResult>
⋮----
export async function renameKnowledgeCollection(input: RenameKnowledgeCollectionDto): Promise<CommandResult>
⋮----
export async function addPageToCollection(input: AddPageToCollectionDto): Promise<CommandResult>
⋮----
export async function removePageFromCollection(input: RemovePageFromCollectionDto): Promise<CommandResult>
⋮----
export async function addCollectionColumn(input: AddCollectionColumnDto): Promise<CommandResult>
⋮----
export async function archiveKnowledgeCollection(input: ArchiveKnowledgeCollectionDto): Promise<CommandResult>
````

## File: modules/notion/interfaces/knowledge/composition/capabilities.ts
````typescript
import { SharedAiKnowledgeSummaryAdapter } from "../../../infrastructure/knowledge/ai";
⋮----
export function makeKnowledgeSummaryPort()
````

## File: modules/notion/interfaces/knowledge/store/block-editor.store.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/store
 * Purpose: Zustand store for the block editor UI state.
 *          Manages optimistic block operations before persistence.
 */
⋮----
import { v4 as uuid } from "@lib-uuid";
import { create } from "zustand";
import type { BlockContent } from "../../../subdomains/knowledge/application/dto/knowledge.dto";
⋮----
export interface EditorBlock {
  id: string;
  content: BlockContent;
  order: number;
  parentBlockId: string | null;
  isFocused: boolean;
}
⋮----
interface BlockEditorState {
  pageId: string | null;
  accountId: string | null;
  blocks: EditorBlock[];
  isDirty: boolean;

  setPage: (accountId: string, pageId: string) => void;
  setBlocks: (blocks: EditorBlock[]) => void;
  addBlock: (after: string | null, content?: BlockContent) => EditorBlock;
  updateBlock: (id: string, content: BlockContent) => void;
  deleteBlock: (id: string) => void;
  reorder: (ids: string[]) => void;
  clearDirty: () => void;
}
⋮----
function makeId()
⋮----
setPage(accountId, pageId)
⋮----
setBlocks(blocks)
⋮----
addBlock(afterId, content =
⋮----
updateBlock(id, content)
⋮----
deleteBlock(id)
⋮----
reorder(ids)
⋮----
clearDirty()
````

## File: modules/notion/notion.instructions.md
````markdown

````

## File: modules/notion/subdomains/authoring/api/index.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 */
⋮----
// ??? Read contracts ????????????????????????????????????????????????????????????
⋮----
// ??? Identifiers used by other BCs ????????????????????????????????????????????
export type ArticleId = string;
export type CategoryId = string;
⋮----
// ??? Server Actions (write-side) ??????????????????????????????????????????????
⋮----
// ??? Queries (read-side) ??????????????????????????????????????????????????????
⋮----
// UI components are exported from ./ui to keep this barrel semantic-only.
````

## File: modules/notion/subdomains/authoring/api/ui.ts
````typescript
/**
 * notion/authoring UI surface.
 * UI consumers should import from this file instead of the semantic api barrel.
 */
````

## File: modules/notion/subdomains/authoring/application/use-cases/index.ts
````typescript

````

## File: modules/notion/subdomains/authoring/application/use-cases/manage-article-lifecycle.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: application/use-cases
 * Purpose: Article lifecycle use cases ??create, update, archive, delete.
 */
⋮----
import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import { Article } from "../../domain/aggregates/Article";
import type { ArticleRepository } from "../../domain/repositories/ArticleRepository";
import {
  CreateArticleSchema,
  UpdateArticleSchema,
  ArchiveArticleSchema,
  DeleteArticleSchema,
} from "../dto/ArticleDto";
⋮----
export class CreateArticleUseCase {
⋮----
constructor(private readonly repo: ArticleRepository)
⋮----
async execute(input: z.infer<typeof CreateArticleSchema>): Promise<CommandResult>
⋮----
export class UpdateArticleUseCase {
⋮----
async execute(input: z.infer<typeof UpdateArticleSchema>): Promise<CommandResult>
⋮----
export class ArchiveArticleUseCase {
⋮----
async execute(input: z.infer<typeof ArchiveArticleSchema>): Promise<CommandResult>
⋮----
export class DeleteArticleUseCase {
⋮----
async execute(input: z.infer<typeof DeleteArticleSchema>): Promise<CommandResult>
````

## File: modules/notion/subdomains/authoring/application/use-cases/manage-article-publication.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: application/use-cases
 * Purpose: Article publication use case.
 */
⋮----
import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { Article } from "../../domain/aggregates/Article";
import type { ArticleRepository } from "../../domain/repositories/ArticleRepository";
import { PublishArticleSchema } from "../dto/ArticleDto";
⋮----
export class PublishArticleUseCase {
⋮----
constructor(private readonly repo: ArticleRepository)
⋮----
async execute(input: z.infer<typeof PublishArticleSchema>): Promise<CommandResult>
````

## File: modules/notion/subdomains/authoring/application/use-cases/manage-category.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: application/use-cases
 * Purpose: Category use cases ??create, rename, move, delete.
 */
⋮----
import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import { Category } from "../../domain/aggregates/Category";
import type { CategoryRepository } from "../../domain/repositories/CategoryRepository";
import {
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
  DeleteCategorySchema,
} from "../dto/CategoryDto";
⋮----
export class CreateCategoryUseCase {
⋮----
constructor(private readonly repo: CategoryRepository)
⋮----
async execute(input: z.infer<typeof CreateCategorySchema>): Promise<CommandResult>
⋮----
export class RenameCategoryUseCase {
⋮----
async execute(input: z.infer<typeof RenameCategorySchema>): Promise<CommandResult>
⋮----
export class MoveCategoryUseCase {
⋮----
async execute(input: z.infer<typeof MoveCategorySchema>): Promise<CommandResult>
⋮----
export class DeleteCategoryUseCase {
⋮----
async execute(input: z.infer<typeof DeleteCategorySchema>): Promise<CommandResult>
````

## File: modules/notion/subdomains/authoring/application/use-cases/verify-article.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: application/use-cases
 * Purpose: Article verification use cases ??verify and request review.
 */
⋮----
import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { Article } from "../../domain/aggregates/Article";
import type { ArticleRepository } from "../../domain/repositories/ArticleRepository";
import { VerifyArticleSchema, RequestArticleReviewSchema } from "../dto/ArticleDto";
⋮----
export class VerifyArticleUseCase {
⋮----
constructor(private readonly repo: ArticleRepository)
⋮----
async execute(input: z.infer<typeof VerifyArticleSchema>): Promise<CommandResult>
⋮----
export class RequestArticleReviewUseCase {
⋮----
async execute(input: z.infer<typeof RequestArticleReviewSchema>): Promise<CommandResult>
````

## File: modules/notion/subdomains/authoring/domain/events/AuthoringEvents.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: domain/events
 * Purpose: Published event discriminated-union types for authoring subdomain.
 */
⋮----
export interface AuthoringArticleCreatedEvent {
  readonly type: "notion.authoring.article-created";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly articleId: string;
    readonly accountId: string;
    readonly workspaceId: string;
    readonly title: string;
  };
}
⋮----
export interface AuthoringArticlePublishedEvent {
  readonly type: "notion.authoring.article-published";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly articleId: string;
    readonly accountId: string;
    readonly version: number;
  };
}
⋮----
export interface AuthoringArticleArchivedEvent {
  readonly type: "notion.authoring.article-archived";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly articleId: string;
    readonly accountId: string;
  };
}
````

## File: modules/notion/subdomains/authoring/domain/index.ts
````typescript

````

## File: modules/notion/subdomains/authoring/domain/repositories/ArticleRepository.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: domain/repositories
 * Purpose: Article persistence contract (driven port).
 */
⋮----
import type { ArticleSnapshot, ArticleStatus } from "../aggregates/Article";
⋮----
export interface ArticleRepository {
  getById(accountId: string, articleId: string): Promise<ArticleSnapshot | null>;
  list(params: {
    accountId: string;
    workspaceId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
  }): Promise<ArticleSnapshot[]>;
  listByLinkedArticleId(accountId: string, articleId: string): Promise<ArticleSnapshot[]>;
  save(snapshot: ArticleSnapshot): Promise<void>;
  delete(accountId: string, articleId: string): Promise<void>;
}
⋮----
getById(accountId: string, articleId: string): Promise<ArticleSnapshot | null>;
list(params: {
    accountId: string;
    workspaceId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
  }): Promise<ArticleSnapshot[]>;
listByLinkedArticleId(accountId: string, articleId: string): Promise<ArticleSnapshot[]>;
save(snapshot: ArticleSnapshot): Promise<void>;
delete(accountId: string, articleId: string): Promise<void>;
````

## File: modules/notion/subdomains/authoring/domain/repositories/CategoryRepository.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: domain/repositories
 * Purpose: Category persistence contract (driven port).
 */
⋮----
import type { CategorySnapshot } from "../aggregates/Category";
⋮----
export interface CategoryRepository {
  getById(accountId: string, categoryId: string): Promise<CategorySnapshot | null>;
  listByWorkspace(accountId: string, workspaceId: string): Promise<CategorySnapshot[]>;
  save(snapshot: CategorySnapshot): Promise<void>;
  delete(accountId: string, categoryId: string): Promise<void>;
}
⋮----
getById(accountId: string, categoryId: string): Promise<CategorySnapshot | null>;
listByWorkspace(accountId: string, workspaceId: string): Promise<CategorySnapshot[]>;
save(snapshot: CategorySnapshot): Promise<void>;
delete(accountId: string, categoryId: string): Promise<void>;
````

## File: modules/notion/subdomains/authoring/domain/repositories/index.ts
````typescript
// TODO: export ArticleRepository, CategoryRepository
````

## File: modules/notion/subdomains/collaboration/api/index.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 */
⋮----
// Aggregate snapshot types
⋮----
// DTOs
⋮----
// Server actions
⋮----
// Queries
⋮----
// UI components
````

## File: modules/notion/subdomains/collaboration/application/dto/collaboration.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the collaboration subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
````

## File: modules/notion/subdomains/collaboration/application/use-cases/index.ts
````typescript

````

## File: modules/notion/subdomains/collaboration/application/use-cases/manage-comment.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: application/use-cases
 * Aggregate: Comment
 */
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { CommentSnapshot } from "../../domain/aggregates/Comment";
import type { CommentRepository } from "../../domain/repositories/CommentRepository";
import {
  CreateCommentSchema, type CreateCommentDto,
  UpdateCommentSchema, type UpdateCommentDto,
  ResolveCommentSchema, type ResolveCommentDto,
  DeleteCommentSchema, type DeleteCommentDto,
} from "../dto/CollaborationDto";
⋮----
export class CreateCommentUseCase {
⋮----
constructor(private readonly repo: CommentRepository)
⋮----
async execute(input: CreateCommentDto): Promise<CommandResult>
⋮----
export class UpdateCommentUseCase {
⋮----
async execute(input: UpdateCommentDto): Promise<CommandResult>
⋮----
export class ResolveCommentUseCase {
⋮----
async execute(input: ResolveCommentDto): Promise<CommandResult>
⋮----
export class DeleteCommentUseCase {
⋮----
async execute(input: DeleteCommentDto): Promise<CommandResult>
⋮----
export class ListCommentsUseCase {
⋮----
async execute(accountId: string, contentId: string): Promise<CommentSnapshot[]>
````

## File: modules/notion/subdomains/collaboration/application/use-cases/manage-permission.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: application/use-cases
 * Aggregate: Permission
 */
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { PermissionRepository } from "../../domain/repositories/PermissionRepository";
import {
  GrantPermissionSchema, type GrantPermissionDto,
  RevokePermissionSchema, type RevokePermissionDto,
} from "../dto/CollaborationDto";
⋮----
export class GrantPermissionUseCase {
⋮----
constructor(private readonly repo: PermissionRepository)
⋮----
async execute(input: GrantPermissionDto): Promise<CommandResult>
⋮----
export class RevokePermissionUseCase {
⋮----
async execute(input: RevokePermissionDto): Promise<CommandResult>
````

## File: modules/notion/subdomains/collaboration/application/use-cases/manage-version.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: application/use-cases
 * Aggregate: Version
 */
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { VersionRepository } from "../../domain/repositories/VersionRepository";
import {
  CreateVersionSchema, type CreateVersionDto,
  DeleteVersionSchema, type DeleteVersionDto,
} from "../dto/CollaborationDto";
⋮----
export class CreateVersionUseCase {
⋮----
constructor(private readonly repo: VersionRepository)
⋮----
async execute(input: CreateVersionDto): Promise<CommandResult>
⋮----
export class DeleteVersionUseCase {
⋮----
async execute(input: DeleteVersionDto): Promise<CommandResult>
````

## File: modules/notion/subdomains/collaboration/domain/events/CollaborationEvents.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/events
 * Purpose: Domain events for collaboration operations.
 */
⋮----
import type { NotionDomainEvent } from "../../../../domain/events/NotionDomainEvent";
⋮----
export interface CommentCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.comment-created";
  readonly payload: {
    readonly commentId: string;
    readonly pageId: string;
    readonly authorId: string;
    readonly organizationId: string;
  };
}
⋮----
export interface CommentResolvedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.comment-resolved";
  readonly payload: {
    readonly commentId: string;
    readonly resolvedById: string;
    readonly organizationId: string;
  };
}
⋮----
export interface PermissionGrantedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.permission-granted";
  readonly payload: {
    readonly permissionId: string;
    readonly resourceId: string;
    readonly granteeId: string;
    readonly level: string;
    readonly organizationId: string;
  };
}
⋮----
export interface PermissionRevokedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.permission-revoked";
  readonly payload: {
    readonly permissionId: string;
    readonly resourceId: string;
    readonly granteeId: string;
    readonly organizationId: string;
  };
}
⋮----
export interface VersionCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.version-created";
  readonly payload: {
    readonly versionId: string;
    readonly pageId: string;
    readonly authorId: string;
    readonly versionNumber: number;
    readonly organizationId: string;
  };
}
⋮----
export interface VersionRestoredEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.version-restored";
  readonly payload: {
    readonly versionId: string;
    readonly pageId: string;
    readonly restoredById: string;
    readonly organizationId: string;
  };
}
````

## File: modules/notion/subdomains/collaboration/domain/index.ts
````typescript

````

## File: modules/notion/subdomains/collaboration/domain/repositories/CommentRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/repositories
 * Contract: CommentRepository
 *
 * Owned by the domain layer. Implemented in infrastructure/firebase/.
 */
⋮----
import type { CommentSnapshot, SelectionRange } from "../aggregates/Comment";
⋮----
export type CommentUnsubscribe = () => void;
⋮----
export interface CreateCommentInput {
  readonly contentId: string;
  readonly contentType: "page" | "article";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly authorId: string;
  readonly body: string;
  readonly parentCommentId?: string | null;
  readonly blockId?: string | null;
  readonly selectionRange?: SelectionRange | null;
}
⋮----
export interface UpdateCommentInput {
  readonly id: string;
  readonly accountId: string;
  readonly body: string;
}
⋮----
export interface ResolveCommentInput {
  readonly id: string;
  readonly accountId: string;
  readonly resolvedByUserId: string;
}
⋮----
export interface CommentRepository {
  create(input: CreateCommentInput): Promise<CommentSnapshot>;
  update(input: UpdateCommentInput): Promise<CommentSnapshot | null>;
  resolve(input: ResolveCommentInput): Promise<CommentSnapshot | null>;
  delete(accountId: string, commentId: string): Promise<void>;
  findById(accountId: string, commentId: string): Promise<CommentSnapshot | null>;
  listByContent(accountId: string, contentId: string): Promise<CommentSnapshot[]>;
  subscribe(
    accountId: string,
    contentId: string,
    onUpdate: (comments: CommentSnapshot[]) => void,
  ): CommentUnsubscribe;
}
⋮----
create(input: CreateCommentInput): Promise<CommentSnapshot>;
update(input: UpdateCommentInput): Promise<CommentSnapshot | null>;
resolve(input: ResolveCommentInput): Promise<CommentSnapshot | null>;
delete(accountId: string, commentId: string): Promise<void>;
findById(accountId: string, commentId: string): Promise<CommentSnapshot | null>;
listByContent(accountId: string, contentId: string): Promise<CommentSnapshot[]>;
subscribe(
    accountId: string,
    contentId: string,
    onUpdate: (comments: CommentSnapshot[]) => void,
  ): CommentUnsubscribe;
````

## File: modules/notion/subdomains/collaboration/domain/repositories/index.ts
````typescript

````

## File: modules/notion/subdomains/collaboration/domain/repositories/PermissionRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/repositories
 * Contract: PermissionRepository
 */
⋮----
import type { PermissionSnapshot, PermissionLevel, PrincipalType } from "../aggregates/Permission";
⋮----
export interface GrantPermissionInput {
  readonly subjectId: string;
  readonly subjectType: "page" | "article" | "database";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly principalId: string;
  readonly principalType: PrincipalType;
  readonly level: PermissionLevel;
  readonly grantedByUserId: string;
  readonly expiresAtISO?: string | null;
  readonly linkToken?: string | null;
}
⋮----
export interface PermissionRepository {
  grant(input: GrantPermissionInput): Promise<PermissionSnapshot>;
  revoke(accountId: string, permissionId: string): Promise<void>;
  findById(accountId: string, permissionId: string): Promise<PermissionSnapshot | null>;
  listBySubject(accountId: string, subjectId: string): Promise<PermissionSnapshot[]>;
}
⋮----
grant(input: GrantPermissionInput): Promise<PermissionSnapshot>;
revoke(accountId: string, permissionId: string): Promise<void>;
findById(accountId: string, permissionId: string): Promise<PermissionSnapshot | null>;
listBySubject(accountId: string, subjectId: string): Promise<PermissionSnapshot[]>;
````

## File: modules/notion/subdomains/collaboration/domain/repositories/VersionRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/repositories
 * Contract: VersionRepository
 */
⋮----
import type { VersionSnapshot } from "../aggregates/Version";
⋮----
export interface CreateVersionInput {
  readonly contentId: string;
  readonly contentType: "page" | "article";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly snapshotBlocks: unknown[];
  readonly label?: string | null;
  readonly description?: string | null;
  readonly createdByUserId: string;
}
⋮----
export interface VersionRepository {
  create(input: CreateVersionInput): Promise<VersionSnapshot>;
  delete(accountId: string, versionId: string): Promise<void>;
  findById(accountId: string, versionId: string): Promise<VersionSnapshot | null>;
  listByContent(accountId: string, contentId: string): Promise<VersionSnapshot[]>;
}
⋮----
create(input: CreateVersionInput): Promise<VersionSnapshot>;
delete(accountId: string, versionId: string): Promise<void>;
findById(accountId: string, versionId: string): Promise<VersionSnapshot | null>;
listByContent(accountId: string, contentId: string): Promise<VersionSnapshot[]>;
````

## File: modules/notion/subdomains/database/api/ui.ts
````typescript
/**
 * notion/database UI surface.
 * UI consumers should import from this file instead of the semantic api barrel.
 */
````

## File: modules/notion/subdomains/database/application/dto/database.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the database subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
````

## File: modules/notion/subdomains/database/application/queries/automation.queries.ts
````typescript
import type { DatabaseAutomationSnapshot } from "../../domain/aggregates/DatabaseAutomation";
import type { AutomationRepository } from "../../domain/repositories/AutomationRepository";
⋮----
export class ListAutomationsUseCase {
⋮----
constructor(private readonly repo: AutomationRepository)
⋮----
async execute(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]>
````

## File: modules/notion/subdomains/database/application/queries/database.queries.ts
````typescript
import type { DatabaseRepository } from "../../domain/repositories/DatabaseRepository";
import type { DatabaseSnapshot } from "../../domain/aggregates/Database";
import { GetDatabaseSchema, ListDatabasesSchema } from "../dto/DatabaseDto";
import type { GetDatabaseDto, ListDatabasesDto } from "../dto/DatabaseDto";
⋮----
export class GetDatabaseUseCase {
⋮----
constructor(private readonly repo: DatabaseRepository)
async execute(input: GetDatabaseDto): Promise<DatabaseSnapshot | null>
⋮----
export class ListDatabasesUseCase {
⋮----
async execute(input: ListDatabasesDto): Promise<DatabaseSnapshot[]>
````

## File: modules/notion/subdomains/database/application/queries/record.queries.ts
````typescript
import type { DatabaseRecordRepository } from "../../domain/repositories/DatabaseRecordRepository";
import type { DatabaseRecordSnapshot } from "../../domain/aggregates/DatabaseRecord";
import { ListRecordsSchema } from "../dto/DatabaseDto";
import type { ListRecordsDto } from "../dto/DatabaseDto";
⋮----
export class ListRecordsUseCase {
⋮----
constructor(private readonly repo: DatabaseRecordRepository)
async execute(input: ListRecordsDto): Promise<DatabaseRecordSnapshot[]>
````

## File: modules/notion/subdomains/database/application/queries/view.queries.ts
````typescript
import type { ViewRepository } from "../../domain/repositories/ViewRepository";
import type { ViewSnapshot } from "../../domain/aggregates/View";
import { ListViewsSchema } from "../dto/DatabaseDto";
import type { ListViewsDto } from "../dto/DatabaseDto";
⋮----
export class ListViewsUseCase {
⋮----
constructor(private readonly repo: ViewRepository)
async execute(input: ListViewsDto): Promise<ViewSnapshot[]>
````

## File: modules/notion/subdomains/database/application/use-cases/index.ts
````typescript

````

## File: modules/notion/subdomains/database/application/use-cases/manage-automation.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: application/use-cases
 * Purpose: Automation CRUD use cases.
 */
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { AutomationRepository, CreateAutomationInput, UpdateAutomationInput } from "../../domain/repositories/AutomationRepository";
⋮----
export class CreateAutomationUseCase {
⋮----
constructor(private readonly repo: AutomationRepository)
⋮----
async execute(input: CreateAutomationInput): Promise<CommandResult>
⋮----
export class UpdateAutomationUseCase {
⋮----
async execute(input: UpdateAutomationInput): Promise<CommandResult>
⋮----
export class DeleteAutomationUseCase {
⋮----
async execute(id: string, accountId: string, databaseId: string): Promise<CommandResult>
⋮----
// Re-export read queries for backward compatibility
````

## File: modules/notion/subdomains/database/application/use-cases/manage-database.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: application/use-cases
 * Purpose: Database aggregate use cases — create, update, addField, archive, get, list.
 */
⋮----
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { DatabaseRepository } from "../../domain/repositories/DatabaseRepository";
import { CreateDatabaseSchema, UpdateDatabaseSchema, AddFieldSchema, ArchiveDatabaseSchema } from "../dto/DatabaseDto";
import type { CreateDatabaseDto, UpdateDatabaseDto, AddFieldDto, ArchiveDatabaseDto } from "../dto/DatabaseDto";
⋮----
export class CreateDatabaseUseCase {
⋮----
constructor(private readonly repo: DatabaseRepository)
async execute(input: CreateDatabaseDto): Promise<CommandResult>
⋮----
export class UpdateDatabaseUseCase {
⋮----
async execute(input: UpdateDatabaseDto): Promise<CommandResult>
⋮----
export class AddFieldUseCase {
⋮----
async execute(input: AddFieldDto): Promise<CommandResult>
⋮----
export class ArchiveDatabaseUseCase {
⋮----
async execute(input: ArchiveDatabaseDto): Promise<CommandResult>
⋮----
// Re-export read queries for backward compatibility
````

## File: modules/notion/subdomains/database/application/use-cases/manage-record.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: application/use-cases
 * Purpose: DatabaseRecord use cases — create, update, delete, list.
 */
⋮----
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { DatabaseRecordRepository } from "../../domain/repositories/DatabaseRecordRepository";
import { CreateRecordSchema, UpdateRecordSchema, DeleteRecordSchema } from "../dto/DatabaseDto";
import type { CreateRecordDto, UpdateRecordDto, DeleteRecordDto } from "../dto/DatabaseDto";
⋮----
export class CreateRecordUseCase {
⋮----
constructor(private readonly repo: DatabaseRecordRepository)
async execute(input: CreateRecordDto): Promise<CommandResult>
⋮----
export class UpdateRecordUseCase {
⋮----
async execute(input: UpdateRecordDto): Promise<CommandResult>
⋮----
export class DeleteRecordUseCase {
⋮----
async execute(input: DeleteRecordDto): Promise<CommandResult>
⋮----
// Re-export read queries for backward compatibility
````

## File: modules/notion/subdomains/database/application/use-cases/manage-view.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: application/use-cases
 * Purpose: View use cases — create, update, delete, list.
 */
⋮----
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { ViewRepository } from "../../domain/repositories/ViewRepository";
import { CreateViewSchema, UpdateViewSchema, DeleteViewSchema } from "../dto/DatabaseDto";
import type { CreateViewDto, UpdateViewDto, DeleteViewDto } from "../dto/DatabaseDto";
⋮----
export class CreateViewUseCase {
⋮----
constructor(private readonly repo: ViewRepository)
async execute(input: CreateViewDto): Promise<CommandResult>
⋮----
export class UpdateViewUseCase {
⋮----
async execute(input: UpdateViewDto): Promise<CommandResult>
⋮----
export class DeleteViewUseCase {
⋮----
async execute(input: DeleteViewDto): Promise<CommandResult>
⋮----
// Re-export read queries for backward compatibility
````

## File: modules/notion/subdomains/database/domain/events/DatabaseEvents.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/events
 * Purpose: Domain events for database operations.
 */
⋮----
import type { NotionDomainEvent } from "../../../../domain/events/NotionDomainEvent";
⋮----
export interface DatabaseCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.database.database-created";
  readonly payload: {
    readonly databaseId: string;
    readonly accountId: string;
    readonly workspaceId: string;
    readonly title: string;
  };
}
⋮----
export interface DatabaseRenamedEvent extends NotionDomainEvent {
  readonly type: "notion.database.database-renamed";
  readonly payload: {
    readonly databaseId: string;
    readonly previousTitle: string;
    readonly newTitle: string;
    readonly organizationId: string;
  };
}
⋮----
export interface FieldAddedEvent extends NotionDomainEvent {
  readonly type: "notion.database.field-added";
  readonly payload: {
    readonly databaseId: string;
    readonly fieldId: string;
    readonly fieldName: string;
    readonly fieldType: string;
    readonly organizationId: string;
  };
}
⋮----
export interface FieldDeletedEvent extends NotionDomainEvent {
  readonly type: "notion.database.field-deleted";
  readonly payload: {
    readonly databaseId: string;
    readonly fieldId: string;
    readonly organizationId: string;
  };
}
⋮----
export interface RecordAddedEvent extends NotionDomainEvent {
  readonly type: "notion.database.record-added";
  readonly payload: {
    readonly databaseId: string;
    readonly recordId: string;
    readonly organizationId: string;
  };
}
⋮----
export interface RecordUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.database.record-updated";
  readonly payload: {
    readonly databaseId: string;
    readonly recordId: string;
    readonly organizationId: string;
  };
}
⋮----
export interface RecordDeletedEvent extends NotionDomainEvent {
  readonly type: "notion.database.record-deleted";
  readonly payload: {
    readonly databaseId: string;
    readonly recordId: string;
    readonly organizationId: string;
  };
}
⋮----
export interface ViewCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.database.view-created";
  readonly payload: {
    readonly databaseId: string;
    readonly viewId: string;
    readonly viewType: string;
    readonly organizationId: string;
  };
}
⋮----
export interface ViewUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.database.view-updated";
  readonly payload: {
    readonly databaseId: string;
    readonly viewId: string;
    readonly organizationId: string;
  };
}
````

## File: modules/notion/subdomains/database/domain/index.ts
````typescript

````

## File: modules/notion/subdomains/database/domain/repositories/AutomationRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/repositories
 * Purpose: Repository interface for DatabaseAutomation aggregate.
 */
⋮----
import type {
  DatabaseAutomationSnapshot,
  AutomationCondition,
  AutomationAction,
  AutomationTrigger,
} from "../aggregates/DatabaseAutomation";
⋮----
export interface CreateAutomationInput {
  databaseId: string;
  accountId: string;
  name: string;
  trigger: AutomationTrigger;
  triggerFieldId?: string;
  conditions?: AutomationCondition[];
  actions?: AutomationAction[];
  createdByUserId: string;
}
⋮----
export interface UpdateAutomationInput {
  id: string;
  accountId: string;
  databaseId: string;
  name?: string;
  enabled?: boolean;
  trigger?: AutomationTrigger;
  triggerFieldId?: string;
  conditions?: AutomationCondition[];
  actions?: AutomationAction[];
}
⋮----
export interface AutomationRepository {
  create(input: CreateAutomationInput): Promise<DatabaseAutomationSnapshot>;
  update(input: UpdateAutomationInput): Promise<DatabaseAutomationSnapshot | null>;
  delete(id: string, accountId: string, databaseId: string): Promise<void>;
  listByDatabase(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]>;
}
⋮----
create(input: CreateAutomationInput): Promise<DatabaseAutomationSnapshot>;
update(input: UpdateAutomationInput): Promise<DatabaseAutomationSnapshot | null>;
delete(id: string, accountId: string, databaseId: string): Promise<void>;
listByDatabase(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]>;
````

## File: modules/notion/subdomains/database/domain/repositories/DatabaseRecordRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/repositories
 * Purpose: DatabaseRecordRepository — persistence contract for DatabaseRecord aggregate.
 */
⋮----
import type { DatabaseRecordSnapshot } from "../aggregates/DatabaseRecord";
⋮----
export interface CreateRecordInput {
  accountId: string;
  workspaceId: string;
  databaseId: string;
  pageId?: string;
  properties?: Record<string, unknown>;
  createdByUserId: string;
}
⋮----
export interface UpdateRecordInput {
  id: string;
  accountId: string;
  properties: Record<string, unknown>;
}
⋮----
export interface DatabaseRecordRepository {
  create(input: CreateRecordInput): Promise<DatabaseRecordSnapshot>;
  update(input: UpdateRecordInput): Promise<DatabaseRecordSnapshot>;
  delete(id: string, accountId: string): Promise<void>;
  listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecordSnapshot[]>;
}
⋮----
create(input: CreateRecordInput): Promise<DatabaseRecordSnapshot>;
update(input: UpdateRecordInput): Promise<DatabaseRecordSnapshot>;
delete(id: string, accountId: string): Promise<void>;
listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecordSnapshot[]>;
````

## File: modules/notion/subdomains/database/domain/repositories/DatabaseRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/repositories
 * Purpose: DatabaseRepository — persistence contract for the Database aggregate.
 */
⋮----
import type { DatabaseSnapshot, Field, FieldType } from "../aggregates/Database";
⋮----
export interface CreateDatabaseInput {
  accountId: string;
  workspaceId: string;
  name: string;
  description?: string;
  createdByUserId: string;
}
⋮----
export interface UpdateDatabaseInput {
  id: string;
  accountId: string;
  name?: string;
  description?: string;
  icon?: string;
  coverImageUrl?: string;
}
⋮----
export interface AddFieldInput {
  databaseId: string;
  accountId: string;
  name: string;
  type: FieldType;
  config?: Record<string, unknown>;
  required?: boolean;
}
⋮----
export interface DatabaseRepository {
  create(input: CreateDatabaseInput): Promise<DatabaseSnapshot>;
  update(input: UpdateDatabaseInput): Promise<DatabaseSnapshot>;
  addField(input: AddFieldInput): Promise<Field>;
  archive(id: string, accountId: string): Promise<void>;
  findById(id: string, accountId: string): Promise<DatabaseSnapshot | null>;
  listByWorkspace(accountId: string, workspaceId: string): Promise<DatabaseSnapshot[]>;
}
⋮----
create(input: CreateDatabaseInput): Promise<DatabaseSnapshot>;
update(input: UpdateDatabaseInput): Promise<DatabaseSnapshot>;
addField(input: AddFieldInput): Promise<Field>;
archive(id: string, accountId: string): Promise<void>;
findById(id: string, accountId: string): Promise<DatabaseSnapshot | null>;
listByWorkspace(accountId: string, workspaceId: string): Promise<DatabaseSnapshot[]>;
````

## File: modules/notion/subdomains/database/domain/repositories/index.ts
````typescript

````

## File: modules/notion/subdomains/database/domain/repositories/ViewRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/repositories
 * Purpose: ViewRepository — persistence contract for View aggregate.
 */
⋮----
import type { ViewSnapshot, ViewType, FilterRule, SortRule } from "../aggregates/View";
⋮----
export interface CreateViewInput {
  accountId: string;
  workspaceId: string;
  databaseId: string;
  name: string;
  type: ViewType;
  createdByUserId: string;
}
⋮----
export interface UpdateViewInput {
  id: string;
  accountId: string;
  name?: string;
  filters?: FilterRule[];
  sorts?: SortRule[];
  visibleFieldIds?: string[];
  hiddenFieldIds?: string[];
}
⋮----
export interface ViewRepository {
  create(input: CreateViewInput): Promise<ViewSnapshot>;
  update(input: UpdateViewInput): Promise<ViewSnapshot>;
  delete(id: string, accountId: string): Promise<void>;
  listByDatabase(accountId: string, databaseId: string): Promise<ViewSnapshot[]>;
}
⋮----
create(input: CreateViewInput): Promise<ViewSnapshot>;
update(input: UpdateViewInput): Promise<ViewSnapshot>;
delete(id: string, accountId: string): Promise<void>;
listByDatabase(accountId: string, databaseId: string): Promise<ViewSnapshot[]>;
````

## File: modules/notion/subdomains/knowledge/api/ui.ts
````typescript
/**
 * notion/knowledge UI surface.
 * UI consumers should import from this file instead of the semantic api barrel.
 */
````

## File: modules/notion/subdomains/knowledge/application/queries/backlink.queries.ts
````typescript
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { BacklinkIndexSnapshot } from "../../domain/aggregates/BacklinkIndex";
import type { BacklinkIndexRepository } from "../../domain/repositories/BacklinkIndexRepository";
⋮----
export class UpdatePageBacklinksUseCase {
⋮----
constructor(private readonly repo: BacklinkIndexRepository)
async execute(input: {
    readonly accountId: string;
    readonly sourcePageId: string;
    readonly sourcePageTitle: string;
    readonly mentionsByTarget: ReadonlyMap<string, ReadonlyArray<{ blockId: string; lastSeenAtISO: string }>>;
}): Promise<CommandResult>
⋮----
export class RemovePageBacklinksUseCase {
⋮----
async execute(accountId: string, sourcePageId: string): Promise<CommandResult>
⋮----
export class GetPageBacklinksUseCase {
⋮----
async execute(accountId: string, targetPageId: string): Promise<BacklinkIndexSnapshot | null>
````

## File: modules/notion/subdomains/knowledge/application/queries/content-block.queries.ts
````typescript
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import { ContentBlock } from "../../domain/aggregates/ContentBlock";
import type { ContentBlockSnapshot } from "../../domain/aggregates/ContentBlock";
import type { ContentBlockRepository } from "../../domain/repositories/ContentBlockRepository";
import type { BlockContent } from "../../domain/value-objects/BlockContent";
import {
  AddKnowledgeBlockSchema, type AddKnowledgeBlockDto,
  UpdateKnowledgeBlockSchema, type UpdateKnowledgeBlockDto,
  DeleteKnowledgeBlockSchema, type DeleteKnowledgeBlockDto,
  NestKnowledgeBlockSchema, type NestKnowledgeBlockDto,
  UnnestKnowledgeBlockSchema, type UnnestKnowledgeBlockDto,
} from "../dto/ContentBlockDto";
⋮----
export class AddContentBlockUseCase {
⋮----
constructor(private readonly repo: ContentBlockRepository)
async execute(input: AddKnowledgeBlockDto): Promise<CommandResult>
⋮----
export class UpdateContentBlockUseCase {
⋮----
async execute(input: UpdateKnowledgeBlockDto): Promise<CommandResult>
⋮----
export class DeleteContentBlockUseCase {
⋮----
async execute(input: DeleteKnowledgeBlockDto): Promise<CommandResult>
⋮----
export class NestContentBlockUseCase {
⋮----
async execute(input: NestKnowledgeBlockDto): Promise<CommandResult>
⋮----
export class UnnestContentBlockUseCase {
⋮----
async execute(input: UnnestKnowledgeBlockDto): Promise<CommandResult>
⋮----
export class ListContentBlocksUseCase {
⋮----
async execute(accountId: string, pageId: string): Promise<ContentBlockSnapshot[]>
````

## File: modules/notion/subdomains/knowledge/application/queries/knowledge-collection.queries.ts
````typescript
import type { KnowledgeCollectionSnapshot } from "../../domain/aggregates/KnowledgeCollection";
import type { KnowledgeCollectionRepository } from "../../domain/repositories/KnowledgeCollectionRepository";
⋮----
export class GetKnowledgeCollectionUseCase {
⋮----
constructor(private readonly repo: KnowledgeCollectionRepository)
async execute(accountId: string, collectionId: string): Promise<KnowledgeCollectionSnapshot | null>
⋮----
export class ListKnowledgeCollectionsUseCase {
⋮----
async execute(accountId: string): Promise<KnowledgeCollectionSnapshot[]>
⋮----
export class ListKnowledgeCollectionsByWorkspaceUseCase {
⋮----
async execute(accountId: string, workspaceId: string): Promise<KnowledgeCollectionSnapshot[]>
````

## File: modules/notion/subdomains/knowledge/application/queries/knowledge-page.queries.ts
````typescript
import type { KnowledgePageSnapshot, KnowledgePageTreeNode } from "../../domain/aggregates/KnowledgePage";
import type { KnowledgePageRepository } from "../../domain/repositories/KnowledgePageRepository";
⋮----
export function buildKnowledgePageTree(pages: KnowledgePageSnapshot[]): KnowledgePageTreeNode[]
⋮----
const sortByOrder = (nodes: KnowledgePageTreeNode[]): void =>
⋮----
export class GetKnowledgePageUseCase {
⋮----
constructor(private readonly repo: KnowledgePageRepository)
⋮----
async execute(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null>
⋮----
export class ListKnowledgePagesUseCase {
⋮----
async execute(accountId: string): Promise<KnowledgePageSnapshot[]>
⋮----
export class ListKnowledgePagesByWorkspaceUseCase {
⋮----
async execute(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]>
⋮----
export class GetKnowledgePageTreeUseCase {
⋮----
async execute(accountId: string): Promise<KnowledgePageTreeNode[]>
⋮----
export class GetKnowledgePageTreeByWorkspaceUseCase {
⋮----
async execute(accountId: string, workspaceId: string): Promise<KnowledgePageTreeNode[]>
````

## File: modules/notion/subdomains/knowledge/application/use-cases/index.ts
````typescript

````

## File: modules/notion/subdomains/knowledge/application/use-cases/manage-knowledge-collection.use-cases.ts
````typescript
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import { KnowledgeCollection } from "../../domain/aggregates/KnowledgeCollection";
import type { CollectionColumn } from "../../domain/aggregates/KnowledgeCollection";
import type { KnowledgeCollectionRepository } from "../../domain/repositories/KnowledgeCollectionRepository";
import {
  CreateKnowledgeCollectionSchema, type CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionSchema, type RenameKnowledgeCollectionDto,
  AddPageToCollectionSchema, type AddPageToCollectionDto,
  RemovePageFromCollectionSchema, type RemovePageFromCollectionDto,
  AddCollectionColumnSchema, type AddCollectionColumnDto,
  ArchiveKnowledgeCollectionSchema, type ArchiveKnowledgeCollectionDto,
} from "../dto/KnowledgeCollectionDto";
⋮----
// Re-export read queries for backward compatibility
⋮----
export class CreateKnowledgeCollectionUseCase {
⋮----
constructor(private readonly repo: KnowledgeCollectionRepository)
async execute(input: CreateKnowledgeCollectionDto): Promise<CommandResult>
⋮----
export class RenameKnowledgeCollectionUseCase {
⋮----
async execute(input: RenameKnowledgeCollectionDto): Promise<CommandResult>
⋮----
export class AddPageToCollectionUseCase {
⋮----
async execute(input: AddPageToCollectionDto): Promise<CommandResult>
⋮----
export class RemovePageFromCollectionUseCase {
⋮----
async execute(input: RemovePageFromCollectionDto): Promise<CommandResult>
⋮----
export class AddCollectionColumnUseCase {
⋮----
async execute(input: AddCollectionColumnDto): Promise<CommandResult>
⋮----
export class ArchiveKnowledgeCollectionUseCase {
⋮----
async execute(input: ArchiveKnowledgeCollectionDto): Promise<CommandResult>
````

## File: modules/notion/subdomains/knowledge/application/use-cases/manage-knowledge-page-appearance.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/use-cases
 * Purpose: Page appearance use cases — update icon, update cover.
 */
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
⋮----
import type { KnowledgePageRepository } from "../../domain/repositories/KnowledgePageRepository";
import {
  UpdatePageIconSchema,
  type UpdatePageIconDto,
  UpdatePageCoverSchema,
  type UpdatePageCoverDto,
} from "../dto/KnowledgePageLifecycleDto";
⋮----
export class UpdatePageIconUseCase {
⋮----
constructor(private readonly repo: KnowledgePageRepository)
⋮----
async execute(input: UpdatePageIconDto): Promise<CommandResult>
⋮----
export class UpdatePageCoverUseCase {
⋮----
async execute(input: UpdatePageCoverDto): Promise<CommandResult>
````

## File: modules/notion/subdomains/knowledge/application/use-cases/manage-knowledge-page.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/use-cases
 * Purpose: Page lifecycle use cases — create, rename, move, archive, reorder.
 */
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
⋮----
import { KnowledgePage } from "../../domain/aggregates/KnowledgePage";
import type { KnowledgePageRepository } from "../../domain/repositories/KnowledgePageRepository";
import {
  CreateKnowledgePageSchema,
  type CreateKnowledgePageDto,
  RenameKnowledgePageSchema,
  type RenameKnowledgePageDto,
  MoveKnowledgePageSchema,
  type MoveKnowledgePageDto,
  ArchiveKnowledgePageSchema,
  type ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksSchema,
  type ReorderKnowledgePageBlocksDto,
} from "../dto/KnowledgePageDto";
⋮----
// Re-export read queries for backward compatibility
⋮----
export class CreateKnowledgePageUseCase {
⋮----
constructor(private readonly repo: KnowledgePageRepository)
⋮----
async execute(input: CreateKnowledgePageDto): Promise<CommandResult>
⋮----
export class RenameKnowledgePageUseCase {
⋮----
async execute(input: RenameKnowledgePageDto): Promise<CommandResult>
⋮----
export class MoveKnowledgePageUseCase {
⋮----
async execute(input: MoveKnowledgePageDto): Promise<CommandResult>
⋮----
export class ArchiveKnowledgePageUseCase {
⋮----
async execute(input: ArchiveKnowledgePageDto): Promise<CommandResult>
⋮----
export class ReorderKnowledgePageBlocksUseCase {
⋮----
async execute(input: ReorderKnowledgePageBlocksDto): Promise<CommandResult>
````

## File: modules/notion/subdomains/knowledge/domain/events/KnowledgeBlockEvents.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/events
 * Purpose: ContentBlock domain events.
 */
⋮----
import type { NotionDomainEvent } from "./NotionDomainEvent";
⋮----
export interface BlockAddedPayload {
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly contentText: string;
}
⋮----
export interface BlockAddedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.block-added";
  readonly payload: BlockAddedPayload;
}
⋮----
export interface BlockUpdatedPayload {
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly contentText: string;
}
⋮----
export interface BlockUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.block-updated";
  readonly payload: BlockUpdatedPayload;
}
⋮----
export interface BlockDeletedPayload {
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
}
⋮----
export interface BlockDeletedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.block-deleted";
  readonly payload: BlockDeletedPayload;
}
⋮----
export type KnowledgeBlockDomainEvent =
  | BlockAddedEvent
  | BlockUpdatedEvent
  | BlockDeletedEvent;
````

## File: modules/notion/subdomains/knowledge/domain/events/KnowledgeCollectionEvents.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/events
 * Purpose: KnowledgeCollection domain events.
 */
⋮----
import type { NotionDomainEvent } from "./NotionDomainEvent";
⋮----
export interface CollectionCreatedPayload {
  readonly collectionId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly createdByUserId: string;
}
⋮----
export interface CollectionCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.collection-created";
  readonly payload: CollectionCreatedPayload;
}
⋮----
export interface CollectionRenamedPayload {
  readonly collectionId: string;
  readonly accountId: string;
  readonly previousName: string;
  readonly newName: string;
}
⋮----
export interface CollectionRenamedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.collection-renamed";
  readonly payload: CollectionRenamedPayload;
}
⋮----
export interface CollectionArchivedPayload {
  readonly collectionId: string;
  readonly accountId: string;
}
⋮----
export interface CollectionArchivedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.collection-archived";
  readonly payload: CollectionArchivedPayload;
}
⋮----
export type KnowledgeCollectionDomainEvent =
  | CollectionCreatedEvent
  | CollectionRenamedEvent
  | CollectionArchivedEvent;
````

## File: modules/notion/subdomains/knowledge/domain/events/KnowledgePageEvents.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/events
 * Purpose: KnowledgePage domain events.
 */
⋮----
import type { NotionDomainEvent } from "./NotionDomainEvent";
⋮----
export interface PageCreatedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly createdByUserId: string;
}
⋮----
export interface PageCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page-created";
  readonly payload: PageCreatedPayload;
}
⋮----
export interface PageRenamedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly previousTitle: string;
  readonly newTitle: string;
}
⋮----
export interface PageRenamedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page-renamed";
  readonly payload: PageRenamedPayload;
}
⋮----
export interface PageMovedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly previousParentPageId: string | null;
  readonly newParentPageId: string | null;
}
⋮----
export interface PageMovedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page-moved";
  readonly payload: PageMovedPayload;
}
⋮----
export interface PageArchivedPayload {
  readonly pageId: string;
  readonly accountId: string;
}
⋮----
export interface PageArchivedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page-archived";
  readonly payload: PageArchivedPayload;
}
⋮----
export interface ExtractedTask {
  readonly title: string;
  readonly dueDate?: string;
  readonly description?: string;
}
⋮----
export interface ExtractedInvoice {
  readonly amount: number;
  readonly description: string;
  readonly currency?: string;
}
⋮----
export interface PageApprovedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly extractedTasks: ReadonlyArray<ExtractedTask>;
  readonly extractedInvoices: ReadonlyArray<ExtractedInvoice>;
  readonly actorId: string;
  readonly causationId: string;
  readonly correlationId: string;
}
⋮----
export interface PageApprovedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page-approved";
  readonly payload: PageApprovedPayload;
}
⋮----
export interface PageVerifiedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly verifiedByUserId: string;
  readonly verificationExpiresAtISO?: string;
}
⋮----
export interface PageVerifiedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page-verified";
  readonly payload: PageVerifiedPayload;
}
⋮----
export interface PageReviewRequestedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly requestedByUserId: string;
}
⋮----
export interface PageReviewRequestedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page-review-requested";
  readonly payload: PageReviewRequestedPayload;
}
⋮----
export interface PageOwnerAssignedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly ownerId: string;
}
⋮----
export interface PageOwnerAssignedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page-owner-assigned";
  readonly payload: PageOwnerAssignedPayload;
}
⋮----
export interface PageIconUpdatedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly iconUrl: string;
}
⋮----
export interface PageIconUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page-icon-updated";
  readonly payload: PageIconUpdatedPayload;
}
⋮----
export interface PageCoverUpdatedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly coverUrl: string;
}
⋮----
export interface PageCoverUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page-cover-updated";
  readonly payload: PageCoverUpdatedPayload;
}
⋮----
export type KnowledgePageDomainEvent =
  | PageCreatedEvent
  | PageRenamedEvent
  | PageMovedEvent
  | PageArchivedEvent
  | PageApprovedEvent
  | PageVerifiedEvent
  | PageReviewRequestedEvent
  | PageOwnerAssignedEvent
  | PageIconUpdatedEvent
  | PageCoverUpdatedEvent;
````

## File: modules/notion/subdomains/knowledge/domain/ports/KnowledgeDistillationPort.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/ports
 * Purpose: External capability contract for structured knowledge-page distillation.
 */
⋮----
export interface KnowledgeDistillationInput {
  readonly title: string;
  readonly plainText: string;
  readonly model?: string;
}
⋮----
export interface KnowledgeDistillationHighlight {
  readonly title: string;
  readonly summary: string;
}
⋮----
export interface KnowledgeDistillationResult {
  readonly overview: string;
  readonly highlights: readonly KnowledgeDistillationHighlight[];
  readonly model: string;
  readonly traceId: string;
  readonly completedAt: string;
}
⋮----
export interface KnowledgeDistillationPort {
  distillPage(input: KnowledgeDistillationInput): Promise<KnowledgeDistillationResult>;
}
⋮----
distillPage(input: KnowledgeDistillationInput): Promise<KnowledgeDistillationResult>;
````

## File: modules/notion/subdomains/knowledge/domain/ports/KnowledgeSummaryPort.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/ports
 * Purpose: External capability contract for knowledge-page summarization.
 */
⋮----
export interface KnowledgeSummaryInput {
  readonly title: string;
  readonly plainText: string;
  readonly model?: string;
}
⋮----
export interface KnowledgeSummaryResult {
  readonly summary: string;
  readonly model: string;
}
⋮----
export interface KnowledgeSummaryPort {
  summarizePage(input: KnowledgeSummaryInput): Promise<KnowledgeSummaryResult>;
}
⋮----
summarizePage(input: KnowledgeSummaryInput): Promise<KnowledgeSummaryResult>;
````

## File: modules/notion/subdomains/knowledge/domain/repositories/BacklinkIndexRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/repositories
 * Purpose: Port interface for BacklinkIndex read model persistence.
 */
⋮----
import type { BacklinkIndex, BacklinkEntry } from "../aggregates/BacklinkIndex";
⋮----
export interface UpsertBacklinkEntriesInput {
  readonly accountId: string;
  readonly targetPageId: string;
  readonly sourcePageId: string;
  readonly entries: ReadonlyArray<Omit<BacklinkEntry, "sourcePageId">>;
}
⋮----
export interface RemoveBacklinksFromSourceInput {
  readonly accountId: string;
  readonly sourcePageId: string;
}
⋮----
export interface BacklinkIndexRepository {
  upsertFromSource(input: UpsertBacklinkEntriesInput): Promise<void>;
  removeFromSource(input: RemoveBacklinksFromSourceInput): Promise<void>;
  findByTargetPage(accountId: string, targetPageId: string): Promise<BacklinkIndex | null>;
  listOutboundTargets(accountId: string, sourcePageId: string): Promise<ReadonlyArray<string>>;
}
⋮----
upsertFromSource(input: UpsertBacklinkEntriesInput): Promise<void>;
removeFromSource(input: RemoveBacklinksFromSourceInput): Promise<void>;
findByTargetPage(accountId: string, targetPageId: string): Promise<BacklinkIndex | null>;
listOutboundTargets(accountId: string, sourcePageId: string): Promise<ReadonlyArray<string>>;
````

## File: modules/notion/subdomains/knowledge/domain/repositories/ContentBlockRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/repositories
 * Purpose: Port interface for ContentBlock persistence.
 */
⋮----
import type { ContentBlock } from "../aggregates/ContentBlock";
⋮----
export interface ContentBlockRepository {
  save(block: ContentBlock): Promise<void>;
  findById(accountId: string, blockId: string): Promise<ContentBlock | null>;
  listByPageId(accountId: string, pageId: string): Promise<ContentBlock[]>;
  delete(accountId: string, blockId: string): Promise<void>;
  countByPageId(accountId: string, pageId: string): Promise<number>;
}
⋮----
save(block: ContentBlock): Promise<void>;
findById(accountId: string, blockId: string): Promise<ContentBlock | null>;
listByPageId(accountId: string, pageId: string): Promise<ContentBlock[]>;
delete(accountId: string, blockId: string): Promise<void>;
countByPageId(accountId: string, pageId: string): Promise<number>;
````

## File: modules/notion/subdomains/knowledge/domain/repositories/index.ts
````typescript

````

## File: modules/notion/subdomains/knowledge/domain/repositories/KnowledgeCollectionRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/repositories
 * Purpose: Port interface for KnowledgeCollection persistence.
 */
⋮----
import type { KnowledgeCollection } from "../aggregates/KnowledgeCollection";
⋮----
export interface KnowledgeCollectionRepository {
  save(collection: KnowledgeCollection): Promise<void>;
  findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null>;
  listByAccountId(accountId: string): Promise<KnowledgeCollection[]>;
  listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]>;
}
⋮----
save(collection: KnowledgeCollection): Promise<void>;
findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null>;
listByAccountId(accountId: string): Promise<KnowledgeCollection[]>;
listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]>;
````

## File: modules/notion/subdomains/knowledge/domain/repositories/KnowledgePageRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/repositories
 * Purpose: Port interface for KnowledgePage persistence.
 */
⋮----
import type { KnowledgePage, KnowledgePageSnapshot } from "../aggregates/KnowledgePage";
⋮----
export interface KnowledgePageRepository {
  save(page: KnowledgePage): Promise<void>;
  findById(accountId: string, pageId: string): Promise<KnowledgePage | null>;
  listByAccountId(accountId: string): Promise<KnowledgePage[]>;
  listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]>;
  /** Count pages at same parent level for ordering */
  countByParent(accountId: string, parentPageId: string | null): Promise<number>;
  /** Snapshot type for direct projection queries */
  findSnapshotById(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null>;
  listSnapshotsByAccountId(accountId: string): Promise<KnowledgePageSnapshot[]>;
  listSnapshotsByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]>;
}
⋮----
save(page: KnowledgePage): Promise<void>;
findById(accountId: string, pageId: string): Promise<KnowledgePage | null>;
listByAccountId(accountId: string): Promise<KnowledgePage[]>;
listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]>;
/** Count pages at same parent level for ordering */
countByParent(accountId: string, parentPageId: string | null): Promise<number>;
/** Snapshot type for direct projection queries */
findSnapshotById(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null>;
listSnapshotsByAccountId(accountId: string): Promise<KnowledgePageSnapshot[]>;
listSnapshotsByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]>;
````

## File: modules/notion/subdomains/relations/application/index.ts
````typescript

````

## File: modules/notion/subdomains/relations/domain/events/RelationEvents.ts
````typescript
/**
 * Module: notion/subdomains/relations
 * Layer: domain/events
 * Purpose: Domain events for relation operations.
 */
⋮----
import type { NotionDomainEvent } from "../../../../domain/events/NotionDomainEvent";
⋮----
export interface RelationCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.relations.relation-created";
  readonly payload: {
    readonly relationId: string;
    readonly sourceArtifactId: string;
    readonly targetArtifactId: string;
    readonly relationType: string;
    readonly organizationId: string;
  };
}
⋮----
export interface RelationRemovedEvent extends NotionDomainEvent {
  readonly type: "notion.relations.relation-removed";
  readonly payload: {
    readonly relationId: string;
    readonly organizationId: string;
  };
}
````

## File: modules/notion/subdomains/relations/domain/index.ts
````typescript

````

## File: modules/notion/subdomains/relations/domain/repositories/RelationRepository.ts
````typescript
/**
 * Module: notion/subdomains/relations
 * Layer: domain/repositories
 * Purpose: RelationRepository — domain port for relation persistence.
 */
⋮----
import type { Relation } from "../entities/Relation";
⋮----
export interface RelationRepository {
  findById(relationId: string): Promise<Relation | null>;
  listBySource(sourceArtifactId: string): Promise<readonly Relation[]>;
  listByTarget(targetArtifactId: string): Promise<readonly Relation[]>;
  save(relation: Relation): Promise<void>;
  remove(relationId: string): Promise<void>;
}
⋮----
findById(relationId: string): Promise<Relation | null>;
listBySource(sourceArtifactId: string): Promise<readonly Relation[]>;
listByTarget(targetArtifactId: string): Promise<readonly Relation[]>;
save(relation: Relation): Promise<void>;
remove(relationId: string): Promise<void>;
````

## File: modules/notion/subdomains/taxonomy/application/index.ts
````typescript

````

## File: modules/notion/subdomains/taxonomy/domain/events/TaxonomyEvents.ts
````typescript
/**
 * Module: notion/subdomains/taxonomy
 * Layer: domain/events
 * Purpose: Domain events for taxonomy operations.
 */
⋮----
import type { NotionDomainEvent } from "../../../../domain/events/NotionDomainEvent";
⋮----
export interface TaxonomyNodeCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.taxonomy.node-created";
  readonly payload: {
    readonly nodeId: string;
    readonly label: string;
    readonly parentNodeId: string | null;
    readonly organizationId: string;
  };
}
⋮----
export interface TaxonomyNodeRemovedEvent extends NotionDomainEvent {
  readonly type: "notion.taxonomy.node-removed";
  readonly payload: {
    readonly nodeId: string;
    readonly organizationId: string;
  };
}
````

## File: modules/notion/subdomains/taxonomy/domain/index.ts
````typescript

````

## File: modules/notion/subdomains/taxonomy/domain/repositories/TaxonomyRepository.ts
````typescript
/**
 * Module: notion/subdomains/taxonomy
 * Layer: domain/repositories
 * Purpose: TaxonomyRepository — domain port for taxonomy node persistence.
 */
⋮----
import type { TaxonomyNode } from "../entities/TaxonomyNode";
⋮----
export interface TaxonomyRepository {
  findById(nodeId: string): Promise<TaxonomyNode | null>;
  listChildren(parentNodeId: string): Promise<readonly TaxonomyNode[]>;
  listRoots(organizationId: string): Promise<readonly TaxonomyNode[]>;
  save(node: TaxonomyNode): Promise<void>;
  remove(nodeId: string): Promise<void>;
}
⋮----
findById(nodeId: string): Promise<TaxonomyNode | null>;
listChildren(parentNodeId: string): Promise<readonly TaxonomyNode[]>;
listRoots(organizationId: string): Promise<readonly TaxonomyNode[]>;
save(node: TaxonomyNode): Promise<void>;
remove(nodeId: string): Promise<void>;
````

## File: modules/notion/AGENT.md
````markdown
# Notion Agent

> Strategic agent documentation: [docs/contexts/notion/AGENT.md](../../docs/contexts/notion/AGENT.md)

## Mission

保護 notion 主域作為知識內容生命週期邊界。notion 擁有正式知識內容（KnowledgePage、Article、Database），不擁有治理、工作區範疇或推理輸出。任何變更都應維持 notion 擁有內容建立、結構化、協作、版本化與交付語言。

## Bounded Context Summary

| Aspect | Description |
|--------|-------------|
| Primary role | 正典知識內容生命週期 |
| Upstream | platform（治理）、ai（shared AI capability）、workspace（workspaceId、membership scope、share scope） |
| Downstream | notebooklm（knowledge artifact reference、attachment reference、taxonomy hint） |
| Core invariant | notion 只能修改自己的正典內容，不可直接呼叫 notebooklm 的推理流程 |
| Published language | KnowledgeArtifact reference、attachment reference、taxonomy hint |

## Bounded Contexts

| Cluster | Subdomains | Responsibility |
|---------|------------|----------------|
| Content Core | knowledge, authoring | 知識頁面與文章生命週期、分類、內容區塊 |
| Collaboration & Change | collaboration | 協作留言、細粒度權限與版本快照 |
| Structured Data | database | 結構化資料多視圖管理與自動化 |
| Semantic Organization | taxonomy, relations | 分類法與語義關聯圖 |
| Future Extensions | publishing, attachments | 正式發布流程、附件管理 |

## Route Here When

- 問題核心是知識頁面（KnowledgePage）、內容區塊（ContentBlock）、知識集合（KnowledgeCollection）。
- 問題需要把內容建立、編輯、分類、關聯、版本或交付收斂到正典狀態。
- 問題涉及知識庫文章（Article）、分類（Category）、樣板（Template）。
- 問題涉及結構化資料視圖（Database、DatabaseView、Record）。
- 問題涉及協作留言（Comment）、細粒度權限（Permission）或版本快照（Version）。
- 問題涉及分類法（Taxonomy）或語義關聯（Relation）。

## Route Elsewhere When

- 身份、租戶、授權、權益、憑證治理屬於 platform。
- 共享 AI provider、模型政策、配額與安全護欄屬於 ai。
- 工作區生命週期、成員管理、共享範圍屬於 workspace。
- notebook、conversation、retrieval、grounding、synthesis 屬於 notebooklm。
- browser-facing shell composition、tab orchestration、panel assembly 屬於 workspace；notion 提供下游能力，不擁有外層 UI orchestration。

## Subdomain Delivery Tiers

### Tier 1 — Core (Active)

| Subdomain | Purpose | Key Aggregates |
|-----------|---------|----------------|
| knowledge | KnowledgePage 生命週期、ContentBlock 編輯、BacklinkIndex | KnowledgePage, ContentBlock, KnowledgeCollection, BacklinkIndex |
| authoring | 知識庫文章建立、驗證、分類與發布工作流程 | Article, Category |
| collaboration | 協作留言、細粒度權限與版本快照 | Comment, Permission, Version |
| database | 結構化資料多視圖（Table/Board/Calendar/Gallery） | Database, DatabaseRecord, View, DatabaseAutomation |

### Tier 2 — Near-Term (Domain Contracts — High Business Value)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| taxonomy | 分類法、標籤樹與語義組織（跨頁面分類的正典邊界） | ≠ authoring.Category（局部文章分類）；taxonomy 是全域語義網 |
| relations | 內容之間的正式語義關聯與 backlink 管理 | ≠ knowledge.BacklinkIndex（自動反向索引）；relations 是明確語義圖（有類型、有方向） |
| attachments | 附件與媒體關聯儲存 | 檔案儲存整合的正典邊界。待附件需要獨立於頁面的保留策略時充實 |

### Tier 3 — Medium-Term (Stubs)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| publishing | 正式發布與對外交付（Publication 狀態邊界） | authoring 的 `ArticlePublicationUseCases` 是前置邊界 |
| knowledge-versioning | 全域版本快照策略（workspace-level checkpoint、保留政策） | ≠ collaboration.Version（逐次編輯歷史）；是策略量，不是操作量 |

### Premature Stubs（目錄保留，不建議擴充）

| Subdomain | Reason |
|-----------|--------|
| automation | database 子域已涵蓋 DatabaseAutomation；跨內容類型事件自動化目前無獨立領域需求 |
| knowledge-analytics | 知識使用行為量測是讀模型關注，非獨立領域模型。可由 infrastructure 查詢層處理 |
| knowledge-integration | 外部系統整合是 infrastructure adapter 關注，非獨立子域 |
| notes | 輕量筆記可作為 KnowledgePage 的頁面類型處理，不需獨立子域 |
| templates | 頁面範本是 authoring 的內部關注（內容結構起點），非獨立子域 |

### Domain Invariants

- 知識內容的正典狀態屬於 notion。
- taxonomy 應獨立於具體 UI 視圖存在（目前由 Category 承載部分）。
- BacklinkIndex 描述自動反向連結；Relation 描述主動宣告的語義關係。兩者不互相取代。
- ai 可被 notion use case 消費，但 AI provider / policy ownership 不屬於 notion。
- 任何來自 notebooklm 的輸出，若要成為正典內容，必須先被 notion 吸收。

## Subdomain Analysis — 子域數量合理性

**14 個目錄（4 Active + 2 Domain Contracts + 1 Stub + 3 Medium-Term Stubs + 5 Premature = 15 分類，共 14 目錄），分析如下：**

1. **`knowledge` 與 `authoring` 不重疊**：`knowledge` 是 KnowledgePage + ContentBlock（自由形式的 wiki 頁面）；`authoring` 是 Article + Category（有工作流程的結構化 KB 文章）。
2. **`collaboration.Version` 與 `knowledge-versioning` 不重疊**：`collaboration.Version` 是逐次編輯快照（per-change history）；`knowledge-versioning` 是全域 checkpoint 策略（workspace-level snapshot policy）。
3. **`relations` 與 `knowledge.BacklinkIndex` 不重疊**：`BacklinkIndex` 是自動反向連結索引；`relations` 是明確的語義關係圖（有類型、有方向的關聯）。
4. **5 個 premature stubs** 有明確理由：每個都已被現有 active 子域或 infrastructure 層吸收。

## Ubiquitous Language

| Term | Meaning | Owning Subdomain | Do Not Use |
|------|---------|------------------|------------|
| KnowledgeArtifact | notion 主域擁有的知識內容總稱 | （跨子域概念） | Doc, Wiki (混指) |
| KnowledgePage | 正典頁面型知識單位（block-based） | knowledge | Wiki, Page (generic) |
| ContentBlock | 知識頁面的最小可組合內容單位 | knowledge | Block (generic) |
| KnowledgeCollection | 頁面集合容器（非 Database） | knowledge | Folder, Section |
| BacklinkIndex | 自動反向連結索引 | knowledge | - |
| PageStatus | 頁面生命週期狀態（draft, published, archived） | knowledge | - |
| Article | 經過撰寫與驗證流程的知識庫文章 | authoring | Post, Content |
| Category | 文章分類樹結構 | authoring | Tag System |
| Template | 可重複套用的內容結構起點 | authoring | Preset, Layout |
| Comment | 內容附著的協作討論 | collaboration | Chat, Discussion |
| Permission | 內容的細粒度存取權限 | collaboration | - |
| Version | 內容某一時點的不可變快照（逐次編輯歷史） | collaboration | - |
| Database | 結構化知識集合 | database | Table, Spreadsheet |
| DatabaseView | 對 Database 的投影與檢視配置 | database | View (generic) |
| DatabaseRecord | Database 中的一筆記錄 | database | - |
| DatabaseAutomation | Database 事件觸發的自動化動作 | database | - |
| Taxonomy | 分類法、標籤樹等語義組織結構 | taxonomy | Tag System, Category (混稱全域分類) |
| Relation | 內容對內容之間的正式語義關聯 | relations | Link, Connection |
| Publication | 對外可見且可交付的內容狀態 | publishing (stub) | Published, Public |
| Attachment | 綁定於知識內容的檔案或媒體 | attachments | File, Upload |
| VersionSnapshot | 全域版本 checkpoint 策略的不可變快照 | knowledge-versioning (stub) | Backup, History |

### Avoid

| Avoid | Use Instead |
|-------|-------------|
| Wiki | KnowledgePage 或 Article |
| Table | Database 或 DatabaseView |
| Tag System | Category (current) or Taxonomy (Tier 2) |
| Content Link | BacklinkIndex (automatic) or Relation (explicit semantic) |
| Publish Action | Publication 或 ArticlePublication |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
api/ ← 唯一跨模組入口
```

## Scope Contract

- Treat `accountId` as account scope and `workspaceId` as workspace scope supplied by workspace-owned composition; notion does not own top-level shell routing.
- Canonical shell navigation remains `/{accountId}/{workspaceId}` when notion panels or detail links are composed inside workspace flows.
- Use concrete user identifiers such as `currentUserId` and `createdByUserId` for acting users; do not drift into using `accountId` as a user identifier.

## Development Order (Domain-First)

New features:
1. Define Domain (entities, value objects, aggregates, events)
2. Define Application (use cases, DTOs)
3. Define Ports (only if boundary isolation needed)
4. Implement Infrastructure (adapters, persistence)
5. Implement Interfaces (UI, actions, hooks)

Legacy migration (Strangler Pattern):
1. Find a Use Case to extract
2. Build Domain model in the owning subdomain
3. Converge Application layer
4. Isolate legacy via Ports
5. Replace Infrastructure adapter; remove old path when stable
````

## File: modules/notion/api/server.ts
````typescript

````

## File: modules/notion/docs/README.md
````markdown
# Notion Documentation

Implementation-level documentation for the notion bounded context.

## Strategic Documentation (Authority)

Strategic architecture documentation lives in `docs/contexts/notion/`:

- [README.md](../../../docs/contexts/notion/README.md) — Context overview
- [subdomains.md](../../../docs/contexts/notion/subdomains.md) — Subdomain inventory
- [bounded-contexts.md](../../../docs/contexts/notion/bounded-contexts.md) — Ownership map
- [context-map.md](../../../docs/contexts/notion/context-map.md) — Relationships
- [ubiquitous-language.md](../../../docs/contexts/notion/ubiquitous-language.md) — Terminology

## Architecture Reference

- [Bounded Context Template](../../../docs/bounded-context-subdomain-template.md) — Standard structure
- [Architecture Overview](../../../docs/architecture-overview.md) — System-wide architecture
- [Integration Guidelines](../../../docs/integration-guidelines.md) — Cross-context rules

## Current Sync Points

- Workspace route authority stays outside notion: when local implementation docs mention shell-facing navigation, point to the canonical workspace route `/{accountId}/{workspaceId}` owned by workspace composition.
- Scope-token authority stays in the root docs: notion consumes `accountId` and `workspaceId` as published scope inputs and uses concrete user identifiers such as `currentUserId` or `createdByUserId` for acting users.
- If notion implementation notes describe AI or orchestration, keep ownership language aligned with the root baseline: the AI context owns shared AI capability; notion consumes it.
- System-wide baseline remains the root architecture set: Hexagonal + DDD, Firebase serverless backend, Genkit orchestration, Zustand/XState frontend state, and Zod runtime validation.

## Conflict Resolution

- Strategic docs in `docs/contexts/notion/` are the authority for naming, ownership, and boundaries.
- This `docs/` folder is for implementation-aligned detail only.
````

## File: modules/notion/infrastructure/authoring/firebase/FirebaseArticleRepository.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbArticles/{articleId}
 * Note: Preserves same collection path as previous knowledge-base module for data continuity.
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import type { ArticleSnapshot, ArticleStatus, ArticleVerificationState } from "../../../subdomains/authoring/domain/aggregates/Article";
import type { ArticleRepository } from "../../../subdomains/authoring/domain/repositories/ArticleRepository";
⋮----
function articlesPath(accountId: string): string
⋮----
function articlePath(accountId: string, articleId: string): string
⋮----
function toSnapshot(id: string, data: Record<string, unknown>): ArticleSnapshot
⋮----
export class FirebaseArticleRepository implements ArticleRepository {
⋮----
async getById(accountId: string, articleId: string): Promise<ArticleSnapshot | null>
⋮----
async list(params: {
    accountId: string;
    workspaceId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
}): Promise<ArticleSnapshot[]>
⋮----
async listByLinkedArticleId(accountId: string, articleId: string): Promise<ArticleSnapshot[]>
⋮----
async save(snapshot: ArticleSnapshot): Promise<void>
⋮----
async delete(accountId: string, articleId: string): Promise<void>
````

## File: modules/notion/infrastructure/authoring/firebase/FirebaseCategoryRepository.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbCategories/{categoryId}
 * Note: Preserves same collection path as previous knowledge-base module for data continuity.
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import type { CategorySnapshot } from "../../../subdomains/authoring/domain/aggregates/Category";
import type { CategoryRepository } from "../../../subdomains/authoring/domain/repositories/CategoryRepository";
⋮----
function categoriesPath(accountId: string): string
⋮----
function categoryPath(accountId: string, categoryId: string): string
⋮----
function toSnapshot(id: string, data: Record<string, unknown>): CategorySnapshot
⋮----
export class FirebaseCategoryRepository implements CategoryRepository {
⋮----
async getById(accountId: string, categoryId: string): Promise<CategorySnapshot | null>
⋮----
async listByWorkspace(accountId: string, workspaceId: string): Promise<CategorySnapshot[]>
⋮----
async save(snapshot: CategorySnapshot): Promise<void>
⋮----
async delete(accountId: string, categoryId: string): Promise<void>
````

## File: modules/notion/infrastructure/collaboration/firebase/FirebaseCommentRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationComments/{commentId}
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import { v7 as generateId } from "@lib-uuid";
import type { CommentSnapshot, SelectionRange } from "../../../subdomains/collaboration/domain/aggregates/Comment";
import type {
  CommentRepository,
  CommentUnsubscribe,
  CreateCommentInput,
  UpdateCommentInput,
  ResolveCommentInput,
} from "../../../subdomains/collaboration/domain/repositories/CommentRepository";
⋮----
function commentsPath(accountId: string): string
⋮----
function commentPath(accountId: string, id: string): string
⋮----
function toComment(id: string, data: Record<string, unknown>): CommentSnapshot
⋮----
export class FirebaseCommentRepository implements CommentRepository {
⋮----
async create(input: CreateCommentInput): Promise<CommentSnapshot>
⋮----
async update(input: UpdateCommentInput): Promise<CommentSnapshot | null>
⋮----
async resolve(input: ResolveCommentInput): Promise<CommentSnapshot | null>
⋮----
async delete(accountId: string, commentId: string): Promise<void>
⋮----
async findById(accountId: string, commentId: string): Promise<CommentSnapshot | null>
⋮----
async listByContent(accountId: string, contentId: string): Promise<CommentSnapshot[]>
⋮----
subscribe(accountId: string, contentId: string, onUpdate: (comments: CommentSnapshot[]) => void): CommentUnsubscribe
````

## File: modules/notion/infrastructure/collaboration/firebase/FirebasePermissionRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationPermissions/{id}
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import { v7 as generateId } from "@lib-uuid";
import type { PermissionSnapshot, PermissionLevel, PrincipalType } from "../../../subdomains/collaboration/domain/aggregates/Permission";
import type { PermissionRepository, GrantPermissionInput } from "../../../subdomains/collaboration/domain/repositories/PermissionRepository";
⋮----
function permissionsPath(accountId: string): string
⋮----
function permissionPath(accountId: string, id: string): string
⋮----
function toPermission(id: string, data: Record<string, unknown>): PermissionSnapshot
⋮----
export class FirebasePermissionRepository implements PermissionRepository {
⋮----
async grant(input: GrantPermissionInput): Promise<PermissionSnapshot>
⋮----
async revoke(accountId: string, permissionId: string): Promise<void>
⋮----
async findById(accountId: string, permissionId: string): Promise<PermissionSnapshot | null>
⋮----
async listBySubject(accountId: string, subjectId: string): Promise<PermissionSnapshot[]>
````

## File: modules/notion/infrastructure/collaboration/firebase/FirebaseVersionRepository.ts
````typescript
/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationVersions/{versionId}
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import { v7 as generateId } from "@lib-uuid";
import type { VersionSnapshot } from "../../../subdomains/collaboration/domain/aggregates/Version";
import type { VersionRepository, CreateVersionInput } from "../../../subdomains/collaboration/domain/repositories/VersionRepository";
⋮----
function versionsPath(accountId: string): string
⋮----
function versionPath(accountId: string, id: string): string
⋮----
function toVersion(id: string, data: Record<string, unknown>): VersionSnapshot
⋮----
export class FirebaseVersionRepository implements VersionRepository {
⋮----
async create(input: CreateVersionInput): Promise<VersionSnapshot>
⋮----
async findById(accountId: string, versionId: string): Promise<VersionSnapshot | null>
⋮----
async listByContent(accountId: string, contentId: string): Promise<VersionSnapshot[]>
⋮----
async delete(accountId: string, versionId: string): Promise<void>
````

## File: modules/notion/infrastructure/database/firebase/FirebaseDatabaseRecordRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of DatabaseRecordRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}/records/{recordId}
 */
⋮----
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
import { v7 as generateId } from "@lib-uuid";
import type { DatabaseRecordRepository, CreateRecordInput, UpdateRecordInput } from "../../../subdomains/database/domain/repositories/DatabaseRecordRepository";
import type { DatabaseRecordSnapshot } from "../../../subdomains/database/domain/aggregates/DatabaseRecord";
⋮----
function recordsPath(accountId: string, databaseId: string): string
⋮----
function recordPath(accountId: string, databaseId: string, recordId: string): string
⋮----
function toISO(ts: unknown): string
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSnapshot(id: string, data: Record<string, any>): DatabaseRecordSnapshot
⋮----
export class FirebaseDatabaseRecordRepository implements DatabaseRecordRepository {
⋮----
async create(input: CreateRecordInput): Promise<DatabaseRecordSnapshot>
⋮----
async update(input: UpdateRecordInput): Promise<DatabaseRecordSnapshot>
⋮----
// We need to find which database this record belongs to. Properties are keyed by field IDs.
// The record stores databaseId on the document; we fetch it via a collection-group query approach.
// For simplicity, the input should come from a context where databaseId is available.
// Here we use a direct path by reading the doc first from a stored databaseId lookup.
// Since the record doc lives in accounts/{accountId}/knowledgeDatabases/{databaseId}/records/{id},
// and we only have id+accountId, we do collection group query.
⋮----
async delete(id: string, accountId: string): Promise<void>
⋮----
async listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecordSnapshot[]>
````

## File: modules/notion/infrastructure/database/firebase/FirebaseDatabaseRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of DatabaseRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}
 */
⋮----
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
import { generateId } from "@shared-utils";
import type { DatabaseRepository, CreateDatabaseInput, UpdateDatabaseInput, AddFieldInput } from "../../../subdomains/database/domain/repositories/DatabaseRepository";
import type { DatabaseSnapshot, Field } from "../../../subdomains/database/domain/aggregates/Database";
⋮----
function databasesPath(accountId: string): string
⋮----
function databasePath(accountId: string, id: string): string
⋮----
function toISO(ts: unknown): string
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSnapshot(id: string, data: Record<string, any>): DatabaseSnapshot
⋮----
export class FirebaseDatabaseRepository implements DatabaseRepository {
⋮----
async create(input: CreateDatabaseInput): Promise<DatabaseSnapshot>
⋮----
async update(input: UpdateDatabaseInput): Promise<DatabaseSnapshot>
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
⋮----
async addField(input: AddFieldInput): Promise<Field>
⋮----
async archive(id: string, accountId: string): Promise<void>
⋮----
async findById(id: string, accountId: string): Promise<DatabaseSnapshot | null>
⋮----
async listByWorkspace(accountId: string, workspaceId: string): Promise<DatabaseSnapshot[]>
````

## File: modules/notion/infrastructure/database/firebase/FirebaseViewRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of ViewRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}/views/{viewId}
 */
⋮----
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
import { v7 as generateId } from "@lib-uuid";
import type { ViewRepository, CreateViewInput, UpdateViewInput } from "../../../subdomains/database/domain/repositories/ViewRepository";
import type { ViewSnapshot } from "../../../subdomains/database/domain/aggregates/View";
⋮----
function viewsPath(accountId: string, databaseId: string): string
⋮----
function viewPath(accountId: string, databaseId: string, id: string): string
⋮----
function toISO(ts: unknown): string
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSnapshot(id: string, data: Record<string, any>): ViewSnapshot
⋮----
export class FirebaseViewRepository implements ViewRepository {
⋮----
async create(input: CreateViewInput): Promise<ViewSnapshot>
⋮----
async update(input: UpdateViewInput): Promise<ViewSnapshot>
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
⋮----
async delete(id: string, accountId: string): Promise<void>
⋮----
async listByDatabase(accountId: string, databaseId: string): Promise<ViewSnapshot[]>
````

## File: modules/notion/infrastructure/knowledge/ai/SharedAiKnowledgeSummaryAdapter.ts
````typescript
import { distillContent } from "@/modules/ai/api/server";
import type {
  KnowledgeDistillationInput,
  KnowledgeDistillationPort,
  KnowledgeDistillationResult,
} from "../../../subdomains/knowledge/domain/ports/KnowledgeDistillationPort";
import type {
  KnowledgeSummaryInput,
  KnowledgeSummaryPort,
  KnowledgeSummaryResult,
} from "../../../subdomains/knowledge/domain/ports/KnowledgeSummaryPort";
⋮----
/**
 * Infrastructure adapter that lets Notion consume the shared AI bounded context
 * without embedding provider or Genkit ownership into the Notion module.
 */
export class SharedAiKnowledgeSummaryAdapter implements KnowledgeSummaryPort, KnowledgeDistillationPort {
⋮----
async summarizePage(input: KnowledgeSummaryInput): Promise<KnowledgeSummaryResult>
⋮----
async distillPage(input: KnowledgeDistillationInput): Promise<KnowledgeDistillationResult>
````

## File: modules/notion/infrastructure/knowledge/firebase/FirebaseBacklinkIndexRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing BacklinkIndexRepository.
 * Firestore paths:
 *   accounts/{accountId}/backlinkIndex/{targetPageId}
 *   accounts/{accountId}/backlinkOutbound/{sourcePageId}
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import type { BacklinkIndexRepository, UpsertBacklinkEntriesInput, RemoveBacklinksFromSourceInput } from "../../../subdomains/knowledge/domain/repositories/BacklinkIndexRepository";
import { BacklinkIndex } from "../../../subdomains/knowledge/domain/aggregates/BacklinkIndex";
import type { BacklinkEntry, BacklinkIndexSnapshot } from "../../../subdomains/knowledge/domain/aggregates/BacklinkIndex";
⋮----
function backlinkIndexPath(accountId: string, targetPageId: string): string
⋮----
function backlinkOutboundPath(accountId: string, sourcePageId: string): string
⋮----
function toEntries(raw: unknown): BacklinkEntry[]
⋮----
export class FirebaseBacklinkIndexRepository implements BacklinkIndexRepository {
⋮----
async upsertFromSource(input: UpsertBacklinkEntriesInput): Promise<void>
⋮----
async removeFromSource(input: RemoveBacklinksFromSourceInput): Promise<void>
⋮----
async findByTargetPage(accountId: string, targetPageId: string): Promise<BacklinkIndex | null>
⋮----
async listOutboundTargets(accountId: string, sourcePageId: string): Promise<ReadonlyArray<string>>
````

## File: modules/notion/infrastructure/knowledge/firebase/FirebaseContentBlockRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing ContentBlockRepository.
 * Firestore path: accounts/{accountId}/contentBlocks/{blockId}
 */
⋮----
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
import { v7 as _generateId } from "@lib-uuid";
import { ContentBlock } from "../../../subdomains/knowledge/domain/aggregates/ContentBlock";
import type { ContentBlockSnapshot } from "../../../subdomains/knowledge/domain/aggregates/ContentBlock";
import type { ContentBlockRepository } from "../../../subdomains/knowledge/domain/repositories/ContentBlockRepository";
import type { BlockContent } from "../../../subdomains/knowledge/domain/value-objects/BlockContent";
import { BLOCK_TYPES } from "../../../subdomains/knowledge/domain/value-objects/BlockContent";
⋮----
function blocksPath(accountId: string): string
⋮----
function blockPath(accountId: string, blockId: string): string
⋮----
function toBlockContent(raw: unknown): BlockContent
⋮----
function toSnapshot(id: string, d: Record<string, unknown>): ContentBlockSnapshot
⋮----
export class FirebaseContentBlockRepository implements ContentBlockRepository {
⋮----
async save(block: ContentBlock): Promise<void>
⋮----
async findById(accountId: string, blockId: string): Promise<ContentBlock | null>
⋮----
async listByPageId(accountId: string, pageId: string): Promise<ContentBlock[]>
⋮----
async delete(accountId: string, blockId: string): Promise<void>
⋮----
async nextOrder(accountId: string, pageId: string): Promise<number>
⋮----
async countByPageId(accountId: string, pageId: string): Promise<number>
````

## File: modules/notion/infrastructure/knowledge/firebase/FirebaseKnowledgeCollectionRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing KnowledgeCollectionRepository.
 * Firestore path: accounts/{accountId}/knowledgeCollections/{collectionId}
 */
⋮----
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
import { KnowledgeCollection } from "../../../subdomains/knowledge/domain/aggregates/KnowledgeCollection";
import type { KnowledgeCollectionSnapshot } from "../../../subdomains/knowledge/domain/aggregates/KnowledgeCollection";
import type { KnowledgeCollectionRepository } from "../../../subdomains/knowledge/domain/repositories/KnowledgeCollectionRepository";
⋮----
function collectionsPath(accountId: string): string
⋮----
function collectionPath(accountId: string, id: string): string
⋮----
function toSnapshot(id: string, d: Record<string, unknown>): KnowledgeCollectionSnapshot
⋮----
export class FirebaseKnowledgeCollectionRepository implements KnowledgeCollectionRepository {
⋮----
async save(coll: KnowledgeCollection): Promise<void>
⋮----
async findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null>
⋮----
async listByAccountId(accountId: string): Promise<KnowledgeCollection[]>
⋮----
async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]>
````

## File: modules/notion/infrastructure/knowledge/firebase/FirebaseKnowledgePageRepository.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing KnowledgePageRepository.
 * Firestore path: accounts/{accountId}/contentPages/{pageId}
 */
⋮----
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
import { v7 as _generateId } from "@lib-uuid";
import { KnowledgePage } from "../../../subdomains/knowledge/domain/aggregates/KnowledgePage";
import type { KnowledgePageSnapshot } from "../../../subdomains/knowledge/domain/aggregates/KnowledgePage";
import type { KnowledgePageRepository } from "../../../subdomains/knowledge/domain/repositories/KnowledgePageRepository";
⋮----
function pagesPath(accountId: string): string
⋮----
function pagePath(accountId: string, pageId: string): string
⋮----
function toSnapshot(id: string, d: Record<string, unknown>): KnowledgePageSnapshot
⋮----
export class FirebaseKnowledgePageRepository implements KnowledgePageRepository {
⋮----
async save(page: KnowledgePage): Promise<void>
⋮----
async findById(accountId: string, pageId: string): Promise<KnowledgePage | null>
⋮----
async listByAccountId(accountId: string): Promise<KnowledgePage[]>
⋮----
async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]>
⋮----
async countByParent(accountId: string, parentPageId: string | null): Promise<number>
⋮----
async findSnapshotById(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null>
⋮----
async listSnapshotsByAccountId(accountId: string): Promise<KnowledgePageSnapshot[]>
⋮----
async listSnapshotsByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]>
````

## File: modules/notion/infrastructure/relations/firebase/FirebaseRelationRepository.ts
````typescript
/**
 * Module: notion/subdomains/relations
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing RelationRepository.
 * Firestore path: notionRelations/{relationId}
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import type { Relation } from "../../../subdomains/relations/domain/entities/Relation";
import type { RelationRepository } from "../../../subdomains/relations/domain/repositories/RelationRepository";
⋮----
function relationsPath(): string
⋮----
function relationPath(relationId: string): string
⋮----
function toRelation(relationId: string, data: Record<string, unknown>): Relation
⋮----
export class FirebaseRelationRepository implements RelationRepository {
⋮----
async findById(relationId: string): Promise<Relation | null>
⋮----
async listBySource(sourceArtifactId: string): Promise<readonly Relation[]>
⋮----
async listByTarget(targetArtifactId: string): Promise<readonly Relation[]>
⋮----
async save(relation: Relation): Promise<void>
⋮----
async remove(relationId: string): Promise<void>
````

## File: modules/notion/infrastructure/taxonomy/firebase/FirebaseTaxonomyRepository.ts
````typescript
/**
 * Module: notion/subdomains/taxonomy
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing TaxonomyRepository.
 * Firestore path: notionTaxonomyNodes/{nodeId}
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import type { TaxonomyNode } from "../../../subdomains/taxonomy/domain/entities/TaxonomyNode";
import type { TaxonomyRepository } from "../../../subdomains/taxonomy/domain/repositories/TaxonomyRepository";
⋮----
function collectionPath(): string
⋮----
function docPath(nodeId: string): string
⋮----
function toTaxonomyNode(nodeId: string, data: Record<string, unknown>): TaxonomyNode
⋮----
export class FirebaseTaxonomyRepository implements TaxonomyRepository {
⋮----
async findById(nodeId: string): Promise<TaxonomyNode | null>
⋮----
async listRoots(organizationId: string): Promise<readonly TaxonomyNode[]>
⋮----
async listChildren(parentNodeId: string): Promise<readonly TaxonomyNode[]>
⋮----
async save(node: TaxonomyNode): Promise<void>
⋮----
async remove(nodeId: string): Promise<void>
````

## File: modules/notion/interfaces/database/components/DatabaseDetailPanel.tsx
````typescript
import { useCallback, useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Archive,
  FileText,
  PlusCircle,
  Table2,
  Kanban,
  List,
  Calendar,
  LayoutGrid,
  Zap,
} from "lucide-react";
⋮----
import { getDatabase } from "../queries";
import { addDatabaseField, archiveDatabase } from "../_actions/database.actions";
import { DatabaseTablePanel } from "./DatabaseTablePanel";
import { DatabaseBoardPanel } from "./DatabaseBoardPanel";
import { DatabaseListPanel } from "./DatabaseListPanel";
import { DatabaseCalendarPanel } from "./DatabaseCalendarPanel";
import { DatabaseGalleryPanel } from "./DatabaseGalleryPanel";
import { DatabaseAutomationPanel } from "./DatabaseAutomationPanel";
import { AddFieldDialog } from "./DatabaseAddFieldDialog";
import type { DatabaseSnapshot as Database, FieldType } from "../../../subdomains/database/application/dto/database.dto";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
⋮----
// ?? Props ?????????????????????????????????????????????????????????????????????
⋮----
export interface DatabaseDetailPanelProps {
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}
⋮----
// ?? Component ?????????????????????????????????????????????????????????????????
⋮----
export function DatabaseDetailPanel({
  accountId,
  workspaceId,
  currentUserId,
}: DatabaseDetailPanelProps)
⋮----
function handleAddField(name: string, type: FieldType, required: boolean)
⋮----
function handleArchive()
⋮----
<Button variant="ghost" size="sm" onClick=
⋮----
{/* Top bar */}
⋮----
{/* Page header */}
⋮----
{/* View switcher + actions */}
⋮----
onClick=
⋮----
<Button size="sm" variant="outline" onClick=
⋮----
{/* View */}
````

## File: modules/notion/interfaces/database/components/DatabaseFormsPanel.tsx
````typescript
/**
 * Route: /knowledge-database/databases/[databaseId]/forms
 * Purpose: Manage database forms ??create and embed form links for a specific database.
 */
⋮----
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Plus } from "lucide-react";
⋮----
import { getDatabase } from "../queries";
import { DatabaseFormPanel } from "./DatabaseFormPanel";
import type { DatabaseSnapshot as Database } from "../../../subdomains/database/application/dto/database.dto";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-shadcn/ui/tabs";
⋮----
// ?? Props ?????????????????????????????????????????????????????????????????????
⋮----
export interface DatabaseFormsPanelProps {
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}
⋮----
// ?? Component ?????????????????????????????????????????????????????????????????
⋮----
<Button variant="ghost" size="sm" onClick=
⋮----
{/* Top bar */}
````

## File: modules/notion/interfaces/knowledge/_actions/knowledge-page.actions.ts
````typescript
import { commandFailureFrom, type CommandResult } from "@shared-types";
⋮----
import { makeKnowledgeUseCases } from "../composition/use-cases";
import { PublishKnowledgeVersionUseCase } from "../../../subdomains/knowledge/application/queries/knowledge-version.queries";
import type {
  CreateKnowledgePageDto,
  RenameKnowledgePageDto,
  MoveKnowledgePageDto,
  ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksDto,
  ApproveKnowledgePageDto,
} from "../../../subdomains/knowledge/application/dto/KnowledgePageDto";
import type {
  VerifyKnowledgePageDto,
  RequestPageReviewDto,
  AssignPageOwnerDto,
  UpdatePageIconDto,
  UpdatePageCoverDto,
} from "../../../subdomains/knowledge/application/dto/KnowledgePageLifecycleDto";
⋮----
export async function createKnowledgePage(input: CreateKnowledgePageDto): Promise<CommandResult>
⋮----
export async function renameKnowledgePage(input: RenameKnowledgePageDto): Promise<CommandResult>
⋮----
export async function moveKnowledgePage(input: MoveKnowledgePageDto): Promise<CommandResult>
⋮----
export async function archiveKnowledgePage(input: ArchiveKnowledgePageDto): Promise<CommandResult>
⋮----
export async function reorderKnowledgePageBlocks(input: ReorderKnowledgePageBlocksDto): Promise<CommandResult>
⋮----
export async function publishKnowledgeVersion(input:
⋮----
export async function approveKnowledgePage(input: ApproveKnowledgePageDto): Promise<CommandResult>
⋮----
export async function verifyKnowledgePage(input: VerifyKnowledgePageDto): Promise<CommandResult>
⋮----
export async function requestKnowledgePageReview(input: RequestPageReviewDto): Promise<CommandResult>
⋮----
export async function assignKnowledgePageOwner(input: AssignPageOwnerDto): Promise<CommandResult>
⋮----
export async function updateKnowledgePageIcon(input: UpdatePageIconDto): Promise<CommandResult>
⋮----
export async function updateKnowledgePageCover(input: UpdatePageCoverDto): Promise<CommandResult>
````

## File: modules/notion/interfaces/knowledge/composition/use-cases.ts
````typescript
import {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  ReorderKnowledgePageBlocksUseCase,
  VerifyKnowledgePageUseCase,
  ApproveKnowledgePageUseCase,
  RequestPageReviewUseCase,
  AssignPageOwnerUseCase,
  UpdatePageIconUseCase,
  UpdatePageCoverUseCase,
  CreateKnowledgeCollectionUseCase,
  RenameKnowledgeCollectionUseCase,
  AddPageToCollectionUseCase,
  RemovePageFromCollectionUseCase,
  ArchiveKnowledgeCollectionUseCase,
} from "../../../subdomains/knowledge/application/use-cases";
import type { KnowledgePageRepository } from "../../../subdomains/knowledge/domain/repositories/KnowledgePageRepository";
import type { KnowledgeCollectionRepository } from "../../../subdomains/knowledge/domain/repositories/KnowledgeCollectionRepository";
import type { IEventStoreRepository, IEventBusRepository } from "@shared-events";
import { createPlatformEventInfrastructure } from "@/modules/platform/api/server";
import { makePageRepo, makeCollectionRepo } from "./repositories";
⋮----
export interface KnowledgeUseCases {
  readonly createKnowledgePage: CreateKnowledgePageUseCase;
  readonly renameKnowledgePage: RenameKnowledgePageUseCase;
  readonly moveKnowledgePage: MoveKnowledgePageUseCase;
  readonly archiveKnowledgePage: ArchiveKnowledgePageUseCase;
  readonly reorderKnowledgePageBlocks: ReorderKnowledgePageBlocksUseCase;
  readonly verifyKnowledgePage: VerifyKnowledgePageUseCase;
  readonly approveKnowledgePage: ApproveKnowledgePageUseCase;
  readonly requestPageReview: RequestPageReviewUseCase;
  readonly assignPageOwner: AssignPageOwnerUseCase;
  readonly updatePageIcon: UpdatePageIconUseCase;
  readonly updatePageCover: UpdatePageCoverUseCase;
  readonly createKnowledgeCollection: CreateKnowledgeCollectionUseCase;
  readonly renameKnowledgeCollection: RenameKnowledgeCollectionUseCase;
  readonly addPageToCollection: AddPageToCollectionUseCase;
  readonly removePageFromCollection: RemovePageFromCollectionUseCase;
  readonly archiveKnowledgeCollection: ArchiveKnowledgeCollectionUseCase;
}
⋮----
export function makeKnowledgeUseCases(
  pageRepo: KnowledgePageRepository = makePageRepo(),
  collectionRepo: KnowledgeCollectionRepository = makeCollectionRepo(),
  eventStore?: IEventStoreRepository,
  eventBus?: IEventBusRepository,
): KnowledgeUseCases
````

## File: modules/notion/interfaces/relations/composition/use-cases.ts
````typescript
import {
  CreateRelationUseCase,
  ListRelationsBySourceUseCase,
  ListRelationsByTargetUseCase,
  RemoveRelationUseCase,
} from "../../../subdomains/relations/application/use-cases/manage-relation.use-cases";
import type { RelationRepository } from "../../../subdomains/relations/domain/repositories/RelationRepository";
import { makeRelationRepo } from "./repositories";
⋮----
export interface RelationUseCases {
  readonly createRelation: CreateRelationUseCase;
  readonly removeRelation: RemoveRelationUseCase;
  readonly listRelationsBySource: ListRelationsBySourceUseCase;
  readonly listRelationsByTarget: ListRelationsByTargetUseCase;
}
⋮----
export function makeRelationUseCases(repo: RelationRepository = makeRelationRepo()): RelationUseCases
````

## File: modules/notion/interfaces/taxonomy/composition/use-cases.ts
````typescript
import {
  CreateTaxonomyNodeUseCase,
  ListTaxonomyChildrenUseCase,
  ListTaxonomyRootsUseCase,
  RemoveTaxonomyNodeUseCase,
} from "../../../subdomains/taxonomy/application/use-cases/manage-taxonomy.use-cases";
import type { TaxonomyRepository } from "../../../subdomains/taxonomy/domain/repositories/TaxonomyRepository";
import { makeTaxonomyRepo } from "./repositories";
⋮----
export interface TaxonomyUseCases {
  readonly createTaxonomyNode: CreateTaxonomyNodeUseCase;
  readonly removeTaxonomyNode: RemoveTaxonomyNodeUseCase;
  readonly listTaxonomyRoots: ListTaxonomyRootsUseCase;
  readonly listTaxonomyChildren: ListTaxonomyChildrenUseCase;
}
⋮----
export function makeTaxonomyUseCases(
  repo: TaxonomyRepository = makeTaxonomyRepo(),
): TaxonomyUseCases
````

## File: modules/notion/README.md
````markdown
# Notion

知識內容生命週期主域

## Bounded Context

| Aspect | Description |
|--------|-------------|
| Primary role | 正典知識內容生命週期（頁面、文章、資料庫、協作、版本） |
| Upstream | platform（治理）、ai（shared AI capability）、workspace（workspaceId、membership scope、share scope） |
| Downstream | notebooklm（knowledge artifact reference、attachment reference、taxonomy hint） |
| Core principle | notion 擁有正典知識內容，不擁有治理或推理過程 |
| Cross-module boundary | `api/` only — no direct import of platform/workspace/notebooklm internals |

## Ubiquitous Language

| Term | Meaning |
|------|---------|
| KnowledgeArtifact | notion 主域擁有的知識內容總稱 |
| KnowledgePage | 正典頁面型知識單位（block-based 自由頁面） |
| ContentBlock | 知識頁面的最小可組合內容單位（段落、標題、程式碼等） |
| KnowledgeCollection | 頁面集合容器（分組 KnowledgePage，非 Database） |
| BacklinkIndex | 自動反向連結索引（哪些頁面引用了此頁面） |
| Article | 經過撰寫與驗證工作流程的知識庫文章 |
| Database | 結構化知識集合（可投影多種視圖） |
| DatabaseView | 對 Database 的投影配置（Table/Board/Calendar/Gallery/Form） |
| DatabaseRecord | Database 中的一筆記錄 |
| Taxonomy | 跨頁面的分類法與語義組織結構 |
| Relation | 內容對內容之間的正式語義關聯（有類型、有方向） |
| Publication | 對外可見且可交付的內容狀態 |
| VersionSnapshot | 全域版本 checkpoint 策略的不可變快照（≠ 逐次編輯 Version） |
| Template | 可重複套用的內容結構起點 |
| Attachment | 綁定於知識內容的檔案或媒體 |

## Implementation Structure

```text
modules/notion/
├── api/              # Public API boundary — cross-module entry point only
├── application/      # Context-wide orchestration
├── domain/           # Context-wide domain concepts (events, published-language)
├── infrastructure/   # Context-wide driven adapters, grouped by subdomain when needed
├── interfaces/       # Context-wide driving adapters, grouped by subdomain when needed
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── knowledge/             # Tier 1 — Active (KnowledgePage, ContentBlock)
    ├── authoring/             # Tier 1 — Active (Article, Category)
    ├── collaboration/         # Tier 1 — Active (Comment, Permission, Version)
    ├── database/              # Tier 1 — Active (Database, Record, View)
    ├── taxonomy/              # Tier 2 — Domain contracts (semantic classification)
    ├── relations/             # Tier 2 — Domain contracts (explicit semantic graph)
    ├── attachments/           # Tier 2 — Stub (file/media association)
    ├── publishing/            # Tier 3 — Stub (external delivery boundary)
    ├── knowledge-versioning/  # Tier 3 — Stub (global snapshot policy)
    ├── notes/                 # Premature — absorbed by KnowledgePage
    ├── templates/             # Premature — absorbed by authoring
    ├── automation/            # Premature — absorbed by database
    ├── knowledge-analytics/   # Premature — read model concern
    └── knowledge-integration/ # Premature — infrastructure adapter concern
```

> **Premature stubs** — `notes/`, `templates/`, `automation/`, `knowledge-analytics/`, `knowledge-integration/` 目錄存在但不建議擴充。見 [Premature Stubs](#premature-stubs) 段落。

## Subdomains

### Tier 1 — Core (Active)

| Subdomain | Purpose | Key Aggregates / Entities |
|-----------|---------|--------------------------|
| knowledge | KnowledgePage 生命週期、ContentBlock 編輯、BacklinkIndex、版本查詢 | KnowledgePage, ContentBlock, KnowledgeCollection, BacklinkIndex |
| authoring | 知識庫文章建立、驗證工作流程與分類目錄 | Article, Category |
| collaboration | 協作留言、細粒度權限與版本快照（逐次編輯歷史） | Comment, Permission, Version |
| database | 結構化資料視圖（Table/Board/Calendar/Gallery/Form）、記錄、自動化 | Database, DatabaseRecord, View, DatabaseAutomation |

### Tier 2 — Near-Term (Domain Contracts — High Business Value)

| Subdomain | Purpose | Distinction |
|-----------|---------|------------|
| taxonomy | 跨頁面分類法與語義組織（全域標籤樹、主題分類） | ≠ authoring.Category（局部文章分類）；taxonomy 是全域語義網 |
| relations | 內容對內容的明確語義關聯（有類型、方向） | ≠ knowledge.BacklinkIndex（自動反向連結）；relations 是主動宣告的語義圖 |
| attachments | 附件與媒體關聯儲存（Storage 整合正典邊界） | 獨立於知識頁面內容模型。待附件需要獨立保留策略時充實 |

### Tier 3 — Medium-Term (Stubs)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| publishing | 正式對外交付的 Publication 狀態邊界 | authoring 的 `ArticlePublicationUseCases` 是前置邊界 |
| knowledge-versioning | 全域版本 checkpoint 策略（workspace-level, 保留政策） | ≠ collaboration.Version（per-edit 歷史）；是策略量，不是操作量 |

### Premature Stubs（目錄保留，不建議擴充）

| Subdomain | Reason |
|-----------|--------|
| notes | 輕量筆記可作為 KnowledgePage 的頁面類型處理，不需獨立子域 |
| templates | 頁面範本是 authoring 的內部關注（內容結構起點），非獨立子域 |
| automation | database 子域已涵蓋 DatabaseAutomation；跨內容類型事件自動化目前無獨立領域需求 |
| knowledge-analytics | 知識使用行為量測是讀模型關注，非獨立領域模型。可由 infrastructure 查詢層處理 |
| knowledge-integration | 外部系統整合是 infrastructure adapter 關注，非獨立子域 |

## Subdomain Analysis

**14 個目錄（4 Active + 2 Domain Contracts + 1 Stub + 2 Medium-Term + 5 Premature），分析如下：**

- ✅ `knowledge` 與 `authoring` 分工正確：自由頁面（block-based wiki）vs. 結構化文章（KB article workflow）。
- ✅ `collaboration.Version`（逐次編輯快照）與 `knowledge-versioning`（全域 checkpoint 策略）是不同責任，分開正確。
- ✅ `knowledge.BacklinkIndex`（自動反向索引）與 `relations`（明確語義圖）不重疊。
- ✅ `taxonomy` 是全域語義組織核心，與 `authoring.Category`（局部文章分類）不重疊，維持 Tier 2。
- ✅ 5 個 premature stubs 有明確理由：每個都已被現有 active 子域或 infrastructure 層吸收。
- ⚠️ `knowledge-versioning` 需持續明確與 `collaboration.Version` 的分界，避免實作者混淆。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- `domain/` must not import infrastructure, interfaces, React, Firebase SDK, or any runtime framework.
- Cross-module collaboration goes through `api/` only.

## Current Contract Alignment

- Notion consumes `accountId` and `workspaceId` as downstream scope tokens from workspace-owned shell composition; it does not own top-level shell routes.
- Browser-facing notion links rendered inside shell flows must stay anchored to the canonical workspace route `/{accountId}/{workspaceId}` chosen by workspace composition, not reintroduce legacy `/workspace/*` URL shapes.
- Use `currentUserId`, `createdByUserId`, and similar concrete user identifiers for acting users; do not collapse them into `accountId` or `workspaceId`.
- This bounded context follows the repo baseline: Hexagonal Architecture + DDD, Firebase adapters outside the core, shared AI capability consumed through upstream ai boundaries, Zustand/XState only in interface workflows, and Zod at runtime validation boundaries.

## Strategic Documentation

- [Context README](../../docs/contexts/notion/README.md)
- [Subdomains](../../docs/contexts/notion/subdomains.md)
- [Bounded Context](../../docs/contexts/notion/bounded-contexts.md)
- [Context Map](../../docs/contexts/notion/context-map.md)
- [Ubiquitous Language](../../docs/contexts/notion/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
````

## File: modules/notion/subdomains/authoring/domain/aggregates/Article.ts
````typescript
/**
 * Module: notion/subdomains/authoring
 * Layer: domain/aggregates
 * Purpose: Article aggregate root — lifecycle, publication, and verification of KB articles.
 */
⋮----
import { v4 as uuid } from "@lib-uuid";
import type { NotionDomainEvent } from "../events/NotionDomainEvent";
⋮----
export type ArticleStatus = "draft" | "published" | "archived";
export type ArticleVerificationState = "verified" | "needs_review" | "unverified";
⋮----
export interface ArticleSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId: string;
  readonly categoryId: string | null;
  readonly title: string;
  readonly content: string;
  readonly tags: readonly string[];
  readonly status: ArticleStatus;
  readonly version: number;
  readonly verificationState: ArticleVerificationState;
  readonly ownerId: string | null;
  readonly verifiedByUserId: string | null;
  readonly verifiedAtISO: string | null;
  readonly verificationExpiresAtISO: string | null;
  readonly linkedArticleIds: readonly string[];
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateArticleInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly categoryId: string | null;
  readonly title: string;
  readonly content: string;
  readonly tags: string[];
  readonly createdByUserId: string;
}
⋮----
export class Article {
⋮----
private constructor(private _props: ArticleSnapshot)
⋮----
static create(id: string, input: CreateArticleInput): Article
⋮----
static reconstitute(snapshot: ArticleSnapshot): Article
⋮----
update(fields:
⋮----
publish(): void
⋮----
archive(): void
⋮----
verify(byUserId: string, expiresAtISO?: string): void
⋮----
requestReview(): void
⋮----
getSnapshot(): ArticleSnapshot
⋮----
pullDomainEvents(): NotionDomainEvent[]
⋮----
get id(): string
get accountId(): string
get status(): ArticleStatus
````

## File: modules/notion/subdomains/authoring/domain/ports/index.ts
````typescript
/**
 * notion/authoring domain/ports — driven port interfaces for the authoring subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
````

## File: modules/notion/subdomains/collaboration/domain/ports/index.ts
````typescript
/**
 * notion/collaboration domain/ports — driven port interfaces for the collaboration subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
````

## File: modules/notion/subdomains/database/api/index.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 *
 * Open Host Service contracts:
 *   - getDatabaseById  ??consumed by knowledge subdomain (opaque reference resolution)
 */
⋮----
// Domain types
⋮----
// Repository input types
⋮----
// Application DTOs
⋮----
// Server actions
⋮----
// Queries
⋮----
// UI components are exported from ./ui to keep this barrel semantic-only.
````

## File: modules/notion/subdomains/database/domain/aggregates/DatabaseAutomation.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: domain/aggregates
 * Purpose: DatabaseAutomation aggregate — event-driven automation rules on a database.
 */
⋮----
export type AutomationTrigger =
  | "record-created"
  | "record-updated"
  | "record-deleted"
  | "property-changed";
⋮----
export type AutomationActionType =
  | "send-notification"
  | "update-property"
  | "create-record"
  | "webhook";
⋮----
export interface AutomationCondition {
  fieldId: string;
  operator: "equals" | "not-equals" | "is-empty" | "is-not-empty" | "contains";
  value?: unknown;
}
⋮----
export interface AutomationAction {
  type: AutomationActionType;
  config: Record<string, string>;
}
⋮----
export interface DatabaseAutomationSnapshot {
  id: string;
  databaseId: string;
  accountId: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  triggerFieldId?: string;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  createdAtISO: string;
  updatedAtISO: string;
}
⋮----
export type AutomationId = string;
````

## File: modules/notion/subdomains/database/domain/ports/index.ts
````typescript
/**
 * notion/database domain/ports — driven port interfaces for the database subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
````

## File: modules/notion/subdomains/knowledge/application/queries/knowledge-summary.queries.ts
````typescript
import type { ContentBlock } from "../../domain/aggregates/ContentBlock";
import type { KnowledgeDistillationPort } from "../../domain/ports/KnowledgeDistillationPort";
import type { KnowledgeSummaryPort } from "../../domain/ports/KnowledgeSummaryPort";
import type { ContentBlockRepository } from "../../domain/repositories/ContentBlockRepository";
import type { KnowledgePageRepository } from "../../domain/repositories/KnowledgePageRepository";
import { richTextToPlainText } from "../../domain/value-objects/BlockContent";
import type { KnowledgePageDistillation, KnowledgePageSummary } from "../dto/knowledge.dto";
⋮----
function buildPagePlainText(blocks: readonly ContentBlock[], resolvedTitle: string): string
⋮----
export class GenerateKnowledgePageSummaryQuery {
⋮----
constructor(
⋮----
async execute(accountId: string, pageId: string): Promise<KnowledgePageSummary | null>
⋮----
export class GenerateKnowledgePageDistillationQuery {
⋮----
async execute(accountId: string, pageId: string): Promise<KnowledgePageDistillation | null>
````

## File: modules/notion/subdomains/knowledge/domain/aggregates/ContentBlock.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/aggregates
 * Purpose: ContentBlock aggregate root — atomic content unit inside a Page.
 */
⋮----
import { v4 as uuid } from "@lib-uuid";
import type { BlockContent } from "../value-objects/BlockContent";
import { richTextToPlainText } from "../value-objects/BlockContent";
import type { NotionDomainEvent } from "../events/NotionDomainEvent";
⋮----
export interface ContentBlockSnapshot {
  readonly id: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  readonly order: number;
  readonly parentBlockId: string | null;
  readonly childBlockIds: ReadonlyArray<string>;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateContentBlockInput {
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  readonly order: number;
  readonly parentBlockId?: string | null;
}
⋮----
export class ContentBlock {
⋮----
private constructor(private _props: ContentBlockSnapshot)
⋮----
static create(id: string, input: CreateContentBlockInput): ContentBlock
⋮----
static reconstitute(snapshot: ContentBlockSnapshot): ContentBlock
⋮----
update(newContent: BlockContent): void
⋮----
delete(): void
⋮----
nest(parentId: string, index?: number): void
⋮----
unnest(index?: number): void
⋮----
addChild(childId: string, index?: number): void
⋮----
removeChild(childId: string): void
⋮----
// ── Getters ───────────────────────────────────────────────────────────────
⋮----
get id(): string
get pageId(): string
get accountId(): string
get content(): BlockContent
get order(): number
get parentBlockId(): string | null
get childBlockIds(): ReadonlyArray<string>
get createdAtISO(): string
get updatedAtISO(): string
⋮----
getSnapshot(): Readonly<ContentBlockSnapshot>
⋮----
pullDomainEvents(): NotionDomainEvent[]
````

## File: modules/notion/subdomains/knowledge/domain/aggregates/KnowledgeCollection.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/aggregates
 * Purpose: KnowledgeCollection aggregate root — named grouping / database-view of pages.
 */
⋮----
import { v4 as uuid } from "@lib-uuid";
import type { NotionDomainEvent } from "../events/NotionDomainEvent";
⋮----
export type CollectionColumnType =
  | "text"
  | "number"
  | "select"
  | "multi-select"
  | "date"
  | "checkbox"
  | "url"
  | "relation";
⋮----
export interface CollectionColumn {
  readonly id: string;
  readonly name: string;
  readonly type: CollectionColumnType;
  readonly options?: readonly string[];
}
⋮----
export type CollectionStatus = "active" | "archived";
export type CollectionSpaceType = "database" | "wiki";
⋮----
export interface KnowledgeCollectionSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly description?: string;
  readonly columns: readonly CollectionColumn[];
  readonly pageIds: readonly string[];
  readonly status: CollectionStatus;
  readonly spaceType: CollectionSpaceType;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateKnowledgeCollectionInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly description?: string;
  readonly columns?: readonly Omit<CollectionColumn, "id">[];
  readonly createdByUserId: string;
  readonly spaceType?: CollectionSpaceType;
}
⋮----
export class KnowledgeCollection {
⋮----
private constructor(private _props: KnowledgeCollectionSnapshot)
⋮----
static create(id: string, columnIds: readonly string[], input: CreateKnowledgeCollectionInput): KnowledgeCollection
⋮----
static reconstitute(snapshot: KnowledgeCollectionSnapshot): KnowledgeCollection
⋮----
rename(newName: string): void
⋮----
addPage(pageId: string): void
⋮----
removePage(pageId: string): void
⋮----
addColumn(column: CollectionColumn): void
⋮----
archive(): void
⋮----
// ── Getters ───────────────────────────────────────────────────────────────
⋮----
get id(): string
get accountId(): string
get workspaceId(): string | undefined
get name(): string
get description(): string | undefined
get columns(): readonly CollectionColumn[]
get pageIds(): readonly string[]
get status(): CollectionStatus
get spaceType(): CollectionSpaceType
get createdByUserId(): string
get createdAtISO(): string
get updatedAtISO(): string
⋮----
getSnapshot(): Readonly<KnowledgeCollectionSnapshot>
⋮----
pullDomainEvents(): NotionDomainEvent[]
````

## File: modules/notion/subdomains/knowledge/domain/aggregates/KnowledgePage.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/aggregates
 * Purpose: KnowledgePage aggregate root — proper DDD class with private constructor,
 *          static factory methods, business methods, and domain events.
 */
⋮----
import { v4 as uuid } from "@lib-uuid";
import type { NotionDomainEvent } from "../events/NotionDomainEvent";
⋮----
export interface KnowledgePageSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly slug: string;
  readonly parentPageId: string | null;
  readonly order: number;
  readonly blockIds: readonly string[];
  readonly status: "active" | "archived";
  readonly approvalState?: "pending" | "approved";
  readonly approvedAtISO?: string;
  readonly approvedByUserId?: string;
  readonly verificationState?: "verified" | "needs_review";
  readonly ownerId?: string;
  readonly verifiedByUserId?: string;
  readonly verifiedAtISO?: string;
  readonly verificationExpiresAtISO?: string;
  readonly iconUrl?: string;
  readonly coverUrl?: string;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateKnowledgePageInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly parentPageId: string | null;
  readonly createdByUserId: string;
  readonly order: number;
}
⋮----
export class KnowledgePage {
⋮----
private constructor(private _props: KnowledgePageSnapshot)
⋮----
static create(id: string, input: CreateKnowledgePageInput): KnowledgePage
⋮----
static reconstitute(snapshot: KnowledgePageSnapshot): KnowledgePage
⋮----
rename(newTitle: string): void
⋮----
move(targetParentId: string | null): void
⋮----
archive(): void
⋮----
approve(byUserId: string, atISO: string): void
⋮----
verify(byUserId: string, expiresAtISO?: string): void
⋮----
requestReview(byUserId: string): void
⋮----
assignOwner(ownerId: string): void
⋮----
updateIcon(iconUrl: string): void
⋮----
updateCover(coverUrl: string): void
⋮----
reorderBlocks(blockIds: ReadonlyArray<string>): void
⋮----
// ── Getters ───────────────────────────────────────────────────────────────
⋮----
get id(): string
get accountId(): string
get workspaceId(): string | undefined
get title(): string
get slug(): string
get parentPageId(): string | null
get order(): number
get blockIds(): readonly string[]
get status(): "active" | "archived"
get approvalState(): "pending" | "approved" | undefined
get approvedAtISO(): string | undefined
get approvedByUserId(): string | undefined
get verificationState(): "verified" | "needs_review" | undefined
get ownerId(): string | undefined
get verifiedByUserId(): string | undefined
get verifiedAtISO(): string | undefined
get verificationExpiresAtISO(): string | undefined
get iconUrl(): string | undefined
get coverUrl(): string | undefined
get createdByUserId(): string
get createdAtISO(): string
get updatedAtISO(): string
⋮----
getSnapshot(): Readonly<KnowledgePageSnapshot>
⋮----
pullDomainEvents(): NotionDomainEvent[]
⋮----
private static slugify(title: string): string
⋮----
/** Tree node for hierarchical views */
export interface KnowledgePageTreeNode extends KnowledgePageSnapshot {
  readonly children: readonly KnowledgePageTreeNode[];
}
````

## File: modules/notion/subdomains/knowledge/domain/index.ts
````typescript

````

## File: modules/notion/subdomains/relations/api/index.ts
````typescript
/**
 * Public API boundary for the relations subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Status: Tier 2 Recommended Gap Subdomain
 */
⋮----
// ── Domain types ──────────────────────────────────────────────────────────────
⋮----
// ── Repository contracts ───────────────────────────────────────────────────────
⋮----
// ── Domain events ─────────────────────────────────────────────────────────────
⋮----
// ── Application DTOs ──────────────────────────────────────────────────────────
⋮----
// ── Application contracts ─────────────────────────────────────────────────────
⋮----
// Note: server-only composition and infrastructure adapters are exported from
// `./server` to keep the default boundary runtime-safe.
````

## File: modules/notion/subdomains/relations/application/use-cases/manage-relation.use-cases.ts
````typescript
import { v4 as uuid } from "@lib-uuid";
/**
 * Module: notion/subdomains/relations
 * Layer: application/use-cases
 * Purpose: Use case orchestration for relation operations.
 */
⋮----
import type { RelationRepository } from "../../domain/repositories/RelationRepository";
import type { Relation, CreateRelationInput } from "../../domain/entities/Relation";
⋮----
export class CreateRelationUseCase {
⋮----
constructor(private readonly relationRepo: RelationRepository)
⋮----
async execute(input: CreateRelationInput): Promise<Relation>
⋮----
export class RemoveRelationUseCase {
⋮----
async execute(relationId: string): Promise<void>
⋮----
export class ListRelationsBySourceUseCase {
⋮----
async execute(sourceArtifactId: string): Promise<readonly Relation[]>
⋮----
export class ListRelationsByTargetUseCase {
⋮----
async execute(targetArtifactId: string): Promise<readonly Relation[]>
````

## File: modules/notion/subdomains/subdomains.instructions.md
````markdown
---
description: 'Notion subdomains structural rules: hexagonal shape per subdomain, canonical content ownership, knowledge vs authoring separation, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/notion/subdomains/**/*.{ts,tsx}'
---

# Notion Subdomains Layer (Local)

Use this file as execution guardrails for `modules/notion/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notion/subdomains.md`.

## Core Rules

- Every subdomain must maintain the core-first default shape: `api/`, `domain/`, `application/`, optional `ports/`, and `README.md`.
- `infrastructure/` and `interfaces/` belong at the bounded-context root by default and should be grouped by subdomain there unless the mini-module gate is explicitly justified.
- Stub subdomains (`domain/index.ts` only) must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within notion goes through the **subdomain's own `api/`** — never import a sibling subdomain's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Each subdomain owns its Firestore collection(s); no subdomain reads or writes another subdomain's data directly.
- Domain events emitted by a subdomain must use the discriminant format `notion.<subdomain>.<action>` (e.g. `notion.knowledge.page-published`, `notion.authoring.article-approved`, `notion.collaboration.comment-created`).
- Dependency direction inside each subdomain mirrors the module-level rule: `interfaces → application → domain ← infrastructure`.
- notion owns **canonical content state** — notebooklm may only consume knowledge artifact references; any notebooklm output that should become canonical content must be explicitly absorbed by notion.
- `knowledge` owns KnowledgePage, ContentBlock, KnowledgeCollection, and BacklinkIndex (block-based free-form wiki pages).
- `authoring` owns Article and Category (structured knowledge-base articles with authoring workflow) — do not conflate KnowledgePage (knowledge) with Article (authoring).
- `collaboration` owns Comment, Permission, and Version (per-change edit history snapshots) — it must not own global checkpoint policy.
- `database` owns Database, DatabaseView, DatabaseRecord, and DatabaseAutomation — do not duplicate structured data or view logic in other subdomains.
- `BacklinkIndex` (automatic reverse-link index) and `Relation` (explicit typed semantic graph) are distinct — do not conflate them.
- `collaboration.Version` (per-edit snapshot) and `knowledge-versioning` (workspace-level checkpoint policy) are distinct concerns — do not merge them.
- `taxonomy` is the global semantic organisation network; `authoring.Category` is article-local classification — they are separate and must not replace each other.
- Premature stubs (automation, knowledge-analytics, knowledge-integration, notes, templates) must not be expanded without an ADR documenting why the active subdomains cannot absorb the need.
- Do not place identity, tenant, AI provider policy, or workspace lifecycle logic inside notion subdomains.
- Use `KnowledgeArtifact` (not `Wiki` or `Doc`), `KnowledgePage` (not `Page`), and `Article` (not `Post` or `Content`) in all subdomain published language.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/notion/subdomains/taxonomy/api/index.ts
````typescript
/**
 * Public API boundary for the taxonomy subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Status: Tier 2 Recommended Gap Subdomain
 */
⋮----
// ── Domain types ──────────────────────────────────────────────────────────────
⋮----
// ── Repository contracts ───────────────────────────────────────────────────────
⋮----
// ── Domain events ─────────────────────────────────────────────────────────────
⋮----
// ── Application DTOs ──────────────────────────────────────────────────────────
⋮----
// ── Use cases ─────────────────────────────────────────────────────────────────
````

## File: modules/notion/subdomains/taxonomy/application/use-cases/manage-taxonomy.use-cases.ts
````typescript
import { v4 as uuid } from "@lib-uuid";
/**
 * Module: notion/subdomains/taxonomy
 * Layer: application/use-cases
 * Purpose: Use case orchestration for taxonomy node operations.
 */
⋮----
import type { TaxonomyRepository } from "../../domain/repositories/TaxonomyRepository";
import type { TaxonomyNode, CreateTaxonomyNodeInput } from "../../domain/entities/TaxonomyNode";
⋮----
export class CreateTaxonomyNodeUseCase {
⋮----
constructor(private readonly taxonomyRepo: TaxonomyRepository)
⋮----
async execute(input: CreateTaxonomyNodeInput): Promise<TaxonomyNode>
⋮----
export class RemoveTaxonomyNodeUseCase {
⋮----
async execute(nodeId: string): Promise<void>
⋮----
export class ListTaxonomyRootsUseCase {
⋮----
async execute(organizationId: string): Promise<readonly TaxonomyNode[]>
⋮----
export class ListTaxonomyChildrenUseCase {
⋮----
async execute(parentNodeId: string): Promise<readonly TaxonomyNode[]>
````

## File: modules/notion/infrastructure/database/firebase/FirebaseAutomationRepository.ts
````typescript
/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/knowledgeDatabases/{databaseId}/automations/{automationId}
 */
⋮----
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import { v7 as generateId } from "@lib-uuid";
⋮----
import type {
  DatabaseAutomationSnapshot,
  AutomationCondition,
  AutomationAction,
} from "../../../subdomains/database/domain/aggregates/DatabaseAutomation";
import type { AutomationRepository, CreateAutomationInput, UpdateAutomationInput } from "../../../subdomains/database/domain/repositories/AutomationRepository";
⋮----
function automationsPath(accountId: string, databaseId: string): string
⋮----
function automationPath(accountId: string, databaseId: string, automationId: string): string
⋮----
function toCondition(c: Record<string, unknown>): AutomationCondition
⋮----
function toAction(a: Record<string, unknown>): AutomationAction
⋮----
function toAutomation(id: string, data: Record<string, unknown>): DatabaseAutomationSnapshot
⋮----
export class FirebaseAutomationRepository implements AutomationRepository {
⋮----
async create(input: CreateAutomationInput): Promise<DatabaseAutomationSnapshot>
⋮----
async update(input: UpdateAutomationInput): Promise<DatabaseAutomationSnapshot | null>
⋮----
async delete(id: string, accountId: string, databaseId: string): Promise<void>
⋮----
async listByDatabase(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]>
````

## File: modules/notion/interfaces/authoring/components/ArticleDetailPanel.tsx
````typescript
import { useCallback, useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  BadgeCheck,
  Edit,
  FileClock,
  MessageSquare,
  History,
  Globe,
  Link2,
} from "lucide-react";
⋮----
import { getArticle, getCategories, getBacklinks } from "../queries";
import {
  publishArticle,
  archiveArticle,
  verifyArticle,
  requestArticleReview,
} from "../_actions/article.actions";
import { ArticleDialog } from "./ArticleDialog";
import type { ArticleSnapshot as Article } from "../../../subdomains/authoring/application/dto/authoring.dto";
import type { CategorySnapshot as Category } from "../../../subdomains/authoring/application/dto/authoring.dto";
import { CommentPanel } from "../../collaboration/components/CommentPanel";
import { VersionHistoryPanel } from "../../collaboration/components/VersionHistoryPanel";
import { ReactMarkdown } from "@lib-react-markdown";
import { remarkGfm } from "@lib-remark-gfm";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-shadcn/ui/tabs";
⋮----
// ── Props ─────────────────────────────────────────────────────────────────────
⋮----
export interface ArticleDetailPanelProps {
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
function buildArticleDetailHref(targetArticleId: string): string
⋮----
function handlePublish()
⋮----
function handleArchive()
⋮----
function handleVerify()
⋮----
function handleRequestReview()
⋮----
<Button variant="ghost" size="sm" onClick=
⋮----
{/* Back + actions bar */}
⋮----
{/* Header */}
⋮----
{/* Body tabs */}
````

## File: modules/notion/interfaces/authoring/components/KnowledgeBaseArticlesPanel.tsx
````typescript
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, BookOpen, CircleDot, FileClock, Plus } from "lucide-react";
⋮----
import { useAuth } from "@/modules/iam/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
⋮----
import type { ArticleSnapshot as Article, ArticleStatus, ArticleVerificationState as VerificationState } from "../../../subdomains/authoring/application/dto/authoring.dto";
import type { CategorySnapshot as Category } from "../../../subdomains/authoring/application/dto/authoring.dto";
import { getArticles, getCategories } from "../queries";
import { ArticleDialog } from "./ArticleDialog";
import { CategoryTreePanel } from "./CategoryTreePanel";
⋮----
/**
 * KnowledgeBaseArticlesPanel
 * Route-level screen component for /knowledge-base/articles.
 * Encapsulates data-loading, filtering and layout so the Next.js route
 * file stays thin (params/context wiring only).
 */
export interface KnowledgeBaseArticlesPanelProps {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly currentUserId?: string | null;
}
⋮----
function handleSuccess(articleId?: string)
````

## File: modules/notion/interfaces/database/components/KnowledgeDatabasesPanel.tsx
````typescript
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Table2 } from "lucide-react";
⋮----
import { useAuth } from "@/modules/iam/api";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
⋮----
import type { DatabaseSnapshot as Database } from "../../../subdomains/database/application/dto/database.dto";
import { getDatabases } from "../queries";
import { DatabaseDialog } from "./DatabaseDialog";
⋮----
/**
 * KnowledgeDatabasesPanel
 * Route-level screen component for /knowledge-database/databases.
 * Encapsulates data-loading and layout so the Next.js route file stays thin.
 */
export interface KnowledgeDatabasesPanelProps {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly currentUserId?: string | null;
}
⋮----
function handleSuccess(databaseId?: string)
````

## File: modules/notion/interfaces/knowledge/components/KnowledgeDetailPanel.tsx
````typescript
import { useCallback, useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Archive, MessageSquare, X } from "lucide-react";
⋮----
import { getKnowledgePage } from "../queries";
import {
  renameKnowledgePage,
  archiveKnowledgePage,
  updateKnowledgePageIcon,
  updateKnowledgePageCover,
} from "../_actions/knowledge-page.actions";
import type { KnowledgePageSnapshot as KnowledgePage } from "../../../subdomains/knowledge/application/dto/knowledge.dto";
import { PageEditorPanel } from "./PageEditorPanel";
import { CommentPanel } from "../../collaboration/components/CommentPanel";
import { Button } from "@ui-shadcn/ui/button";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { TitleEditor, IconPicker, CoverEditor } from "./KnowledgePageHeaderWidgets";
⋮----
// ?? Props ?????????????????????????????????????????????????????????????????????
⋮----
export interface KnowledgeDetailPanelProps {
  accountId: string;
  activeWorkspaceId: string | null;
  currentUserId: string;
}
⋮----
// ?? Component ?????????????????????????????????????????????????????????????????
⋮----
function handleRename(title: string)
⋮----
function handleIconChange(iconUrl: string)
⋮----
function handleCoverChange(coverUrl: string)
⋮----
function handleArchive()
⋮----
// ?? Loading skeleton ????????????????????????????????????????????????????????
⋮----
// ?? Not found ???????????????????????????????????????????????????????????????
⋮----
<Button variant="ghost" size="sm" onClick=
⋮----
// ?? Page view ???????????????????????????????????????????????????????????????
⋮----
{/* Cover image */}
⋮----
{/* Top bar */}
⋮----
onClick=
⋮----
{/* Page header */}
⋮----
{/* Icon row */}
⋮----
{/* Main content + optional comment side panel */}
⋮----
{/* Block editor ??connected to Firebase */}
⋮----
{/* Comment panel ??slides in from right */}
````

## File: modules/notion/interfaces/knowledge/components/KnowledgePagesPanel.tsx
````typescript
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
⋮----
import { useAuth } from "@/modules/iam/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
⋮----
import type { KnowledgePageTreeNode } from "../../../subdomains/knowledge/application/dto/knowledge.dto";
import { getKnowledgePageTree, getKnowledgePageTreeByWorkspace } from "../queries";
import { PageTreePanel } from "./PageTreePanel";
⋮----
/**
 * KnowledgePagesPanel
 * Route-level screen component for /knowledge/pages.
 * Encapsulates data-loading, scope resolution and layout so that the
 * Next.js route file stays thin (params/context wiring only).
 */
export interface KnowledgePagesPanelProps {
  readonly accountId: string;
  readonly workspaceId?: string | null;
  readonly currentUserId?: string | null;
  readonly scope?: "workspace" | "account";
}
⋮----
function buildPageDetailHref(pageId: string)
⋮----
onCreated=
````

## File: modules/notion/subdomains/knowledge/api/index.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 */
⋮----
// ?? Types (read-only snapshots ??no aggregate class refs) ?????????????????????
⋮----
/** @alias KnowledgePageSnapshot ??provided for backward-compatibility */
⋮----
// ?? Server action DTOs ????????????????????????????????????????????????????????
⋮----
// ?? Query functions (server-side reads) ???????????????????????????????????????
⋮----
// ?? Server actions (drives: app router, Server Components) ????????????????????
⋮----
// UI components and editor store are exported from ./ui to keep this barrel semantic-only.
⋮----
// ?? Tree node type (needed by app/ pages) ?????????????????????????????????????
⋮----
// ?? Domain events (published language ??for cross-module event subscriptions) ?
⋮----
// ?? Sidebar component ?????????????????????????????????????????????????????????
⋮----
// Header widgets and detail panels are exported from ./ui.
````

## File: modules/notion/subdomains/knowledge/application/dto/knowledge.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the knowledge subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
⋮----
export interface KnowledgePageSummary {
  readonly pageId: string;
  readonly title: string;
  readonly summary: string;
  readonly model: string;
  readonly blockCount: number;
}
⋮----
export interface KnowledgePageDistillation {
  readonly pageId: string;
  readonly title: string;
  readonly overview: string;
  readonly highlights: ReadonlyArray<{
    readonly title: string;
    readonly summary: string;
  }>;
  readonly model: string;
  readonly traceId: string;
  readonly completedAt: string;
  readonly blockCount: number;
}
⋮----
import type { RichTextSpan } from "../../domain/value-objects/BlockContent";
⋮----
/**
 * richTextToPlainText — converts rich-text spans to a plain string.
 *
 * Application-layer utility that mirrors the domain value-object helper.
 * Defined here so interfaces/ do not depend directly on domain/.
 */
export function richTextToPlainText(spans: ReadonlyArray<RichTextSpan>): string
````

## File: modules/notion/subdomains/knowledge/application/use-cases/review-knowledge-page.use-cases.ts
````typescript
/**
 * Module: notion/subdomains/knowledge
 * Layer: application/use-cases
 * Purpose: Page review/wiki use cases — approve, verify, request review, assign owner.
 */
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
⋮----
import type { KnowledgePageRepository } from "../../domain/repositories/KnowledgePageRepository";
import {
  PublishDomainEventUseCase,
  type IEventStoreRepository,
  type IEventBusRepository,
} from "@shared-events";
import {
  ApproveKnowledgePageSchema,
  type ApproveKnowledgePageDto,
} from "../dto/KnowledgePageDto";
import {
  VerifyKnowledgePageSchema,
  type VerifyKnowledgePageDto,
  RequestPageReviewSchema,
  type RequestPageReviewDto,
  AssignPageOwnerSchema,
  type AssignPageOwnerDto,
} from "../dto/KnowledgePageLifecycleDto";
⋮----
export class ApproveKnowledgePageUseCase {
⋮----
constructor(
⋮----
async execute(input: ApproveKnowledgePageDto): Promise<CommandResult>
⋮----
export class VerifyKnowledgePageUseCase {
⋮----
constructor(private readonly repo: KnowledgePageRepository)
⋮----
async execute(input: VerifyKnowledgePageDto): Promise<CommandResult>
⋮----
export class RequestPageReviewUseCase {
⋮----
async execute(input: RequestPageReviewDto): Promise<CommandResult>
⋮----
export class AssignPageOwnerUseCase {
⋮----
async execute(input: AssignPageOwnerDto): Promise<CommandResult>
````

## File: modules/notion/subdomains/knowledge/domain/ports/index.ts
````typescript
/**
 * notion/knowledge domain/ports — driven port interfaces for the knowledge subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
````

## File: modules/notion/subdomains/knowledge/api/server.ts
````typescript
/**
 * knowledge subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */
⋮----
import {
  GenerateKnowledgePageDistillationQuery,
  GenerateKnowledgePageSummaryQuery,
} from "../application/queries/knowledge-summary.queries";
import type { KnowledgePageDistillation, KnowledgePageSummary } from "../application/dto/knowledge.dto";
import { SharedAiKnowledgeSummaryAdapter } from "../../../infrastructure/knowledge/ai/SharedAiKnowledgeSummaryAdapter";
import { FirebaseKnowledgePageRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgePageRepository";
import { FirebaseContentBlockRepository } from "../../../infrastructure/knowledge/firebase/FirebaseContentBlockRepository";
import { FirebaseKnowledgeCollectionRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgeCollectionRepository";
import { FirebaseBacklinkIndexRepository } from "../../../infrastructure/knowledge/firebase/FirebaseBacklinkIndexRepository";
⋮----
export async function getKnowledgePageSummary(accountId: string, pageId: string): Promise<KnowledgePageSummary | null>
⋮----
export async function getKnowledgePageDistillation(
  accountId: string,
  pageId: string,
): Promise<KnowledgePageDistillation | null>
````