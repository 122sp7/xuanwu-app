# Infrastructure Strategy（基礎設施策略）

本文件說明 Xuanwu App 的基礎設施技術選擇、各服務的職責分工，以及 Next.js 與 Python Worker 的 runtime 邊界。

> **相關文件：** [`repository-pattern.md`](./repository-pattern.md) · [`ai-domain.md`](./ai-domain.md)

---

## 技術棧概覽

| 層級 | 技術 | 用途 |
|------|------|------|
| **前端 / 應用框架** | Next.js 16 (App Router) | SSR、Server Actions、串流 AI 回應 |
| **UI 框架** | React 19 + shadcn/ui + Tailwind CSS | 介面渲染 |
| **認證** | Firebase Authentication | Google / Email 登入，JWT 管理 |
| **主資料庫** | Cloud Firestore | 所有業務資料持久化 |
| **物件儲存** | Firebase Storage | 檔案上傳（File assets） |
| **AI 生成** | Google Genkit + Gemini 2.5 Flash | LLM 推理、RAG 答案生成、對話代理 |
| **向量搜索** | Firestore Vector Search | RAG chunks 語意相似度搜索 |
| **Python Worker** | Cloud Functions (Gen2) Python 3.12 | 攝入管線（Parse → Chunk → Embed → Persist） |
| **Event Store** | Firestore（`shared` 模組） | 領域事件持久化（選用） |
| **即時更新** | Firestore `onSnapshot` | 工作區/通知的即時訂閱 |

---

## Runtime 邊界

```
┌─────────────────────────────────────────────────┐
│  Next.js Runtime (Node.js)                       │
│                                                   │
│  ✅ 負責：                                        │
│   • 瀏覽器端 UX（React components）               │
│   • 認證/Session 管理（Firebase Auth）             │
│   • Server Actions（write-side 入口）             │
│   • AI 串流回應（Genkit generate() streams）      │
│   • Firestore 讀取 / onSnapshot 訂閱             │
│   • 上傳 UI（前端 → Storage）                     │
│                                                   │
│  ❌ 不負責：                                       │
│   • 解析 PDF/Word/Excel                          │
│   • 文字清洗與分類                                │
│   • 文件分塊（chunking）                          │
│   • Embedding 計算                               │
│   • 向量寫入 Firestore                           │
└──────────────────┬──────────────────────────────┘
                   │ Firestore 文件狀態機
                   │ (IngestionJob: uploaded → processing → ready)
┌──────────────────▼──────────────────────────────┐
│  py_fn/ Runtime (Python Cloud Functions)         │
│                                                   │
│  ✅ 負責：                                        │
│   • MarkItDown 文件轉換（PDF/Word/Excel → MD）   │
│   • 文字清洗與 Taxonomy 分類                     │
│   • 語意分塊（chunking）                          │
│   • Embedding 計算（Google textembedding-004）   │
│   • 向量 + Metadata 寫入 Firestore               │
│   • IngestionJob 狀態更新（processing → ready）  │
│                                                   │
│  ❌ 不負責：                                       │
│   • 瀏覽器端 UI                                   │
│   • 使用者認證                                    │
│   • AI 對話串流                                   │
└─────────────────────────────────────────────────┘
```

---

## Firestore 資料庫設計

### 集合結構（Collections）

```
Firestore
├── accounts/{accountId}                       # account 模組
│   ├── contentPages/{pageId}                  # content 模組
│   ├── contentBlocks/{blockId}                # content 模組
│   ├── documents/{docId}                      # asset 模組（RAG 文件）
│   ├── workspaceFeedPosts/{postId}            # workspace-feed 模組
│   └── walletTransactions/{txId}             # account 模組
│
├── organizations/{orgId}                      # organization 模組
│   ├── invites/{inviteId}                     # 成員邀請
│   ├── teams/{teamId}                         # 子集合（Team）
│   └── partnerInvites/{inviteId}              # 合作夥伴邀請
│
├── workspaces/{workspaceId}                   # workspace 模組
│
├── notifications/{notificationId}             # notification 模組
├── auditLogs/{logId}                          # workspace-audit 模組
├── accountPolicies/{policyId}                 # account 模組
├── orgPolicies/{policyId}                     # organization 模組
│
├── workspaceFlowTasks/{taskId}                # workspace-flow 模組
├── workspaceFlowIssues/{issueId}              # workspace-flow 模組
├── workspaceFlowInvoices/{invoiceId}          # workspace-flow 模組
└── workspaceFlowInvoiceItems/{itemId}         # workspace-flow 模組
```

