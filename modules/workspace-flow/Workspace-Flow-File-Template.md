## 1️⃣ 通用檔案頭模板

```ts
/**
 * @module <模組路徑>
 * @file <檔案名稱>
 * @description <檔案用途簡述>
 * @author <作者>
 * @created <YYYY-MM-DD>
 * @todo <未完成事項或提醒>
 */
```

* `<模組路徑>`: 如 `workspace-flow/domain/entities`
* `<檔案名稱>`: 如 `Task.ts`
* `<檔案用途簡述>`: 簡單一句話說明這個檔案做什麼
* `@todo` 可以先留空

---

## 2️⃣ Class / Interface 範例模板

```ts
/**
 * Task Entity
 * @class Task
 * @description 代表一個任務及其狀態與行為
 */
export class Task {
    /**
     * 建立 Task 實例
     * @param {string} title - 任務標題
     * @param {TaskStatus} status - 任務狀態
     */
    constructor(public title: string, public status: TaskStatus) {}
    
    /**
     * 標記任務為完成
     */
    complete() {
        // TODO: 實作
    }
}
```

---

## 3️⃣ Function / Use Case 範例模板

```ts
/**
 * 建立新的 Task
 * @param {CreateTaskDto} dto - 新任務資料
 * @returns {Promise<Task>} 新建立的任務
 */
export async function createTask(dto: CreateTaskDto): Promise<Task> {
    // TODO: 實作
}
```

> 建議先把 **函數頭也加上 JSDoc**，即便目前沒有實作。好處：
>
> 1. 方便生成 API 文件。
> 2. 讓團隊知道參數與回傳型別。
> 3. 開發中 IDE 可以即時提示。

---

## 4️⃣ Mermaid 檔案模板

```mermaid
%% ======================================================
%% File: Workspace-Flow-Tree.mermaid
%% Module: workspace-flow
%% Description: 工作區任務流程結構樹
%% Created: 2026-03-25
%% ======================================================
flowchart TD
    %% TODO: 建立節點
```

---
