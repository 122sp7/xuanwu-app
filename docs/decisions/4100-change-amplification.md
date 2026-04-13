# 4100 Change Amplification

- Status: Accepted
- Date: 2026-04-13
- Category: Maintainability Smells > Change Amplification

## Context

變更放大（Change Amplification）指一個邏輯上的單點變更，實際上需要修改大量文件才能完成。這通常是過度耦合或缺乏抽象的症狀。

掃描後發現兩類變更放大問題：

### 問題一：platform/api 的任何改動影響 68–78 個文件

`platform/api/index.ts` 是 78 個文件的共同依賴點：
- workspace (21 files)
- notion (19 files)
- notebooklm (16 files)
- app/(shell) (13 files)
- 其他 (9 files)

**放大場景舉例：**

| 變更類型 | 實際影響 |
|---------|---------|
| 重命名 `organizationService` → `orgService` | 需要在 21 個 workspace 文件中搜索並更新 |
| 將 Shell UI 元件移至 `platform/api/ui.ts` | 需要更新所有 import 路徑（13 個 app/(shell) 文件） |
| 將 organization subdomain API 設為 explicit export | 可能導致 platform/api wildcard export 破壞，影響依賴它的所有 consumer |
| 新增 breaking change 到 account subdomain | 透過 `export * from "../subdomains/account/api"` 自動擴散至 78 個消費者 |

### 問題二：api/ 的 `export * from "../application"` 變更放大

見 ADR 1400：application 層的任何 export 變更（rename、delete）因為 wildcard re-export 自動成為 api/ 邊界的 breaking change，影響所有消費 api/ 的文件。

**影響計算：**
- 15 個 api/index.ts 使用 `export *`
- 每個 api/index.ts 平均被 3–5 個其他文件引用
- application 層的任何重構 = 平均 45–75 個文件的潛在影響

### 問題三：dto vs dtos 命名（ADR 3200 補充）

若要統一 DTO 目錄命名，需要同時修改：
- 11 個 `dtos/` 目錄重命名
- 所有 import 路徑更新（預計 50+ 文件）

這是命名不一致的代價（Change Amplification 是 Inconsistency 的後果）。

## Decision

1. **platform/api 拆分** 是降低變更放大的根本解法（見 ADR 2100、3100）：
   - 將 UI 元件移至 `api/ui.ts`，降低修改 UI 時對業務 api 消費者的影響。
   - 讓子域 api 可獨立版本化，消費者從精確子域路徑 import。
2. **禁止 `export *` 在 api/ 層**（見 ADR 1400）：
   - 精確列出 export，讓 application 重構不自動成為 api 邊界的 breaking change。
3. **增量遷移策略**：
   - 步驟 1：加入 ESLint `no-restricted-imports`，阻止新的 `platform/api` monolithic import。
   - 步驟 2：新功能使用精確子域路徑，舊 import 不強制遷移。
   - 步驟 3：建立 PR 自動標注（任何 `platform/api/index.ts` 的 diff 需要 platform owner review）。

## Consequences

正面：
- 修改 Shell UI 元件只影響 `platform/api/ui.ts` 消費者，不影響業務邏輯消費者。
- application 重構不再自動破壞 api 邊界合約。

代價：
- 拆分後，新消費者需要查閱哪個 api/ 文件提供所需能力，需要補充文件或 IDE 路徑提示。
- 增量遷移期間，`platform/api/index.ts` 和 `platform/api/ui.ts` 同時存在，短期導航成本稍高。