### 設計決策

| 決策 | 說明 |
|------|------|
| **ContentBlock 獨立文件** | `contentBlocks` 不嵌套在 `contentPages`，支援局部更新與細粒度 Embedding |
| **RAG documents 在 account 子集合** | `accounts/{accountId}/documents/` 確保多租戶資料隔離 |
| **workspace-flow 頂層集合** | Task/Issue/Invoice 採頂層集合（非 workspace 子集合），便於跨工作區查詢 |
| **onSnapshot 訂閱** | Workspace 列表與 Notification 使用即時訂閱提升 UX 響應性 |

---

## Firebase Storage 策略

```
Firebase Storage
└── organizations/{orgId}/workspaces/{workspaceId}/files/{fileId}/{filename}
```

**上傳流程：**
1. 前端呼叫 `UploadInitFileUseCase` → 取得 Storage 上傳路徑 + metadata
2. 前端直接上傳至 Firebase Storage（不經過 Next.js server）
3. 前端呼叫 `UploadCompleteFileUseCase` → 更新 Firestore File 文件
4. 若為 RAG 文件 → 呼叫 `RegisterUploadedRagDocumentUseCase` → 建立 IngestionJob

---

## RAG 攝入管線（Ingestion Pipeline）

```
使用者上傳檔案
     │
     ▼
[Next.js] RegisterUploadedRagDocumentUseCase
     │  建立 IngestionJob (status: uploaded)
     ▼
[py_fn] Firestore Trigger 監聽 IngestionJob.status == "uploaded"
     │
     ├── Parse → MarkItDown 轉換為 Markdown
     ├── Clean → 文字清洗（移除噪音）
     ├── Taxonomy → 分類標籤（用於 RAG filter）
     ├── Chunk → 語意分塊（chunk_size / overlap 可設定）
     ├── Embed → Google textembedding-004
     ├── Persist → 寫入 Firestore vector field
     └── Mark Ready → IngestionJob.status = "ready"
          │
          ▼
[Next.js] AnswerRagQueryUseCase 可查詢
```

---

## Genkit 整合策略

**模型：** `googleai/gemini-2.5-flash`（預設），可透過環境變數 `GENKIT_MODEL` 覆蓋

**兩個獨立的 Genkit client：**

| Client | 模組 | 職責 |
|--------|------|------|
| `aiClient`（retrieval） | `modules/retrieval/infrastructure/genkit/client.ts` | RAG 答案生成：提供 Context-grounded 回答 |
| `agentClient`（agent） | `modules/agent/infrastructure/genkit/client.ts` | 對話代理：自由對話 + RAG 增強 |

```typescript
// 兩個 client 共享相同工廠函式，但職責獨立
export function createGenkitClient(options?: GenkitClientOptions) {
  return genkit({
    plugins: [googleAI()],
    model: getConfiguredGenkitModel(options?.model),
  });
}
```

**Prompt 架構（RAG）：**

```
System: "You are the Xuanwu RAG orchestration layer. Answer only from the supplied context."
User:   "User query: {question}\n\nRetrieved context:\n{chunks}"
```

---

## 環境變數策略

| 變數 | 用途 | 位置 |
|------|------|------|
| `GENKIT_MODEL` | 覆蓋預設 LLM 模型 | `.env.local` |
| `GOOGLE_API_KEY` | Genkit Google AI 認證 | `.env.local` |
| Firebase 設定 | Firebase SDK 初始化 | `packages/integration-firebase/` |

---

## 測試基礎設施

| 元件 | 用途 |
|------|------|
| `InMemoryEventStoreRepository` | `IEventStoreRepository` 的測試用記憶體實作 |
| `NoopEventBusRepository` | `IEventBusRepository` 的無操作測試實作 |
| `InMemoryGraphRepository` | `GraphRepository` 的測試用記憶體實作（BFS/DFS 驗證） |

**代碼位置：** `modules/shared/infrastructure/`、`modules/knowledge-graph/infrastructure/`
