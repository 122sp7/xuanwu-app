# @infra/form

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Headless form state management via **TanStack Form v1**.

## Purpose

提供無 UI 耦合的表單狀態管理能力，作為 `interfaces/` 層的表單邏輯基礎。業務驗證由 `domain/` 處理，UI 組件由 `ui-shadcn/` 提供，此套件只負責表單的狀態機、欄位訂閱與提交流程。

## Import

```ts
import { useForm, formOptions, createFormHook, type FormApi } from '@infra/form'
```

## Core Usage

### 基本表單

```tsx
"use client"
import { useForm } from '@infra/form'

function CreateWorkspaceForm() {
  const form = useForm({
    defaultValues: { name: '', description: '' },
    onSubmit: async ({ value }) => {
      await createWorkspaceAction(value)
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.Field name="name">
        {(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>
      <button type="submit">建立</button>
    </form>
  )
}
```

### 共用 formOptions

```ts
import { formOptions } from '@infra/form'

// 可在 shared config 定義，避免重複 defaultValues
export const workspaceFormOptions = formOptions({
  defaultValues: { name: '', description: '' },
})
```

### createFormHook — 自訂 Field 組件

```ts
import { createFormHookContexts, createFormHook } from '@infra/form'

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

function TextField() {
  const field = useFieldContext<string>()
  return <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
}

export const { useAppForm } = createFormHook({
  fieldComponents: { TextField },
  formComponents: {},
  fieldContext,
  formContext,
})
```

## Key Exports

| Export | 類型 | 說明 |
|---|---|---|
| `useForm` | Hook | 主要表單 hook，管理所有欄位狀態與提交 |
| `useField` | Hook | 獨立欄位管理（非 form.Field 語境） |
| `useStore` | Hook | 訂閱 form/field 狀態的 reactive selector |
| `createFormHook` | Factory | 建立自訂 `useAppForm` hook（含注入組件） |
| `createFormHookContexts` | Factory | 建立 fieldContext / formContext / useFieldContext |
| `formOptions` | Helper | 定義共用表單選項（defaultValues、validators） |
| `mergeForm` | Helper | 合併 Server Action 回傳的伺服器狀態 |
| `FormApi` | Type | form 物件型別（`useForm` 的回傳值） |
| `FieldApi` | Type | field 物件型別 |
| `FieldMeta` | Type | 欄位 meta（touched、dirty、errors） |
| `ValidationError` | Type | 驗證錯誤格式 |

## Architecture Notes

- 僅用於 `interfaces/` 層（`"use client"` 必要）
- `formOptions` 可定義在 shared config，但 `useForm` 只能在 Client Component 呼叫
- 業務 invariant 屬於 `domain/`，此套件不承載業務規則
- 表單 UI 組件（Input、Button）使用 `packages/ui-shadcn/`
