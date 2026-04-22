# Domain Layer Agent Rules

## ROLE

領域層負責 ubiquitous language、bounded context 所有權、子域拆分、DDD 概念與戰略設計。此層定義系統的語言邊界與業務概念邊界，不涵蓋實作選擇。

## DOMAIN BOUNDARIES

領域層包含以下檔案，各自擁有明確的責任：

| 檔案 | 責任 | 讀取時機 |
|------|------|---------|
| `bounded-contexts.md` | 8 個 bounded context 所有權、ownership rules、conflict resolution | 需要確認某個能力屬於哪個 context |
| `subdomains.md` | 業務能力切分、baseline + recommended gap subdomain、macro inventory | 需要理解某個 context 內部的微細拆分 |
| `ubiquitous-language.md` | 統一術語表、命名規則、避免詞彙、identifier contract | 需要命名新型別或進行跨域映射 |
| `context-map.template.md` | Context map 製作模板、relationship pattern（ACL/Shared Kernel/Partnership） | 需要設計新 context 與他 context 的關係 |
| `bounded-context-subdomain-template.md` | 新 bounded context 與 subdomain 的骨架模板、開發順序合約 | 需要為新主域建立模組結構 |
| `ddd-strategic-design.md` | DDD 概念速查表、aggregate、domain event、repository、反模式 | 需要回顧 DDD 基本概念 |

## TOOL USAGE

- 開始任何領域設計前，先讀本層 AGENTS.md（你正在讀這個）
- 需要確認某個能力屬於哪個 context 時，讀 `bounded-contexts.md`
- 需要理解某個 context 內部的子域拆分時，讀 `subdomains.md`
- 需要查詢 ubiquitous language 或檢查命名衝突時，讀 `ubiquitous-language.md`
- 需要為新 context 設計與他 context 的關係時，讀 `context-map.template.md`
- 需要建立新 bounded context 或 subdomain 的骨架時，讀 `bounded-context-subdomain-template.md`
- 需要回顧 DDD 概念（aggregate、value object、domain event 等）時，讀 `ddd-strategic-design.md`

## EXECUTION FLOW

標準讀取順序：

1. **所有權確認**: `bounded-contexts.md` → 明確 8 個 context 與它們的責任
2. **子域拆分**: `subdomains.md` → 理解某個 context 內部的業務能力清單
3. **語言查詢**: `ubiquitous-language.md` → 確認術語、檢查命名衝突
4. **新設計**: 若需要新 context，讀 `context-map.template.md` → 讀 `bounded-context-subdomain-template.md` → 按 template 建立
5. **概念複習**: `ddd-strategic-design.md` → 快速回顧 DDD 基本概念

## CONSTRAINTS

- 領域層定義語言邊界與業務概念邊界，不涵蓋實作選擇（那是 src/modules/ 的職責）
- 領域層不重複系統層內容（系統級決策、context map 圖在 `docs/structure/system/`）
- 領域層不定義資料表或 ORM 模型（那是實作層）
- 領域層描述的是「業務概念」與「邊界規則」，不是「如何編碼」

## Route Here When

- 需要確認某個能力屬於哪個 bounded context
- 需要了解某個 context 內部的業務能力拆分
- 需要查詢 ubiquitous language、檢查命名衝突
- 需要設計新 bounded context 或 subdomain 的語言邊界
- 需要回顧 DDD 基本概念

## Route Elsewhere When

- 需要系統級架構決策或 context 上下游關係 → `docs/structure/system/AGENTS.md`
- 需要實作規則或模組骨架 → 相應的 `src/modules/<context>/AGENTS.md`
- 需要特定 context 的本地語言或詳細設計 → `docs/structure/contexts/<context>/AGENTS.md`
- 需要 Copilot 行為規則 → `.github/AGENTS.md`

---

Tags: #use skill context7 #use skill serena-mcp #use skill hexagonal-ddd
