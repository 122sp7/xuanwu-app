# 5100 Accidental Complexity

- Status: ~~Accepted~~ → **Superseded by [ADR 0015](./0015-api-layer-removal.md)**
- Date: 2026-04-13
- Category: Complexity Smells > Accidental Complexity

> **路徑說明**：此 ADR 中的路徑使用舊版 `modules/` 前綴（架構遷移前）。現行實作位置為 `src/modules/` 下的對應路徑。workspace/api 相關問題已徝 ADR 0015 採用 api/ 移除方案。

## Context

偶然複雜性（Accidental Complexity）指系統中並非由業務需求驅動、而是由技術選擇或設計決策引入的不必要複雜性。

掃描後發現三類偶然複雜性：

### 問題一：workspace/api 分為五個文件（over-engineering）

```
workspace/api/
  index.ts     (20 行)  ← 只做 re-export，無實質內容
  contracts.ts (146 行) ← 型別合約
  facade.ts    (91 行)  ← 業務行為 facade
  ui.ts        (170 行) ← UI 元件 re-export
  runtime/              ← runtime factory
```

`index.ts` 只有 20 行且只做 `export * from "./facade"` 等 re-export，本身無實質意義。
`contracts.ts` 和 `facade.ts` 分離意義不大——contracts 通常就是 facade 導出的型別，可合併。

相比之下：
- `notebooklm/api/index.ts`（129 行）將所有能力統一在 index.ts + server.ts 中，更清晰。
- `notion/api/index.ts` 也是統一的 index.ts re-export 聚合。

workspace 的五文件拆分沒有對應的業務複雜性支撐，是過度拆分（over-engineering）。

### 問題二：lazy `require()` 打補丁代替設計

見 ADR 1300、2300。四個 `require()` 呼叫是技術補丁，每個都暗示一個更深層的設計問題（循環依賴）。維護這些補丁需要額外的注釋、特殊的測試考慮、以及避免「普通開發者改了 import 路徑導致補丁失效」的風險。

### 問題三：infrastructure-api.ts 在 api/ 層存在

```
modules/platform/api/
  index.ts
  contracts.ts
  facade.ts
  infrastructure-api.ts   ← 為什麼 infrastructure 存在於 api/ 層？
  service-api.ts
  platform-service.ts
```

`infrastructure-api.ts` 的存在表示 api/ 層在暴露「基礎設施能力（Firebase Firestore、Storage、Functions）」作為公開合約。這引入了不必要的複雜性：
- 消費者需要理解「api/index.ts 暴露業務合約」與「infrastructure-api.ts 暴露基礎設施」的差異。
- 實際上，notion 和 notebooklm 直接使用 infrastructure API（`firestoreInfrastructureApi`）是架構妥協，長期應透過平台 service API 而非 infrastructure API。

### 問題四：workspace/application 同時有 services/ 和 queries/ 和 use-cases/ 三個平行子目錄

```
modules/workspace/application/
  dtos/
  queries/
  services/
  use-cases/
```

DDD 的 application 層需要 `use-cases/`（業務行為）和 `queries/`（CQRS 讀端）。但同時存在 `services/` 表示有些業務邏輯被組織為 Application Service 而非 Use Case，產生「同一概念兩種表達」的偶然複雜性。

## Decision

1. **workspace/api 簡化**：
   - 合併 `contracts.ts` 至 `index.ts` 或 `facade.ts`
   - 保留 `ui.ts`（職責明確）和 `server.ts`（server-only）
   - `index.ts` 直接 re-export from `facade.ts` + `ui.ts`，不需要 separate contracts.ts
2. **`infrastructure-api.ts` 長期目標**：
   - 移至 `infrastructure/` 層，api/ 不直接暴露基礎設施能力
   - notion/notebooklm 的直接 Firestore 存取需求透過 Platform Service API 滿足，而非 infrastructure-api.ts
3. **`services/` vs `use-cases/` 統一**：
   - 選擇 use-cases/ 作為標準（因為「use-case」語意更精確）
   - 若某些業務邏輯不適合單一 use-case 形式，可以在 use-cases/ 中建立 Application Service class，但放在 use-cases/ 目錄下，而非另建 services/
4. **`require()` 補丁替換**：見 ADR 1300、2300 的 DI/Port 解法。

## Consequences

正面：
- workspace/api 簡化後，消費者只需讀 1–2 個文件（index.ts + ui.ts/server.ts）。
- 消除 infrastructure-api.ts 後，notion/notebooklm 的 Firestore 使用路徑更符合架構規範。

代價：
- workspace/api contracts.ts 合併前，需確認所有 `import from workspace/api/contracts` 的路徑都更新。
- `services/` → `use-cases/` 統一需要分批遷移，避免破壞 workspace application 層的現有功能。
