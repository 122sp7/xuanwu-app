# DDD 戰略設計規則 — AI Context

本文件整理 Domain-Driven Design 的核心戰略概念，並直接對應 `ai` bounded context 的設計決策。

---

## 一、核心戰略概念（Strategic Design Rules）

1. 通用語言（Ubiquitous Language）必須在團隊內部與程式碼中保持一致，任何領域概念的命名都應直接反映業務語意。

2. 界限上下文（Bounded Context）必須明確定義語言與模型的邊界，不同上下文之間不得共享模型語意。

3. 每個界限上下文內的模型必須保持一致性（Consistency），跨上下文則允許語意轉換（Translation）。

4. 子域（Subdomain）應依業務價值分類為核心域（Core）、支撐域（Supporting）、通用域（Generic），並依此分配設計與資源優先級。

5. 核心域（Core Domain）必須集中最強設計能力與抽象，避免被基礎設施或通用邏輯污染。

6. 支撐域（Supporting Subdomain）應服務核心域需求，但不承載關鍵競爭優勢。

7. 通用域（Generic Subdomain）應優先採用現成方案（如第三方服務），避免自行重複建造。

8. 上下文映射（Context Mapping）必須明確描述各界限上下文之間的關係與整合方式。

9. 不同上下文之間的整合必須選擇適當模式（如 Anti-Corruption Layer、Conformist、Open Host Service 等）。

10. 反腐層（Anti-Corruption Layer）必須用於隔離外部模型，防止污染內部核心模型。

11. 開放主機服務（Open Host Service）應提供穩定、公開的契約，供其他上下文整合使用。

12. 發佈語言（Published Language）應定義跨上下文共享的標準資料格式與語意。

13. 共享核心（Shared Kernel）僅應在高度信任的團隊之間使用，並需嚴格控制變更。

14. 客戶-供應者（Customer-Supplier）關係應明確定義需求與交付責任，以維持演進穩定。

15. 順從者（Conformist）模式應在無法影響上游模型時採用，接受其語意限制。

16. 分離方式（Separate Ways）應在整合成本過高時採用，允許上下文完全獨立演化。

17. 大泥球（Big Ball of Mud）應被避免，若存在則需逐步以界限上下文重構。

18. 戰略設計必須優先於戰術設計，先定義邊界與關係，再設計內部模型與程式結構。

---

## 二、戰略地圖（概念關係）

```
Subdomain（業務問題空間）
        ↓ 對應
Bounded Context（解決方案邊界）
        ↓
Context Mapping（上下文關係）
        ↓
Integration Patterns（整合模式）
```

---

## 三、關鍵對照

| 概念 | 本質 |
|------|------|
| Subdomain | 業務問題分類（商業視角） |
| Bounded Context | 技術模型邊界（系統視角） |
| Ubiquitous Language | 語意一致性 |
| Context Mapping | 上下文關係圖 |

---

## 四、AI Context 的子域分類映射

```
Core Domain（核心競爭優勢）
  → prompt-pipeline     — AI 提示詞編排與多家族分派
  → inference           — 模型推理執行（content-generation、content-distillation）

Supporting Domain（服務核心域）
  → memory-context      — 跨對話記憶與可重用上下文整理
  → evaluation-policy   — AI 品質與回歸評估政策
  → safety-guardrail    — 安全護欄與內容保護

Generic Domain（可外包／第三方替換）
  → models              — LLM Provider 適配（可替換 provider）
  → embeddings          — Embedding 向量（py_fn 執行，schema 在此）
  → tokens              — 計費權重與配額（依 provider 計費模型）
```

> **選型原則**：Core Domain 自建最強抽象；Supporting Domain 謹慎設計；Generic Domain 優先接入 provider adapters，不重複造輪。

---

## 五、整合模式說明（`ai` context 適用）

| 整合模式 | 適用場景 |
|----------|---------|
| Anti-Corruption Layer | `ai` 接入外部 LLM provider（OpenAI、Gemini）時保護內部語意 |
| Open Host Service | `ai` 模組的 `index.ts` 提供穩定公開契約供 `notion`、`notebooklm` 消費 |
| Published Language | `AICapabilitySignal`、`ModelPolicy`、`SafetyGuardrail` 等跨域 token |
| Conformist | `notion`、`notebooklm` 直接接受 `ai` 的能力語意，不轉換 |
| Customer-Supplier | `platform.ai` → `notion`、`notebooklm`（upstream 定義，downstream 消費）|

---

## 六、最重要的總結（戰略層一句話）

> 先切邊界（Bounded Context），再談模型；先定關係（Context Map），再寫程式。

---

## 文件網

- [subdomains.md](./subdomains.md) — `ai` context 子域清單
- [bounded-contexts.md](./bounded-contexts.md) — 邊界責任定義
- [context-map.md](./context-map.md) — 與其他 context 的關係圖
- [ubiquitous-language.md](./ubiquitous-language.md) — 通用語言詞彙表
- [bounded-contexts.md](../domain/bounded-contexts.md) — 全域主域所有權地圖
