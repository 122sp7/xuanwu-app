---
name: generate-value-object
description: 生成符合 DDD 規範的值對象（Value Object），採用 Zod brand type 確保型別安全，並放置於正確的 domain/value-objects/ 路徑。
applyTo: 'modules/**/domain/value-objects/**/*.{ts,tsx}'
agent: Domain Architect
argument-hint: 提供值對象名稱、所屬模組、型別基礎（string/number/object）、驗證規則（長度限制、格式、範圍）。
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
---

# Generate Value Object

## 職責邊界

**負責**

- 以 Zod Schema + `z.brand()` 定義不可變值對象
- 識別碼值對象（`XxxId`）與語意值對象（`XxxName`、`XxxEmail` 等）
- 確保值對象不含識別碼欄位（識別碼由 aggregate 持有）

**不負責**

- Aggregate root 設計（使用 `generate-aggregate` prompt）
- Entity 設計（有識別碼的可變物件）
- Infrastructure persistence mapping

## 輸入

- **值對象名稱**：例如 `WorkspaceId`、`KnowledgeArtifactName`、`EmailAddress`
- **所屬模組**：例如 `workspace`、`notion`、`platform`
- **型別基礎**：`string` / `number` / `object`
- **驗證規則**：長度限制、正規表達式、數值範圍、列舉值等

## 識別碼值對象模式（`XxxId`）

```typescript
// modules/<context>/domain/value-objects/<Name>Id.ts
import { z } from 'zod';

export const <Name>IdSchema = z.string().uuid().brand('<Name>Id');
export type <Name>Id = z.infer<typeof <Name>IdSchema>;
```

## 語意值對象模式（非識別碼）

```typescript
// modules/<context>/domain/value-objects/<Name>.ts
import { z } from 'zod';

export const <Name>Schema = z.string()
  .min(1)
  .max(100)
  .trim()
  // 加入適合的驗證規則
  .brand('<Name>');

export type <Name> = z.infer<typeof <Name>Schema>;

// 選用：提供工廠函式以提升使用端可讀性
export const create<Name> = (raw: string): <Name> =>
  <Name>Schema.parse(raw);
```

## 複合值對象模式（object-based）

```typescript
// modules/<context>/domain/value-objects/Address.ts
import { z } from 'zod';

export const AddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  countryCode: z.string().length(2).toUpperCase(),
}).brand('Address');

export type Address = z.infer<typeof AddressSchema>;
```

## 工作流程

1. 讀取 `docs/ubiquitous-language.md` 與對應 `docs/contexts/<context>/ubiquitous-language.md`，確認命名符合通用語言。
2. 讀取 `.github/instructions/domain-modeling.instructions.md`，確認設計規則。
3. 確認放置路徑：`modules/<context>/domain/value-objects/<Name>.ts`
4. 依照上方模式建立值對象檔案。
5. 確認值對象：
   - 無識別碼欄位（`id` 欄位不屬於值對象）
   - 不可變（`readonly` 或 `Object.freeze`）
   - 相等性以值內容判斷，非物件參考
6. 更新 `domain/value-objects/index.ts` barrel export。

## 輸出合約

- 值對象 TypeScript 檔案（Zod Schema + 推導型別 + 選用工廠函式）
- `domain/value-objects/index.ts` barrel 更新

## 驗證

- `npm run lint` — 確認無 framework import 在 `domain/`
- `npm run build` — 確認型別一致

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-skill
#use skill hexagonal-ddd
#use skill zod-validation
