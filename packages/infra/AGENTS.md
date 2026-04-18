# infra — Agent Rules

此目錄是 **本地基礎設施原語（infra primitives）** 的唯一存放層。
所有套件均**無外部服務依賴**，離線可用，不需要憑證。

---

## 子套件一覽

| 子套件 | alias | 職責 |
|---|---|---|
| `infra/client-state` | `@infra/client-state` | client-side 狀態原語（非業務 atom / slice） |
| `infra/http` | `@infra/http` | HTTP 工具（fetch wrapper、retry、timeout） |
| `infra/serialization` | `@infra/serialization` | 序列化 / 反序列化工具 |
| `infra/state` | `@infra/state` | 本地狀態管理原語（Zustand store factory、XState machine helpers） |
| `infra/trpc` | `@infra/trpc` | tRPC 客戶端設定與 Provider |
| `infra/uuid` | `@infra/uuid` | UUID 生成（domain 層唯一 id 來源） |
| `infra/zod` | `@infra/zod` | Zod 基礎設施原語（共用 schema 片段、brand helper） |

---

## 核心規則

- 所有 `infra/*` 套件**不得依賴任何外部服務**（Firebase、Google AI、QStash…）
- 不得 import `src/modules/*` 的任何路徑
- 每個子套件的 `index.ts` 是唯一公開入口
- 新增套件前，先確認它是「本地原語」而非「外部服務整合」

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 需要 credentials / 網路 / 第三方帳號 | `packages/integration-*` |
| 業務邏輯 | `src/modules/<context>/domain/` 或 `application/` |
| UI 元件 | `packages/ui-*` |
