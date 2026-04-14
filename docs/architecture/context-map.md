# Context Map

模組關係用上游到下游來看：

- iam → billing
- iam → platform
- iam → workspace
- iam → notion
- iam → notebooklm
- billing → workspace
- billing → notion
- billing → notebooklm
- ai → notion
- ai → notebooklm
- platform → workspace
- workspace → notion
- workspace → notebooklm
- notion → notebooklm
- 所有上游主域 → analytics（事件與投影 sink）

跨模組協作只走 API 邊界或事件，不直接碰內部實作。
