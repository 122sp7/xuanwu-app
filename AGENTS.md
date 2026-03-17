# Xuanwu 架構依賴指南

## 全域層級依賴方向
app (Next.js entry)
    ↓
interfaces (REST / GraphQL / AI endpoints)
    ↓
application (UseCases / Services)
    ↓
domain (Entities / Value Objects / Domain Services + ports interfaces)
    ↑           ↑
infrastructure (Repositories / Adapters / Firebase / Genkit)
    ↑
lib (SDKs / Firebase / Genkit base)

### 橫向依賴
shared → 可被所有層使用
ui     → app 層使用
public → app 層使用


## 模組內部依賴方向（以 modules/ai 為例）
modules/ai/
├─ domain/                ← 核心業務模型
│    ├─ entities
│    ├─ value-objects
│    ├─ domain-services
│    └─ ports/            ← domain 對外抽象（repository / service interface）
│          ↑
│          │
├─ infrastructure/        ← Adapter 層，實作 ports
│    ├─ repositories
│    ├─ converters
│    └─ firebase / genkit / sdk 封裝
│          ↑
│          │
├─ application/           ← UseCases / Services，依賴 domain + ports
│          ↓
├─ interfaces/            ← REST / GraphQL / AI endpoints
│          ↓
├─ ports/                 ← domain 對 application / infrastructure 提供抽象


## 依賴關係總結
domain → 無外部依賴，僅依賴 ports interface
application → domain + ports
interfaces → 呼叫 application
infrastructure → 實作 ports → 使用 lib
lib → SDK 封裝，不依賴專案其他層
shared → 可被 domain / application / infrastructure / interfaces 使用
ui → 僅 app 層使用
public → 僅 app 層使用

## 整體依賴箭頭示意（modules/ai 範例）
app
 │
 ▼
interfaces (modules/ai/interfaces)
 │
 ▼
application (modules/ai/application)
 │
 ▼
domain (modules/ai/domain + ports)
 ▲             ▲
 │             │
infrastructure (modules/ai/infrastructure)
 │
 ▼
lib (SDKs / Firebase / Genkit)

### 橫向
shared → 可被 domain/application/infrastructure/interfaces 使用
ui     → app 使用
public → app 使用
