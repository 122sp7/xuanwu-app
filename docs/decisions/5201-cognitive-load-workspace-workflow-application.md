# 5201 Cognitive Load — `workspace-workflow/application/` 混合 5 種子目錄慣例

- Status: Partially Resolved
- Date: 2026-04-13
- Resolution Date: 2026-04-14
- Category: Complexity Smells > Cognitive Load

> **路徑說明**：此 ADR 中的路徑使用舊版 `modules/` 前綴（架構遷移前）。現行實作位置為 `src/modules/` 下的對應路徑。

> **路徑說明**：此 ADR 中的路徑使用舊版 `modules/` 前綴（架構遷移前）。現行實作位置為 `src/modules/` 下的對應路徑。

## Context

認知負荷（Cognitive Load）在架構上的體現是：開發者需要在腦海中維持多套互相衝突的心理模型才能在代碼庫中導航。
當一個目錄的子目錄採用多種不同的命名和結構慣例時，每次打開這個目錄都需要重新解析「這裡遵循的是哪套規則」。

`workspace/subdomains/workspace-workflow/application/` 是全 repo 中 `application/` 子目錄複雜度最高的：

```
modules/workspace/subdomains/workspace-workflow/application/
  dto/                  ← 單數（vs 根層 dtos/ 複數）
  ports/                ← port 介面（違反：應在 domain/ports/，見 ADR 1102）
  process-managers/     ← 只有 1 個文件，且名稱偏離實際內容（見 ADR 4301）
  services/             ← 含義模糊（domain service？application service？）
  use-cases/            ← 標準 application 層目錄
```

**5 種不同的子目錄，各自暗示不同的架構概念：**

| 子目錄 | 期望包含 | 潛在問題 |
|--------|----------|----------|
| `dto/` | DTO 型別定義 | 命名與根層 `dtos/` 不一致 |
| `ports/` | 應放在 `domain/ports/` | Layer Violation（ADR 1102）|
| `process-managers/` | Process Manager / Saga 協調 | 只有 1 個文件，且是 materializer |
| `services/` | Application Service | 與 `use-cases/` 的差異未明確定義 |
| `use-cases/` | Use-Case classes | 標準，無問題 |

### 對比：repo 中 application 層最輕量的子域

```
modules/notebooklm/subdomains/notebook/application/
  dto/       ← 1 種
  use-cases/ ← 1 種
（共 2 種子目錄，清晰）

modules/workspace/subdomains/scheduling/application/
  dto/                      ← DTO
  work-demand.use-cases.ts  ← use-case 直接在 application/ 根，不在 use-cases/ 子目錄
（命名：use-case 文件不在 use-cases/ 子目錄，也是不一致）
```

`workspace-workflow/application/` 的 5 種子目錄是全 repo 的極值，
`scheduling/application/` 的 use-case 文件直接放在 `application/` 根（而非 `use-cases/`）是另一種反慣例。

### 認知負荷的具體成本

1. **新加入開發者的第一問題**：「`services/` 和 `use-cases/` 裡面放的有什麼區別？」——沒有明確規則。
2. **placement decision paralysis**：新增功能時，不清楚該建立 use-case class 還是 service class。
3. **`ports/` 在 application 的誤導性**：如果 Port 可以在 `application/ports/`，那 `domain/ports/` 的存在意義是什麼？兩套規則。
4. **`process-managers/` 的單文件問題**：單文件目錄增加了目錄層級，但不帶來任何組織收益，只增加導航深度。
5. **跨模組一致性破壞**：工程師在 `notion/knowledge/application/` 工作後換到 `workspace-workflow/application/`，
   面對的是完全不同的子目錄結構，需要重新建立心理模型。

### platform/application/ 的額外認知負荷

`platform/application/` 有 9 個子目錄（見 ADR 3101），是認知負荷最高的 application 層，
但因其問題更偏向 Low Cohesion，已在 ADR 3101 中分析。
此 ADR 聚焦 `workspace-workflow` 的多慣例混用問題。

### 全 repo application/ 子目錄統計

