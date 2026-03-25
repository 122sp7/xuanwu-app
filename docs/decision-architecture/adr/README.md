# Architecture Decision Records (ADR)

> 本目錄記錄 Xuanwu App 的重要架構決策。每份 ADR 描述一個已接受、拒絕或廢棄的決策。

## ADR 格式

每份 ADR 建議包含：

```markdown
# ADR-NNN: <決策標題>

**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-XXX  
**Date**: YYYY-MM-DD

## Context
描述促成此決策的背景與問題。

## Decision
採取的決策與理由。

## Consequences
此決策帶來的正面與負面結果。
```

## 索引

> 目前尚無已記錄的 ADR。請在新增重大架構決策時依據上述格式建立。

## 規範

- 新增 ADR 前先查詢此索引，避免重複。
- ADR 一旦接受，不得直接修改；需以新的 ADR 廢止並取代。
- Python `py_fn/` 的 ADR 放在 [`py_fn/docs/decision-architecture/adr/`](../../../py_fn/docs/README.md)，此處只保留 Next.js / 全棧層的決策。
- 新 ADR 建立後，同步更新本索引表格。
