# Domain Services — knowledge-base

> Domain Service 是無狀態的純商業邏輯，不依賴外部 SDK，不操作 Repository。

---

## BacklinkExtractorService

從 Article `content`（Markdown / rich-text）中解析所有 `[[Article Title]]` 格式的 wikilink，並轉換為 `linkedArticleIds`。

```typescript
// modules/knowledge-base/domain/services/BacklinkExtractorService.ts

export class BacklinkExtractorService {
  /**
   * 從 content 字串中提取所有 [[title]] wikilinks。
   * 返回去重後的標題陣列，由 Repository 負責解析為 ID。
   */
  extractWikilinkTitles(content: string): string[] {
    const regex = /\[\[([^\]]+)\]\]/g;
    const titles = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      titles.add(match[1].trim());
    }
    return Array.from(titles);
  }
}
```

---

## ArticleSlugService

將 Article title 轉換為 URL-safe slug，確保在同一 Workspace 下的唯一性規則。

```typescript
// modules/knowledge-base/domain/services/ArticleSlugService.ts

export class ArticleSlugService {
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 100);
  }
}
```

---

## CategoryDepthValidator

驗證 Category 層級不超過最大深度（5 層），防止過深的巢狀結構。

```typescript
// modules/knowledge-base/domain/services/CategoryDepthValidator.ts

export class CategoryDepthValidator {
  private static readonly MAX_DEPTH = 5;

  validateMove(currentDepth: number, targetParentDepth: number): void {
    if (targetParentDepth + 1 > CategoryDepthValidator.MAX_DEPTH) {
      throw new Error(
        `Category depth cannot exceed ${CategoryDepthValidator.MAX_DEPTH}`
      );
    }
  }
}
```
