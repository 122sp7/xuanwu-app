# Context Map — shared

## Shared Kernel 的特殊地位

`shared` 不是普通的 Customer/Supplier 關係。它是 **Shared Kernel** 模式：

> 「兩個 Team 共同擁有一個小型共享模型，任何一方的修改都需要另一方的協調。」
> — Vaughn Vernon, IDDD

## 關係

所有 16 個 BC 都依賴 `shared/`，但這不是普通的依賴關係——它是**共同擁有的合約**：

```
modules/shared/
  ↑ import by all 16 BCs
```

## 規則

1. `shared/` 的任何變更（特別是 `DomainEvent` 介面）都必須同步更新所有消費方
2. 不允許任何 BC 反向依賴（shared/ 不 import 任何 BC）
3. `shared/` 只包含所有 BC 都認可的最小公共型別

## IDDD 整合模式

| 關係 | 模式 |
|------|------|
| shared ← 所有 BC | Shared Kernel |
