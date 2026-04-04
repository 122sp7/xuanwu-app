# py_fn 架構與開發手冊

本文件定義 `py_fn/src` 的目標分層、依賴方向、開發規範與操作手冊。

## 1. 結構

目標目錄：

```text
py_fn/src/
	interface/        # Firebase 觸發器與輸入輸出轉換（薄層）
	application/      # Use case，協調流程與交易邊界
	domain/           # 實體、值物件、領域規則（純 Python）
	infrastructure/   # Upstash / Firestore / OpenAI / GCS 等外部適配
	core/             # 全域設定、跨層共享但不含業務規則
	app/              # 過渡相容層（逐步遷移中，最終應清空）
```

分層責任：

- `interface`：處理 Callable/Storage event，驗證基本輸入，呼叫 application。
- `application`：只描述「做什麼」，不處理 SDK 細節。
- `domain`：只描述「規則是什麼」，不可依賴 Firebase/HTTP/Upstash。
- `infrastructure`：只描述「怎麼接外部系統」。
- `core`：配置、共用常數、啟動必要元件。
- `app`：舊路徑相容與漸進搬遷。

## 2. 依賴方向

唯一允許方向：

```text
interface -> application -> domain
													 ^
													 |
										infrastructure
```

規則：

- `domain` 不可 import `firebase_*`、`google.cloud.*`、`upstash_*`、HTTP framework。
- `application` 可依賴 `domain` 與 `infrastructure` 的抽象或適配入口，不可依賴 `interface`。
- `interface` 只能呼叫 `application`，不直接寫業務規則。
- 過渡期可由 `application` 呼叫 `app/services/*`，但每次修改都要把新增規則優先放入 `domain`。

## 3. 開發指南

功能新增順序（強制）：

1. 先定義 `domain` 值物件/實體與不變條件。
2. 再寫 `application` use case（輸入/輸出模型、流程協調）。
3. 再接 `infrastructure`（外部 API、資料庫、快取）。
4. 最後在 `interface` 暴露 callable 或 trigger。

重構策略（漸進式）：

1. 舊邏輯仍可留在 `app/services`，但新規則先抽到 `domain`。
2. 用 `application` 包住舊 service，先切斷 handler 直連。
3. 逐步把 `app/services` 內容拆到 `infrastructure` 與 `application`。
4. 完成後移除 `app` 相容層。

程式碼守則：

- 以小步提交與可部署為優先，每次變更都保持可發布。
- 不做跨層捷徑 import。
- I/O 物件與領域物件分離（dict 是介面層資料，domain 是型別物件）。

## 4. 設計規格

### 4.1 RAG 既有流程

Ingestion（固定順序）：

1. parse
2. clean
3. taxonomy
4. chunk
5. chunk metadata
6. embedding
7. persistence
8. mark ready

Query（目前狀態）：

1. 接收 query/account/top_k
2. rate limit
3. embedding + retrieval（vector/search）
4. 篩選 account scope 與 snippet
5. LLM answer
6. cache + audit

### 4.2 Domain 優先規格

`domain/rag` 需先有：

- 查詢值物件：`RagQueryInput`（query、top_k、account_scope）
- 引用值物件：`RagCitation`
- 回應值物件：`RagQueryResult`

必要不變條件：

- `account_scope` 不可為空。
- `query` 需去空白，空字串不得進入檢索流程。
- `top_k` 有最小值、預設值與最大回收上限。

## 5. 使用手冊

### 5.1 本機開發

```bash
cd py_fn
python -m compileall -q .
```

### 5.2 從專案根目錄部署

```bash
npm run deploy:functions:py-fn
```

### 5.3 常見工作流

1. 先改 `domain`（新增值物件/規則）。
2. 改 `application`（use case）。
3. 改 `interface`（handler 與輸入輸出轉換）。
4. 最後補 `infrastructure` 或替換 `app/services` 相容呼叫。

### 5.4 驗收清單

- Handler 不直接執行業務規則。
- Domain 無外部 SDK 依賴。
- 同步更新文件與程式碼。
- 部署成功且 callable 可回應。
