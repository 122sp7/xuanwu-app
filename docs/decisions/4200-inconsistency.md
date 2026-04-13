# 4200 Inconsistency

- Status: Accepted
- Date: 2026-04-13
- Category: Maintainability Smells > Inconsistency

## Context

不一致（Inconsistency）指同類事物在 codebase 中使用了不同的命名慣例、目錄結構或組織方式，導致開發者每次增刪時都需要判斷「跟誰對齊」。

掃描後發現四類不一致問題：

### 不一致一：`dto` vs `dtos` 目錄命名

見 ADR 3200。**13** 個目錄用 `dto`，**11** 個目錄用 `dtos`。
這是最廣泛的不一致，影響所有模組的 application 層。

### 不一致二：`interfaces/` 子目錄組織方式

| 模組 | interfaces/ 子目錄命名方式 |
|------|--------------------------|
| platform | 技術層（`web/`、`api/`、`cli/`） |
| workspace | 技術層（`web/`、`api/`） |
| notion | **子域名稱**（`knowledge/`、`authoring/`、`collaboration/`、`database/`、`taxonomy/`、`relations/`） |
| notebooklm | **子域名稱**（`conversation/`、`notebook/`、`source/`、`synthesis/`） |

兩種組織方式均有其合理性：
- 技術層命名（web/api/cli）按「輸出渠道」分類，適合主域有單一技術邊界的情況。
- 子域命名按「業務能力」分類，適合 notion/notebooklm 各子域 UI 相互獨立的情況。

**問題**：開發者在新模組決定 `interfaces/` 結構時，沒有明確慣例可遵循。

### 不一致三：`api/` 邊界文件數量與命名

| 模組 | api/ 文件 |
|------|----------|
| platform | `index.ts`（153 行 monolith） |
| workspace | `index.ts` + `facade.ts` + `ui.ts` + `contracts.ts` + `runtime/` |
| notion | `index.ts`（re-export subdomain api）|
| notebooklm | `index.ts` + `server.ts` |

workspace 和 notebooklm 已採用 `api/ui.ts` / `api/server.ts` 的分離方式，但 platform 尚未跟進。

### 不一致四：queries/ 目錄歸屬

| 位置 | 範例 |
|------|------|
| `application/queries/` | `platform/application/queries/`, `workspace/application/queries/` |
| `interfaces/queries/` | `platform/subdomains/account/interfaces/queries/`, `workspace/subdomains/audit/interfaces/queries/` |
| `interfaces/api/queries/` | `workspace/interfaces/api/queries/` |

同樣是「查詢」，有些放在 `application/queries/`（純業務查詢），有些放在 `interfaces/queries/`（React/Next.js 相關查詢），有些放在 `interfaces/api/queries/`（server action 查詢）。對應關係沒有明確規範。

## Decision

1. **DTO 目錄命名統一**：全部改為 `dto`（單數），見 ADR 3200。
2. **interfaces/ 子目錄命名標準**：
   - 若模組有明確的技術輸出渠道差異（web UI vs server API）→ 使用技術層命名（`web/`、`api/`）
   - 若模組按子域組織 interfaces（各子域 UI 完全獨立）→ 使用子域命名
   - 選擇的方式需在模組的 `interfaces/interfaces.instructions.md` 中說明
3. **api/ 文件分離標準**（見 ADR 1200、3100）：
   - 有 UI 元件：新增 `api/ui.ts`
   - 有 server-only 能力：新增 `api/server.ts`
   - 主 `api/index.ts` 只暴露能力合約
4. **queries/ 目錄歸屬規範**：
   - 純業務查詢（框架無關）→ `application/queries/`
   - React/client side 查詢 hook → `interfaces/web/queries/` 或 `interfaces/<subdomain>/queries/`
   - Server Action 查詢（Next.js server function）→ `interfaces/api/queries/`（若有 interfaces/api/）或 `interfaces/queries/`

## Consequences

正面：
- 開發者在新增文件時有明確的歸屬規則，不需要靠「跟哪個模組看起來像」的直覺判斷。
- 跨模組 code review 時，可以用統一標準評估目錄結構合理性。

代價：
- `dto` → `dtos` 統一涉及批量重命名，需要腳本和 PR review（見 ADR 3200）。
- interfaces/ 命名標準需要在 `interfaces.instructions.md` 補充說明，現有不一致的模組（notion vs platform）不強制遷移，但新模組必須遵循。
