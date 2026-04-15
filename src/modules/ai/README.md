# AI Module — 精簡蒸餾骨架

> **⚠ 蒸餾作業進行中**：`src/modules/ai/` 正在從 `modules/ai/`（完整 HEX+DDD 實作層）蒸餾而來。兩層職責不同，不可互換。
>
> - `modules/ai/` → 讀取邊界規則、published language、context map；不在此新增實作。
> - `src/modules/ai/` → 撰寫新 use case、adapter、entity；以 `template` 骨架為起點。

**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

---

## 子域對照表（modules → src/modules）

| 子域 | 蒸餾來源 | 狀態 | 說明 |
|---|---|---|---|
| `conversations` | `modules/ai/subdomains/conversations/` | 📋 待蒸餾 | 對話歷程管理 |
| `datasets` | `modules/ai/subdomains/datasets/` | 📋 待蒸餾 | 訓練/評估資料集 |
| `embeddings` | `modules/ai/subdomains/embeddings/` | 📋 待蒸餾 | 向量嵌入能力 |
| `evaluation-policy` | `modules/ai/subdomains/evaluation-policy/` | 📋 待蒸餾 | AI 輸出評估策略 |
| `memory-context` | `modules/ai/subdomains/memory-context/` | 📋 待蒸餾 | 對話記憶體 / 上下文 |
| `messages` | `modules/ai/subdomains/messages/` | 📋 待蒸餾 | 訊息格式與歷程 |
| `model-observability` | `modules/ai/subdomains/model-observability/` | 📋 待蒸餾 | 模型呼叫可觀測性 |
| `models` | `modules/ai/subdomains/models/` | 📋 待蒸餾 | 模型選擇 / 路由 |
| `personas` | `modules/ai/subdomains/personas/` | 📋 待蒸餾 | AI 人格設定 |
| `prompt-pipeline` | `modules/ai/subdomains/prompt-pipeline/` | 📋 待蒸餾 | 提示管線（multi-template）|
| `prompts` | `modules/ai/subdomains/prompts/` | 📋 待蒸餾 | 提示模板倉庫 |
| `safety-guardrail` | `modules/ai/subdomains/safety-guardrail/` | 📋 待蒸餾 | 輸出安全防護 |
| `tokens` | `modules/ai/subdomains/tokens/` | 📋 待蒸餾 | Token 計量 / 配額 |
| `tools` | `modules/ai/subdomains/tools/` | 📋 待蒸餾 | Tool calling / function 定義 |

---

## 預期目錄結構（蒸餾後）

```
src/modules/ai/
  index.ts                      ← 模組對外唯一入口（具名匯出）
  README.md
  AGENT.md
  orchestration/
    AiFacade.ts                 ← 對外統一 Facade
    AiCoordinator.ts            ← 跨子域協調
  shared/
    domain/index.ts
    application/index.ts
    events/index.ts             ← Published Language Events（供 notebooklm / workspace 消費）
    errors/index.ts
    types/index.ts
  subdomains/
    prompt-pipeline/            ← 優先蒸餾（現有 modules/ 實作完整）
      domain/
      application/
      adapters/outbound/
    safety-guardrail/
      domain/
      application/
      adapters/outbound/
    evaluation-policy/
    memory-context/
    model-observability/
    ... (其餘子域按需蒸餾)
```

---

## 依賴方向

```
subdomains/*/adapters/inbound → subdomains/*/application → subdomains/*/domain
                                                                    ↑
                               subdomains/*/adapters/outbound  ───┘
                                                    ↑
                                             shared/domain
```

跨子域協調只能透過 `orchestration/` 或 `shared/events/`，不得直接跨 subdomain import。

---

## 蒸餾來源參考

- `modules/ai/api/` — 公開 API 邊界（跨模組存取入口，蒸餾前維持現況）
- `modules/ai/subdomains/prompt-pipeline/` — 現有 prompt-pipeline 完整實作
- `modules/ai/subdomains/safety-guardrail/` — 現有 safety-guardrail 實作

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 把 `modules/ai/infrastructure/` 直接複製到 `src/modules/ai/domain/` | 層次混淆，污染 domain 純度 |
| 把 `src/modules/ai/` 當成 `modules/ai/` 的別名 | 兩層職責不同，互不取代 |
| 在 `domain/` 中 import Genkit、Firebase SDK | 破壞 domain 純度 |
| 在 barrel 使用 `export *` | 破壞 tree-shaking 與邊界可追蹤性 |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/ai/](../../../modules/ai/) — 完整 HEX+DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
