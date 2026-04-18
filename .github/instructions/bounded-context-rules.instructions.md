---
description: 'Bounded Context（界限上下文）戰略設計規則：語意一致性邊界、模型隔離、顯式轉換、獨立演化。'
applyTo: 'src/modules/**/*.{ts,tsx,js,jsx,md}'
---

# Bounded Context（界限上下文）設計規則

> 完整邊界參考：**先查 `docs/structure/domain/bounded-contexts.md`、`docs/structure/domain/ubiquitous-language.md`、`docs/contexts/<context>/README.md`**
> 此文件只包含 Bounded Context 層級的**戰略設計約束**，不複製領域知識或程式碼範例。

## 戰略設計規則

1. Bounded Context 是「語意一致性邊界」，不是資料夾。
2. 每個 Bounded Context 內的語言必須一致（Ubiquitous Language）。
3. 同一概念在不同 Context 可以有不同模型，但不能混用。
4. Context 之間的模型轉換必須顯式（Translator / Mapper / ACL）。
5. Domain Model 只能存在於 Bounded Context 內，不可跨 Context reuse。
6. Context 是演化單位，不是模組拆分單位。
7. 一個 Context 必須能獨立測試與部署（至少邏輯層面）。

## 與子域的關係

- 一個子域可以包含多個 Bounded Context。
- Bounded Context 名稱必須與 `src/modules/<context>/` 資料夾名稱一致。
- 跨 Context 的模型引用必須使用 Published Language token，不得直接傳遞 upstream aggregate。

## 驗證

- 確認每個 Context 有獨立的 Ubiquitous Language 定義。
- 確認跨 Context 通訊使用 API boundary 或 event contract。
- 確認不存在跨 Context 的 Domain Model 重用。

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill hexagonal-ddd
