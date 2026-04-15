# NotebookLM Module

`src/modules/notebooklm` 是蒸餾自 `modules/notebooklm` 的精簡等價版，以 `src/modules/template` 骨架為基線。
保留 4 個 **Tier 1 active** 子域：**notebook**、**conversation**、**source**（含 RAG ingestion）、**synthesis**（RAG pipeline）。

## 領域定位

| 項目 | 內容 |
|---|---|
| **DDD 分類** | Core / Productized AI |
| **定位** | 文件 / knowledge AI workspace（類 NotebookLM）|
| **核心價值** | 「知識 → AI 問答」產品化：document ingestion + RAG + source citation |
| **不做** | 通用 AI 能力（由 `ai` module 負責）、workspace governance |
| **依賴方向** | 強依賴 ai + workspace；是 AI 應用型 domain |

## 蒸餾來源

`modules/notebooklm`（4 個 Tier 1 子域，source 已有 infrastructure）→ `src/modules/notebooklm`

## 目錄結構

```
src/modules/notebooklm/
  index.ts                                    ← 模組對外唯一入口（具名匯出）
  domain/
    index.ts
    entities/
      Notebook.ts                             ← Notebook aggregate root
      Conversation.ts                         ← Thread + Message
      SourceFile.ts                           ← 來源文件（url / upload / notion ref）
      RagDocument.ts                          ← normalized chunk for retrieval
    value-objects/
      NotebookId.ts
      ConversationId.ts
      SourceFileId.ts
      SourceFileStatus.ts                     ← "pending" | "processing" | "ready" | "failed"
      CitationRef.ts                          ← 引用錨點
    services/
      RagScoringService.ts                    ← 召回排序與 re-ranking（domain rule）
      RagCitationBuilder.ts                   ← 引用對齊（domain rule）
    repositories/
      NotebookRepository.ts                   ← domain port
      ConversationRepository.ts               ← domain port
      SourceFileRepository.ts                 ← domain port
      RagDocumentRepository.ts                ← domain port
    events/
      NotebookCreated.ts
      SourceFileAdded.ts
      SourceFileProcessed.ts
      AnswerGenerated.ts
  application/
    index.ts
    use-cases/
      create-notebook.use-case.ts
      add-source-to-notebook.use-case.ts
      ask-question.use-case.ts               ← RAG synthesis entry point
      generate-note-from-answer.use-case.ts
    dto/
      NotebookDTO.ts
      ConversationDTO.ts
      SourceFileDTO.ts
      AskQuestionDTO.ts
  adapters/
    inbound/
      index.ts
      http/                                   ← notebooklm HTTP endpoints
      rpc/                                    ← tRPC routers
    outbound/
      index.ts
      firestore/
        FirestoreNotebookAdapter.ts
        FirestoreConversationAdapter.ts
        FirestoreSourceFileAdapter.ts
        FirestoreRagDocumentAdapter.ts
      genkit/
        GenkitSynthesisAdapter.ts             ← RAG answer generation
```

## Barrel 結構

| Barrel | 覆蓋範圍 |
|---|---|
| `index.ts` | domain + application 的公開符號 |
| `domain/index.ts` | entities, value-objects, services, repositories, events |
| `application/index.ts` | use-cases + dto |
| `adapters/inbound/index.ts` | http, rpc |
| `adapters/outbound/index.ts` | firestore/, genkit/ |

所有 barrel 使用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾範圍

| src 概念 | 蒸餾自 modules/notebooklm | 狀態 |
|---|---|---|
| Notebook, Conversation, SourceFile, RagDocument | subdomains/*/domain/ | ✅ 保留 |
| RagScoringService, RagCitationBuilder | subdomains/synthesis/domain/ | ✅ 保留 |
| ask-question use-case（synthesis） | subdomains/synthesis/application/ | ✅ 保留 |
| conversation-versioning | stub | ❌ 跳過 |
| grounding, evaluation | gap subdomains | ❌ 跳過（待需求） |
| note subdomain | baseline | ❌ 跳過（輕量，後補） |

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

`domain/` 絕對不依賴 Genkit、Firestore SDK 或任何外部框架。
Genkit SDK 只能出現在 `adapters/outbound/genkit/`。

## 外部消費方式

```ts
// types
import type { NotebookDTO, AskQuestionDTO, CitationRef } from "@/src/modules/notebooklm";

// server-only
import { askQuestion, addSourceToNotebook } from "@/src/modules/notebooklm";
```

原始 API 合約參考：`modules/notebooklm/api/index.ts`。
