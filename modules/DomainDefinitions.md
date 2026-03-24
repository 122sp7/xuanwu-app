# Domain Context & Model Definitions

本文件定義 `Architecture.md` 中三大核心系統（Notion、Wiki、NotebookLM）融合後的領域邊界與資料模型。所有開發命名需嚴格遵守此處定義的 Ubiquitous Language。

---

## 1. Bounded Context Map (領域邊界圖)

系統劃分為三個核心 Bounded Context，透過 Domain Events 進行低耦合溝通。

| Context | 核心職責 | 對應原型 | 主要 Aggregate Root |
| :--- | :--- | :--- | :--- |
| **Content Context** | 結構化內容編輯、區塊管理、頁面樹狀結構 | Notion | `Page`, `Block` |
| **Knowledge Context** | 雙向連結、標籤管理、圖譜結構計算 | Wiki | `GraphNode`, `Link` |
| **Intelligence Context** | 向量檢索、LLM 對話、自動推論 | NotebookLM | `Thread`, `Insight` |

---

## 2. Core Domain Models (核心領域模型)

### A. Content Domain (Notion-like)
負責資料的「結構與呈現」。

- **Page (Entity)**: 內容的容器。
  - `id`: UUID
  - `title`: String
  - `icon`: Emoji | URL
  - `cover`: URL
  - `blocks`: List<BlockId> (Ordered)

- **Block (Polymorphic Entity)**: 內容的最小原子單位。
  - `id`: UUID
  - `type`: `paragraph` | `heading` | `code` | `image` | `embed` | `toggle`
  - `content`: JSON (SuperJSON serialized)
  - `properties`: Map<String, Any> (e.g., checked, language)
  - `parentId`: UUID (PageId or BlockId)
  - `children`: List<BlockId> (Recursive structure)

### B. Knowledge Domain (Wiki-like)
負責資料的「關聯與拓撲」。

- **GraphNode (Entity)**: 知識圖譜中的節點，通常對應一個 Page，但也可是 Tag 或外部資源。
  - `id`: UUID (對應 PageId)
  - `label`: String
  - `type`: `page` | `tag` | `attachment`
  - `weight`: Number (基於引用次數計算的權重)

- **Link (Value Object)**: 節點間的連線。
  - `sourceId`: UUID
  - `targetId`: UUID
  - `type`: `explicit` (手動引用) | `implicit` (AI 建議) | `hierarchy` (父子頁面)
  - `context`: String (連結周圍的文本摘要)

### C. Intelligence Domain (NotebookLM-like)
負責資料的「理解與生成」。

- **VectorEmbedding (Value Object)**: 內容的數學表示。
  - `targetId`: UUID (BlockId or PageId)
  - `vector`: Float32Array
  - `contentHash`: String (用於變更檢測)

- **Thread (Aggregate)**: 用戶與 AI 的對話上下文。
  - `id`: UUID
  - `contextIds`: List<UUID> (此對話引用的 Page/Block 範圍)
  - `messages`: List<Message>

---

## 3. Domain Events (關鍵領域事件)

事件驅動是三層融合的關鍵神經系統。

| 事件名稱 | 觸發源 (Source) | 處理者 (Consumer) | 業務邏輯 |
| :--- | :--- | :--- | :--- |
| `ContentBlockUpdated` | Content | Intelligence | 觸發 Vector Ingestion (重新計算 Embedding) |
| `ContentBlockUpdated` | Content | Knowledge | 解析 `[[WikiLink]]`，更新圖譜連線 |
| `PageMoved` | Content | Knowledge | 更新 Hierarchy 類型的連結關係 |
| `InsightGenerated` | Intelligence | Content | AI 自動在頁面側邊欄生成摘要或建議標籤 |
