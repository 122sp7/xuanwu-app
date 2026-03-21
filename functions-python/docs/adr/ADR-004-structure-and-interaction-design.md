# ADR 004: functions-python 的結構與交互設計

## 狀態 (Status)
**Accepted**

## 背景 (Context)

`functions-python` 已經有初始結構：

- `main.py`
- `app/bootstrap`
- `app/config`
- `app/document_ai/domain`
- `app/document_ai/application`
- `app/document_ai/infrastructure`
- `app/document_ai/interfaces`

但若沒有明確的結構與交互 ADR，後續擴展 ingestion pipeline 時，容易退化成：

- trigger 直接呼叫 SDK
- callable 直接寫 Firestore
- domain 摻雜外部 API 型別
- 新能力無法放進一致的目錄與邊界

## 決策 (Decision)

`functions-python` 的設計維持 **interfaces -> application -> domain <- infrastructure**，並以 worker pipeline 為中心組織。

## 設計細節 (Design)

### 目錄責任

#### `main.py`

- Firebase Functions entrypoint
- 只做最薄的 runtime mapping

#### `app/bootstrap`

- Firebase Admin 初始化
- runtime bootstrapping

#### `app/config`

- 環境變數與 settings 載入

#### `app/<feature>/domain`

- entity
- value object
- port / repository / processor interface
- 純 Python，不含 Firebase / GCP SDK

#### `app/<feature>/application`

- use case orchestration
- pipeline 順序控制
- retry / idempotency policy coordination

#### `app/<feature>/interfaces`

- callable
- trigger
- scheduler / admin entrypoint

#### `app/<feature>/infrastructure`

- Firebase / Firestore / Storage adapter
- Google Cloud / AI provider adapter
- mapper / converter

### 交互流程

#### Ingestion

```text
Next.js upload
  -> Firebase Storage raw file
  -> Firestore documents metadata
  -> functions-python trigger / callable
  -> application use case
  -> parser / taxonomy / chunk / embedding adapters
  -> Firestore chunks + status writes
```

#### Query

```text
Next.js Route Handler / Server Action
  -> Genkit preprocess
  -> query embedding
  -> Firestore vector search
  -> prompt assembly
  -> streamed answer
```

Query flow 不進入 `functions-python` 的主責任範圍；Python 僅在需要背景計算或內部工具時參與。

### Firestore interaction

#### Canonical collections

`documents`

- `id`
- `title`
- `status`
- `taxonomy`
- `createdAt`

`chunks`

- `id`
- `docId`
- `text`
- `embedding`
- `taxonomy`
- `page`
- `chunkIndex`

### Worker interaction contract

每個 worker use case 應盡量滿足：

- 可重試
- 可觀測
- idempotent
- 明確狀態轉移

## Alternatives Considered

### 方案 A：按 Firebase trigger 類型組目錄

例如：

- `callables/`
- `firestore_triggers/`
- `storage_triggers/`

**不採用作為主結構。**

原因：

- 會讓 feature 的 domain/application/infrastructure 分散
- 不利於後續擴展成完整 ingestion module

### 方案 B：單一大型 pipeline service

**不採用。**

原因：

- 會讓 parsing / taxonomy / embedding / persistence 強耦合
- 不利測試與替換 provider

## 後果 (Consequences)

### 正面影響

1. 新能力（如 parser、embedding、reindex）有清楚落點。
2. 與倉庫既有 MDDD 原則保持一致。
3. 有利於逐步取代 TypeScript functions，而不是再造一個臨時 worker。

### 負面影響

1. 初期需要多一些 adapter / port / use case 樣板。
2. 相較直接把程式寫在 handler 內，開發速度較慢，但長期穩定度更高。

## Migration Impact

- 從 `libs/firebase/functions` 搬移功能時，必須先對應到：
  - `interfaces`
  - `application`
  - `domain`
  - `infrastructure`
- 不接受把 TypeScript handler 原樣翻譯成 Python 單檔函式後直接落地。
