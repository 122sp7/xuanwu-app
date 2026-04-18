# Files

## File: src/modules/notebooklm/orchestration/index.ts
````typescript
// notebooklm — orchestration layer
// Cross-subdomain composition and facade lives here.
// TODO: implement NotebooklmFacade if needed.
````

## File: src/modules/notebooklm/shared/errors/index.ts
````typescript
// notebooklm shared/errors placeholder
````

## File: src/modules/notebooklm/shared/events/index.ts
````typescript
// notebooklm shared/events placeholder
````

## File: src/modules/notebooklm/shared/index.ts
````typescript

````

## File: src/modules/notebooklm/shared/types/index.ts
````typescript
// notebooklm shared/types placeholder
````

## File: src/modules/notebooklm/subdomains/conversation/adapters/inbound/index.ts
````typescript
// conversation — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notebooklm/subdomains/conversation/adapters/index.ts
````typescript
// conversation — adapters aggregate
````

## File: src/modules/notebooklm/subdomains/conversation/adapters/outbound/index.ts
````typescript
// conversation — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notebooklm/subdomains/conversation/adapters/outbound/memory/InMemoryConversationRepository.ts
````typescript
import type { ConversationSnapshot } from "../../../domain/entities/Conversation";
import type { ConversationRepository } from "../../../domain/repositories/ConversationRepository";
⋮----
export class InMemoryConversationRepository implements ConversationRepository {
⋮----
async save(snapshot: ConversationSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<ConversationSnapshot | null>
⋮----
async findByNotebookId(notebookId: string): Promise<ConversationSnapshot[]>
⋮----
async findByAccountId(accountId: string, limit = 50): Promise<ConversationSnapshot[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/notebooklm/subdomains/conversation/domain/repositories/ConversationRepository.ts
````typescript
import type { ConversationSnapshot } from "../entities/Conversation";
⋮----
export interface ConversationRepository {
  save(snapshot: ConversationSnapshot): Promise<void>;
  findById(id: string): Promise<ConversationSnapshot | null>;
  findByNotebookId(notebookId: string): Promise<ConversationSnapshot[]>;
  findByAccountId(accountId: string, limit?: number): Promise<ConversationSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: ConversationSnapshot): Promise<void>;
findById(id: string): Promise<ConversationSnapshot | null>;
findByNotebookId(notebookId: string): Promise<ConversationSnapshot[]>;
findByAccountId(accountId: string, limit?: number): Promise<ConversationSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notebooklm/subdomains/document/adapters/inbound/index.ts
````typescript
// document — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notebooklm/subdomains/document/adapters/index.ts
````typescript
// document — adapters aggregate
````

## File: src/modules/notebooklm/subdomains/document/adapters/outbound/index.ts
````typescript
// document — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notebooklm/subdomains/document/adapters/outbound/memory/InMemoryDocumentRepository.ts
````typescript
import type { DocumentSnapshot, DocumentStatus } from "../../../domain/entities/Document";
import type { DocumentRepository, DocumentQuery } from "../../../domain/repositories/DocumentRepository";
⋮----
export class InMemoryDocumentRepository implements DocumentRepository {
⋮----
async save(snapshot: DocumentSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<DocumentSnapshot | null>
⋮----
async findByNotebookId(notebookId: string): Promise<DocumentSnapshot[]>
⋮----
async query(params: DocumentQuery): Promise<DocumentSnapshot[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/notebooklm/subdomains/document/domain/repositories/DocumentRepository.ts
````typescript
import type { DocumentSnapshot, DocumentStatus } from "../entities/Document";
⋮----
export interface DocumentQuery {
  readonly notebookId?: string;
  readonly workspaceId?: string;
  readonly accountId?: string;
  readonly status?: DocumentStatus;
  readonly limit?: number;
  readonly offset?: number;
}
⋮----
export interface DocumentRepository {
  save(snapshot: DocumentSnapshot): Promise<void>;
  findById(id: string): Promise<DocumentSnapshot | null>;
  findByNotebookId(notebookId: string): Promise<DocumentSnapshot[]>;
  query(params: DocumentQuery): Promise<DocumentSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: DocumentSnapshot): Promise<void>;
findById(id: string): Promise<DocumentSnapshot | null>;
findByNotebookId(notebookId: string): Promise<DocumentSnapshot[]>;
query(params: DocumentQuery): Promise<DocumentSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notebooklm/subdomains/notebook/adapters/inbound/index.ts
````typescript
// notebook — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notebooklm/subdomains/notebook/adapters/index.ts
````typescript
// notebook — adapters aggregate
````

## File: src/modules/notebooklm/subdomains/notebook/adapters/outbound/index.ts
````typescript
// notebook — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notebooklm/subdomains/notebook/adapters/outbound/memory/InMemoryNotebookRepository.ts
````typescript
import type { NotebookSnapshot } from "../../../domain/entities/Notebook";
import type { NotebookRepository } from "../../../domain/repositories/NotebookRepository";
⋮----
export class InMemoryNotebookRepository implements NotebookRepository {
⋮----
async save(snapshot: NotebookSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<NotebookSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<NotebookSnapshot[]>
⋮----
async findByAccountId(accountId: string): Promise<NotebookSnapshot[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/notebooklm/subdomains/notebook/domain/ports/NotebookGenerationPort.ts
````typescript
export interface NotebookGenerationPort {
  generateResponse(input: {
    prompt: string;
    notebookId: string;
    model?: string;
    system?: string;
  }): Promise<{ text: string; model: string; finishReason?: string }>;
}
⋮----
generateResponse(input: {
    prompt: string;
    notebookId: string;
    model?: string;
    system?: string;
}): Promise<
````

## File: src/modules/notebooklm/subdomains/notebook/domain/repositories/NotebookRepository.ts
````typescript
import type { NotebookSnapshot } from "../entities/Notebook";
⋮----
export interface NotebookRepository {
  save(snapshot: NotebookSnapshot): Promise<void>;
  findById(id: string): Promise<NotebookSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<NotebookSnapshot[]>;
  findByAccountId(accountId: string): Promise<NotebookSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: NotebookSnapshot): Promise<void>;
findById(id: string): Promise<NotebookSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<NotebookSnapshot[]>;
findByAccountId(accountId: string): Promise<NotebookSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notebooklm/index.ts
````typescript
/**
 * Notebooklm Module — public API surface.
 * All cross-module consumers must import from here only.
 */
⋮----
// document
⋮----
// notebook
⋮----
// conversation
````

## File: src/modules/notebooklm/subdomains/conversation/application/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/conversation/application/use-cases/ConversationUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Conversation, type StartConversationInput } from "../../domain/entities/Conversation";
import type { ConversationRepository } from "../../domain/repositories/ConversationRepository";
⋮----
export class StartConversationUseCase {
⋮----
constructor(private readonly repo: ConversationRepository)
⋮----
async execute(input: StartConversationInput): Promise<CommandResult>
⋮----
export class AddMessageToConversationUseCase {
⋮----
async execute(input: {
    conversationId: string;
    role: "user" | "assistant" | "system";
    content: string;
}): Promise<CommandResult>
⋮----
export class LoadConversationUseCase {
⋮----
async execute(conversationId: string)
````

## File: src/modules/notebooklm/subdomains/conversation/domain/entities/Conversation.ts
````typescript
/**
 * Conversation — distilled from modules/notebooklm/subdomains/conversation
 * Owns thread-based AI conversations linked to a notebook.
 */
import { v4 as uuid } from "uuid";
⋮----
export type MessageRole = "user" | "assistant" | "system";
⋮----
export interface ConversationMessage {
  readonly id: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly createdAtISO: string;
}
⋮----
export interface ConversationSnapshot {
  readonly id: string;
  readonly notebookId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly messages: ConversationMessage[];
  readonly title?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface StartConversationInput {
  readonly notebookId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title?: string;
}
⋮----
export class Conversation {
⋮----
private constructor(private _props: ConversationSnapshot)
⋮----
static start(input: StartConversationInput): Conversation
⋮----
static reconstitute(snapshot: ConversationSnapshot): Conversation
⋮----
addMessage(role: MessageRole, content: string): string
⋮----
get id(): string
get notebookId(): string
get messages(): ConversationMessage[]
get workspaceId(): string
⋮----
getSnapshot(): Readonly<ConversationSnapshot>
⋮----
pullDomainEvents()
````

## File: src/modules/notebooklm/subdomains/conversation/domain/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/document/application/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/document/application/use-cases/DocumentUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Document, type CreateDocumentInput } from "../../domain/entities/Document";
import type { DocumentRepository, DocumentQuery } from "../../domain/repositories/DocumentRepository";
⋮----
export class AddDocumentUseCase {
⋮----
constructor(private readonly repo: DocumentRepository)
⋮----
async execute(input: CreateDocumentInput): Promise<CommandResult>
⋮----
export class ArchiveDocumentUseCase {
⋮----
async execute(documentId: string): Promise<CommandResult>
⋮----
export class QueryDocumentsUseCase {
⋮----
async execute(params: DocumentQuery)
````

## File: src/modules/notebooklm/subdomains/document/domain/entities/Document.ts
````typescript
/**
 * Document — distilled from modules/notebooklm/subdomains/source
 * Represents a workspace-scoped ingested document (formerly SourceFile).
 */
import { v4 as uuid } from "uuid";
⋮----
export type DocumentStatus = "active" | "processing" | "archived" | "deleted";
export type DocumentClassification = "image" | "manifest" | "record" | "other";
⋮----
export interface DocumentSnapshot {
  readonly id: string;
  readonly notebookId?: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly accountId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly classification: DocumentClassification;
  readonly tags: readonly string[];
  readonly status: DocumentStatus;
  readonly storageUrl?: string;
  readonly source?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
  readonly deletedAtISO?: string;
}
⋮----
export interface CreateDocumentInput {
  readonly notebookId?: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly accountId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly classification?: DocumentClassification;
  readonly tags?: string[];
  readonly storageUrl?: string;
  readonly source?: string;
}
⋮----
export class Document {
⋮----
private constructor(private _props: DocumentSnapshot)
⋮----
static create(input: CreateDocumentInput): Document
⋮----
static reconstitute(snapshot: DocumentSnapshot): Document
⋮----
archive(): void
⋮----
delete(): void
⋮----
get id(): string
get name(): string
get status(): DocumentStatus
get workspaceId(): string
⋮----
getSnapshot(): Readonly<DocumentSnapshot>
⋮----
pullDomainEvents()
````

## File: src/modules/notebooklm/subdomains/document/domain/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/notebook/application/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/notebook/application/use-cases/NotebookUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Notebook, type CreateNotebookInput } from "../../domain/entities/Notebook";
import type { NotebookRepository } from "../../domain/repositories/NotebookRepository";
import type { NotebookGenerationPort } from "../../domain/ports/NotebookGenerationPort";
⋮----
export class CreateNotebookUseCase {
⋮----
constructor(private readonly repo: NotebookRepository)
⋮----
async execute(input: CreateNotebookInput): Promise<CommandResult>
⋮----
export class AddDocumentToNotebookUseCase {
⋮----
async execute(notebookId: string, documentId: string): Promise<CommandResult>
⋮----
export class GenerateNotebookResponseUseCase {
⋮----
constructor(
⋮----
async execute(input: {
    notebookId: string;
    prompt: string;
    model?: string;
}): Promise<
````

## File: src/modules/notebooklm/subdomains/notebook/domain/entities/Notebook.ts
````typescript
/**
 * Notebook — distilled from modules/notebooklm/subdomains/notebook
 * Represents an AI-assisted notebook backed by documents.
 */
import { v4 as uuid } from "uuid";
⋮----
export type NotebookStatus = "active" | "archived";
⋮----
export interface NotebookSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly documentIds: readonly string[];
  readonly status: NotebookStatus;
  readonly model?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateNotebookInput {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly model?: string;
}
⋮----
export class Notebook {
⋮----
private constructor(private _props: NotebookSnapshot)
⋮----
static create(input: CreateNotebookInput): Notebook
⋮----
static reconstitute(snapshot: NotebookSnapshot): Notebook
⋮----
addDocument(documentId: string): void
⋮----
removeDocument(documentId: string): void
⋮----
archive(): void
⋮----
get id(): string
get title(): string
get status(): NotebookStatus
get workspaceId(): string
get documentIds(): readonly string[]
⋮----
getSnapshot(): Readonly<NotebookSnapshot>
⋮----
pullDomainEvents()
````

## File: src/modules/notebooklm/subdomains/notebook/domain/index.ts
````typescript

````

## File: src/modules/notebooklm/README.md
````markdown
# NotebookLM Module

## 子域清單（名詞域）

> **子域設計原則：** 每個子域以**名詞**命名，代表其核心管理實體。  
> **子域不重複原則：** `synthesis`（合成推理）是 `conversation` 的應用層流程，不獨立成子域。AI 機制（embedding / retrieval / generation）屬 `ai` 模組。

| 子域 | 狀態 | 說明 |
|---|---|---|
| `document` | 🔨 骨架建立，實作進行中 | Document 實體（來源文件接收、RagDocument 生命週期、ingestion 狀態）|
| `conversation` | 🔨 骨架建立，實作進行中 | Conversation 實體（使用者對話 Session、問答流程、合成輸出）|
| `notebook` | 🔨 骨架建立，實作進行中 | Notebook 實體（筆記本生命週期、Document 集合管理）|

---

## 子域邊界示意（notebooklm vs ai）

```
notebooklm/document     ─ingestion→  ai/embedding（文件向量化）
notebooklm/document     ─切塊委託→  ai/chunk（分塊計算）
notebooklm/conversation ─問答觸發→  ai/retrieval（找相關 chunk）
notebooklm/conversation ─生成觸發→  ai/generation（生成回答）
notebooklm/conversation ─引用取得→  ai/citation（標注來源）
```

notebooklm 持有**使用者體驗流程**；ai 提供**計算機制**。

---

## 預期目錄結構

```
src/modules/notebooklm/
  index.ts
  README.md
  AGENT.md
  orchestration/
    NotebooklmFacade.ts
    NotebooklmCoordinator.ts    ← document→embedding→conversation 跨子域流程
  shared/
    domain/index.ts
    events/index.ts             ← Published Language Events
    types/index.ts
  subdomains/
    document/
      domain/
      application/
      adapters/outbound/
    conversation/
    notebook/
```

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 在 notebooklm `domain/` 定義 AI 機制子域 | AI 機制（embedding / retrieval / generation）屬 `ai` |
| 新建獨立 `synthesis` 子域 | 合成邏輯屬 `conversation` 應用層 |
| 直接呼叫 Genkit（不透過 port）| 破壞 port/adapter 邊界 |
| `Page` / `Block` 在 notebooklm 設為可寫 | 只能唯讀引用（notion 所有）|

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
````

## File: src/modules/notebooklm/AGENT.md
````markdown
# NotebookLM Module — Agent Guide

## Purpose

`src/modules/notebooklm` 是 **NotebookLM RAG 核心能力模組**，為 Xuanwu 系統提供來源文件（Document）、使用者對話（Conversation）、筆記本（Notebook）等 RAG 使用者體驗能力的實作落點。

> **⚠ 邊界警示：** notebooklm 擁有 RAG **使用者體驗**（對話流程、文件接收、筆記本管理）。  
> AI **機制**（embedding、retrieval、generation、citation）屬 `ai` 模組，notebooklm 透過 Port 消費。

## 子域清單（名詞域）

| 子域 | 說明 | 狀態 |
|---|---|---|
| `document` | Document 實體（來源文件接收、RagDocument 生命週期、metadata）| 🔨 骨架建立，實作進行中 |
| `conversation` | Conversation 實體（使用者對話 Session、問答流程、Synthesis 輸出）| 🔨 骨架建立，實作進行中 |
| `notebook` | Notebook 實體（筆記本生命週期、Document 集合）| 🔨 骨架建立，實作進行中 |

> **子域不重複原則：**  
> - `synthesis`（合成推理）是 `conversation` 的**應用層流程**，不獨立成子域  
> - AI 機制（embedding、retrieval、generation）屬 `ai` 模組；notebooklm 透過 Port 注入消費  
> - `conversation`（AI 模型上下文管理）屬 `ai/context`；`conversation`（使用者對話 UX）屬本模組  

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK、Genkit SDK 或任何框架。
- AI 能力（embedding、retrieval、generation、citation）透過 Port 注入，消費 `src/modules/ai/index.ts`，不直接呼叫 Genkit。
- `document` 子域持有 `RagDocument` entity；`Page`（notion 的 KnowledgeArtifact）是由 notion 提供的 reference，notebooklm 只讀取。
- 跨子域協調透過 `orchestration/` 或 `shared/events/`。

## Route Here When

- 撰寫 NotebookLM 的新 use case、entity、adapter 實作。
- 實作 document ingestion、conversation 管理、notebook lifecycle 等骨架。

## Route Elsewhere When

- 讀取邊界規則 → `src/modules/notebooklm/AGENT.md`
- AI 能力（embedding / retrieval / generation）→ `src/modules/ai/index.ts`（不直接呼叫 Genkit）
- KnowledgeArtifact（只讀）→ `src/modules/notion/index.ts`
- 跨模組 API boundary → `src/modules/notebooklm/index.ts`

## 路由規則

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/notebooklm/AGENT.md` |
| 撰寫新 use case / adapter / entity | `src/modules/notebooklm/`（本層）|
| 跨模組 API boundary | `src/modules/notebooklm/index.ts` |

**嚴禁事項：**
- ❌ 在 notebooklm `domain/` 中定義 AI 機制（embedding、retrieval、generation 屬 `ai`）
- ❌ 新建獨立 `synthesis` 子域（合成邏輯屬 `conversation` 應用層）
- ❌ 在 barrel 使用 `export *`

## 文件網絡

- [README.md](README.md) — 模組目錄結構
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
````