# Bounded Context — notebooklm

## 責任邊界

`notebooklm` 擁有 Xuanwu 的 AI 對話與知識合成能力。它是 Supporting Subdomain，為使用者提供 NotebookLM-like 的 AI 推理體驗。

### 這個 context 擁有

- AI 對話 Thread 與 Message 的持久化與生命週期
- AI 模型調用的提示工程、路由與回應封裝
- Notebook 容器的組合、管理與版本策略
- 來源文件的追蹤、引用與引用一致性
- RAG 合成、摘要與洞察的生成
- 對話衍生的輕量筆記與知識連結

### 這個 context 不擁有

- 知識內容的建立與管理（→ `notion`）
- 組織與帳號治理（→ `platform`）
- 工作區生命週期（→ `workspace`）
- 向量索引的建立與語意搜尋查詢（→ AI/RAG 管道）

## 能力分組

| 能力群 | 子域 |
|---|---|
| AI 推理核心 | `ai`、`synthesis` |
| 對話管理 | `conversation`、`versioning` |
| 知識組合 | `notebook`、`note` |
| 來源管理 | `source` |

## Public Boundary

`modules/notebooklm/api/` 是對外的 public boundary：

- 跨模組存取只能透過 `@/modules/notebooklm/api` import
- 禁止直接 import `domain/`、`application/`、`infrastructure/` 或 `subdomains/` 內部

## 封板規則

此 context 的子域清單是 **closed inventory**：

- 7 個子域（ai、conversation、note、notebook、source、synthesis、versioning）
- 後續開發必須先映射到既有子域，不能隨意新增
- 若確實需要新增子域，先更新此文件與 `subdomains.md`

## 層次結構

```
modules/notebooklm/
├── api/             # Public boundary
├── application/     # Use case orchestration
├── domain/          # Aggregates, value objects, domain events
├── infrastructure/  # Driven adapters (AI SDKs, Firebase, etc.)
├── interfaces/      # Driving adapters (web, CLI)
├── ports/           # Input/output port contracts
├── subdomains/      # 7 子域各自的邊界
│   ├── ai/
│   ├── conversation/
│   ├── note/
│   ├── notebook/
│   ├── source/
│   ├── synthesis/
│   └── versioning/
└── docs/            # 本文件集
```

## 上游依賴

| 上游 | 協作方式 | 說明 |
|---|---|---|
| `notion` | API 查詢 | 知識頁面與文章作為合成來源 |
| `platform` | API 查詢 | 身份認證與租戶治理 |
| `workspace` | API 查詢 | `workspaceId` 範疇錨點 |

## 下游消費者

| 下游 | 協作方式 | 說明 |
|---|---|---|
| `app/(shell)/ai-chat` | Server Action → `notebooklm/api` | AI 對話 UI 介面 |
