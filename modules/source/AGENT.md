# AGENT.md — modules/source

## 模組定位

`modules/source` 是 Knowledge Platform 的**支援域（Supporting Domain）**，負責文件來源的上傳生命週期、版本管理、保留政策與 RAG 攝入文件登記。是知識攝入管線（RAG ingestion pipeline）的文件入口。

---

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語，不可替換：

| 正確術語 | 禁止使用 |
|----------|----------|
| `SourceDocument` | File、Document、Asset、Attachment |
| `WikiLibrary` | Library、Folder、Collection、SourceCollection |
| `FileVersion` | Version、Snapshot、Revision |
| `RagDocument` | RagFile、IngestionDoc |
| `PermissionSnapshot` | Permission、AccessRecord |
| `RetentionPolicy` | Policy、LifecycleRule、ExpiryRule |
| `AuditRecord` | Log、Event、History |
| `ActorContext` | User、CurrentUser、Caller |

---

## 邊界規則

### ✅ 允許

```typescript
// 其他模組透過 api/ 存取
import { sourceApi } from "@/modules/source/api";
import type { SourceDocumentDTO, WikiLibraryDTO } from "@/modules/source/api";
```

### ❌ 禁止

```typescript
// 禁止直接 import 內部層
import { File } from "@/modules/source/domain/entities/File";
import { FirebaseFileRepository } from "@/modules/source/infrastructure/firebase/FirebaseFileRepository";
import { UploadInitFileUseCase } from "@/modules/source/application/use-cases/upload-init-file.use-case";
```

---

## Runtime 邊界（重要）

```
Next.js（source module）  ──→  上傳 UX、簽名 URL 生成、upload-init / upload-complete
py_fn/                    ──→  Embedding 生成、向量寫入（重型工作）
```

- 上傳 UX 和 Server Action **只**在 Next.js 端
- 實際 Embedding 生成和向量化**只**在 `py_fn/` Python worker 端
- 上傳完成後透過 `ai/api` 的 IngestionJob 觸發交付（best-effort handoff）

---

## 依賴方向

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- `domain/ports/` 定義 `ActorContextPort`、`OrganizationPolicyPort`、`WorkspaceGrantPort` 介面
- `infrastructure/` 只依賴 `domain/` 的 Port 和 Repository 介面
- `domain/` 禁止 import Firebase SDK、React、HTTP clients

---

## Firestore Timestamp 規則

```typescript
// ✅ 安全的調用方式（成員表達式）
const date = (value.toDate as () => unknown)() as Date;

// ❌ 禁止解構賦值後再調用（'this' binding 失效）
const { toDate } = value;
toDate(); // 執行時錯誤
```

---

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `ai/api` | API 呼叫 | 上傳完成後觸發 RAG IngestionJob |
| `knowledge/api` | 事件發布 | 文件關聯知識頁面時通知 |
| `workspace/api` | API 呼叫 | 驗證工作區範圍與 WorkspaceGrant |
| `organization/api` | API 呼叫 | 解算組織政策（OrganizationPolicy） |
| `identity/api` | API 呼叫 | 驗證操作者身分（ActorContext） |

---

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
