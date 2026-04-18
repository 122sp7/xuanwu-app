# 1400 Dependency Leakage

- Status: ~~Accepted~~ → **Superseded by [ADR 0015](./0015-api-layer-removal.md)**
- Date: 2026-04-13
- Superseded by: [ADR 0015 – api/ Layer Removal](./0015-api-layer-removal.md)
- Category: Architectural Smells > Dependency Leakage

> **路徑說明**：此 ADR 描述的 `api/index.ts` wildcard re-export 問題使用舊版 `module/api/` 結構。ADR 0015 已整體移除 `api/` 層；本 ADR 描述的違規路徑不再存在。路徑使用舊版 `modules/` 前綴（架構遷移前）。

## Context

`api/index.ts` 的職責是精確控制對外暴露的公開表面積（public API surface）。使用 `export * from "../application"` 或 `export * from "../interfaces"` 會將 application 層或 interfaces 層的**所有**導出物（包括 use-case class、private DTO、internal helper）不加選擇地穿透至公開邊界，造成依賴洩漏。

掃描後發現 **15 個** `api/index.ts` 文件使用無差別 wildcard re-export：

### 違規文件（按嚴重程度）

| 文件 | 洩漏路徑 | 潛在洩漏內容 |
|------|---------|------------|
| `platform/subdomains/account/api/index.ts` | `export * from "../application"` + `export * from "../interfaces"` | CreateUserAccountUseCase、UpdateUserProfileUseCase 等 6 個 use-case **class**；interfaces 內部 helpers |
| `platform/subdomains/identity/api/index.ts` | `export * from "../application"` + `export * from "../interfaces"` | identity use-case classes；interfaces 內部 action helpers |
| `platform/subdomains/entitlement/api/index.ts` | `export * from "../application"` | entitlement.use-cases.ts 中 5 個 use-case class |
| `platform/subdomains/subscription/api/index.ts` | `export * from "../application"` | subscription.use-cases.ts 中 5 個 use-case class |
| `platform/subdomains/access-control/api/index.ts` | `export * from "../application"` | access-control use-case classes |
| `platform/subdomains/notification/api/index.ts` | `export * from "../application"` + `export * from "../interfaces"` | notification use-cases + interfaces |
| `platform/subdomains/background-job/api/index.ts` | `export * from "../application"` | ingestion use-case classes |
| `platform/subdomains/account-profile/api/index.ts` | `export * from "../application"` | account-profile use-cases |
| `platform/subdomains/platform-config/api/index.ts` | `export * from "../application"` | platform-config use-cases |
| `platform/subdomains/search/api/index.ts` | `export * from "../application"` | search use-cases |
| `platform/subdomains/organization/api/index.ts` | `export * from "../interfaces"` | organization interfaces 全部 |
| `notion/subdomains/relations/api/index.ts` | `export * from "../application"` | relations use-cases |

### 危害

1. **Use-case class 公開暴露**：消費者可直接 `new CreateUserAccountUseCase()` 繞過 composition root（正確路徑是透過 `accountService.createUserAccount()`）。
2. **版本穩定性喪失**：application 層任何 internal refactor（rename、split）都自動成為 breaking change，需要所有消費者同步更新。
3. **樹搖（tree-shaking）失效**：wildcard re-export 讓打包工具無法靜態分析哪些 use-case class 真正被使用。
4. **interface 層内部洩漏**：`export * from "../interfaces"` 會暴露 composition 輔助函式、internal hooks 等，超出公開邊界的語意合約。

## Decision

1. **禁止 `export * from "../application"` 在 `api/index.ts` 中使用**。
2. **禁止 `export * from "../interfaces"` 在 `api/index.ts` 中使用**（`interfaces/` 的選擇性 export 可以，但不能 wildcard）。
3. **正確做法**：只 export 真正需要跨模組消費的符號：
   ```typescript
   // ✅ 正確：精確 export
   export type { CreateUserAccountInput } from "../application/dtos/account.dto";
   export { accountService } from "../interfaces/composition/account-service";
   
   // ❌ 禁止：wildcard application re-export
   // export * from "../application";
   ```
4. **Use-case class 本身不應出現在 api/ 邊界**：消費者應呼叫 service facade method，而非直接實例化 use-case。
5. **遷移優先級**：account、identity（影響最廣）→ entitlement、subscription → 其他。

## Consequences

正面：
- api/ 邊界表面積明確，版本合約可控。
- 消費者無法繞過 composition root 直接操作 use-case。

代價：
- 需要逐一審查每個 `export *` 消費者，確認哪些 export 可以保留（以 `export { ... }` 精確列出），哪些可以刪除。
- 短期可能發現某些消費者實際上依賴了不該依賴的 internal，需要補充 service facade method。
