# Workspace

本文件整理 workspace 主域內部的本地 bounded contexts。全域四主域地圖見 [../../bounded-contexts.md](../../bounded-contexts.md)；本文件只描述 workspace 主域之下的子域切分與邊界。

## Domain Role

workspace 是 Generic 主域，專注於協作容器與工作區範疇。它的中心責任是提供 workspaceId 錨點與協作環境，而不是承接平台治理或知識內容語意。

## Local Bounded Context Inventory

| Local Bounded Context | Owns | Does Not Own |
|---|---|---|
| audit | 工作區操作稽核、追溯證據、調查依據 | 平台層永久合規審計、身份治理 |
| feed | 工作區活動摘要、動態流與使用者可見更新 | 正典業務狀態、知識內容定義 |
| scheduling | 工作區時間安排、提醒與期限協調 | 背景任務執行引擎、計費排程 |
| workflow | 工作區流程定義、執行與狀態推進 | 平台治理流程、知識或 notebook 正典生命週期 |

## Boundary Rules

- workspace 擁有 workspaceId 與工作區生命週期。
- workspace 中的 Member 是 workspace 參與關係，不是平台主體本身；主體身份與授權來源屬於 platform。
- notion 與 notebooklm 可以在 workspace 範疇中運作，但各自內容生命週期不屬於 workspace。
- 子域之間的協作透過 published language、事件或 API 契約，不直接穿透彼此內部模型。

## Ownership Guardrails

- 任何身份、組織、政策、帳務、通知偏好等能力，應路由到 platform。
- 任何 Knowledge Page、Article、Database、Template 等知識內容能力，應路由到 notion。
- 任何 Notebook、Conversation、Source、Synthesis 等 AI 對話能力，應路由到 notebooklm。