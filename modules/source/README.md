# source — Source Document & File Layer

> **開發狀態**：🚧 Developing — 積極開發中
> **Domain Type**：Supporting Domain（支援域）

`modules/source` 負責知識平台的**文件來源管理**，包含檔案上傳生命週期、版本快照、保留政策與 RAG 攝入文件的登記。是知識攝入管線（RAG ingestion）的文件入口，也是工作區檔案存取的業務邊界。

外界互動規則：
- 外界只能透過 `api/` 公開介面存取此模組
- 禁止直接 import `domain/`、`application/`、`infrastructure/`、`interfaces/`
- 上傳 UX 屬於 Next.js 責任；Embedding 生成委派給 `py_fn/` Python worker

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| 檔案上傳初始化 | `upload-init`：建立 File 聚合根、產生上傳簽名 URL |
| 上傳完成確認 | `upload-complete`：標記上傳完成、觸發 ingestion handoff |
| RAG 文件登記 | 登記已完成上傳的文件進入 RAG 管線（RagDocument） |
| 檔案列表查詢 | 依工作區範圍列出檔案（list-workspace-files） |
| Wiki 知識庫管理 | 管理 WikiLibrary（知識庫文件集合） |
| 授權快照 | 保存 PermissionSnapshot 以確保授權一致性 |
| 保留政策 | 管理 RetentionPolicy（保留期限、刪除規則） |
| 稽核記錄 | 記錄檔案操作稽核軌跡（AuditRecord） |

---

## 聚合根（Aggregate Roots）

| Aggregate | 說明 |
|-----------|------|
| `SourceDocument` | 核心檔案聚合根（File.ts），管理上傳生命週期與版本 |
| `WikiLibrary` | 知識庫集合，組織 RAG 攝入文件群組 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 來源文件 | SourceDocument | 上傳的原始文件（對應 File.ts 聚合根） |
| 知識庫 | WikiLibrary | RAG 文件的邏輯集合容器 |
| 檔案版本 | FileVersion | 文件的版本快照 |
| RAG 文件 | RagDocument | 已準備進入 RAG 管線的文件記錄 |
| 授權快照 | PermissionSnapshot | 上傳時的授權狀態快照 |
| 保留政策 | RetentionPolicy | 文件的保留期限與刪除規則 |
| 稽核記錄 | AuditRecord | 文件操作的不可變稽核軌跡 |
| 攝入交付 | IngestionHandoff | 上傳完成後交付 py_fn worker 的觸發信號 |
| 演員上下文 | ActorContext | 操作者身分與授權上下文（ActorContextPort） |

---

## 領域事件（Domain Events）

| 事件 | 觸發條件 |
|------|----------|
| `source.upload_initiated` | 上傳初始化完成、簽名 URL 已產生時 |
| `source.upload_completed` | 上傳確認完成時 |
| `source.rag_document_registered` | RAG 文件成功登記進入攝入管線時 |
| `source.file_archived` | 檔案被封存時 |

---

## 依賴關係

- **上游（依賴）**：`identity/api`（ActorContext 身分驗證）、`workspace/api`（工作區範圍）、`organization/api`（組織政策）
- **下游（被依賴）**：`ai/api`（觸發 IngestionJob）、`knowledge/api`（文件關聯通知）

---

## 目錄結構

```
modules/source/
├── api/                      # 公開 API 邊界
│   └── index.ts
├── application/              # Use Cases & DTOs
│   ├── dto/
│   │   ├── file.dto.ts
│   │   └── rag-document.dto.ts
│   └── use-cases/
│       ├── upload-init-file.use-case.ts
│       ├── upload-complete-file.use-case.ts
│       ├── register-uploaded-rag-document.use-case.ts
│       ├── list-workspace-files.use-case.ts
│       └── wiki-libraries.use-case.ts
├── domain/                   # Aggregates, Ports, Repositories, Services
│   ├── entities/
│   │   ├── File.ts           # SourceDocument 聚合根
│   │   ├── FileVersion.ts
│   │   ├── AuditRecord.ts
│   │   ├── PermissionSnapshot.ts
│   │   ├── RetentionPolicy.ts
│   │   └── wiki-library.types.ts
│   ├── ports/
│   │   ├── ActorContextPort.ts
│   │   ├── OrganizationPolicyPort.ts
│   │   └── WorkspaceGrantPort.ts
│   ├── repositories/
│   │   ├── FileRepository.ts
│   │   ├── RagDocumentRepository.ts
│   │   └── WikiLibraryRepository.ts
│   └── services/
│       ├── complete-upload-file.ts
│       └── resolve-file-organization-id.ts
├── infrastructure/           # Firebase 適配器
│   └── firebase/
│       ├── FirebaseFileRepository.ts
│       └── FirebaseRagDocumentRepository.ts
├── interfaces/               # UI 元件、hooks、server actions、queries
│   ├── _actions/
│   │   └── file.actions.ts
│   ├── components/
│   │   ├── WorkspaceFilesTab.tsx
│   │   ├── SourceDocumentsView.tsx
│   │   ├── LibrariesView.tsx
│   │   └── LibraryTableView.tsx
│   ├── hooks/
│   │   └── useDocumentsSnapshot.ts
│   └── queries/
│       └── file.queries.ts
└── index.ts
```

---

## 架構參考

- 系統設計文件：`docs/architecture/domain-model.md`
- 通用語言：`docs/architecture/ubiquitous-language.md`
- 事件目錄：`docs/architecture/domain-events.md`
