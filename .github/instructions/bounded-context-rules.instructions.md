---
description: '限界上下文邊界與模組依賴方向規範，遵循 Vaughn Vernon IDDD 戰略設計原則。'
applyTo: 'modules/**/*.{ts,tsx,js,jsx,md}'
---

# 限界上下文規則 (Bounded Context Rules)

> 權威邊界入口：[`docs/bounded-contexts.md`](../../docs/bounded-contexts.md) 與 `docs/contexts/<context>/*`

## 強制規則

1. 先依 `docs/**/*` 判斷 owning bounded context 與 subdomain，再決定檔案位置。
2. 跨模組存取只能透過目標模組的 `api/` 公開邊界或對應領域事件；不得直接匯入他模組的 `domain/`、`application/`、`infrastructure/`、`interfaces/`。
3. 依賴方向固定為 `interfaces/` → `application/` → `domain/` ← `infrastructure/`；`domain/` 必須保持框架無關。
4. `<bounded-context>` 根層可承接 context-wide 的 `application/`、`domain/`、`infrastructure/`、`interfaces/`；不要把整個 bounded context 簡化成只有 `docs/` 與 `subdomains/`。
5. 若團隊使用 `core/`，只可容納內核 `application/`、`domain/` 與必要 `ports/`；不得把 `infrastructure/` 或 `interfaces/` 放進 generic `core/`。
6. 外部系統整合與模型轉譯放在 `infrastructure/` 或 ACL adapter，避免外部命名污染領域模型。
7. `modules/<context>/docs/*` 只能補 implementation detail，不得覆蓋 `docs/**/*` 的 bounded-context 命名、所有權與邊界決策。

## 禁止模式

- ❌ `import { X } from '@/modules/other-context/domain/...'`
- ❌ `import { X } from '@/modules/other-context/application/...'`
- ❌ `import { X } from '@/modules/other-context/infrastructure/...'`
- ✅ `import { X } from '@/modules/other-context/api'`

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill hexagonal-ddd
