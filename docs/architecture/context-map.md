# Context Map

模組關係用上游到下游來看：

- platform → workspace
- platform → notion
- platform → notebooklm
- workspace → notion
- workspace → notebooklm
- notion → notebooklm

跨模組協作只走 API 邊界或事件，不直接碰內部實作。
