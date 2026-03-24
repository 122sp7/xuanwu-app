# API Contract & Data Transfer Objects (DTOs)

本文件定義模組間及前後端互動的標準介面。所有 Server Actions 需回傳標準化的 `Result<T>`。

---

## 1. Common Types

```typescript
type Result<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
};

type PaginationParams = {
  cursor?: string;
  limit: number;
};
```

## 2. Content Module API (`modules/content/api`)

### Actions
- `createPage(parentId?: string, title?: string): Promise<Result<PageDTO>>`
- `updateBlock(blockId: string, content: Partial<BlockContent>): Promise<Result<BlockDTO>>`
- `moveBlock(blockId: string, targetParentId: string, index: number): Promise<Result<void>>`

### Queries
- `getPageStructure(pageId: string): Promise<Result<PageStructureDTO>>`
  - 回傳包含遞迴 Block 樹的完整結構。

```typescript
interface BlockDTO {
  id: string;
  type: 'text' | 'heading' | 'todo' | 'toggle';
  content: any; // SuperJSON structured
  children: BlockDTO[]; // Recursive
}
```

## 3. Knowledge Module API (`modules/knowledge/api`)

### Actions
- `createLink(sourceId: string, targetId: string, type: LinkType): Promise<Result<void>>`

### Queries
- `getBacklinks(pageId: string): Promise<Result<GraphLinkDTO[]>>`
- `getGraphData(scope?: 'global' | 'local', focusId?: string): Promise<Result<GraphDataDTO>>`

```typescript
interface GraphDataDTO {
  nodes: Array<{ id: string; label: string; group: string }>;
  edges: Array<{ from: string; to: string; type: string }>;
}
```

## 4. Intelligence Module API (`modules/ai/api`)

### Actions
- `streamChat(messages: Message[], context: ContextFilter): Promise<ReadableStream>`
  - 串流回應，不走標準 Result 包裝。
- `ingestContent(entityId: string, type: 'page' | 'block'): Promise<Result<IngestStats>>`

### Queries
- `getSimilarBlocks(text: string, threshold: number): Promise<Result<ScoredBlockDTO[]>>`