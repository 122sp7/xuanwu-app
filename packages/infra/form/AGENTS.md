# infra/form — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/form/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


此套件是 **headless 表單狀態管理的唯一授權來源**，透過 TanStack Form v1 提供零框架侵入的表單邏輯。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 表單狀態管理 | `useForm({ defaultValues, onSubmit })` — 主要 hook |
| 自訂 Field 組件工廠 | `createFormHook` / `createFormHookContexts` — 組合模式 |
| 共用表單選項 | `formOptions(...)` — 可在 shared config 定義 defaultValues / validators |
| 伺服器狀態合併 | `mergeForm(...)` — Server Action 回傳初始值時使用 |
| Field metadata 型別 | `FieldMeta`, `FormState`, `FormApi`, `FieldApi` |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務邏輯驗證（invariant） | `src/modules/<context>/domain/` |
| Zod 驗證 schema | `packages/infra/zod/` |
| UI 輸入組件（Input、Select） | `packages/ui-shadcn/` |
| 帶業務語意的表單組件 | `src/modules/<context>/interfaces/` |
| Server Action 邊界驗證 | `packages/infra/zod/` + Server Action 層 |

---

## 嚴禁

```ts
// ❌ 不得在 domain/ 層 import
import { useForm } from '@infra/form'  // domain 層禁止 React hooks

// ❌ 不得把業務 invariant 寫在 onSubmit
const form = useForm({
  onSubmit: ({ value }) => {
    if (value.balance < 0) throw new Error('...')  // ❌ 應在 domain aggregate
  }
})

// ✅ 正確：validation 在 field 層，invariant 在 domain
const form = useForm({
  defaultValues: { title: '' },
  onSubmit: async ({ value }) => {
    await createWorkspaceUseCase.execute(value)
  }
})
```

- 此套件所有 hook 均需 `"use client"`，不得在 Server Component 中呼叫
- `formOptions` 可在 shared config 使用，但 `useForm` 必須在 Client Component
- 不得在此套件包含任何業務語意或 domain rule

## Alias

```ts
import { useForm, formOptions, type FormApi } from '@infra/form'
```
