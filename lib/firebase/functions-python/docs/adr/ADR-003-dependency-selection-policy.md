# ADR 003: functions-python 依賴套件選型規則

## 狀態 (Status)
**Accepted**

## 背景 (Context)

`functions-python` 目前已經有自己的：

- `requirements.txt`
- `requirements-dev.txt`
- `pyproject.toml`

如果不把依賴選型原則寫成 ADR，後續容易發生：

1. 為了短期方便引入過重框架。
2. 將 query/runtime orchestration 套件錯誤帶進 worker codebase。
3. 把 domain / application 直接綁死在特定 SDK 上。
4. 與 `lib/firebase/functions` 的依賴策略長期分叉，導致遷移困難。

## 決策 (Decision)

`functions-python` 的依賴選型遵循以下原則：

### A. 保留的核心 runtime 依賴

- `firebase-functions`
- `firebase-admin`

用途：

- 建立 Firebase Functions Python entrypoint
- 使用 Admin SDK 存取 Firestore / Storage / 其他 Firebase 能力

### B. 保留的文件處理與雲端整合依賴

- `google-cloud-documentai`
- `google-cloud-documentai-toolbox`
- `google-cloud-storage`
- `google-cloud-firestore`

用途：

- 文件解析
- GCP 文件處理輸出轉換
- Storage / Firestore 基礎設施整合

### C. 允許但必須受 application / infrastructure 控制的 AI 輔助依賴

- `google-cloud-aiplatform`
- `langchain-text-splitters`

用途：

- embedding / taxonomy / 後續 AI pipeline 的 infrastructure adapter
- chunking utility

限制：

- 不得把 LangChain 當作整體應用框架引入
- 不得讓 chunking library 洩漏到 `domain`

### D. 明確不應引入到 functions-python 的責任型依賴

- Next.js runtime 套件
- React / browser state 套件
- Genkit query orchestration runtime
- 用於 UI / streaming 的框架依賴

原因：

這些責任屬於 **Next.js product edge**，不是 worker infrastructure runtime。

## 套件選型細則 (Package Selection)

### 為什麼保留 `google-cloud-documentai`

- 目前已有對應 Node 與 Python scaffold
- 對企業文件解析、版面結構、表格與 OCR 的能力最貼近目標

### 為什麼只把 `langchain-text-splitters` 當工具而不是核心框架

- 我們需要的是 chunking utility，不是把 worker orchestration 建立在 LangChain abstraction 上
- 若把整個 pipeline 綁在 LangChain，未來切換 splitter / embedding provider 的成本會提高

### 為什麼不把 Genkit 帶進 functions-python

- Genkit 在目前架構中屬於 query orchestration 與 LLM response generation 邊界
- 這些能力被決定留在 Next.js

## Alternatives Considered

### 方案 A：把 worker 依賴盡量做成「零 AI 套件」

**不採用。**

原因：

- 這會讓 ingestion pipeline 無法承接 embedding / taxonomy / chunking 的長期需求

### 方案 B：全面導入 LangChain / LlamaIndex 類框架

**不採用。**

原因：

- 對目前 Firebase-native 目標來說太重
- 容易把基礎設施細節包進框架抽象，增加維運複雜度

## 後果 (Consequences)

### 正面影響

1. 依賴選型更可控，方便 Copilot 做對的預設判斷。
2. worker runtime 保持輕量、明確、以 Firebase/GCP 原生整合為優先。
3. 未來若更換 parser / embedding provider，可在 infrastructure 層處理，不必重寫整體結構。

### 負面影響

1. 某些高階框架便利性需要自己補 application/infrastructure adapter。
2. 需要持續維護依賴上限，避免 Firebase 執行環境相容性問題。

## Migration Impact

- 從 `lib/firebase/functions` 移轉時，應先移轉 **Document AI / Firebase / Storage / Firestore** 相關依賴與 adapter。
- 不應在遷移過程中順便把 product-facing query runtime 套件導入 Python codebase。
