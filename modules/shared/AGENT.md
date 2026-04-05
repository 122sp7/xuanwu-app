# AGENT.md — shared BC

## 模組定位

`shared` 是 Shared Kernel，提供所有 BC 共同依賴的最小基礎型別集。修改任何 shared/ 型別前，需確認所有消費方的影響。

## 最重要規則：DomainEvent 欄位名稱

```typescript
// ✅ 正確：occurredAt（ISO string）
interface MyEvent {
  readonly type: "module.action";
  readonly occurredAt: string;  // ISO 8601
}

// ❌ 錯誤：不存在 occurredAtISO 欄位
interface WrongEvent {
  readonly occurredAtISO: string;  // 不正確
}
```

## 通用語言

| 正確術語 | 禁止使用 |
|----------|----------|
| `DomainEvent` | BaseEvent, Event |
| `occurredAt` | occurredAtISO, timestamp（作為 DomainEvent 欄位） |
| `EventRecord` | AuditRecord（在此 BC 內） |

## 邊界規則

- `shared/` 內不放業務邏輯
- 只放多個 BC 都需要的最小型別
- 任何新增需要全域共識

## 驗證命令

```bash
npm run lint
npm run build
```
