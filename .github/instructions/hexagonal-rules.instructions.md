---
description: 'Hexagonal Architecture（端口與適配器）戰略設計規則：Core 獨立性、Port 需求導向、Adapter 邊界、子域交叉約束。'
applyTo: 'src/modules/**/*.{ts,tsx,js,jsx,md}'
---

# Hexagonal Architecture（端口與適配器）設計規則

> 完整邊界參考：**先查 `architecture-core.instructions.md`（實作層級規則）**
> 此文件只包含 Hexagonal Architecture 層級的**戰略設計原則**。

## Core（Domain + Application）

1. Core 不依賴任何外部世界（DB / API / UI / SDK）。
2. Application Layer 只負責 orchestration，不包含 business rule。
3. Use Case 是系統對外的唯一操作入口。
4. Application 只能依賴 Domain abstraction，不依賴 infrastructure implementation。

## Ports（介面層）

5. Port 必須是「需求導向」，不是技術導向（例如 UserRepository，而不是 FirestoreUserClient）。
6. Port 定義在 Core，實作在 Infrastructure。
7. 每個 Port 必須可 mock，可替換，可測試。

## Adapters（基礎設施）

8. Infrastructure 只能實作 Port，禁止反向依賴 Domain 實作細節。
9. Adapter 不可包含 business rule，只能做轉換與 I/O。
10. 外部 SDK 永遠只存在 Adapter 層。

## 子域 × Hexagonal 切分核心規則

1. 子域是「業務邊界」，Hexagonal 是「技術邊界」。
2. 一個子域可以包含多個 Hexagonal 模型，但不允許跨子域共享 core。
3. Domain Model 永遠比 API / DB 更穩定。
4. 技術可以重構，但子域不能因此改變。
5. 所有依賴方向必須指向內部（Dependency Inversion）。
6. 外部世界永遠被 Adapter 包住，不能滲透進 Domain。

## 一句話總結

子域定義「業務邊界」，Bounded Context 定義「語意邊界」，Hexagonal 定義「依賴方向」，Domain 則是唯一不能被任何外部污染的純業務核心。

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-skill
#use skill hexagonal-ddd
