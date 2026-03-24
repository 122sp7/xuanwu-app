# ADR 012: `py_fn` 目錄位置決策

## 狀態 (Status)

**Accepted**

## 背景 (Context)

在 MDDD 架構遷移（Phase 1–8）完成後，所有 TypeScript 工具函式庫已從 `libs/` 移至 `packages/`
下的對應套件。完成後 `libs/` 目錄僅剩 `libs/firebase/py_fn/` 這一個子目錄，
使得 `libs/` 的存在語意不再成立——它原本是存放 TypeScript 工具整合層的目錄。

此時有必要決定 `py_fn` 的最終放置位置。

## 問題

- `libs/` 目錄原本代表「TypeScript 工具整合層」，遷移後已語意失效
- `py_fn` 不是 TypeScript 套件，無法放入 `packages/`
- 三層路徑 `libs/firebase/py_fn/` 對 Python 工作目錄而言過深且不直觀
- 需要找一個能清楚傳達「這是獨立部署單元」的位置

## 決策 (Decision)

將 `libs/firebase/py_fn/` 移至專案根目錄的 `py_fn/`。

**理由：**

1. **Firebase 慣例**：Firebase CLI 預設 functions codebase 位於專案根目錄（如 `functions/`）；
   `py_fn/` 直接對應 `firebase.json` 中的 codebase 名稱 `py_fn`。

2. **清除語意混淆**：`libs/` 是 TypeScript 工具層，Python worker runtime 不屬於此分類。

3. **第一等部署單元**：放在根目錄明確傳達此目錄是獨立部署單元，而非輔助工具庫。

4. **簡化路徑**：`py_fn/` 比 `libs/firebase/py_fn/` 更短、更易引用。

5. **清理空目錄**：移除後 `libs/firebase/` 和 `libs/` 均為空，可直接刪除。

## 範圍

**不屬於此 ADR 的決策：**

- `py_fn` 內部結構（由各 Python ADR 規範）
- 部署流程（`firebase.json` `source` 欄位已同步更新）
- 與 TypeScript 的互動合約（由各 RAG ADR 規範）

## 後果 (Consequences)

### 正面

- `libs/` 目錄正式清空並刪除，移除遷移後的殘餘路徑
- `py_fn/` 在根目錄一目了然，與其他 Firebase 設定檔同層
- `firebase.json` source 路徑更短：`"source": "py_fn"`

### 負面 / 注意事項

- 所有引用舊路徑的文件、記憶體、合約均已同步更新
- 歷史 ADR 中對已退休之 `libs/firebase/functions`（TypeScript）的引用保持不變（歷史記錄）

## 更新清單

以下檔案已同步更新，將 `libs/firebase/py_fn` 替換為 `py_fn`：

- `firebase.json` — `source` 欄位
- `packages/README.md` — Migration History 新增條目與說明
- `docs/decision-architecture/adr/ADR-001, ADR-009, ADR-010` — 跨 runtime 邊界引用
- `docs/development-reference/development-reference/reference/development-contracts/overview.md, rag-ingestion-contract.md`
- `py_fn/README.md, AGENT.md, docs/decision-architecture/adr/*` — 內部自我引用
