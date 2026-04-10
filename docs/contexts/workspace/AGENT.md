# Workspace Agent

## Mission

保護 workspace 主域作為協作容器與 workspaceId 範疇錨點。任何變更都必須維持 workspace 只擁有工作區生命週期、活動流、稽核、排程與流程協作，不吞入平台治理或內容正典責任。

## Owns

- audit
- feed
- scheduling
- workflow

## Route Here When

- 問題是工作區容器、工作區生命週期或 workspaceId 範疇。
- 問題是活動摘要、稽核追蹤、排程協調或工作區流程執行。
- 問題需要把多個內容或對話能力掛載到同一個 workspace 範疇之下。

## Route Elsewhere When

- 身份、帳號、組織、授權、政策、方案、通知屬於 platform。
- Knowledge Page、Article、Database、Template、Attachment 屬於 notion。
- Notebook、Conversation、Source、Synthesis、Note 屬於 notebooklm。

## Working Rules

- 先維持 workspace 與 platform 的邊界，再討論功能細節。
- 先維持 workspace 與 notion / notebooklm 的內容所有權邊界，再討論承載方式。
- 跨主域協作只使用 published language、事件或 API 邊界。
- 新增跨子域名詞時，先更新 [ubiquitous-language.md](./ubiquitous-language.md)。

## Documentation Checklist

- 子域變更時，同步更新 [subdomains.md](./subdomains.md)。
- 邊界變更時，同步更新 [bounded-contexts.md](./bounded-contexts.md) 與 [context-map.md](./context-map.md)。
- 新增或調整跨子域術語時，同步更新 [ubiquitous-language.md](./ubiquitous-language.md)。