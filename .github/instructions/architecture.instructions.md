---
description: 'Compatibility router for architecture rules. Use consolidated core/runtime/process docs as canonical sources.'
applyTo: "**"
---

# Architecture Standard (Compatibility Router)

此文件保留為相容入口，不再承載完整架構敘事。

## Canonical Sources

- Module boundary and layer ownership → `architecture-core.instructions.md`
- Runtime split and source routing → `architecture-runtime.instructions.md`
- Delivery/process discipline → `process-framework.instructions.md`
- Documentation authority and naming → `docs-authority-and-language.instructions.md`
- Strategic architecture truth → `../docs/README.md`

## Non-Negotiables

- 依賴方向固定：`interfaces -> application -> domain <- infrastructure`
- 跨模組協作只能透過 `src/modules/<context>/index.ts` 或事件契約
- `domain/` 不得依賴框架、SDK、I/O 實作
- `src/app/` 只做 composition；業務規則留在 modules
- `py_fn/` 負責重度、可重試的 ingestion / embedding pipeline

## Why this file is thin

- 降低重複與衝突風險
- 讓規則維護集中在專責文件
- 維持舊入口可用，同時導向新權威文件

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
