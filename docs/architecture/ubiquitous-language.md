# 通用語言（Ubiquitous Language）

本文件定義 Xuanwu App 團隊中產品、設計與開發人員應共同使用的標準術語，確保程式碼命名與業務邏輯的一致性。

## 一、平台基礎層（Platform Foundation）

### 身份與帳戶
* **Identity (身份)**：由 Firebase Auth 管理的底層驗證憑證（包含 `uid`）。
* **Account (帳戶)**：系統內的參與者，分為 `user` (個人) 與 `organization` (組織) 兩種類型。
* **Presence (在線狀態)**：帳戶當前的活動狀態，包含 `active` (活躍)、`away` (離開)、`offline` (離線)。
* **Account Policy (帳戶策略)**：控制帳戶存取層級與系統資源限制的規則集合。

### 組織（租戶）
* **Organization / Tenant (組織/租戶)**：B2B 客戶的最高資料隔離邊界。
* **Team (團隊)**：組織內的成員群組，作為授權與指派的基礎單位。
* **Member Reference (成員參照)**：組織內對 Account 的輕量化快照（包含角色與基本資訊），避免頻繁跨集合查詢。
* **Invite (邀請)**：加入組織或團隊的待處理憑證（包含 `pending`, `accepted`, `expired` 狀態）。

### 工作區（Space）
* **Workspace (工作區)**：組織內部的協作容器，所有專案、任務、文件皆歸屬於特定的工作區。
* **Lifecycle State (生命週期狀態)**：工作區的狀態，包含 `preparatory` (準備中)、`active` (活躍中)、`stopped` (已停用)。
* **Capability (能力模組)**：工作區可掛載的功能擴充（如 `ui`, `api`, `data` 等類型），實現模組化 SaaS 的計費與功能開關。
* **Grant (授權)**：賦予特定使用者或團隊對該工作區的存取角色。

### 通知與共享
* **Event Record (事件紀錄)**：Event Store 中持久化的單一事件快照。
* **Slug (網址代稱)**：URL-safe 的唯一識別字串（如 `my-first-page`）。

---

## 二、內容層（Content / UI Layer）

### 頁面與區塊（Notion Layer）
* **Content Page (內容頁面)**：文件的最高層級容器，具備標題與網址 (Slug)。
* **Content Block (內容區塊)**：文件的最小組成與編輯單位（支援 `text`, `heading`, `image`, `code` 等類型），對應 Notion 的 Block。
* **Content Version (版本快照)**：特定時間點的頁面與區塊的唯讀備份。
* **Content Tree (內容樹)**：工作區內的頁面層級結構（父子關係視圖）。

### 資產
* **File (檔案)**：上傳至系統的靜態資源，包含 metadata 與 Storage 網址。
* **Wiki Library (知識庫)**：工作區內特定主題的檔案與文件集合。

---

## 三、知識圖譜層（Knowledge Graph Layer）

* **Graph Node (圖節點)**：知識圖譜中的頂點，通常對應一個 `ContentPage` 或 `Tag`。
* **Link (連結/邊)**：節點之間的有向關係。
* **Explicit Link (顯式連結)**：使用者手動建立的關聯。
* **Implicit Link / Auto-link (隱式連結)**：系統分析文本（如 `[[頁面名稱]]`）自動抽取的關聯。
* **Backlink (反向連結)**：指向當前節點的其他節點集合。

---

## 四、AI 層（AI Layer）

### 知識攝入
* **Ingestion Job (攝入作業)**：將原始文件轉換為向量資料的背景任務。
* **Stage (處理階段)**：攝入作業的生命週期（`uploaded` → `processing` → `ready` / `failed`）。
* **Chunking (分塊)**：將長篇文章依據語意或長度切割為小片段 (Chunk) 的過程。
* **Embedding (向量化)**：將文字區塊轉換為浮點數陣列的機器學習過程。

### RAG 與向量檢索
* **RAG (Retrieval-Augmented Generation)**：檢索增強生成，結合向量搜索與 LLM 的問答機制。
* **Top-K (最高相關數)**：向量檢索時返回的最相關 Chunk 數量（通常為 5-10）。
* **Citation (引用來源)**：LLM 答案中佐證資訊的來源標記（精確到 Document 甚至 Chunk/Page）。
* **Context-grounded (上下文受限)**：約束 LLM 只能基於檢索到的 Chunk 回答，禁止其憑空捏造。

### AI 代理
* **Agent (對話代理)**：負責與使用者進行多輪互動的 AI 實體。
* **Thread (對話串)**：單次對話的上下文歷程容器。

---

## 五、工作流程層（WorkSpace Flow）

### 任務管理
* **Task (任務)**：工作區內的可追蹤工作項目，具備明確的狀態機（`draft` → `in_progress` → `qa` → `acceptance` → `accepted`）。
* **Issue (問題/缺陷)**：附屬於任務底下的錯誤追蹤項目（狀態如 `open`, `fixed`, `retest`, `resolved`）。
* **Guard / Transition Policy (守衛/轉換策略)**：驗證狀態轉換是否合法的業務邏輯（例如：Task 進入 QA 前，不能有 Open 的 Issue）。

### 排程與財務
* **Work Demand (工作需求)**：資源調度與時間排程的實體。
* **Invoice (發票/請款單)**：與任務綁定的財務實體，具備審核與付款狀態機（`draft` → `submitted` → `approved` → `paid`）。

### 動態牆與稽核
* **Workspace Feed (動態牆)**：工作區內的活動更新廣播。
* **Audit Log (稽核日誌)**：不可變的系統操作紀錄，用於追溯安全性或重要設定變更。

---

## 六、架構術語

* **MDDD (Module-Driven Domain-Driven Design)**：本專案採用的模組化領域驅動設計，強調嚴格的目錄邊界與 API 隔離。
* **Bounded Context (有界上下文)**：系統劃分的邏輯邊界（即 `modules/` 下的 16 個資料夾），每個上下文內有統一的通用語言與模型。
* **CQRS (Command Query Responsibility Segregation)**：讀寫分離。寫入走 Use Case 與 Domain Model；讀取直接走 Query Function 與唯讀資料庫視圖。
* **Port (埠)**：Domain 層用來定義對外依賴（如資料庫、外部 API）的純 TypeScript 介面。
* **Repository (儲存庫)**：Port 的具體實作（如 `FirebaseTaskRepository`），負責資料的持久化。

---

## 七、命名規範

### 檔案命名
* **實體/類別**：`PascalCase`（例：`WorkspaceEntity.ts`, `AssignTaskUseCase.ts`）。
* **介面/型別**：`PascalCase`，但 Domain Event 與 DTO 可加後綴（例：`ContentDomainEvent`, `CreateTaskDto`）。
* **操作/查詢**：`kebab-case` 或 `camelCase.actions.ts`（例：`task.actions.ts`, `workspace.queries.ts`）。

### Domain Event 命名
* 必須遵循 `<module>.<entity>.<action>` 格式，全小寫底線或連字符。
* **範例**：`content.page_created`, `workspace-flow.task.assigned`。

### Import 規範
* **跨模組 (Cross-Module)**：唯一合法路徑為 `import { X } from "@/modules/<context>/api"`。
* **框架與函式庫**：透過 package aliases 引入（例：`@shared-types`, `@integration-firebase`），禁止 Domain 層引入任何外部框架 (如 React, Firebase)。
