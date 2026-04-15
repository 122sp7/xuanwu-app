# prompts — 系統提示詞模板管理

## 子域目的

管理系統提示詞模板的版本控制、輸入變數定義，以及靜態約束（tone、format、safety boundary）。此子域是「提示詞作為第一級資產」的正典知識邊界，與執行時期的 prompt 組裝（`prompt-pipeline`）形成分工。

## 業務能力邊界

**負責：**
- 系統提示詞模板的版本化儲存與發布
- 模板輸入變數（Variables）的型別與必填規範定義
- 靜態約束宣告：語氣（tone）、輸出格式（format）、安全邊界（safety boundary）
- 模板的查詢與召回（依 family、version、intent）

**不負責：**
- 動態 prompt 組裝與 context window 填充（屬於 `prompt-pipeline` 子域）
- 模型呼叫執行（屬於 `inference` 子域）
- 模板品質評估（屬於 `evaluation-policy` 子域）
- Safety guardrail 執行（屬於 `safety-guardrail` 子域）

## prompts vs prompt-pipeline 分工

| 關注點 | prompts | prompt-pipeline |
|--------|---------|-----------------|
| 模板儲存 | ✅ 正典所有者 | 消費者 |
| 版本控制 | ✅ 正典所有者 | 不關心 |
| 動態組裝 | ❌ | ✅ 正典所有者 |
| Tool binding | ❌ | ✅ 正典所有者 |

## 核心概念

| 概念 | 說明 |
|------|------|
| PromptTemplate | 含版本號、family、輸入變數定義與靜態約束的值對象 |
| TemplateVariable | 模板輸入變數的名稱、型別與必填規範 |
| StaticConstraint | tone、output format、safety boundary 的宣告 |
| TemplateVersion | 語義版本化的版本識別符（major.minor.patch）|

## 架構層級

```
prompts/
  api/              ← 對外公開模板查詢能力
  domain/
    entities/       ← PromptTemplate
    value-objects/  ← TemplateVersion, TemplateVariable, StaticConstraint
    repositories/   ← PromptTemplateRepository（介面）
  application/
    use-cases/      ← GetPromptTemplate, ListPromptTemplates, PublishPromptTemplate
```

## Ubiquitous Language

- **PromptTemplate**：帶版本與靜態約束的提示詞資產（不是裸字串）
- **TemplateFamily**：同一業務意圖下的模板族群（如 `task-extraction`、`summarization`）
- **StaticConstraint**：編譯時期決定的語氣與格式邊界，不依賴執行時期 context
- **TemplateVariable**：組裝時必須填入的具名佔位符