```
platform/application/           : 9 種子目錄（event-handlers, event-mappers, handlers, dtos, queries, services, use-cases）
workspace-workflow/application/  : 5 種子目錄（dto, ports, process-managers, services, use-cases）
workspace/application/           : 4 種子目錄（dtos, queries, services, use-cases）
notion/application/              : 2 種子目錄（dtos, use-cases）  ← 最清晰
notebooklm/application/          : 2 種子目錄（dtos, use-cases）  ← 最清晰
```

## Decision

1. **`workspace-workflow/application/` 目標結構**（精簡至 3 種）：
   ```
   application/
     dto/          ← DTO 型別（統一命名，見 ADR 4201）
     use-cases/    ← 所有 use-case orchestration
     queries/      ← 若有 read-model query，否則刪除
   ```
2. **移出 `ports/`**：遷移至 `domain/ports/`（ADR 1102）。
3. **移出 `process-managers/`**：
   - 若 `knowledge-to-workflow-materializer.ts` 是讀模型投影 → 移至 `interfaces/` 的 projection 目錄或 infrastructure
   - 若確為 process manager → 保留，但補充 README 解釋為何需要獨立目錄
4. **`services/` 內容稽核**：
   - 如果 `services/` 中的類別能被重構為 use-cases（有 `execute()` 方法），合併至 `use-cases/`
   - 如果是薄薄的 Application Service facade（組合多個 use-cases），移至 `interfaces/composition/`
5. **`scheduling/application/` 的 `work-demand.use-cases.ts`**：移入 `use-cases/` 子目錄，遵循標準位置。
6. **`architecture-core.instructions.md` 更新**：明確定義 application 層只允許的子目錄：`dto/`（或 `dtos/`，統一後）、`use-cases/`、`queries/`（可選），其他需要特別申請。

## Consequences

正面：
- 開發者在任何 application 層目錄下都面對相同的 3 種子目錄，無需重新建立心理模型。
- 新增功能時，placement 決策簡單：業務邏輯 → `use-cases/`，查詢 → `queries/`，型別 → `dto/`。

代價：
- 需要將 `ports/`（4 個文件）、`process-managers/`（1 個文件）、`services/` 內容遷移至合適位置，並更新所有 import 路徑。

## 關聯 ADR

- **1102** (Layer Violation)：ports 在 application 層
- **3101** (Low Cohesion)：platform/application 是另一個 application 層凝聚性問題
- **4201** (Inconsistency)：dto vs dtos 命名不一致
- **4301** (Semantic Drift)：process-managers 命名語意漂移

## Resolution

**HX-2-003 — 2026-04-14**

### §5 — scheduling/application/use-cases/

`scheduling/application/work-demand.use-cases.ts` was moved to
`scheduling/application/use-cases/work-demand.use-cases.ts`.
Two importing files updated:
- `scheduling/interfaces/_actions/work-demand.actions.ts`
- `scheduling/interfaces/queries/work-demand.queries.ts`

### §3 — process-managers/ confirmed as process manager

`knowledge-to-workflow-materializer.ts` was reviewed and confirmed to be a
genuine process manager (cross-module, event-driven, multi-step side
effects). A `README.md` was added to
`workspace-workflow/application/process-managers/` documenting the
placement rationale.

### §4 — TaskCandidateRuleExtractor moved to domain/services/

`TaskCandidateRuleExtractor` contained only pure regex rules with no
infrastructure or application dependencies. Its value types
(`KnowledgeTextBlockInput`, `ExtractedTaskCandidate`, `TaskCandidateSource`)
were moved to
`workspace-workflow/domain/value-objects/TaskCandidate.ts`.
The extractor class itself was moved to
`workspace-workflow/domain/services/TaskCandidateRuleExtractor.ts`.
The `application/dto/extract-task-candidates-from-knowledge.dto.ts` now
re-exports the moved types for import-path stability.
The now-empty `application/services/` directory was deleted.

**Remaining open work:**
- ADR Decision §2: `ports/` in application layer → tracked under ADR-1102
  (already Resolved in T1-A).
- ADR Decision §6: `architecture-core.instructions.md` update not yet done.
