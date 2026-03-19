
**描述：**
> 請為我生成「模型驅動六角架構」的核心憲法。這份文件必須定義專案的層級依賴規則：**Domain (核心模型)**、**Application (Use Cases)**、與 **Infrastructure (Adapters)**。
> * **關鍵要求**：強調 Domain 層嚴格禁止依賴任何外部庫（如 Firebase 或 Upstash）。
> * **模型驅動**：定義如何使用 Zod 作為 Single Source of Truth，並由 Domain Model 驅動 UI (React) 與資料庫 Schema 的生成。
> * **實作規範**：列出 Repository Pattern 與 Dependency Injection 在 Next.js 19 中的實作標準。
