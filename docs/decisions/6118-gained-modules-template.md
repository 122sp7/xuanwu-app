# 6118 Migration Gain — `src/modules/template`


> ✅ **本文件為「僅記錄」文件 — 描述新技能已新增的能力**
> 此 ADR 的目的是記錄蒸餾後新增的能力，作為對比基線。
> **任何 agent 或開發者不得依據本文件直接修改現有程式碼。**

- Status: ✅ 僅記錄 — 已存在於新技能（Recorded — Present in New Skill）
- Date: 2026-04-17
- Category: Migration Gain > architecture

## Context

`xuanwu-skill`（新）新增了 `src/modules/template`，作為新模組的骨架模板。這在 `xuanwu-app-skill`（舊）中不存在。

### 新增內容

```
src/modules/template/
  index.ts
  subdomains/
    example/
      domain/
        aggregates/   ← 聚合根示例
        events/       ← 領域事件示例
        repositories/ ← 倉儲介面示例
        value-objects/ ← 值物件示例
      application/
        use-cases/    ← use case 示例
        dto/          ← DTO 示例
      adapters/
        inbound/      ← React/Server Action 適配器示例
        outbound/     ← Firebase/外部 API 適配器示例
  adapters/
    inbound/react/    ← 模組級 React adapter 示例
    outbound/         ← 模組級 outbound adapter 示例
  shared/             ← 模組內共用型別
  orchestration/      ← 跨子域 orchestration 示例
  README.md           ← 模組說明模板
  AGENT.md            ← Copilot Agent 路由規格模板
```

### 架構意義

`src/modules/template` 提供：

1. **標準骨架**：新模組必須遵循的目錄結構，避免命名不一致。
2. **AGENT.md 模板**：每個模組應有的 Copilot routing 規格（Route Here / Route Elsewhere）。
3. **示例文件**：aggregate、use-case、port、adapter 的正確寫法示例，降低新模組的認知負荷。

### 使用規範

- 建立新 bounded context 時，以 `cp -r src/modules/template src/modules/<new-context>` 為起點。
- `template` 目錄本身不應被修改為實際業務模組。
- `template/AGENT.md` 的格式（Route Here / Route Elsewhere 段落）是所有模組 `AGENT.md` 的必填模板。

## Decision

此為已實作並穩定的功能，**不需要額外動作**。

## Consequences

- 新增的 bounded context 有標準起點，減少因不熟悉架構而引入的結構錯誤。
- `AGENT.md` 模板確保每個模組有明確的 Copilot 路由規格，減少 Copilot 在不確定場景下的錯誤判斷。

## 關聯 ADR

- **architecture-core.instructions.md**：template 目錄的骨架符合 Module Shape and Naming 章節的規範。
- **6104-6106** notion 子域：補回 notion 子域時應以 template 骨架為起點。
