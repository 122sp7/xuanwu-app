# personas — 系統人設與語氣約束

## 子域目的

管理系統級人設（Persona）、語氣約束（Tone Constraint），以及特定領域知識配置（Domain Knowledge Profile）。此子域是 `ai` bounded context 對「AI 如何呈現自己、以什麼語氣與知識框架回應」的正典知識邊界。

## 業務能力邊界

**負責：**
- Persona 實體的定義、版本化與發布
- 語氣約束（正式/非正式、簡潔/詳細、主動/被動）的宣告
- 特定領域知識配置（如：法律、醫療、工程）的範疇標記
- Persona 的啟用/停用狀態管理

**不負責：**
- 系統提示詞的組裝執行（屬於 `prompt-pipeline` 子域）
- 模型安全性過濾（屬於 `safety-guardrail` 子域）
- 跨對話的記憶持久化（屬於 `memory-context` 子域）
- AI 實際回覆的內容生成（屬於 `content-generation` 子域）

## personas vs prompts 分工

| 關注點 | personas | prompts |
|--------|----------|---------|
| 行為身份與語氣 | ✅ 正典所有者 | 不關心 |
| 領域知識配置 | ✅ 正典所有者 | 不關心 |
| 提示詞版本控制 | 消費 Persona 配置 | ✅ 正典所有者 |
| 輸入變數定義 | ❌ | ✅ 正典所有者 |

## 核心概念

| 概念 | 說明 |
|------|------|
| Persona | AI 的行為身份宣告，含 name、tone、domain 與 system instruction 片段 |
| ToneConstraint | 語氣約束值對象（formality、verbosity、voice 等維度）|
| DomainKnowledgeProfile | 領域知識配置，標記哪些 domain 範疇被啟用 |
| PersonaVersion | 語意版本化的 Persona 版本，保護依賴此 Persona 的 Prompt 相容性 |

## 架構層級

```
personas/
  api/              ← 對外公開 Persona 查詢能力
  domain/
    entities/       ← Persona
    value-objects/  ← ToneConstraint, DomainKnowledgeProfile, PersonaVersion
    repositories/   ← PersonaRepository（介面）
    events/         ← PersonaPublished, PersonaDeprecated
  application/
    use-cases/      ← PublishPersona, GetActivePersona, ListPersonas
```

## 設計備註

- `Persona` 只宣告「AI 是誰」，不直接等於 system prompt 字串
- `prompt-pipeline` 在組裝時將 `Persona` 的 `systemInstructionFragment` 注入 prompt 模板
- 多個 `ToneConstraint` 維度可同時作用（如：`formality: formal` + `verbosity: concise`）

## Ubiquitous Language

- **Persona**：AI 行為身份的正典宣告（不是角色扮演劇本）
- **ToneConstraint**：語言風格的多維度約束（不是 UI 的主題風格）
- **DomainKnowledgeProfile**：知識框架的範疇宣告（不是訓練資料集描述）
- **PersonaDeprecated**：Persona 進入不可再新建依賴的終態事實
