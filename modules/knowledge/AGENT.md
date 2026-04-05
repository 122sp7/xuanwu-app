# AGENT.md — modules/knowledge

## 模組定位

`modules/knowledge` 是 Knowledge Platform 的**核心域（Core Domain）**，對應 Notion 文件管理層。擁有知識頁面、區塊、版本、集合與標籤的完整生命週期。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `KnowledgePage`（不是 Page、Document、Note）
- `ContentBlock`（不是 Block、Item）
- `ContentVersion`（不是 Version、Snapshot）
- `KnowledgeCollection`（不是 Folder、Group）
- `Tag`（不是 Label、Category）

## 邊界規則

### ✅ 允許

```typescript
// 其他模組透過 api/ 存取
import { knowledgeFacade } from "@/modules/knowledge/api";
import type { KnowledgePageDTO } from "@/modules/knowledge/api";
```

### ❌ 禁止

```typescript
// 禁止直接 import 內部層
import { KnowledgePage } from "@/modules/knowledge/domain/entities/content-page.entity";
import { createContentPage } from "@/modules/knowledge/application/use-cases/create-page.use-case";
```

## 依賴方向

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- `domain/` 禁止 import Firebase SDK、React、HTTP clients
- `infrastructure/` 只依賴 `domain/` 的 Repository 介面
- `application/` 只依賴 `domain/` 抽象，不直接使用 Firebase

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `wiki/api` | 事件訂閱 | 頁面建立後通知 wiki 建立 GraphNode |
| `search/api` | 事件訂閱 | 頁面更新後觸發搜尋索引更新 |
| `ai/api` | 事件訂閱 | 頁面發布後觸發 RAG ingestion |
| `identity/api` | API 呼叫 | 驗證作者身分 |
| `workspace/api` | API 呼叫 | 驗證工作區範圍 |

## 領域事件命名規則

- 格式：`knowledge.<過去式動詞>`
- 範例：`knowledge.page_created`、`knowledge.version_published`
- 事件 discriminant 必須使用 `kebab-case`

## 常見模式

### Use Case 結構

```typescript
// application/use-cases/create-knowledge-page.use-case.ts
export class CreateKnowledgePageUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: CreateKnowledgePageInput): Promise<CommandResult> {
    const page = KnowledgePage.create(generateId(), input);
    await this.repo.save(page);
    const events = page.pullDomainEvents();
    await this.eventPublisher.publishAll(events);
    return { success: true, aggregateId: page.id };
  }
}
```

### 聚合根結構

```typescript
// domain/entities/content-page.entity.ts
export class KnowledgePage {
  private constructor(private readonly _id: KnowledgePageId, private _state: State) {}

  public static create(id: KnowledgePageId, input: CreateInput): KnowledgePage { ... }
  public static reconstitute(snapshot: Snapshot): KnowledgePage { ... }
  public updateContent(blocks: ContentBlock[]): void { ... }
  public archive(): void { ... }
  public pullDomainEvents(): DomainEvent[] { ... }
}
```

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
