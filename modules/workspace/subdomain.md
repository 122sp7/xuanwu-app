# Subdomain — workspace

`workspace` 所對應的問題空間在 Xuanwu 的戰略分類中屬於 generic subdomain。

全域 subdomain 分類由 [docs/ddd/subdomains.md](../../docs/ddd/subdomains.md) 擁有；本文件只說明 workspace 為什麼落在這個分類，以及它在 selected problem-space view 中的意義。

## Why Generic

workspace 解決的是「協作範圍、生命週期與公開邊界」問題，而不是 Xuanwu 的主要差異化來源。

它的重要性很高，但它不是產品獨特價值本身。真正形成產品差異化的，仍是知識內容、檢索、協作語意與工作流等上下文。

## What Problem Space It Covers

workspace 子域聚焦這些問題：

- 工作區作為協作容器的存在性
- 工作區範圍鍵 `workspaceId`
- 工作區生命週期與可見性
- 讓其他 bounded contexts 能以共同範圍語言協作

## What It Deliberately Does Not Differentiate

- 它不定義知識內容本身
- 它不定義組織成員真相來源
- 它不定義檢索、RAG、文章治理等差異化業務能力

Ports、Adapters、Drivers、Read Models 也不是 subdomain 本身；它們是 bounded context 內部或邊界上的實作 / 協作概念。

換句話說，workspace 子域提供的是必要的結構性能力，而不是核心競爭優勢。

## Selected Strategic View

這份文件只用 workspace 為中心看它周邊牽涉到的問題空間：

- `organization` 提供 ownership 與 member/team truth
- `knowledge`、`knowledge-base`、`source`、`notebook` 等透過 `workspaceId` 對齊範圍
- `workspace-flow`、`workspace-feed`、`workspace-scheduling` 等在工作區範圍內延伸自己的語言

這是一個 selected view，不是整個 Xuanwu domain 的完整 subdomain 分析。

## What Is Not a Subdomain

以下概念雖然與 workspace 有關，但不應拿來當 subdomain：

- Firestore、event bus 等 external systems
- Browser UI、Server Actions、job triggers 等 drivers
- repository ports、adapters 等 hexagonal 結構元件
- `WorkspaceMemberView`、`Wiki*Node` 這類 read models / projections

## Investment Posture

作為 generic subdomain，workspace 的策略不是追求花俏建模，而是：

- 穩定邊界
- 穩定 published language
- 清楚 ownership
- 對其他 bounded contexts 提供低摩擦協作面

## Related Local Docs

- [README.md](./README.md) — 模組總覽
- [bounded-context.md](./bounded-context.md) — 本地 bounded context 邊界
- [context-map.md](./context-map.md) — 與其他 bounded contexts 的關係
