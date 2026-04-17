# 6101 Migration Gap — notebooklm `source` 子域

- Status: Recorded — Pending Implementation
- Date: 2026-04-17
- Category: Migration Gap > notebooklm

## Context

`xuanwu-app-skill` 快照的 `modules/notebooklm/` 包含完整的 `source` 子域，負責文件上傳、Source Document 生命週期管理、RAG 文件註冊及 Wiki Library 業務邏輯。

對應的 `src/modules/notebooklm/subdomains/document/` 骨架只有 14 行（InMemory stub），**88% 的實作未進入新技能**。

### 遺失的 Use Cases（application 層）

```
source/application/use-cases/
  upload-init-source-file.use-case.ts          (~40 lines)
  upload-complete-source-file.use-case.ts      (~44 lines)
  process-source-document-workflow.use-case.ts (~50 lines)
  create-knowledge-draft-from-source.use-case.ts (~41 lines)
  create-tasks-from-source.use-case.ts         (~25 lines)
  register-rag-document.use-case.ts            (~29 lines)
source/application/
  wiki-library.use-cases.ts                    (72 lines) ← WikiLibrary 全部業務邏輯
```

### 遺失的 Domain Ports（domain/ports/）

```
SourcePipelinePort.ts           — 對接 py_fn 解析管線
TaskMaterializationWorkflowPort.ts (57 lines) — task 具化工作流程
KnowledgePageGatewayPort.ts     (49 lines) — 知識頁面跨域閘道
SourceDocumentWatchPort.ts      (31 lines) — 文件狀態監聽
ContentDistillationPort.ts      (28 lines) — 內容蒸餾
SourceStoragePort.ts            (25 lines) — 文件儲存抽象
WikiLibraryRepository.ts        — WikiLibrary 倉儲介面
SourceDocumentRepository.ts     — Source Document 倉儲介面
```

### 遺失的 DTOs

```
source/application/dto/
  rag-document.dto.ts            (73 lines)
  source-file.dto.ts             (71 lines)
  source-document.dto.ts         (~40 lines)
  wiki-library.dto.ts            (~35 lines)
  upload-init.dto.ts             (~30 lines)
  upload-complete.dto.ts         (~25 lines)
```

### 遺失的 Domain Entities（domain/）

```
source/domain/entities/
  SourceDocument aggregate
  WikiLibrary aggregate
  RagDocument entity
  SourceFile value object
  UploadSession value object
source/domain/events/
  SourceDocumentUploaded
  SourceDocumentProcessed
  RagDocumentRegistered
  WikiLibraryUpdated
```

## Decision

**不實施**。僅記錄缺口。

當 notebooklm source 子域蒸餾工作啟動時，以 `xuanwu-app-skill` 的 `modules/notebooklm/subdomains/source/` 路徑下的所有文件作為首要參考。

新路徑應落在 `src/modules/notebooklm/subdomains/source/`（或 `document/` 若確認命名已決定）。

## Consequences

- notebooklm 的 RAG ingestion 流程無法在 `src/modules/` 下正常組合，直到此缺口修復。
- `src/modules/notebooklm/subdomains/document/` 目前只是 14 行的 InMemory stub，不可用於生產。

## 關聯 ADR

- **0012** Source-To-Task Orchestration：upload → parse → KnowledgePage → task 的跨域流程依賴此子域。
- **6102** notebooklm synthesis 子域：synthesis 的 VectorStore port 需要 source 完成 ingestion 後才能有效觸發。
