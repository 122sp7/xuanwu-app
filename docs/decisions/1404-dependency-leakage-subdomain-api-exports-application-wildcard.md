# 1404 Dependency Leakage — 11 個 subdomain `api/index.ts` 使用 `export * from "../application"` 洩漏 use-case classes

- Status: Accepted
- Date: 2026-04-14
- Category: Architectural Smells > Dependency Leakage
- Extends: ADR 1403 (subdomain api exports interfaces wildcard)

## Context

ADR 1403 記錄了 4 個 platform subdomain api/index.ts 使用 `export * from "../interfaces"` 的問題，
洩漏了 React UI 元件和 server actions。ADR 1402 記錄並修復了 17 個 use-case class names 被顯式 re-export 的問題。

掃描後發現更廣泛的問題：11 個 subdomain `api/index.ts`（以及 platform/api/contracts.ts）
使用 `export * from "../application"` wildcard，將整個 application 層的所有符號（包括 use-case classes）
無選擇性地暴露在 api 邊界：

### 違規清單

| 檔案 | 洩漏源 |
|------|--------|
| `modules/notion/subdomains/relations/api/index.ts:33` | `export * from "../application"` |
| `modules/platform/subdomains/access-control/api/index.ts:4` | `export * from "../application"` |
| `modules/platform/subdomains/account-profile/api/index.ts:48` | `export * from "../application"` |
| `modules/platform/subdomains/account/api/index.ts:10` | `export * from "../application"` |
| `modules/platform/subdomains/background-job/api/index.ts:6` | `export * from "../application"` |
| `modules/platform/subdomains/entitlement/api/index.ts:5` | `export * from "../application"` |
| `modules/platform/subdomains/identity/api/index.ts:5` | `export * from "../application"` |
| `modules/platform/subdomains/notification/api/index.ts:6` | `export * from "../application"` |
| `modules/platform/subdomains/platform-config/api/index.ts:5` | `export * from "../application"` |
| `modules/platform/subdomains/search/api/index.ts:5` | `export * from "../application"` |
| `modules/platform/subdomains/subscription/api/index.ts:4` | `export * from "../application"` |
| `modules/platform/api/contracts.ts:7` | `export * from "../application/dto"` |

### 問題類型

`export * from "../application"` 會暴露：
- **UseCase classes**（`CreateXxxUseCase`、`UpdateXxxUseCase` 等）— 應為 internal orchestrators
- **Internal DTO types** — 可能包含 application-layer implementation details
- **Application services** — 不應直接被跨域消費者使用

已知案例（from ADR 1402）：`organization/api/index.ts` 曾顯式 export 17 個 use-case class names。
ADR 1402 修正了 organization 的顯式 export，但本 ADR 記錄的 wildcard 問題在其他 11 個子域中依然存在。

## Problem

- **API surface is unbounded**: `export *` 會隨著 `application/` 增長而自動洩漏新的 use-case classes。
- **Cross-domain consumers see implementation details**: 跨域消費者可以直接 import use-case constructors，
  繞過 service facade / action boundary。
- **ADR 1400 non-compliance**: ADR 1400 明確要求 api/ 只暴露穩定語意能力合約，不暴露 use-case classes。
- **Audit difficulty**: 無法靜態分析 api 邊界到底暴露了什麼符號，阻礙 dependency review。

## Decision

針對每個違規的 `api/index.ts`：

1. **移除 `export * from "../application"`**。
2. **改為顯式具名 export**，只暴露跨域消費者實際需要的：
   - Service facade functions（非 class）
   - Public DTO types（需要跨域使用的型別別名）
   - Query function exports

3. **Use-case classes 絕不出現在 api/ 邊界**。

**優先處理**（消費者已知）：
1. `platform/subdomains/identity/api/index.ts` — 廣泛被 auth flow 使用
2. `platform/subdomains/account/api/index.ts` — 廣泛被 workspace/account flow 使用
3. `platform/subdomains/notification/api/index.ts` — 廣泛被 shell 使用

**注意**：`platform/api/contracts.ts` 中的 `export * from "../application/dto"` 是為了 DTO type
re-export，風險較低（DTO 是型別，不是可構造的 class）。但應明確化為具名 export 以提高可讀性。

## Consequences

正面：
- api/ 邊界符合 ADR 1400 規範，API surface 明確可審計。
- 防止 use-case class 被跨域消費者直接實例化。

代價：
- 每個子域需逐一掃描 `application/` 的 export，決定哪些可以留在 api/ 邊界。
- 若消費者確實依賴了某個 use-case class（不應發生但難以排除），需同步修正消費者。
- 工作量估計：12 個檔案 × 平均 20 分鐘 = ~4 小時。

## 關聯 ADR

- **ADR 1402** (Dependency Leakage — UseCase class names in platform/api) — 同類問題的顯式 export 修復
- **ADR 1403** (Dependency Leakage — subdomain api exports interfaces wildcard) — 同類問題的 interfaces 洩漏
- **ADR 1400** (Dependency Leakage — platform/api) — 系列入口文件
- **ADR 5203** (Cognitive Load — subdomain api wildcard) — 認知負荷維度的同一問題
