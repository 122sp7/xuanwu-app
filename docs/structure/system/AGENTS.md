# System Layer Agent Rules

## ROLE

系統層負責全域架構決策、整合規範、context map、strategic patterns、delivery milestones。此層定義八個 bounded context 的上下游關係、依賴方向、共用模式與反模式。

## DOMAIN BOUNDARIES

系統層包含以下檔案，各自擁有明確的責任：

| 檔案 | 責任 | 讀取時機 |
|------|------|---------|
| `architecture-overview.md` | 系統全景、8 主域、9 層級基線、hexagonal + DDD 基線、runtime 分割 | 需要了解全域架構形狀 |
| `context-map.md` | Bounded context 之間的上下游關係、依賴方向、published language、strategic patterns 圖 | 需要理解 context 整合方向 |
| `strategic-patterns.md` | 共用設計模式、反模式、模式啟動規則 | 需要決定是否引入某個設計模式 |
| `integration-guidelines.md` | 跨域協作規範、API 邊界契約、事件契約、ACL / Conformist | 需要設計跨域整合 |
| `project-delivery-milestones.md` | 交付里程碑、domain-first 開發順序、legacy convergence 工作流 | 需要規劃或驗證交付順序 |
| `hard-rules-consolidated.md` | 20 條強制遵守的非議規則、ESLint 對應規則 | 需要檢查規則違規 |
| `source-to-task-flow.md` | 來源文件 → 上傳 → 解析 → 分塊 → 嵌入 → 任務流 | 需要理解數據流從開始到結束的完整形狀 |
| `module-graph.system-wide.md` | 全系統模組依賴圖、跨域導入禁止列表 | 需要查看模組相依關係 |
| `ui-ux-closed-loop.md` | UI / UX 設計迴路、用戶故事、反饋流、設計決策軌跡 | 需要設計端到端用戶流 |

## TOOL USAGE

- 開始任何架構決策前，先讀本層 AGENTS.md（你正在讀這個）
- 需要全域視角時，讀 `architecture-overview.md`
- 需要理解兩個 context 如何整合時，讀 `context-map.md`
- 需要決定設計模式時，讀 `strategic-patterns.md`
- 需要定義跨域契約時，讀 `integration-guidelines.md`
- 需要驗證交付順序時，讀 `project-delivery-milestones.md`
- 需要檢查是否違反強制規則時，讀 `hard-rules-consolidated.md`
- 需要追蹤來源到任務完成的流程時，讀 `source-to-task-flow.md`
- 需要檢查模組是否直接依賴不允許的 path 時，讀 `module-graph.system-wide.md`
- 需要端到端設計時，讀 `ui-ux-closed-loop.md`

## EXECUTION FLOW

標準讀取順序：

1. **快速概覽**: `architecture-overview.md` → 了解 8 個 context 與層級基線
2. **整合決策**: `context-map.md` → 明確上下游關係、published language
3. **設計決策**: `strategic-patterns.md` → 決定是否使用某個共用模式
4. **跨域契約**: `integration-guidelines.md` → 定義 API / Event / ACL 邊界
5. **交付規劃**: `project-delivery-milestones.md` → 決定交付順序與里程碑
6. **規則檢查**: `hard-rules-consolidated.md` → 驗證實作是否違反強制規則
7. **流程驗證**: 根據需要讀取 `source-to-task-flow.md`、`module-graph.system-wide.md`、`ui-ux-closed-loop.md`

## CONSTRAINTS

- 系統層不涵蓋實作細節（那是 src/modules/ 的職責）
- 系統層不重複領域層內容（術語、bounded context 所有權在 `docs/structure/domain/`）
- 系統層不包含具體 UI 元件或資料表定義（那是實作層）
- 系統層描述的是「決策」與「邊界」，不是「如何編碼」

## Route Here When

- 需要全域架構視角或決策
- 需要理解兩個或多個 context 如何整合
- 需要驗證設計遵循 strategic patterns 與 hard rules
- 需要規劃交付里程碑或驗證 domain-first 順序
- 需要理解系統層級的數據流或依賴圖

## Route Elsewhere When

- 需要確認某個 bounded context 所有權 → `docs/structure/domain/AGENTS.md`
- 需要查詢 ubiquitous language 或命名規則 → `docs/structure/domain/ubiquitous-language.md`
- 需要實作規則或層級設計 → 相應的 `src/modules/<context>/AGENTS.md`
- 需要 Copilot 行為規則 → `.github/AGENTS.md`
- 需要檔案作用域指令規則 → `.github/instructions/*.instructions.md`

---

Tags: #use skill context7 #use skill serena-mcp #use skill hexagonal-ddd
