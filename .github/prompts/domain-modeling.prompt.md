---
name: domain-modeling
description: 純 Domain 模型建構器（DDD 核心）：設計 Entity / Value Object / Aggregate Root，建立或擴展 bounded context，將業務語言映射至 domain model。
applyTo: 'src/modules/**/domain/**/*.{ts,tsx}'
agent: Domain Architect
argument-hint: 提供業務概念名稱、所屬模組與子域、核心業務規則（不變數）、狀態欄位、與其他 Aggregate 的關係。
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
---

# Domain Modeling 純領域模型建構器

## 職責邊界

**負責**
- Entity / Value Object / Aggregate Root 設計
- Bounded Context 識別與建立
- 業務語言（Ubiquitous Language）→ domain model 映射
- Domain Event 定義（過去式命名、Zod schema）
- Repository / Port 介面定義（不含實作）
- 業務不變數（invariants）保護規則

**不負責**
- Firebase / infrastructure 實作
- UI / React 元件
- AI flow（Genkit）
- Application Layer orchestration

## 輸入

- **業務概念名稱**：例如 `WorkDemand`、`KnowledgeArtifact`
- **所屬模組 / 子域**：例如 `src/modules/notion/subdomains/knowledge`
- **核心業務規則**：需要保護的不變數清單
- **狀態欄位**：主要屬性與型別
- **關係**：與哪些 Aggregate 有邊界關係（only by reference/ID）

## 工作流程

1. 讀取 `docs/01-architecture/domain/ubiquitous-language.md` — 確認命名符合通用語言，若術語不存在，先在 docs 新增再繼續。
2. 讀取 `docs/01-architecture/domain/bounded-contexts.md` 與 `docs/01-architecture/domain/subdomains.md` — 確認所屬 bounded context 與子域正確。
3. 讀取 `docs/01-architecture/contexts/<context>/README.md` — 了解 context-local 語言規則。
4. 讀取 `.github/instructions/domain-modeling.instructions.md` — 確認 Aggregate / Value Object / Event 設計模式。
5. 讀取 `.github/instructions/domain-layer-rules.instructions.md` — 確認技術純度規則。
6. 在 `src/modules/<context>/[subdomains/<sub>/]domain/` 建立以下結構（視需要）：
   - `value-objects/<Name>Id.ts` — 識別碼品牌型別（`z.string().uuid().brand()`）
   - `value-objects/<Name>.ts` — 其他值對象
   - `aggregates/<Name>.ts` — 聚合根（私有 constructor + `create()` + `reconstitute()`）
   - `events/<Name>.events.ts` — 領域事件（Zod schema + type，過去式命名）
   - `repositories/<Name>Repository.ts` — Repository 介面（非實作）
7. 聚合根必須：
   - 私有 `_domainEvents: DomainEvent[]` + `pullDomainEvents()` + `getSnapshot()`
   - 業務方法內驗證不變數後 push 事件
   - 不依賴 Firebase / React / ORM
8. Domain Event discriminant 格式：`<module-name>.<action>`（例如 `workspace.demand-created`）

## 輸出合約

- 識別碼值對象（Zod brand type）
- Aggregate Root 完整類別
- 最少一個 Domain Event（Zod schema + 推導型別）
- Repository 介面
- 若有新術語：`docs/01-architecture/domain/ubiquitous-language.md` 更新建議

## 驗證

- `npm run lint` — 確認無 framework 依賴與邊界違規
- `npm run build` — 確認型別一致

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill hexagonal-ddd
