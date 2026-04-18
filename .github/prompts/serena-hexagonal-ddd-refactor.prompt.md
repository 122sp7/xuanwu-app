---
name: serena-hexagonal-ddd-refactor
description: Refactor oversized or boundary-leaking files with Serena-assisted context, preserving behavior and Hexagonal DDD contracts.
agent: Hexagonal DDD Architect
argument-hint: Provide target scope (path/module), refactor goal, and constraints.
---

# Serena Hexagonal DDD Refactor

## Mission

在不破壞現有功能前提下，修正大型檔案或邊界洩漏問題，並同步 Serena 記憶與索引。

## Inputs

- scope: `${input:scope:src/modules/<context>}`
- goal: `${input:goal:boundary fix / split / cleanup}`
- constraints: `${input:constraints:no API break, keep runtime split}`

## Workflow

1. 用 Serena 啟用專案並讀取相關記憶。
2. 盤點 scope 內高風險檔案（過大、跨層依賴、boundary bypass）。
3. 依 `architecture-core` 規則重構：
   - 保持 `interfaces -> application -> domain <- infrastructure`
   - 禁止跨模組內部匯入
   - 移除 domain 層技術依賴
4. 保持 public API 與行為相容；必要時先建立遷移橋接。
5. 執行既有 lint/build/test（命中的範圍）。
6. 更新 Serena 記憶（decisions/findings/risks/validation）。

## Output Contract

- Refactor scope and changed files
- Boundary violations fixed
- Compatibility notes
- Validation evidence
- Remaining risks / follow-ups

## Validation

- 架構規則：`../instructions/architecture-core.instructions.md`
- Runtime 規則：`../instructions/architecture-runtime.instructions.md`
- 交付流程：`../instructions/process-framework.instructions.md`

Tags: #use skill serena-mcp
#use skill repomix
#use skill context7
#use skill hexagonal-ddd
#use skill occams-razor
