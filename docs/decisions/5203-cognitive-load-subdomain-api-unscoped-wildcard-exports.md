# 5203 Cognitive Load — 12 Subdomain api/index.ts Use Unscoped Wildcard Exports

- Status: Accepted
- Date: 2026-04-14
- Category: Architectural Smells > Cognitive Load

## Context

模組的 `api/index.ts` 是跨模組協作的**唯一公開合約邊界**（single entry surface）。其設計原則要求：

1. 任何工程師都能在幾秒內讀完 `api/index.ts` 並理解模組對外暴露的完整 surface。
2. API surface 的增減應是**主動決策**，不應因目標層新增文件而自動擴張。

### 違規發現

以下 12 個 subdomain 的 `api/index.ts` 使用了 **`export * from "../application"`** 或 **`export * from "../interfaces"`** 的無選擇性 wildcard export：

#### 平台子域（11 個）

| Subdomain | Wildcard 語句 |
|-----------|-------------|
| `access-control` | `export * from "../application"` |
| `account-profile` | `export * from "../application"` |
| `account` | `export * from "../application"` + `export * from "../interfaces"` |
| `background-job` | `export * from "../application"` |
| `entitlement` | `export * from "../application"` |
| `identity` | `export * from "../application"` + `export * from "../interfaces"` |
| `notification` | `export * from "../application"` + `export * from "../interfaces"` |
| `platform-config` | `export * from "../application"` |
| `search` | `export * from "../application"` |
| `subscription` | `export * from "../application"` |
| `organization` | `export * from "../interfaces"` |

#### Notion 子域（1 個）

| Subdomain | Wildcard 語句 |
|-----------|-------------|
| `relations` | `export * from "../application"` |

### 問題剖析

**1. API surface 不可讀（透明性喪失）**

`export * from "../application"` 的實際 export 數量依賴 `application/index.ts` 的內容，而後者又可能包含多層 `export *`：

```typescript
// access-control/application/index.ts (摘錄)
export * from "./dto";        // 多少 DTO 型別？
export * from "./use-cases";  // 多少 use-case 類別？
export * from "./services/shell-account-access"; // 多少函式？
```

即使是有經驗的工程師也需要逐層追蹤才能知道 `access-control/api` 最終匯出了什麼。

**2. Use-case 類別意外進入公開合約**

`export * from "../application"` 會將 application 層的**所有**導出推入 `api/`，包括 use-case 類別（`CreateUserAccountUseCase`、`SignInUseCase` 等）。見 ADR 1402 的詳細分析。

**3. UI 元件和 server actions 意外進入公開合約**

`export * from "../interfaces"` 會將 React 元件、hooks、providers、server actions 全部推入 `api/`。見 ADR 1403 的詳細分析。

**4. 非主動的 API surface 擴張**

當 `application/use-cases/` 新增一個 use-case 檔案時，透過 wildcard 鏈，它自動成為跨模組的公開合約——沒有任何 code review checkpoint 需要批准此變更。

**5. Tree-shaking 無效**

`export *` 使打包工具難以追蹤 symbol 的實際使用路徑，导致無用的 use-case 類別和 UI 程式碼進入 client bundle。

### 比較：已正確實作的 subdomain

`platform/subdomains/ai/api/index.ts`、`audit-log/api/index.ts` 等使用顯式 export 列表，公開合約清晰可讀，是正確的範例。

## Decision

1. **全面禁止 `api/index.ts` 使用 `export *`**：改為顯式命名 export list（`export { A, B, type C }`）。
2. **分批遷移（按 subdomain 重要性排序）**：
   - Batch 1：`access-control`、`background-job`、`platform-config`、`search`（小型 subdomain，impact 低）
   - Batch 2：`account-profile`、`entitlement`、`subscription`（中型，含 DTO wildcard）
   - Batch 3：`account`、`identity`、`notification`、`organization`（大型，含 UI wildcard，見 ADR 1403）
   - Batch 4：notion `relations`（跨模組合約較簡單）
3. **audit 工具**：使用 TypeScript compiler 的 `--listFilesOnly` 或 `ts-morph` 在遷移前生成各 subdomain 的完整 export symbol 列表，確保遷移不遺漏符號。
4. **新 subdomain 預設禁止 wildcard**：在 `eslint.config.mjs` 的 restricted-imports 或自訂 lint rule 中加入檢查。

## Consequences

正面：
- `api/index.ts` 恢復為「一眼可讀的合約」，新進工程師可在 30 秒內理解任何 subdomain 的公開 surface。
- Use-case 類別新增不再自動成為跨模組 breaking contract（見 ADR 1402）。
- Bundler tree-shaking 恢復有效，可減少 client bundle 體積。
- Code review 可有效把關 API surface 變更。

代價：
- 12 個 subdomain 的 `api/index.ts` 需要逐一改寫，工作量中等（需 `ts-morph` 輔助）。
- 遷移過程需要確保 TypeScript 型別檢查不因遺漏 export 而中斷（務必先執行 `npm run build` 基準線）。

## 關聯 ADR

- **ADR 1400** (Dependency Leakage) — 系列入口文件
- **ADR 1402** (Dependency Leakage — use-case classes in platform/api) — `export * from "../application"` 的具體危害
- **ADR 1403** (Dependency Leakage — subdomain api barrels export * from interfaces) — `export * from "../interfaces"` 的具體危害
- **ADR 5200** (Cognitive Load) — 系列入口文件
- **ADR 0001** (Hexagonal Architecture) — API boundary 設計規範根源
