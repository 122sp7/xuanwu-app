# NotebookLM Agent

## Mission

保護 notebooklm 主域作為 AI 對話、來源追蹤與 synthesis 邊界。任何變更都必須維持 notebooklm 對衍生產物的所有權，同時避免把 notion 正典內容或 platform 治理語言直接吸入對話模型。

## Owns

- ai
- conversation
- note
- notebook
- source
- synthesis
- versioning

## Route Here When

- 問題是 notebook、conversation、message、source、citation、note 或 synthesis。
- 問題是 AI 對話流程、多來源摘要、引用追溯或推理輸出。
- 問題需要把外部知識內容作為 source 使用，而不是直接成為正典知識頁面。

## Route Elsewhere When

- Knowledge Page、Article、Database、Template、Attachment 屬於 notion。
- 身份、帳號、組織、授權、政策、方案與通知屬於 platform。
- workspace 容器、活動流、排程與工作區流程屬於 workspace。

## Working Rules

- 先保護 source、conversation、synthesis 的語言一致性，再談 UI 或流程整合。
- 衍生產物可以回流到 notion 或 workspace，但 notebooklm 不直接宣稱其為正典內容。
- 跨主域協作只透過 published language、事件或 API 邊界。
- 新增跨子域術語時，先更新 [ubiquitous-language.md](./ubiquitous-language.md)。

## Documentation Checklist

- 子域變更時，同步更新 [subdomains.md](./subdomains.md)。
- 邊界變更時，同步更新 [bounded-contexts.md](./bounded-contexts.md) 與 [context-map.md](./context-map.md)。
- 新增或調整跨子域術語時，同步更新 [ubiquitous-language.md](./ubiquitous-language.md)。