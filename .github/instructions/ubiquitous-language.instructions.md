---
description: '強制查閱 terminology-glossary.md 並使用通用語言進行命名，遵循 IDDD 通用語言規範。'
applyTo: 'modules/**/*.{ts,tsx,js,jsx}'
---

# 通用語言規範 (Ubiquitous Language)

## 核心規則

1. 在命名任何 Class、Interface、Type、Variable 或 Domain Event 之前，**必須**先查閱 `terminology-glossary.md`。
2. 嚴禁使用同義詞替換：若術語表定義使用者為 `Tenant`，不得命名為 `User`、`Client` 或 `Customer`。
3. 領域事件命名必須使用**過去式**，例如：`KnowledgeIngested`、`WorkspaceCreated`、`MemberInvited`。
4. 限界上下文的名稱必須與 `modules/<context>/` 資料夾名稱保持一致。
5. 若發現術語表缺少必要術語，應先更新 `terminology-glossary.md` 再繼續實作。

## 通用語言術語對照表

| 英文術語 | 繁體中文 | 說明 |
|----------|----------|------|
| Aggregate Root | 聚合根 | 聚合的唯一入口，負責保護不變數 |
| Bounded Context | 限界上下文 | 每個 `modules/<context>/` 是一個限界上下文 |
| Domain Event | 領域事件 | 捕捉領域中已發生的業務事實，命名用過去式 |
| Entity | 實體 | 具有唯一識別碼的領域物件 |
| Value Object | 值對象 | 無識別碼、以值相等判斷的不可變物件 |
| Repository | 儲存庫 | 聚合的持久化抽象介面 |
| Domain Service | 領域服務 | 不屬於任何實體的無狀態業務邏輯 |
| Use Case | 使用案例 | `application/` 層的單一業務操作 |
| Ubiquitous Language | 通用語言 | 領域專家與開發者共用的詞彙體系 |
| Anti-Corruption Layer | 防腐層 | 防止外部概念污染領域模型的轉換層 |
| Context Map | 上下文地圖 | 限界上下文間關係的可視化模型 |

## 命名規範

- **聚合根**：`PascalCase` 名詞，例如 `Workspace`、`KnowledgeBase`。
- **值對象**：`PascalCase` 名詞，通常以用途或含義命名，例如 `WorkspaceName`、`TenantId`。
- **領域事件**：`PascalCase` 過去式，例如 `WorkspaceCreated`、`MemberRemoved`。
- **事件 discriminant**：`kebab-case` 格式 `<module>.<action>`，例如 `workspace.created`。
- **使用案例檔案**：`verb-noun.use-case.ts`，例如 `create-workspace.use-case.ts`。
- **儲存庫介面**：`PascalCaseRepository`，例如 `WorkspaceRepository`。
- **儲存庫實作**：`TechnologyPascalCaseRepository`，例如 `FirebaseWorkspaceRepository`。

## 驗證

- 提交前確認新增命名符合術語表定義。
- 若使用新術語，同步更新 `terminology-glossary.md` 的「DDD 戰術設計術語」章節。

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill slavingia-skills-mvp
#use skill xuanwu-mddd-boundaries
